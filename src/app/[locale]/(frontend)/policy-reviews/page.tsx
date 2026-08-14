import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import Link from "next/link";
import { ArrowRight, FileText, Download } from "lucide-react";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import type { Metadata } from "next";
import { localizedAlternates } from "@/utils/seo";
import { isLikelyEnglishDocument } from "@/utils/contentLanguage";

export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";
  return {
    title: isEn ? "Policy Reviews" : "Kajian Kebijakan",
    description: isEn
      ? "Policy analysis and comprehensive reviews by PT Mahaga Widya Cita experts."
      : "Analisis kebijakan dan kajian komprehensif oleh pakar PT Mahaga Widya Cita.",
    alternates: localizedAlternates(locale, "/policy-reviews"),
  };
}

export default async function PolicyReviewsPage(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params;
  const payload = await getPayload({ config: configPromise });
  const isEn = params.locale === "en";

  let featureSettings: any = null;
  try {
    featureSettings = await payload.findGlobal({ slug: "pengaturan-fitur" as any });
  } catch (e) {
    // fallback
  }

  if (featureSettings?.enablePolicyReviews === false) {
    return (
      <>
        <Navbar />
        <main
          style={{
            paddingTop: "140px",
            minHeight: "75vh",
            backgroundColor: "#f8fafc",
            paddingBottom: "80px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div className="container" style={{ maxWidth: "600px", textAlign: "center" }}>
            <div
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "24px",
                padding: "48px 32px",
                boxShadow: "0 20px 40px -15px rgba(0,0,0,0.07)",
                border: "1px solid #e2e8f0",
              }}
            >
              <div
                style={{
                  width: "72px",
                  height: "72px",
                  borderRadius: "50%",
                  backgroundColor: "#fef2f2",
                  color: "#ef4444",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 24px auto",
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "36px" }}>
                  lock
                </span>
              </div>

              <h2 style={{ color: "#0f172a", fontSize: "1.75rem", fontWeight: 700, marginBottom: "12px" }}>
                {isEn ? "Service Unavailable" : "Layanan Tidak Tersedia"}
              </h2>

              <p style={{ color: "#64748b", fontSize: "1rem", lineHeight: 1.6, marginBottom: "28px" }}>
                {isEn
                  ? "The Policy Review feature is currently deactivated by the Administrator. Please contact the site administrator or return to the homepage."
                  : "Fitur Policy Review saat ini sedang dinonaktifkan oleh Administrator. Silakan hubungi Administrator Sistem atau kembali ke halaman utama."}
              </p>

              <Link
                href={`/${params.locale}`}
                className="btn btn-primary"
                style={{ padding: "12px 28px", borderRadius: "12px", textDecoration: "none", fontWeight: 600 }}
              >
                {isEn ? "Back to Homepage" : "Kembali ke Beranda"}
              </Link>
            </div>
          </div>
        </main>
        <Footer locale={params.locale} />
        <WhatsAppFloat locale={params.locale} />
      </>
    );
  }

  const { docs } = await payload.find({
    collection: "policy-reviews",
    where: { status: { equals: "published" } },
    sort: "-createdAt",
    locale: params.locale as any,
    fallbackLocale: "none" as any,
  });
  const reviews = isEn
    ? docs.filter((review) =>
        isLikelyEnglishDocument({ title: review.title, excerpt: review.excerpt, content: review.summary }),
      )
    : docs;

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: "100px", minHeight: "80vh", backgroundColor: "#f8f9fa", paddingBottom: "60px" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <span className="badge badge-secondary" style={{ marginBottom: "1rem" }}>
              {isEn ? "Publications" : "Publikasi"}
            </span>
            <h1 style={{ color: "#1a2b4c", marginBottom: "1rem" }}>{isEn ? "Policy Reviews" : "Kajian Kebijakan"}</h1>
            <p style={{ color: "#666", maxWidth: "600px", margin: "0 auto" }}>
              {isEn
                ? "Studies, analyses, and executive summaries on public policy and government regulation prepared by our experts."
                : "Kajian, analisis, dan ringkasan eksekutif terkait kebijakan publik dan regulasi pemerintah yang disusun oleh para ahli kami."}
            </p>
          </div>

          {reviews.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "40px",
                backgroundColor: "#fff",
                borderRadius: "16px",
                border: "1px solid #eee",
              }}
            >
              <FileText size={48} color="#ccc" style={{ marginBottom: "16px" }} />
              <h3>{isEn ? "No policy reviews yet" : "Belum ada kajian kebijakan"}</h3>
              <p style={{ color: "#666" }}>
                {isEn
                  ? "New policy documents will be published here."
                  : "Dokumen kebijakan terbaru akan segera dipublikasikan."}
              </p>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: "1.5rem",
                maxWidth: "800px",
                margin: "0 auto",
              }}
            >
              {reviews.map((review: any) => (
                <div
                  key={review.id}
                  className="card"
                  style={{ display: "flex", gap: "1.5rem", alignItems: "center", padding: "1.5rem" }}
                >
                  <div
                    style={{
                      width: "80px",
                      height: "80px",
                      backgroundColor: "var(--color-primary-50)",
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--color-primary-600)",
                      flexShrink: 0,
                    }}
                  >
                    <FileText size={32} />
                  </div>

                  <div style={{ flexGrow: 1 }}>
                    <h3 style={{ fontSize: "1.25rem", color: "#1a2b4c", marginBottom: "0.5rem" }}>{review.title}</h3>
                    <div style={{ fontSize: "0.85rem", color: "#64748b", marginBottom: "0.5rem" }}>
                      Oleh:{" "}
                      {typeof review.author === "object" && review.author ? review.author.name || "Admin" : "Admin"} |{" "}
                      {new Date(review.createdAt).toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "1rem", flexShrink: 0 }}>
                    <Link
                      href={`/${params.locale}/policy-reviews/${review.slug || review.id}`}
                      className="btn btn-outline"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        padding: "0.5rem 1rem",
                        fontSize: "0.9rem",
                      }}
                    >
                      Baca Ringkasan <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer locale={params.locale} />
      <WhatsAppFloat locale={params.locale} />
    </>
  );
}
