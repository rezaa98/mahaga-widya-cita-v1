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
  description: "Mengenal PT Mahaga Widya Cita — perusahaan konsultasi dan edukasi terdepan yang melayani ASN dan profesional Indonesia sejak 2015.",
};

const defaultStats = [
  { value: "7+", label: "Area Layanan Terintegrasi", icon: Map, bg: "bg-primary-container/10", text: "text-primary" },
  { value: "25+", label: "Tenaga Ahli Multidisiplin", icon: Users, bg: "bg-tertiary-container/10", text: "text-tertiary" },
  { value: "100+", label: "Proyek dan Studi", icon: CheckCircle2, bg: "bg-primary/10", text: "text-primary" },
  { value: "Nasional", label: "Cakupan Layanan", icon: Globe, bg: "bg-tertiary-container/10", text: "text-tertiary" },
  { value: "Banyak", label: "Klien Terpercaya", icon: Award, bg: "bg-primary-container/10", text: "text-primary" },
];

const defaultMisi = [
  { title: "Memberikan Solusi Strategis", text: "Solusi praktis, terukur, dan berkelanjutan bagi pemerintah, dunia usaha, dan berbagai institusi." },
  { title: "Mendorong Pengambilan Keputusan Berbasis Data", text: "Mendukung penyusunan kebijakan dan strategi bisnis melalui riset berkualitas, analisis data, serta kajian strategis yang komprehensif." },
  { title: "Mengembangkan Sumber Daya Manusia", text: "Meningkatkan kapasitas organisasi melalui pengembangan kompetensi, pelatihan profesional, konsultasi SDM, dan penyediaan tenaga profesional." }
];

const defaultCoreValues = [
  { letter: "F", name: "Foresight", desc: "Berpikir Jauh Ke Depan, Merancang Masa Depan Pembangunan.", icon: Eye },
  { letter: "U", name: "Unit", desc: "Mengutamakan Kerja Sama Lintas Sektor Dan Pemangku Kepentingan.", icon: Network },
  { letter: "T", name: "Transformation", desc: "Mendorong Perubahan Nyata Melalui Pemberdayaan Dan Pengembangan.", icon: Rocket },
  { letter: "U", name: "Understanding", desc: "Memahami Kebutuhan Masyarakat Dan Dinamika Daerah Secara Mendalam.", icon: Brain },
  { letter: "R", name: "Responsibility", desc: "Bertindak Dengan Tanggung Jawab Dan Komitmen Terhadap Hasil.", icon: Shield },
  { letter: "I", name: "Integrity", desc: "Menjaga Kejujuran, Etika, Dan Akuntabilitas Dalam Setiap Langkah.", icon: UserCheck },
  { letter: "S", name: "Sustainability", desc: "Berorientasi Pada Dampak Jangka Panjang Dan Berkelanjutan.", icon: Leaf },
  { letter: "T", name: "Technology", desc: "Memanfaatkan Teknologi Untuk Tata Kelola Dan Perencanaan Yang Lebih Baik.", icon: Cpu },
  { letter: "I", name: "Innovation", desc: "Terus Berinovasi Untuk Menjawab Tantangan Masa Kini Dan Mendatang.", icon: Lightbulb },
  { letter: "C", name: "Collaboration", desc: "Membangun Sinergi Dengan Masyarakat, Pemerintah, Dan Mitra Profesional.", icon: Handshake }
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
      where: { name: { contains: "Shella" } },
      limit: 1,
    });
    ceo = ceoDocs[0] || {
      name: "SHELLA H. VALSI, S.AP.,M.AP",
      role: "Direktur",
      imageUrl: "/media/dr_endang.jpg"
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
  const misiData = tentangKami?.misi?.length ? tentangKami.misi : defaultMisi;
  const ceoQuote = tentangKami?.ceoMessage?.quote || "Kami percaya bahwa kualitas tata kelola suatu bangsa dimulai dari kualitas manusianya. Setiap program yang kami rancang adalah investasi jangka panjang bagi kemajuan Indonesia — sebuah misi yang kami emban dengan penuh dedikasi dan kebanggaan.";

  return (
    <div className="bg-background text-on-background font-body-md text-body-md overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-16 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/70 to-transparent z-10"></div>
          <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: "url('/media/tentang_kami_hero_bg.png')" }}></div>
        </div>
        <div className="container mx-auto px-6 md:px-12 relative z-20">
          <div className="max-w-3xl">
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white font-label-md text-label-md mb-6 backdrop-blur-md uppercase tracking-widest">
              {heroData.badge}
            </span>
            <h1 className="font-headline-lg text-headline-lg lg:text-[64px] lg:leading-[1.1] text-white mb-6">
              {heroData.title} <span className="text-secondary-fixed">{heroData.titleHighlight}</span> {heroData.description.split('.')[0]}. <br />
              <span className="relative">
                  {heroData.description.split('.').slice(1).join('.').trim()}
                  <span className="absolute -bottom-2 left-0 w-32 h-1.5 bg-tertiary-container rounded-full"></span>
              </span>
            </h1>
            <p className="font-body-lg text-body-lg text-white/80 mb-10 max-w-xl leading-relaxed">
              {heroData.subtext}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/layanan/konsultasi" className="flex items-center justify-center gap-2 px-8 py-4 bg-primary-container text-white rounded-xl font-headline-md text-headline-md hover:shadow-xl hover:translate-y-[-2px] transition-all">
                  Konsultasi Sekarang
                  <ArrowRight size={20} />
              </Link>
              <Link href="/layanan" className="flex items-center justify-center gap-2 px-8 py-4 bg-white/10 border border-white/30 text-white backdrop-blur-md rounded-xl font-headline-md text-headline-md hover:bg-white/20 transition-all">
                  Pelajari Layanan
              </Link>
            </div>
          </div>
        </div>
        {/* Decorative Element */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
          <svg className="relative block w-full h-24" preserveAspectRatio="none" viewBox="0 0 1440 320">
            <path className="fill-background" d="M0,160L80,186.7C160,213,320,267,480,261.3C640,256,800,192,960,170.7C1120,149,1280,171,1360,181.3L1440,192L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 container mx-auto px-6 md:px-12 relative -mt-20 z-30">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {defaultStats.map((stat, idx) => {
            const isLast = idx === defaultStats.length - 1;
            const Icon = stat.icon;
            return (
              <div key={idx} className={`bg-surface p-8 rounded-2xl border border-outline-variant flex flex-col items-center text-center ${isLast ? 'md:col-span-3 lg:col-span-1' : ''}`}>
                <div className={`w-14 h-14 ${stat.bg} rounded-xl flex items-center justify-center mb-4 ${stat.text}`}>
                  <Icon size={28} />
                </div>
                <h3 className="font-headline-lg text-headline-lg text-primary mb-1">{stat.value}</h3>
                <p className="font-label-md text-label-md text-on-surface-variant uppercase">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Visi & Misi */}
      <section className="py-24 bg-surface-container-low overflow-hidden">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative mx-auto w-full max-w-md lg:max-w-[440px]">
              <div className="rounded-3xl overflow-hidden shadow-2xl relative z-10 aspect-[4/5] w-full">
                <Image src="/media/tentang_kami_visi_img.png" alt="Visi" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-8 left-8 right-8">
                  <h2 className="font-headline-lg text-headline-lg text-white mb-2">Visi Kami</h2>
                  <p className="text-white/90 font-body-lg">{visiData}</p>
                </div>
              </div>
              <div className="absolute -top-12 -right-12 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-tertiary-container/10 rounded-full blur-2xl"></div>
            </div>
            <div className="space-y-12">
              <div>
                <span className="font-label-md text-label-md text-primary font-bold uppercase tracking-widest block mb-4">Strategic Mission</span>
                <h2 className="font-headline-lg text-headline-lg text-on-surface mb-6">Misi Kami untuk Indonesia</h2>
                <p className="font-body-lg text-on-surface-variant leading-relaxed">
                  Kami berkomitmen untuk menjadi mitra strategis terpercaya yang mendukung pembangunan berkelanjutan serta mendorong keunggulan organisasi di seluruh Indonesia.
                </p>
              </div>
              <div className="grid gap-6">
                {misiData.slice(0, 3).map((misi: any, index: number) => (
                  <div key={index} className="flex gap-4 p-4 rounded-xl hover:bg-white transition-all border border-transparent hover:border-outline-variant group">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform">{index + 1}</div>
                    <div>
                      <h4 className="font-headline-md text-headline-md text-on-surface mb-1">{misi.title}</h4>
                      <p className="text-on-surface-variant">{misi.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values (F-U-T-U-R-I-S-T-I-C) */}
      <section className="py-24 container mx-auto px-6 md:px-12 overflow-hidden">
        <div className="text-center mb-16">
          <span className="font-label-md text-label-md text-primary font-bold uppercase tracking-widest">Our DNA</span>
          <h2 className="font-headline-lg text-headline-lg lg:text-5xl mt-4 text-primary tracking-[0.2em] font-black italic">FUTURISTIC</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {defaultCoreValues.map((cv, index) => {
            const staggerClasses = [
              "", "lg:mt-8", "", "lg:mt-8", "",
              "lg:-mt-4", "lg:mt-4", "lg:-mt-4", "lg:mt-4", "lg:-mt-4"
            ];
            const Icon = cv.icon;
            return (
              <div key={cv.letter + index} className={`group relative p-8 bg-surface rounded-2xl border border-outline-variant overflow-hidden ${staggerClasses[index]}`}>
                <div className="absolute -top-4 -right-4 text-8xl font-black text-primary/5 group-hover:text-primary/10 transition-colors select-none">{cv.letter}</div>
                <div className="relative z-10">
                  <div className="text-primary mb-4 block"><Icon size={28} /></div>
                  <h4 className="font-headline-md text-headline-md text-on-surface mb-2">{cv.name}</h4>
                  <p className="font-body-md text-on-surface-variant">{cv.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CEO Message */}
      <section className="py-24 bg-surface-container-low relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-tertiary-container to-primary"></div>
        <div className="container mx-auto px-6 md:px-12 max-w-5xl text-center">
          <span className="font-label-md text-label-md text-primary font-bold uppercase tracking-widest mb-8 block">Pesan Direktur</span>
          <div className="relative mb-12">
            <span className="absolute -top-16 -left-8 text-[120px] leading-none text-primary/10 select-none font-serif">&ldquo;</span>
            <p className="font-headline-lg text-headline-lg italic text-on-surface leading-relaxed relative z-10 px-8">
              "{ceoQuote}"
            </p>
            <span className="absolute -bottom-24 -right-8 text-[120px] leading-none text-primary/10 select-none font-serif">&rdquo;</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full border-4 border-white shadow-xl overflow-hidden mb-4 relative">
              <Image 
                className="object-cover" 
                src={ceo?.imageUrl || ceo?.photo?.url || "/media/dr_endang.jpg"}
                alt={ceo?.name} 
                fill
              />
            </div>
            <h4 className="font-headline-md text-headline-md text-on-surface">{ceo?.name?.toUpperCase()}</h4>
            <p className="font-label-md text-label-md text-primary font-bold uppercase tracking-widest">{ceo?.role}</p>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
