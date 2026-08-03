export const SOURCE_LOCALE = "id" as const;
export const TARGET_LOCALE = "en" as const;

export const TRANSLATABLE_COLLECTIONS = [
  "articles",
  "journals",
  "categories",
  "services",
  "team-members",
  "policy-reviews",
] as const;

export const TRANSLATABLE_GLOBALS = ["beranda", "tentang-kami", "kontak", "footer", "navbar"] as const;

export type TranslationResourceType = "collection" | "global";
export type TranslationStatus =
  "not_generated" | "queued" | "translating" | "needs_update" | "needs_review" | "approved" | "failed";

export type TranslationJobInput = {
  identifier: string;
  resourceId?: string;
  resourceType: TranslationResourceType;
  sourceHash: string;
};

export type TranslationPatch = {
  fieldPath: string;
  path: Array<number | string>;
  value: unknown;
};

export type TranslationCandidate = {
  patches: TranslationPatch[];
};

export function isAllowedResource(resourceType: TranslationResourceType, identifier: string): boolean {
  const allowed = resourceType === "global" ? TRANSLATABLE_GLOBALS : TRANSLATABLE_COLLECTIONS;
  return (allowed as readonly string[]).includes(identifier);
}

export function translationResourceKey({
  identifier,
  resourceId,
  resourceType,
}: Pick<TranslationJobInput, "identifier" | "resourceId" | "resourceType">): string {
  const id = resourceType === "global" ? "global" : resourceId;
  if (!id) throw new Error("A collection translation requires a document id.");
  return `${resourceType}:${identifier}:${id}:${TARGET_LOCALE}`;
}
