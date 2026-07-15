import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import { WaveDivider } from "@/components/ui/WaveDivider";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';
  return {
    title: isEn ? "Our Services | Mahaga Widya Cita" : "Layanan Kami | Mahaga Widya Cita",
    description: isEn 
      ? "Explore our comprehensive range of services including consulting, executive education, and governance review."
      : "Jelajahi berbagai layanan komprehensif kami termasuk konsultasi, edukasi eksekutif, dan tinjauan tata kelola.",
  };
}

export default async function LayananPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isEn = locale === 'en';
  
  const payload = await getPayload({ config: configPromise });
  const result = await payload.find({
    collection: 'services',
    locale: locale as any,
    limit: 20,
  });

  const services = result.docs;

  return (
    <>
      <Navbar locale={locale} />

      {/* HERO SECTION */}
      <section style={{ 
        background: "linear-gradient(135deg, var(--color-primary-900) 0%, var(--color-primary-700) 100%)", 
        paddingTop: "calc(72px + 4rem)", 
        paddingBottom: "4rem", 
        position: "relative", 
        overflow: "hidden" 
      }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 80% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)", pointerEvents: "none" }} />
        <div className="container" style={{ position: "relative" }}>
          <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
            <div className="badge" style={{ background: "rgba(255,255,255,0.2)", color: "white", marginBottom: "1.25rem", display: "inline-block" }}>
              {isEn ? 'Our Expertise' : 'Keahlian Kami'}
            </div>
            <h1 className="text-display" style={{ color: "white", marginBottom: "1rem" }}>
              {isEn ? 'Comprehensive Services for Your Success' : 'Layanan Komprehensif untuk Kesuksesan Anda'}
            </h1>
            <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "1.125rem", lineHeight: "1.7", marginBottom: "0" }}>
              {isEn 
                ? 'We provide end-to-end solutions combining academic rigor with practical industry experience to transform governments, businesses, and communities.'
                : 'Kami menyediakan solusi ujung-ke-ujung yang menggabungkan ketelitian akademis dengan pengalaman industri praktis untuk mentransformasi pemerintahan, bisnis, dan masyarakat.'}
            </p>
          </div>
        </div>
        
        {/* Wave Divider */}
        <WaveDivider fill="var(--color-neutral-50)" />
      </section>

      {/* SERVICES GRID SECTION */}
      <section className="section" style={{ background: "var(--color-neutral-50)" }}>
        <div className="container">
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "2rem",
          }}>
            {services.map((service: any, idx: number) => {
              // Icon fallback if not in DB
              let IconComp = CheckCircle2;
              
              return (
                <div key={service.id} style={{
                  background: "#fff",
                  borderRadius: "16px",
                  padding: "2.5rem 2rem",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                  border: "1px solid var(--color-neutral-200)",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  position: "relative"
                }}
                className="service-card-hover"
                >
                  <style>{`
                    .service-card-hover:hover {
                      transform: translateY(-5px);
                      box-shadow: 0 15px 35px rgba(0,0,0,0.1) !important;
                    }
                  `}</style>
                  
                  {/* Icon & Badge Container */}
                  <div style={{ position: "relative", marginBottom: "2rem", display: "flex", alignItems: "center" }}>
                    <div
                      style={{
                        width: "72px", height: "72px",
                        background: "var(--color-primary-600)", 
                        borderRadius: "50%",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        boxShadow: "0 8px 24px rgba(30, 111, 217, 0.25)"
                      }}
                    >
                      <IconComp size={32} color="var(--color-gold-400)" strokeWidth={1.5} />
                    </div>
                    {/* Number Badge */}
                    <div
                      style={{
                        position: "absolute",
                        bottom: "-4px",
                        left: "-4px",
                        width: "28px", height: "28px",
                        background: "var(--color-gold-500)",
                        color: "#fff",
                        borderRadius: "50%",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "0.75rem",
                        fontWeight: "bold",
                        border: "3px solid #fff",
                        boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
                      }}
                    >
                      {(idx + 1).toString().padStart(2, '0')}
                    </div>
                  </div>

                  <h2 style={{ fontSize: "1.25rem", color: "var(--color-primary-900)", marginBottom: "1rem", lineHeight: "1.4" }}>
                    {service.title}
                  </h2>
                  
                  <p style={{ color: "var(--color-neutral-600)", fontSize: "0.9375rem", lineHeight: "1.6", marginBottom: "1.5rem", flexGrow: 1 }}>
                    {service.tagline || service.description}
                  </p>

                  <div style={{ marginTop: "auto" }}>
                    <Link href={`/${locale}/layanan/${service.slug}`} className="btn btn-outline-primary" style={{ width: "100%", justifyContent: "center" }}>
                      {isEn ? 'Learn More' : 'Pelajari Lebih Lanjut'} <ArrowRight size={18} style={{ marginLeft: "0.5rem" }} />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="section" style={{ background: "white", textAlign: "center" }}>
        <div className="container">
          <div style={{ maxWidth: "600px", margin: "0 auto", padding: "3rem", background: "var(--color-primary-50)", borderRadius: "24px" }}>
            <h2 style={{ fontSize: "1.75rem", color: "var(--color-primary-900)", marginBottom: "1rem" }}>
              {isEn ? 'Need a Custom Solution?' : 'Butuh Solusi Khusus?'}
            </h2>
            <p style={{ color: "var(--color-neutral-700)", marginBottom: "2rem", fontSize: "1.0625rem" }}>
              {isEn 
                ? 'Contact our team to discuss how we can tailor our services to meet your specific institutional needs.'
                : 'Hubungi tim kami untuk mendiskusikan bagaimana kami dapat menyesuaikan layanan kami untuk memenuhi kebutuhan spesifik instansi Anda.'}
            </p>
            <Link href={`/${locale}/kontak`} className="btn btn-primary btn-lg">
              {isEn ? 'Contact Us Today' : 'Hubungi Kami Hari Ini'}
            </Link>
          </div>
        </div>
      </section>

      <Footer locale={locale} />
      <WhatsAppFloat locale={locale} />
    </>
  );
}
