# TRD — Technical Requirements Document
## Website PT Mahaga Widya Cita

**Versi:** 1.0.0  
**Tanggal:** 9 Juli 2026  
**Penyusun:** Tim Teknis  
**Referensi:** PRD v1.0.0, FSD v1.0.0  

---

## 1. Tech Stack Overview

### 1.1 Diagram Arsitektur

```mermaid
graph LR
    subgraph FE["Frontend — Vercel"]
        Next["Next.js 14\n(App Router, TypeScript)"]
        Tailwind["Tailwind CSS\n+ Framer Motion"]
        Shadcn["Shadcn/ui\n+ Radix UI"]
    end

    subgraph BE["Backend — Railway / VPS"]
        API["Next.js API Routes\n/ Express.js"]
        Auth["NextAuth.js v5\n(JWT + OAuth)"]
        Prisma["Prisma ORM"]
        BullMQ["BullMQ\n(Job Queue)"]
    end

    subgraph CMS["CMS — Payload CMS"]
        Admin["Admin Panel\n(Payload CMS 3.x)"]
    end

    subgraph DATA["Data Storage"]
        PG[(PostgreSQL 16\nSupabase / Neon)]
        Redis[(Redis\nUpstash)]
        R2[("Cloudflare R2\n(File Storage)")]
    end

    subgraph EXT["External Services"]
        Resend["Resend\n(Email)"]
        GA["Google Analytics 4"]
        ReCaptcha["Google reCAPTCHA v3"]
        ZoomAPI["Zoom API"]
    end

    Next --> API
    API --> Auth
    API --> Prisma
    API --> BullMQ
    Prisma --> PG
    API --> Redis
    API --> R2
    Admin --> PG
    BullMQ --> Resend
    Next --> GA
    Next --> ReCaptcha
    API --> ZoomAPI
```

---

## 2. Spesifikasi Teknologi

### 2.1 Frontend

| Teknologi | Versi | Justifikasi |
|---|---|---|
| **Next.js** | 14.x (App Router) | SSR + SSG untuk SEO optimal. Routing berbasis file system yang intuitif. |
| **React** | 18.x | Library UI yang mature, ekosistem luas, dan mendukung Server Components |
| **TypeScript** | 5.x | Type safety mencegah bug runtime, meningkatkan maintainability kode |
| **Tailwind CSS** | 3.x | Utility-first CSS yang cepat, konsisten, dan mudah dikustomisasi |
| **Framer Motion** | 11.x | Animasi deklaratif, smooth, dan terintegrasi penuh dengan React |
| **Shadcn/ui** | Latest | Komponen UI yang aksesibel, tidak berbasis library (kode langsung di project) |
| **Radix UI** | Latest | Primitive headless UI yang menjadi fondasi Shadcn/ui |
| **Lucide React** | Latest | Icon set yang konsisten dan dapat dikustomisasi |
| **React Hook Form** | 7.x | Manajemen form yang performan dengan zero re-render |
| **Zod** | 3.x | Schema validation TypeScript-first untuk form dan API |
| **TanStack Query** | 5.x | Manajemen async state (fetching, caching, sync) |
| **Next-intl** | Latest | Internasionalisasi (i18n) untuk multi-bahasa (ID & EN) |

---

### 2.2 Backend

| Teknologi | Versi | Justifikasi |
|---|---|---|
| **Next.js API Routes** | 14.x | Serverless API yang terintegrasi langsung di Next.js, mengurangi overhead |
| **Prisma ORM** | 5.x | Type-safe database client, migrasi database yang terstruktur, mendukung PostgreSQL |
| **NextAuth.js** | 5.x (Auth.js) | Solusi autentikasi all-in-one untuk Next.js (JWT, OAuth, session) |
| **bcryptjs** | Latest | Hashing password yang aman |
| **BullMQ** | 5.x | Job queue berbasis Redis untuk proses async (kirim email, generate sertifikat) |
| **Sharp** | Latest | Optimasi gambar sisi server (resize, compress, convert) |
| **Resend SDK** | Latest | SDK untuk layanan email transaksional |
| **AWS SDK / @aws-sdk/client-s3** | Latest | Kompatibel untuk integrasi Cloudflare R2 (S3-compatible) |

---

### 2.3 Database

| Aspek | Detail |
|---|---|
| **Database Utama** | PostgreSQL 16 |
| **Hosting** | Supabase (managed) atau Neon (serverless PostgreSQL) |
| **ORM** | Prisma 5.x |
| **Connection Pooling** | Prisma Accelerate atau PgBouncer |
| **Caching Layer** | Redis (Upstash — serverless Redis) |
| **Backup** | Otomatis harian, retensi 30 hari |

---

### 2.4 CMS (Content Management System)

| Aspek | Detail |
|---|---|
| **Platform** | Payload CMS 3.x (Headless, Next.js native) |
| **Database** | Berbagi PostgreSQL dengan aplikasi utama (skema terpisah) |
| **Akses** | `/admin` endpoint, terproteksi autentikasi Payload |
| **Fitur yang Dikelola** | Artikel, Kursus, Webinar, Tim, Mitra, Lowongan Karir, Navigasi |

**Alternatif:** Strapi 5.x (jika tim lebih familiar dengan REST-based CMS)

---

### 2.5 Infrastruktur & Deployment

| Komponen | Platform | Alasan |
|---|---|---|
| **Frontend Hosting** | Vercel | Native support Next.js, CDN global, preview deployments |
| **Backend/CMS Hosting** | Railway | Mudah deploy Node.js app, PostgreSQL add-on tersedia |
| **Database PostgreSQL** | Supabase / Neon | Fully managed, free tier cukup untuk awal, connection pooling |
| **Redis** | Upstash | Serverless, pay-per-use, mudah diintegrasikan |
| **File Storage** | Cloudflare R2 | S3-compatible, tanpa biaya egress (tidak dikenakan biaya transfer data keluar) |
| **CDN** | Cloudflare | Proteksi DDoS, caching, SSL gratis |
| **Domain & SSL** | Cloudflare / Rumahweb | Manajemen DNS, SSL termination di Cloudflare |
| **Email Service** | Resend.com | Deliverability tinggi, API modern, gratis hingga 3.000 email/bulan |
| **CI/CD** | GitHub Actions | Otomasi test, build, dan deploy ke Vercel & Railway |
| **Monitoring** | Sentry (error) + Vercel Analytics (performance) | |

---

## 3. Standar Pengembangan

### 3.1 Struktur Direktori (Next.js App Router)

```
mahaga-widya-cita/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (marketing)/        # Route group: halaman publik
│   │   │   ├── page.tsx        # Homepage
│   │   │   ├── tentang-kami/
│   │   │   ├── layanan/
│   │   │   ├── kursus/
│   │   │   ├── webinar/
│   │   │   ├── artikel/
│   │   │   ├── karir/
│   │   │   └── kontak/
│   │   ├── (auth)/             # Route group: autentikasi
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── dashboard/          # Protected routes
│   │   │   ├── profil/
│   │   │   ├── kursus-saya/
│   │   │   ├── webinar-saya/
│   │   │   └── sertifikat/
│   │   ├── api/                # API Routes
│   │   │   ├── auth/
│   │   │   ├── articles/
│   │   │   ├── courses/
│   │   │   ├── webinars/
│   │   │   ├── contact/
│   │   │   └── certificates/
│   │   └── layout.tsx          # Root layout
│   ├── components/             # Shared UI components
│   │   ├── ui/                 # Shadcn/ui components
│   │   ├── layout/             # Navbar, Footer, Sidebar
│   │   └── features/           # Feature-specific components
│   ├── lib/                    # Utilities & helpers
│   │   ├── db.ts               # Prisma client
│   │   ├── auth.ts             # NextAuth config
│   │   ├── email.ts            # Resend helpers
│   │   └── validations.ts      # Zod schemas
│   ├── hooks/                  # Custom React hooks
│   ├── types/                  # TypeScript type definitions
│   └── styles/                 # Global CSS
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── migrations/             # Database migrations
├── public/                     # Static assets
├── .env.local                  # Environment variables (dev)
├── next.config.ts
├── tailwind.config.ts
└── package.json
```

---

### 3.2 Environment Variables

```env
# App
NEXT_PUBLIC_APP_URL=https://mahagawidyacita.co.id
NEXT_PUBLIC_APP_NAME="PT Mahaga Widya Cita"

# Database
DATABASE_URL=postgresql://user:password@host:5432/mahaga_db

# Redis
REDIS_URL=redis://default:password@host:port

# Auth
AUTH_SECRET=your-secret-key
AUTH_GOOGLE_ID=your-google-client-id
AUTH_GOOGLE_SECRET=your-google-client-secret

# Email (Resend)
RESEND_API_KEY=re_xxxxxx
EMAIL_FROM=noreply@mahagawidyacita.co.id
EMAIL_SUPPORT=halo@mahagawidyacita.co.id

# File Storage (Cloudflare R2)
R2_ACCESS_KEY_ID=your-r2-access-key
R2_SECRET_ACCESS_KEY=your-r2-secret
R2_BUCKET_NAME=mahaga-assets
R2_ENDPOINT=https://xxxxx.r2.cloudflarestorage.com
NEXT_PUBLIC_R2_PUBLIC_URL=https://assets.mahagawidyacita.co.id

# Google Services
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6Lxxxxxxx
RECAPTCHA_SECRET_KEY=6Lxxxxxxx

# Zoom API (Optional)
ZOOM_API_KEY=your-zoom-key
ZOOM_API_SECRET=your-zoom-secret
```

---

### 3.3 Konvensi Penamaan Kode

| Aspek | Konvensi | Contoh |
|---|---|---|
| Komponen React | PascalCase | `HeroSection.tsx` |
| Fungsi & variable | camelCase | `getUserById()` |
| File utils/hooks | camelCase | `useScrollPosition.ts` |
| CSS class (Tailwind) | kebab-case (otomatis) | `text-primary-600` |
| API endpoint | kebab-case | `/api/user-profile` |
| Database tabel | snake_case | `course_enrollments` |
| Environment variable | SCREAMING_SNAKE_CASE | `DATABASE_URL` |
| Konstanta | SCREAMING_SNAKE_CASE | `MAX_RETRY_ATTEMPTS` |

---

### 3.4 Standar API Response

Semua endpoint API wajib menggunakan format response yang konsisten:

**Success Response:**
```json
{
  "success": true,
  "message": "Data berhasil diambil",
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Terjadi kesalahan",
  "error": {
    "code": "VALIDATION_ERROR",
    "details": [
      { "field": "email", "message": "Format email tidak valid" }
    ]
  }
}
```

---

## 4. Keamanan

### 4.1 Autentikasi & Otorisasi
- JWT token disimpan di **HttpOnly Cookie** (bukan localStorage) untuk mencegah XSS
- Session timeout: 7 hari (refresh otomatis jika aktif)
- Role-based access control (RBAC): `USER`, `ADMIN`, `SUPER_ADMIN`
- Middleware Next.js melindungi semua route `/dashboard` dan `/api` yang memerlukan autentikasi

### 4.2 Perlindungan API
- **Rate Limiting:** Maksimal 100 request/menit per IP (menggunakan Upstash Ratelimit)
- **CORS:** Hanya mengizinkan origin dari domain resmi
- **Input Sanitization:** Semua input user disanitasi sebelum disimpan ke DB
- **SQL Injection:** Terlindungi otomatis oleh Prisma ORM (parameterized queries)
- **CSRF Protection:** Dihandle oleh NextAuth.js
- **XSS Prevention:** React melakukan sanitasi otomatis, DOMPurify untuk konten HTML dari CMS

### 4.3 Upload File
- Validasi tipe file: hanya `image/jpeg`, `image/png`, `image/webp`, `application/pdf`
- Batas ukuran: gambar maks 5MB, dokumen PDF maks 10MB
- File disimpan di Cloudflare R2 dengan nama file di-hash (UUID) untuk mencegah akses prediktif

---

## 5. Performa

### 5.1 Strategi Rendering

| Jenis Halaman | Strategi | Alasan |
|---|---|---|
| Homepage | ISR (revalidate: 3600s) | Konten berubah harian, butuh SEO |
| Listing artikel/kursus | ISR (revalidate: 1800s) | Konten sering berubah, butuh SEO |
| Detail artikel/kursus | SSG + on-demand revalidation | Konten statis per slug, diupdate saat CMS berubah |
| Halaman layanan (statis) | SSG | Jarang berubah |
| Dashboard pengguna | CSR (Client-side) | Data personal, tidak perlu di-index oleh search engine |
| API Routes | Edge Runtime (jika memungkinkan) | Latensi minimal |

### 5.2 Optimasi Gambar
- Semua gambar menggunakan `next/image` untuk optimasi otomatis (WebP, lazy loading, responsive srcset)
- Thumbnail artikel: dimensi 1200×630px
- Foto tim: dimensi 400×400px (rasio 1:1)

### 5.3 Caching Strategy
- **CDN Cache (Cloudflare):** Assets statis (gambar, font, CSS, JS) dicache di edge selama 1 tahun
- **API Cache (Redis):** Data yang sering diakses (listing kursus, artikel terbaru) dicache di Redis dengan TTL 15 menit
- **SWR (stale-while-revalidate):** Digunakan di client-side untuk data yang tidak terlalu kritis

---

## 6. Monitoring & Observability

| Tools | Fungsi |
|---|---|
| **Sentry** | Error tracking & performance monitoring (FE + BE) |
| **Vercel Analytics** | Core Web Vitals, page views, user analytics |
| **Uptime Robot** | Monitoring uptime URL setiap 5 menit, alert via email/WhatsApp |
| **Prisma Studio** | Inspeksi database saat development |
| **Logtail (Better Stack)** | Centralized logging untuk API calls dan job queue |

---

## 7. Testing Strategy

| Tipe Test | Tools | Coverage Target |
|---|---|---|
| Unit Test | Vitest + React Testing Library | ≥ 70% untuk fungsi utility dan komponen UI kritis |
| Integration Test | Vitest + Prisma mock | Semua API endpoint |
| E2E Test | Playwright | Alur kritis: register, login, daftar webinar, unduh sertifikat |
| Visual Regression | Playwright Screenshots | Komponen UI utama |

**Perintah Test:**
```bash
# Unit & Integration test
npm run test

# E2E test
npx playwright test

# Test dengan coverage report
npm run test:coverage
```

---

## 8. Panduan Deployment

### 8.1 Development
```bash
git clone <repo-url>
cd mahaga-widya-cita
npm install
cp .env.example .env.local
# Isi .env.local dengan konfigurasi lokal
npx prisma migrate dev
npm run dev
```

### 8.2 Production (CI/CD via GitHub Actions)
```yaml
# .github/workflows/deploy.yml (ringkasan)
# Trigger: push ke branch 'main'
# Steps:
#   1. Checkout code
#   2. Install dependencies
#   3. Run linting (ESLint)
#   4. Run type check (tsc)
#   5. Run tests (Vitest)
#   6. Deploy to Vercel (frontend)
#   7. Run prisma migrate deploy (database migration)
#   8. Deploy to Railway (backend/CMS, jika terpisah)
```

### 8.3 Database Migration
```bash
# Development: generate & apply migration
npx prisma migrate dev --name nama_migration

# Production: apply migration yang sudah ada
npx prisma migrate deploy
```

---

*Dokumen TRD ini akan diperbarui seiring keputusan teknis selama proses pengembangan.*
