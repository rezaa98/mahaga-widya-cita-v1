type LocaleContent = {
  title: string;
  tagline: string;
  description: string;
  features: { feature: string; description: string }[];
  benefits: { title: string; desc: string }[];
  targetAudience: { audience: string }[];
};

export type OfficialService = {
  slug: string;
  previousSlug?: string;
  sortOrder: number;
  color: string;
  gradient: string;
  id: LocaleContent;
  en: LocaleContent;
};

const sharedTheme = {
  color: "var(--color-primary-600)",
  gradient: "linear-gradient(135deg, #1E6FD9, #0B2D6B)",
};

export const officialServiceContent: OfficialService[] = [
  {
    ...sharedTheme,
    slug: "research-strategic-studies",
    sortOrder: 1,
    id: {
      title: "Kajian Strategis",
      tagline:
        "Mengubah data dan kompleksitas menjadi insight strategis untuk keputusan yang lebih tepat dan berdampak.",
      description:
        "Kami menghasilkan kajian berbasis bukti yang membantu organisasi menyusun kebijakan, perencanaan, dan keputusan yang lebih tepat, terukur, dan berdampak.",
      features: [
        {
          feature: "Regional Development Studies",
          description:
            "Kajian potensi dan permasalahan daerah yang menghasilkan strategi pembangunan, peta potensi, serta rekomendasi pengembangan daerah.",
        },
        {
          feature: "Strategic & Sectoral Studies",
          description:
            "Kajian isu dan potensi sektoral untuk menghasilkan arah pengembangan, analisis strategis, dan rekomendasi kebijakan sektoral.",
        },
        {
          feature: "Strategic Document Development",
          description:
            "Pengembangan dokumen perencanaan, kebijakan, dan kinerja daerah, termasuk RPJMD, RKPD, RIPPARDA, SAKIP, dan dokumen strategis lainnya.",
        },
        {
          feature: "Feasibility & Investment Studies",
          description:
            "Penilaian kelayakan proyek dan peluang investasi melalui feasibility study, investment analysis, business model, dan strategi pengembangan.",
        },
        {
          feature: "Research, Survey & Data Analytics",
          description:
            "Pelaksanaan riset dan survei yang menghasilkan data, analisis, laporan penelitian, dan strategic insights untuk mendukung keputusan.",
        },
      ],
      benefits: [
        {
          title: "Keputusan berbasis bukti",
          desc: "Data dan temuan diterjemahkan menjadi insight yang relevan bagi pengambil keputusan.",
        },
        {
          title: "Arah strategis yang jelas",
          desc: "Rekomendasi dirumuskan menjadi prioritas dan langkah implementasi yang terukur.",
        },
        {
          title: "Dokumen yang dapat digunakan",
          desc: "Setiap keluaran disusun sesuai konteks, kebutuhan kebijakan, dan standar yang berlaku.",
        },
      ],
      targetAudience: [
        { audience: "Pemerintah daerah dan kementerian" },
        { audience: "BUMN dan BUMD" },
        { audience: "Perusahaan dan investor" },
        { audience: "Institusi pendidikan dan riset" },
      ],
    },
    en: {
      title: "Strategic Studies",
      tagline: "Turning data and complexity into strategic insights for more precise and impactful decisions.",
      description:
        "We deliver evidence-based studies that help organizations formulate policies, plans, and decisions that are more precise, measurable, and impactful.",
      features: [
        {
          feature: "Regional Development Studies",
          description:
            "Assess regional potential and challenges to produce development strategies, opportunity maps, and actionable recommendations.",
        },
        {
          feature: "Strategic & Sectoral Studies",
          description:
            "Examine sector-specific issues and opportunities to define development directions, strategic analysis, and policy recommendations.",
        },
        {
          feature: "Strategic Document Development",
          description:
            "Develop planning, policy, and performance documents, including regional plans, tourism master plans, performance systems, and other strategic documents.",
        },
        {
          feature: "Feasibility & Investment Studies",
          description:
            "Evaluate project viability and investment opportunities through feasibility studies, investment analysis, business models, and development strategies.",
        },
        {
          feature: "Research, Survey & Data Analytics",
          description:
            "Conduct research and surveys that produce reliable data, analysis, research reports, and strategic insights for decision-making.",
        },
      ],
      benefits: [
        {
          title: "Evidence-based decisions",
          desc: "Data and findings are translated into relevant insights for decision-makers.",
        },
        {
          title: "Clear strategic direction",
          desc: "Recommendations are converted into priorities and measurable implementation steps.",
        },
        {
          title: "Decision-ready deliverables",
          desc: "Every output is tailored to its context, policy needs, and applicable standards.",
        },
      ],
      targetAudience: [
        { audience: "Government institutions" },
        { audience: "State-owned and regional enterprises" },
        { audience: "Companies and investors" },
        { audience: "Education and research institutions" },
      ],
    },
  },
  {
    ...sharedTheme,
    slug: "technology-digital-solutions",
    sortOrder: 2,
    id: {
      title: "Transformasi Digital",
      tagline: "Menghadirkan solusi digital inovatif untuk membangun dan memperkuat ekosistem bisnis.",
      description:
        "Kami merancang website, aplikasi, sistem, dan otomasi yang menghubungkan proses, data, serta pengalaman pengguna menjadi ekosistem digital yang terintegrasi.",
      features: [
        {
          feature: "Website & Digital Presence",
          description:
            "Pengembangan website perusahaan, institusi, destinasi, landing page, dan platform digital yang responsif serta mudah dikelola.",
        },
        {
          feature: "Application Development",
          description:
            "Pengembangan aplikasi web, mobile, portal, booking, dan sistem layanan sesuai alur kerja organisasi.",
        },
        {
          feature: "Business Management Systems",
          description: "Pengembangan sistem informasi, dashboard, CRM, HR, inventori, aset, dan manajemen bisnis.",
        },
        {
          feature: "Digital Platform & Ecosystem",
          description:
            "Pengembangan marketplace, platform layanan, tourism platform, dan ekosistem digital yang terhubung.",
        },
        {
          feature: "Digitalization & Automation",
          description: "Digitalisasi proses, otomasi workflow, monitoring, pelaporan, dan pengelolaan data.",
        },
      ],
      benefits: [
        {
          title: "Proses lebih efisien",
          desc: "Aktivitas manual disederhanakan melalui alur digital dan otomasi yang tepat guna.",
        },
        {
          title: "Sistem lebih terintegrasi",
          desc: "Aplikasi dan data terhubung untuk mengurangi duplikasi serta hambatan informasi.",
        },
        {
          title: "Keputusan lebih cepat",
          desc: "Dashboard dan analitik menyajikan informasi yang siap digunakan oleh pengambil keputusan.",
        },
        { title: "Teknologi yang skalabel", desc: "Solusi dibangun agar dapat berkembang mengikuti kebutuhan bisnis." },
      ],
      targetAudience: [
        { audience: "Perusahaan dan grup usaha" },
        { audience: "Instansi pemerintah" },
        { audience: "BUMN dan BUMD" },
        { audience: "Institusi pendidikan" },
        { audience: "Organisasi dan lembaga nirlaba" },
      ],
    },
    en: {
      title: "Digital Transformation",
      tagline: "Delivering innovative digital solutions to build and strengthen business ecosystems.",
      description:
        "We design websites, applications, systems, and automation that connect processes, data, and user experiences into an integrated digital ecosystem.",
      features: [
        {
          feature: "Website & Digital Presence",
          description:
            "Develop responsive, manageable corporate, institutional, destination, and campaign websites and digital platforms.",
        },
        {
          feature: "Application Development",
          description:
            "Build web and mobile applications, portals, booking platforms, and service systems around organizational workflows.",
        },
        {
          feature: "Business Management Systems",
          description:
            "Develop information systems, dashboards, CRM, HR, inventory, asset, and business management solutions.",
        },
        {
          feature: "Digital Platform & Ecosystem",
          description: "Create marketplaces, service platforms, tourism platforms, and connected digital ecosystems.",
        },
        {
          feature: "Digitalization & Automation",
          description: "Digitize processes and automate workflows, monitoring, reporting, and data management.",
        },
      ],
      benefits: [
        {
          title: "More efficient processes",
          desc: "Manual activities are streamlined through purposeful digital workflows and automation.",
        },
        {
          title: "Connected systems",
          desc: "Applications and data are integrated to reduce duplication and information barriers.",
        },
        { title: "Faster decisions", desc: "Dashboards and analytics provide decision-ready information." },
        { title: "Scalable technology", desc: "Solutions are designed to evolve with changing business needs." },
      ],
      targetAudience: [
        { audience: "Companies and business groups" },
        { audience: "Government institutions" },
        { audience: "State-owned and regional enterprises" },
        { audience: "Educational institutions" },
        { audience: "Organizations and nonprofit institutions" },
      ],
    },
  },
  {
    ...sharedTheme,
    slug: "tax-financial-advisory",
    sortOrder: 3,
    id: {
      title: "Konsultasi Keuangan & Pajak",
      tagline:
        "Mengoptimalkan pengelolaan keuangan dan perpajakan untuk bisnis yang efisien, patuh, dan berkelanjutan.",
      description:
        "Kami membantu organisasi membangun tata kelola keuangan dan perpajakan yang sehat melalui perencanaan, pelaporan, kepatuhan, serta analisis yang dapat ditindaklanjuti.",
      features: [
        {
          feature: "Financial Advisory",
          description:
            "Konsultasi pengelolaan keuangan untuk menghasilkan perencanaan keuangan, analisis kinerja, dan strategi pengelolaan keuangan bisnis.",
        },
        {
          feature: "Tax Advisory",
          description:
            "Konsultasi untuk memastikan kepatuhan, optimalisasi kewajiban pajak, dan strategi perpajakan yang tepat.",
        },
        {
          feature: "Accounting & Financial Reporting",
          description: "Pengelolaan pembukuan, penyusunan laporan, dan analisis keuangan sesuai kebutuhan bisnis.",
        },
        {
          feature: "Tax Compliance",
          description: "Pendampingan perhitungan, pelaporan, dokumentasi, dan administrasi kewajiban perpajakan.",
        },
        {
          feature: "Financial Planning & Analysis",
          description:
            "Penyusunan proyeksi, anggaran, analisis arus kas, dan rekomendasi strategis berdasarkan kondisi keuangan.",
        },
      ],
      benefits: [
        {
          title: "Kepatuhan yang lebih terjaga",
          desc: "Kewajiban keuangan dan pajak dikelola secara tertib serta terdokumentasi.",
        },
        { title: "Visibilitas keuangan", desc: "Manajemen memperoleh gambaran kinerja dan arus kas yang lebih jelas." },
        {
          title: "Efisiensi dan keberlanjutan",
          desc: "Perencanaan membantu organisasi mengelola sumber daya dan risiko secara lebih baik.",
        },
      ],
      targetAudience: [
        { audience: "Perusahaan dan UMKM" },
        { audience: "Pemilik dan pengelola bisnis" },
        { audience: "Investor dan pengembang usaha" },
        { audience: "Organisasi dan yayasan" },
      ],
    },
    en: {
      title: "Financial & Tax Advisory",
      tagline: "Optimizing financial and tax management for an efficient, compliant, and sustainable business.",
      description:
        "We help organizations build sound financial and tax governance through planning, reporting, compliance, and actionable analysis.",
      features: [
        {
          feature: "Financial Advisory",
          description:
            "Provide financial management advice, performance analysis, financial planning, and practical business finance strategies.",
        },
        {
          feature: "Tax Advisory",
          description:
            "Support compliance, tax obligation optimization, and the development of appropriate tax strategies.",
        },
        {
          feature: "Accounting & Financial Reporting",
          description:
            "Manage bookkeeping, financial statement preparation, and financial analysis based on business needs.",
        },
        {
          feature: "Tax Compliance",
          description: "Support tax calculation, reporting, documentation, and administration obligations.",
        },
        {
          feature: "Financial Planning & Analysis",
          description:
            "Develop projections, budgets, cash-flow analysis, and strategic recommendations based on financial conditions.",
        },
      ],
      benefits: [
        {
          title: "Stronger compliance",
          desc: "Financial and tax obligations are managed systematically and documented properly.",
        },
        { title: "Financial visibility", desc: "Management gains a clearer view of performance and cash flow." },
        {
          title: "Efficiency and sustainability",
          desc: "Better planning helps organizations manage resources and risks effectively.",
        },
      ],
      targetAudience: [
        { audience: "Companies and SMEs" },
        { audience: "Business owners and managers" },
        { audience: "Investors and business developers" },
        { audience: "Organizations and foundations" },
      ],
    },
  },
  {
    ...sharedTheme,
    slug: "workforce-solutions",
    sortOrder: 4,
    id: {
      title: "Manajemen Talenta",
      tagline: "Mengembangkan talenta, kompetensi, dan kinerja untuk mendukung kebutuhan organisasi.",
      description:
        "Kami membantu organisasi memperoleh, mengembangkan, dan mempertahankan talenta melalui sistem pengelolaan SDM yang terarah dan relevan dengan strategi bisnis.",
      features: [
        {
          feature: "Talent Management",
          description: "Pengelolaan dan pengembangan talenta sesuai potensi individu dan kebutuhan organisasi.",
        },
        {
          feature: "Recruitment & Selection",
          description: "Dukungan rekrutmen dan seleksi untuk memperoleh sumber daya manusia yang sesuai kebutuhan.",
        },
        {
          feature: "Training & Development",
          description: "Perancangan dan pelaksanaan pelatihan untuk meningkatkan kompetensi dan keterampilan.",
        },
        {
          feature: "Performance Management",
          description: "Pengembangan sistem pengelolaan kinerja untuk meningkatkan pencapaian individu dan organisasi.",
        },
        {
          feature: "Assessment & Competency Development",
          description:
            "Penilaian kompetensi dan potensi sebagai dasar penyusunan program pengembangan sumber daya manusia.",
        },
      ],
      benefits: [
        {
          title: "Talenta yang lebih tepat",
          desc: "Kebutuhan organisasi dipertemukan dengan kompetensi dan potensi individu.",
        },
        { title: "Kinerja yang terukur", desc: "Sasaran dan evaluasi kinerja disusun secara jelas serta konsisten." },
        {
          title: "Pengembangan berkelanjutan",
          desc: "Program kompetensi dirancang berdasarkan gap dan prioritas organisasi.",
        },
      ],
      targetAudience: [
        { audience: "Perusahaan dan grup usaha" },
        { audience: "Instansi pemerintah" },
        { audience: "BUMN dan BUMD" },
        { audience: "Institusi pendidikan dan organisasi" },
      ],
    },
    en: {
      title: "Talent Management",
      tagline: "Developing talent, capabilities, and performance to support organizational needs.",
      description:
        "We help organizations attract, develop, and retain talent through focused people-management systems aligned with business strategy.",
      features: [
        {
          feature: "Talent Management",
          description: "Manage and develop talent according to individual potential and organizational needs.",
        },
        {
          feature: "Recruitment & Selection",
          description: "Support recruitment and selection to secure people who fit the organization’s requirements.",
        },
        {
          feature: "Training & Development",
          description: "Design and deliver learning programs that improve competencies and practical skills.",
        },
        {
          feature: "Performance Management",
          description: "Develop performance management systems that strengthen individual and organizational outcomes.",
        },
        {
          feature: "Assessment & Competency Development",
          description: "Assess capabilities and potential as the basis for focused people-development programs.",
        },
      ],
      benefits: [
        {
          title: "Better talent fit",
          desc: "Organizational needs are aligned with individual competencies and potential.",
        },
        {
          title: "Measurable performance",
          desc: "Goals and performance reviews are structured clearly and consistently.",
        },
        {
          title: "Continuous development",
          desc: "Capability programs are designed around identified gaps and priorities.",
        },
      ],
      targetAudience: [
        { audience: "Companies and business groups" },
        { audience: "Government institutions" },
        { audience: "State-owned and regional enterprises" },
        { audience: "Education institutions and organizations" },
      ],
    },
  },
  {
    ...sharedTheme,
    slug: "business-investment-advisory",
    sortOrder: 5,
    id: {
      title: "Konsultasi Bisnis & Investasi",
      tagline: "Mendampingi pertumbuhan bisnis dan pengembangan peluang investasi yang lebih siap dan terarah.",
      description:
        "Kami mendampingi organisasi merencanakan, mengembangkan, dan meningkatkan kinerja bisnis sekaligus menyiapkan peluang investasi serta pendanaan.",
      features: [
        {
          feature: "Business Planning & Strategy",
          description:
            "Penyusunan business plan, business model, target usaha, strategi pertumbuhan, dan roadmap pengembangan.",
        },
        {
          feature: "Business Development",
          description: "Pengembangan produk, perluasan pasar, strategi pemasaran, kemitraan, dan peluang ekspansi.",
        },
        {
          feature: "Business Advisory",
          description:
            "Identifikasi permasalahan, evaluasi kondisi usaha, dan perumusan solusi strategis untuk meningkatkan daya saing.",
        },
        {
          feature: "Investment & Funding Advisory",
          description:
            "Pengembangan peluang investasi dan pendanaan melalui analisis, proyeksi keuangan, business proposal, dan peningkatan kesiapan usaha.",
        },
        {
          feature: "Business Performance Improvement",
          description:
            "Evaluasi bisnis, optimalisasi proses, efisiensi operasional, dan strategi peningkatan hasil usaha.",
        },
      ],
      benefits: [
        {
          title: "Strategi pertumbuhan yang fokus",
          desc: "Prioritas dan roadmap bisnis disusun berdasarkan kondisi serta peluang yang nyata.",
        },
        {
          title: "Kesiapan investasi",
          desc: "Model bisnis, proyeksi, dan proposal diperkuat agar lebih siap dinilai mitra pendanaan.",
        },
        {
          title: "Peningkatan kinerja",
          desc: "Proses dan keputusan bisnis diarahkan pada efisiensi, daya saing, serta hasil yang berkelanjutan.",
        },
      ],
      targetAudience: [
        { audience: "Perusahaan dan UMKM" },
        { audience: "Startup dan pengembang usaha" },
        { audience: "Investor dan pemilik aset" },
        { audience: "BUMN, BUMD, dan institusi" },
      ],
    },
    en: {
      title: "Business & Investment Advisory",
      tagline: "Supporting business growth and the development of stronger, investment-ready opportunities.",
      description:
        "We help organizations plan, develop, and improve business performance while preparing investment and funding opportunities.",
      features: [
        {
          feature: "Business Planning & Strategy",
          description:
            "Develop business plans, business models, commercial targets, growth strategies, and development roadmaps.",
        },
        {
          feature: "Business Development",
          description:
            "Support product development, market expansion, marketing strategy, partnerships, and growth opportunities.",
        },
        {
          feature: "Business Advisory",
          description:
            "Identify business challenges, evaluate current conditions, and formulate strategic solutions to improve competitiveness.",
        },
        {
          feature: "Investment & Funding Advisory",
          description:
            "Prepare investment and funding opportunities through analysis, financial projections, business proposals, and readiness improvement.",
        },
        {
          feature: "Business Performance Improvement",
          description:
            "Evaluate business performance, optimize processes, improve operational efficiency, and strengthen outcomes.",
        },
      ],
      benefits: [
        {
          title: "Focused growth strategy",
          desc: "Business priorities and roadmaps are grounded in actual conditions and opportunities.",
        },
        {
          title: "Investment readiness",
          desc: "Business models, projections, and proposals are strengthened for potential funding partners.",
        },
        {
          title: "Improved performance",
          desc: "Processes and decisions are aligned with efficiency, competitiveness, and sustainable results.",
        },
      ],
      targetAudience: [
        { audience: "Companies and SMEs" },
        { audience: "Startups and business developers" },
        { audience: "Investors and asset owners" },
        { audience: "State enterprises and institutions" },
      ],
    },
  },
  {
    ...sharedTheme,
    slug: "property-management-investment",
    previousSlug: "human-capital-development",
    sortOrder: 6,
    id: {
      title: "Property Management & Investment",
      tagline: "Mengoptimalkan operasional, pendapatan, pengalaman tamu, dan nilai investasi properti wisata.",
      description:
        "Kami mengelola vila dan akomodasi wisata secara profesional untuk menjaga kualitas operasional, meningkatkan kinerja pendapatan, dan memperkuat nilai aset jangka panjang.",
      features: [
        {
          feature: "Property Operations Management",
          description:
            "Pengelolaan operasional properti untuk memastikan kualitas layanan, pemeliharaan aset, housekeeping, dan konsistensi standar operasional.",
        },
        {
          feature: "Revenue Management",
          description:
            "Optimalisasi pendapatan melalui strategi harga, okupansi, distribusi, dan pemantauan kinerja pendapatan.",
        },
        {
          feature: "Sales & Marketing Management",
          description:
            "Pengembangan strategi pemasaran dan penjualan untuk meningkatkan visibilitas, jangkauan pasar, dan tingkat hunian.",
        },
        {
          feature: "Guest Experience Management",
          description:
            "Pengelolaan pengalaman tamu melalui standar pelayanan, komunikasi, guest relations, dan peningkatan kepuasan.",
        },
        {
          feature: "Property Investment & Performance",
          description:
            "Optimalisasi kinerja dan nilai investasi aset melalui evaluasi pendapatan, biaya operasional, okupansi, serta peluang pengembangan properti.",
        },
      ],
      benefits: [
        {
          title: "Operasional yang konsisten",
          desc: "Standar layanan, pemeliharaan, dan housekeeping dikelola secara profesional.",
        },
        {
          title: "Pendapatan lebih optimal",
          desc: "Harga, distribusi, okupansi, dan pemasaran dikelola berdasarkan kinerja pasar.",
        },
        {
          title: "Pengalaman tamu yang kuat",
          desc: "Setiap titik interaksi dirancang untuk meningkatkan kepuasan dan loyalitas tamu.",
        },
        {
          title: "Nilai aset berkelanjutan",
          desc: "Kinerja properti dipantau untuk melindungi dan mengembangkan nilai investasi.",
        },
      ],
      targetAudience: [
        { audience: "Pemilik vila dan akomodasi wisata" },
        { audience: "Investor dan pengembang properti" },
        { audience: "Hotel butik dan serviced residence" },
        { audience: "Pengelola destinasi wisata" },
      ],
    },
    en: {
      title: "Property Management & Investment",
      tagline: "Optimizing operations, revenue, guest experience, and the investment value of hospitality properties.",
      description:
        "We professionally manage villas and tourism accommodation to maintain operational quality, improve revenue performance, and strengthen long-term asset value.",
      features: [
        {
          feature: "Property Operations Management",
          description:
            "Manage property operations to ensure service quality, asset maintenance, housekeeping, and consistent operating standards.",
        },
        {
          feature: "Revenue Management",
          description:
            "Optimize revenue through pricing, occupancy, distribution, and performance-management strategies.",
        },
        {
          feature: "Sales & Marketing Management",
          description: "Develop marketing and sales strategies to improve visibility, market reach, and occupancy.",
        },
        {
          feature: "Guest Experience Management",
          description:
            "Manage guest experience through service standards, communication, guest relations, and satisfaction improvement.",
        },
        {
          feature: "Property Investment & Performance",
          description:
            "Optimize asset performance and investment value through revenue, operating cost, occupancy, and development-opportunity evaluation.",
        },
      ],
      benefits: [
        {
          title: "Consistent operations",
          desc: "Service standards, maintenance, and housekeeping are managed professionally.",
        },
        {
          title: "Optimized revenue",
          desc: "Pricing, distribution, occupancy, and marketing are managed according to market performance.",
        },
        {
          title: "Stronger guest experience",
          desc: "Every interaction is designed to improve guest satisfaction and loyalty.",
        },
        {
          title: "Sustainable asset value",
          desc: "Property performance is monitored to protect and grow investment value.",
        },
      ],
      targetAudience: [
        { audience: "Villa and tourism accommodation owners" },
        { audience: "Property investors and developers" },
        { audience: "Boutique hotels and serviced residences" },
        { audience: "Tourism destination operators" },
      ],
    },
  },
];
