import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import RichTextRenderer from "@/components/RichTextRenderer";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, User, Share2, Link as LinkIcon, BookOpen, ArrowRight } from "lucide-react";
import { IconLinkedin, IconXTwitter } from "@/components/icons/SocialIcons";

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

  // Fetch related articles
  const categoryId = typeof article.category === 'object' && article.category ? article.category.id : article.category;
  
  let relatedDocs: any[] = [];
  if (categoryId) {
    const { docs: rel } = await payload.find({
      collection: "articles",
      where: {
        id: { not_equals: article.id },
        category: { equals: categoryId },
        status: { equals: "published" },
      },
      sort: "-publishedAt",
      limit: 3,
    });
    relatedDocs = rel;
  }
  
  if (relatedDocs.length < 3) {
    const { docs: relFallback } = await payload.find({
      collection: "articles",
      where: {
        id: { not_equals: article.id },
        status: { equals: "published" },
      },
      sort: "-publishedAt",
      limit: 3 - relatedDocs.length,
    });
    relatedDocs = [...relatedDocs, ...relFallback];
  }

  const shareUrl = `https://mahagawidyacita.co.id/artikel/${article.slug}`;

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
              <div style={{ position: "relative", width: "100%", height: "400px", borderRadius: "12px", overflow: "hidden", marginBottom: "2.5rem" }}>
                <Image src={article.imageUrl} alt={article.title} fill style={{ objectFit: "cover" }} priority sizes="100vw" />
              </div>
            )}

            <div className="article-content">
              <RichTextRenderer content={article.content} />
            </div>
            
            {/* Share Section */}
            <div style={{ marginTop: "3rem", paddingTop: "2rem", borderTop: "1px solid #f1f5f9", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontWeight: 600, color: "#1a2b4c" }}>
                <Share2 size={20} color="var(--color-primary-600)" />
                Bagikan Artikel:
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="share-link-facebook" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "#f1f5f9", color: "#64748b", transition: "all 0.2s" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                </a>
                <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(article.title)}`} target="_blank" rel="noopener noreferrer" className="share-link-twitter" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "#f1f5f9", color: "#64748b", transition: "all 0.2s" }}>
                  <IconXTwitter size={18} />
                </a>
                <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(article.title)}`} target="_blank" rel="noopener noreferrer" className="share-link-linkedin" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "#f1f5f9", color: "#64748b", transition: "all 0.2s" }}>
                  <IconLinkedin size={18} />
                </a>
                <a href={`mailto:?subject=${encodeURIComponent(article.title)}&body=${encodeURIComponent(shareUrl)}`} className="share-link-email" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "#f1f5f9", color: "#64748b", transition: "all 0.2s" }}>
                  <LinkIcon size={18} />
                </a>
              </div>
            </div>
          </div>
          
          {/* Related Articles Section */}
          {relatedDocs.length > 0 && (
            <div style={{ marginTop: "4rem" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem" }}>
                <h3 style={{ fontSize: "1.5rem", color: "#1a2b4c", fontWeight: 700, margin: 0 }}>Baca Juga</h3>
                <Link href="/artikel" style={{ color: "var(--color-primary-600)", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.9rem", textDecoration: "none" }}>
                  Lihat Semua <ArrowRight size={16} />
                </Link>
              </div>
              
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1.5rem" }}>
                {relatedDocs.map((rel: any) => (
                  <Link key={rel.id} href={`/artikel/${rel.slug || rel.id}`} style={{ textDecoration: "none", display: "block" }}>
                    <div className="card" style={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
                      <div style={{ 
                        height: "150px", 
                        backgroundColor: "#e2e8f0", 
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#94a3b8",
                        overflow: "hidden", position: "relative" }}>
                        {rel.imageUrl ? (
                          <Image src={rel.imageUrl} alt={rel.title} fill style={{ objectFit: "cover" }} sizes="(max-width: 768px) 100vw, 33vw" />
                        ) : (
                          <BookOpen size={24} />
                        )}
                      </div>
                      
                      <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", flexGrow: 1 }}>
                        <h4 style={{ fontSize: "1.05rem", color: "#1a2b4c", marginBottom: "0.5rem", lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", fontWeight: 700 }}>
                          {rel.title}
                        </h4>
                        <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "auto", paddingTop: "0.75rem" }}>
                          {new Date(rel.publishedAt || rel.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
