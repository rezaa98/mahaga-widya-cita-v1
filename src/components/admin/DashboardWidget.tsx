import React from 'react'

export const DashboardWidget: React.FC = () => {
  return (
    <div
      style={{
        padding: '2rem',
        background: 'linear-gradient(135deg, #1E6FD9 0%, #0B2D6B 100%)',
        borderRadius: '12px',
        color: '#fff',
        marginBottom: '2rem',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}
    >
      <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>
        Selamat Datang di Mahaga Widya Cita CMS! 👋
      </h1>
      <p style={{ margin: 0, fontSize: '1.1rem', opacity: 0.9, lineHeight: 1.6 }}>
        Platform Manajemen Konten (CMS) ini dirancang khusus untuk mempermudah Anda dalam mengelola 
        seluruh isi website PT Mahaga Widya Cita. Anda dapat memperbarui <strong>Artikel</strong>, 
        menambah <strong>Layanan Baru</strong>, mengatur <strong>Tim & Pakar</strong>, hingga melihat 
        daftar pelanggan yang mendaftar (Leads).
      </p>

      <div style={{ marginTop: '1rem', background: 'rgba(255,255,255,0.1)', padding: '1.5rem', borderRadius: '8px' }}>
        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem' }}>📌 Panduan Cepat (Quick Start)</h3>
        <ul style={{ margin: 0, paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          <li>
            <strong>Membuat Artikel / Berita:</strong> Buka menu <a href="/admin/collections/articles" style={{color: '#D4AF37', textDecoration: 'underline'}}>Articles</a> di bilah kiri, lalu klik tombol "Create New". Jangan lupa set status ke <em>Published</em> agar tampil di web.
          </li>
          <li>
            <strong>Mengubah Layanan:</strong> Menu <a href="/admin/collections/services" style={{color: '#D4AF37', textDecoration: 'underline'}}>Services</a> sudah kami kelompokkan menggunakan sistem "Tab" (Informasi Dasar, Tampilan, dll) agar lebih mudah dan tidak panjang ke bawah.
          </li>
          <li>
            <strong>Keamanan & Akses:</strong> Pastikan Anda menggunakan kata sandi yang kuat. Hindari menghapus konten lama jika masih relevan, cukup ubah statusnya menjadi <em>Draft</em>.
          </li>
        </ul>
      </div>
    </div>
  )
}
