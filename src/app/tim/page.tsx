import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import Link from "next/link";
import { Globe, BookOpen } from "lucide-react";

// Custom social media SVG icons (not available in lucide-react)
const IconLinkedin = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect width="4" height="12" x="2" y="9"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

export const metadata: Metadata = {
  title: "Tim & Manajemen",
  description: "Kenali para pakar dan manajemen PT Mahaga Widya Cita yang berpengalaman di bidang administrasi publik, tata kelola, dan teknologi.",
};

const management = [
  { initials: "EL", name: "Prof. Dr. Hj. Endang Larasati, M.S.", role: "Direktur Utama", expertise: "Administrasi Publik & Kebijakan Pemerintahan", bio: "Guru Besar Administrasi Publik dengan pengalaman 30+ tahun di bidang reformasi birokrasi dan penguatan tata kelola pemerintahan. Aktif sebagai konsultan di berbagai kementerian dan lembaga nasional.", color: "linear-gradient(135deg, #1E6FD9, #0B2D6B)" },
  { initials: "OR", name: "Dr. Oscar Radyan Danar, M.A.", role: "Direktur Program", expertise: "Kebijakan Publik & Reformasi Birokrasi", bio: "Doktor kebijakan publik dengan spesialisasi reformasi birokrasi dan inovasi pelayanan publik. Penulis lebih dari 20 jurnal ilmiah dan pembicara di 100+ forum nasional dan internasional.", color: "linear-gradient(135deg, #C9970A, #A07508)" },
  { initials: "RF", name: "Rizki Firmansyah, M.Sc.", role: "Direktur Teknologi", expertise: "Transformasi Digital & IT Governance", bio: "Spesialis transformasi digital sektor publik dengan pengalaman memimpin proyek SPBE di 15+ instansi pemerintah. Bersertifikasi CISA dan COBIT 2019.", color: "linear-gradient(135deg, #7C3AED, #5B21B6)" },
];

const experts = [
  { initials: "AB", name: "Prof. Dr. Ahmad Basori, M.M.", expertise: "Manajemen Keuangan Daerah & APBD", institution: "Universitas Indonesia", color: "linear-gradient(135deg, #059669, #047857)" },
  { initials: "SD", name: "Sari Dewi Purnama, S.Psi., M.Si.", expertise: "Psikologi Organisasi & Manajemen SDM", institution: "Universitas Gadjah Mada", color: "linear-gradient(135deg, #DC2626, #B91C1C)" },
  { initials: "BW", name: "Dr. Bambang Wiyono, S.H., M.H.", expertise: "Hukum Administrasi & Regulasi Publik", institution: "Universitas Diponegoro", color: "linear-gradient(135deg, #0891B2, #0E7490)" },
  { initials: "RA", name: "Rudi Ardiansyah, M.Kom.", expertise: "Sistem Informasi & Keamanan Siber", institution: "Institut Teknologi Bandung", color: "linear-gradient(135deg, #D97706, #B45309)" },
  { initials: "NA", name: "Nurul Aini, M.Pd.", expertise: "Pendidikan Profesional & Kurikulum", institution: "Universitas Pendidikan Indonesia", color: "linear-gradient(135deg, #7C3AED, #6D28D9)" },
  { initials: "HS", name: "Dr. Hendra Saputra, M.Sos.", expertise: "Sosiologi Pemerintahan & Otonomi Daerah", institution: "Universitas Airlangga", color: "linear-gradient(135deg, #0B2D6B, #1247A8)" },
];

export default function TimPage() {
  return (
    <>
      <Navbar />

      {/* HERO */}
      <section style={{ background: "linear-gradient(135deg, var(--color-primary-900), var(--color-primary-700))", paddingTop: "calc(72px + 4rem)", paddingBottom: "4rem", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 70% 50%, rgba(30,111,217,0.3) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div className="container" style={{ position: "relative" }}>
          <span className="badge" style={{ background: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.9)", marginBottom: "1rem" }}>Tim & Manajemen</span>
          <h1 className="text-display" style={{ color: "white", marginBottom: "1.25rem", maxWidth: "640px" }}>
            Dipandu oleh Para<br /><span style={{ color: "var(--color-gold-300)" }}>Pakar Terbaik Indonesia</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "1.125rem", maxWidth: "500px" }}>
            Kami bangga memiliki tim yang terdiri dari akademisi, birokrat berpengalaman, dan praktisi teknologi terkemuka.
          </p>
        </div>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, lineHeight: 0 }}>
          <svg viewBox="0 0 1440 48" style={{ display: "block", width: "100%", height: "48px" }}>
            <path d="M0,48 L1440,48 L1440,16 Q1080,48 720,24 Q360,0 0,24 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* MANAGEMENT */}
      <section className="section" id="manajemen">
        <div className="container">
          <div className="section-title">
            <span className="overline">Pimpinan</span>
            <h2>Manajemen Perusahaan</h2>
            <div className="gold-divider" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2rem" }}>
            {management.map((m) => (
              <div key={m.name} className="card" style={{ padding: "0", overflow: "hidden" }}>
                <div style={{ height: "8px", background: m.color }} />
                <div style={{ padding: "2rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.25rem" }}>
                    <div style={{ width: "64px", height: "64px", background: m.color, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: "800", fontSize: "1.125rem", color: "white", flexShrink: 0, boxShadow: "0 4px 16px rgba(0,0,0,0.15)" }}>
                      {m.initials}
                    </div>
                    <div>
                      <h3 style={{ fontSize: "0.9375rem", lineHeight: "1.3", marginBottom: "0.25rem" }}>{m.name}</h3>
                      <div style={{ fontSize: "0.8125rem", fontWeight: "600", color: "var(--color-primary-600)" }}>{m.role}</div>
                    </div>
                  </div>
                  <div className="badge badge-primary" style={{ marginBottom: "0.875rem", fontSize: "0.6875rem" }}>{m.expertise}</div>
                  <p style={{ fontSize: "0.875rem", color: "var(--color-neutral-500)", lineHeight: "1.65" }}>{m.bio}</p>
                  <div style={{ display: "flex", gap: "0.625rem", marginTop: "1.25rem" }}>
                    <a href="#" style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "0.8125rem", color: "var(--color-primary-600)", fontWeight: "500" }}>
                      <IconLinkedin size={14} /> LinkedIn
                    </a>
                    <a href="#" style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "0.8125rem", color: "var(--color-primary-600)", fontWeight: "500" }}>
                      <Globe size={14} /> Profil
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EXPERTS */}
      <section className="section section-alt" id="ahli">
        <div className="container">
          <div className="section-title">
            <span className="overline">Tenaga Ahli</span>
            <h2>Panel Pakar & Instruktur</h2>
            <div className="gold-divider" />
            <p style={{ marginTop: "1rem" }}>
              Program kami didukung oleh para pakar dari universitas dan lembaga riset terkemuka di Indonesia.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" }}>
            {experts.map((e) => (
              <div key={e.name} className="card" style={{ padding: "1.75rem", display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                <div style={{ width: "52px", height: "52px", background: e.color, borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: "800", fontSize: "0.9375rem", color: "white", flexShrink: 0 }}>
                  {e.initials}
                </div>
                <div>
                  <h3 style={{ fontSize: "0.9375rem", lineHeight: "1.3", marginBottom: "0.375rem" }}>{e.name}</h3>
                  <div style={{ fontSize: "0.8125rem", color: "var(--color-primary-600)", fontWeight: "600", marginBottom: "0.375rem" }}>{e.expertise}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "0.75rem", color: "var(--color-neutral-400)" }}>
                    <BookOpen size={12} /> {e.institution}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* JOIN CTA */}
      <section style={{ background: "linear-gradient(135deg, var(--color-primary-900), var(--color-primary-700))", padding: "4.5rem 0" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <h2 style={{ color: "white", marginBottom: "1rem" }}>Bergabung Bersama Tim Pakar Kami</h2>
          <p style={{ color: "rgba(255,255,255,0.75)", marginBottom: "2rem", fontSize: "1.0625rem" }}>
            Kami selalu membuka kesempatan bagi akademisi dan praktisi terbaik untuk berkolaborasi.
          </p>
          <Link href="/karir" className="btn btn-gold btn-lg" id="cta-join-team">
            Lihat Lowongan & Kolaborasi
          </Link>
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </>
  );
}
