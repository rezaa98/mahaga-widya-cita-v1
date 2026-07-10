"use client";
import Image from "next/image";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import TeamMemberCard from "@/components/ui/TeamMemberCard";
import {
  ArrowRight,
  Award,
  BookOpen,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Cpu,
  FileText,
  Globe,
  GraduationCap,
  Lightbulb,
  MessageSquare,
  Mic2,
  Play,
  Shield,
  Star,
  Target,
  TrendingUp,
  Users,
  Video,
} from "lucide-react";

/* ============================================
   DATA
   ============================================ */

const defaultServices = [
  {
    icon: Lightbulb,
    title: "Smart Consulting",
    description:
      "Layanan konsultasi strategis untuk penguatan tata kelola, reformasi birokrasi, dan peningkatan kinerja instansi pemerintah.",
    href: "/layanan/konsultasi",
    gradient: "linear-gradient(135deg, #1E6FD9, #0B2D6B)",
    tag: "Konsultasi",
  },
  {
    icon: GraduationCap,
    title: "Smart Executive Education",
    description:
      "Program pelatihan eksklusif untuk pimpinan dan eksekutif instansi dengan metode pembelajaran terkini.",
    href: "/layanan/edukasi",
    gradient: "linear-gradient(135deg, #C9970A, #A07508)",
    tag: "Edukasi",
  },
  {
    icon: Cpu,
    title: "Smart Software Service",
    description:
      "Pengembangan aplikasi dan sistem informasi manajemen yang adaptif untuk kebutuhan instansi Anda.",
    href: "/layanan/software",
    gradient: "linear-gradient(135deg, #7C3AED, #5B21B6)",
    tag: "Teknologi",
  },
  {
    icon: Shield,
    title: "Smart Governance Review",
    description:
      "Review mendalam atas sistem tata kelola, kepatuhan regulasi, dan rekomendasi perbaikan berbasis best practice.",
    href: "/layanan/governance-review",
    gradient: "linear-gradient(135deg, #059669, #047857)",
    tag: "Governance",
  },
  {
    icon: BookOpen,
    title: "Smart Online Course",
    description:
      "Platform kursus online interaktif dengan sertifikasi resmi untuk meningkatkan kompetensi ASN dan profesional.",
    href: "/kursus",
    gradient: "linear-gradient(135deg, #DC2626, #B91C1C)",
    tag: "E-Learning",
  },
  {
    icon: Video,
    title: "Smart Digital Conference",
    description:
      "Penyelenggaraan konferensi dan forum diskusi digital berkualitas tinggi dengan teknologi streaming terkini.",
    href: "/layanan/digital-conference",
    gradient: "linear-gradient(135deg, #0891B2, #0E7490)",
    tag: "Event",
  },
];

const stats = [
  { value: 500, suffix: "+", label: "Sesi Webinar", icon: Mic2 },
  { value: 10000, suffix: "+", label: "Peserta Terdaftar", icon: Users },
  { value: 200, suffix: "+", label: "Instansi Mitra", icon: Building2 },
  { value: 50, suffix: "+", label: "Mitra Strategis", icon: Globe },
];


const articles = [
  {
    id: 1,
    category: "PEMERINTAH",
    title: "Panduan Lengkap Penyusunan LKJIP 2026 yang Berkualitas dan Akuntabel",
    excerpt:
      "Laporan Kinerja Instansi Pemerintah (LKJIP) merupakan dokumen vital yang mencerminkan akuntabilitas...",
    author: "Tim Redaksi MWC",
    date: "5 Juli 2026",
    readTime: "7 menit",
    categoryColor: "var(--color-primary-500)",
    categoryBg: "var(--color-primary-100)",
    imageUrl: undefined,
    slug: "panduan-lkjip",
  },
  {
    id: 2,
    category: "BISNIS",
    title: "Transformasi Digital UMKM: Strategi dan Tantangan di Era 5.0",
    excerpt:
      "Digitalisasi bukan lagi pilihan bagi UMKM Indonesia. Di era persaingan global ini, adopsi teknologi...",
    author: "Rizki Firmansyah, M.Sc.",
    date: "3 Juli 2026",
    readTime: "5 menit",
    categoryColor: "var(--color-gold-600)",
    categoryBg: "var(--color-gold-100)",
    imageUrl: undefined,
    slug: "transformasi-digital",
  },
  {
    id: 3,
    category: "INDIVIDU",
    title: "5 Kompetensi Inti yang Wajib Dimiliki ASN di Tahun 2026",
    excerpt:
      "Aparatur Sipil Negara dituntut untuk terus berinovasi dan mengembangkan kompetensi di tengah...",
    author: "Sari Dewi Purnama, S.Psi.",
    date: "1 Juli 2026",
    readTime: "4 menit",
    categoryColor: "var(--color-success)",
    categoryBg: "var(--color-success-light)",
    imageUrl: undefined,
    slug: "kompetensi-asn",
  },
];

const teamMembers = [
  {
    id: 1,
    name: "Prof. Dr. Hj. Endang Larasati, M.S.",
    role: "Direktur Utama",
    expertise: "Administrasi Publik & Tata Kelola",
    initials: "EL",
  },
  {
    id: 2,
    name: "Dr. Oscar Radyan Danar, M.A.",
    role: "Direktur Program",
    expertise: "Kebijakan Publik & Reformasi Birokrasi",
    initials: "OR",
  },
  {
    id: 3,
    name: "Ahmad Basori, M.M.",
    role: "Senior Consultant",
    expertise: "Manajemen Keuangan Daerah",
    initials: "AB",
  },
  {
    id: 4,
    name: "Rizki Firmansyah, M.Sc.",
    role: "Head of Technology",
    expertise: "Transformasi Digital & IT Governance",
    initials: "RF",
  },
];

const partners = [
  { name: 'Kementerian PAN-RB', logoUrl: '/media/partner_kementerian_pan_rb.png' },
  { name: 'BKN', logoUrl: '/media/partner_bkn.png' },
  { name: 'BPKP', logoUrl: '/media/partner_bpkp.png' },
  { name: 'LAN RI', logoUrl: '/media/partner_lan_ri.png' },
  { name: 'Setjen DPR RI', logoUrl: '/media/partner_setjen_dpr_ri.png' },
  { name: 'Bappenas', logoUrl: '/media/partner_bappenas.png' },
  { name: 'Kemendagri', logoUrl: '/media/partner_kemendagri.png' },
  { name: 'Kemenkeu', logoUrl: '/media/partner_kemenkeu.png' },
  { name: 'KemenPUPR', logoUrl: '/media/partner_kemenpupr.png' },
  { name: 'Ombudsman RI', logoUrl: '/media/partner_ombudsman_ri.png' },
];

/* ============================================
   COUNTER HOOK
   ============================================ */

function useCountUp(target: number, duration: number = 1500, start: boolean = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

/* ============================================
   STAT CARD SUB-COMPONENT
   ============================================ */

type StatItem = { value: number; suffix: string; label: string; icon: React.ComponentType<{ size?: number; color?: string; style?: React.CSSProperties }> };

function StatCard({ stat, index, total, visible }: { stat: StatItem; index: number; total: number; visible: boolean }) {
  const count = useCountUp(stat.value, 1800, visible);
  return (
    <div
      style={{
        padding: "2.25rem 1.5rem",
        textAlign: "center",
        borderRight: index < total - 1 ? "1px solid var(--color-neutral-100)" : "none",
        position: "relative",
      }}
    >
      <stat.icon size={28} color="var(--color-primary-400)" style={{ margin: "0 auto 0.75rem" }} />
      <div
        style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontWeight: "800",
          fontSize: "2.25rem",
          color: "var(--color-primary-700)",
          lineHeight: "1",
          marginBottom: "0.375rem",
        }}
      >
        {visible ? count.toLocaleString("id-ID") : "0"}{stat.suffix}
      </div>
      <div style={{ fontSize: "0.875rem", color: "var(--color-neutral-500)", fontWeight: "500" }}>
        {stat.label}
      </div>
    </div>
  );
}

/* ============================================
   HOMEPAGE COMPONENT
   ============================================ */

const IconMapping: Record<string, any> = {
  'konsultasi': Lightbulb,
  'edukasi': GraduationCap,
  'software': Cpu,
  'governance-review': Shield,
  'digital-conference': Video,
};

export default function HomePage({ articles: payloadArticles = [], teamMembers: payloadTeamMembers = [], services: payloadServices = [], berandaData }: { articles?: any[], teamMembers?: any[], services?: any[], berandaData?: any }) {
  const displayArticles = payloadArticles.length > 0 ? payloadArticles.map(a => ({
    id: a.id,
    category: typeof a.category === 'object' && a.category ? a.category.name : 'UMUM',
    title: a.title,
    excerpt: 'Klik untuk membaca lebih lanjut...',
    author: typeof a.author === 'object' && a.author ? a.author.name || 'Admin' : 'Admin',
    date: new Date(a.publishedAt || new Date()).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }),
    readTime: '5 menit',
    categoryColor: "var(--color-primary-500)",
    categoryBg: "var(--color-primary-100)",
    imageUrl: a.imageUrl,
    slug: a.slug,
  })) : articles;

  const displayTeamMembers = payloadTeamMembers.length > 0 ? payloadTeamMembers : teamMembers;

  const displayServices = payloadServices?.length > 0 ? payloadServices.map((s: any) => ({
    icon: IconMapping[s.slug] || Target,
    title: s.title,
    description: s.description,
    href: `/layanan/${s.slug}`,
    gradient: s.gradient || "linear-gradient(135deg, #1E6FD9, #0B2D6B)",
    tag: s.tagline || "Layanan",
  })) : defaultServices;

  // HERO DATA
  const heroBadge = berandaData?.hero?.badge || "Platform Edukasi & Tata Kelola Terpercaya Sejak 2015";
  const heroTitle = berandaData?.hero?.title || "Platform Edukasi &";
  const heroTitleHighlight = berandaData?.hero?.titleHighlight || "Tata Kelola";
  const heroTitleSuffix = berandaData?.hero?.titleSuffix || "untuk Profesional Indonesia";
  const heroDescription = berandaData?.hero?.description || "Tingkatkan kompetensi SDM dan perkuat tata kelola instansi Anda melalui program edukasi, konsultasi, dan webinar berkualitas tinggi bersama para pakar terbaik Indonesia.";
  const heroFeatures = berandaData?.hero?.features?.length > 0 
    ? berandaData.hero.features.map((f: any) => f.text)
    : ["Sertifikat Digital Resmi", "Webinar Gratis Setiap Bulan", "500+ Materi Edukasi"];

  // STATS DATA
  const iconMap: Record<string, any> = { Mic2, Users, Building2, Globe, Target, CheckCircle2 };
  const displayStats = berandaData?.stats?.length > 0 
    ? berandaData.stats.map((s: any) => ({
        value: s.value,
        suffix: s.suffix || "",
        label: s.label,
        icon: iconMap[s.icon] || Mic2
      }))
    : stats;

  // PARTNERS DATA
  const partnersTitle = berandaData?.partners?.title || "Dipercaya oleh Lebih dari 200 Instansi dan Mitra Strategis";
  const displayPartnersRaw = berandaData?.partners?.list?.length > 0
    ? berandaData.partners.list
    : partners;

  // Intercept and fix old broken URLs that might be cached in the CMS database
  const displayPartners = displayPartnersRaw.map((p: any) => {
    let correctedUrl = p.logoUrl;
    if (correctedUrl === '/media/partner_panrb.png') correctedUrl = '/media/partner_kementerian_pan_rb.png';
    if (correctedUrl === '/media/partner_lan.png') correctedUrl = '/media/partner_lan_ri.png';
    if (correctedUrl === '/media/partner_dpr.png') correctedUrl = '/media/partner_setjen_dpr_ri.png';
    if (correctedUrl === '/media/partner_pupr.png') correctedUrl = '/media/partner_kemenpupr.png';
    if (correctedUrl === '/media/partner_ombudsman.png') correctedUrl = '/media/partner_ombudsman_ri.png';
    return { ...p, logoUrl: correctedUrl };
  });

  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <main>
      {/* =================== HERO =================== */}
      <section className="hero-gradient" style={{ paddingTop: "72px", minHeight: "100vh", display: "flex", alignItems: "center" }}>
        <div className="container" style={{ position: "relative", zIndex: 1, paddingBlock: "5rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}>
            {/* Left: Text */}
            <div>
              <div className="animate-fade-in-up" style={{ marginBottom: "1.5rem" }}>
                <span
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "0.5rem",
                    background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: "9999px", padding: "0.375rem 1rem",
                    fontSize: "0.8125rem", fontWeight: "600", color: "rgba(255,255,255,0.9)",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}
                >
                  <Star size={12} fill="var(--color-gold-400)" color="var(--color-gold-400)" />
                  {heroBadge}
                </span>
              </div>

              <h1
                className="text-display animate-fade-in-up delay-100"
                style={{ color: "white", marginBottom: "1.5rem", letterSpacing: "-0.02em" }}
              >
                {heroTitle}{" "}
                <span style={{ color: "var(--color-gold-300)" }}>{heroTitleHighlight}</span>
                {" "}{heroTitleSuffix}
              </h1>

              <p
                className="text-body-lg animate-fade-in-up delay-200"
                style={{ color: "rgba(255,255,255,0.75)", marginBottom: "2.5rem", maxWidth: "500px", whiteSpace: "pre-line" }}
              >
                {heroDescription}
              </p>

              <div className="animate-fade-in-up delay-300" style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                <Link href="/layanan" className="btn btn-outline-white btn-lg" id="hero-cta-layanan">
                  Lihat Layanan Kami
                </Link>
              </div>

              <div className="animate-fade-in-up delay-400" style={{ display: "flex", gap: "1.5rem", marginTop: "2.5rem", flexWrap: "wrap" }}>
                {heroFeatures.map((item: string, idx: number) => (
                  <div key={idx} style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                    <CheckCircle2 size={14} color="var(--color-gold-300)" />
                    <span style={{ fontSize: "0.8125rem", color: "rgba(255,255,255,0.75)", fontWeight: "500" }}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Floating Stats Cards */}
            <div className="animate-fade-in delay-300" style={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center" }}>
              <div style={{ position: "relative", width: "100%", maxWidth: "420px", height: "380px" }}>
                {/* Central element */}
                <div
                  className="animate-float"
                  style={{
                    position: "absolute", top: "50%", left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "120px", height: "120px",
                    background: "linear-gradient(135deg, rgba(255,255,255,0.25), rgba(255,255,255,0.08))",
                    backdropFilter: "blur(16px)",
                    borderRadius: "24px",
                    border: "1px solid rgba(255,255,255,0.3)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 16px 48px rgba(0,0,0,0.2)",
                  }}
                >
                  <div style={{ textAlign: "center" }}>
                    <TrendingUp size={36} color="var(--color-gold-300)" />
                    <div style={{ fontSize: "0.6875rem", color: "rgba(255,255,255,0.7)", marginTop: "0.375rem", fontWeight: "600" }}>
                      GROWING
                    </div>
                  </div>
                </div>

                {/* Floating stat cards */}
                {displayStats.map(({ label, value, suffix, icon: Icon }: any, idx: number) => {
                  const positions = [
                    { top: "5%", left: "0%", delay: "0s" },
                    { top: "5%", right: "0%", delay: "0.5s" },
                    { bottom: "5%", left: "5%", delay: "1s" },
                    { bottom: "5%", right: "5%", delay: "1.5s" },
                  ];
                  const { top, left, right, bottom, delay } = positions[idx % positions.length];
                  
                  return (
                  <div
                    key={label}
                    style={{
                      position: "absolute", top, left, right, bottom,
                      background: "rgba(255,255,255,0.12)",
                      backdropFilter: "blur(16px)",
                      border: "1px solid rgba(255,255,255,0.2)",
                      borderRadius: "16px",
                      padding: "1rem 1.25rem",
                      minWidth: "110px",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
                      animation: `float 4s ease-in-out infinite`,
                      animationDelay: delay,
                    }}
                  >
                    <Icon size={18} color="var(--color-gold-300)" style={{ marginBottom: "0.375rem" }} />
                    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: "800", fontSize: "1.375rem", color: "white", lineHeight: "1" }}>
                      {value}{suffix}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.65)", marginTop: "0.25rem" }}>
                      {label}
                    </div>
                  </div>
                )})}
              </div>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, overflow: "hidden", lineHeight: 0 }}>
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none" style={{ display: "block", width: "100%", height: "60px" }}>
            <path d="M0,60 L1440,60 L1440,20 Q1080,60 720,30 Q360,0 0,30 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* =================== STATS =================== */}
      <section style={{ paddingBlock: "0" }} ref={statsRef}>
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "1px",
              background: "var(--color-neutral-100)",
              borderRadius: "20px",
              boxShadow: "0 8px 48px rgba(11,45,107,0.10)",
              border: "1px solid var(--color-neutral-100)",
              marginTop: "-30px",
              position: "relative",
              zIndex: 10,
            }}
          >
            {displayStats.map((stat: any, i: number) => (
              <div key={i} style={{ background: "white" }}>
                <StatCard stat={stat} index={i} total={displayStats.length} visible={statsVisible} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =================== SERVICES =================== */}
      <section className="section">
        <div className="container">
          <div className="section-title">
            <span className="overline">{berandaData?.servicesIntro?.badge || "Layanan Kami"}</span>
            <h2 dangerouslySetInnerHTML={{ __html: berandaData?.servicesIntro?.title || "Solusi Lengkap untuk<br />Penguatan Kapasitas Instansi" }}></h2>
            <div className="gold-divider" />
            <p style={{ marginTop: "1rem" }}>
              {berandaData?.servicesIntro?.description || "Enam pilar layanan terintegrasi yang dirancang khusus untuk memenuhi kebutuhan transformasi instansi pemerintah dan profesional Indonesia."}
            </p>
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "1.5rem",
            }}
          >
            {displayServices.map((service: any) => (
              <Link
                key={service.title}
                href={service.href}
                style={{ textDecoration: "none", width: "100%", maxWidth: "360px", flexGrow: 1 }}
              >
                <div
                  className="card"
                  style={{ padding: "2rem", height: "100%", cursor: "pointer", position: "relative", overflow: "hidden" }}
                >
                  {/* Decorative gradient strip */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0, left: 0, right: 0,
                      height: "4px",
                      background: service.gradient,
                    }}
                  />
                  <div
                    style={{
                      width: "52px", height: "52px",
                      background: service.gradient,
                      borderRadius: "14px",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      marginBottom: "1.25rem",
                      boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                    }}
                  >
                    <service.icon size={24} color="white" />
                  </div>
                  <span
                    style={{
                      display: "inline-block",
                      fontSize: "0.6875rem",
                      fontWeight: "600",
                      color: "var(--color-gold-600)",
                      background: "var(--color-gold-100)",
                      borderRadius: "99px",
                      padding: "0.2rem 0.625rem",
                      marginBottom: "0.75rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    {service.tag}
                  </span>
                  <h3 style={{ fontSize: "1.125rem", marginBottom: "0.75rem", color: "var(--color-neutral-900)" }}>
                    {service.title}
                  </h3>
                  <p style={{ fontSize: "0.875rem", color: "var(--color-neutral-500)", lineHeight: "1.6", marginBottom: "1.5rem" }}>
                    {service.description}
                  </p>
                  <span
                    style={{
                      display: "inline-flex", alignItems: "center", gap: "0.375rem",
                      fontSize: "0.875rem", fontWeight: "600",
                      color: "var(--color-primary-600)",
                    }}
                  >
                    Selengkapnya <ChevronRight size={16} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>



      {/* =================== ARTICLES =================== */}
      <section className="section">
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2.5rem", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <span className="badge badge-primary" style={{ marginBottom: "0.75rem" }}>Artikel & Insight</span>
              <h2 className="text-heading-xl" style={{ margin: "0" }}>Pengetahuan untuk Profesional</h2>
              <div className="gold-divider" style={{ margin: "0.75rem 0 0" }} />
            </div>
            <Link href="/artikel" className="btn btn-secondary" id="see-all-articles">
              Lihat Semua Artikel <ArrowRight size={16} />
            </Link>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "1.5rem" }}>
            {displayArticles.map((article: any) => (
              <Link key={article.id} href={`/artikel/${article.slug}`} style={{ textDecoration: "none", display: "block", width: "100%", maxWidth: "360px", flexGrow: 1 }}>
                <div className="card" style={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
                  {article.imageUrl ? (
                    <div style={{ height: "180px", backgroundColor: "#f1f5f9", position: "relative" }}>
                      <Image src={article.imageUrl} alt={article.title} fill style={{ objectFit: "cover" }} sizes="(max-width: 768px) 100vw, 33vw" />
                      <span
                        style={{
                          position: "absolute", top: "1rem", left: "1rem",
                          background: article.categoryBg,
                          color: article.categoryColor,
                          fontSize: "0.6875rem", fontWeight: "700",
                          borderRadius: "99px", padding: "0.2rem 0.75rem",
                          letterSpacing: "0.06em",
                        }}
                      >
                        {article.category}
                      </span>
                    </div>
                  ) : (
                    <div
                      style={{
                        height: "180px",
                        background: `linear-gradient(135deg, var(--color-primary-900), var(--color-primary-700))`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        position: "relative", overflow: "hidden",
                      }}
                    >
                      <FileText size={48} color="rgba(255,255,255,0.2)" />
                      <span
                        style={{
                          position: "absolute", top: "1rem", left: "1rem",
                          background: article.categoryBg,
                          color: article.categoryColor,
                          fontSize: "0.6875rem", fontWeight: "700",
                          borderRadius: "99px", padding: "0.2rem 0.75rem",
                          letterSpacing: "0.06em",
                        }}
                      >
                        {article.category}
                      </span>
                    </div>
                  )}
                  <div style={{ padding: "1.5rem" }}>
                    <h3 style={{ fontSize: "1rem", lineHeight: "1.4", marginBottom: "0.75rem", color: "var(--color-neutral-900)" }}>
                      {article.title}
                    </h3>
                    <p style={{ fontSize: "0.875rem", color: "var(--color-neutral-500)", lineHeight: "1.6", marginBottom: "1.25rem" }}>
                      {article.excerpt}
                    </p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "1rem", borderTop: "1px solid var(--color-neutral-100)" }}>
                      <div>
                        <div style={{ fontSize: "0.8125rem", fontWeight: "600", color: "var(--color-neutral-700)" }}>
                          {article.author}
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "var(--color-neutral-400)" }}>
                          {article.date} · {article.readTime}
                        </div>
                      </div>
                      <ChevronRight size={18} color="var(--color-primary-500)" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* =================== TEAM =================== */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-title">
            <span className="overline">Tim Pakar</span>
            <h2>Dipercaya oleh Para Profesional<br />Terbaik Indonesia</h2>
            <div className="gold-divider" />
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "1.5rem" }}>
            {displayTeamMembers.map((member: any) => (
              <div key={member.id} style={{ width: "100%", maxWidth: "280px" }}>
                <TeamMemberCard member={member} />
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
            <Link href="/tim" className="btn btn-secondary" id="see-all-team">
              Lihat Semua Tim & Pakar <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* =================== PARTNERS =================== */}
      <section className="section-sm" style={{ overflow: "hidden", borderTop: "1px solid var(--color-neutral-100)", borderBottom: "1px solid var(--color-neutral-100)" }}>
        <div className="container" style={{ marginBottom: "1.5rem", textAlign: "center" }}>
          <p style={{ fontSize: "0.8125rem", color: "var(--color-neutral-400)", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            {partnersTitle}
          </p>
        </div>
        <div style={{ position: "relative", overflow: "hidden" }}>
          <div
            className="animate-marquee"
            style={{
              display: "flex",
              gap: "2rem",
              width: "max-content",
            }}
          >
            {[...displayPartners, ...displayPartners].map((partner: any, i: number) => (
              <div
                key={i}
                style={{
                  background: "var(--color-neutral-50)",
                  border: "1px solid var(--color-neutral-200)",
                  borderRadius: "10px",
                  padding: "0.75rem 1.5rem",
                  whiteSpace: "nowrap",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  color: "var(--color-neutral-600)",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "54px",
                }}
              >
                {partner.logo && typeof partner.logo === 'object' && partner.logo.url ? (
                  <img src={partner.logo.url} alt={partner.name} style={{ height: "100%", maxHeight: "30px", objectFit: "contain" }} />
                ) : partner.logoUrl ? (
                  <img src={partner.logoUrl} alt={partner.name} style={{ height: "100%", maxHeight: "30px", objectFit: "contain" }} />
                ) : (
                  <span>{partner.name}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =================== CTA BANNER =================== */}
      <section
        style={{
          background: "linear-gradient(135deg, var(--color-primary-900) 0%, var(--color-primary-700) 100%)",
          padding: "5rem 0",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(ellipse at 30% 50%, rgba(30,111,217,0.3) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div className="container" style={{ position: "relative", textAlign: "center" }}>
          <div style={{ marginBottom: "1.25rem" }}>
            <Award size={48} color="var(--color-gold-300)" style={{ margin: "0 auto" }} />
          </div>
          <h2 style={{ color: "white", fontSize: "clamp(1.75rem, 3vw, 2.5rem)", marginBottom: "1rem", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Siap Melakukan Transformasi<br />Instansi Anda Bersama Kami?
          </h2>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "1.0625rem", marginBottom: "2.5rem", maxWidth: "560px", margin: "0 auto 2.5rem" }}>
            Lebih dari 200 instansi pemerintah dan swasta telah mempercayakan pengembangan SDM dan tata kelola mereka kepada PT Mahaga Widya Cita.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <a
              href="https://wa.me/6221123456789?text=Halo%2C%20saya%20ingin%20konsultasi%20mengenai%20layanan%20PT%20Mahaga%20Widya%20Cita"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-gold btn-lg"
              id="cta-whatsapp-consulting"
            >
              <MessageSquare size={18} />
              Konsultasi Gratis via WhatsApp
            </a>
            <Link href="/kontak" className="btn btn-outline-white btn-lg" id="cta-contact-form">
              Kirim Email ke Kami
            </Link>
          </div>
          <div style={{ display: "flex", gap: "2rem", justifyContent: "center", marginTop: "2.5rem", flexWrap: "wrap" }}>
            {["Respons dalam 24 Jam", "Konsultasi Awal Gratis", "Tim Berpengalaman 10+ Tahun"].map((item) => (
              <div key={item} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <CheckCircle2 size={15} color="var(--color-gold-300)" />
                <span style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.8)", fontWeight: "500" }}>
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
