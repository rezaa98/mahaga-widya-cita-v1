import { MetadataRoute } from "next";
import { getPayload } from "payload";
import configPromise from "@payload-config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://mahagawidyacita.co.id";
  const payload = await getPayload({ config: configPromise });

  // Base routes
  const staticRoutes = [
    "",
    "/tentang-kami",
    "/tim",
    "/mitra",
    "/karir",
    "/kontak",
    "/artikel",
    "/policy-reviews"
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  // Dynamic articles
  const { docs: articles } = await payload.find({ collection: 'articles', limit: 1000 });
  const articleRoutes = articles.map((article) => ({
    url: `${baseUrl}/artikel/${article.slug}`,
    lastModified: new Date(article.updatedAt || article.createdAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Dynamic policy reviews
  const { docs: policyReviews } = await payload.find({ collection: 'policy-reviews', limit: 1000 });
  const policyRoutes = policyReviews.map((review) => ({
    url: `${baseUrl}/policy-reviews/${review.slug}`,
    lastModified: new Date(review.updatedAt || review.createdAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Dynamic services
  const { docs: services } = await payload.find({ collection: 'services', limit: 100 });
  const serviceRoutes = services.map((service) => ({
    url: `${baseUrl}/layanan/${service.slug}`,
    lastModified: new Date(service.updatedAt || service.createdAt),
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  return [...staticRoutes, ...articleRoutes, ...policyRoutes, ...serviceRoutes];
}
