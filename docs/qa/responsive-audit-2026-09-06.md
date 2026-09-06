# Audit responsivitas — 6 September 2026

Audit dilakukan pada preview lokal, menggunakan browser dengan ukuran viewport CSS. Hasil ini bukan pengujian langsung Safari pada perangkat iPad fisik dan bukan pengukuran performa produksi.

## Cakupan

Viewport utama: mobile 390 × 844, tablet 820 × 1048 sesuai perangkat pengguna, desktop 1440 × 900. Pemeriksaan tambahan pada mobile 320 × 640, landscape tablet 1180 × 688, dan batas menu desktop 1200 × 900.

Halaman yang diperiksa untuk lebar dokumen dan posisi konten utama pada ketiga viewport:

| Halaman                                                                         | Mobile                     | Tablet                          | Desktop                    |
| ------------------------------------------------------------------------------- | -------------------------- | ------------------------------- | -------------------------- |
| Home `/id`                                                                      | Tidak ada overflow dokumen | Tidak ada overflow dokumen      | Tidak ada overflow dokumen |
| Profil `/id/tentang-kami`                                                       | Tidak ada overflow dokumen | Tidak ada overflow dokumen      | Tidak ada overflow dokumen |
| Layanan `/id/layanan`                                                           | Tidak ada overflow dokumen | Tidak ada overflow dokumen      | Tidak ada overflow dokumen |
| Artikel `/id/artikel`                                                           | Tidak ada overflow dokumen | Tidak ada overflow dokumen      | Tidak ada overflow dokumen |
| Kontak `/id/kontak`                                                             | Tidak ada overflow dokumen | Form terlalu sempit; diperbaiki | Tidak ada overflow dokumen |
| Tim `/id/tim`                                                                   | Tidak ada overflow dokumen | Tidak ada overflow dokumen      | Tidak ada overflow dokumen |
| Mitra `/id/mitra`                                                               | Tidak ada overflow dokumen | Tidak ada overflow dokumen      | Tidak ada overflow dokumen |
| Karir `/id/karir`                                                               | Tidak ada overflow dokumen | Tidak ada overflow dokumen      | Tidak ada overflow dokumen |
| Detail layanan `/id/layanan/research-strategic-studies`                         | Tidak ada overflow dokumen | Tidak ada overflow dokumen      | Tidak ada overflow dokumen |
| Detail artikel `/id/artikel/masa-depan-smart-city-lebih-dari-sekadar-teknologi` | Terlalu padat; diperbaiki  | Tidak ada overflow dokumen      | Tidak ada overflow dokumen |

Pemeriksaan visual terfokus dilakukan pada header/menu, hero Home, form kontak tablet, detail artikel mobile/tablet, dan panel menu landscape. Pemeriksaan geometri bukan jaminan semua interaksi setiap halaman sudah diuji. Konten carousel Home yang berada di luar viewport berasal dari area scroll internal, bukan pelebaran dokumen.

## Temuan dan perubahan

### 1. Menu mobile panjang dan hierarki lemah — diperbaiki

Semua submenu sebelumnya ditampilkan sekaligus dengan awalan panah teks. Pada layar 390 × 844, pengguna harus menggulir daftar sebelum mencapai Kontak dan Masuk. Nama grup dan tautan anak terlihat hampir sama, sehingga sulit dipindai.

Diganti dengan panel putih bersudut membulat di atas latar redup. Lima tujuan utama langsung tersedia: Beranda, Tentang Kami, Layanan, Artikel, Kontak. Submenu memakai tombol expand terpisah dari tautan halaman induk; hanya satu grup terbuka pada satu waktu. Status halaman aktif diberi warna. CTA Hubungi Tim Kami dan pilihan bahasa tersedia tanpa membuka semua submenu.

### 2. Pilihan bahasa hilang pada mobile — diperbaiki

Pemilih bahasa sebelumnya hanya berada di navigasi desktop yang disembunyikan pada mobile. Panel baru menyediakan ID/EN dengan status pilihan yang dapat dibaca teknologi bantu. Perpindahan dari `/id/kontak` ke `/en/kontak` berhasil diuji.

### 3. Interaksi modal dan keyboard — diperbaiki

Panel menggunakan Dialog yang tersedia di dependensi proyek. Fokus masuk ke tombol tutup, Tab tetap berada di panel, Escape menutup panel, dan fokus kembali ke tombol pembuka. Scroll halaman latar terkunci selama panel terbuka. Panel memiliki area scroll sendiri serta footer bahasa/login yang tetap terlihat. Semua tautan/tombol yang diukur pada panel memiliki tinggi sedikitnya 44 piksel.

Animasi masuk singkat dan dinonaktifkan saat pengguna memilih reduced motion. Safe-area dan tinggi viewport dinamis digunakan dalam CSS, tetapi perilaku toolbar Safari dan keyboard virtual belum diuji pada perangkat fisik.

### 4. Tablet landscape berpindah ke menu berbasis hover — diperbaiki

Breakpoint lama 1024 piksel membuat tablet landscape 1180 piksel memakai menu desktop. Batas panel sekarang sampai 1199 piksel; navigasi desktop mulai 1200. Pada 1180, panel dapat dibuka. Ketika viewport berubah menjadi 1200, panel tertutup dan scroll lock dilepas. Ini menjaga akses submenu tablet melalui tap.

### 5. Form kontak tablet terlalu padat — diperbaiki

Pada 820 piksel, halaman sebelumnya masih memakai dua kolom utama, sementara form di kolom kiri kembali dibagi dua. Lebar input sekitar 160 piksel, membuat placeholder terpotong. Kolom utama kini ditumpuk sampai 1024 piksel. Pada 820, form memiliki lebar sekitar 766 piksel dan input dua kolom sekitar 336 piksel. Pada mobile, input tetap satu kolom. Layout desktop tetap dua kolom utama.

### 6. Artikel mobile terlalu sempit dan tinggi — diperbaiki

Card sebelumnya memiliki padding 40 piksel, judul 40 piksel, serta gambar dengan tinggi tetap 400 piksel. Judul contoh menjadi lima baris pada mobile dan gambar mendominasi viewport.

Padding mobile kini 24 piksel vertikal dan 20 piksel horizontal. Judul mengikuti ukuran layar melalui clamp. Cover memakai rasio 16:10 pada mobile. Metadata dapat membungkus dan heading artikel terkait juga bisa membungkus. Hasil visual contoh pada 390 piksel menunjukkan judul lebih ringkas dan teks artikel lebih cepat tercapai.

### 7. Header pada mobile kecil — diperbaiki

Logo dan nama perusahaan diberi ukuran khusus pada lebar hingga 480 piksel, gap header diperkecil, dan logo dapat menyusut secara terkontrol. Pada lebar 320 piksel, nama perusahaan serta tombol menu tetap berada dalam viewport tanpa overlap horizontal.

## Catatan yang masih relevan

- Tidak ditemukan anomali overflow dokumen pada 30 kombinasi halaman/viewport yang diperiksa. Ini tidak berarti seluruh konten CMS atau seluruh browser bebas masalah.
- Carousel layanan Home memakai scroll horizontal dan scrollbar tersembunyi. Ini adalah pola yang disengaja, tetapi kemudahan pengguna menyadari bahwa ada kartu lain tetap perlu evaluasi tersendiri.
- Sejumlah foto tim tidak tersedia di penyimpanan lokal dan menghasilkan respons 500 saat preview. Ini masalah aset lingkungan lokal; tampilan foto produksi belum diverifikasi dalam audit ini.
- Beberapa teks Inggris pada halaman Kontak masih menyebut waktu respons 1×24 jam. Ini konsistensi konten, bukan masalah breakpoint, dan tidak diubah dalam pekerjaan responsivitas ini.
- Pengujian keyboard virtual iOS, pembesaran teks sistem, Safari fisik, seluruh artikel/layanan, dan waktu navigasi produksi belum dilakukan.

## Validasi

- ESLint untuk komponen navigasi dan halaman artikel yang diubah: lulus.
- TypeScript `tsc --noEmit`: lulus.
- `git diff --check`: lulus.
- Uji browser: buka/tutup, accordion, Escape, focus trap, pemulihan fokus, scroll lock, tautan Kontak, pemilih bahasa, mobile kecil, landscape tablet, dan transisi ke desktop.
