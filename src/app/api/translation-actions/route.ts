import { NextResponse } from "next/server";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import { authorizeTranslationRequest } from "@/translation/auth";
import { getTranslationRecord, upsertTranslationRecord } from "@/translation/records";
import { parseTranslationResource } from "@/translation/request";
import { extractTranslationUnits, fieldsForResource, mergeCandidateIntoTarget, sourceHash } from "@/translation/schema";
import { queueTranslation } from "@/translation/service";
import { fetchTranslationDocument } from "@/translation/task";
import type { TranslationCandidate } from "@/translation/types";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const QUEUE_ACTIONS = new Set(["generate", "retry", "update"]);

function isCandidate(value: unknown): value is TranslationCandidate {
  return Boolean(value && typeof value === "object" && Array.isArray((value as TranslationCandidate).patches));
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
      action === "approve" ? (["publishContent"] as const) : (["manageContent", "manageSiteContent"] as const);
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

    if (action !== "approve") {
      return NextResponse.json({ error: "Unsupported translation action." }, { status: 400 });
    }

    const record = await getTranslationRecord(payload, resource);
    if (!record || record.status !== "needs_review" || !isCandidate(record.candidateData) || !record.sourceHash) {
      return NextResponse.json({ error: "No translation candidate is ready for approval." }, { status: 409 });
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
        candidateData: null,
        lastError: "Indonesian source changed after translation. Generate a new candidate.",
        status: "needs_update",
      });
      return NextResponse.json({ error: "Source changed; regenerate the English candidate." }, { status: 409 });
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
      return NextResponse.json({ error: "Translation candidate changed; reload before approval." }, { status: 409 });
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
