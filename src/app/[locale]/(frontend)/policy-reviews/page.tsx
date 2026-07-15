import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import Link from "next/link";
import { ArrowRight, FileText, Download } from "lucide-react";
import { getPayload } from "payload";
import configPromise from "@payload-config";

export const dynamic = "force-dynamic";


export const metadata = {
  title: "Policy Reviews | Mahaga Widya Cita",
  description: "Dokumen analisis kebijakan dan review komprehensif oleh pakar PT Mahaga Widya Cita.",
};

export default async function PolicyReviewsPage(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params;
  const payload = await getPayload({ config: configPromise });
  
  const { docs: reviews } = await payload.find({
    collection: "policy-reviews",
    sort: "-createdAt",
    locale: params.locale as any,
  });

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: "100px", minHeight: "80vh", backgroundColor: "#f8f9fa", paddingBottom: "60px" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <span className="badge badge-secondary" style={{ marginBottom: "1rem" }}>Layanan Publikasi</span>
            <h1 style={{ color: "#1a2b4c", marginBottom: "1rem" }}>Policy Reviews</h1>
            <p style={{ color: "#666", maxWidth: "600px", margin: "0 auto" }}>
              Kajian, analisis, dan ringkasan eksekutif terkait kebijakan publik dan regulasi pemerintah yang disusun oleh para ahli kami.
            </p>
          </div>

          {reviews.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px", backgroundColor: "#fff", borderRadius: "16px", border: "1px solid #eee" }}>
              <FileText size={48} color="#ccc" style={{ marginBottom: "16px" }} />
              <h3>Belum ada Policy Review</h3>
              <p style={{ color: "#666" }}>Dokumen kebijakan terbaru akan segera dipublikasikan.</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.5rem", maxWidth: "800px", margin: "0 auto" }}>
              {reviews.map((review: any) => (
                <div key={review.id} className="card" style={{ display: "flex", gap: "1.5rem", alignItems: "center", padding: "1.5rem" }}>
                  <div style={{ 
                    width: "80px", 
                    height: "80px", 
                    backgroundColor: "var(--color-primary-50)", 
                    borderRadius: "12px", 
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--color-primary-600)",
                    flexShrink: 0
                  }}>
                    <FileText size={32} />
                  </div>
                  
                  <div style={{ flexGrow: 1 }}>
                    <h3 style={{ fontSize: "1.25rem", color: "#1a2b4c", marginBottom: "0.5rem" }}>{review.title}</h3>
                    <div style={{ fontSize: "0.85rem", color: "#64748b", marginBottom: "0.5rem" }}>
                      Oleh: {typeof review.author === 'object' && review.author ? review.author.name || 'Admin' : 'Admin'} | {new Date(review.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                  </div>
                  
                  <div style={{ display: "flex", gap: "1rem", flexShrink: 0 }}>
                    <Link href={`/policy-reviews/${review.slug || review.id}`} className="btn btn-outline" style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1rem", fontSize: "0.9rem" }}>
                      Baca Ringkasan <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
