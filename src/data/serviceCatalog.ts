export const CORPORATE_SERVICE_SLUGS = [
  "workforce-solutions",
  "technology-digital-solutions",
  "human-capital-development",
  "research-strategic-studies",
  "tax-financial-advisory",
  "business-investment-advisory",
] as const;

const serviceOrder = new Map(CORPORATE_SERVICE_SLUGS.map((slug, index) => [slug, index]));

// Historical entries remain readable by their direct URL, but must not reappear
// in public service discovery. Newly created services are included automatically.
const RETIRED_SERVICE_SLUGS = new Set(["government-consulting"]);

export function selectCorporateServices<T extends { slug?: string | null }>(services: T[]): T[] {
  return services
    .filter((service) => service.slug && !RETIRED_SERVICE_SLUGS.has(service.slug))
    .sort((left, right) => {
      const leftOrder = serviceOrder.get(left.slug as (typeof CORPORATE_SERVICE_SLUGS)[number]);
      const rightOrder = serviceOrder.get(right.slug as (typeof CORPORATE_SERVICE_SLUGS)[number]);
      if (leftOrder !== undefined || rightOrder !== undefined) {
        return (leftOrder ?? Number.MAX_SAFE_INTEGER) - (rightOrder ?? Number.MAX_SAFE_INTEGER);
      }
      return String(left.slug).localeCompare(String(right.slug));
    });
}
