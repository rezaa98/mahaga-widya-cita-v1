import type { Payload, PayloadRequest } from "payload";
import { extractTranslationUnits, fieldsForResource, sourceHash } from "./schema";
import { getTranslationRecord, upsertTranslationRecord } from "./records";
import { fetchTranslationDocument } from "./task";
import { SOURCE_LOCALE, type TranslationJobInput, type TranslationResourceType } from "./types";

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
    generatedFields: [],
    lastError: null,
    sourceHash: hash,
    sourceUpdatedAt: typeof source?.updatedAt === "string" ? source.updatedAt : new Date().toISOString(),
    status: "queued",
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
      lastError: error instanceof Error ? error.message : "Unable to queue translation.",
      status: "failed",
    });
    throw error;
  }
}
