import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import RichTextRenderer from "@/components/RichTextRenderer";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, User } from "lucide-react";

export const dynamic = "force-dynamic";


export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const payload = await getPayload({ config: configPromise });
  const { docs } = await payload.find({
    collection: "articles",
    where: {
      slug: {
        equals: resolvedParams.slug,
      },
    },
  });

  if (!docs || docs.length === 0) {
    return { title: "Artikel Tidak Ditemukan" };
  }

  const article = docs[0];
  const imageUrl = typeof article.featuredImage === 'object' && article.featuredImage?.url 
    ? article.featuredImage.url 
    : undefined;

  return {
    title: `${article.title}`,
    description: article.excerpt || `Baca selengkapnya mengenai ${article.title} di Mahaga Widya Cita.`,
    openGraph: {
      title: article.title,
      description: article.excerpt || `Baca selengkapnya mengenai ${article.title} di Mahaga Widya Cita.`,
      url: `https://mahagawidyacita.co.id/artikel/${article.slug}`,
      type: 'article',
      publishedTime: article.publishedAt || article.createdAt,
      images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630 }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt || `Baca selengkapnya mengenai ${article.title} di Mahaga Widya Cita.`,
      images: imageUrl ? [imageUrl] : [],
    }
  };
}

export default async function ArticleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const payload = await getPayload({ config: configPromise });
  const { docs } = await payload.find({
    collection: "articles",
    where: {
      slug: {
        equals: resolvedParams.slug,
      },
    },
  });

  if (!docs || docs.length === 0) {
    notFound();
  }

  const article: any = docs[0];

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: "120px", minHeight: "100vh", backgroundColor: "#f8f9fa", paddingBottom: "60px" }}>
        <div className="container" style={{ maxWidth: "800px" }}>
          <Link href="/artikel" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "var(--color-primary-600)", textDecoration: "none", marginBottom: "2rem", fontWeight: 500 }}>
            <ArrowLeft size={16} /> Kembali ke Artikel
          </Link>
          
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
              {typeof article.category === 'object' && article.category ? article.category.name : 'UMUM'}
            </span>
            
            <h1 style={{ color: "#1a2b4c", marginBottom: "1.5rem", fontSize: "2.5rem", lineHeight: 1.2 }}>
              {article.title}
            </h1>
            
            <div style={{ display: "flex", gap: "2rem", marginBottom: "2rem", color: "#64748b", fontSize: "0.95rem", borderBottom: "1px solid #f1f5f9", paddingBottom: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <User size={16} />
                <span>{typeof article.author === 'object' && article.author ? article.author.name || 'Admin' : 'Admin'}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Calendar size={16} />
                <span>{new Date(article.publishedAt || article.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            </div>

            {article.imageUrl && (
              <div style={{ width: "100%", height: "400px", borderRadius: "12px", overflow: "hidden", marginBottom: "2.5rem" }}>
                <Image src={article.imageUrl} alt={article.title} fill style={{ objectFit: "cover" }} priority sizes="100vw" />
              </div>
            )}

            <div className="article-content">
              <RichTextRenderer content={article.content} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
