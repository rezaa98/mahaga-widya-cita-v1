export const CORPORATE_SERVICE_SLUGS = [
  "research-strategic-studies",
  "technology-digital-solutions",
  "tax-financial-advisory",
  "workforce-solutions",
  "business-investment-advisory",
  "property-management-investment",
] as const;

const serviceOrder = new Map(CORPORATE_SERVICE_SLUGS.map((slug, index) => [slug, index]));

// Historical entries remain readable by their direct URL, but must not reappear
// in public service discovery. Newly created services are included automatically.
const RETIRED_SERVICE_SLUGS = new Set(["government-consulting"]);

export function selectCorporateServices<
  T extends { slug?: string | null; active?: boolean | null; sortOrder?: number | null },
>(services: T[]): T[] {
  return services
    .filter((service) => service.slug && service.active !== false && !RETIRED_SERVICE_SLUGS.has(service.slug))
    .sort((left, right) => {
      const explicitOrder = (left.sortOrder ?? Number.MAX_SAFE_INTEGER) - (right.sortOrder ?? Number.MAX_SAFE_INTEGER);
      if (explicitOrder !== 0) return explicitOrder;
      const leftOrder = serviceOrder.get(left.slug as (typeof CORPORATE_SERVICE_SLUGS)[number]);
      const rightOrder = serviceOrder.get(right.slug as (typeof CORPORATE_SERVICE_SLUGS)[number]);
      if (leftOrder !== undefined || rightOrder !== undefined) {
        return (leftOrder ?? Number.MAX_SAFE_INTEGER) - (rightOrder ?? Number.MAX_SAFE_INTEGER);
      }
      return String(left.slug).localeCompare(String(right.slug));
    });
}
