import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextResponse } from 'next/server'

const servicesData = [
  {
    slug: "konsultasi",
    title: "Smart Consulting",
    tagline: "Solusi Strategis untuk Tata Kelola Pemerintahan Berkelas Dunia",
    description: "Layanan konsultasi manajemen strategis yang dirancang untuk membantu instansi pemerintah dan swasta dalam merancang, mengimplementasikan, dan mengevaluasi sistem tata kelola yang efektif dan akuntabel.",
    color: "var(--color-primary-600)",
    gradient: "linear-gradient(135deg, #1E6FD9, #0B2D6B)",
    features: [
      { feature: "Analisis kebutuhan tata kelola mendalam" },
      { feature: "Penyusunan SOP dan prosedur kerja" },
      { feature: "Evaluasi kinerja berbasis SAKIP/LAKIP" },
      { feature: "Pendampingan reformasi birokrasi" },
      { feature: "Review regulasi dan kebijakan" },
      { feature: "Perencanaan strategis jangka menengah" }
    ],
    benefits: [
      { title: "Berbasis Riset", desc: "Setiap rekomendasi didasarkan pada kajian akademis dan best practice internasional." },
      { title: "Tim Pakar", desc: "Didukung para akademisi dan praktisi berpengalaman di bidang administrasi publik." },
      { title: "Hasil Terukur", desc: "Progres dan dampak konsultasi dapat diukur dengan KPI yang disepakati bersama." },
      { title: "Pendampingan Penuh", desc: "Kami hadir dari perencanaan hingga evaluasi, memastikan implementasi berjalan optimal." },
    ],
    targetAudience: [
      { audience: "Kementerian dan Lembaga Pemerintah Pusat" },
      { audience: "Pemerintah Daerah (Provinsi, Kabupaten, Kota)" },
      { audience: "BUMN dan BUMD" },
      { audience: "Perusahaan swasta yang membutuhkan penguatan tata kelola" }
    ],
  },
  {
    slug: "edukasi",
    title: "Smart Executive Education",
    tagline: "Program Pelatihan Eksklusif untuk Pemimpin yang Berdampak",
    description: "Program pendidikan eksekutif dirancang khusus untuk pimpinan dan calon pimpinan instansi dengan pendekatan pembelajaran aktif, studi kasus nyata, dan fasilitasi dari pakar terbaik.",
    color: "var(--color-gold-600)",
    gradient: "linear-gradient(135deg, #C9970A, #A07508)",
    features: [
      { feature: "Pelatihan kepemimpinan transformasional" },
      { feature: "Manajemen perubahan dan inovasi" },
      { feature: "Pengelolaan keuangan publik" },
      { feature: "Komunikasi publik & public speaking" },
      { feature: "Workshop capacity building" },
      { feature: "Benchmarking ke instansi unggulan" }
    ],
    benefits: [
      { title: "Metode Interaktif", desc: "Pembelajaran berbasis diskusi, simulasi, dan studi kasus nyata dari berbagai instansi." },
      { title: "Fasilitator Pakar", desc: "Dipandu oleh Guru Besar dan praktisi senior dengan rekam jejak terbukti." },
      { title: "Jaringan Profesional", desc: "Bergabung dengan komunitas eksklusif pimpinan instansi dari seluruh Indonesia." },
      { title: "Sertifikasi Resmi", desc: "Dapatkan sertifikat resmi yang diakui oleh instansi pemerintah terkait." },
    ],
    targetAudience: [
      { audience: "Pejabat Eselon I, II, dan III" },
      { audience: "Kepala Dinas dan OPD" },
      { audience: "Direktur dan Komisaris BUMN/BUMD" },
      { audience: "Eksekutif perusahaan swasta" }
    ],
  },
  {
    slug: "software",
    title: "Smart Software Service",
    tagline: "Teknologi Adaptif untuk Transformasi Digital Instansi Anda",
    description: "Pengembangan sistem informasi manajemen, aplikasi, dan infrastruktur digital yang dirancang sesuai kebutuhan spesifik instansi, mengikuti standar keamanan dan interoperabilitas pemerintah.",
    color: "#7C3AED",
    gradient: "linear-gradient(135deg, #7C3AED, #5B21B6)",
    features: [
      { feature: "Pengembangan Sistem Informasi Manajemen (SIM)" },
      { feature: "Aplikasi monitoring dan evaluasi kinerja" },
      { feature: "Dashboard pelaporan berbasis data real-time" },
      { feature: "Integrasi dengan sistem SPBE pemerintah" },
      { feature: "Audit teknologi dan keamanan siber" },
      { feature: "Pelatihan penggunaan sistem" }
    ],
    benefits: [
      { title: "Standar SPBE", desc: "Mengikuti Sistem Pemerintahan Berbasis Elektronik (SPBE) sesuai regulasi nasional." },
      { title: "Keamanan Terjamin", desc: "Sistem dibangun dengan standar keamanan data sesuai peraturan yang berlaku." },
      { title: "Skalabel", desc: "Arsitektur yang dapat berkembang seiring dengan kebutuhan instansi." },
      { title: "Dukungan Purna Jual", desc: "Garansi dan dukungan teknis selama minimal 1 tahun setelah serah terima." },
    ],
    targetAudience: [
      { audience: "Instansi yang memerlukan digitalisasi layanan publik" },
      { audience: "Dinas yang membutuhkan sistem monitoring kinerja" },
      { audience: "BUMN yang ingin mengoptimalkan proses bisnis" },
      { audience: "Pemda yang ingin meningkatkan skor SPBE" }
    ],
  },
  {
    slug: "governance-review",
    title: "Smart Governance Review",
    tagline: "Review Mendalam untuk Tata Kelola yang Transparan dan Akuntabel",
    description: "Layanan review komprehensif atas sistem tata kelola, kepatuhan regulasi, dan pengelolaan risiko instansi. Menghasilkan rekomendasi berbasis bukti untuk perbaikan berkelanjutan.",
    color: "var(--color-success)",
    gradient: "linear-gradient(135deg, #059669, #047857)",
    features: [
      { feature: "Review sistem pengendalian internal (SPIP)" },
      { feature: "Evaluasi kepatuhan regulasi dan kebijakan" },
      { feature: "Penilaian maturitas tata kelola" },
      { feature: "Analisis risiko dan manajemen risiko" },
      { feature: "Review LAKIP/LKJIP" },
      { feature: "Penilaian indeks inovasi pelayanan publik" }
    ],
    benefits: [
      { title: "Independen & Objektif", desc: "Review dilakukan secara independen dengan metodologi ilmiah yang terstandar." },
      { title: "Rekomendasi Aplikatif", desc: "Setiap temuan disertai rekomendasi konkret yang dapat langsung diterapkan." },
      { title: "Laporan Profesional", desc: "Laporan lengkap, terstruktur, dan siap dipresentasikan kepada pimpinan atau auditor." },
      { title: "Tindak Lanjut", desc: "Pendampingan implementasi rekomendasi perbaikan selama periode yang disepakati." },
    ],
    targetAudience: [
      { audience: "Instansi yang hendak meningkatkan nilai SAKIP" },
      { audience: "Pemerintah daerah dalam persiapan evaluasi Kemenpan-RB" },
      { audience: "BUMN yang mempersiapkan audit eksternal" },
      { audience: "Organisasi yang menghadapi perubahan regulasi" }
    ],
  },
  {
    slug: "online-course",
    title: "Smart Online Course",
    tagline: "Belajar Kapan Saja, Di Mana Saja, dengan Sertifikasi Resmi",
    description: "Platform kursus online interaktif dengan ratusan modul materi edukasi yang relevan bagi ASN dan profesional. Dilengkapi kuis, progres tracking, dan penerbitan sertifikat digital otomatis.",
    color: "var(--color-danger)",
    gradient: "linear-gradient(135deg, #DC2626, #B91C1C)",
    features: [
      { feature: "200+ modul kursus terstruktur" },
      { feature: "Video pembelajaran berkualitas HD" },
      { feature: "Kuis interaktif dan evaluasi mandiri" },
      { feature: "Sertifikat digital dengan QR verifikasi" },
      { feature: "Akses seumur hidup setelah daftar" },
      { feature: "Forum diskusi peserta & instruktur" }
    ],
    benefits: [
      { title: "Fleksibel", desc: "Belajar sesuai jadwal Anda, akses dari perangkat apa pun, kapan pun." },
      { title: "Kurikulum Relevan", desc: "Materi dirancang bersama praktisi dan akademisi yang memahami kebutuhan lapangan." },
      { title: "Sertifikat Digital", desc: "Sertifikat resmi dilengkapi QR Code yang dapat diverifikasi secara publik." },
      { title: "Terjangkau", desc: "Tersedia kursus gratis dan berbayar dengan harga yang sangat terjangkau." },
    ],
    targetAudience: [
      { audience: "ASN yang ingin meningkatkan kompetensi individu" },
      { audience: "Profesional swasta yang butuh pengembangan karir" },
      { audience: "Mahasiswa yang ingin memahami tata kelola pemerintahan" },
      { audience: "Tim instansi yang perlu pelatihan kolektif" }
    ],
  },
  {
    slug: "digital-conference",
    title: "Smart Digital Conference",
    tagline: "Forum Diskusi Berkualitas Tinggi, Menjangkau Ribuan Peserta",
    description: "Penyelenggaraan konferensi, seminar, dan forum diskusi digital profesional yang menghubungkan para pakar, pemangku kebijakan, dan praktisi dalam satu platform yang interaktif.",
    color: "#0891B2",
    gradient: "linear-gradient(135deg, #0891B2, #0E7490)",
    features: [
      { feature: "Penyelenggaraan webinar & hybrid event" },
      { feature: "Produksi visual & materi presentasi profesional" },
      { feature: "Live streaming multi-platform (Zoom, YouTube, Instagram)" },
      { feature: "Moderasi profesional oleh MC berpengalaman" },
      { feature: "Distribusi sertifikat peserta massal" },
      { feature: "Rekaman dan dokumentasi acara" }
    ],
    benefits: [
      { title: "Jangkauan Luas", desc: "Tidak terbatas ruang fisik, dapat diikuti oleh ribuan peserta dari seluruh dunia." },
      { title: "Efisien", desc: "Menghemat biaya akomodasi dan logistik dibandingkan acara tatap muka." },
      { title: "Interaktif", desc: "Fitur tanya jawab langsung, polling, dan ruang diskusi kelompok." },
      { title: "Laporan Lengkap", desc: "Analitik peserta, tingkat partisipasi, dan umpan balik acara secara otomatis." },
    ],
    targetAudience: [
      { audience: "Kementerian yang akan mensosialisasikan kebijakan baru" },
      { audience: "Organisasi profesi yang mengadakan pertemuan tahunan" },
      { audience: "Universitas yang menggelar seminar internasional" },
      { audience: "Perusahaan yang merilis produk atau laporan publik" }
    ],
  }
];

export async function GET() {
  try {
    const payload = await getPayload({ config: configPromise })

    for (const data of servicesData) {
      await payload.create({
        collection: 'services',
        data,
      });
    }

    return NextResponse.json({ message: 'Services successfully seeded!' })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to seed services' }, { status: 500 })
  }
}
