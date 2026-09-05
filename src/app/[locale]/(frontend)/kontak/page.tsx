import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import ContactForm from "@/components/ContactForm";
import { Phone, Mail, MapPin, Clock, MessageSquare } from "lucide-react";
import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import { localizedAlternates } from "@/utils/seo";

export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === "en";
  return {
    title: isEn ? "Contact" : "Kontak",
    description: isEn
      ? "Contact PT Mahaga Widya Cita for consulting, partnerships, and service information."
      : "Hubungi PT Mahaga Widya Cita untuk konsultasi, kerjasama, dan informasi layanan lebih lanjut.",
    alternates: localizedAlternates(locale, "/kontak"),
  };
}

export default async function KontakPage(props: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ posisi?: string; subjek?: string; layanan?: string; sumber?: string }>;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const isEn = params.locale === "en";
  const payload = await getPayload({ config: configPromise });
  const kontakData: any = await payload.findGlobal({
    slug: "kontak",
    locale: params.locale as any,
    fallbackLocale: "none" as any,
  });

  const phone = kontakData?.phone || "+62 21 1234 5678";
  const email = kontakData?.email || "info@mahagawidyacita.co.id";
  const address =
    kontakData?.address ||
    (isEn
      ? "Jl. Raya Gatot Subroto No. 42, South Jakarta, DKI Jakarta 12930"
      : "Jl. Raya Gatot Subroto No. 42, Jakarta Selatan, DKI Jakarta 12930");
  const workingHours =
    kontakData?.workingHours || (isEn ? "Monday – Friday, 08.00 – 17.00 WIB" : "Senin – Jumat, 08.00 – 17.00 WIB");
  const locationTag = kontakData?.locationTag || (isEn ? "South Jakarta, DKI Jakarta" : "Jakarta Selatan, DKI Jakarta");
  const heroTitle = kontakData?.heroTitle || (isEn ? "Let's Collaborate With Us" : "Mari Berkolaborasi Bersama Kami");
  const heroSubtitle = (
    kontakData?.heroSubtitle ||
    (isEn
      ? "Our team is ready to assist with your institution's education and consultation needs."
      : "Tim kami siap membantu kebutuhan edukasi dan konsultasi instansi Anda.")
  )
    .replace(/\s*Respons dalam 1×24 jam kerja\.?/gi, "")
    .replace(/\s*Response within 1×24 working hours\.?/gi, "")
    .trim();

  const whatsappCta = kontakData?.whatsappCta || {
    title: isEn ? "Chat via WhatsApp" : "Chat via WhatsApp",
    subtitle: isEn ? "Faster response, directly to our team" : "Respons lebih cepat, langsung ke tim kami",
    defaultMessage: isEn
      ? "Hello, I would like to consult with the PT Mahaga Widya Cita team."
      : "Halo, saya ingin berkonsultasi dengan tim PT Mahaga Widya Cita.",
  };

  const contactInfo = [
    {
      icon: Phone,
      label: isEn ? "Phone" : "Telepon",
      value: phone,
      href: `tel:${phone.replace(/\D/g, "")}`,
    },
    { icon: Mail, label: "Email", value: email, href: `mailto:${email}` },
    {
      icon: MapPin,
      label: isEn ? "Address" : "Alamat",
      value: address,
      href: "#",
    },
    {
      icon: Clock,
      label: isEn ? "Working Hours" : "Jam Kerja",
      value: workingHours,
      href: "#",
    },
  ];

  const waNumber = phone.replace(/\D/g, "").replace(/^0/, "62");
  const formSubjects = kontakData?.formSubjects?.map((s: any) => s.subject).filter(Boolean) || undefined;
  const requestedSubject = String(searchParams.subjek || "").toLocaleLowerCase();
  const requestedService = String(searchParams.layanan || "")
    .trim()
    .slice(0, 150);
  const initialSubject = requestedService
    ? isEn
      ? `Service Consultation — ${requestedService}`
      : `Konsultasi Layanan — ${requestedService}`
    : requestedSubject.includes("lamaran")
      ? isEn
        ? "Career Application"
        : "Lamaran Pekerjaan"
      : requestedSubject.includes("kemitraan")
        ? isEn
          ? "Partnership & Collaboration"
          : "Kemitraan & Kolaborasi"
        : "";
  const position = String(searchParams.posisi || "").slice(0, 150);
  const initialMessage = requestedService
    ? isEn
      ? `I would like to discuss how the ${requestedService} service can support our organization.`
      : `Saya ingin mendiskusikan bagaimana layanan ${requestedService} dapat mendukung organisasi kami.`
    : position
      ? isEn
        ? `I would like to apply for the ${position} position.`
        : `Saya ingin melamar untuk posisi ${position}.`
      : "";

  return (
    <>
      <Navbar />

      <PageHero
        badge={isEn ? "Contact Us" : "Hubungi Kami"}
        title={heroTitle}
        description={heroSubtitle}
        waveFill="white"
      />

      {/* MAIN CONTENT */}
      <section className="section">
        <div className="container">
          <div
            className="contact-layout-grid"
            style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "3.5rem", alignItems: "start" }}
          >
            {/* FORM */}
            <div className="card contact-form-card" style={{ padding: "2.5rem" }}>
              <ContactForm
                locale={params.locale}
                subjects={formSubjects}
                initialSubject={initialSubject}
                initialMessage={initialMessage}
              />
            </div>

            {/* SIDEBAR INFO */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {/* Contact info */}
              <div className="card" style={{ padding: "2rem" }}>
                <h3 style={{ fontSize: "1.125rem", marginBottom: "1.5rem" }}>
                  {isEn ? "Contact Information" : "Informasi Kontak"}
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  {contactInfo.map(({ icon: Icon, label, value, href }) => (
                    <a key={label} href={href} style={{ display: "flex", gap: "1rem", textDecoration: "none" }}>
                      <div
                        style={{
                          width: "44px",
                          height: "44px",
                          background: "var(--color-primary-100)",
                          borderRadius: "12px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <Icon size={18} color="var(--color-primary-600)" />
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: "0.75rem",
                            fontWeight: "600",
                            color: "var(--color-neutral-400)",
                            textTransform: "uppercase",
                            letterSpacing: "0.04em",
                            marginBottom: "0.25rem",
                          }}
                        >
                          {label}
                        </div>
                        <div style={{ fontSize: "0.875rem", color: "var(--color-neutral-700)", lineHeight: "1.4" }}>
                          {value}
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* WhatsApp CTA */}
              <a
                href={`https://wa.me/${waNumber}?text=${encodeURIComponent(whatsappCta.defaultMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="card"
                style={{
                  padding: "1.75rem",
                  textDecoration: "none",
                  background: "linear-gradient(135deg, #25D366, #128C7E)",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    width: "52px",
                    height: "52px",
                    background: "rgba(255,255,255,0.2)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <MessageSquare size={24} fill="white" color="white" />
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontWeight: "700",
                      color: "white",
                      marginBottom: "0.25rem",
                    }}
                  >
                    {whatsappCta.title}
                  </div>
                  <div style={{ fontSize: "0.8125rem", color: "rgba(255,255,255,0.8)", lineHeight: "1.4" }}>
                    {whatsappCta.subtitle}
                  </div>
                </div>
              </a>

              {/* Map placeholder */}
              <div className="card" style={{ overflow: "hidden" }}>
                <div
                  style={{
                    height: "200px",
                    background: "linear-gradient(135deg, var(--color-primary-100), var(--color-primary-200))",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    gap: "0.5rem",
                    textAlign: "center",
                    padding: "1rem",
                  }}
                >
                  <MapPin size={36} color="var(--color-primary-500)" />
                  <span style={{ fontSize: "0.875rem", color: "var(--color-primary-600)", fontWeight: "600" }}>
                    {locationTag}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer locale={params.locale} />
      <WhatsAppFloat locale={params.locale} />
    </>
  );
}
