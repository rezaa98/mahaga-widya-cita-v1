import { driver } from "driver.js";
import "driver.js/dist/driver.css";

export const startInteractiveTour = (pathname: string) => {
  let steps: any[] = [];

  if (pathname === "/admin") {
    steps = [
      {
        element: "nav.nav",
        popover: {
          title: "Selamat Datang di Admin Panel!",
          description:
            "Di sinilah Anda mengelola seluruh konten website Mahaga Widya Cita. Anda dapat mengedit Beranda, Layanan, Tim, dan Artikel dari menu di samping ini.",
          side: "right",
          align: "start",
        },
      },
      {
        element: 'a[href="/admin/collections/articles"]',
        popover: {
          title: "Menu Navigasi",
          description:
            'Silakan pilih salah satu menu (misal: "Beranda" atau "Articles") untuk melanjutkan panduan spesifik untuk halaman tersebut!',
          side: "right",
          align: "start",
        },
      },
    ];
  } else if (pathname === "/admin/collections/articles") {
    steps = [
      {
        popover: {
          title: "Daftar Artikel",
          description: "Ini adalah halaman daftar artikel yang sudah terbit atau tersimpan di sistem.",
        },
      },
      {
        element: 'a[href="/admin/collections/articles/create"]',
        popover: {
          title: "Buat Artikel Baru",
          description: 'Klik tombol "Create New" ini untuk mulai menulis artikel baru.',
          side: "bottom",
          align: "start",
        },
      },
    ];
  } else if (pathname === "/admin/collections/articles/create" || pathname.startsWith("/admin/collections/articles/")) {
    steps = [
      {
        element: 'input[name="title"]',
        popover: {
          title: "Judul Artikel",
          description: "Tulis judul artikel Anda di sini.",
          side: "bottom",
          align: "start",
        },
      },
      {
        element: 'button[title="Locale"]',
        popover: {
          title: "Pilih Bahasa",
          description:
            "Penting! Gunakan dropdown ini untuk berpindah ke bahasa Indonesia atau Inggris untuk meninjau hasil terjemahan.",
          side: "left",
          align: "start",
        },
      },
      {
        element: "button#action-save",
        popover: {
          title: "Simpan / Terbitkan",
          description: "Setelah selesai, klik tombol ini untuk mempublikasikan artikel Anda.",
          side: "left",
          align: "start",
        },
      },
    ];
  } else if (pathname === "/admin/globals/beranda") {
    steps = [
      {
        popover: {
          title: "Edit Beranda (Landing Page)",
          description:
            "Di sini Anda dapat mengubah teks utama, gambar hero, statistik, daftar mitra, dan pengaturan visibilitas untuk halaman utama.",
        },
      },
      {
        element: 'button[title="Locale"]',
        popover: {
          title: "Jangan Lupa Bahasa Inggris!",
          description:
            "Setiap teks yang Anda ubah di sini akan diterjemahkan otomatis. Selalu cek versi bahasa Inggris menggunakan tombol ini sebelum menyimpan.",
          side: "left",
          align: "start",
        },
      },
      {
        element: "button#action-save",
        popover: {
          title: "Simpan Perubahan",
          description: "Klik di sini untuk memperbarui halaman Beranda Anda secara publik.",
          side: "left",
          align: "start",
        },
      },
    ];
  } else if (pathname === "/admin/globals/tentang-kami") {
    steps = [
      {
        popover: {
          title: "Edit Tentang Kami",
          description: "Ubah teks Visi, Misi, pesan CEO, dan gambar sampul halaman perusahaan Anda melalui menu ini.",
        },
      },
      {
        element: "button#action-save",
        popover: {
          title: "Publish / Simpan",
          description: "Setelah melakukan perubahan, jangan lupa klik Publish untuk menayangkannya.",
          side: "left",
          align: "start",
        },
      },
    ];
  } else if (pathname === "/admin/collections/services" || pathname === "/admin/collections/team-members") {
    steps = [
      {
        popover: {
          title: "Daftar Konten",
          description: "Ini adalah daftar konten Anda saat ini.",
        },
      },
      {
        element: 'a[href*="/create"]',
        popover: {
          title: "Buat Baru",
          description: 'Klik tombol "Create New" ini untuk menambahkan item baru ke dalam daftar.',
          side: "bottom",
          align: "start",
        },
      },
    ];
  } else if (
    pathname.startsWith("/admin/collections/services/") ||
    pathname.startsWith("/admin/collections/team-members/")
  ) {
    steps = [
      {
        popover: {
          title: "Formulir Pengisian",
          description: "Isi semua data yang diperlukan di formulir ini.",
        },
      },
      {
        element: 'button[title="Locale"]',
        popover: {
          title: "Pilih Bahasa",
          description: "Anda bisa menyesuaikan konten terjemahan melalui tombol dropdown bahasa ini.",
          side: "left",
          align: "start",
        },
      },
      {
        element: "button#action-save",
        popover: {
          title: "Simpan / Terbitkan",
          description: "Klik tombol ini untuk mempublikasikan konten baru Anda.",
          side: "left",
          align: "start",
        },
      },
    ];
  } else {
    steps = [
      {
        popover: {
          title: "Bantuan Interaktif",
          description:
            "Buka menu Artikel, Layanan, atau Beranda untuk memulai tutorial terpandu cara menambahkan konten!",
        },
      },
    ];
  }

  const driverObj = driver({
    showProgress: true,
    animate: true,
    steps: steps,
    nextBtnText: "Lanjut",
    prevBtnText: "Kembali",
    doneBtnText: "Selesai",
  });

  driverObj.drive();
};
