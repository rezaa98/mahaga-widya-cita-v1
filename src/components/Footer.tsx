"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";

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
  content: [
    { label: "Artikel", href: "/artikel" },
    { label: "Policy Review", href: "/policy-reviews" },
    { label: "Webinar / SDS", href: "/webinar" },
    { label: "Verifikasi Sertifikat", href: "/verifikasi" },
    { label: "Kontak", href: "/kontak" },
  ],
};

export default function Footer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setStatus("idle");

    try {
      const res = await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

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

          {/* Konten & Info */}
          <div>
            <h4 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "0.875rem", fontWeight: "600", color: "white", marginBottom: "1.25rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Konten & Info
            </h4>
            <ul style={{ listStyle: "none", marginBottom: "1.5rem" }}>
              {footerLinks.content.map((link) => (
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
            <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
              {[
                { icon: Phone, text: "+62 21 1234 5678" },
                { icon: Mail, text: "info@mahagawidyacita.co.id" },
                { icon: MapPin, text: "Jakarta, Indonesia" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Icon size={14} color="var(--color-primary-300)" style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: "0.8125rem", color: "rgba(255,255,255,0.65)" }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Newsletter bar */}
        <div
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "16px",
            padding: "1.5rem 2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1.5rem",
            flexWrap: "wrap",
            marginBottom: "2.5rem",
          }}
        >
          <div>
            <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: "600", color: "white", marginBottom: "0.25rem", fontSize: "1rem" }}>
              Berlangganan Newsletter
            </div>
            <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.6)" }}>
              Dapatkan info webinar, artikel, dan kursus terbaru langsung di inbox Anda.
            </p>
          </div>
          <form onSubmit={handleSubscribe} style={{ display: "flex", gap: "0.625rem", flexShrink: 0, flexWrap: "wrap" }}>
            <input
              type="email"
              placeholder="Masukkan email Anda"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading || status === "success"}
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "white",
                minWidth: "240px",
                borderRadius: "var(--radius-full)",
              }}
              id="newsletter-email"
            />
            <button 
              type="submit" 
              className="btn btn-primary btn-sm"
              disabled={loading || status === "success"}
              style={{
                backgroundColor: status === "success" ? "var(--color-success)" : undefined,
                borderColor: status === "success" ? "var(--color-success)" : undefined,
              }}
            >
              {loading ? "Memproses..." : status === "success" ? "Berhasil!" : "Langganan"}
            </button>
          </form>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.08)",
            padding: "1.25rem 0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <p style={{ fontSize: "0.8125rem", color: "rgba(255,255,255,0.45)" }}>
            © {new Date().getFullYear()} PT Mahaga Widya Cita. Hak Cipta Dilindungi.
          </p>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            {["Kebijakan Privasi", "Syarat & Ketentuan"].map((text) => (
              <Link
                key={text}
                href="#"
                className="footer-link-muted"
                style={{ fontSize: "0.8125rem" }}
              >
                {text}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
