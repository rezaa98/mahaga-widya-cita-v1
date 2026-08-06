import type { Payload } from "payload";
import type {
  TranslationAuditEvent,
  TranslationCandidateRevision,
  TranslationJobInput,
  TranslationStatus,
} from "./types";
import { translationResourceKey } from "./types";

export type TranslationRecordData = {
  approvedAt?: null | string;
  approvedBy?: null | number | string;
  auditLog?: TranslationAuditEvent[];
  candidateData?: unknown;
  candidateHistory?: TranslationCandidateRevision[];
  generatedFields?: string[];
  id?: number | string;
  identifier: string;
  lastError?: null | string;
  manualLocks?: string[];
  metrics?: unknown;
  model?: null | string;
  provider?: null | string;
  resourceId?: null | string;
  resourceKey: string;
  resourceType: "collection" | "global";
  reviewedFields?: string[];
  sourceHash?: null | string;
  sourceUpdatedAt?: null | string;
  status: TranslationStatus;
  translatedAt?: null | string;
};

const recordsCollection = "translation-records" as any;

export async function getTranslationRecord(
  payload: Payload,
  resource: Pick<TranslationJobInput, "identifier" | "resourceId" | "resourceType">,
): Promise<TranslationRecordData | null> {
  const result = await payload.find({
    collection: recordsCollection,
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: { resourceKey: { equals: translationResourceKey(resource) } },
  });
  return (result.docs[0] as unknown as TranslationRecordData | undefined) || null;
}

const HISTORY_LIMIT = 10;
const AUDIT_LIMIT = 100;

export function appendAuditEvent(
  record: TranslationRecordData | null,
  event: TranslationAuditEvent,
): TranslationAuditEvent[] {
  return [...(Array.isArray(record?.auditLog) ? record.auditLog : []), event].slice(-AUDIT_LIMIT);
}

export function appendCandidateRevision(
  record: TranslationRecordData | null,
  revision: TranslationCandidateRevision,
): TranslationCandidateRevision[] {
  return [...(Array.isArray(record?.candidateHistory) ? record.candidateHistory : []), revision].slice(-HISTORY_LIMIT);
}

export async function upsertTranslationRecord(
  payload: Payload,
  resource: Pick<TranslationJobInput, "identifier" | "resourceId" | "resourceType">,
  data: Partial<TranslationRecordData>,
): Promise<TranslationRecordData> {
  const existing = await getTranslationRecord(payload, resource);
  const resourceKey = translationResourceKey(resource);
  if (existing?.id) {
    return (await payload.update({
      collection: recordsCollection,
      id: existing.id,
      data,
      overrideAccess: true,
    })) as unknown as TranslationRecordData;
  }

  try {
    return (await payload.create({
      collection: recordsCollection,
      data: {
        identifier: resource.identifier,
        auditLog: [],
        candidateHistory: [],
        manualLocks: [],
        reviewedFields: [],
        resourceId: resource.resourceId,
        resourceKey,
        resourceType: resource.resourceType,
        status: "not_generated",
        targetLocale: "en",
        ...data,
      },
      overrideAccess: true,
    })) as unknown as TranslationRecordData;
  } catch (error) {
    // Two near-simultaneous saves may both observe no record. The unique key
    // resolves ownership; the loser retries as an update instead of failing
    // the content save.
    const raced = await getTranslationRecord(payload, resource);
    if (!raced?.id) throw error;
    return (await payload.update({
      collection: recordsCollection,
      id: raced.id,
      data,
      overrideAccess: true,
    })) as unknown as TranslationRecordData;
  }
}

export async function updateRecordIfCurrentHash(
  payload: Payload,
  input: TranslationJobInput,
  data: Partial<TranslationRecordData>,
): Promise<TranslationRecordData | null> {
  const record = await getTranslationRecord(payload, input);
  if (!record || record.sourceHash !== input.sourceHash) return record;
  return upsertTranslationRecord(payload, input, data);
}
