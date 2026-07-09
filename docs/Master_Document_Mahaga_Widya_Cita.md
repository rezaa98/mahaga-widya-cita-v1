<div align="center">
  <br>
  <h1>Master Document — PT Mahaga Widya Cita</h1>
  <h3>Platform Edukasi & Penguatan Tata Kelola untuk Profesional Indonesia</h3>
  <br>
  <p><strong>Versi:</strong> 1.0.0 | <strong>Tanggal:</strong> 9 Juli 2026</p>
  <br><br>
</div>

<div style="page-break-after: always;"></div>

## Daftar Isi
1. [Product Requirements Document (PRD)](#1-product-requirements-document-prd)
2. [Functional Specification Document (FSD)](#2-functional-specification-document-fsd)
3. [User Stories](#3-user-stories)
4. [Technical Requirements Document (TRD)](#4-technical-requirements-document-trd)
5. [API Contract](#5-api-contract)
6. [UI/UX Flow Design](#6-uiux-flow-design)
7. [Visual Mockups](#7-visual-mockups)
8. [Implementation Plan (Timeline)](#8-implementation-plan-timeline)

<div style="page-break-after: always;"></div>

## 1. Product Requirements Document (PRD)

### 1.1 Executive Summary
PT Mahaga Widya Cita memerlukan sebuah platform digital komprehensif yang berfungsi sebagai wajah digital perusahaan sekaligus ekosistem layanan edukasi, konsultasi, dan teknologi bagi sektor publik (instansi pemerintah/ASN) serta swasta di Indonesia. 

### 1.2 Visi Produk
> *"Menjadi platform digital terdepan yang menghubungkan kebutuhan penguatan kapasitas SDM dan tata kelola organisasi dengan solusi teknologi terkini di Indonesia."*

### 1.3 Tujuan Bisnis
- **Meningkatkan brand awareness:** 10.000+ kunjungan/bulan dalam 6 bulan.
- **Saluran perolehan prospek baru:** 50+ leads/bulan.
- **Pendaftaran digital:** 500+ pendaftar webinar per sesi.
- **Komunitas profesional:** 2.000+ pengguna terdaftar dalam 1 tahun.
- **Distribusi edukasi:** 50+ artikel/bulan.

### 1.4 Target Pengguna
- **Utama:** Aparatur Sipil Negara (ASN), Pimpinan Instansi, Profesional Swasta, Akademisi & Peneliti.
- **Sekunder:** Tim pengadaan/keuangan instansi, Calon karyawan, Media massa.

### 1.5 Fitur Fungsional Utama
- **F-01 s/d F-03:** Halaman Profil, Manajemen Tim, dan Detail Layanan.
- **F-04:** Platform Kursus Online (Listing, Detail, Progress).
- **F-05:** Sistem Webinar & Smart Discussion Series (Pendaftaran, Embed Video).
- **F-06:** Blog, Artikel & Policy Review.
- **F-07:** Sertifikat Digital (Auto-generate & Verifikasi Publik).
- **F-08:** Sistem Autentikasi & Dashboard Pengguna.
- **F-09 s/d F-12:** Mitra, Karir, Form Kontak, Newsletter.

<div style="page-break-after: always;"></div>

## 2. Functional Specification Document (FSD)

### 2.1 Arsitektur Sistem
Sistem mengadopsi arsitektur modern berbasis web:
- **Client Layer:** Next.js SSR/SSG untuk Desktop & Mobile Browser.
- **Backend Layer:** Next.js API Routes / Node.js, NextAuth.js (JWT/Session).
- **Data Layer:** PostgreSQL (via Prisma ORM), Redis Cache, Cloudflare R2 untuk file.
- **CMS Layer:** Payload CMS / Strapi untuk manajemen konten admin.

### 2.2 Desain Database (Ringkasan)
Sistem memiliki relasi utama:
- `USERS` (Data pengguna terdaftar)
- `COURSES` & `WEBINARS` (Layanan edukasi)
- `REGISTRATIONS` (Pendaftaran pengguna ke kursus/webinar)
- `CERTIFICATES` (Penerbitan otomatis dari registrasi yang selesai)
- `ARTICLES`, `TEAM_MEMBERS`, `CONTACT_MESSAGES` (Manajemen konten umum)

### 2.3 Spesifikasi Visual
- **Tipografi Utama:** Plus Jakarta Sans (heading), Inter (body).
- **Palet Warna:** Biru Navy `#0B2D6B`, Biru Terang `#1E6FD9`, Aksen Emas `#C9970A`.
- **Background:** Putih `#FFFFFF`, Abu Muda `#F4F6FA`.

<div style="page-break-after: always;"></div>

## 3. User Stories

### 3.1 Epik & Persona
Mencakup perspektif: Pengunjung Umum, Pimpinan Instansi, Peserta/ASN, dan Admin Konten.

### 3.2 Contoh User Stories Kritis
- **US-012 (Calon Peserta Kursus):** *As a calon peserta, I want to melihat detail lengkap kursus sebelum mendaftar, so that saya bisa memastikan kursus ini sesuai dengan kebutuhan saya.*
- **US-016 (Peserta Webinar):** *As a ASN, I want to mendaftar webinar tanpa harus membuat akun terlebih dahulu (guest registration), so that proses pendaftaran lebih mudah dan cepat.*
- **US-023 (Verifikator Publik):** *As a pimpinan instansi atau HR, I want to memverifikasi keaslian sertifikat yang ditunjukkan oleh karyawan saya, so that saya bisa memastikan sertifikat tersebut valid dan bukan palsu.*
- **US-033 (Admin):** *As an admin, I want to menerbitkan sertifikat secara massal untuk peserta webinar, so that proses penerbitan lebih efisien.*

*(Terdapat total 33 User Stories mendetail untuk 11 Epik dalam dokumen lengkap).*

<div style="page-break-after: always;"></div>

## 4. Technical Requirements Document (TRD)

### 4.1 Tech Stack Detail
- **Frontend:** Next.js 14 (App Router), React 18, TypeScript 5, Tailwind CSS 3, Framer Motion, Shadcn/ui.
- **Backend:** Next.js API Routes, Prisma ORM 5, NextAuth.js 5.
- **Database:** PostgreSQL 16 (Supabase/Neon), Redis (Upstash) untuk caching.
- **Infrastruktur:** Vercel (Frontend), Railway (Backend/CMS), Cloudflare R2 (Storage), Resend (Email).

### 4.2 Standar Pengembangan & Keamanan
- **Authentication:** JWT Token dalam HttpOnly Cookie, OAuth Google.
- **Keamanan:** Proteksi CSRF (NextAuth), Rate Limiting 100 req/min/IP (Upstash), SQL Injection prevention (Prisma), Input Sanitization (Zod).
- **Performa:** ISR (Incremental Static Regeneration) untuk artikel & kursus, caching CDN Cloudflare, optimasi gambar dengan `next/image`.

<div style="page-break-after: always;"></div>

## 5. API Contract (Ringkasan Endpoint)

REST API v1 dengan format JSON dan autentikasi Bearer Token (JWT).

**5.1 Auth API**
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/forgot-password`

**5.2 Edukasi & Konten API**
- `GET /api/articles` dan `GET /api/articles/:slug`
- `GET /api/courses` dan `POST /api/courses/:courseId/enroll`
- `GET /api/webinars` dan `POST /api/webinars/:webinarId/register`

**5.3 Operasional API**
- `POST /api/contact` (Kirim form leads)
- `GET /api/certificates/verify?code=XXX` (Verifikasi sertifikat publik)
- `POST /api/career/:jobId/apply` (Kirim lamaran kerja dengan upload CV)

<div style="page-break-after: always;"></div>

## 6. UI/UX Flow Design

### 6.1 Alur Navigasi Utama
Pengguna berpusat dari Homepage ke 5 pilar utama: Tentang Kami, Layanan, Webinar & Kursus, Artikel, dan Karir/Kontak.

### 6.2 Alur Registrasi Webinar (Guest)
`Buka Halaman Webinar` ➔ `Klik Daftar` ➔ `Isi Form (Nama, Email, Instansi)` ➔ `Submit & Verifikasi Captcha` ➔ `Email Konfirmasi + Link Zoom Otomatis Terkirim`.

### 6.3 Alur Penerbitan Sertifikat
`Peserta Hadir / Selesai Kursus` ➔ `Sistem Verifikasi Absensi` ➔ `Generate PDF Sertifikat` ➔ `Kirim Email Notifikasi` ➔ `Sertifikat Muncul di Dashboard Pengguna`.

<div style="page-break-after: always;"></div>

## 7. Visual Mockups

Dokumen ini mereferensikan desain visual (high-fidelity mockups) dengan karakteristik:
- **Style:** Ultra-premium, modern, clean, dan profesional.
- **Elemen:** Glassmorphism pada kartu layanan, bayangan (*shadows*) yang sangat mulus, dan *gradients* warna biru dan aksen emas.

### Halaman yang Tersedia dalam Mockup:
1. **Homepage:** Header sticky, Hero section dengan animasi stat counter, Grid Layanan.
2. **Webinar Page:** Listing dengan tema gelap (dark mode), Detail acara dengan form registrasi *split-screen*.
3. **User Dashboard:** Navigasi sidebar, Kartu metrik (Kursus aktif, Webinar, Sertifikat).
4. **Course & Article:** Layout grid rapi untuk edukasi dan tata letak *editorial/reading mode* yang bersih untuk artikel panjang.

<div style="page-break-after: always;"></div>

## 8. Implementation Plan (Timeline)

Proyek ini akan dieksekusi dalam **4 Fase** selama **12 Minggu**:

### Fase 1 — Fondasi & Landing Page (Minggu 1–2)
- Setup Repositori, Next.js, dan Tailwind CSS.
- Pembuatan Halaman: Homepage, Profil Perusahaan, Kontak, dan Halaman Layanan statis.

### Fase 2 — Sistem Konten & Blog (Minggu 3–4)
- Integrasi CMS (Payload/Strapi).
- Pembuatan Database PostgreSQL.
- Listing & Detail Artikel, Policy Review.

### Fase 3 — Platform Edukasi (Minggu 5–8)
- Modul Kursus Online, Sistem Pendaftaran Webinar.
- Modul Autentikasi Pengguna & Dashboard Pribadi.
- Sistem generate Sertifikat Digital.

### Fase 4 — Backend, API & Pengujian (Minggu 9–12)
- Finalisasi endpoint API dan queue (email, sertifikat).
- Pengujian End-to-End (E2E), Performance Testing, dan Security Audit.
- Deployment Production ke Vercel dan Railway.

---
*PT Mahaga Widya Cita © 2026. All rights reserved.*
