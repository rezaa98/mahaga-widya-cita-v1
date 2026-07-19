# Sprint 3 — Custom Admin Shell dan Editorial UX

Status: Selesai  
Tanggal: 19 Juli 2026

## Perubahan

- Sidebar admin berbasis capability dengan active child route.
- Desktop sidebar 264px, tablet rail 76px, dan mobile drawer.
- Escape, overlay, focus labels, `aria-current`, dan `aria-expanded`.
- Profile/role pengguna, bantuan, logout, dan shortcut website.
- Dashboard dipecah menjadi metric card, attention panel, activity list, quick action, skeleton, empty state, error, dan retry.
- Dashboard responsive dengan namespace CSS `.mwc-*`.
- Artikel dan jurnal memiliki thumbnail/cover pada list, status badge reusable, preview URL, dan deskripsi workflow pada editor.
- Import map Payload diperbarui untuk status cell.

## Strategi hemat token

- Tiga agent dengan kepemilikan file terpisah: shell, dashboard, editorial.
- Tidak membangun ulang CRUD Payload; hanya memanfaatkan extension point dan field components.
- Tidak mengulang audit data model Sprint 1–2.
- Setiap agent menjalankan typecheck ringan; orchestrator menjalankan generator dan build satu kali.
- Perubahan kecil lintas workstream ditangani orchestrator setelah review, bukan membuka agent tambahan.

## Verifikasi

- `npm run generate:types`: lulus.
- `npm run generate:importmap`: lulus.
- `npx tsc --noEmit`: lulus.
- `git diff --check`: lulus.
- `npm run build` menggunakan Webpack: lulus.

## Catatan

Payload tetap menjadi engine CRUD/auth. Custom UI berikutnya dapat difokuskan pada media picker dan filter list jika kebutuhan editor menunjukkan volume konten sudah cukup besar.
