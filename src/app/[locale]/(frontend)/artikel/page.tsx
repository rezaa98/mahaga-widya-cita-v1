import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import {
  getContentImage,
  getContentImageAlt,
  getLocalizedArticleHref,
  getLocalizedArticlesHref,
} from "@/utils/contentMedia";
import { isLikelyEnglishDocument } from "@/utils/contentLanguage";
import { localizedAlternates } from "@/utils/seo";

export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return locale === "en"
    ? {
        title: "Articles & Insights",
        description: "Latest articles, insights, and news from PT Mahaga Widya Cita.",
        alternates: localizedAlternates(locale, "/artikel"),
      }
    : {
        title: "Artikel & Wawasan",
        description: "Kumpulan artikel, insight, dan berita terbaru dari PT Mahaga Widya Cita.",
        alternates: localizedAlternates(locale, "/artikel"),
      };
}

export default async function ArtikelPage(props: {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await props.params;
  const isEn = params.locale === "en";
  const copy = isEn
    ? {
        all: "All",
        badge: "ARTICLES & INSIGHTS",
        description:
          "Discover the latest information, in-depth analysis, and news on technology, business, and government.",
        empty: "No articles yet",
        emptyDescription: "No English articles are available in this category.",
        general: "GENERAL",
        latest: "Latest Insights",
        next: "Next",
        page: "Page",
        previous: "Previous",
        read: "Read",
        readMore: "Click to read more...",
        of: "of",
      }
    : {
        all: "Semua",
        badge: "ARTIKEL & INSIGHT",
        description:
          "Temukan informasi terkini, analisis mendalam, dan berita terbaru seputar teknologi, bisnis, dan pemerintahan.",
        empty: "Belum ada artikel",
        emptyDescription: "Tidak ditemukan artikel untuk kategori ini.",
        general: "UMUM",
        latest: "Wawasan Terbaru",
        next: "Selanjutnya",
        page: "Halaman",
        previous: "Sebelumnya",
        read: "Baca",
        readMore: "Klik untuk membaca selengkapnya...",
        of: "dari",
      };
  const englishCategoryNames: Record<string, string> = {
    bisnis: "Business",
    individu: "Individual",
    pemerintah: "Government",
    "smart-city": "Smart City",
    teknologi: "Technology",
    "tata-kelola": "Governance",
  };
  const searchParams = props.searchParams ? await props.searchParams : {};
  const page = typeof searchParams.page === "string" ? parseInt(searchParams.page, 10) : 1;
  const selectedKategori = typeof searchParams.kategori === "string" ? searchParams.kategori : "";

  const payload = await getPayload({ config: configPromise });

  const { docs: categories } = await payload.find({
    collection: "categories",
    limit: 100,
    locale: params.locale as any,
    fallbackLocale: "none" as any,
  });

  let categoryFilter = {};
  if (selectedKategori) {
    const cat = categories.find((c: any) => c.slug === selectedKategori);
    if (cat) {
      categoryFilter = { category: { equals: cat.id } };
    }
  }

  const { docs: articleCandidates } = await payload.find({
    collection: "articles",
    where: {
      status: {
        equals: "published",
      },
      ...categoryFilter,
    },
    sort: "-publishedAt",
    limit: 100,
    locale: params.locale as any,
    fallbackLocale: "none" as any,
  });
  const localizedArticles = isEn ? articleCandidates.filter(isLikelyEnglishDocument) : articleCandidates;
  const pageSize = 9;
  const totalPages = Math.max(1, Math.ceil(localizedArticles.length / pageSize));
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const articles = localizedArticles.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const hasPrevPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;
  const prevPage = currentPage - 1;
  const nextPage = currentPage + 1;

  const getPaginationUrl = (targetPage: number) => {
    return getLocalizedArticlesHref(
      params.locale,
      `?page=${targetPage}${selectedKategori ? `&kategori=${selectedKategori}` : ""}`,
    );
  };

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: "100px", minHeight: "80vh", backgroundColor: "#f8f9fa", paddingBottom: "60px" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "30px" }}>
            <span className="badge badge-primary" style={{ marginBottom: "1rem" }}>
              {copy.badge}
            </span>
            <h1 style={{ color: "#1a2b4c", marginBottom: "1rem" }}>{copy.latest}</h1>
            <p style={{ color: "#666", maxWidth: "680px", margin: "0 auto" }}>{copy.description}</p>
          </div>

          <div
            className="artikel-filter-bar"
            style={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: "0.75rem",
              marginBottom: "2.5rem",
            }}
          >
            <Link
              href={getLocalizedArticlesHref(params.locale)}
              style={{
                padding: "0.5rem 1.25rem",
                borderRadius: "100px",
                backgroundColor: !selectedKategori ? "var(--color-primary-600)" : "#fff",
                color: !selectedKategori ? "#fff" : "#64748b",
                border: `1px solid ${!selectedKategori ? "var(--color-primary-600)" : "#e2e8f0"}`,
                textDecoration: "none",
                fontWeight: 600,
                fontSize: "0.85rem",
                transition: "all 0.2s ease",
              }}
            >
              {copy.all}
            </Link>
            {categories.map((cat: any) => (
              <Link
                key={cat.id}
                href={getLocalizedArticlesHref(params.locale, `?kategori=${cat.slug}`)}
                style={{
                  padding: "0.5rem 1.25rem",
                  borderRadius: "100px",
                  backgroundColor: selectedKategori === cat.slug ? "var(--color-primary-600)" : "#fff",
                  color: selectedKategori === cat.slug ? "#fff" : "#64748b",
                  border: `1px solid ${selectedKategori === cat.slug ? "var(--color-primary-600)" : "#e2e8f0"}`,
                  textDecoration: "none",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  transition: "all 0.2s ease",
                }}
              >
                {isEn ? englishCategoryNames[cat.slug] || cat.name : cat.name}
              </Link>
            ))}
          </div>

          {articles.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "40px",
                backgroundColor: "#fff",
                borderRadius: "16px",
                border: "1px solid #eee",
              }}
            >
              <BookOpen size={48} color="#ccc" style={{ marginBottom: "16px" }} />
              <h3>{copy.empty}</h3>
              <p style={{ color: "#666" }}>{copy.emptyDescription}</p>
            </div>
          ) : (
            <>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 320px), 1fr))",
                  gap: "1.5rem",
                }}
              >
                {articles.map((article: any) => (
                  <Link
                    key={article.id}
                    href={getLocalizedArticleHref(params.locale, article.slug || article.id)}
                    style={{ textDecoration: "none", display: "block" }}
                  >
                    <div
                      className="card"
                      style={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}
                    >
                      <div
                        style={{
                          height: "200px",
                          backgroundColor: "#e2e8f0",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#94a3b8",
                          overflow: "hidden",
                          position: "relative",
                        }}
                      >
                        {getContentImage(article) ? (
                          <Image
                            src={getContentImage(article)!}
                            alt={getContentImageAlt(article, article.title)}
                            fill
                            style={{ objectFit: "cover" }}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 320px"
                          />
                        ) : (
                          <span>[Image Placeholder]</span>
                        )}
                      </div>

                      <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", flexGrow: 1 }}>
                        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.75rem", flexWrap: "wrap" }}>
                          <span
                            style={{
                              fontSize: "0.75rem",
                              fontWeight: 600,
                              color: "var(--color-primary-600)",
                              backgroundColor: "var(--color-primary-100)",
                              padding: "0.25rem 0.75rem",
                              borderRadius: "100px",
                            }}
                          >
                            {typeof article.category === "object" && article.category
                              ? isEn
                                ? englishCategoryNames[article.category.slug] || article.category.name
                                : article.category.name
                              : copy.general}
                          </span>
                        </div>
                        <h3 style={{ fontSize: "1.25rem", color: "#1a2b4c", marginBottom: "0.75rem" }}>
                          {article.title}
                        </h3>
                        <p
                          style={{
                            color: "#666",
                            fontSize: "0.9rem",
                            marginBottom: "1.25rem",
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {copy.readMore}
                        </p>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            borderTop: "1px solid #f1f5f9",
                            paddingTop: "1rem",
                            marginTop: "auto",
                          }}
                        >
                          <div>
                            <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#334155" }}>
                              {typeof article.author === "object" && article.author
                                ? article.author.name || "Admin"
                                : "Admin"}
                            </div>
                            <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                              {new Date(article.publishedAt || article.createdAt).toLocaleDateString(
                                isEn ? "en-US" : "id-ID",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                },
                              )}
                            </div>
                          </div>
                          <span
                            style={{
                              color: "var(--color-primary-500)",
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                              fontSize: "0.85rem",
                              fontWeight: 600,
                            }}
                          >
                            {copy.read} <ArrowRight size={14} />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {totalPages > 1 && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "1rem",
                    marginTop: "3rem",
                  }}
                >
                  {hasPrevPage ? (
                    <Link
                      href={getPaginationUrl(prevPage as number)}
                      style={{
                        padding: "0.5rem 1rem",
                        backgroundColor: "#fff",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        textDecoration: "none",
                        color: "#1a2b4c",
                        fontWeight: 500,
                      }}
                    >
                      {copy.previous}
                    </Link>
                  ) : (
                    <span
                      style={{
                        padding: "0.5rem 1rem",
                        backgroundColor: "#f1f5f9",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        color: "#94a3b8",
                        cursor: "not-allowed",
                        fontWeight: 500,
                      }}
                    >
                      {copy.previous}
                    </span>
                  )}

                  <span style={{ fontWeight: 600, color: "#475569" }}>
                    {copy.page} {currentPage} {copy.of} {totalPages}
                  </span>

                  {hasNextPage ? (
                    <Link
                      href={getPaginationUrl(nextPage as number)}
                      style={{
                        padding: "0.5rem 1rem",
                        backgroundColor: "#fff",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        textDecoration: "none",
                        color: "#1a2b4c",
                        fontWeight: 500,
                      }}
                    >
                      {copy.next}
                    </Link>
                  ) : (
                    <span
                      style={{
                        padding: "0.5rem 1rem",
                        backgroundColor: "#f1f5f9",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        color: "#94a3b8",
                        cursor: "not-allowed",
                        fontWeight: 500,
                      }}
                    >
                      {copy.next}
                    </span>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer locale={params.locale} />
      <WhatsAppFloat locale={params.locale} />
    </>
  );
}
