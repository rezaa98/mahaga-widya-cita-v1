import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import HomePage from "@/components/HomePage";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import { isLikelyEnglishDocument } from "@/utils/contentLanguage";
import { selectCorporateServices } from "@/data/serviceCatalog";
import type { Metadata } from "next";
import { localizedAlternates } from "@/utils/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return { alternates: localizedAlternates(locale) };
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const payload = await getPayload({ config: configPromise });

  let berandaData: any = null;
  try {
    berandaData = await payload.findGlobal({
      slug: "beranda",
      depth: 2,
      locale: locale as any,
      fallbackLocale: "none" as any,
    });
  } catch (err) {
    console.error("[Home] Failed to load beranda global:", err);
  }

  // Use CMS selected articles, otherwise fallback to latest 3
  let articles: any[] = [];
  try {
    const selectedPublishedArticles = Array.isArray(berandaData?.featuredData?.articles)
      ? berandaData.featuredData.articles.filter(
          (article: any) =>
            typeof article === "object" &&
            article?.status === "published" &&
            (locale !== "en" || isLikelyEnglishDocument(article)),
        )
      : [];

    articles =
      selectedPublishedArticles.length > 0
        ? selectedPublishedArticles
        : (
            await payload.find({
              collection: "articles",
              where: {
                status: { equals: "published" },
              },
              sort: "-publishedAt",
              limit: locale === "en" ? 30 : 3,
              locale: locale as any,
              fallbackLocale: "none" as any,
            })
          ).docs
            .filter((article) => locale !== "en" || isLikelyEnglishDocument(article))
            .slice(0, 3);
  } catch (err) {
    console.error("[Home] Failed to load articles:", err);
  }

  // Use CMS selected team, otherwise fallback to top 100
  let teamMembers: any[] = [];
  try {
    teamMembers =
      berandaData?.featuredData?.team?.length > 0
        ? berandaData.featuredData.team
        : (
            await payload.find({
              collection: "team-members",
              limit: 100,
              sort: "order",
              locale: locale as any,
              fallbackLocale: "none" as any,
            })
          ).docs;
  } catch (err) {
    console.error("[Home] Failed to load team members:", err);
  }

  let services: any[] = [];
  let contactPhone: string | undefined;
  try {
    const serviceCandidates =
      berandaData?.featuredData?.services?.length > 0
        ? berandaData.featuredData.services
        : (
            await payload.find({
              collection: "services",
              limit: 10,
              locale: locale as any,
              fallbackLocale: "none" as any,
            })
          ).docs;
    services = selectCorporateServices(serviceCandidates);
  } catch (err) {
    console.error("[Home] Failed to load services:", err);
  }

  try {
    const contact = await payload.findGlobal({
      slug: "kontak",
      locale: locale as any,
      fallbackLocale: "none" as any,
      depth: 0,
    });
    contactPhone = contact?.phone || undefined;
  } catch (err) {
    console.error("[Home] Failed to load contact information:", err);
  }

  return (
    <>
      <Navbar />
      <HomePage
        articles={articles}
        teamMembers={teamMembers}
        services={services}
        berandaData={berandaData}
        locale={locale}
        contactPhone={contactPhone}
      />
      <Footer locale={locale} />
      <WhatsAppFloat locale={locale} />
    </>
  );
}
