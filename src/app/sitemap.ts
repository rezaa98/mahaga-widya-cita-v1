import { MetadataRoute } from "next";
import { getPayload } from "payload";
import configPromise from "@payload-config";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://mahagawidyacita.co.id";
  const payload = await getPayload({ config: configPromise });

  // Base routes
  const locales = ['id', 'en'];
  
  const staticRoutes = [
    "",
    "/tentang-kami",
    "/tim",
    "/mitra",
    "/karir",
    "/kontak",
    "/artikel",
    "/jurnal",
    "/policy-reviews"
  ].flatMap((route) => locales.map((locale) => ({
    url: `${baseUrl}/${locale}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  })));

  // Dynamic articles
  const { docs: articles } = await payload.find({
    collection: 'articles',
    where: { status: { equals: 'published' } },
    limit: 1000,
  });
  const articleRoutes = articles.flatMap((article) => locales.map((locale) => ({
    url: `${baseUrl}/${locale}/artikel/${article.slug}`,
    lastModified: new Date(article.updatedAt || article.createdAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  })));

  // Dynamic journals
  const { docs: journals } = await payload.find({
    collection: 'journals',
    where: { status: { equals: 'published' } },
    limit: 1000,
  });
  const journalRoutes = journals.flatMap((journal) => locales.map((locale) => ({
    url: `${baseUrl}/${locale}/jurnal/${journal.slug}`,
    lastModified: new Date(journal.updatedAt || journal.createdAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  })));

  // Dynamic policy reviews
  const { docs: policyReviews } = await payload.find({
    collection: 'policy-reviews',
    where: { status: { equals: 'published' } },
    limit: 1000,
  });
  const policyRoutes = policyReviews.flatMap((review) => locales.map((locale) => ({
    url: `${baseUrl}/${locale}/policy-reviews/${review.slug}`,
    lastModified: new Date(review.updatedAt || review.createdAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  })));

  // Dynamic services
  const { docs: services } = await payload.find({ collection: 'services', limit: 100 });
  const serviceRoutes = services.flatMap((service) => locales.map((locale) => ({
    url: `${baseUrl}/${locale}/layanan/${service.slug}`,
    lastModified: new Date(service.updatedAt || service.createdAt),
    changeFrequency: "monthly" as const,
    priority: 0.9,
  })));

  return [...staticRoutes, ...articleRoutes, ...journalRoutes, ...policyRoutes, ...serviceRoutes];
}
