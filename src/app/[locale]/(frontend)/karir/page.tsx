import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import Link from "next/link";
import { MapPin, Clock, Briefcase, ChevronRight, ArrowRight, Users, Heart } from "lucide-react";
import { WaveDivider } from "@/components/ui/WaveDivider";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Karir",
  description:
    "Bergabunglah bersama tim PT Mahaga Widya Cita dan ikut berkontribusi dalam penguatan tata kelola dan edukasi profesional di Indonesia.",
};

const openings = [
  {
    id: 1,
    title: "Senior Consultant — Tata Kelola Pemerintahan",
    type: "Full-Time",
    location: "Jakarta Selatan (Hybrid)",
    department: "Consulting",
    deadline: "31 Juli 2026",
    requirements: [
      "S2 Administrasi Publik / Kebijakan Publik",
      "Min. 5 tahun pengalaman di pemerintahan atau konsultan",
      "Berpengalaman dalam SAKIP, SPIP, dan reformasi birokrasi",
      "Komunikatif dan mampu memfasilitasi pelatihan",
    ],
  },
  {
    id: 2,
    title: "Frontend Developer — Next.js & TypeScript",
    type: "Full-Time",
    location: "Jakarta Selatan (WFO)",
    department: "Teknologi",
    deadline: "25 Juli 2026",
    requirements: [
      "Min. S1 Teknik Informatika / Ilmu Komputer",
      "Menguasai Next.js, TypeScript, dan Tailwind CSS",
      "Berpengalaman dengan REST API dan state management",
      "Portofolio proyek yang dapat ditunjukkan",
    ],
  },
  {
    id: 3,
    title: "Content Writer & Editor",
    type: "Full-Time",
    location: "Jakarta Selatan (Hybrid)",
    department: "Konten",
    deadline: "20 Juli 2026",
    requirements: [
      "S1 Komunikasi / Jurnalistik / Sastra",
      "Kemampuan menulis artikel ilmiah populer",
      "Familiar dengan isu-isu kebijakan publik dan pemerintahan",
      "Menguasai SEO writing",
    ],
  },
  {
    id: 4,
    title: "Program Coordinator — Webinar & Events",
    type: "Contract (1 Tahun)",
    location: "Jakarta Selatan (WFO)",
    department: "Program",
    deadline: "15 Juli 2026",
    requirements: [
      "S1 segala jurusan",
      "Pengalaman koordinasi acara / event organizer",
      "Terampil menggunakan Zoom, Google Workspace",
      "Detail-oriented dan mampu multitasking",
    ],
  },
];

const benefits = [
  {
    icon: Briefcase,
    title: "Karir Bermakna",
    desc: "Berkontribusi langsung pada penguatan tata kelola dan pendidikan profesional Indonesia.",
  },
  {
    icon: Users,
    title: "Tim Kolaboratif",
    desc: "Bekerja bersama akademisi, pakar, dan praktisi terbaik dari seluruh Indonesia.",
  },
  {
    icon: Heart,
    title: "Lingkungan Supportif",
    desc: "Budaya kerja yang mendukung pertumbuhan, belajar, dan inovasi setiap hari.",
  },
  {
    icon: ArrowRight,
    title: "Pengembangan Diri",
    desc: "Akses gratis ke seluruh kursus, webinar, dan program pelatihan perusahaan.",
  },
];

const departmentColors: Record<string, { color: string; bg: string }> = {
  Consulting: { color: "var(--color-primary-700)", bg: "var(--color-primary-100)" },
  Teknologi: { color: "#7C3AED", bg: "#EDE9FE" },
  Konten: { color: "var(--color-gold-600)", bg: "var(--color-gold-100)" },
  Program: { color: "var(--color-success)", bg: "var(--color-success-light)" },
};

export default function KarirPage() {
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
            Karir
          </span>
          <h1 className="text-display" style={{ color: "white", marginBottom: "1.25rem", maxWidth: "640px" }}>
            Bergabunglah & Buat
            <br />
            <span style={{ color: "var(--color-gold-300)" }}>Dampak Nyata untuk Indonesia</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "1.125rem", maxWidth: "500px" }}>
            Kami mencari individu-individu terbaik yang passionate untuk ikut memperkuat kapasitas SDM dan tata kelola
            di Indonesia.
          </p>
        </div>
        <WaveDivider fill="white" />
      </section>

      {/* BENEFITS */}
      <section className="section">
        <div className="container">
          <div className="section-title">
            <span className="overline">Mengapa Bergabung</span>
            <h2>Lebih dari Sekedar Pekerjaan</h2>
            <div className="gold-divider" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem" }}>
            {benefits.map(({ icon: Icon, title, desc }) => (
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

      {/* OPENINGS */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-title">
            <span className="overline">Posisi Terbuka</span>
            <h2>Lowongan Saat Ini</h2>
            <div className="gold-divider" />
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1.25rem", maxWidth: "900px", margin: "0 auto" }}
          >
            {openings.map((job) => {
              const deptStyle = departmentColors[job.department] ?? {
                color: "var(--color-neutral-600)",
                bg: "var(--color-neutral-100)",
              };
              return (
                <div key={job.id} className="card" style={{ padding: "2rem" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: "1.5rem",
                      flexWrap: "wrap",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", gap: "0.625rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
                        <span
                          style={{
                            fontSize: "0.6875rem",
                            fontWeight: "600",
                            background: deptStyle.bg,
                            color: deptStyle.color,
                            borderRadius: "99px",
                            padding: "0.2rem 0.75rem",
                            textTransform: "uppercase",
                            letterSpacing: "0.06em",
                          }}
                        >
                          {job.department}
                        </span>
                        <span className="badge badge-primary">{job.type}</span>
                      </div>
                      <h3 style={{ fontSize: "1.125rem", marginBottom: "0.875rem" }}>{job.title}</h3>
                      <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.375rem",
                            fontSize: "0.8125rem",
                            color: "var(--color-neutral-500)",
                          }}
                        >
                          <MapPin size={13} /> {job.location}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.375rem",
                            fontSize: "0.8125rem",
                            color: "var(--color-neutral-500)",
                          }}
                        >
                          <Clock size={13} /> Deadline: {job.deadline}
                        </div>
                      </div>
                      <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                        {job.requirements.map((r) => (
                          <li
                            key={r}
                            style={{
                              fontSize: "0.875rem",
                              color: "var(--color-neutral-600)",
                              display: "flex",
                              gap: "0.5rem",
                            }}
                          >
                            <ChevronRight
                              size={14}
                              color="var(--color-primary-400)"
                              style={{ flexShrink: 0, marginTop: "2px" }}
                            />
                            {r}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Link
                      href={`/kontak?subjek=Lamaran%20Pekerjaan&posisi=${encodeURIComponent(job.title)}`}
                      className="btn btn-primary"
                      style={{ flexShrink: 0 }}
                      id={`apply-job-${job.id}`}
                    >
                      Lamar Sekarang
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SPONTANEOUS APPLICATION */}
      <section
        style={{
          background: "linear-gradient(135deg, var(--color-primary-900), var(--color-primary-700))",
          padding: "4.5rem 0",
        }}
      >
        <div className="container" style={{ textAlign: "center" }}>
          <h2 style={{ color: "white", marginBottom: "1rem" }}>Tidak Ada Posisi yang Sesuai?</h2>
          <p style={{ color: "rgba(255,255,255,0.75)", marginBottom: "2rem", fontSize: "1.0625rem" }}>
            Kirimkan lamaran spontan Anda. Kami selalu tertarik bertemu dengan individu-individu berbakat.
          </p>
          <Link href="/kontak?subjek=Lamaran%20Spontan" className="btn btn-gold btn-lg" id="cta-spontaneous-apply">
            Kirim Lamaran Spontan
          </Link>
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </>
  );
}
