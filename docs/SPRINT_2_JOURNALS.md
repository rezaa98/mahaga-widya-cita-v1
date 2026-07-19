# Sprint 2 — Jurnal dan Publikasi

Status: Selesai  
Tanggal: 19 Juli 2026

## Scope

- Collection Jurnal di Payload CMS.
- Cover image dan dokumen PDF dari Media Library.
- Metadata akademik, penulis, afiliasi, DOI, ISSN, volume, issue, dan halaman.
- Workflow editorial dan role enforcement.
- Daftar/detail jurnal multibahasa.
- Search, filter, pagination, citation, related journals, dan PDF download.
- SEO metadata dan `ScholarlyArticle` JSON-LD.
- Integrasi admin navigation, dashboard, sitemap, dan public navigation.

## Strategi multi-agent hemat token

1. Sol menjadi orchestrator dan hanya menangani integrasi, review lintas-file, dan verifikasi akhir.
2. Schema, frontend, dan integrasi admin diberikan kepada agent berbeda dengan kepemilikan file yang tidak tumpang tindih.
3. Agent tidak mengulang audit Sprint 1 dan hanya membaca file dalam scope tugas.
4. Terra reasoning rendah digunakan untuk pekerjaan schema/UI yang terdefinisi jelas.
5. Reasoning tinggi hanya digunakan jika ada integrasi lintas-route, SEO, atau masalah type yang kompleks.
6. Payload types dibuat satu kali setelah schema, kemudian satu kali pada finalisasi.
7. Typecheck dan build penuh dilakukan terpusat agar hasil/error tidak dianalisis berulang oleh semua agent.
8. Hasil agent dilaporkan sebagai perubahan dan error saja, bukan menyalin seluruh source code.

## Model pembagian kerja berikutnya

```text
Orchestrator (Sol)
├── Agent schema/access        — collection, hooks, permission
├── Agent frontend             — route, UI, locale, SEO
└── Agent integration ringan   — nav, dashboard, sitemap
```

Untuk sprint selanjutnya, gunakan maksimal tiga agent dan hindari agent tambahan jika pekerjaan dapat diselesaikan orchestrator dalam satu patch kecil.

## Acceptance criteria

- Jurnal hanya dapat dipublikasikan oleh Admin/Super Admin.
- Editor dapat membuat draft dan mengirim review.
- Reviewer dapat menyetujui atau meminta revisi tanpa mengubah isi.
- PDF wajib berformat `application/pdf`.
- Jurnal draft tidak muncul pada frontend atau sitemap.
- Link mempertahankan locale aktif.
- Daftar jurnal memiliki search, filter kategori/tahun, dan pagination.
- Detail memiliki cover, abstrak, penulis, metadata, citation, PDF, dan related journals.
- Dashboard dan navigation admin memuat Jurnal sesuai capability.
- Generated types, import map, TypeScript, diff check, dan production build lulus.

## Verifikasi

- `npm run generate:types`: lulus.
- `npm run generate:importmap`: lulus.
- `npx tsc --noEmit`: lulus.
- `git diff --check`: lulus.
- Registration test collection `journals`: lulus.
- Capability matrix test: lulus.
- `next build --webpack`: lulus.

Turbopack tetap dapat menggantung pada environment proyek. Script build menggunakan Webpack sampai penyebab Turbopack selesai diinvestigasi.
