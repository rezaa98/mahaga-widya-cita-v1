'use client'
import React, { useState, useEffect } from 'react'
import { driver } from 'driver.js'
import 'driver.js/dist/driver.css'
import { usePathname } from 'next/navigation'

export const InteractiveHelpWidget: React.FC = () => {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const startTour = () => {
    // Basic tour logic based on current page
    let steps: any[] = []

    if (pathname === '/admin') {
      steps = [
        {
          element: 'nav.nav',
          popover: {
            title: 'Selamat Datang di Admin Panel!',
            description: 'Di sinilah Anda mengelola seluruh konten website Mahaga Widya Cita. Mari kita lihat cara menambahkan artikel.',
            side: "right", align: 'start'
          }
        },
        {
          element: 'a[href="/admin/collections/articles"]',
          popover: {
            title: 'Menu Artikel',
            description: 'Klik menu "Articles" ini untuk melihat daftar artikel. (Silakan klik sekarang untuk berpindah halaman).',
            side: "right", align: 'start'
          }
        }
      ]
    } else if (pathname === '/admin/collections/articles') {
      steps = [
        {
          popover: {
            title: 'Daftar Artikel',
            description: 'Ini adalah halaman daftar artikel yang sudah terbit atau tersimpan di sistem.',
          }
        },
        {
          element: 'a[href="/admin/collections/articles/create"]',
          popover: {
            title: 'Buat Artikel Baru',
            description: 'Klik tombol "Create New" ini untuk mulai menulis artikel baru.',
            side: "bottom", align: 'start'
          }
        }
      ]
    } else if (pathname === '/admin/collections/articles/create' || pathname.startsWith('/admin/collections/articles/')) {
      steps = [
        {
          element: 'input[name="title"]',
          popover: {
            title: 'Judul Artikel',
            description: 'Tulis judul artikel Anda di sini.',
            side: "bottom", align: 'start'
          }
        },
        {
          element: 'button[title="Locale"]',
          popover: {
            title: 'Pilih Bahasa',
            description: 'Penting! Gunakan dropdown ini untuk berpindah ke bahasa Indonesia atau Inggris untuk meninjau hasil terjemahan.',
            side: "left", align: 'start'
          }
        },
        {
          element: 'button#action-save',
          popover: {
            title: 'Simpan / Terbitkan',
            description: 'Setelah selesai, klik tombol ini untuk mempublikasikan artikel Anda.',
            side: "left", align: 'start'
          }
        }
      ]
    } else {
      steps = [
        {
          popover: {
            title: 'Bantuan Interaktif',
            description: 'Buka menu Artikel untuk memulai tutorial terpandu cara menambahkan konten!',
          }
        }
      ]
    }

    const driverObj = driver({
      showProgress: true,
      animate: true,
      steps: steps,
      nextBtnText: 'Lanjut',
      prevBtnText: 'Kembali',
      doneBtnText: 'Selesai',
    });

    driverObj.drive();
  }

  if (!mounted) return null

  return (
    <div style={{ padding: '1rem' }}>
      <button 
        onClick={startTour}
        style={{
          width: '100%',
          background: 'linear-gradient(135deg, #1e6fd9 0%, #1555a8 100%)',
          color: 'white',
          border: 'none',
          padding: '0.75rem',
          borderRadius: '8px',
          fontWeight: 'bold',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          boxShadow: '0 4px 12px rgba(30, 111, 217, 0.3)',
          transition: 'transform 0.2s ease',
        }}
        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <span style={{ fontSize: '18px' }}>💡</span> 
        Mulai Tutorial Web
      </button>
    </div>
  )
}
