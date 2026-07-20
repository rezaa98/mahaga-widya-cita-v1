import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, Download, FileText, Hash, UserRound } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import RichTextRenderer from "@/components/RichTextRenderer";
import {
  getPayloadClient,
  journalAuthors,
  journalCitation,
  journalHref,
  journalListHref,
  mediaAlt,
  mediaURL,
  publishedJournalWhere,
  richTextToPlain,
} from "../_journal";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type RouteParams = { locale: string; slug: string };

async function getJournal({ locale, slug }: RouteParams) {
  try {
    const payload = await getPayloadClient();
    const result: any = await payload.find({
      collection: "journals" as any,
      where: publishedJournalWhere([{ slug: { equals: slug } }]),
      locale: locale as any,
      depth: 1,
      limit: 1,
    } as any);
    return result.docs?.[0];
  } catch (err) {
    console.error("[JournalDetail] Failed to load journal (collection may not exist):", err);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<RouteParams> }) {
  const resolved = await params;
  const journal = await getJournal(resolved);
  if (!journal) return { title: resolved.locale === "en" ? "Journal not found" : "Jurnal tidak ditemukan" };
  const title = journal.meta?.title || journal.metaTitle || `${journal.title} | Mahaga Widya Cita`;
  const description =
    journal.meta?.description ||
    journal.metaDescription ||
    richTextToPlain(journal.abstract).slice(0, 160) ||
    journal.title;
  const image = journal.meta?.image
    ? typeof journal.meta.image === "object"
      ? journal.meta.image.url
      : null
    : mediaURL(journal.ogImage) || mediaURL(journal.coverImage);
  const url = `https://mahagawidyacita.co.id${journalHref(resolved.locale, journal.slug || journal.id)}`;
  return {
    title,
    description,
    alternates: { canonical: journal.canonicalUrl || url },
    openGraph: { title, description, type: "article", url, images: image ? [{ url: image }] : [] },
    twitter: { card: "summary_large_image", title, description, images: image ? [image] : [] },
  };
}

export default async function JournalDetailPage({ params }: { params: Promise<RouteParams> }) {
  const resolved = await params;
  const journal = await getJournal(resolved);
  if (!journal) notFound();

  let related: any[] = [];
  try {
    const payload = await getPayloadClient();
    const categoryID = typeof journal.category === "object" ? journal.category?.id : journal.category;
    const relatedResult: any = await payload.find({
      collection: "journals" as any,
      where: publishedJournalWhere([
        { id: { not_equals: journal.id } },
        ...(categoryID ? [{ category: { equals: categoryID } }] : []),
      ]),
      locale: resolved.locale as any,
      depth: 1,
      sort: "-publishedAt",
      limit: 3,
    } as any);
    related = relatedResult.docs || [];
  } catch (err) {
    console.error("[JournalDetail] Failed to load related journals:", err);
  }

  const cover = mediaURL(journal.coverImage) || (typeof journal.coverImage === "string" ? journal.coverImage : null);
  const document = mediaURL(journal.document) || (typeof journal.document === "string" ? journal.document : null);
  const authors = journalAuthors(journal);
  const isEn = resolved.locale === "en";
  const dateLocale = isEn ? "en-US" : "id-ID";
  const citation = journalCitation(journal);

  const schema = {
    "@context": "https://schema.org",
    "@type": "ScholarlyArticle",
    headline: journal.title,
    datePublished: journal.publishedAt || undefined,
    inLanguage: journal.language || resolved.locale,
    author: authors.map((author: any) => ({
      "@type": "Person",
      name: author.name,
      affiliation: author.affiliation ? { "@type": "Organization", name: author.affiliation } : undefined,
    })),
    abstract: richTextToPlain(journal.abstract),
    keywords: Array.isArray(journal.keywords)
      ? journal.keywords
          .map((keyword: any) => keyword.keyword || keyword)
          .filter(Boolean)
          .join(", ")
      : undefined,
    pagination: journal.pages || undefined,
    sameAs: journal.doi ? `https://doi.org/${journal.doi}` : undefined,
    url: `https://mahagawidyacita.co.id${journalHref(resolved.locale, journal.slug || journal.id)}`,
  };

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 120, minHeight: "100vh", background: "#f8fafc", paddingBottom: 80 }}>
        <div className="container" style={{ maxWidth: 980 }}>
          <Breadcrumbs
            items={[
              { label: isEn ? "All journals" : "Semua jurnal", href: journalListHref(resolved.locale) },
              { label: journal.title },
            ]}
          />

          <article
            className="card"
            style={{
              padding: "clamp(28px, 5vw, 52px)",
              borderRadius: 24,
              boxShadow: "0 10px 40px -10px rgba(0,0,0,0.06)",
              border: "1px solid #e2e8f0",
              background: "#ffffff",
            }}
          >
            <div
              className={cover ? "journal-detail-hero journal-detail-hero--with-cover" : "journal-detail-hero"}
              style={{ display: "grid", gap: "32px", alignItems: "center" }}
            >
              <div>
                <span
                  className="badge badge-primary"
                  style={{ fontSize: "0.85rem", padding: "6px 14px", borderRadius: "100px", fontWeight: 600 }}
                >
                  {typeof journal.category === "object" && journal.category?.name
                    ? journal.category.name
                    : isEn
                      ? "Publication"
                      : "Publikasi"}
                </span>
                <h1
                  style={{
                    color: "#0f172a",
                    lineHeight: 1.25,
                    fontSize: "clamp(1.5rem, 3.5vw, 2.1rem)",
                    margin: "18px 0 20px 0",
                    fontWeight: 700,
                  }}
                >
                  {journal.title}
                </h1>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 16,
                    color: "#64748b",
                    fontSize: "0.92rem",
                    alignItems: "center",
                  }}
                >
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                    <Calendar size={16} style={{ color: "#2563eb", flexShrink: 0 }} />
                    {new Date(journal.publishedAt || journal.createdAt).toLocaleDateString(dateLocale, {
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                  {journal.doi && (
                    <a
                      href={`https://doi.org/${journal.doi}`}
                      rel="noreferrer"
                      target="_blank"
                      style={{ color: "#2563eb", fontWeight: 600, textDecoration: "none" }}
                    >
                      DOI: {journal.doi}
                    </a>
                  )}
                </div>
              </div>

              {cover && (
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    aspectRatio: "3 / 4",
                    overflow: "hidden",
                    borderRadius: 16,
                    background: "#f1f5f9",
                    border: "1px solid #cbd5e1",
                    boxShadow: "0 12px 30px -8px rgba(0,0,0,0.18)",
                  }}
                >
                  <img
                    alt={mediaAlt(journal.coverImage, journal.title)}
                    src={cover || "/media/wiga-journal-cover.png"}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "center top",
                      display: "block",
                    }}
                  />
                </div>
              )}
            </div>

            <section style={{ marginTop: 40, paddingTop: 32, borderTop: "1px solid #f1f5f9" }}>
              <h3 style={{ color: "#0f172a", fontSize: "1.2rem", marginBottom: 16, fontWeight: 700 }}>
                {isEn ? "Authors" : "Penulis"}
              </h3>
              <div style={{ display: "grid", gap: 16 }}>
                {authors.length ? (
                  authors.map((author: any, index: number) => (
                    <div
                      key={author.id || index}
                      style={{
                        display: "flex",
                        gap: 14,
                        color: "#334155",
                        alignItems: "flex-start",
                        background: "#f8fafc",
                        padding: 16,
                        borderRadius: 12,
                        border: "1px solid #f1f5f9",
                      }}
                    >
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          background: "#eff6ff",
                          color: "#2563eb",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <UserRound size={20} />
                      </div>
                      <div>
                        <strong style={{ fontSize: "1rem", color: "#0f172a" }}>{author.name}</strong>
                        {author.affiliation && (
                          <div style={{ fontSize: "0.9rem", color: "#64748b", marginTop: 2 }}>{author.affiliation}</div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p>Mahaga Widya Cita</p>
                )}
              </div>
            </section>

            <section className="article-content" style={{ marginTop: 36 }}>
              <h3 style={{ color: "#0f172a", fontSize: "1.25rem", marginBottom: 14, fontWeight: 700 }}>
                {isEn ? "Abstract" : "Abstrak"}
              </h3>
              <RichTextRenderer content={journal.abstract} />
              {journal.content && (
                <>
                  <h3
                    style={{ color: "#0f172a", fontSize: "1.25rem", marginTop: 32, marginBottom: 14, fontWeight: 700 }}
                  >
                    {isEn ? "Full discussion" : "Pembahasan"}
                  </h3>
                  <RichTextRenderer content={journal.content} />
                </>
              )}
            </section>

            {document && (
              <section
                style={{
                  marginTop: 36,
                  background: "linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%)",
                  border: "1px solid #bfdbfe",
                  padding: 24,
                  borderRadius: 16,
                  display: "flex",
                  gap: 16,
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                }}
              >
                <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      background: "#ffffff",
                      color: "#2563eb",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                    }}
                  >
                    <FileText size={24} />
                  </div>
                  <div>
                    <strong style={{ color: "#1e3a8a", fontSize: "1.05rem", display: "block" }}>
                      {isEn ? "Full journal document" : "Dokumen Jurnal Lengkap"}
                    </strong>
                    <span style={{ color: "#64748b", fontSize: "0.88rem" }}>Format PDF Resmi</span>
                  </div>
                </div>
                <a
                  className="btn btn-primary"
                  download
                  href={document}
                  style={{
                    padding: "12px 24px",
                    borderRadius: 10,
                    fontWeight: 600,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <Download size={18} /> {isEn ? "Download PDF" : "Unduh PDF"}
                </a>
              </section>
            )}

            {(journal.volume || journal.issue || journal.pages || journal.issn) && (
              <section style={{ marginTop: 36 }}>
                <h3 style={{ color: "#0f172a", fontSize: "1.2rem", marginBottom: 16, fontWeight: 700 }}>
                  {isEn ? "Publication details" : "Detail Publikasi"}
                </h3>
                <dl
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                    gap: 14,
                    margin: 0,
                  }}
                >
                  {[
                    ["Volume", journal.volume],
                    ["Issue / Nomor", journal.issue],
                    [isEn ? "Pages" : "Halaman", journal.pages],
                    ["ISSN", journal.issn],
                  ]
                    .filter(([, value]) => value)
                    .map(([label, value]) => (
                      <div
                        key={String(label)}
                        style={{ background: "#f8fafc", borderRadius: 12, padding: 16, border: "1px solid #f1f5f9" }}
                      >
                        <dt style={{ color: "#64748b", fontSize: "0.85rem", fontWeight: 600 }}>{label}</dt>
                        <dd style={{ margin: "6px 0 0", color: "#0f172a", fontWeight: 700, fontSize: "0.98rem" }}>
                          {value}
                        </dd>
                      </div>
                    ))}
                </dl>
              </section>
            )}

            <section style={{ marginTop: 36 }}>
              <h3 style={{ color: "#0f172a", fontSize: "1.2rem", marginBottom: 14, fontWeight: 700 }}>
                {isEn ? "Citation" : "Sitasi"}
              </h3>
              <p
                style={{
                  padding: 18,
                  borderRadius: 12,
                  background: "#f8fafc",
                  color: "#334155",
                  border: "1px solid #e2e8f0",
                  fontSize: "0.92rem",
                  lineHeight: 1.6,
                }}
              >
                <Hash size={16} style={{ verticalAlign: "-3px", marginRight: 8, color: "#2563eb" }} />
                {citation}
              </p>
            </section>
          </article>

          {related.length > 0 && (
            <section style={{ marginTop: 48 }}>
              <h3 style={{ color: "#0f172a", fontSize: "1.4rem", marginBottom: 20, fontWeight: 700 }}>
                {isEn ? "Related journals" : "Jurnal Terkait"}
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20 }}>
                {related.map((item: any) => (
                  <Link
                    className="card"
                    href={journalHref(resolved.locale, item.slug || item.id)}
                    key={item.id}
                    style={{ padding: 20, textDecoration: "none", borderRadius: 16, border: "1px solid #e2e8f0" }}
                  >
                    <strong
                      style={{
                        color: "#0f172a",
                        fontSize: "1.02rem",
                        lineHeight: 1.4,
                        display: "block",
                        marginBottom: 8,
                      }}
                    >
                      {item.title}
                    </strong>
                    <p style={{ color: "#64748b", fontSize: "0.88rem", margin: 0 }}>
                      {journalAuthors(item)
                        .map((author: any) => author.name)
                        .join(", ")}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }}
        type="application/ld+json"
      />
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
