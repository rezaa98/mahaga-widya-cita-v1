import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import Link from "next/link";
import { Building2, Globe, ArrowRight, Handshake } from "lucide-react";
import { WaveDivider } from "@/components/ui/WaveDivider";
import { localizedAlternates } from "@/utils/seo";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return locale === "en"
    ? {
        title: "Strategic Partners",
        description: "Explore PT Mahaga Widya Cita's cross-sector partnership ecosystem.",
        alternates: localizedAlternates(locale, "/mitra"),
      }
    : {
        title: "Mitra Strategis",
        description: "Jelajahi ekosistem kemitraan lintas sektor PT Mahaga Widya Cita.",
        alternates: localizedAlternates(locale, "/mitra"),
      };
}

const partnerCategories = [
  {
    label: "Kementerian & Lembaga",
    partners: [
      "Kementerian PAN-RB",
      "BKN (Badan Kepegawaian Negara)",
      "BPKP",
      "LAN RI",
      "Setjen DPR RI",
      "Bappenas",
      "Kementerian Keuangan",
      "Kemendagri",
      "KemenPUPR",
      "Ombudsman RI",
      "KPK (Komisi Pemberantasan Korupsi)",
      "LKPP",
    ],
    color: "var(--color-primary-600)",
    bg: "var(--color-primary-100)",
  },
  {
    label: "Pemerintah Daerah",
    partners: [
      "Pemprov DKI Jakarta",
      "Pemprov Jawa Tengah",
      "Pemprov Jawa Timur",
      "Pemkot Surabaya",
      "Pemkab Sleman",
      "Pemprov Bali",
      "Pemkot Makassar",
      "Pemprov Kalimantan Timur",
    ],
    color: "var(--color-gold-600)",
    bg: "var(--color-gold-100)",
  },
  {
    label: "BUMN & Swasta",
    partners: [
      "PT Bank Mandiri (Persero)",
      "PT PLN (Persero)",
      "PT Pertamina (Persero)",
      "PT Telkom Indonesia",
      "PT KAI (Persero)",
      "PT Jasa Raharja",
      "Garuda Indonesia",
    ],
    color: "var(--color-success)",
    bg: "var(--color-success-light)",
  },
  {
    label: "Perguruan Tinggi & Akademia",
    partners: [
      "Universitas Indonesia",
      "Universitas Gadjah Mada",
      "Institut Teknologi Bandung",
      "Universitas Diponegoro",
      "Universitas Airlangga",
      "Universitas Brawijaya",
    ],
    color: "#7C3AED",
    bg: "#EDE9FE",
  },
];

const partnerBenefits = [
  {
    icon: Building2,
    title: "Akses Program Eksklusif",
    desc: "Mitra mendapatkan akses prioritas ke seluruh program pelatihan dan webinar eksklusif kami.",
  },
  {
    icon: Globe,
    title: "Jaringan Nasional",
    desc: "Terhubung dengan ratusan instansi pemerintah dan swasta dalam ekosistem kemitraan kami.",
  },
  {
    icon: Handshake,
    title: "Co-Branding",
    desc: "Peluang kolaborasi konten, riset, dan penyelenggaraan program bersama.",
  },
  {
    icon: ArrowRight,
    title: "Diskon Khusus Mitra",
    desc: "Harga spesial untuk program pelatihan dan konsultasi bagi instansi mitra terdaftar.",
  },
];

export default async function MitraPage(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params;
  const isEn = params.locale === "en";
  const categoryLabels = isEn
    ? [
        "Ministries & National Agencies",
        "Regional Governments",
        "State-Owned & Private Enterprises",
        "Universities & Academia",
      ]
    : partnerCategories.map((category) => category.label);
  const localizedBenefits = isEn
    ? [
        {
          icon: Building2,
          title: "Exclusive Program Access",
          desc: "Priority access to selected training and professional programs.",
        },
        {
          icon: Globe,
          title: "National Network",
          desc: "Connect with institutions and professionals across our partnership ecosystem.",
        },
        {
          icon: Handshake,
          title: "Co-Creation",
          desc: "Collaborate on content, research, and joint professional programs.",
        },
        {
          icon: ArrowRight,
          title: "Partner Benefits",
          desc: "Tailored commercial benefits for registered institutional partners.",
        },
      ]
    : partnerBenefits;
  const copy = isEn
    ? {
        badge: "Our Partners",
        trusted: "Trusted Across",
        highlight: "Multiple Leading Sectors",
        intro:
          "Our partnerships are built on trust, professionalism, and a shared commitment to sustainable organizational progress.",
        ecosystem: "Partner Ecosystem",
        sectors: "Cross-Sector Collaboration",
        institutions: "institutions",
        benefits: "Partnership Benefits",
        benefitsTitle: "What Partners Gain",
        join: "Become Our Partner",
        joinBody: "Be part of a multidisciplinary ecosystem for knowledge, technology, and sustainable growth.",
        button: "Propose a Partnership",
      }
    : {
        badge: "Mitra Kami",
        trusted: "Dipercaya oleh",
        highlight: "Berbagai Sektor Terkemuka",
        intro:
          "Kemitraan kami dibangun atas dasar kepercayaan, profesionalisme, dan komitmen bersama untuk kemajuan organisasi berkelanjutan.",
        ecosystem: "Ekosistem Mitra",
        sectors: "Kolaborasi Lintas Sektor",
        institutions: "instansi",
        benefits: "Keuntungan Bermitra",
        benefitsTitle: "Apa yang Anda Dapatkan sebagai Mitra",
        join: "Bergabung Menjadi Mitra Kami",
        joinBody:
          "Jadilah bagian dari ekosistem multidisiplin untuk pengetahuan, teknologi, dan pertumbuhan berkelanjutan.",
        button: "Ajukan Kemitraan",
      };
  return (
    <>
      <Navbar />

      {/* HERO */}
      <section
        style={{
          background: "linear-gradient(135deg, var(--color-primary-900), var(--color-primary-700))",
          paddingTop: "calc(72px + 4rem)",
          paddingBottom: "4rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse at 70% 50%, rgba(30,111,217,0.3) 0%, transparent 65%)",
            pointerEvents: "none",
          }}
        />
        <div className="container" style={{ position: "relative" }}>
          <span
            className="badge"
            style={{ background: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.9)", marginBottom: "1rem" }}
          >
            {copy.badge}
          </span>
          <h1 className="text-display" style={{ color: "white", marginBottom: "1.25rem", maxWidth: "640px" }}>
            {copy.trusted}
            <br />
            <span style={{ color: "var(--color-gold-300)" }}>{copy.highlight}</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "1.125rem", maxWidth: "500px" }}>{copy.intro}</p>
        </div>
        <WaveDivider fill="white" />
      </section>

      {/* PARTNER CATEGORIES */}
      <section className="section">
        <div className="container">
          <div className="section-title">
            <span className="overline">{copy.ecosystem}</span>
            <h2>{copy.sectors}</h2>
            <div className="gold-divider" />
          </div>
          <div
            className="responsive-partner-grid"
            style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "2rem" }}
          >
            {partnerCategories.map((cat, categoryIndex) => (
              <div key={cat.label} className="card" style={{ padding: "2rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
                  <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: cat.color }} />
                  <h3 style={{ fontSize: "1.0625rem", color: "var(--color-neutral-900)", margin: 0 }}>
                    {categoryLabels[categoryIndex]}
                  </h3>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: "600",
                      background: cat.bg,
                      color: cat.color,
                      borderRadius: "99px",
                      padding: "0.125rem 0.625rem",
                      marginLeft: "auto",
                    }}
                  >
                    {cat.partners.length}+ {copy.institutions}
                  </span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.625rem" }}>
                  {cat.partners.map((p) => (
                    <span
                      key={p}
                      style={{
                        fontSize: "0.8125rem",
                        background: cat.bg,
                        color: cat.color,
                        borderRadius: "8px",
                        padding: "0.375rem 0.75rem",
                        fontWeight: "500",
                      }}
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-title">
            <span className="overline">{copy.benefits}</span>
            <h2>{copy.benefitsTitle}</h2>
            <div className="gold-divider" />
          </div>
          <div
            className="responsive-benefits-grid"
            style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem" }}
          >
            {localizedBenefits.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card" style={{ padding: "2rem", textAlign: "center" }}>
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    background: "var(--color-primary-100)",
                    borderRadius: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 1.25rem",
                  }}
                >
                  <Icon size={26} color="var(--color-primary-600)" />
                </div>
                <h3 style={{ fontSize: "1rem", marginBottom: "0.625rem" }}>{title}</h3>
                <p style={{ fontSize: "0.875rem", color: "var(--color-neutral-500)", lineHeight: "1.6" }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* JOIN PARTNER CTA */}
      <section
        style={{
          background: "linear-gradient(135deg, var(--color-primary-900), var(--color-primary-700))",
          padding: "4.5rem 0",
        }}
      >
        <div className="container" style={{ textAlign: "center" }}>
          <h2 style={{ color: "white", marginBottom: "1rem" }}>{copy.join}</h2>
          <p
            style={{
              color: "rgba(255,255,255,0.75)",
              marginBottom: "2rem",
              fontSize: "1.0625rem",
              maxWidth: "500px",
              margin: "0 auto 2rem",
            }}
          >
            {copy.joinBody}
          </p>
          <Link
            href={`/${params.locale}/kontak?subjek=Kemitraan`}
            className="btn btn-gold btn-lg"
            id="cta-become-partner"
          >
            {copy.button} <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <Footer locale={params.locale} />
      <WhatsAppFloat locale={params.locale} />
    </>
  );
}
