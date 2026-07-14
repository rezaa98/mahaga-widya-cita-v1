export const dictionaries = {
  id: {
    nav: {
      login: "Masuk",
      contact: "Hubungi Kami",
    },
    common: {
      readMore: "Selengkapnya",
      readArticle: "Baca Artikel",
      loading: "Memuat...",
      all: "Semua",
    },
    footer: {
      copyright: "Hak Cipta Dilindungi",
      allRightsReserved: "PT Mahaga Widya Cita. Hak Cipta Dilindungi.",
      quickLinks: "Tautan Cepat",
      contactUs: "Hubungi Kami",
      followUs: "Ikuti Kami",
    },
    team: {
      management: "Manajemen Perusahaan",
      expert: "Tenaga Ahli",
    },
    home: {
      services: "Layanan Kami",
      latestArticles: "Artikel Terbaru",
    },
    contact: {
      name: "Nama Lengkap",
      email: "Email",
      phone: "Nomor Telepon",
      company: "Nama Instansi/Perusahaan",
      message: "Pesan",
      send: "Kirim Pesan",
      success: "Pesan Anda berhasil terkirim!",
      error: "Terjadi kesalahan. Silakan coba lagi.",
    }
  },
  en: {
    nav: {
      login: "Login",
      contact: "Contact Us",
    },
    common: {
      readMore: "Read More",
      readArticle: "Read Article",
      loading: "Loading...",
      all: "All",
    },
    footer: {
      copyright: "Copyright",
      allRightsReserved: "PT Mahaga Widya Cita. All Rights Reserved.",
      quickLinks: "Quick Links",
      contactUs: "Contact Us",
      followUs: "Follow Us",
    },
    team: {
      management: "Company Management",
      expert: "Experts",
    },
    home: {
      services: "Our Services",
      latestArticles: "Latest Articles",
    },
    contact: {
      name: "Full Name",
      email: "Email",
      phone: "Phone Number",
      company: "Company/Institution Name",
      message: "Message",
      send: "Send Message",
      success: "Your message has been sent successfully!",
      error: "An error occurred. Please try again.",
    }
  }
};

export type Locale = keyof typeof dictionaries;

export const getDictionary = (locale: Locale) => {
  return dictionaries[locale] || dictionaries['id'];
};
