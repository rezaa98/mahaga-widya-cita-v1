export const CORPORATE_SERVICE_SLUGS = [
  "workforce-solutions",
  "technology-digital-solutions",
  "human-capital-development",
  "research-strategic-studies",
  "tax-financial-advisory",
  "business-investment-advisory",
] as const;

const serviceOrder = new Map(CORPORATE_SERVICE_SLUGS.map((slug, index) => [slug, index]));

export function selectCorporateServices<T extends { slug?: string | null }>(services: T[]): T[] {
  return services
    .filter((service) => service.slug && serviceOrder.has(service.slug as (typeof CORPORATE_SERVICE_SLUGS)[number]))
    .sort(
      (left, right) =>
        (serviceOrder.get(left.slug as (typeof CORPORATE_SERVICE_SLUGS)[number]) ?? Number.MAX_SAFE_INTEGER) -
        (serviceOrder.get(right.slug as (typeof CORPORATE_SERVICE_SLUGS)[number]) ?? Number.MAX_SAFE_INTEGER),
    );
}
