import { isAllowedResource, type TranslationResourceType } from "./types";

export function parseTranslationResource(input: {
  id?: unknown;
  identifier?: unknown;
  isGlobal?: unknown;
  resourceType?: unknown;
  slug?: unknown;
}) {
  const identifier = String(input.identifier || input.slug || "");
  const resourceType: TranslationResourceType =
    input.resourceType === "global" || input.isGlobal === true || input.isGlobal === "1" || input.isGlobal === "true"
      ? "global"
      : "collection";
  const resourceId = resourceType === "collection" && input.id != null ? String(input.id) : undefined;

  if (!/^[a-z0-9-]+$/.test(identifier) || !isAllowedResource(resourceType, identifier)) {
    throw new Error("Invalid or unsupported translation resource.");
  }
  if (resourceType === "collection" && (!resourceId || resourceId.length > 128)) {
    throw new Error("A valid collection document id is required.");
  }
  return { identifier, resourceId, resourceType };
}
