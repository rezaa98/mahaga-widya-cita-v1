import Image from "next/image";
import Link from "next/link";
import { BookOpen, Calendar, FileText, Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import {
  getPayloadClient,
  journalAuthors,
  journalHref,
  journalListHref,
  mediaAlt,
  mediaURL,
  publishedJournalWhere,
  type Journal,
} from "./_journal";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Jurnal & Publikasi | Mahaga Widya Cita",
  description: "Jurnal, kajian, dan publikasi profesional Mahaga Widya Cita.",
};

type SearchParams = {
  q?: string | string[];
  year?: string | string[];
  kategori?: string | string[];
  page?: string | string[];
};

export default async function JournalListPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<SearchParams>;
}) {
  const { locale } = await params;
  const query = (await searchParams) || {};
  const q = typeof query.q === "string" ? query.q.trim() : "";
  const year = typeof query.year === "string" ? query.year : "";
  const categorySlug = typeof query.kategori === "string" ? query.kategori : "";
  const parsedPage = typeof query.page === "string" ? Number.parseInt(query.page, 10) : 1;
  const page = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  const dateLocale = locale === "en" ? "en-US" : "id-ID";
  const labels =
    locale === "en"
      ? {
          badge: "Research & Publications",
          title: "Journals and Publications",
          copy: "Explore professional research, analysis, and knowledge publications by our experts.",
          search: "Search title or topic",
          all: "All categories",
          allYears: "All years",
          read: "Read publication",
          empty: "No publications found",
          reset: "Reset filters",
          page: "Page",
        }
      : {
          badge: "Riset & Publikasi",
          title: "Jurnal dan Publikasi",
          copy: "Telusuri riset, kajian, dan publikasi pengetahuan profesional dari para ahli kami.",
          search: "Cari judul atau topik",
          all: "Semua kategori",
          allYears: "Semua tahun",
          read: "Baca publikasi",
          empty: "Belum ada publikasi yang sesuai",
          reset: "Atur ulang filter",
          page: "Halaman",
        };

  let payload: Awaited<ReturnType<typeof getPayloadClient>>;
  let categories: any[] = [];
  let journals: Journal[] = [];
  let years: number[] = [];
  let result: any = { totalPages: 0, hasPrevPage: false, hasNextPage: false, page: 1, prevPage: null, nextPage: null };

  try {
    payload = await getPayloadClient();
    const catResult = await payload.find({ collection: "categories", locale: locale as any, limit: 100 });
    categories = catResult.docs || [];

    const yearResult: any = await payload.find({
      collection: "journals",
      where: publishedJournalWhere(),
      locale: locale as any,
      depth: 0,
      limit: 1000,
      select: { publicationYear: true },
    } as any);

    const selectedCategory = categories.find((category: any) => category.slug === categorySlug);
    const filters: Record<string, unknown>[] = [];
    if (q) filters.push({ title: { contains: q } });
    if (year) filters.push({ publicationYear: { equals: Number(year) } });
    if (selectedCategory) filters.push({ category: { equals: selectedCategory.id } });

    result = await payload.find({
      collection: "journals" as any,
      where: publishedJournalWhere(filters),
      locale: locale as any,
      depth: 1,
      sort: "-publishedAt",
      limit: 9,
      page,
    } as any);
    journals = result.docs || [];
    years = Array.from(
      new Set<number>(
        (yearResult.docs || [])
          .map((journal: Journal) => journal.publicationYear)
          .filter((value: unknown): value is number => typeof value === "number"),
      ),
    ).sort((a, b) => b - a);
  } catch (err) {
    console.error("[JournalListPage] Failed to load journals (collection may not exist yet):", err);
  }

  const buildHref = (overrides: Record<string, string | undefined> = {}) => {
    const values = { q: q || undefined, year: year || undefined, kategori: categorySlug || undefined, ...overrides };
    const encoded = new URLSearchParams();
    Object.entries(values).forEach(([key, value]) => value && encoded.set(key, value));
    return journalListHref(locale, encoded.size ? `?${encoded.toString()}` : "");
  };

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 100, minHeight: "80vh", background: "#f8f9fa", paddingBottom: 60 }}>
        <div className="container">
          <header style={{ textAlign: "center", maxWidth: 720, margin: "0 auto 32px" }}>
            <span className="badge badge-primary">{labels.badge}</span>
            <h1 style={{ color: "#1a2b4c", margin: "16px 0" }}>{labels.title}</h1>
            <p style={{ color: "#64748b" }}>{labels.copy}</p>
          </header>
          <form action={journalListHref(locale)} className="journal-filter-form">
            <label style={{ position: "relative" }}>
              <Search aria-hidden size={18} style={{ position: "absolute", left: 14, top: 13, color: "#64748b" }} />
              <input
                aria-label={labels.search}
                defaultValue={q}
                name="q"
                placeholder={labels.search}
                style={{ width: "100%", padding: "12px 14px 12px 42px", border: "1px solid #dbe2ea", borderRadius: 8 }}
              />
            </label>
            <select
              aria-label={labels.allYears}
              defaultValue={year}
              name="year"
              style={{ border: "1px solid #dbe2ea", borderRadius: 8, padding: "0 12px" }}
            >
              <option value="">{labels.allYears}</option>
              {years.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
            <select
              aria-label={labels.all}
              defaultValue={categorySlug}
              name="kategori"
              style={{ border: "1px solid #dbe2ea", borderRadius: 8, padding: "0 12px" }}
            >
              <option value="">{labels.all}</option>
              {categories.map((category: any) => (
                <option key={category.id} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
            <button className="btn btn-primary" type="submit">
              {locale === "en" ? "Search" : "Cari"}
            </button>
          </form>
          {(q || year || categorySlug) && (
            <p style={{ margin: "-16px 0 24px", textAlign: "right" }}>
              <Link href={journalListHref(locale)} style={{ color: "var(--color-primary-600)" }}>
                {labels.reset}
              </Link>
            </p>
          )}
          {journals.length === 0 ? (
            <div className="card" style={{ textAlign: "center", padding: 48 }}>
              <BookOpen size={48} color="#94a3b8" />
              <h2>{labels.empty}</h2>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 290px), 1fr))",
                gap: 24,
              }}
            >
              {journals.map((journal) => {
                const cover =
                  mediaURL(journal.coverImage) || (typeof journal.coverImage === "string" ? journal.coverImage : null);
                const authors = journalAuthors(journal);
                const category = typeof journal.category === "object" ? journal.category : null;
                return (
                  <article
                    className="card"
                    key={journal.id}
                    style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}
                  >
                    <div
                      style={{
                        height: "190px",
                        width: "100%",
                        background: "#f1f5f9",
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      {cover ? (
                        <img
                          alt={mediaAlt(journal.coverImage, journal.title)}
                          src={cover}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            objectPosition: "center top",
                            display: "block",
                          }}
                        />
                      ) : (
                        <FileText
                          aria-hidden
                          size={40}
                          style={{ color: "#4f6f9f", position: "absolute", inset: 0, margin: "auto" }}
                        />
                      )}
                    </div>
                    <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        {category?.name && <span className="badge badge-primary">{category.name}</span>}
                        {journal.publicationYear && (
                          <span style={{ color: "#64748b", fontSize: 13 }}>{journal.publicationYear}</span>
                        )}
                      </div>
                      <h2 style={{ fontSize: 19, lineHeight: 1.35, margin: 0, color: "#1a2b4c" }}>{journal.title}</h2>
                      <p style={{ color: "#64748b", fontSize: 14, margin: 0 }}>
                        {authors.map((author: any) => author.name).join(", ") || "Mahaga Widya Cita"}
                      </p>
                      <p style={{ color: "#64748b", fontSize: 13, marginTop: "auto" }}>
                        <Calendar size={14} style={{ verticalAlign: "text-bottom", marginRight: 5 }} />
                        {new Date(journal.publishedAt || journal.createdAt).toLocaleDateString(dateLocale, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                      <Link className="btn btn-outline" href={journalHref(locale, journal.slug || journal.id)}>
                        {labels.read}
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
          {result.totalPages > 1 && (
            <nav aria-label="Pagination" style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 36 }}>
              {result.hasPrevPage && (
                <Link className="btn btn-outline" href={buildHref({ page: String(result.prevPage) })}>
                  ←
                </Link>
              )}
              <span style={{ alignSelf: "center" }}>
                {labels.page} {result.page} / {result.totalPages}
              </span>
              {result.hasNextPage && (
                <Link className="btn btn-outline" href={buildHref({ page: String(result.nextPage) })}>
                  →
                </Link>
              )}
            </nav>
          )}
        </div>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
