import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowRight, Map, Users, CheckCircle2, Globe, Award, 
  Eye, Network, Rocket, Brain, Shield, UserCheck, 
  Leaf, Cpu, Lightbulb, Handshake, Quote 
} from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tentang Kami",
  description:
    "Mengenal PT Mahaga Widya Cita — perusahaan konsultasi dan edukasi terdepan yang melayani ASN dan profesional Indonesia sejak 2015.",
};

const stats = [
  { value: "7+", label: "Area Layanan Terintegrasi", icon: Map, color: "primary" },
  { value: "25+", label: "Tenaga Ahli Multidisiplin", icon: Users, color: "gold" },
  { value: "100+", label: "Proyek dan Studi", icon: CheckCircle2, color: "primary" },
  { value: "Nasional", label: "Cakupan Layanan", icon: Globe, color: "gold" },
  { value: "Banyak", label: "Klien Terpercaya", icon: Award, color: "primary" },
];

const coreValuesList = [
  { letter: "F", name: "FORESIGHT", desc: "Berpikir jauh ke depan, merancang masa depan pembangunan.", icon: Eye },
  { letter: "U", name: "UNIT", desc: "Mengutamakan kerja sama lintas sektor dan pemangku kepentingan.", icon: Network },
  { letter: "T", name: "TRANSFORMATION", desc: "Mendorong perubahan nyata melalui pemberdayaan dan pengembangan.", icon: Rocket },
  { letter: "U", name: "UNDERSTANDING", desc: "Memahami kebutuhan masyarakat dan dinamika daerah secara mendalam.", icon: Brain },
  { letter: "R", name: "RESPONSIBILITY", desc: "Bertindak dengan tanggung jawab dan komitmen terhadap hasil.", icon: Shield },
  { letter: "I", name: "INTEGRITY", desc: "Menjaga kejujuran, etika, dan akuntabilitas dalam setiap langkah.", icon: UserCheck },
  { letter: "S", name: "SUSTAINABILITY", desc: "Berorientasi pada dampak jangka panjang dan berkelanjutan.", icon: Leaf },
  { letter: "T", name: "TECHNOLOGY", desc: "Memanfaatkan teknologi untuk tata kelola dan perencanaan yang lebih baik.", icon: Cpu },
  { letter: "I", name: "INNOVATION", desc: "Terus berinovasi untuk menjawab tantangan masa kini dan mendatang.", icon: Lightbulb },
  { letter: "C", name: "COLLABORATION", desc: "Membangun sinergi dengan masyarakat, pemerintah, dan mitra profesional.", icon: Handshake }
];

export default async function TentangKamiPage() {
  const payload = await getPayload({ config: configPromise });
  const tentangKami: any = await payload.findGlobal({ slug: "tentang-kami" });
  
  let ceo = tentangKami?.ceoMessage?.ceo;
  if (ceo && typeof ceo !== 'object') {
    ceo = await payload.findByID({ collection: "team-members", id: ceo });
  }

  if (!ceo) {
    const { docs: ceoDocs } = await payload.find({
      collection: "team-members",
      where: { name: { contains: "Endang Larasati" } },
      limit: 1,
    });
    ceo = ceoDocs[0] || {
      name: "Prof. Dr. Hj. Endang Larasati, M.S.",
      role: "Direktur Utama",
      initials: "EL",
      expertise: "Administrasi Publik & Tata Kelola",
      imageUrl: "/media/dr_endang.jpg" // Fallback
    };
  }
  
  const heroData = tentangKami?.hero?.title ? tentangKami.hero : {
    badge: 'Your One-Stop Consulting Partner',
    title: 'Building',
    titleHighlight: 'Better',
    description: 'Decisions. Creating Sustainable Impact.',
    subtext: 'Kami menghadirkan solusi konsultasi multidisiplin terintegrasi untuk mendorong kemajuan organisasi serta berkontribusi bagi pembangunan nasional yang berkelanjutan.'
  };

  const visiData = tentangKami?.visi || "Menjadi perusahaan konsultan multidisiplin terdepan di Indonesia yang menghadirkan solusi inovatif, berbasis data, dan berkelanjutan.";
  
  const misiData = tentangKami?.misi?.length ? tentangKami.misi : [
    { title: "Memberikan Solusi Strategis", text: "Solusi praktis, terukur, dan berkelanjutan bagi pemerintah dan swasta." },
    { title: "Pengambilan Keputusan Berbasis Data", text: "Mendukung kebijakan dan strategi bisnis melalui riset berkualitas." },
    { title: "Mempercepat Transformasi Digital", text: "Mendorong peningkatan efisiensi melalui penerapan teknologi modern." }
  ];

  const ceoQuote = tentangKami?.ceoMessage?.quote || "Kami percaya bahwa kualitas tata kelola suatu bangsa bermula dari kualitas manusianya. Setiap program yang kami rancang adalah investasi jangka panjang bagi kemajuan Indonesia — sebuah misi yang kami emban dengan penuh dedikasi dan kebanggaan.";

  return (
    <div className="bg-white overflow-x-hidden">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center pt-16 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B2D6B]/95 via-[#0B2D6B]/70 to-transparent z-10"></div>
          <Image 
            src="/media/tentang_kami_hero_bg.png" 
            alt="Hero Background" 
            fill 
            className="object-cover object-center" 
            priority
          />
        </div>
        <div className="container mx-auto relative z-20" style={{ paddingInline: 'var(--container-padding)' }}>
          <div className="max-w-3xl">
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-[12px] font-semibold mb-6 backdrop-blur-md uppercase tracking-[0.1em]">
              {heroData.badge}
            </span>
            <h1 className="text-[2.5rem] md:text-[3.5rem] lg:text-[4rem] leading-[1.1] font-bold text-white mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
              {heroData.title} <span style={{ color: 'var(--color-gold-300)' }}>{heroData.titleHighlight}</span> {heroData.description.split('.')[0]}. <br />
              <span className="relative inline-block mt-2">
                {heroData.description.split('.').slice(1).join('.').trim()}
                <span className="absolute -bottom-2 left-0 w-32 h-1.5 rounded-full" style={{ background: 'var(--color-gold-500)' }}></span>
              </span>
            </h1>
            <p className="text-lg text-white/80 mb-10 max-w-xl leading-relaxed">
              {heroData.subtext}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/layanan/konsultasi" className="flex items-center justify-center gap-2 px-8 py-4 text-white rounded-xl font-semibold hover:shadow-xl hover:translate-y-[-2px] transition-all" style={{ background: 'var(--color-primary-500)' }}>
                Konsultasi Sekarang
                <ArrowRight size={20} />
              </Link>
              <Link href="/layanan" className="flex items-center justify-center gap-2 px-8 py-4 bg-white/10 border border-white/30 text-white backdrop-blur-md rounded-xl font-semibold hover:bg-white/20 transition-all">
                Pelajari Layanan
              </Link>
            </div>
          </div>
        </div>
        
        {/* Decorative Wave */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
          <svg className="relative block w-full h-24" preserveAspectRatio="none" viewBox="0 0 1440 320">
            <path fill="#ffffff" d="M0,160L80,186.7C160,213,320,267,480,261.3C640,256,800,192,960,170.7C1120,149,1280,171,1360,181.3L1440,192L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
          </svg>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="py-12 md:py-20 container mx-auto relative -mt-16 md:-mt-20 z-30" style={{ paddingInline: 'var(--container-padding)' }}>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {stats.map((stat: any, index: number) => {
            const isLast = index === stats.length - 1;
            const bgLight = stat.color === 'primary' ? 'var(--color-primary-100)' : 'var(--color-gold-100)';
            const fgColor = stat.color === 'primary' ? 'var(--color-primary-600)' : 'var(--color-gold-600)';
            
            return (
              <div key={index} className={`bg-white p-6 md:p-8 rounded-[1rem] border shadow-sm flex flex-col items-center text-center hover:-translate-y-1 transition-transform ${isLast ? 'col-span-2 md:col-span-3 lg:col-span-1' : ''}`} style={{ borderColor: 'var(--color-neutral-200)' }}>
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: bgLight }}>
                  <stat.icon size={28} color={fgColor} />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: 'var(--color-primary-900)', fontFamily: 'var(--font-heading)' }}>{stat.value}</h3>
                <p className="text-[11px] md:text-xs font-semibold uppercase tracking-wider text-center" style={{ color: 'var(--color-neutral-500)' }}>{stat.label}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* VISI & MISI SECTION */}
      <section className="py-16 md:py-24 overflow-hidden" style={{ backgroundColor: 'var(--color-neutral-50)' }}>
        <div className="container mx-auto" style={{ paddingInline: 'var(--container-padding)' }}>
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Left: Image Visi */}
            <div className="relative order-2 lg:order-1 mt-8 lg:mt-0">
              <div className="rounded-[2rem] overflow-hidden shadow-2xl relative z-10 w-full aspect-[4/5]">
                <Image 
                  src="/media/tentang_kami_visi_img.png" 
                  alt="Sustainable City Vision" 
                  fill 
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <div className="absolute bottom-8 left-8 right-8">
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Visi Kami</h2>
                  <p className="text-white/90 text-[15px] md:text-base leading-relaxed">{visiData}</p>
                </div>
              </div>
              <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full blur-3xl opacity-50" style={{ background: 'var(--color-primary-200)' }}></div>
              <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full blur-2xl opacity-50" style={{ background: 'var(--color-gold-200)' }}></div>
            </div>

            {/* Right: Misi */}
            <div className="space-y-10 order-1 lg:order-2">
              <div>
                <span className="text-[12px] font-bold uppercase tracking-[0.15em] block mb-4" style={{ color: 'var(--color-primary-600)' }}>Strategic Mission</span>
                <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: 'var(--color-neutral-900)', fontFamily: 'var(--font-heading)' }}>Misi Kami untuk Indonesia</h2>
                <p className="text-[15px] md:text-base leading-relaxed" style={{ color: 'var(--color-neutral-600)' }}>
                  Kami berkomitmen untuk menjadi mitra strategis terpercaya yang mendukung pembangunan berkelanjutan serta mendorong keunggulan organisasi di seluruh Indonesia.
                </p>
              </div>

              <div className="grid gap-4 md:gap-6">
                {misiData.slice(0,3).map((misi: any, index: number) => (
                  <div key={index} className="flex gap-4 p-4 md:p-5 rounded-2xl bg-white transition-all border shadow-sm group hover:shadow-md" style={{ borderColor: 'var(--color-neutral-200)' }}>
                    <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform" style={{ background: 'var(--color-primary-500)' }}>
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="text-base md:text-lg font-semibold mb-1" style={{ color: 'var(--color-neutral-900)' }}>{misi.title}</h4>
                      <p className="text-[14px] md:text-[15px] leading-relaxed" style={{ color: 'var(--color-neutral-500)' }}>{misi.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CORE VALUES SECTION */}
      <section className="py-16 md:py-24 container mx-auto overflow-hidden" style={{ paddingInline: 'var(--container-padding)' }}>
        <div className="text-center mb-12 md:mb-16">
          <span className="text-[12px] font-bold uppercase tracking-[0.15em]" style={{ color: 'var(--color-primary-600)' }}>Our DNA</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl mt-4 tracking-[0.2em] font-black italic" style={{ color: 'var(--color-primary-900)', fontFamily: 'var(--font-heading)' }}>
            FUTURISTIC
          </h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {coreValuesList.map((cv: any, index: number) => {
            const isEvenRow = Math.floor(index / 5) % 2 !== 0;
            const staggerMt = (index % 5) % 2 !== 0 ? 'lg:mt-8' : 'lg:-mt-4';
            const Icon = cv.icon;

            return (
              <div key={cv.letter + index} className={`group relative p-6 md:p-8 bg-white rounded-2xl border overflow-hidden hover:shadow-md transition-all ${staggerMt}`} style={{ borderColor: 'var(--color-neutral-200)' }}>
                <div className="absolute -top-4 -right-2 text-8xl font-black transition-colors select-none" style={{ color: 'var(--color-primary-900)', opacity: 0.03 }}>
                  {cv.letter}
                </div>
                <div className="relative z-10">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-5" style={{ background: 'var(--color-primary-50)' }}>
                    <Icon size={22} style={{ color: 'var(--color-primary-600)' }} />
                  </div>
                  <h4 className="text-lg font-bold mb-2" style={{ color: 'var(--color-neutral-900)' }}>{cv.name}</h4>
                  <p className="text-[13px] leading-relaxed capitalize" style={{ color: 'var(--color-neutral-500)' }}>
                    {cv.desc.toLowerCase()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CEO MESSAGE SECTION */}
      <section className="py-20 md:py-24 relative overflow-hidden" style={{ backgroundColor: 'var(--color-neutral-50)' }}>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#1E6FD9] via-[#DDB134] to-[#1E6FD9]"></div>
        <div className="container mx-auto max-w-4xl text-center" style={{ paddingInline: 'var(--container-padding)' }}>
          
          <span className="text-[12px] font-bold uppercase tracking-[0.15em] mb-8 block" style={{ color: 'var(--color-primary-600)' }}>Pesan Direktur</span>
          
          <div className="relative mb-12 px-6 md:px-12">
            <Quote size={80} className="absolute -top-10 left-0 opacity-10 rotate-180" style={{ color: 'var(--color-primary-900)' }} />
            <p className="text-xl md:text-2xl italic leading-relaxed relative z-10 font-medium" style={{ color: 'var(--color-neutral-800)', fontFamily: 'var(--font-heading)' }}>
              &ldquo;{ceoQuote}&rdquo;
            </p>
            <Quote size={80} className="absolute -bottom-10 right-0 opacity-10" style={{ color: 'var(--color-primary-900)' }} />
          </div>
          
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 shadow-lg overflow-hidden mb-4 relative" style={{ borderColor: 'white' }}>
              <Image 
                src={ceo?.imageUrl || ceo?.photo?.url || "/media/dr_endang.jpg"} 
                alt={ceo?.name} 
                fill
                className="object-cover"
              />
            </div>
            <h4 className="text-lg md:text-xl font-bold" style={{ color: 'var(--color-neutral-900)' }}>{ceo?.name?.toUpperCase()}</h4>
            <p className="text-[11px] font-bold uppercase tracking-widest mt-1" style={{ color: 'var(--color-primary-600)' }}>{ceo?.role}</p>
          </div>

        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
