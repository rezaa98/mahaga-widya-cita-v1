import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { CheckCircle2, Award, Target, Eye, Users, Building2, Globe, BookOpen } from "lucide-react";
import { WaveDivider } from "@/components/ui/WaveDivider";
import TeamMemberCard from "@/components/ui/TeamMemberCard";
import { getPayload } from "payload";
import configPromise from "@payload-config";

export const metadata: Metadata = {
  title: "Tentang Kami",
  description:
    "Mengenal PT Mahaga Widya Cita — perusahaan konsultasi dan edukasi terdepan yang melayani ASN dan profesional Indonesia sejak 2015.",
};

const defaultValues = [
  {
    icon: 'Target',
    title: "Inovasi",
    description: "Selalu menghadirkan solusi mutakhir yang relevan dengan dinamika kebijakan dan teknologi terkini.",
  },
  {
    icon: 'Users',
    title: "Kolaborasi",
    description: "Membangun ekosistem kemitraan yang saling menguatkan antara akademisi, praktisi, dan pemerintah.",
  },
  {
    icon: 'Globe',
    title: "Dampak",
    description: "Setiap program dirancang untuk memberikan dampak nyata bagi peningkatan kualitas tata kelola Indonesia.",
  },
];

const defaultMilestones = [
  { year: "2015", event: "PT Mahaga Widya Cita berdiri dan mulai melayani instansi pemerintah pertama." },
  { year: "2017", event: "Meluncurkan program Smart Executive Education yang kini telah diikuti 3.000+ peserta." },
  { year: "2019", event: "Mengembangkan platform Smart Discussion Series (SDS) yang menghubungkan pakar & ASN." },
  { year: "2021", event: "Meluncurkan platform Smart Online Course dengan sertifikasi digital terintegrasi." },
  { year: "2023", event: "Bermitra dengan 200+ instansi pemerintah di seluruh Indonesia." },
  { year: "2026", event: "Meluncurkan platform digital terintegrasi generasi baru untuk profesional Indonesia." },
];

const stats = [
  { value: "11+", label: "Tahun Pengalaman", icon: Award },
  { value: "200+", label: "Instansi Mitra", icon: Building2 },
  { value: "10.000+", label: "Alumni Program", icon: Users },
  { value: "500+", label: "Sesi Webinar & Pelatihan", icon: BookOpen },
];

export default async function TentangKamiPage() {
  const payload = await getPayload({ config: configPromise });
  const { docs: ceoDocs } = await payload.find({
    collection: "team-members",
    where: {
      name: {
        contains: "Endang Larasati"
      }
    },
    limit: 1,
  });
  
  const ceo = ceoDocs[0] || {
    name: "Prof. Dr. Hj. Endang Larasati, M.S.",
    role: "Direktur Utama",
    initials: "EL",
    expertise: "Administrasi Publik & Tata Kelola",
  };

  const tentangKami = await payload.findGlobal({ slug: "tentang-kami" });
  
  const heroData = tentangKami?.hero?.title ? tentangKami.hero : {
    badge: 'Tentang Kami',
    title: 'Mitra Terpercaya untuk',
    titleHighlight: 'Tata Kelola & Edukasi',
    description: 'PT Mahaga Widya Cita hadir sebagai jembatan antara kebutuhan penguatan kapasitas SDM dengan solusi berbasis pengetahuan dan teknologi terkini di Indonesia.'
  };

  const valuesData = tentangKami?.values?.length ? tentangKami.values : defaultValues;
  const milestonesData = tentangKami?.milestones?.length ? tentangKami.milestones : defaultMilestones;
  const ceoQuote = tentangKami?.ceoMessage?.quote || "Kami percaya bahwa kualitas tata kelola suatu bangsa dimulai dari kualitas manusianya. Setiap program yang kami rancang adalah investasi jangka panjang bagi kemajuan Indonesia — sebuah misi yang kami emban dengan penuh dedikasi dan kebanggaan.";

  // Icon mapping
  const IconMap: Record<string, any> = {
    CheckCircle2, Award, Target, Eye, Users, Building2, Globe, BookOpen
  };

  return (
    <>
      <Navbar />

      {/* PAGE HERO */}
      <section
        style={{
          background: "linear-gradient(135deg, var(--color-primary-900) 0%, var(--color-primary-700) 100%)",
          paddingTop: "calc(72px + 4rem)",
          paddingBottom: "4rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(ellipse at 80% 50%, rgba(30,111,217,0.35) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div className="container" style={{ position: "relative" }}>
          <div style={{ maxWidth: "640px" }}>
            <span className="badge badge-primary" style={{ background: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.9)", marginBottom: "1rem" }}>
              {heroData.badge}
            </span>
            <h1 className="text-display" style={{ color: "white", marginBottom: "1.25rem" }}>
              {heroData.title}<br />
              <span style={{ color: "var(--color-gold-300)" }}>{heroData.titleHighlight}</span>
            </h1>
            <p style={{ fontSize: "1.125rem", color: "rgba(255,255,255,0.75)", lineHeight: "1.7" }}>
              {heroData.description}
            </p>
          </div>
        </div>
        <WaveDivider fill="white" />
      </section>

      {/* STATS BAR */}
      <section style={{ padding: "3rem 0" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
            {stats.map(({ value, label, icon: Icon }) => (
              <div key={label} className="card" style={{ padding: "1.75rem", textAlign: "center" }}>
                <Icon size={26} color="var(--color-primary-500)" style={{ margin: "0 auto 0.75rem" }} />
                <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: "800", fontSize: "2rem", color: "var(--color-primary-700)", lineHeight: 1 }}>
                  {value}
                </div>
                <div style={{ fontSize: "0.875rem", color: "var(--color-neutral-500)", marginTop: "0.375rem" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROFIL */}
      <section className="section section-alt">
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "center" }}>
            <div>
              <span className="badge badge-primary" style={{ marginBottom: "1rem" }}>Profil Perusahaan</span>
              <h2 className="text-heading-xl" style={{ marginBottom: "1.25rem" }}>
                Siapa PT Mahaga Widya Cita?
              </h2>
              <div className="gold-divider" style={{ margin: "0 0 1.5rem" }} />
              <p style={{ color: "var(--color-neutral-600)", lineHeight: "1.8", marginBottom: "1rem", fontSize: "1.0625rem" }}>
                PT Mahaga Widya Cita adalah perusahaan konsultasi dan edukasi yang berfokus pada penguatan kapasitas Sumber Daya Manusia (SDM) dan tata kelola di sektor pemerintahan dan swasta Indonesia.
              </p>
              <p style={{ color: "var(--color-neutral-600)", lineHeight: "1.8", marginBottom: "1.75rem", fontSize: "1.0625rem" }}>
                Didirikan pada tahun 2015, perusahaan kami telah berkembang menjadi ekosistem edukasi digital yang menghubungkan para pakar terbaik Indonesia dengan ribuan ASN dan profesional dari seluruh penjuru nusantara.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {[
                  "Berizin dan beroperasi resmi di Indonesia",
                  "Tim pakar dari akademisi dan praktisi berpengalaman",
                  "Program tersertifikasi yang diakui institusi pemerintah",
                  "Metode pembelajaran berbasis evidence & best practice",
                ].map((item) => (
                  <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                    <CheckCircle2 size={18} color="var(--color-success)" style={{ flexShrink: 0, marginTop: "2px" }} />
                    <span style={{ fontSize: "0.9375rem", color: "var(--color-neutral-700)" }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              {[
                { label: "Visi", color: "var(--color-primary-900)", text: "Menjadi platform digital terdepan yang menghubungkan kebutuhan penguatan kapasitas SDM dan tata kelola organisasi dengan solusi teknologi terkini di Indonesia." },
                { label: "Misi", color: "var(--color-gold-600)", text: "Menghadirkan program edukasi berkualitas tinggi, layanan konsultasi berbasis riset, dan solusi teknologi adaptif yang memberi dampak nyata bagi kemajuan bangsa." },
                { label: "Nilai", color: "var(--color-success)", text: "Integritas, Inovasi, Kolaborasi, dan Dampak. Empat pilar yang menjadi fondasi setiap langkah dan keputusan kami." },
                { label: "Komitmen", color: "#7C3AED", text: "Memberikan layanan terbaik dengan standar profesionalisme tertinggi kepada setiap mitra dan peserta program kami." },
              ].map(({ label, color, text }) => (
                <div key={label} className="card" style={{ padding: "1.5rem" }}>
                  <div style={{ width: "36px", height: "4px", background: color, borderRadius: "2px", marginBottom: "0.875rem" }} />
                  <h3 style={{ fontSize: "1rem", marginBottom: "0.625rem", color: "var(--color-neutral-900)" }}>{label}</h3>
                  <p style={{ fontSize: "0.8125rem", color: "var(--color-neutral-500)", lineHeight: "1.6" }}>{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="section">
        <div className="container">
          <div className="section-title">
            <span className="overline">Nilai Kami</span>
            <h2>Landasan yang Memandu Setiap Langkah Kami</h2>
            <div className="gold-divider" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem" }}>
            {valuesData.map((val: any) => {
              const Icon = IconMap[val.icon] || Target;
              return (
                <div key={val.title} className="card" style={{ padding: "2rem", textAlign: "center" }}>
                  <div style={{ width: "56px", height: "56px", background: "var(--color-primary-100)", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem" }}>
                    <Icon size={26} color="var(--color-primary-600)" />
                  </div>
                  <h3 style={{ fontSize: "1.125rem", marginBottom: "0.625rem" }}>{val.title}</h3>
                  <p style={{ fontSize: "0.875rem", color: "var(--color-neutral-500)", lineHeight: "1.6" }}>{val.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-title">
            <span className="overline">Perjalanan Kami</span>
            <h2>Milestone PT Mahaga Widya Cita</h2>
            <div className="gold-divider" />
          </div>
          <div style={{ position: "relative", maxWidth: "800px", margin: "0 auto" }}>
            {/* Center line */}
            <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: "2px", background: "var(--color-primary-200)", transform: "translateX(-50%)" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
              {milestonesData.map((m: any, i: number) => (
                <div key={m.year} style={{ display: "flex", gap: "2rem", alignItems: "center", flexDirection: i % 2 === 0 ? "row" : "row-reverse" }}>
                  <div style={{ flex: 1, textAlign: i % 2 === 0 ? "right" : "left" }}>
                    <div className="card" style={{ padding: "1.25rem 1.5rem", display: "inline-block", textAlign: i % 2 === 0 ? "right" : "left" }}>
                      <p style={{ fontSize: "0.9375rem", color: "var(--color-neutral-700)", lineHeight: "1.5" }}>{m.event}</p>
                    </div>
                  </div>
                  <div style={{ position: "relative", zIndex: 1, flexShrink: 0 }}>
                    <div style={{ width: "52px", height: "52px", background: "linear-gradient(135deg, var(--color-primary-500), var(--color-primary-800))", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 0 4px white, 0 0 0 6px var(--color-primary-200)" }}>
                      <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: "800", fontSize: "0.75rem", color: "white" }}>{m.year}</span>
                    </div>
                  </div>
                  <div style={{ flex: 1 }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CEO MESSAGE */}
      <section className="section" id="ceo">
        <div className="container">
          <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
            <span className="badge badge-primary" style={{ marginBottom: "1.5rem" }}>Pesan CEO</span>
            <div style={{ fontSize: "3rem", color: "var(--color-gold-400)", lineHeight: 1, marginBottom: "1.5rem" }}>&ldquo;</div>
            <blockquote style={{ fontSize: "1.25rem", color: "var(--color-neutral-700)", lineHeight: "1.8", fontStyle: "italic", marginBottom: "2rem" }}>
              {ceoQuote}
            </blockquote>
            
            <div style={{ maxWidth: "320px", margin: "0 auto", textAlign: "left" }}>
              <TeamMemberCard member={ceo} />
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </>
  );
}
