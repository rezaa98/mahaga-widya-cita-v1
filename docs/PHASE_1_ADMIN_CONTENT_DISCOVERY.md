# Fase 1 — Discovery, Arsitektur Admin, dan Konten

Status: Selesai  
Tanggal: 19 Juli 2026  
Scope: Audit admin Payload CMS, desain UI admin, artikel dengan media upload, dan publikasi jurnal.

## 1. Keputusan arsitektur

Admin menggunakan pendekatan **hybrid custom Payload Admin**:

- Payload tetap menjadi system of record untuk autentikasi, database, API, upload, localization, dan form state.
- Dashboard, sidebar, top bar, branding, feedback state, dan komponen editorial dibuat custom.
- Collection list dan edit form Payload dipertahankan pada tahap awal, lalu dikustomisasi bertahap untuk Artikel, Jurnal, dan Media.
- Admin terpisah dari Payload tidak dipilih karena akan menduplikasi autentikasi, permission, CRUD, upload, validation, revisions, dan error handling.

Fondasi yang dipertahankan:

- `CustomLogin`, `Logo`, dan `DashboardWidget` sebagai titik awal.
- Endpoint statistik dashboard dan collection `media`.
- Payload Lexical, localization, PostgreSQL, dan Vercel Blob.
- Help center dan interactive tour setelah selector-nya disesuaikan dengan UI baru.

Komponen yang perlu direstrukturisasi:

- `CustomNav` diganti sidebar berbasis konfigurasi dan capability.
- `DashboardClient` dipecah menjadi komponen kecil dan responsive.
- Inline style dan selector CSS global dipindahkan ke token serta style yang scoped.
- `ThemeForceProvider` dievaluasi untuk dihentikan agar theme policy tidak dipaksakan melalui observer.

## 2. Temuan audit utama

### Admin UI

- Dashboard, sidebar, login, logo, help center, dan theme sudah custom, tetapi list/editor masih dominan UI Payload.
- Sidebar belum menampilkan Media, Pesan Masuk, Subscriber, dan Jurnal.
- Active state sidebar hanya bekerja pada exact path, bukan halaman edit/detail.
- Sidebar fixed 280px dan belum mendukung rail tablet atau drawer mobile.
- Dashboard dan navigation menggunakan banyak inline style dan token yang berulang.
- CSS admin memakai selector luas dan banyak `!important`, sehingga rawan bentrok ketika Payload diperbarui.
- Dashboard belum memiliki error, retry, empty state, dan state autentikasi yang jelas.
- Login memiliki beberapa tautan placeholder dan fungsi remember-me yang belum aktif.

### Keamanan dan workflow

- Role hanya `admin` dan `member`, tetapi belum ada policy per capability.
- Beberapa endpoint admin menerima setiap user yang login tanpa memeriksa role.
- Artikel memiliki status draft/published, tetapi akses baca collection masih publik tanpa filter status.
- Detail artikel dapat menemukan draft jika slug diketahui.
- Policy Review belum memiliki status publikasi.
- UI yang menyembunyikan menu tidak boleh dianggap sebagai pengamanan; access control harus diterapkan pada collection, global, dan API.

### Artikel dan media

- Thumbnail artikel masih berupa field teks `imageUrl`.
- Collection `media` sudah mendukung gambar, PDF, thumbnail, card, dan ukuran tablet.
- Lexical sudah memiliki kemampuan upload; konfigurasi dan renderer perlu dibuat eksplisit serta diuji.
- Frontend artikel menggunakan `imageUrl` pada home, listing, detail, dan related content.
- Metadata artikel sudah mencoba membaca `featuredImage`, walaupun field tersebut belum ada.

### Jurnal

- Belum ada collection jurnal.
- Jurnal tidak ideal digabung sebagai kategori artikel karena membutuhkan metadata publikasi, PDF, banyak penulis, afiliasi, DOI/ISSN, volume, issue, halaman, dan citation.

## 3. Role dan capability target

| Capability | Editor | Reviewer | Admin | Super Admin |
|---|---:|---:|---:|---:|
| Membuat dan mengubah draft sendiri | Ya | Ya | Ya | Ya |
| Upload media | Ya | Ya | Ya | Ya |
| Mengirim konten untuk review | Ya | Ya | Ya | Ya |
| Memberi review dan approval | Tidak | Ya | Ya | Ya |
| Publish, schedule, dan archive | Tidak | Tidak | Ya | Ya |
| Mengelola pesan/subscriber | Tidak | Tidak | Ya | Ya |
| Mengelola setting website | Tidak | Tidak | Terbatas | Ya |
| Mengelola pengguna dan role | Tidak | Tidak | Tidak | Ya |

Predicate akses yang akan dibuat:

- `isSuperAdmin`
- `isAdmin`
- `canManageContent`
- `canEditOwnContent`
- `canReview`
- `canPublish`
- `canManageAudience`
- `canManageUsers`

## 4. Information architecture admin

```text
Dashboard

Konten
├── Artikel
├── Jurnal
├── Policy Review
├── Kategori
└── Media

Website
├── Beranda
├── Tentang Kami
├── Layanan
├── Tim
├── Mitra
├── Kontak
├── Navigasi
└── Footer

Audiens
├── Pesan Masuk
├── Subscriber
└── Lamaran (fase selanjutnya)

Sistem
├── Pengguna & Peran
├── Pengaturan Website
├── Bantuan
└── Lihat Website
```

Aturan navigation:

- Menu ditampilkan berdasarkan capability pengguna.
- Parent menu memiliki active state untuk seluruh child route.
- Badge hanya digunakan untuk pekerjaan yang perlu tindakan, seperti pesan baru atau konten review.
- Desktop memakai sidebar 264px, tablet memakai icon rail, dan mobile memakai drawer.
- Profile, role, bantuan, dan logout ditempatkan di bagian bawah sidebar.

## 5. Wireframe dashboard

```text
┌ Sidebar ───────────────┬────────────────────────────────────────────────────┐
│ Mahaga Admin           │ Selamat pagi, [Nama]                  [Lihat situs] │
│ Dashboard              │ Kelola publikasi dan aktivitas website hari ini.   │
│                        │                                                    │
│ KONTEN                 │ [+ Artikel] [+ Jurnal] [Upload Media] [Pesan Masuk]│
│  Artikel               │                                                    │
│  Jurnal                │ [Artikel] [Jurnal Review] [Pesan Baru] [Media]     │
│  Policy Review         │                                                    │
│  Kategori              │ [Grafik Aktivitas 30 Hari] [Perlu Perhatian]       │
│  Media                 │                                                    │
│                        │ [Konten Terbaru]          [Aktivitas Terbaru]       │
│ WEBSITE                │                                                    │
│ AUDIENS                │                                                    │
│ [avatar] Nama / Role   │                                                    │
│ Bantuan | Keluar       │                                                    │
└────────────────────────┴────────────────────────────────────────────────────┘
```

Setiap widget wajib memiliki loading, empty, error, dan retry state.

## 6. Wireframe list konten

```text
Konten / Artikel                                      [+ Artikel Baru]

[Cari judul/slug........] [Status] [Kategori] [Bahasa] [Tanggal] [Reset]

□ Cover  Judul               Kategori    Penulis  Status      Diperbarui  ⋯
□ [img]  Transformasi ...    Bisnis      Reza     Published   19 Jul      Edit
□ [img]  Strategi ...        Pemerintah  Fira     In Review   18 Jul      Preview
□ [--]   Tanpa cover         Umum        Reza     Draft       16 Jul      Duplicate

[Bulk action]                                  1–20 dari 87   < 1 2 3 >
```

List jurnal menggunakan pola yang sama dengan kolom Penulis, Tahun, Volume/Issue, PDF, dan Status.

## 7. Wireframe editor

```text
← Kembali     Artikel Baru      Draft tersimpan 2 menit lalu
                       [Preview] [Simpan Draft] [Kirim Review] [Publish]

[Konten] [Media] [Metadata] [SEO] [Publikasi]

Judul        [................................................]
Slug         /artikel/judul-artikel
Ringkasan    [................................................]
Isi          [Rich text: H2 B I Link Quote List Image Upload]

                              [Status, Penulis, Kategori, Jadwal Publish]
```

Tab editor:

- Konten: judul, excerpt/abstrak, isi, penulis.
- Media: featured image/cover, alt, caption, credit, dan PDF jurnal.
- Metadata: kategori, tag, bahasa, DOI, ISSN, volume, issue, halaman, tahun, dan afiliasi.
- SEO: meta title, description, canonical, social image, dan snippet preview.
- Publikasi: status, schedule, reviewer, catatan review, dan history.

## 8. Schema artikel target

Field baru:

```text
featuredImage -> media
excerpt (localized)
imageCaption (localized, optional)
imageCredit (optional)
status editorial
review metadata
SEO metadata
```

`imageUrl` dipertahankan sementara sebagai legacy fallback. Resolver media bersama digunakan di Home, list, detail, related content, dan metadata:

```text
featuredImage.sizes.card.url
→ featuredImage.url
→ imageUrl
→ placeholder
```

## 9. Inline image dalam artikel

- Gunakan Upload Feature pada Payload Lexical dengan collection `media`.
- Hindari mendaftarkan Upload Feature dua kali karena fitur tersebut sudah tersedia dalam default editor.
- Renderer khusus menghasilkan `<figure>`, responsive image, `<figcaption>`, alt text, dan fallback.
- File non-image dirender sebagai link download aman.
- Featured image hanya menerima gambar; dokumen jurnal hanya menerima PDF.
- Alt text wajib atau minimal menghasilkan validation warning yang jelas.

## 10. Schema jurnal target

Collection: `journals`

```text
Konten
- title* (localized)
- abstract* (localized rich text)
- content (localized rich text)
- keywords[] (localized)

Publikasi
- slug*
- status*
- publishedAt
- scheduledAt
- coverImage -> media
- document -> media (PDF)
- language
- publicationYear
- volume
- issue
- pages
- doi
- issn

Kontributor
- authors[]: name*, affiliation, public profile/email optional
- reviewedBy -> users
- reviewNotes

Klasifikasi dan SEO
- category -> categories
- metaTitle
- metaDescription
- canonicalUrl
- ogImage -> media
```

Authors dibuat sebagai embedded array karena penulis jurnal dapat berasal dari luar organisasi.

## 11. Workflow editorial

```text
draft
→ in_review
→ revision_requested
→ approved
→ scheduled
→ published
→ archived
```

Aturan utama:

- Hanya konten `published` dengan tanggal terbit tidak melebihi waktu sekarang yang dapat dibaca publik.
- Filter berlaku pada halaman publik, sitemap, related content, metadata, dan API publik.
- `publishedAt` diisi otomatis ketika dipublikasikan.
- Editor tidak dapat publish; reviewer tidak dapat mengelola pengguna; admin tidak otomatis menjadi super admin.
- Auto-translation tidak boleh mengubah status publikasi dan tidak dijalankan tanpa batas pada setiap perubahan kecil.

## 12. Strategi migrasi imageUrl

1. Tambahkan `featuredImage` tanpa menghapus `imageUrl`.
2. Terapkan resolver fallback di seluruh frontend.
3. Inventaris semua artikel dan seed data yang masih memakai URL.
4. Migrasikan URL ke media library hanya jika lisensi dan attribution mengizinkan.
5. Simpan log sukses/gagal dan isi alt text.
6. QA card, detail, related content, Open Graph, serta kedua locale.
7. Pertahankan fallback selama satu periode rilis.
8. Hapus `imageUrl` setelah audit menunjukkan nol referensi.

## 13. Design tokens dan komponen

Token dipusatkan dan memakai prefix `--admin-*` untuk brand, canvas, surface, text, muted, border, state color, spacing, radius, shadow, dan focus ring.

Komponen target:

- `AdminShell`, `Sidebar`, `MobileNavDrawer`, `TopBar`, `UserMenu`
- `PageHeader`, `Breadcrumb`, `QuickAction`, `EmptyState`
- `MetricCard`, `StatusBadge`, `ActivityFeed`, `AttentionPanel`
- `ContentTable`, `FilterBar`, `BulkActionBar`, `Pagination`
- `EditorTabs`, `EditorActionBar`, `PublicationPanel`, `AutosaveStatus`
- `MediaPickerModal`, `MediaGrid`, `MediaCard`, `UploadDropzone`, `MediaPreviewPanel`
- `ConfirmDialog`, `InlineAlert`, dan `Skeleton`

## 14. Backlog implementasi

### Sprint 1 — Media dan keamanan publikasi

1. Buat capability helpers dan role schema.
2. Lindungi API/collection/global berdasarkan role.
3. Pastikan draft tidak dapat dibaca publik.
4. Tambahkan `featuredImage` dan resolver fallback.
5. Update Home, list, detail, related content, dan metadata.
6. Aktifkan serta uji inline image Lexical.
7. Tambahkan renderer image responsive.
8. Generate Payload types/import map dan jalankan QA.

### Sprint 2 — Jurnal

1. Tambahkan collection `journals`.
2. Tambahkan PDF validation dan cover upload.
3. Tambahkan workflow/status jurnal.
4. Tambahkan halaman list/detail per locale.
5. Tambahkan sitemap, SEO `ScholarlyArticle`, dan statistik dashboard.

### Sprint 3 — Admin shell v2

1. Tambahkan design tokens dan komponen UI dasar.
2. Ganti sidebar dengan navigation berbasis capability.
3. Buat tablet rail dan mobile drawer.
4. Refactor dashboard menjadi komponen reusable.
5. Tambahkan state loading/error/empty/retry.
6. Perbaiki branding login dan hapus tautan placeholder.

### Sprint 4 — Editorial experience

1. Custom cell/list untuk Artikel dan Jurnal.
2. Filter, search, status badge, preview, duplicate, dan bulk action.
3. Editor tabs, sticky action bar, preview, dan review notes.
4. Media picker dan upload dropzone.
5. Accessibility dan responsive QA.

## 15. Acceptance criteria implementasi

- Editor dapat upload atau memilih featured image tanpa memasukkan URL.
- Artikel lama tetap menampilkan `imageUrl` selama migrasi.
- Inline image tampil di editor dan frontend secara responsive dengan alt text.
- Featured image konsisten pada home, list, detail, related content, dan social metadata.
- Jurnal memiliki cover, PDF, abstrak, multi-penulis, metadata publikasi, dan workflow.
- Draft, scheduled, dan archived tidak dapat diakses melalui frontend atau API publik.
- Navigation admin menyesuaikan role serta mendukung desktop, tablet, dan mobile.
- Dashboard memiliki loading, empty, error, retry, dan permission-aware state.
- Semua aksi icon-only memiliki `aria-label`, fokus keyboard terlihat, dan kontras minimal WCAG AA.
- Payload types dan import map digenerate ulang; typecheck/build serta uji manual upload harus lulus.

## 16. Risiko dan mitigasi

| Risiko | Mitigasi |
|---|---|
| CSS internal Payload berubah saat upgrade | Gunakan extension point resmi dan style scoped. |
| UI menyembunyikan menu tetapi API tetap terbuka | Terapkan capability pada backend, bukan hanya UI. |
| Artikel lama kehilangan gambar | Pertahankan `imageUrl` dan resolver fallback. |
| Migrasi gambar eksternal melanggar lisensi | Audit sumber/lisensi sebelum upload internal. |
| PDF tercampur dengan featured image | Validasi MIME sesuai field atau pisahkan document media bila diperlukan. |
| Import map tertimpa | Generate melalui script resmi; jangan edit file generated manual. |
| Database schema berubah langsung di production | Gunakan migration terkontrol, backup, dan dry-run; jangan mengandalkan `db.push`. |
| Auto-translation memicu loop/status tidak sengaja | Batasi hook berdasarkan locale, operation, dan status. |

## 17. Definition of Ready untuk Sprint 1

- Role final disetujui: Editor, Reviewer, Admin, Super Admin.
- Jurnal disetujui sebagai collection terpisah.
- Kebijakan file disetujui: tipe, ukuran maksimum, dan storage.
- Desain IA serta wireframe admin disetujui.
- Database staging/backup tersedia untuk migrasi.
- Keputusan mengenai dark mode dan sumber font admin dibuat.

