import type { Payload, TaskConfig } from "payload";
import { translateStrings } from "@/utils/translate";
import { createCandidate, extractTranslationUnits, fieldsForResource, sourceHash } from "./schema";
import { appendAuditEvent, appendCandidateRevision, getTranslationRecord, updateRecordIfCurrentHash } from "./records";
import { isAllowedResource, SOURCE_LOCALE, type TranslationJobInput, type TranslationResourceType } from "./types";

type TranslationTaskIO = {
  input: TranslationJobInput;
  output: { generatedFields: number; sourceHash: string; stale?: boolean };
};

export async function fetchTranslationDocument(
  payload: Payload,
  resourceType: TranslationResourceType,
  identifier: string,
  resourceId: string | undefined,
  locale: "en" | "id",
): Promise<any> {
  if (resourceType === "global") {
    return payload.findGlobal({
      slug: identifier as any,
      depth: 0,
      draft: true,
      fallbackLocale: "none" as any,
      locale,
      overrideAccess: true,
    });
  }
  if (!resourceId) throw new Error("A document id is required for collection translation.");
  return payload.findByID({
    collection: identifier as any,
    id: resourceId,
    depth: 0,
    draft: true,
    fallbackLocale: "none" as any,
    locale,
    overrideAccess: true,
  });
}

function validateJobInput(input: TranslationJobInput): void {
  if (input.resourceType !== "collection" && input.resourceType !== "global") {
    throw new Error("Invalid translation resource type.");
  }
  if (!isAllowedResource(input.resourceType, input.identifier)) {
    throw new Error("This resource is not enabled for translation.");
  }
  if (input.resourceType === "collection" && !input.resourceId) {
    throw new Error("A collection translation requires a document id.");
  }
  if (!/^[a-f0-9]{64}$/.test(input.sourceHash)) throw new Error("Invalid source hash.");
}

export const translateResourceTask: TaskConfig<TranslationTaskIO> = {
  slug: "translate-resource",
  label: "Translate Indonesian content to English",
  inputSchema: [
    { name: "resourceType", type: "select", required: true, options: ["collection", "global"] },
    { name: "identifier", type: "text", required: true },
    { name: "resourceId", type: "text" },
    { name: "sourceHash", type: "text", required: true },
  ],
  outputSchema: [
    { name: "generatedFields", type: "number", required: true },
    { name: "sourceHash", type: "text", required: true },
    { name: "stale", type: "checkbox" },
  ],
  concurrency: {
    exclusive: true,
    supersedes: true,
    key: ({ input }) =>
      `translation:${input.resourceType}:${input.identifier}:${input.resourceType === "global" ? "global" : input.resourceId}:en`,
  },
  retries: {
    attempts: 2,
    backoff: { delay: 2_000, type: "exponential" },
    shouldRestore: false,
  },
  handler: async ({ input, req }) => {
    validateJobInput(input);
    const payload = req.payload;
    const fields = fieldsForResource(payload, input.resourceType, input.identifier);

    await updateRecordIfCurrentHash(payload, input, { lastError: null, status: "translating" });

    const source = await fetchTranslationDocument(
      payload,
      input.resourceType,
      input.identifier,
      input.resourceId,
      SOURCE_LOCALE,
    );
    const allUnits = extractTranslationUnits(fields, source);
    const currentHash = sourceHash(allUnits);
    if (currentHash !== input.sourceHash) {
      const currentRecord = await getTranslationRecord(payload, input);
      await updateRecordIfCurrentHash(payload, input, {
        auditLog: appendAuditEvent(currentRecord, {
          action: "source_changed",
          at: new Date().toISOString(),
          details: { stage: "before_generation" },
        }),
        status: "needs_update",
      });
      return { output: { generatedFields: 0, sourceHash: currentHash, stale: true } };
    }

    const record = await getTranslationRecord(payload, input);
    const locks = new Set(Array.isArray(record?.manualLocks) ? record.manualLocks : []);
    const units = allUnits.filter((unit) => !locks.has(unit.fieldPath));
    const result = await translateStrings(
      units.map((unit) => unit.value),
      {
        context: `${input.resourceType} ${input.identifier}. Preserve the formal corporate editorial tone of Mahaga Widya Cita.`,
        sourceLanguage: "Indonesian",
        targetLanguage: "English",
      },
    );
    // Translation can take long enough for the Indonesian source to change.
    // Never publish or even stage output derived from an obsolete revision.
    const latestSource = await fetchTranslationDocument(
      payload,
      input.resourceType,
      input.identifier,
      input.resourceId,
      SOURCE_LOCALE,
    );
    const latestHash = sourceHash(extractTranslationUnits(fields, latestSource));
    if (latestHash !== input.sourceHash) {
      const currentRecord = await getTranslationRecord(payload, input);
      await updateRecordIfCurrentHash(payload, input, {
        auditLog: appendAuditEvent(currentRecord, {
          action: "source_changed",
          at: new Date().toISOString(),
          details: { stage: "after_generation" },
        }),
        status: "needs_update",
      });
      return { output: { generatedFields: 0, sourceHash: latestHash, stale: true } };
    }

    const latestRecord = await getTranslationRecord(payload, input);
    const latestLocks = new Set(Array.isArray(latestRecord?.manualLocks) ? latestRecord.manualLocks : []);
    const unlockedUnits = units.filter((unit) => !latestLocks.has(unit.fieldPath));
    const unlockedTranslations = result.translations.filter((_, index) => !latestLocks.has(units[index].fieldPath));
    const candidateData = createCandidate(source, unlockedUnits, unlockedTranslations);
    const generatedFields = [...new Set(unlockedUnits.map((unit) => unit.fieldPath))];
    await updateRecordIfCurrentHash(payload, input, {
      auditLog: appendAuditEvent(latestRecord, {
        action: "generated",
        at: new Date().toISOString(),
        details: { fields: generatedFields.length, model: result.model },
      }),
      candidateData,
      candidateHistory: latestRecord?.candidateData
        ? appendCandidateRevision(latestRecord, {
            candidate: latestRecord.candidateData as any,
            createdAt: latestRecord.translatedAt || new Date().toISOString(),
            model: latestRecord.model,
            sourceHash: latestRecord.sourceHash,
          })
        : latestRecord?.candidateHistory,
      generatedFields,
      lastError: null,
      metrics: result.metrics,
      model: result.model,
      provider: result.provider,
      reviewedFields: [],
      status: "needs_review",
      translatedAt: new Date().toISOString(),
    });

    return { output: { generatedFields: generatedFields.length, sourceHash: input.sourceHash } };
  },
  onFail: async ({ input, job, req }) => {
    const jobInput = input as TranslationJobInput | undefined;
    if (!jobInput) return;
    const jobError = job.error;
    const message =
      jobError instanceof Error
        ? jobError.message
        : typeof jobError === "string"
          ? jobError
          : "Translation job failed.";
    await updateRecordIfCurrentHash(req.payload, jobInput, { lastError: message, status: "failed" });
  },
};
