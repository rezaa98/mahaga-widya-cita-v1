import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { notFound } from "next/navigation";
import { CheckCircle2, ArrowRight, MessageSquare } from "lucide-react";
import Link from "next/link";
import { getPayload } from "payload";
import configPromise from "@payload-config";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const payload = await getPayload({ config: configPromise });
  const result = await payload.find({
    collection: 'services',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
  });

  const service = result.docs[0];

  if (!service) {
    return { title: "Layanan Tidak Ditemukan" };
  }

  return {
    title: `${service.title} | Mahaga Widya Cita`,
    description: service.description,
  };
}

export default async function LayananDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const payload = await getPayload({ config: configPromise });
  const result = await payload.find({
    collection: 'services',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
  });

  const service = result.docs[0];

  if (!service) {
    notFound();
  }

  return (
    <>
      <Navbar />

      {/* HERO SECTION */}
      <section style={{ background: service.gradient, paddingTop: "calc(72px + 4rem)", paddingBottom: "4rem", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 80% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)", pointerEvents: "none" }} />
        <div className="container" style={{ position: "relative" }}>
          <div style={{ maxWidth: "800px" }}>
            <div className="badge" style={{ background: "rgba(255,255,255,0.2)", color: "white", marginBottom: "1.25rem" }}>
              Layanan Utama
            </div>
            <h1 className="text-display" style={{ color: "white", marginBottom: "1rem" }}>
              {service.title}
            </h1>
            <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "1.25rem", fontWeight: "500", marginBottom: "1.5rem" }}>
              {service.tagline}
            </p>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "1.0625rem", lineHeight: "1.7", maxWidth: "680px", marginBottom: "2rem" }}>
              {service.description}
            </p>
            <div style={{ display: "flex", gap: "1rem" }}>
              <Link href="/kontak" className="btn" style={{ background: "white", color: service.color, border: "none" }}>
                Konsultasikan Sekarang <ArrowRight size={18} style={{ marginLeft: "0.5rem" }} />
              </Link>
            </div>
          </div>
        </div>
        
        {/* Wave Divider */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, lineHeight: 0 }}>
          <svg viewBox="0 0 1440 48" style={{ display: "block", width: "100%", height: "48px" }}>
            <path d="M0,48 L1440,48 L1440,16 Q1080,48 720,24 Q360,0 0,24 Z" fill="var(--color-neutral-50)" />
          </svg>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="section" style={{ background: "var(--color-neutral-50)" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "4rem" }}>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "start" }}>
              {/* Features List */}
              <div className="card" style={{ padding: "2.5rem" }}>
                <h2 style={{ fontSize: "1.5rem", marginBottom: "1.5rem", color: "var(--color-neutral-900)" }}>
                  Fitur Layanan
                </h2>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  {service.features?.map((f: any, idx: number) => (
                    <li key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
                      <div style={{ flexShrink: 0, width: "28px", height: "28px", borderRadius: "50%", background: "rgba(30, 111, 217, 0.1)", color: "var(--color-primary-600)", display: "flex", alignItems: "center", justifyContent: "center", marginTop: "2px" }}>
                        <CheckCircle2 size={18} />
                      </div>
                      <span style={{ fontSize: "1.0625rem", color: "var(--color-neutral-700)", lineHeight: "1.6" }}>
                        {f.feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Benefits */}
              <div>
                <h2 style={{ fontSize: "1.5rem", marginBottom: "1.5rem", color: "var(--color-neutral-900)" }}>
                  Keuntungan bagi Instansi Anda
                </h2>
                <div style={{ display: "grid", gap: "1.5rem" }}>
                  {service.benefits?.map((b: any, idx: number) => (
                    <div key={idx} className="card" style={{ padding: "1.5rem", borderLeft: `4px solid ${service.color}` }}>
                      <h3 style={{ fontSize: "1.125rem", marginBottom: "0.5rem" }}>{b.title}</h3>
                      <p style={{ color: "var(--color-neutral-600)", fontSize: "0.9375rem" }}>{b.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Target Audience */}
            <div className="card" style={{ padding: "3rem", background: "white", textAlign: "center" }}>
              <div className="badge" style={{ background: "rgba(30,111,217,0.1)", color: "var(--color-primary-600)", marginBottom: "1rem" }}>
                Kesesuaian
              </div>
              <h2 style={{ fontSize: "1.75rem", marginBottom: "2rem" }}>
                Siapa yang Membutuhkan Layanan Ini?
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem" }}>
                {service.targetAudience?.map((ta: any, idx: number) => (
                  <div key={idx} style={{ background: "var(--color-neutral-50)", padding: "1.5rem", borderRadius: "12px", border: "1px solid var(--color-neutral-200)" }}>
                    <span style={{ fontWeight: "500", color: "var(--color-neutral-800)" }}>{ta.audience}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section" style={{ background: "white" }}>
        <div className="container">
          <div className="card" style={{ padding: "4rem", textAlign: "center", background: service.gradient, color: "white" }}>
            <MessageSquare size={48} style={{ opacity: 0.8, margin: "0 auto 1.5rem" }} />
            <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Mulai Transformasi Instansi Anda</h2>
            <p style={{ fontSize: "1.125rem", opacity: 0.85, maxWidth: "600px", margin: "0 auto 2rem" }}>
              Diskusikan kebutuhan spesifik Anda dengan tim konsultan kami. Kami siap memberikan solusi yang terukur dan berdampak nyata.
            </p>
            <Link href="/kontak" className="btn" style={{ background: "white", color: service.color, fontSize: "1.0625rem", padding: "0.875rem 2rem", border: "none" }}>
              Hubungi Konsultan Kami
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </>
  );
}
