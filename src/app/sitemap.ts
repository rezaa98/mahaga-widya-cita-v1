import { MetadataRoute } from "next";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import { isLikelyEnglishDocument } from "@/utils/contentLanguage";
import { selectCorporateServices } from "@/data/serviceCatalog";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.mahagawidyacita.com";
  const payload = await getPayload({ config: configPromise });

  // Base routes
  const locales = ["id", "en"];

  let featureSettings: any = null;
  try {
    featureSettings = await payload.findGlobal({ slug: "pengaturan-fitur" as any });
  } catch (err) {
    // fallback
  }
  const isPolicyReviewsEnabled = featureSettings?.enablePolicyReviews !== false;

  const rawStaticRoutes = [
    "",
    "/tentang-kami",
    "/tim",
    "/mitra",
    "/karir",
    "/kontak",
    "/artikel",
    "/jurnal",
    ...(isPolicyReviewsEnabled ? ["/policy-reviews"] : []),
  ];

  const staticRoutes = rawStaticRoutes.flatMap((route) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}${route}`,
      changeFrequency: "weekly" as const,
      priority: route === "" ? 1 : 0.8,
    })),
  );

  // Dynamic articles
  let articleRoutes: MetadataRoute.Sitemap = [];
  try {
    const perLocaleRoutes = await Promise.all(
      locales.map(async (locale) => {
        const { docs: articles } = await payload.find({
          collection: "articles",
          where: { status: { equals: "published" } },
          limit: 1000,
          locale: locale as any,
          fallbackLocale: "none" as any,
        });
        return articles
          .filter((article) => locale !== "en" || isLikelyEnglishDocument(article))
          .map((article) => ({
            url: `${baseUrl}/${locale}/artikel/${article.slug}`,
            lastModified: new Date(article.updatedAt || article.createdAt),
            changeFrequency: "monthly" as const,
            priority: 0.7,
          }));
      }),
    );
    articleRoutes = perLocaleRoutes.flat();
  } catch (err) {
    console.error("[sitemap] Failed to load articles:", err);
  }

  // Dynamic journals
  let journalRoutes: MetadataRoute.Sitemap = [];
  try {
    const routes = await Promise.all(
      locales.map(async (locale) => {
        const { docs } = await payload.find({
          collection: "journals",
          where: { status: { equals: "published" } },
          locale: locale as any,
          fallbackLocale: "none" as any,
          limit: 1000,
        });
        return docs
          .filter(
            (journal) =>
              locale !== "en" || isLikelyEnglishDocument({ title: journal.title, content: journal.abstract }),
          )
          .map((journal) => ({
            url: `${baseUrl}/${locale}/jurnal/${journal.slug}`,
            lastModified: new Date(journal.updatedAt || journal.createdAt),
            changeFrequency: "monthly" as const,
            priority: 0.7,
          }));
      }),
    );
    journalRoutes = routes.flat();
  } catch (err) {
    console.error("[sitemap] Failed to load journals (collection may not exist):", err);
  }

  // Dynamic policy reviews
  let policyRoutes: MetadataRoute.Sitemap = [];
  if (isPolicyReviewsEnabled) {
    try {
      const routes = await Promise.all(
        locales.map(async (locale) => {
          const { docs } = await payload.find({
            collection: "policy-reviews",
            where: { status: { equals: "published" } },
            locale: locale as any,
            fallbackLocale: "none" as any,
            limit: 1000,
          });
          return docs
            .filter(
              (review) =>
                locale !== "en" ||
                isLikelyEnglishDocument({ title: review.title, excerpt: review.excerpt, content: review.summary }),
            )
            .map((review) => ({
              url: `${baseUrl}/${locale}/policy-reviews/${review.slug}`,
              lastModified: new Date(review.updatedAt || review.createdAt),
              changeFrequency: "monthly" as const,
              priority: 0.7,
            }));
        }),
      );
      policyRoutes = routes.flat();
    } catch (err) {
      console.error("[sitemap] Failed to load policy reviews:", err);
    }
  }

  // Dynamic services
  let serviceRoutes: MetadataRoute.Sitemap = [];
  try {
    const routes = await Promise.all(
      locales.map(async (locale) => {
        const { docs } = await payload.find({
          collection: "services",
          locale: locale as any,
          fallbackLocale: "none" as any,
          limit: 100,
        });
        return selectCorporateServices(docs)
          .filter((service) => Boolean(service.title))
          .map((service) => ({
            url: `${baseUrl}/${locale}/layanan/${service.slug}`,
            lastModified: new Date(service.updatedAt || service.createdAt),
            changeFrequency: "monthly" as const,
            priority: 0.9,
          }));
      }),
    );
    serviceRoutes = routes.flat();
  } catch (err) {
    console.error("[sitemap] Failed to load services:", err);
  }

  return [...staticRoutes, ...articleRoutes, ...journalRoutes, ...policyRoutes, ...serviceRoutes];
}
