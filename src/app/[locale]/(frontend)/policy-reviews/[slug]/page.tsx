import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import RichTextRenderer from "@/components/RichTextRenderer";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, User, Download, FileText } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export const dynamic = "force-dynamic";


export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const resolvedParams = await params;
  const payload = await getPayload({ config: configPromise });
  const { docs } = await payload.find({
    collection: "policy-reviews",
    where: {
      and: [
        { slug: { equals: resolvedParams.slug } },
        { status: { equals: "published" } },
      ],
    },
    locale: resolvedParams.locale as any,
  });

  if (!docs || docs.length === 0) {
    return { title: "Policy Review Tidak Ditemukan" };
  }

  const review: any = docs[0];
  const title = review.meta?.title || review.title;
  const description = review.meta?.description || review.excerpt || `Baca analisis kebijakan publik "${review.title}" di Mahaga Widya Cita.`;
  const imageUrl = review.meta?.image ? (typeof review.meta.image === 'object' ? review.meta.image.url : null) : null;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://mahagawidyacita.co.id/${resolvedParams.locale}/policy-reviews/${review.slug}`,
      type: 'article',
      publishedTime: review.publishedAt || review.createdAt,
      images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630 }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: imageUrl ? [imageUrl] : [],
    }
  };
}

export default async function PolicyReviewDetailPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const resolvedParams = await params;
  const payload = await getPayload({ config: configPromise });
  const { docs } = await payload.find({
    collection: "policy-reviews",
    where: {
      and: [
        { slug: { equals: resolvedParams.slug } },
        { status: { equals: "published" } },
      ],
    },
    locale: resolvedParams.locale as any,
  });

  if (!docs || docs.length === 0) {
    notFound();
  }

  const review: any = docs[0];
  const documentUrl = typeof review.document === 'object' && review.document ? review.document.url : null;
  const isEn = resolvedParams.locale === 'en';

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: "120px", minHeight: "100vh", backgroundColor: "#f8f9fa", paddingBottom: "60px" }}>
        <div className="container" style={{ maxWidth: "800px" }}>
          <Breadcrumbs items={[
            { label: isEn ? 'Policy Reviews' : 'Daftar Review', href: `/${resolvedParams.locale}/policy-reviews` },
            { label: review.title }
          ]} />
          
          <div style={{ backgroundColor: "#fff", padding: "40px", borderRadius: "16px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
            <span style={{ 
              fontSize: "0.85rem", 
              fontWeight: 600, 
              color: "var(--color-primary-600)", 
              backgroundColor: "var(--color-primary-100)", 
              padding: "0.3rem 0.85rem", 
              borderRadius: "100px",
              display: "inline-block",
              marginBottom: "1.5rem"
            }}>
              Policy Review
            </span>
            
            <h1 style={{ color: "#1a2b4c", marginBottom: "1.5rem", fontSize: "2.5rem", lineHeight: 1.2 }}>
              {review.title}
            </h1>
            
            <div style={{ display: "flex", gap: "2rem", marginBottom: "2rem", color: "#64748b", fontSize: "0.95rem", borderBottom: "1px solid #f1f5f9", paddingBottom: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <User size={16} />
                <span>{typeof review.author === 'object' && review.author ? review.author.name || 'Admin' : 'Admin'}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Calendar size={16} />
                <span>{new Date(review.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            </div>

            {documentUrl && (
              <div style={{ 
                backgroundColor: "#f1f5f9", 
                padding: "1.5rem", 
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "2rem"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <FileText size={32} color="var(--color-primary-500)" />
                  <div>
                    <h4 style={{ margin: 0, color: "#1a2b4c", fontSize: "1.1rem" }}>Dokumen Lengkap</h4>
                    <span style={{ fontSize: "0.85rem", color: "#64748b" }}>PDF Download</span>
                  </div>
                </div>
                <a 
                  href={documentUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
                >
                  <Download size={16} /> Unduh PDF
                </a>
              </div>
            )}

            <div className="article-content">
              <h3>Ringkasan Eksekutif</h3>
              <RichTextRenderer content={review.summary} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
