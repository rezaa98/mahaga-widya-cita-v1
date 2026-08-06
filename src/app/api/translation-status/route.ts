import { NextResponse } from "next/server";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import { authorizeTranslationRequest } from "@/translation/auth";
import { getTranslationRecord } from "@/translation/records";
import { parseTranslationResource } from "@/translation/request";
import { extractTranslationUnits, fieldsForResource, sourceHash } from "@/translation/schema";
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
  const grouped = new Map<string, { editable: boolean; values: string[] }>();
  for (const patch of (candidate as TranslationCandidate).patches) {
    const values = typeof patch.value === "string" ? [patch.value] : lexicalText(patch.value);
    const previous = grouped.get(patch.fieldPath);
    grouped.set(patch.fieldPath, {
      editable: !previous && typeof patch.value === "string",
      values: [...(previous?.values || []), ...values],
    });
  }
  return {
    items: [...grouped.entries()].slice(0, 12).map(([field, candidateValue]) => {
      const source = (sourceValues.get(field) || []).join(" · ").slice(0, 480);
      const translated = candidateValue.values.join(" · ").slice(0, 480);
      const normalizedSource = source.toLocaleLowerCase().trim();
      const normalizedTarget = translated.toLocaleLowerCase().trim();
      const issues: string[] = [];
      const indonesianSignals = (
        normalizedSource.match(/\b(yang|dan|dengan|untuk|dari|pada|adalah|serta|dalam)\b/g) || []
      ).length;
      const englishSignals = (normalizedSource.match(/\b(the|and|with|for|from|to|of|is|are|in)\b/g) || []).length;
      if (normalizedSource.length > 40 && englishSignals > indonesianSignals + 1) issues.push("source_may_be_english");
      if (normalizedSource.length > 20 && normalizedSource === normalizedTarget) issues.push("unchanged_from_source");
      if (normalizedSource.length > 40 && normalizedTarget.length < normalizedSource.length * 0.35)
        issues.push("candidate_too_short");
      if (!normalizedTarget) issues.push("candidate_empty");
      return { editable: candidateValue.editable, field, issues, source, translated };
    }),
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
    const reviewedFields = Array.isArray(record?.reviewedFields) ? record.reviewedFields : [];
    const sourceDocument = await fetchTranslationDocument(
      payload,
      resource.resourceType,
      resource.identifier,
      resource.resourceId,
      "id",
    );
    const fields = fieldsForResource(payload, resource.resourceType, resource.identifier);
    const currentSourceHash = sourceHash(extractTranslationUnits(fields, sourceDocument));
    const expiresAt = record?.translatedAt
      ? new Date(
          new Date(record.translatedAt).getTime() +
            Math.max(1, Number(process.env.TRANSLATION_REVIEW_TTL_HOURS || 72)) * 60 * 60 * 1000,
        )
      : null;
    const sourceChanged = Boolean(record?.sourceHash && currentSourceHash !== record.sourceHash);
    const expired = Boolean(expiresAt && expiresAt.getTime() < Date.now());
    const effectiveStatus =
      record?.status === "needs_review" && (sourceChanged || expired)
        ? "needs_update"
        : record?.status || "not_generated";
    let preview: ReturnType<typeof candidatePreview> = { items: [], total: 0 };
    if (record?.candidateData) {
      const sourceValues = new Map<string, string[]>();
      for (const unit of extractTranslationUnits(fields, sourceDocument)) {
        sourceValues.set(unit.fieldPath, [...(sourceValues.get(unit.fieldPath) || []), unit.value]);
      }
      preview = candidatePreview(record.candidateData, sourceValues);
    }

    return NextResponse.json({
      approvedAt: record?.approvedAt || null,
      auditLog: Array.isArray(record?.auditLog) ? record.auditLog.slice(-20).reverse() : [],
      canApprove: hasCapability(auth.user, "publishContent"),
      canReview: hasCapability(auth.user, "reviewContent") || hasCapability(auth.user, "publishContent"),
      candidateSummary: record?.candidateData
        ? { fields: generatedFields, lockedFields: manualLocks, totalFields: generatedFields.length }
        : null,
      error:
        sourceChanged && record?.status === "needs_review"
          ? "Indonesian source changed after this draft was generated."
          : expired && record?.status === "needs_review"
            ? "AI draft expired before review. Generate a fresh candidate."
            : record?.lastError || null,
      generatedFields,
      lastError: record?.lastError || null,
      lastTranslatedAt: record?.translatedAt || null,
      manualLocks,
      model: record?.model || null,
      progress: { completed: generatedFields.length, total: generatedFields.length },
      preview: preview.items,
      previewTotal: preview.total,
      review: {
        completed: generatedFields.filter((field) => reviewedFields.includes(field)).length,
        fields: reviewedFields,
        total: generatedFields.length,
      },
      reviewExpiresAt: expiresAt?.toISOString() || null,
      provider: record?.provider || null,
      publicationStatus:
        resource.resourceType === "global"
          ? "live_on_save"
          : sourceDocument?._status === "draft"
            ? "draft"
            : "published",
      sourceHash: record?.sourceHash || null,
      sourceUpdatedAt: record?.sourceUpdatedAt || null,
      status: effectiveStatus,
      translatedAt: record?.translatedAt || null,
      translationStatus: effectiveStatus,
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid request." }, { status: 400 });
  }
}
