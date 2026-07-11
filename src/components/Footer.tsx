import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import NewsletterForm from "./NewsletterForm";
import { IconInstagram, IconYoutube, IconLinkedin, IconXTwitter } from "./icons/SocialIcons";

const footerLinks = {
  company: [
    { label: "Profil Perusahaan", href: "/tentang-kami" },
    { label: "Manajemen", href: "/tentang-kami#manajemen" },
    { label: "Tenaga Ahli", href: "/tentang-kami#ahli" },
    { label: "Mitra", href: "/mitra" },
    { label: "Karir", href: "/karir" },
  ],
  services: [
    { label: "Smart Consulting", href: "/layanan/konsultasi" },
    { label: "Smart Executive Education", href: "/layanan/edukasi" },
    { label: "Smart Software Service", href: "/layanan/software" },
    { label: "Smart Governance Review", href: "/layanan/governance-review" },
    { label: "Smart Online Course", href: "/kursus" },
    { label: "Smart Digital Conference", href: "/webinar" },
  ],
};

export default async function Footer() {
  const payload = await getPayload({ config: configPromise });
  const kontakData = await payload.findGlobal({ slug: "kontak" });
  
  const phone = kontakData?.phone || "+62 21 1234 5678";
  const email = kontakData?.email || "info@mahagawidyacita.co.id";
  const address = kontakData?.address || "Jakarta, Indonesia";

  return (
    <footer
      style={{
        background: "linear-gradient(180deg, var(--color-primary-900) 0%, #061e4f 100%)",
        color: "rgba(255,255,255,0.85)",
        padding: "4rem 0 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative grid pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0)",
          backgroundSize: "32px 32px",
          pointerEvents: "none",
        }}
      />

      <div className="container" style={{ position: "relative" }}>
        {/* Main footer grid */}
        <div
          className="footer-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "3rem",
            marginBottom: "3rem",
          }}
        >
          {/* Brand column */}
          <div style={{ gridColumn: "span 1" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
              <Image 
                src="/logo-transparent.png" 
                alt="Logo PT Mahaga Widya Cita" 
                width={44} 
                height={44} 
                style={{ objectFit: 'contain' }}
              />
              <div>
                <div
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: "700",
                    fontSize: "1rem",
                    color: "white",
                    lineHeight: "1.2",
                  }}
                >
                  PT Mahaga Widya Cita
                </div>
              </div>
            </div>
            <p style={{ fontSize: "0.875rem", lineHeight: "1.7", marginBottom: "1.5rem", color: "rgba(255,255,255,0.65)" }}>
              Platform terdepan untuk edukasi profesional dan penguatan tata kelola bagi ASN dan profesional Indonesia.
            </p>
            <div style={{ display: "flex", gap: "0.75rem" }}>
            {[
                { icon: IconInstagram, href: "#", label: "Instagram" },
                { icon: IconYoutube, href: "#", label: "YouTube" },
                { icon: IconLinkedin, href: "#", label: "LinkedIn" },
                { icon: IconXTwitter, href: "#", label: "Twitter/X" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="footer-social"
                  style={{
                    width: "36px",
                    height: "36px",
                    borderWidth: "1px",
                    borderStyle: "solid",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Perusahaan */}
          <div>
            <h4 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "0.875rem", fontWeight: "600", color: "white", marginBottom: "1.25rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Perusahaan
            </h4>
            <ul style={{ listStyle: "none" }}>
              {footerLinks.company.map((link) => (
                <li key={link.label} style={{ marginBottom: "0.625rem" }}>
                  <Link
                    href={link.href}
                    className="footer-link"
                    style={{ fontSize: "0.875rem" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Layanan */}
          <div>
            <h4 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "0.875rem", fontWeight: "600", color: "white", marginBottom: "1.25rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Layanan
            </h4>
            <ul style={{ listStyle: "none" }}>
              {footerLinks.services.map((link) => (
                <li key={link.label} style={{ marginBottom: "0.625rem" }}>
                  <Link
                    href={link.href}
                    className="footer-link"
                    style={{ fontSize: "0.875rem" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kontak */}
          <div>
            <h4 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "0.875rem", fontWeight: "600", color: "white", marginBottom: "1.25rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Kontak
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
              {[
                { icon: Phone, text: phone },
                { icon: Mail, text: email },
                { icon: MapPin, text: address },
              ].map(({ icon: Icon, text }) => (
                <div key={text} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Icon size={14} color="var(--color-primary-300)" style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: "0.8125rem", color: "rgba(255,255,255,0.65)", whiteSpace: "pre-line", lineHeight: "1.5" }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>


        {/* Bottom bar */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.08)",
            padding: "1.25rem 0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <p style={{ fontSize: "0.8125rem", color: "rgba(255,255,255,0.45)", textAlign: "center" }}>
            © {new Date().getFullYear()} PT Mahaga Widya Cita. Hak Cipta Dilindungi.
          </p>
        </div>
      </div>
    </footer>
  );
}
