import { NextResponse } from "next/server";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import { authorizeTranslationRequest } from "@/translation/auth";
import { getTranslationRecord } from "@/translation/records";
import { parseTranslationResource } from "@/translation/request";
import { extractTranslationUnits, fieldsForResource } from "@/translation/schema";
import { fetchTranslationDocument } from "@/translation/task";
import type { TranslationCandidate } from "@/translation/types";
import { hasCapability } from "@/utils/access";

export const dynamic = "force-dynamic";

function lexicalText(value: unknown): string[] {
  if (Array.isArray(value)) return value.flatMap(lexicalText);
  if (!value || typeof value !== "object") return [];
  return Object.entries(value as Record<string, unknown>).flatMap(([key, child]) =>
    key === "text" && typeof child === "string" ? [child] : lexicalText(child),
  );
}

function candidatePreview(candidate: unknown, sourceValues: Map<string, string[]>) {
  if (!candidate || typeof candidate !== "object" || !Array.isArray((candidate as TranslationCandidate).patches)) {
    return { items: [], total: 0 };
  }
  const grouped = new Map<string, string[]>();
  for (const patch of (candidate as TranslationCandidate).patches) {
    const values = typeof patch.value === "string" ? [patch.value] : lexicalText(patch.value);
    grouped.set(patch.fieldPath, [...(grouped.get(patch.fieldPath) || []), ...values]);
  }
  return {
    items: [...grouped.entries()].slice(0, 12).map(([field, translated]) => ({
      field,
      source: (sourceValues.get(field) || []).join(" · ").slice(0, 480),
      translated: translated.join(" · ").slice(0, 480),
    })),
    total: grouped.size,
  };
}

export async function GET(req: Request) {
  const payload = await getPayload({ config: configPromise });
  const auth = await authorizeTranslationRequest(payload, req);
  if (auth.error) return auth.error;

  try {
    const url = new URL(req.url);
    const resource = parseTranslationResource({
      id: url.searchParams.get("id"),
      identifier: url.searchParams.get("identifier"),
      isGlobal: url.searchParams.get("isGlobal"),
      resourceType: url.searchParams.get("resourceType"),
      slug: url.searchParams.get("slug"),
    });
    const record = await getTranslationRecord(payload, resource);
    const generatedFields = Array.isArray(record?.generatedFields) ? record.generatedFields : [];
    const manualLocks = Array.isArray(record?.manualLocks) ? record.manualLocks : [];
    let preview: ReturnType<typeof candidatePreview> = { items: [], total: 0 };
    if (record?.candidateData) {
      const fields = fieldsForResource(payload, resource.resourceType, resource.identifier);
      const source = await fetchTranslationDocument(
        payload,
        resource.resourceType,
        resource.identifier,
        resource.resourceId,
        "id",
      );
      const sourceValues = new Map<string, string[]>();
      for (const unit of extractTranslationUnits(fields, source)) {
        sourceValues.set(unit.fieldPath, [...(sourceValues.get(unit.fieldPath) || []), unit.value]);
      }
      preview = candidatePreview(record.candidateData, sourceValues);
    }

    return NextResponse.json({
      approvedAt: record?.approvedAt || null,
      canApprove: hasCapability(auth.user, "publishContent"),
      candidateSummary: record?.candidateData
        ? { fields: generatedFields, lockedFields: manualLocks, totalFields: generatedFields.length }
        : null,
      error: record?.lastError || null,
      generatedFields,
      lastError: record?.lastError || null,
      lastTranslatedAt: record?.translatedAt || null,
      manualLocks,
      model: record?.model || null,
      progress: { completed: generatedFields.length, total: generatedFields.length },
      preview: preview.items,
      previewTotal: preview.total,
      provider: record?.provider || null,
      sourceHash: record?.sourceHash || null,
      sourceUpdatedAt: record?.sourceUpdatedAt || null,
      status: record?.status || "not_generated",
      translatedAt: record?.translatedAt || null,
      translationStatus: record?.status || "not_generated",
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid request." }, { status: 400 });
  }
}
