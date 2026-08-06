import type { CollectionAfterChangeHook, Field, GlobalAfterChangeHook, PayloadRequest } from "payload";
import { changedLocalizedFields, extractTranslationUnits } from "@/translation/schema";
import { appendAuditEvent, getTranslationRecord, upsertTranslationRecord } from "@/translation/records";
import { queueTranslation } from "@/translation/service";
import type { TranslationCandidate } from "@/translation/types";

function requestLocale(req: PayloadRequest): string {
  return typeof req.locale === "string" ? req.locale : "id";
}

function isAutosave(req: PayloadRequest): boolean {
  const request = req as any;
  const autosave = request.query?.autosave ?? request.searchParams?.get?.("autosave");
  return (
    autosave === true ||
    autosave === "true" ||
    (typeof request.url === "string" && request.url.includes("autosave=true"))
  );
}

async function recordManualEnglishChanges({
  doc,
  fields,
  identifier,
  previousDoc,
  req,
  resourceId,
  resourceType,
}: {
  doc: any;
  fields: Field[];
  identifier: string;
  previousDoc: any;
  req: PayloadRequest;
  resourceId?: string;
  resourceType: "collection" | "global";
}) {
  const changed = changedLocalizedFields(
    extractTranslationUnits(fields, previousDoc || {}),
    extractTranslationUnits(fields, doc || {}),
  );
  if (!changed.length) return;

  const resource = { identifier, resourceId, resourceType } as const;
  const record = await getTranslationRecord(req.payload, resource);
  const candidate = record?.candidateData as TranslationCandidate | undefined;
  const candidateData = Array.isArray(candidate?.patches)
    ? { patches: candidate.patches.filter((patch) => !changed.includes(patch.fieldPath)) }
    : record?.candidateData;
  await upsertTranslationRecord(req.payload, resource, {
    auditLog: appendAuditEvent(record, {
      action: "candidate_edited",
      actorId: req.user?.id || null,
      at: new Date().toISOString(),
      details: { fields: changed, mode: "editor" },
    }),
    candidateData,
    generatedFields: (record?.generatedFields || []).filter((field) => !changed.includes(field)),
    manualLocks: [...new Set([...(record?.manualLocks || []), ...changed])],
    reviewedFields: [...new Set([...(record?.reviewedFields || []), ...changed])],
  });
}

async function handleTranslationSave(args: {
  doc: any;
  fields: Field[];
  identifier: string;
  previousDoc: any;
  req: PayloadRequest;
  resourceId?: string;
  resourceType: "collection" | "global";
}) {
  if (args.req.context?.skipAutoTranslate) return;

  if (requestLocale(args.req) === "en") {
    await recordManualEnglishChanges(args);
    return;
  }
  if (requestLocale(args.req) !== "id") return;
  if (isAutosave(args.req)) return;

  // A resource can carry the shared hook while its current locale contains no
  // translatable value yet. Saving it must remain successful and must not
  // create a permanently failing queue item.
  if (!extractTranslationUnits(args.fields, args.doc || {}).length) return;

  const resource = {
    identifier: args.identifier,
    resourceId: args.resourceId,
    resourceType: args.resourceType,
  } as const;
  try {
    await queueTranslation(args.req.payload, resource, args.req);
  } catch (error) {
    // The content save already succeeded. Surface queue failures through the
    // persistent record instead of turning a successful editorial save into a
    // misleading HTTP error.
    await upsertTranslationRecord(args.req.payload, resource, {
      lastError: error instanceof Error ? error.message : "Unable to queue translation.",
      status: "failed",
    });
    args.req.payload.logger.error({ err: error, msg: `Unable to queue translation for ${args.identifier}` });
  }
}

export const universalCollectionAutoTranslate: CollectionAfterChangeHook = async ({
  collection,
  doc,
  previousDoc,
  req,
}) => {
  await handleTranslationSave({
    doc,
    fields: collection.fields,
    identifier: collection.slug,
    previousDoc,
    req,
    resourceId: String(doc.id),
    resourceType: "collection",
  });
  return doc;
};

export const universalGlobalAutoTranslate: GlobalAfterChangeHook = async ({ doc, global, previousDoc, req }) => {
  await handleTranslationSave({
    doc,
    fields: global.fields,
    identifier: global.slug,
    previousDoc,
    req,
    resourceType: "global",
  });
  return doc;
};
