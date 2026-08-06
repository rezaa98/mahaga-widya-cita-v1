import { NextResponse } from "next/server";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import { authorizeTranslationRequest } from "@/translation/auth";
import {
  appendAuditEvent,
  appendCandidateRevision,
  getTranslationRecord,
  upsertTranslationRecord,
} from "@/translation/records";
import { parseTranslationResource } from "@/translation/request";
import { extractTranslationUnits, fieldsForResource, mergeCandidateIntoTarget, sourceHash } from "@/translation/schema";
import { queueTranslation } from "@/translation/service";
import { fetchTranslationDocument } from "@/translation/task";
import type { TranslationCandidate } from "@/translation/types";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const QUEUE_ACTIONS = new Set(["generate", "retry", "update"]);
const REVIEW_TTL_HOURS = Math.max(1, Number(process.env.TRANSLATION_REVIEW_TTL_HOURS || 72));

function isCandidate(value: unknown): value is TranslationCandidate {
  return Boolean(value && typeof value === "object" && Array.isArray((value as TranslationCandidate).patches));
}

function actionError(code: string, message: string, status: number, workflowStatus?: string) {
  return NextResponse.json({ code, error: message, status: workflowStatus }, { status });
}

function candidateExpired(translatedAt?: null | string) {
  if (!translatedAt) return false;
  return Date.now() - new Date(translatedAt).getTime() > REVIEW_TTL_HOURS * 60 * 60 * 1000;
}

export async function POST(req: Request) {
  const payload = await getPayload({ config: configPromise });
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  try {
    const action = String(body.action || "");
    const resource = parseTranslationResource(body);
    const requiredCapabilities =
      action === "approve"
        ? (["publishContent"] as const)
        : action === "review"
          ? (["reviewContent", "publishContent"] as const)
          : (["manageContent", "manageSiteContent"] as const);
    const auth = await authorizeTranslationRequest(payload, req, [...requiredCapabilities]);
    if (auth.error) return auth.error;

    if (QUEUE_ACTIONS.has(action)) {
      const { job } = await queueTranslation(payload, resource, undefined, { force: action === "retry" });
      // Explicit editor actions should feel immediate. The durable queued job
      // remains recoverable if the request/function is interrupted.
      if (job) await payload.jobs.runByID({ id: job.id, overrideAccess: true });
      const record = await getTranslationRecord(payload, resource);
      return NextResponse.json({ data: record, status: record?.status || "queued", success: true });
    }

    if (action === "review") {
      const record = await getTranslationRecord(payload, resource);
      if (!record || record.status !== "needs_review" || !isCandidate(record.candidateData)) {
        return actionError("CANDIDATE_MISSING", "No translation candidate is ready for review.", 409, record?.status);
      }
      if (candidateExpired(record.translatedAt)) {
        const expired = await upsertTranslationRecord(payload, resource, {
          auditLog: appendAuditEvent(record, {
            action: "source_changed",
            actorId: auth.user?.id || null,
            at: new Date().toISOString(),
            details: { reason: "candidate_expired" },
          }),
          lastError: "AI draft expired before review. Generate a fresh candidate.",
          status: "needs_update",
        });
        return actionError(
          "CANDIDATE_EXPIRED",
          "This AI draft has expired. Generate a fresh candidate.",
          409,
          expired.status,
        );
      }
      const field = typeof body.field === "string" ? body.field : "";
      if (!field || !record.generatedFields?.includes(field)) {
        return actionError("INVALID_FIELD", "This field is not part of the current candidate.", 400, record.status);
      }
      let candidateData = record.candidateData;
      const patch = candidateData.patches.find((item) => item.fieldPath === field);
      if (typeof body.translated === "string") {
        if (!body.translated.trim() || body.translated.length > 50_000) {
          return actionError(
            "INVALID_CANDIDATE",
            "Candidate text must contain 1–50,000 characters.",
            400,
            record.status,
          );
        }
        if (!patch || typeof patch.value !== "string") {
          return actionError(
            "FIELD_NOT_INLINE_EDITABLE",
            "Review this rich-text field in the content editor.",
            409,
            record.status,
          );
        }
        candidateData = {
          patches: candidateData.patches.map((item) =>
            item.fieldPath === field ? { ...item, value: body.translated.trim() } : item,
          ),
        };
      }
      const reviewed = new Set(record.reviewedFields || []);
      body.reviewed === false ? reviewed.delete(field) : reviewed.add(field);
      const updated = await upsertTranslationRecord(payload, resource, {
        auditLog: appendAuditEvent(record, {
          action: typeof body.translated === "string" ? "candidate_edited" : "field_reviewed",
          actorId: auth.user?.id || null,
          at: new Date().toISOString(),
          details: { field },
        }),
        candidateData,
        candidateHistory:
          typeof body.translated === "string"
            ? appendCandidateRevision(record, {
                candidate: record.candidateData,
                createdAt: new Date().toISOString(),
                model: record.model,
                sourceHash: record.sourceHash,
              })
            : record.candidateHistory,
        reviewedFields: [...reviewed],
      });
      return NextResponse.json({ data: updated, status: updated.status, success: true });
    }

    if (action !== "approve") {
      return NextResponse.json({ error: "Unsupported translation action." }, { status: 400 });
    }

    const record = await getTranslationRecord(payload, resource);
    if (!record || record.status !== "needs_review" || !isCandidate(record.candidateData) || !record.sourceHash) {
      return actionError("CANDIDATE_MISSING", "No translation candidate is ready for approval.", 409, record?.status);
    }

    if (candidateExpired(record.translatedAt)) {
      const expired = await upsertTranslationRecord(payload, resource, {
        auditLog: appendAuditEvent(record, {
          action: "source_changed",
          actorId: auth.user?.id || null,
          at: new Date().toISOString(),
          details: { reason: "candidate_expired" },
        }),
        lastError: "AI draft expired before approval. Generate a fresh candidate.",
        status: "needs_update",
      });
      return actionError(
        "CANDIDATE_EXPIRED",
        "This AI draft has expired. Generate a fresh candidate.",
        409,
        expired.status,
      );
    }

    const unreviewed = (record.generatedFields || []).filter((field) => !(record.reviewedFields || []).includes(field));
    if (unreviewed.length) {
      return NextResponse.json(
        {
          code: "REVIEW_INCOMPLETE",
          error: "Review every generated field before approval.",
          fields: unreviewed,
          status: record.status,
        },
        { status: 409 },
      );
    }

    const fields = fieldsForResource(payload, resource.resourceType, resource.identifier);
    const source = await fetchTranslationDocument(
      payload,
      resource.resourceType,
      resource.identifier,
      resource.resourceId,
      "id",
    );
    const latestHash = sourceHash(extractTranslationUnits(fields, source));
    if (latestHash !== record.sourceHash) {
      await upsertTranslationRecord(payload, resource, {
        auditLog: appendAuditEvent(record, {
          action: "source_changed",
          actorId: auth.user?.id || null,
          at: new Date().toISOString(),
          details: { reason: "source_hash_mismatch" },
        }),
        lastError: "Indonesian source changed after translation. Generate a new candidate.",
        status: "needs_update",
      });
      return actionError("SOURCE_CHANGED", "Source changed; regenerate the English candidate.", 409, "needs_update");
    }

    // Re-read immediately before applying the candidate. Manual EN edits can
    // add locks while a model job or review screen is open.
    const latestRecord = await getTranslationRecord(payload, resource);
    if (
      !latestRecord ||
      latestRecord.sourceHash !== record.sourceHash ||
      latestRecord.status !== "needs_review" ||
      !isCandidate(latestRecord.candidateData)
    ) {
      return actionError(
        "CANDIDATE_CHANGED",
        "Translation candidate changed; reload before approval.",
        409,
        latestRecord?.status,
      );
    }
    const locks = new Set(Array.isArray(latestRecord.manualLocks) ? latestRecord.manualLocks : []);
    const unlockedCandidate: TranslationCandidate = {
      patches: latestRecord.candidateData.patches.filter((patch) => !locks.has(patch.fieldPath)),
    };

    const target = await fetchTranslationDocument(
      payload,
      resource.resourceType,
      resource.identifier,
      resource.resourceId,
      "en",
    );
    const data = mergeCandidateIntoTarget(target, unlockedCandidate);
    if (resource.resourceType === "global") {
      await payload.updateGlobal({
        slug: resource.identifier as any,
        context: { skipAutoTranslate: true },
        data,
        locale: "en",
        overrideAccess: true,
      });
    } else {
      await payload.update({
        collection: resource.identifier as any,
        id: resource.resourceId!,
        context: { skipAutoTranslate: true },
        data,
        // Translation approval must not accidentally publish an Indonesian
        // document that is still in editorial draft state.
        draft: source?._status === "draft",
        locale: "en",
        overrideAccess: true,
      });
    }

    const approved = await upsertTranslationRecord(payload, resource, {
      approvedAt: new Date().toISOString(),
      approvedBy: auth.user?.id || null,
      auditLog: appendAuditEvent(latestRecord, {
        action: "approved",
        actorId: auth.user?.id || null,
        at: new Date().toISOString(),
      }),
      candidateHistory: appendCandidateRevision(latestRecord, {
        candidate: latestRecord.candidateData,
        createdAt: latestRecord.translatedAt || new Date().toISOString(),
        model: latestRecord.model,
        sourceHash: latestRecord.sourceHash,
      }),
      candidateData: null,
      lastError: null,
      status: "approved",
    });
    return NextResponse.json({ data: approved, status: approved.status, success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Translation action failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
