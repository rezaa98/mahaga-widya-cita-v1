import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { notFound } from "next/navigation";
import { CheckCircle2, ArrowRight, MessageSquare } from "lucide-react";
import Link from "next/link";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import { WaveDivider } from "@/components/ui/WaveDivider";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string, locale: string }> }): Promise<Metadata> {
  const { slug, locale } = await params;
  const isEn = locale === 'en';
  const payload = await getPayload({ config: configPromise });
  const result = await payload.find({
    collection: 'services',
    where: {
      slug: {
        equals: slug,
      },
    },
    locale: locale as any,
    limit: 1,
  });

  const service: any = result.docs[0];

  if (!service) {
    return { title: isEn ? "Service Not Found" : "Layanan Tidak Ditemukan" };
  }

  const title = service.meta?.title || `${service.title} | Mahaga Widya Cita`;
  const description = service.meta?.description || service.description;
  const imageUrl = service.meta?.image ? (typeof service.meta.image === 'object' ? service.meta.image.url : null) : null;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://mahagawidyacita.co.id/${locale}/layanan/${service.slug}`,
      type: 'website',
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

export default async function LayananDetail({ params }: { params: Promise<{ slug: string, locale: string }> }) {
  const { slug, locale } = await params;
  const isEn = locale === 'en';
  const payload = await getPayload({ config: configPromise });
  const result = await payload.find({
    collection: 'services',
    where: {
      slug: {
        equals: slug,
      },
    },
    locale: locale as any,
    limit: 1,
  });

  const service = result.docs[0];

  if (!service) {
    notFound();
  }

  const benefits = service.benefits ?? [];
  const targetAudience = service.targetAudience ?? [];

  return (
    <>
      <Navbar />

      {/* HERO SECTION */}
      <section style={{ background: service.gradient, paddingTop: "calc(72px + 4rem)", paddingBottom: "4rem", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 80% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)", pointerEvents: "none" }} />
        <div className="container" style={{ position: "relative" }}>
          <Breadcrumbs items={[
            { label: isEn ? 'Services' : 'Layanan', href: `/${locale}/layanan` },
            { label: service.title }
          ]} />
          
          <div style={{ maxWidth: "800px" }}>
            <div className="badge" style={{ background: "rgba(255,255,255,0.2)", color: "white", marginBottom: "1.25rem" }}>
              {isEn ? 'Core Service' : 'Layanan Utama'}
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
              <Link href={`/${locale}/kontak`} className="btn" style={{ background: "white", color: service.color, border: "none" }}>
                {isEn ? 'Consult Now' : 'Konsultasikan Sekarang'} <ArrowRight size={18} style={{ marginLeft: "0.5rem" }} />
              </Link>
            </div>
          </div>
        </div>
        
        {/* Wave Divider */}
        <WaveDivider fill="var(--color-neutral-50)" />
      </section>

      {/* MAIN CONTENT */}
      <section className="section" style={{ background: "var(--color-neutral-50)" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "4rem" }}>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "start" }}>
              {/* Features List */}
              <div className="card" style={{ padding: "2.5rem" }}>
                <h2 style={{ fontSize: "1.5rem", marginBottom: "1.5rem", color: "var(--color-neutral-900)" }}>
                  {isEn ? 'Service Features' : 'Fitur Layanan'}
                </h2>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  {service.features?.map((f: any, idx: number) => (
                    <li key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
                      <div style={{ flexShrink: 0, width: "28px", height: "28px", borderRadius: "50%", background: "rgba(30, 111, 217, 0.1)", color: "var(--color-primary-600)", display: "flex", alignItems: "center", justifyContent: "center", marginTop: "2px" }}>
                        <CheckCircle2 size={18} />
                      </div>
                      <span style={{ fontSize: "1.0625rem", color: "var(--color-neutral-700)", lineHeight: "1.6" }}>
                        {f.feature || f.title || f.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Benefits */}
              {benefits.length > 0 && (
                <div>
                  <h2 style={{ fontSize: "1.5rem", marginBottom: "1.5rem", color: "var(--color-neutral-900)" }}>
                    {isEn ? 'Benefits for Your Institution' : 'Keuntungan bagi Instansi Anda'}
                  </h2>
                  <div style={{ display: "grid", gap: "1.5rem" }}>
                    {benefits.map((b: any, idx: number) => (
                      <div key={idx} className="card" style={{ padding: "1.5rem", borderLeft: `4px solid ${service.color}` }}>
                        <h3 style={{ fontSize: "1.125rem", marginBottom: "0.5rem" }}>{b.title}</h3>
                        <p style={{ color: "var(--color-neutral-600)", fontSize: "0.9375rem" }}>{b.desc || b.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Target Audience */}
            {targetAudience.length > 0 && (
              <div className="card" style={{ padding: "3rem", background: "white", textAlign: "center" }}>
                <div className="badge" style={{ background: "rgba(30,111,217,0.1)", color: "var(--color-primary-600)", marginBottom: "1rem", display: "inline-block" }}>
                  {isEn ? 'Suitability' : 'Kesesuaian'}
                </div>
                <h2 style={{ fontSize: "1.75rem", marginBottom: "2rem" }}>
                  {isEn ? 'Who Needs This Service?' : 'Siapa yang Membutuhkan Layanan Ini?'}
                </h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem" }}>
                  {targetAudience.map((ta: any, idx: number) => (
                    <div key={idx} style={{ background: "var(--color-neutral-50)", padding: "1.5rem", borderRadius: "12px", border: "1px solid var(--color-neutral-200)" }}>
                      <span style={{ fontWeight: "500", color: "var(--color-neutral-800)" }}>{ta.audience}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section" style={{ background: "white" }}>
        <div className="container">
          <div className="card" style={{ padding: "4rem", textAlign: "center", background: service.gradient, color: "white" }}>
            <MessageSquare size={48} style={{ opacity: 0.8, margin: "0 auto 1.5rem" }} />
            <h2 style={{ fontSize: "2rem", marginBottom: "1rem", color: "white" }}>
              {isEn ? 'Start Your Institutional Transformation' : 'Mulai Transformasi Instansi Anda'}
            </h2>
            <p style={{ fontSize: "1.125rem", color: "white", opacity: 0.85, maxWidth: "600px", margin: "0 auto 2rem" }}>
              {isEn
                ? 'Discuss your specific needs with our consultant team. We are ready to provide measurable and impactful solutions.'
                : 'Diskusikan kebutuhan spesifik Anda dengan tim konsultan kami. Kami siap memberikan solusi yang terukur dan berdampak nyata.'}
            </p>
            <Link href={`/${locale}/kontak`} className="btn" style={{ background: "white", color: service.color, fontSize: "1.0625rem", padding: "0.875rem 2rem", border: "none" }}>
              {isEn ? 'Contact Our Consultants' : 'Hubungi Konsultan Kami'}
            </Link>
          </div>
        </div>
      </section>

      <Footer locale={locale} />
      <WhatsAppFloat />
    </>
  );
}
