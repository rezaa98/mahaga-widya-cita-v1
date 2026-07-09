import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { notFound } from "next/navigation";
import { CheckCircle2, ArrowRight, MessageSquare } from "lucide-react";
import Link from "next/link";

const services: Record<string, {
  title: string;
  tagline: string;
  description: string;
  color: string;
  gradient: string;
  features: string[];
  benefits: { title: string; desc: string }[];
  targetAudience: string[];
}> = {
  konsultasi: {
    title: "Smart Consulting",
    tagline: "Solusi Strategis untuk Tata Kelola Pemerintahan Berkelas Dunia",
    description: "Layanan konsultasi manajemen strategis yang dirancang untuk membantu instansi pemerintah dan swasta dalam merancang, mengimplementasikan, dan mengevaluasi sistem tata kelola yang efektif dan akuntabel.",
    color: "var(--color-primary-600)",
    gradient: "linear-gradient(135deg, #1E6FD9, #0B2D6B)",
    features: ["Analisis kebutuhan tata kelola mendalam", "Penyusunan SOP dan prosedur kerja", "Evaluasi kinerja berbasis SAKIP/LAKIP", "Pendampingan reformasi birokrasi", "Review regulasi dan kebijakan", "Perencanaan strategis jangka menengah"],
    benefits: [
      { title: "Berbasis Riset", desc: "Setiap rekomendasi didasarkan pada kajian akademis dan best practice internasional." },
      { title: "Tim Pakar", desc: "Didukung para akademisi dan praktisi berpengalaman di bidang administrasi publik." },
      { title: "Hasil Terukur", desc: "Progres dan dampak konsultasi dapat diukur dengan KPI yang disepakati bersama." },
      { title: "Pendampingan Penuh", desc: "Kami hadir dari perencanaan hingga evaluasi, memastikan implementasi berjalan optimal." },
    ],
    targetAudience: ["Kementerian dan Lembaga Pemerintah Pusat", "Pemerintah Daerah (Provinsi, Kabupaten, Kota)", "BUMN dan BUMD", "Perusahaan swasta yang membutuhkan penguatan tata kelola"],
  },
  edukasi: {
    title: "Smart Executive Education",
    tagline: "Program Pelatihan Eksklusif untuk Pemimpin yang Berdampak",
    description: "Program pendidikan eksekutif dirancang khusus untuk pimpinan dan calon pimpinan instansi dengan pendekatan pembelajaran aktif, studi kasus nyata, dan fasilitasi dari pakar terbaik.",
    color: "var(--color-gold-600)",
    gradient: "linear-gradient(135deg, #C9970A, #A07508)",
    features: ["Pelatihan kepemimpinan transformasional", "Manajemen perubahan dan inovasi", "Pengelolaan keuangan publik", "Komunikasi publik & public speaking", "Workshop capacity building", "Benchmarking ke instansi unggulan"],
    benefits: [
      { title: "Metode Interaktif", desc: "Pembelajaran berbasis diskusi, simulasi, dan studi kasus nyata dari berbagai instansi." },
      { title: "Fasilitator Pakar", desc: "Dipandu oleh Guru Besar dan praktisi senior dengan rekam jejak terbukti." },
      { title: "Jaringan Profesional", desc: "Bergabung dengan komunitas eksklusif pimpinan instansi dari seluruh Indonesia." },
      { title: "Sertifikasi Resmi", desc: "Dapatkan sertifikat resmi yang diakui oleh instansi pemerintah terkait." },
    ],
    targetAudience: ["Pejabat Eselon I, II, dan III", "Kepala Dinas dan OPD", "Direktur dan Komisaris BUMN/BUMD", "Eksekutif perusahaan swasta"],
  },
  software: {
    title: "Smart Software Service",
    tagline: "Teknologi Adaptif untuk Transformasi Digital Instansi Anda",
    description: "Pengembangan sistem informasi manajemen, aplikasi, dan infrastruktur digital yang dirancang sesuai kebutuhan spesifik instansi, mengikuti standar keamanan dan interoperabilitas pemerintah.",
    color: "#7C3AED",
    gradient: "linear-gradient(135deg, #7C3AED, #5B21B6)",
    features: ["Pengembangan Sistem Informasi Manajemen (SIM)", "Aplikasi monitoring dan evaluasi kinerja", "Dashboard pelaporan berbasis data real-time", "Integrasi dengan sistem SPBE pemerintah", "Audit teknologi dan keamanan siber", "Pelatihan penggunaan sistem"],
    benefits: [
      { title: "Standar SPBE", desc: "Mengikuti Sistem Pemerintahan Berbasis Elektronik (SPBE) sesuai regulasi nasional." },
      { title: "Keamanan Terjamin", desc: "Sistem dibangun dengan standar keamanan data sesuai peraturan yang berlaku." },
      { title: "Skalabel", desc: "Arsitektur yang dapat berkembang seiring dengan kebutuhan instansi." },
      { title: "Dukungan Purna Jual", desc: "Garansi dan dukungan teknis selama minimal 1 tahun setelah serah terima." },
    ],
    targetAudience: ["Instansi yang memerlukan digitalisasi layanan publik", "Dinas yang membutuhkan sistem monitoring kinerja", "BUMN yang ingin mengoptimalkan proses bisnis", "Pemda yang ingin meningkatkan skor SPBE"],
  },
  "governance-review": {
    title: "Smart Governance Review",
    tagline: "Review Mendalam untuk Tata Kelola yang Transparan dan Akuntabel",
    description: "Layanan review komprehensif atas sistem tata kelola, kepatuhan regulasi, dan pengelolaan risiko instansi. Menghasilkan rekomendasi berbasis bukti untuk perbaikan berkelanjutan.",
    color: "var(--color-success)",
    gradient: "linear-gradient(135deg, #059669, #047857)",
    features: ["Review sistem pengendalian internal (SPIP)", "Evaluasi kepatuhan regulasi dan kebijakan", "Penilaian maturitas tata kelola", "Analisis risiko dan manajemen risiko", "Review LAKIP/LKJIP", "Penilaian indeks inovasi pelayanan publik"],
    benefits: [
      { title: "Independen & Objektif", desc: "Review dilakukan secara independen dengan metodologi ilmiah yang terstandar." },
      { title: "Rekomendasi Aplikatif", desc: "Setiap temuan disertai rekomendasi konkret yang dapat langsung diterapkan." },
      { title: "Laporan Profesional", desc: "Laporan lengkap, terstruktur, dan siap dipresentasikan kepada pimpinan atau auditor." },
      { title: "Tindak Lanjut", desc: "Pendampingan implementasi rekomendasi perbaikan selama periode yang disepakati." },
    ],
    targetAudience: ["Instansi yang hendak meningkatkan nilai SAKIP", "Pemerintah daerah dalam persiapan evaluasi Kemenpan-RB", "BUMN yang mempersiapkan audit eksternal", "Organisasi yang menghadapi perubahan regulasi"],
  },
  "online-course": {
    title: "Smart Online Course",
    tagline: "Belajar Kapan Saja, Di Mana Saja, dengan Sertifikasi Resmi",
    description: "Platform kursus online interaktif dengan ratusan modul materi edukasi yang relevan bagi ASN dan profesional. Dilengkapi kuis, progres tracking, dan penerbitan sertifikat digital otomatis.",
    color: "var(--color-danger)",
    gradient: "linear-gradient(135deg, #DC2626, #B91C1C)",
    features: ["200+ modul kursus terstruktur", "Video pembelajaran berkualitas HD", "Kuis interaktif dan evaluasi mandiri", "Sertifikat digital dengan QR verifikasi", "Akses seumur hidup setelah daftar", "Forum diskusi peserta & instruktur"],
    benefits: [
      { title: "Fleksibel", desc: "Belajar sesuai jadwal Anda, akses dari perangkat apa pun, kapan pun." },
      { title: "Kurikulum Relevan", desc: "Materi dirancang bersama praktisi dan akademisi yang memahami kebutuhan lapangan." },
      { title: "Sertifikat Digital", desc: "Sertifikat resmi dilengkapi QR Code yang dapat diverifikasi secara publik." },
      { title: "Terjangkau", desc: "Tersedia kursus gratis dan berbayar dengan harga yang sangat terjangkau." },
    ],
    targetAudience: ["ASN yang ingin meningkatkan kompetensi individu", "Profesional swasta yang butuh pengembangan karir", "Mahasiswa yang ingin memahami tata kelola pemerintahan", "Tim instansi yang perlu pelatihan kolektif"],
  },
  "digital-conference": {
    title: "Smart Digital Conference",
    tagline: "Forum Diskusi Berkualitas Tinggi, Menjangkau Ribuan Peserta",
    description: "Penyelenggaraan konferensi, seminar, dan forum diskusi digital profesional yang menghubungkan para pakar, pemangku kebijakan, dan praktisi dalam satu platform yang interaktif.",
    color: "#0891B2",
    gradient: "linear-gradient(135deg, #0891B2, #0E7490)",
    features: ["Penyelenggaraan webinar & hybrid event", "Produksi visual & materi presentasi profesional", "Live streaming multi-platform (Zoom, YouTube, Instagram)", "Moderasi profesional oleh MC berpengalaman", "Distribusi sertifikat peserta massal", "Rekaman dan dokumentasi acara"],
    benefits: [
      { title: "Jangkauan Luas", desc: "Satu acara bisa menjangkau ribuan peserta dari seluruh Indonesia tanpa batasan geografis." },
      { title: "Produksi Profesional", desc: "Kualitas visual, audio, dan teknis setara siaran televisi profesional." },
      { title: "Engagement Tinggi", desc: "Fitur Q&A, polling, dan sesi breakout untuk diskusi yang lebih interaktif." },
      { title: "End-to-End Management", desc: "Kami mengelola seluruh proses dari persiapan, pelaksanaan, hingga dokumentasi akhir." },
    ],
    targetAudience: ["Kementerian dan lembaga yang ingin menggelar webinar nasional", "Universitas dan lembaga riset yang menyelenggarakan seminar", "Asosiasi profesi yang mengadakan konferensi tahunan", "Perusahaan yang membutuhkan event digital korporasi"],
  },
};

export async function generateStaticParams() {
  return Object.keys(services).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = services[slug];
  if (!service) return { title: "Layanan Tidak Ditemukan" };
  return { title: service.title, description: service.description };
}

export default async function LayananDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = services[slug];
  if (!service) notFound();

  return (
    <>
      <Navbar />

      {/* HERO */}
      <section style={{ background: service.gradient, paddingTop: "calc(72px + 4rem)", paddingBottom: "5rem", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 70% 50%, rgba(255,255,255,0.08) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div className="container" style={{ position: "relative" }}>
          <span className="badge" style={{ background: "rgba(255,255,255,0.2)", color: "white", marginBottom: "1rem" }}>Layanan Kami</span>
          <h1 className="text-display" style={{ color: "white", marginBottom: "1rem", maxWidth: "640px" }}>{service.title}</h1>
          <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "1.25rem", fontStyle: "italic", marginBottom: "1.5rem" }}>{service.tagline}</p>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "1.0625rem", maxWidth: "560px", lineHeight: "1.7" }}>{service.description}</p>
          <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
            <Link href="/kontak" className="btn" style={{ background: "white", color: service.color, fontWeight: "700" }} id={`cta-${slug}-contact`}>
              <MessageSquare size={16} /> Konsultasi Gratis
            </Link>
            <Link href="/webinar" className="btn btn-outline-white" id={`cta-${slug}-webinar`}>
              Lihat Webinar Terkait
            </Link>
          </div>
        </div>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, lineHeight: 0 }}>
          <svg viewBox="0 0 1440 48" style={{ display: "block", width: "100%", height: "48px" }}>
            <path d="M0,48 L1440,48 L1440,16 Q1080,48 720,24 Q360,0 0,24 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* FEATURES + BENEFITS */}
      <section className="section">
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "start" }}>
            <div>
              <span className="badge badge-primary" style={{ marginBottom: "1rem" }}>Cakupan Layanan</span>
              <h2 className="text-heading-xl" style={{ marginBottom: "0.75rem" }}>Apa yang Kami Kerjakan</h2>
              <div className="gold-divider" style={{ margin: "0 0 2rem" }} />
              <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
                {service.features.map((f) => (
                  <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: "0.875rem" }}>
                    <CheckCircle2 size={18} color={service.color} style={{ flexShrink: 0, marginTop: "2px" }} />
                    <span style={{ fontSize: "0.9375rem", color: "var(--color-neutral-700)" }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <span className="badge badge-gold" style={{ marginBottom: "1rem" }}>Keunggulan</span>
              <h2 className="text-heading-xl" style={{ marginBottom: "0.75rem" }}>Mengapa Memilih Kami</h2>
              <div className="gold-divider" style={{ margin: "0 0 2rem" }} />
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                {service.benefits.map(({ title, desc }) => (
                  <div key={title} className="card" style={{ padding: "1.25rem 1.5rem", display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: service.color, flexShrink: 0, marginTop: "6px" }} />
                    <div>
                      <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: "700", marginBottom: "0.375rem", color: "var(--color-neutral-900)" }}>{title}</div>
                      <div style={{ fontSize: "0.875rem", color: "var(--color-neutral-500)", lineHeight: "1.6" }}>{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TARGET AUDIENCE */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-title">
            <span className="overline">Untuk Siapa</span>
            <h2>Layanan ini Ditujukan untuk</h2>
            <div className="gold-divider" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem", maxWidth: "800px", margin: "0 auto" }}>
            {service.targetAudience.map((a, i) => (
              <div key={a} className="card" style={{ padding: "1.25rem 1.5rem", display: "flex", gap: "1rem", alignItems: "center" }}>
                <div style={{ width: "32px", height: "32px", background: service.gradient, borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: "800", fontSize: "0.875rem", color: "white" }}>
                  {i + 1}
                </div>
                <span style={{ fontSize: "0.9375rem", color: "var(--color-neutral-700)" }}>{a}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: service.gradient, padding: "4.5rem 0", position: "relative", overflow: "hidden" }}>
        <div className="container" style={{ textAlign: "center", position: "relative" }}>
          <h2 style={{ color: "white", fontSize: "2rem", marginBottom: "1rem" }}>Tertarik dengan Layanan Ini?</h2>
          <p style={{ color: "rgba(255,255,255,0.75)", marginBottom: "2rem", fontSize: "1.0625rem" }}>
            Hubungi tim kami sekarang untuk mendapatkan informasi lebih lanjut dan konsultasi awal secara gratis.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
            <Link href="/kontak" className="btn" style={{ background: "white", color: service.color, fontWeight: "700" }} id={`cta-bottom-${slug}`}>
              Hubungi Kami <ArrowRight size={16} />
            </Link>
            <Link href="/layanan" className="btn btn-outline-white">
              Lihat Layanan Lain
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </>
  );
}
