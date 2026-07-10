import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { getPayload } from "payload";
import configPromise from "@payload-config";

export const metadata = {
  title: "Artikel & Wawasan | Mahaga Widya Cita",
  description: "Kumpulan artikel, insight, dan berita terbaru dari PT Mahaga Widya Cita.",
};

export default async function ArtikelPage() {
  const payload = await getPayload({ config: configPromise });
  
  const { docs: articles } = await payload.find({
    collection: "articles",
    where: {
      status: {
        equals: "published",
      },
    },
    sort: "-publishedAt",
  });

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: "100px", minHeight: "80vh", backgroundColor: "#f8f9fa", paddingBottom: "60px" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <span className="badge badge-primary" style={{ marginBottom: "1rem" }}>Artikel & Insight</span>
            <h1 style={{ color: "#1a2b4c", marginBottom: "1rem" }}>Wawasan Terbaru</h1>
            <p style={{ color: "#666", maxWidth: "600px", margin: "0 auto" }}>
              Temukan informasi terkini, analisis mendalam, dan berita terbaru seputar teknologi, bisnis, dan pemerintahan.
            </p>
          </div>

          {articles.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px", backgroundColor: "#fff", borderRadius: "16px", border: "1px solid #eee" }}>
              <BookOpen size={48} color="#ccc" style={{ marginBottom: "16px" }} />
              <h3>Belum ada artikel</h3>
              <p style={{ color: "#666" }}>Artikel terbaru akan segera hadir.</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
              {articles.map((article: any) => (
                <Link key={article.id} href={`/artikel/${article.slug || article.id}`} style={{ textDecoration: "none", display: "block" }}>
                  <div className="card" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
                    <div style={{ 
                      height: "200px", 
                      backgroundColor: "#e2e8f0", 
                      borderRadius: "8px", 
                      marginBottom: "1rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#94a3b8",
                      overflow: "hidden", position: "relative" }}>
                      {article.imageUrl ? (
                        <Image src={article.imageUrl} alt={article.title} fill style={{ objectFit: "cover" }} sizes="(max-width: 768px) 100vw, 33vw" />
                      ) : (
                        <span>[Image Placeholder]</span>
                      )}
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.75rem", flexWrap: "wrap" }}>
                      <span style={{ 
                        fontSize: "0.75rem", 
                        fontWeight: 600, 
                        color: "var(--color-primary-600)", 
                        backgroundColor: "var(--color-primary-100)", 
                        padding: "0.25rem 0.75rem", 
                        borderRadius: "100px" 
                      }}>
                        {typeof article.category === 'object' && article.category ? article.category.name : 'UMUM'}
                      </span>
                    </div>
                    <h3 style={{ fontSize: "1.25rem", color: "#1a2b4c", marginBottom: "0.75rem", flexGrow: 1 }}>{article.title}</h3>
                    <p style={{ color: "#666", fontSize: "0.9rem", marginBottom: "1rem", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden", position: "relative" }}>
                      Klik untuk membaca selengkapnya...
                    </p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #f1f5f9", paddingTop: "1rem", marginTop: "auto" }}>
                      <div>
                        <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#334155" }}>
                          {typeof article.author === 'object' && article.author ? article.author.name || 'Admin' : 'Admin'}
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                          {new Date(article.publishedAt || article.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                      </div>
                      <span style={{ color: "var(--color-primary-500)", display: "flex", alignItems: "center", gap: "4px", fontSize: "0.85rem", fontWeight: 600 }}>
                        Baca <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </Link>
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
