import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://mahagawidyacita.co.id";

  // Base routes
  const routes = [
    "",
    "/tentang-kami",
    "/tim",
    "/mitra",
    "/karir",
    "/kontak",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  // Services routes
  const services = [
    "konsultasi",
    "edukasi",
    "software",
    "governance-review",
    "online-course",
    "digital-conference",
  ].map((slug) => ({
    url: `${baseUrl}/layanan/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  return [...routes, ...services];
}
