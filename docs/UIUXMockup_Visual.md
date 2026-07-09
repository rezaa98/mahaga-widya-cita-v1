# UI/UX Visual Mockup — PT Mahaga Widya Cita

**Versi:** 1.0.0 | **Tanggal:** 9 Juli 2026

---

## 1. Homepage

![Homepage Mockup](/Users/rezaa_ym/.gemini/antigravity-ide/brain/fdb797ac-bcea-4120-9f3b-dce2f956f933/homepage_mockup_1783614071427.png)

**Komponen yang terlihat:**
- ✅ Navbar sticky dengan logo, navigasi, dan 2 CTA button
- ✅ Hero section dengan headline, subheadline, dan floating stats cards
- ✅ Stats counter: 500+ Webinar, 10.000+ Peserta, 200+ Instansi, 50+ Mitra
- ✅ Grid 6 layanan (Smart Consulting, Executive Education, Software, Gov Review, Online Course, Digital Conference) dengan gold accent cards
- ✅ Upcoming Webinar section + Latest Articles grid 3 kolom

---

## 2. Webinar Page (Listing + Detail)

![Webinar Page Mockup](/Users/rezaa_ym/.gemini/antigravity-ide/brain/fdb797ac-bcea-4120-9f3b-dce2f956f933/webinar_page_mockup_1783614094132.png)

**Komponen yang terlihat:**
- ✅ Listing webinar dark mode dengan filter tabs (Semua | Mendatang | Selesai)
- ✅ Kartu webinar: poster, badge SDS, topik, speaker, tanggal, platform Zoom, quota progress, FREE badge, tombol Daftar
- ✅ Halaman detail webinar dengan poster besar
- ✅ Profil speaker dengan foto dan jabatan
- ✅ Form pendaftaran: Nama, Email, No. HP, Instansi, Jabatan
- ✅ Tombol "Daftar Gratis" hijau + badge sertifikat

---

## 3. User Dashboard

![Dashboard Mockup](/Users/rezaa_ym/.gemini/antigravity-ide/brain/fdb797ac-bcea-4120-9f3b-dce2f956f933/dashboard_mockup_1783614115476.png)

**Komponen yang terlihat:**
- ✅ Sidebar navy dengan logo, avatar + nama user (Budi Santoso | ASN - Kemendagri)
- ✅ Menu sidebar: Dashboard, Kursus Saya, Webinar Saya, Sertifikat, Profil Saya, Logout
- ✅ Greeting "Selamat datang kembali, Budi! 👋"
- ✅ Stats cards 3 kolom dengan gradient: 3 Kursus Aktif (biru), 12 Webinar Diikuti (indigo), 2 Sertifikat (gold)
- ✅ Kursus Saya: 2 kartu kursus dengan progress bar (60% dan 30%)
- ✅ Webinar Mendatang: SDS #27, tombol "Bergabung via Zoom" hijau
- ✅ Sertifikat Terbaru: ikon piala, kode sertifikat, tombol Unduh PDF + Verifikasi

---

## 4. Smart Online Course (Listing) + Artikel Detail

![Course & Article Mockup](/Users/rezaa_ym/.gemini/antigravity-ide/brain/fdb797ac-bcea-4120-9f3b-dce2f956f933/course_article_mockup_1783614142137.png)

**Komponen yang terlihat:**
- ✅ Halaman kursus: breadcrumb, judul "Smart Online Course", filter bar (Category, Level pills, Format, Search)
- ✅ Grid kartu kursus: thumbnail berwarna, badge GRATIS (hijau), kategori "Keuangan Daerah", rating ⭐4.8, info "12 jam | 8 modul", jumlah peserta, tombol "Lihat Kursus →"
- ✅ Artikel detail: badge kategori "PEMERINTAH" (biru), judul H1 besar, author row dengan avatar + tanggal + waktu baca
- ✅ Gambar artikel rapat pemerintah profesional
- ✅ Tombol share: WhatsApp (hijau), LinkedIn (biru), Twitter/X
- ✅ Related articles di bawah

---

## 5. Catatan untuk Figma

> [!WARNING]
> Browser automation untuk Figma tidak tersedia saat ini karena keterbatasan teknis environment (Playwright driver 404). Berikut alternatif untuk membuat desain di Figma:

### Cara Export ke Figma (Manual)

**Opsi 1 — Figma Community Template:**
1. Buka [figma.com/community](https://figma.com/community)
2. Search: *"Government Education Platform UI Kit"* atau *"SaaS Dashboard UI Kit"*
3. Duplikat template yang mirip → sesuaikan warna ke palet PT Mahaga Widya Cita

**Opsi 2 — Import Mockup sebagai Reference:**
1. Buat file Figma baru
2. Import 4 gambar mockup di atas sebagai reference layer
3. Trace ulang setiap komponen menggunakan Auto Layout Figma
4. Terapkan Design Token dari Design System di dokumen UX Flow

**Opsi 3 — Figma Plugin "Mockup to Frame":**
- Gunakan plugin **Figma AI** (built-in) untuk generate frame dari deskripsi
- Atau plugin **Wireframe Designer** untuk tracing otomatis dari gambar

### Design Token untuk Figma Variables

```
Warna:
  primary/900: #0B2D6B
  primary/500: #1E6FD9  
  primary/100: #DBEAFE
  gold/500:    #C9970A
  success:     #16A34A
  neutral/900: #1A1A2E
  neutral/500: #6B7280
  white:       #FFFFFF
  bg:          #F4F6FA

Typography:
  Font Heading: Plus Jakarta Sans
  Font Body:    Inter
  
Spacing: 4px | 8px | 16px | 24px | 32px | 48px | 64px
Border Radius: 8px (card), 4px (button), 999px (badge/pill)
Shadow Card: 0 4px 24px rgba(0,0,0,0.08)
```
