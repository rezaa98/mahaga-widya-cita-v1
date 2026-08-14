import type { Payload, PayloadRequest } from "payload";
import { extractTranslationUnits, fieldsForResource, sourceHash } from "./schema";
import { appendAuditEvent, appendCandidateRevision, getTranslationRecord, upsertTranslationRecord } from "./records";
import type { TranslationCandidate } from "./types";
import { fetchTranslationDocument } from "./task";
import { SOURCE_LOCALE, type TranslationJobInput, type TranslationResourceType } from "./types";

export function translationConcurrencyKey(resource: {
  identifier: string;
  resourceId?: string;
  resourceType: TranslationResourceType;
}) {
  return `translation:${resource.resourceType}:${resource.identifier}:${resource.resourceType === "global" ? "global" : resource.resourceId}:en`;
}

export async function releaseStaleTranslationJobs(
  payload: Payload,
  resource: { identifier: string; resourceId?: string; resourceType: TranslationResourceType },
) {
  const staleBefore = new Date(Date.now() - 5 * 60 * 1000).toISOString();
  const jobs = await payload.find({
    collection: "payload-jobs" as any,
    depth: 0,
    limit: 20,
    overrideAccess: true,
    where: {
      and: [
        { concurrencyKey: { equals: translationConcurrencyKey(resource) } },
        { processing: { equals: true } },
        { completedAt: { exists: false } },
        { updatedAt: { less_than: staleBefore } },
      ],
    },
  });

  for (const job of jobs.docs) {
    await payload.update({
      collection: "payload-jobs" as any,
      id: job.id,
      data: {
        error: { message: "Recovered an interrupted translation worker." },
        hasError: true,
        processing: false,
      },
      overrideAccess: true,
    });
  }

  return jobs.totalDocs;
}

export async function queueTranslation(
  payload: Payload,
  resource: { identifier: string; resourceId?: string; resourceType: TranslationResourceType },
  req?: PayloadRequest,
  options: { force?: boolean } = {},
) {
  const fields = fieldsForResource(payload, resource.resourceType, resource.identifier);
  const source = await fetchTranslationDocument(
    payload,
    resource.resourceType,
    resource.identifier,
    resource.resourceId,
    SOURCE_LOCALE,
  );
  const units = extractTranslationUnits(fields, source);
  if (!units.length) throw new Error("This resource has no populated localized text to translate.");

  const hash = sourceHash(units);
  const input: TranslationJobInput = { ...resource, sourceHash: hash };
  const existing = await getTranslationRecord(payload, resource);
  if (
    !options.force &&
    existing?.sourceHash === hash &&
    ["approved", "needs_review", "queued", "translating"].includes(existing.status)
  ) {
    return { hash, job: null, record: existing, skipped: true };
  }
  const record = await upsertTranslationRecord(payload, resource, {
    approvedAt: null,
    approvedBy: null,
    candidateData: null,
    candidateHistory:
      existing?.candidateData && typeof existing.candidateData === "object"
        ? appendCandidateRevision(existing, {
            candidate: existing.candidateData as TranslationCandidate,
            createdAt: existing.translatedAt || new Date().toISOString(),
            model: existing.model,
            sourceHash: existing.sourceHash,
          })
        : existing?.candidateHistory,
    generatedFields: [],
    lastError: null,
    reviewedFields: [],
    sourceHash: hash,
    sourceUpdatedAt: typeof source?.updatedAt === "string" ? source.updatedAt : new Date().toISOString(),
    status: "queued",
    auditLog: appendAuditEvent(existing, {
      action: "queued",
      actorId: req?.user?.id || null,
      at: new Date().toISOString(),
      details: { forced: options.force === true, sourceHash: hash },
    }),
  });
  try {
    const job = await (payload.jobs.queue as any)({
      input,
      overrideAccess: true,
      queue: "translations",
      req,
      task: "translate-resource",
    });
    return { hash, job, record, skipped: false };
  } catch (error) {
    await upsertTranslationRecord(payload, resource, {
      auditLog: appendAuditEvent(await getTranslationRecord(payload, resource), {
        action: "generation_failed",
        actorId: req?.user?.id || null,
        at: new Date().toISOString(),
      }),
      lastError: error instanceof Error ? error.message : "Unable to queue translation.",
      status: "failed",
    });
    throw error;
  }
}
