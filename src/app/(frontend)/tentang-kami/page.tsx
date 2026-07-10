import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { CheckCircle2, Award, Target, Eye, Users, Building2, Globe, BookOpen } from "lucide-react";
import { WaveDivider } from "@/components/ui/WaveDivider";
import TeamMemberCard from "@/components/ui/TeamMemberCard";
import { getPayload } from "payload";
import configPromise from "@payload-config";

export const dynamic = "force-dynamic";


export const metadata: Metadata = {
  title: "Tentang Kami",
  description:
    "Mengenal PT Mahaga Widya Cita — perusahaan konsultasi dan edukasi terdepan yang melayani ASN dan profesional Indonesia sejak 2015.",
};

const defaultValues = [
  {
    icon: 'CheckCircle2',
    title: "Integritas",
    description: "Menjunjung tinggi kejujuran, transparansi, etika, dan tanggung jawab dalam setiap penugasan.",
  },
  {
    icon: 'Users',
    title: "Kolaborasi",
    description: "Membangun kemitraan yang kuat untuk menghasilkan solusi terbaik.",
  },
  {
    icon: 'Award',
    title: "Keunggulan",
    description: "Berkomitmen memberikan layanan berkualitas tinggi dengan hasil yang terukur.",
  },
  {
    icon: 'Target',
    title: "Inovasi",
    description: "Terus mengembangkan ide, metode, dan teknologi untuk menciptakan solusi yang relevan.",
  },
  {
    icon: 'Building2',
    title: "Profesionalisme",
    description: "Melaksanakan setiap pekerjaan dengan kompetensi, disiplin, dan akuntabilitas.",
  },
  {
    icon: 'Globe',
    title: "Keberlanjutan",
    description: "Mengembangkan solusi yang memberikan manfaat jangka panjang bagi organisasi dan lingkungan.",
  },
  {
    icon: 'CheckCircle2',
    title: "Kepercayaan",
    description: "Membangun kepercayaan melalui layanan yang andal, profesional, dan berorientasi pada hasil.",
  }
];



const stats = [
  { value: "7+", label: "Area Layanan Terintegrasi", icon: Target },
  { value: "25+", label: "Tenaga Ahli Multidisiplin", icon: Users },
  { value: "100+", label: "Proyek dan Studi", icon: Award },
  { value: "Nasional", label: "Cakupan Layanan", icon: Globe },
  { value: "Banyak", label: "Dipercaya Pemerintah & Swasta", icon: Building2 },
];

const coreValuesList = [
  { letter: "F", name: "FORESIGHT", desc: "Berpikir jauh ke depan, merancang masa depan pembangunan." },
  { letter: "U", name: "UNIT", desc: "Mengutamakan kerja sama lintas sektor dan pemangku kepentingan." },
  { letter: "T", name: "TRANSFORMATION", desc: "Mendorong perubahan nyata melalui pemberdayaan dan pengembangan." },
  { letter: "U", name: "UNDERSTANDING", desc: "Memahami kebutuhan masyarakat dan dinamika daerah secara mendalam." },
  { letter: "R", name: "RESPONSIBILITY", desc: "Bertindak dengan tanggung jawab dan komitmen terhadap hasil." },
  { letter: "I", name: "INTEGRITY", desc: "Menjaga kejujuran, etika, dan akuntabilitas dalam setiap langkah." },
  { letter: "S", name: "SUSTAINABILITY", desc: "Berorientasi pada dampak jangka panjang dan berkelanjutan." },
  { letter: "T", name: "TECHNOLOGY", desc: "Memanfaatkan teknologi untuk tata kelola dan perencanaan yang lebih baik." },
  { letter: "I", name: "INNOVATION", desc: "Terus berinovasi untuk menjawab tantangan masa kini dan mendatang." },
  { letter: "C", name: "COLLABORATION", desc: "Membangun sinergi dengan masyarakat, pemerintah, dan mitra profesional." }
];

export default async function TentangKamiPage() {
  const payload = await getPayload({ config: configPromise });
  const tentangKami: any = await payload.findGlobal({ slug: "tentang-kami" });
  
  let ceo = tentangKami?.ceoMessage?.ceo;
  
  // If ceo is just an ID (number or string), fetch the full doc
  if (ceo && typeof ceo !== 'object') {
    ceo = await payload.findByID({
      collection: "team-members",
      id: ceo,
    });
  }

  // Fallback if not configured yet
  if (!ceo) {
    const { docs: ceoDocs } = await payload.find({
      collection: "team-members",
      where: {
        name: {
          contains: "Endang Larasati"
        }
      },
      limit: 1,
    });
    ceo = ceoDocs[0] || {
      name: "Prof. Dr. Hj. Endang Larasati, M.S.",
      role: "Direktur Utama",
      initials: "EL",
      expertise: "Administrasi Publik & Tata Kelola",
    };
  }
  
  const heroData = tentangKami?.hero?.title ? tentangKami.hero : {
    badge: 'TENTANG KAMI',
    title: 'Building Better Decisions.',
    titleHighlight: 'Creating Sustainable Impact.',
    description: 'Your One-Stop Consulting Partner'
  };

  const valuesData = tentangKami?.values?.length ? tentangKami.values : defaultValues;
  const statsData = tentangKami?.stats?.length ? tentangKami.stats : stats;
  const coreValuesData = tentangKami?.coreValues?.length ? tentangKami.coreValues : coreValuesList;
  const profilData = tentangKami?.profil?.paragraph1 ? tentangKami.profil : {
    paragraph1: "PT Mahaga Widya Cita merupakan perusahaan konsultan multidisiplin Indonesia yang berkomitmen menghadirkan solusi yang terintegrasi, inovatif, dan berkelanjutan bagi instansi pemerintah, BUMN, perusahaan swasta, institusi pendidikan, serta organisasi pembangunan.",
    paragraph2: "Kami menyediakan layanan konsultasi yang mencakup konsultasi pemerintahan, bisnis dan investasi, perpajakan, riset strategis, solusi penyediaan tenaga profesional (workforce solutions), konsultasi teknologi, serta pengembangan sumber daya manusia. Dengan menggabungkan keahlian multidisiplin, pendekatan berbasis data, dan pemanfaatan teknologi, kami membantu organisasi menghadapi tantangan yang kompleks, meningkatkan kinerja, serta menciptakan nilai yang berkelanjutan.",
    paragraph3: "Dilandasi integritas, profesionalisme, dan inovasi, PT Mahaga Widya Cita berkomitmen menjadi mitra strategis terpercaya yang mendukung pembangunan berkelanjutan serta mendorong keunggulan organisasi di seluruh Indonesia."
  };
  const visiData = tentangKami?.visi || "Menjadi perusahaan konsultan multidisiplin terdepan di Indonesia yang menghadirkan solusi inovatif, berbasis data, dan berkelanjutan untuk mendorong kemajuan organisasi serta berkontribusi terhadap pembangunan nasional.";
  const misiData = tentangKami?.misi?.length ? tentangKami.misi : [
    { title: "Memberikan Solusi Strategis", text: "Menyediakan layanan konsultasi terintegrasi yang menghasilkan solusi praktis, terukur, dan berkelanjutan bagi pemerintah, dunia usaha, dan berbagai institusi." },
    { title: "Mendorong Pengambilan Keputusan Berbasis Data", text: "Mendukung penyusunan kebijakan dan strategi bisnis melalui riset berkualitas, analisis data, serta kajian strategis yang komprehensif." },
    { title: "Mengembangkan Sumber Daya Manusia", text: "Meningkatkan kapasitas organisasi melalui pengembangan kompetensi, pelatihan profesional, konsultasi SDM, dan penyediaan tenaga profesional." },
    { title: "Mempercepat Transformasi Digital", text: "Mendorong peningkatan efisiensi, tata kelola, dan kualitas layanan melalui penerapan teknologi dan inovasi digital." },
    { title: "Membangun Kemitraan Jangka Panjang", text: "Menjalin hubungan kerja yang dilandasi integritas, profesionalisme, akuntabilitas, dan kolaborasi untuk menciptakan keberhasilan bersama." },
    { title: "Menciptakan Dampak Berkelanjutan", text: "Menghasilkan solusi yang memberikan manfaat ekonomi, sosial, dan lingkungan secara berkelanjutan bagi klien dan masyarakat." }
  ];

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
          background: heroData.backgroundImage?.url
            ? `linear-gradient(135deg, rgba(11, 45, 107, 0.9) 0%, rgba(18, 71, 168, 0.8) 100%), url(${heroData.backgroundImage.url}) center/cover no-repeat`
            : "linear-gradient(135deg, var(--color-primary-900) 0%, var(--color-primary-700) 100%)",
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
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "1rem" }}>
            {statsData.map(({ value, label, icon: iconName }: any) => {
              const Icon = IconMap[iconName] || Target;
              return (
                <div key={label} className="card" style={{ padding: "1.75rem", textAlign: "center" }}>
                  <Icon size={26} color="var(--color-primary-500)" style={{ margin: "0 auto 0.75rem" }} />
                  <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: "800", fontSize: "1.75rem", color: "var(--color-primary-700)", lineHeight: 1 }}>
                    {value}
                  </div>
                  <div style={{ fontSize: "0.875rem", color: "var(--color-neutral-500)", marginTop: "0.375rem" }}>{label}</div>
                </div>
              );
            })}
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
                {profilData.paragraph1}
              </p>
              <p style={{ color: "var(--color-neutral-600)", lineHeight: "1.8", marginBottom: "1rem", fontSize: "1.0625rem" }}>
                {profilData.paragraph2}
              </p>
              <p style={{ color: "var(--color-neutral-600)", lineHeight: "1.8", marginBottom: "1.75rem", fontSize: "1.0625rem" }}>
                {profilData.paragraph3}
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div className="card" style={{ padding: "1.5rem" }}>
                <div style={{ width: "36px", height: "4px", background: "var(--color-primary-900)", borderRadius: "2px", marginBottom: "0.875rem" }} />
                <h3 style={{ fontSize: "1.25rem", marginBottom: "0.625rem", color: "var(--color-neutral-900)" }}>Visi</h3>
                <p style={{ fontSize: "0.875rem", color: "var(--color-neutral-500)", lineHeight: "1.6" }}>
                  {visiData}
                </p>
              </div>

              <div className="card" style={{ padding: "1.5rem" }}>
                <div style={{ width: "36px", height: "4px", background: "var(--color-gold-600)", borderRadius: "2px", marginBottom: "0.875rem" }} />
                <h3 style={{ fontSize: "1.25rem", marginBottom: "1rem", color: "var(--color-neutral-900)" }}>Misi</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {misiData.map((misi: any, i: number) => (
                    <div key={i} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                      <div style={{ 
                        width: "24px", height: "24px", borderRadius: "50%", 
                        background: "var(--color-primary-100)", color: "var(--color-primary-700)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "0.75rem", fontWeight: "700", flexShrink: 0
                      }}>
                        {i + 1}
                      </div>
                      <div>
                        <div style={{ fontSize: "0.875rem", fontWeight: "600", color: "var(--color-neutral-800)", marginBottom: "0.25rem" }}>{misi.title}</div>
                        <div style={{ fontSize: "0.8125rem", color: "var(--color-neutral-500)", lineHeight: "1.5" }}>{misi.text}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
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
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "1.5rem" }}>
            {valuesData.map((val: any) => {
              const Icon = IconMap[val.icon] || Target;
              return (
                <div key={val.title} className="card" style={{ padding: "2rem", textAlign: "center", width: "100%", maxWidth: "280px", flexGrow: 1 }}>
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

      {/* CORE VALUE */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-title">
            <span className="overline">Core Value</span>
            <h2 style={{ fontSize: "2.5rem", letterSpacing: "0.1em", color: "var(--color-primary-900)" }}>FUTURISTIC</h2>
            <div className="gold-divider" />
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "1.5rem" }}>
            {coreValuesData.map((cv: any) => (
              <div key={cv.name} className="card" style={{ padding: "1.5rem", display: "flex", gap: "1.5rem", alignItems: "flex-start", background: "white", width: "100%", maxWidth: "450px", flexGrow: 1 }}>
                <div style={{ 
                  fontSize: "3rem", 
                  fontWeight: 900, 
                  color: "var(--color-primary-200)", 
                  lineHeight: 0.8, 
                  width: "50px", 
                  textAlign: "center",
                  WebkitTextStroke: "1px var(--color-primary-600)",
                  fontFamily: "'Plus Jakarta Sans', sans-serif"
                }}>
                  {cv.letter}
                </div>
                <div>
                  <h3 style={{ fontSize: "1.25rem", color: "var(--color-primary-900)", marginBottom: "0.5rem", letterSpacing: "0.05em", fontWeight: 800 }}>
                    {cv.name}
                  </h3>
                  <p style={{ color: "var(--color-neutral-600)", fontSize: "0.9375rem", lineHeight: "1.6", textTransform: "capitalize" }}>
                    {cv.desc.toLowerCase()}
                  </p>
                </div>
              </div>
            ))}
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
