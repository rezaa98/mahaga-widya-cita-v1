# User Stories — PT Mahaga Widya Cita

**Versi:** 1.0.0  
**Tanggal:** 9 Juli 2026  
**Format:** As a [role], I want to [action], so that [benefit]

---

## Daftar Epik

| Kode | Epik | Persona |
|---|---|---|
| EP-01 | Navigasi & Profil Perusahaan | Semua Pengunjung |
| EP-02 | Eksplorasi Layanan | Pengunjung Umum |
| EP-03 | Autentikasi Pengguna | Calon Peserta |
| EP-04 | Kursus Online | Peserta Terdaftar |
| EP-05 | Webinar & SDS | Peserta/ASN |
| EP-06 | Artikel & Regulasi | Semua Pengunjung |
| EP-07 | Sertifikat Digital | Peserta |
| EP-08 | Dashboard Pengguna | Peserta Terdaftar |
| EP-09 | Kontak & Leads | Calon Klien |
| EP-10 | Karir | Calon Karyawan |
| EP-11 | Manajemen Konten (Admin) | Admin Konten |

---

## EP-01: Navigasi & Profil Perusahaan

### US-001
**As a** pengunjung umum,  
**I want to** melihat halaman beranda website yang profesional,  
**so that** saya mendapatkan gambaran pertama yang kuat tentang PT Mahaga Widya Cita.

**Acceptance Criteria:**
- [ ] Hero section tampil dengan headline, subheadline, dan minimal 2 tombol CTA
- [ ] Halaman menampilkan statistik pencapaian perusahaan (jumlah mitra, peserta, kursus)
- [ ] Navbar sticky selalu terlihat saat scroll
- [ ] Halaman fully responsive di mobile dan desktop
- [ ] Load time < 2 detik

---

### US-002
**As a** pengunjung umum,  
**I want to** membaca profil PT Mahaga Widya Cita (visi, misi, sejarah),  
**so that** saya dapat memahami latar belakang dan komitmen perusahaan.

**Acceptance Criteria:**
- [ ] Halaman `/tentang-kami` menampilkan visi, misi, dan nilai perusahaan
- [ ] Terdapat bagian "Perjalanan Kami" atau timeline perusahaan
- [ ] Terdapat foto/gambar kantor atau tim

---

### US-003
**As a** pengunjung umum,  
**I want to** melihat daftar jajaran manajemen dan tenaga ahli,  
**so that** saya dapat menilai kredibilitas dan kompetensi tim perusahaan.

**Acceptance Criteria:**
- [ ] Halaman `/tentang-kami/manajemen` menampilkan kartu profil setiap anggota manajemen
- [ ] Setiap kartu menampilkan: foto, nama lengkap dengan gelar, jabatan, bio singkat
- [ ] Terdapat filter berdasarkan divisi/jabatan
- [ ] Kartu dapat diklik untuk melihat profil lengkap (modal atau halaman baru)

---

### US-004
**As a** pengunjung umum,  
**I want to** melihat daftar mitra strategis perusahaan,  
**so that** saya yakin bahwa PT Mahaga Widya Cita bekerja sama dengan institusi terpercaya.

**Acceptance Criteria:**
- [ ] Halaman mitra menampilkan logo mitra dalam grid/carousel
- [ ] Terdapat filter berdasarkan kategori (Kementerian, Pemda, Universitas, Swasta)
- [ ] Hover pada logo menampilkan nama mitra

---

## EP-02: Eksplorasi Layanan

### US-005
**As a** pimpinan instansi pemerintah,  
**I want to** memahami secara detail layanan Smart Consulting,  
**so that** saya dapat mempertimbangkan untuk menggunakan jasa konsultasi PT Mahaga Widya Cita.

**Acceptance Criteria:**
- [ ] Halaman `/layanan/konsultasi` menjelaskan ruang lingkup, metodologi, dan manfaat layanan
- [ ] Terdapat studi kasus atau portofolio klien (jika tersedia)
- [ ] Terdapat CTA "Konsultasi Gratis" yang terhubung ke halaman kontak / WhatsApp

---

### US-006
**As a** Kepala Dinas sebuah pemda,  
**I want to** memahami layanan Smart Governance Review,  
**so that** saya tahu bagaimana layanan ini dapat membantu instansi kami menjadi lebih akuntabel.

**Acceptance Criteria:**
- [ ] Halaman `/layanan/governance-review` menjelaskan proses, metodologi, dan output review
- [ ] Terdapat daftar aspek yang dinilai (SAKIP, Zona Integritas, dll)
- [ ] Terdapat tombol "Ajukan Review" yang menghubungkan ke form kontak

---

### US-007
**As a** manajer perusahaan swasta,  
**I want to** melihat portofolio dan kemampuan Smart Software Service,  
**so that** saya bisa memutuskan apakah PT Mahaga Widya Cita cocok untuk proyek pengembangan software kami.

**Acceptance Criteria:**
- [ ] Halaman menampilkan teknologi/stack yang dikuasai
- [ ] Terdapat contoh produk atau portfolio aplikasi yang pernah dikembangkan
- [ ] Terdapat informasi proses pengembangan (discovery, design, development, testing, deployment)

---

## EP-03: Autentikasi Pengguna

### US-008
**As a** calon peserta kursus,  
**I want to** membuat akun baru dengan email dan password,  
**so that** saya bisa mengakses kursus dan mendapatkan sertifikat.

**Acceptance Criteria:**
- [ ] Form registrasi memiliki field: nama, email, nomor HP, password, konfirmasi password
- [ ] Validasi real-time untuk setiap field
- [ ] Email verifikasi dikirim setelah registrasi berhasil
- [ ] Setelah verifikasi, pengguna dapat login

---

### US-009
**As a** pengguna terdaftar,  
**I want to** login menggunakan akun Google,  
**so that** saya tidak perlu repot mengingat password baru.

**Acceptance Criteria:**
- [ ] Terdapat tombol "Masuk dengan Google" di halaman login dan register
- [ ] Alur OAuth Google berjalan dengan benar
- [ ] Akun Google yang sudah pernah login tidak membuat akun duplikat

---

### US-010
**As a** pengguna yang lupa password,  
**I want to** mereset password saya melalui email,  
**so that** saya dapat kembali mengakses akun saya.

**Acceptance Criteria:**
- [ ] Terdapat link "Lupa Password?" di halaman login
- [ ] Sistem mengirim email berisi link reset password (valid 1 jam)
- [ ] Pengguna dapat membuat password baru setelah klik link
- [ ] Setelah reset, pengguna langsung dapat login dengan password baru

---

## EP-04: Kursus Online

### US-011
**As a** ASN (pegawai pemerintah),  
**I want to** melihat semua kursus yang tersedia dan memfilternya,  
**so that** saya bisa menemukan kursus yang paling relevan dengan kebutuhan pengembangan saya.

**Acceptance Criteria:**
- [ ] Listing kursus menampilkan semua kursus aktif
- [ ] Filter berfungsi: kategori, level, format, status
- [ ] Search bar mencari kursus berdasarkan judul atau kata kunci
- [ ] Hasil filter/search menampilkan jumlah kursus yang ditemukan
- [ ] Pagination atau infinite scroll berfungsi

---

### US-012
**As a** calon peserta,  
**I want to** melihat detail lengkap kursus sebelum mendaftar,  
**so that** saya bisa memastikan kursus ini sesuai dengan kebutuhan saya.

**Acceptance Criteria:**
- [ ] Halaman detail menampilkan: deskripsi, tujuan pembelajaran, kurikulum (accordion), profil instruktur, info (durasi, level, format, sertifikat)
- [ ] Kurikulum dapat dibuka-tutup per modul
- [ ] Harga dan tombol "Daftar Sekarang" selalu terlihat (sticky sidebar atau fixed bottom bar di mobile)

---

### US-013
**As a** peserta kursus terdaftar,  
**I want to** mengakses materi kursus (video, dokumen, presentasi),  
**so that** saya bisa belajar sesuai jadwal dan kecepatan saya sendiri.

**Acceptance Criteria:**
- [ ] Materi kursus hanya dapat diakses setelah terdaftar dan login
- [ ] Video player berfungsi dan menyimpan progress tontonan
- [ ] Dokumen PDF dapat diunduh
- [ ] Progress belajar per modul tersimpan dan ditampilkan (misal: 3/7 modul selesai)

---

### US-014
**As a** peserta kursus,  
**I want to** mengerjakan kuis evaluasi di akhir modul,  
**so that** saya dapat mengukur pemahaman saya dan mendapatkan sertifikat.

**Acceptance Criteria:**
- [ ] Kuis tersedia setelah semua materi modul selesai ditonton
- [ ] Terdapat batas nilai minimum untuk lulus (misal: ≥ 70)
- [ ] Peserta dapat mengulang kuis jika tidak lulus (maksimal 3 kali)
- [ ] Setelah lulus semua kuis → sertifikat otomatis diterbitkan

---

## EP-05: Webinar & Smart Discussion Series

### US-015
**As a** ASN,  
**I want to** melihat jadwal webinar yang akan datang,  
**so that** saya bisa merencanakan kehadiran dan mendaftar lebih awal.

**Acceptance Criteria:**
- [ ] Listing webinar menampilkan webinar mendatang dengan tanggal paling dekat di urutan teratas
- [ ] Setiap kartu webinar menampilkan: topik, tanggal/waktu, narasumber, platform
- [ ] Badge "Segera Hadir" / "Buka Pendaftaran" / "Penuh" / "Selesai" tampil sesuai status

---

### US-016
**As a** ASN,  
**I want to** mendaftar webinar tanpa harus membuat akun terlebih dahulu,  
**so that** proses pendaftaran lebih mudah dan cepat.

**Acceptance Criteria:**
- [ ] Form pendaftaran webinar dapat diisi tanpa login (guest registration)
- [ ] Field: nama, email, nomor HP, instansi, jabatan
- [ ] Email konfirmasi berisi link Zoom/YouTube dikirim otomatis setelah mendaftar
- [ ] Sistem mencegah email yang sama mendaftar dua kali untuk webinar yang sama

---

### US-017
**As a** peserta webinar yang telah hadir,  
**I want to** mendapatkan sertifikat kehadiran secara otomatis,  
**so that** saya punya bukti partisipasi untuk keperluan administrasi di instansi saya.

**Acceptance Criteria:**
- [ ] Sertifikat diterbitkan dalam maksimal 3 hari kerja setelah webinar selesai
- [ ] Notifikasi email dikirim saat sertifikat siap diunduh
- [ ] Sertifikat dapat diunduh dalam format PDF

---

### US-018
**As a** pengunjung umum,  
**I want to** menonton rekaman webinar yang sudah selesai,  
**so that** saya bisa mengakses konten berharga meskipun tidak hadir saat live.

**Acceptance Criteria:**
- [ ] Halaman detail webinar yang sudah selesai menampilkan embed video YouTube
- [ ] Materi presentasi (PDF) dapat diunduh
- [ ] Rekaman tersedia dalam 1-3 hari kerja setelah webinar selesai

---

## EP-06: Artikel & Regulasi

### US-019
**As a** ASN,  
**I want to** membaca ringkasan regulasi dan undang-undang terbaru,  
**so that** saya selalu mengikuti perkembangan kebijakan pemerintah.

**Acceptance Criteria:**
- [ ] Terdapat kategori "Policy Review" di halaman artikel
- [ ] Setiap artikel Policy Review memiliki struktur: ringkasan, poin penting, link ke regulasi resmi
- [ ] Filter berdasarkan jenis regulasi (UU, PP, Permendagri, dll)

---

### US-020
**As a** pengunjung umum,  
**I want to** mencari artikel berdasarkan kata kunci,  
**so that** saya bisa menemukan informasi yang saya butuhkan dengan cepat.

**Acceptance Criteria:**
- [ ] Search bar tersedia di halaman listing artikel
- [ ] Hasil pencarian muncul dalam < 1 detik
- [ ] Jika tidak ada hasil, tampil pesan "Artikel tidak ditemukan" beserta saran pencarian lain

---

### US-021
**As a** pembaca artikel,  
**I want to** berbagi artikel ke WhatsApp atau media sosial,  
**so that** saya bisa menyebarkan informasi bermanfaat ke rekan-rekan saya.

**Acceptance Criteria:**
- [ ] Tombol share untuk WhatsApp, LinkedIn, Twitter/X, dan salin tautan tersedia di setiap artikel
- [ ] Open Graph meta tag terkonfigurasi dengan benar sehingga preview link tampil saat dibagikan

---

## EP-07: Sertifikat Digital

### US-022
**As a** peserta,  
**I want to** mengunduh sertifikat saya dalam format PDF berkualitas tinggi,  
**so that** saya bisa mencetaknya atau melampirkannya di portofolio digital saya.

**Acceptance Criteria:**
- [ ] Tombol "Unduh Sertifikat (PDF)" tersedia di dashboard dan di email notifikasi
- [ ] PDF berukuran A4 landscape, kualitas cetak minimal 150 dpi
- [ ] Nama file format: `SERTIFIKAT_[NAMA]_[KODE].pdf`

---

### US-023
**As a** pimpinan instansi atau HR,  
**I want to** memverifikasi keaslian sertifikat yang ditunjukkan oleh karyawan saya,  
**so that** saya bisa memastikan sertifikat tersebut valid dan bukan palsu.

**Acceptance Criteria:**
- [ ] Halaman verifikasi publik dapat diakses tanpa login
- [ ] Input kode sertifikat → tampil informasi: nama penerima, nama program, tanggal terbit, logo perusahaan
- [ ] QR Code di sertifikat langsung mengarah ke halaman verifikasi dengan kode yang terisi otomatis

---

## EP-08: Dashboard Pengguna

### US-024
**As a** pengguna terdaftar,  
**I want to** melihat ringkasan semua aktivitas saya di dashboard,  
**so that** saya bisa memantau progress belajar saya secara keseluruhan.

**Acceptance Criteria:**
- [ ] Dashboard menampilkan: kursus yang sedang diikuti, webinar yang didaftar, sertifikat yang diperoleh
- [ ] Progress bar per kursus tampil dengan jelas
- [ ] Notifikasi webinar mendatang muncul di dashboard

---

### US-025
**As a** pengguna terdaftar,  
**I want to** mengedit profil saya (nama, foto, instansi),  
**so that** data saya selalu akurat dan sertifikat diterbitkan dengan nama yang benar.

**Acceptance Criteria:**
- [ ] Form edit profil tersedia di `/dashboard/profil`
- [ ] Upload foto profil (format JPG/PNG, maks 2MB)
- [ ] Perubahan data tersimpan dan tampil real-time tanpa refresh halaman

---

## EP-09: Kontak & Leads

### US-026
**As a** calon klien dari instansi pemerintah,  
**I want to** mengirim pesan ke tim PT Mahaga Widya Cita,  
**so that** saya bisa mendiskusikan kebutuhan instansi saya dan mendapat penawaran.

**Acceptance Criteria:**
- [ ] Halaman kontak memiliki form lengkap (nama, instansi, email, HP, layanan diminati, pesan)
- [ ] Form dilindungi oleh CAPTCHA
- [ ] Notifikasi email diterima oleh tim internal dalam < 5 menit
- [ ] Pengirim mendapat email auto-reply konfirmasi

---

### US-027
**As a** pengunjung yang lebih suka komunikasi langsung,  
**I want to** langsung menghubungi tim via WhatsApp dengan satu klik,  
**so that** proses komunikasi lebih cepat dan personal.

**Acceptance Criteria:**
- [ ] Tombol WhatsApp (floating button) selalu terlihat di semua halaman
- [ ] Saat diklik, membuka WhatsApp dengan nomor dan pesan awalan otomatis

---

## EP-10: Karir

### US-028
**As a** pencari kerja,  
**I want to** melihat daftar posisi yang sedang dibuka oleh PT Mahaga Widya Cita,  
**so that** saya bisa melamar posisi yang sesuai dengan kompetensi saya.

**Acceptance Criteria:**
- [ ] Halaman karir menampilkan semua lowongan aktif
- [ ] Setiap kartu lowongan: posisi, divisi, lokasi, tipe (full-time/contract), deadline
- [ ] Filter berdasarkan divisi dan tipe pekerjaan

---

### US-029
**As a** pelamar,  
**I want to** mengirim lamaran kerja secara online dengan melampirkan CV,  
**so that** proses melamar lebih mudah dan tidak perlu mengirim email manual.

**Acceptance Criteria:**
- [ ] Form lamaran: nama, email, nomor HP, posisi yang dilamar, upload CV (PDF, maks 5MB), cover letter (opsional)
- [ ] Email konfirmasi lamaran terkirim ke pelamar
- [ ] Notifikasi lamaran baru diterima oleh tim HR

---

## EP-11: Manajemen Konten (Admin)

### US-030
**As an** admin konten,  
**I want to** membuat dan mempublikasikan artikel baru melalui panel CMS,  
**so that** konten website selalu diperbarui tanpa memerlukan bantuan developer.

**Acceptance Criteria:**
- [ ] Panel CMS memiliki rich text editor (heading, list, gambar, tabel, blockquote)
- [ ] Artikel dapat disimpan sebagai draft sebelum dipublikasikan
- [ ] Admin dapat mengatur: kategori, tag, thumbnail, SEO meta (title & description)
- [ ] Artikel dapat dijadwalkan publikasinya (scheduled publish)

---

### US-031
**As an** admin,  
**I want to** mengelola data webinar (tambah, edit, hapus),  
**so that** informasi webinar di website selalu akurat dan terkini.

**Acceptance Criteria:**
- [ ] Form tambah/edit webinar: judul, deskripsi, narasumber, tanggal/waktu, platform, link, poster
- [ ] Admin dapat mengubah status: Draft → Published → Completed
- [ ] Admin dapat melihat daftar peserta yang mendaftar per webinar

---

### US-032
**As an** admin,  
**I want to** mengeksport daftar peserta webinar dalam format Excel/CSV,  
**so that** saya bisa menggunakannya untuk keperluan laporan dan presensi.

**Acceptance Criteria:**
- [ ] Tombol "Export Excel" / "Export CSV" tersedia di halaman daftar peserta per webinar
- [ ] File yang dieksport memuat: nama, email, instansi, jabatan, tanggal daftar

---

### US-033
**As an** admin,  
**I want to** menerbitkan sertifikat secara massal untuk peserta webinar,  
**so that** proses penerbitan lebih efisien daripada satu per satu.

**Acceptance Criteria:**
- [ ] Tombol "Terbitkan Sertifikat Massal" di halaman manajemen peserta
- [ ] Sistem mengirim notifikasi email ke semua peserta yang mendapat sertifikat
- [ ] Admin dapat mengunduh semua sertifikat dalam satu file ZIP

---

*Total User Stories: 33 (dapat berkembang seiring perkembangan proyek)*
