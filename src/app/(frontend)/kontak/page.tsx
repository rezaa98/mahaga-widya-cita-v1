import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import ContactForm from "@/components/ContactForm";
import { Phone, Mail, MapPin, Clock, MessageSquare } from "lucide-react";
import type { Metadata } from "next";
import { WaveDivider } from "@/components/ui/WaveDivider";
import { getPayload } from "payload";
import configPromise from "@payload-config";

export const metadata: Metadata = {
  title: "Kontak",
  description: "Hubungi PT Mahaga Widya Cita untuk konsultasi, kerjasama, dan informasi layanan lebih lanjut.",
};

export default async function KontakPage() {
  const payload = await getPayload({ config: configPromise });
  const kontakData = await payload.findGlobal({ slug: "kontak" });

  const phone = kontakData?.phone || "+62 21 1234 5678";
  const email = kontakData?.email || "info@mahagawidyacita.co.id";
  const address = kontakData?.address || "Jl. Raya Gatot Subroto No. 42, Jakarta Selatan, DKI Jakarta 12930";
  const workingHours = kontakData?.workingHours || "Senin – Jumat, 08.00 – 17.00 WIB";
  const locationTag = kontakData?.locationTag || "Jakarta Selatan, DKI Jakarta";
  
  const whatsappCta = kontakData?.whatsappCta || {
    title: 'Chat via WhatsApp',
    subtitle: 'Respons lebih cepat, langsung ke tim kami',
    defaultMessage: 'Halo, saya ingin berkonsultasi dengan tim PT Mahaga Widya Cita.'
  };

  const contactInfo = [
    { icon: Phone, label: "Telepon", value: phone, href: `tel:${phone.replace(/\D/g, "")}` },
    { icon: Mail, label: "Email", value: email, href: `mailto:${email}` },
    { icon: MapPin, label: "Alamat", value: address, href: "#" },
    { icon: Clock, label: "Jam Kerja", value: workingHours, href: "#" },
  ];

  const waNumber = phone.replace(/\D/g, '').replace(/^0/, '62');

  return (
    <>
      <Navbar />

      {/* HERO */}
      <section style={{ background: "linear-gradient(135deg, var(--color-primary-900), var(--color-primary-700))", paddingTop: "calc(72px + 4rem)", paddingBottom: "4rem", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(ellipse at 70% 50%, rgba(30,111,217,0.3) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div className="container" style={{ position: "relative" }}>
          <span className="badge" style={{ background: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.9)", marginBottom: "1rem" }}>Hubungi Kami</span>
          <h1 className="text-display" style={{ color: "white", marginBottom: "1rem", maxWidth: "560px" }}>
            Mari Berkolaborasi Bersama Kami
          </h1>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "1.125rem", maxWidth: "480px" }}>
            Tim kami siap membantu kebutuhan edukasi dan konsultasi instansi Anda. Respons dalam 1×24 jam kerja.
          </p>
        </div>
        <WaveDivider fill="white" />
      </section>

      {/* MAIN CONTENT */}
      <section className="section">
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "3.5rem", alignItems: "start" }}>

            {/* FORM */}
            <div className="card" style={{ padding: "2.5rem" }}>
              <ContactForm />
            </div>

            {/* SIDEBAR INFO */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {/* Contact info */}
              <div className="card" style={{ padding: "2rem" }}>
                <h3 style={{ fontSize: "1.125rem", marginBottom: "1.5rem" }}>Informasi Kontak</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  {contactInfo.map(({ icon: Icon, label, value, href }) => (
                    <a key={label} href={href} style={{ display: "flex", gap: "1rem", textDecoration: "none" }}>
                      <div style={{ width: "44px", height: "44px", background: "var(--color-primary-100)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Icon size={18} color="var(--color-primary-600)" />
                      </div>
                      <div>
                        <div style={{ fontSize: "0.75rem", fontWeight: "600", color: "var(--color-neutral-400)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "0.25rem" }}>{label}</div>
                        <div style={{ fontSize: "0.875rem", color: "var(--color-neutral-700)", lineHeight: "1.4" }}>{value}</div>
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
                style={{ padding: "1.75rem", textDecoration: "none", background: "linear-gradient(135deg, #25D366, #128C7E)", border: "none", display: "flex", alignItems: "center", gap: "1rem", cursor: "pointer" }}
              >
                <div style={{ width: "52px", height: "52px", background: "rgba(255,255,255,0.2)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <MessageSquare size={24} fill="white" color="white" />
                </div>
                <div>
                  <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: "700", color: "white", marginBottom: "0.25rem" }}>{whatsappCta.title}</div>
                  <div style={{ fontSize: "0.8125rem", color: "rgba(255,255,255,0.8)", lineHeight: "1.4" }}>{whatsappCta.subtitle}</div>
                </div>
              </a>

              {/* Map placeholder */}
              <div className="card" style={{ overflow: "hidden" }}>
                <div style={{ height: "200px", background: "linear-gradient(135deg, var(--color-primary-100), var(--color-primary-200))", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "0.5rem", textAlign: "center", padding: "1rem" }}>
                  <MapPin size={36} color="var(--color-primary-500)" />
                  <span style={{ fontSize: "0.875rem", color: "var(--color-primary-600)", fontWeight: "600" }}>{locationTag}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </>
  );
}
