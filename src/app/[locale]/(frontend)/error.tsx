'use client'

import { useEffect } from 'react'

export default function FrontendError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[Frontend Error Boundary]', error)
  }, [error])

  return (
    <html lang="id">
      <body>
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #f8f9fa 0%, #e8eef7 100%)',
            fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
            padding: '2rem',
          }}
        >
          <div
            style={{
              maxWidth: 520,
              textAlign: 'center',
              background: '#fff',
              borderRadius: 20,
              padding: 'clamp(2rem, 5vw, 3rem)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.06)',
            }}
          >
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                fontSize: 32,
              }}
            >
              ⚠️
            </div>
            <h1
              style={{
                fontSize: 'clamp(1.25rem, 3vw, 1.75rem)',
                color: '#1a2b4c',
                marginBottom: '0.75rem',
                fontWeight: 700,
              }}
            >
              Terjadi Kesalahan
            </h1>
            <p
              style={{
                color: '#64748b',
                lineHeight: 1.6,
                marginBottom: '2rem',
                fontSize: '0.95rem',
              }}
            >
              Maaf, halaman ini sedang mengalami gangguan sementara. Tim kami sedang
              menangani masalah ini. Silakan coba muat ulang atau kembali nanti.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={reset}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: 10,
                  border: 'none',
                  background: 'linear-gradient(135deg, #1a4fd4, #2563eb)',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'transform 0.15s, box-shadow 0.15s',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)'
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(37,99,235,0.3)'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                Muat Ulang
              </button>
              <a
                href="/"
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: 10,
                  border: '1px solid #e2e8f0',
                  background: '#fff',
                  color: '#475569',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  textDecoration: 'none',
                  transition: 'background 0.15s',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = '#f8fafc'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = '#fff'
                }}
              >
                Kembali ke Beranda
              </a>
            </div>
            {error.digest && (
              <p style={{ color: '#94a3b8', fontSize: '0.75rem', marginTop: '1.5rem' }}>
                Kode error: {error.digest}
              </p>
            )}
          </div>
        </div>
      </body>
    </html>
  )
}
