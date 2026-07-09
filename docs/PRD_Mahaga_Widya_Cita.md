# PRD — Product Requirements Document
## Website PT Mahaga Widya Cita

**Versi:** 1.0.0  
**Tanggal:** 9 Juli 2026  
**Penyusun:** Tim Produk  
**Status:** Draft  

---

## 1. Executive Summary

PT Mahaga Widya Cita memerlukan sebuah platform digital komprehensif yang berfungsi sebagai wajah digital perusahaan sekaligus ekosistem layanan edukasi, konsultasi, dan teknologi bagi sektor publik (instansi pemerintah/ASN) serta swasta di Indonesia. Website ini akan menggantikan atau melengkapi kehadiran digital perusahaan dengan tampilan premium, performa tinggi, dan fitur yang kaya.

---

## 2. Visi Produk

> *"Menjadi platform digital terdepan yang menghubungkan kebutuhan penguatan kapasitas SDM dan tata kelola organisasi dengan solusi teknologi terkini di Indonesia."*

---

## 3. Tujuan Bisnis

| Kode | Tujuan | Metrik Keberhasilan |
|---|---|---|
| G-01 | Meningkatkan brand awareness PT Mahaga Widya Cita | 10.000+ kunjungan/bulan dalam 6 bulan |
| G-02 | Menjadi saluran utama perolehan prospek klien baru | 50+ leads/bulan dari formulir kontak |
| G-03 | Memfasilitasi pendaftaran webinar dan kursus secara digital | 500+ pendaftar webinar per sesi |
| G-04 | Membangun komunitas profesional ASN & pengguna aktif | 2.000+ pengguna terdaftar dalam 1 tahun |
| G-05 | Mendistribusikan konten edukasi dan regulasi secara efisien | 50+ artikel/bulan dipublikasikan |

---

## 4. Target Pengguna

### 4.1 Segmen Utama

| Persona | Deskripsi | Kebutuhan Utama |
|---|---|---|
| **Aparatur Sipil Negara (ASN)** | PNS/PPPK di kementerian, lembaga, pemerintah daerah | Webinar, kursus pengembangan kompetensi, sertifikat |
| **Pimpinan Instansi** | Kepala Dinas, Sekretaris Daerah, Bupati/Walikota | Layanan konsultasi strategis, Smart Governance Review |
| **Profesional Swasta** | Konsultan, manajer, eksekutif perusahaan | Kursus online, artikel, Policy Review |
| **Akademisi & Peneliti** | Dosen, peneliti, mahasiswa pascasarjana | Artikel, Policy Review, Smart Digital Conference |

### 4.2 Segmen Sekunder
- Tim pengadaan & keuangan instansi (evaluasi vendor)
- Calon karyawan PT Mahaga Widya Cita
- Wartawan & media massa

---

## 5. Fitur Fungsional (Feature Requirements)

### F-01: Halaman Profil Perusahaan
- **Deskripsi:** Halaman "Tentang Kami" yang menampilkan sejarah, visi, misi, dan nilai perusahaan.
- **Prioritas:** MUST HAVE
- **Komponen:** Hero banner, timeline sejarah, nilai perusahaan, pencapaian (statistik angka).

---

### F-02: Profil Tim & Manajemen
- **Deskripsi:** Halaman yang menampilkan seluruh jajaran manajemen, komisaris, direktur, dan tenaga ahli.
- **Prioritas:** MUST HAVE
- **Komponen:** Kartu profil (foto, nama, jabatan, bio), filter berdasarkan divisi/jabatan.

---

### F-03: Halaman Layanan (Our Services)
- **Deskripsi:** Halaman dedikasi untuk setiap layanan utama perusahaan.
- **Prioritas:** MUST HAVE
- **Layanan yang dicakup:**
  - Smart Consulting (Konsultasi Strategis)
  - Smart Executive Education (Pelatihan & Bimtek)
  - Smart Software Service (Pengembangan Perangkat Lunak)
  - Smart Governance Review (Tinjauan Tata Kelola)
  - Smart Online Course (Kursus Daring)
  - Smart Digital Conference (Konferensi Digital)

---

### F-04: Platform Kursus Online
- **Deskripsi:** Sub-platform untuk menampilkan, mendaftarkan, dan mengakses materi kursus daring.
- **Prioritas:** HIGH
- **Fitur:**
  - Listing kursus dengan filter (kategori, level, format: online/offline)
  - Halaman detail kursus (silabus, narasumber, jadwal, harga)
  - Pendaftaran kursus (gratis dan berbayar)
  - Akses materi kursus (video, dokumen PDF, presentasi)
  - Progress tracking per peserta
  - Kuis/evaluasi

---

### F-05: Sistem Webinar & Smart Discussion Series
- **Deskripsi:** Manajemen acara webinar rutin dan pendaftaran peserta.
- **Prioritas:** HIGH
- **Fitur:**
  - Listing webinar mendatang dan yang telah selesai
  - Halaman detail webinar (topik, narasumber, waktu, platform Zoom/YouTube)
  - Formulir pendaftaran webinar
  - Notifikasi email konfirmasi
  - Link rekaman webinar (pasca acara)

---

### F-06: Blog, Artikel & Policy Review
- **Deskripsi:** Pusat konten berupa artikel edukasi, berita perusahaan, dan ulasan kebijakan/regulasi pemerintah.
- **Prioritas:** HIGH
- **Fitur:**
  - Listing artikel dengan kategori (Untuk Individu, Untuk Bisnis, Untuk Pemerintah, Policy Review)
  - Halaman detail artikel dengan rich text editor
  - Fungsi pencarian artikel
  - Tag & kategori
  - Tombol berbagi (WhatsApp, Twitter, LinkedIn)
  - Related articles

---

### F-07: Sertifikat Digital
- **Deskripsi:** Penerbitan dan verifikasi sertifikat digital bagi peserta yang menyelesaikan webinar/kursus.
- **Prioritas:** MEDIUM
- **Fitur:**
  - Penerbitan sertifikat otomatis setelah peserta menyelesaikan syarat
  - Sertifikat dapat diunduh (format PDF)
  - Halaman verifikasi publik dengan kode unik

---

### F-08: Sistem Autentikasi & Profil Pengguna
- **Deskripsi:** Sistem login/registrasi bagi peserta kursus dan webinar.
- **Prioritas:** HIGH
- **Fitur:**
  - Registrasi dengan email & password
  - Login dengan Google (OAuth)
  - Halaman profil pengguna (data pribadi, riwayat kursus, sertifikat)
  - Reset password

---

### F-09: Halaman Mitra (Partners)
- **Deskripsi:** Menampilkan logo dan profil mitra strategis perusahaan (kementerian, pemerintah daerah, universitas).
- **Prioritas:** MEDIUM
- **Fitur:** Grid logo mitra, filter berdasarkan kategori, modal detail mitra.

---

### F-10: Halaman Karir
- **Deskripsi:** Halaman rekrutmen untuk calon karyawan PT Mahaga Widya Cita.
- **Prioritas:** MEDIUM
- **Fitur:** Listing lowongan kerja aktif, halaman detail lowongan, formulir lamaran online (upload CV).

---

### F-11: Formulir Kontak & Lead Generation
- **Deskripsi:** Formulir untuk calon klien menghubungi tim pemasaran perusahaan.
- **Prioritas:** MUST HAVE
- **Fitur:**
  - Formulir kontak (nama, instansi, email, nomor HP, pesan, layanan yang diminati)
  - Integrasi tombol WhatsApp langsung
  - Auto-reply email
  - Notifikasi ke email internal tim

---

### F-12: Newsletter Subscription
- **Deskripsi:** Fitur berlangganan newsletter untuk mendapatkan update artikel dan webinar terbaru.
- **Prioritas:** LOW
- **Fitur:** Form input email, konfirmasi email (double opt-in), unsubscribe link.

---

## 6. Fitur Non-Fungsional

| Kategori | Persyaratan |
|---|---|
| **Performa** | Waktu muat halaman < 2 detik. Google PageSpeed Score ≥ 85 (mobile & desktop) |
| **Responsivitas** | Mendukung penuh di perangkat mobile (360px), tablet (768px), dan desktop (1280px+) |
| **SEO** | Meta title, meta description, Open Graph, JSON-LD Schema, sitemap XML, robots.txt |
| **Keamanan** | HTTPS enforced, proteksi CSRF, rate limiting pada form, sanitasi input |
| **Aksesibilitas** | Memenuhi WCAG 2.1 Level AA |
| **Multi-bahasa** | Bahasa Indonesia & Inggris |
| **Browser Support** | Chrome, Firefox, Safari, Edge (versi 2 tahun terakhir) |
| **Uptime** | SLA 99.5% uptime |

---

## 7. Batasan Produk (Out of Scope — v1.0)

- ❌ Integrasi sistem Learning Management System (LMS) pihak ketiga seperti Moodle
- ❌ Fitur live streaming webinar langsung di website (menggunakan Zoom/YouTube embed)
- ❌ Sistem pembayaran dan e-commerce penuh (direncanakan di v2.0)
- ❌ Aplikasi mobile native (iOS/Android) — akan dipertimbangkan di v2.0

---

## 8. Success Metrics (KPI)

| Metrik | Target 3 Bulan | Target 6 Bulan |
|---|---|---|
| Kunjungan website/bulan | 3.000 | 10.000 |
| Pendaftaran akun baru | 200 | 1.000 |
| Formulir kontak terkirim | 20 | 50 |
| Pendaftaran webinar | 100/sesi | 500/sesi |
| Artikel dipublikasikan | 20 | 80 |
| Google PageSpeed Score | ≥ 85 | ≥ 90 |

---

## 9. Timeline Ringkasan

| Fase | Durasi | Deliverable |
|---|---|---|
| Fase 1: Desain & Fondasi | Minggu 1-2 | Landing page, halaman profil, layanan, kontak |
| Fase 2: Konten & Blog | Minggu 3-4 | Blog, artikel, policy review, CMS admin |
| Fase 3: Platform Edukasi | Minggu 5-8 | Kursus online, webinar, autentikasi, sertifikat |
| Fase 4: Backend & Integrasi | Minggu 9-12 | API penuh, panel admin, integrasi email, deployment |

---

*Dokumen ini bersifat dinamis dan akan diperbarui seiring perkembangan proyek.*
