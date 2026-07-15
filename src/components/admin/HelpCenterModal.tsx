'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export const HelpCenterModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const router = useRouter()

  if (!isOpen) return null

  const tutorials = [
    {
      id: 'beranda',
      title: '🏠 Cara Edit Beranda',
      desc: 'Panduan mengelola teks Hero, Statistik, dan Mitra.',
      path: '/admin/globals/beranda'
    },
    {
      id: 'layanan',
      title: '🛠️ Cara Tambah Layanan',
      desc: 'Pelajari cara menambah dan mengedit Layanan baru.',
      path: '/admin/collections/services'
    },
    {
      id: 'artikel',
      title: '✍️ Cara Menulis Artikel',
      desc: 'Panduan membuat, menerjemahkan, dan mempublikasikan Artikel.',
      path: '/admin/collections/articles/create'
    },
    {
      id: 'tim',
      title: '👥 Cara Mengelola Tim',
      desc: 'Cara menambah anggota tim atau profil direksi.',
      path: '/admin/globals/tentang-kami' // Tim currently managed in Tentang Kami
    },
    {
      id: 'tentangkami',
      title: '🏢 Cara Edit Tentang Kami',
      desc: 'Panduan mengelola Visi, Misi, dan profil perusahaan.',
      path: '/admin/globals/tentang-kami'
    }
  ]

  const handleSelectTutorial = (path: string) => {
    onClose()
    // Navigate with a query param to trigger the tour on load
    router.push(`${path}?tour=1`)
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backdropFilter: 'blur(4px)'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        width: '90%',
        maxWidth: '600px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
        fontFamily: 'sans-serif'
      }}>
        <div style={{
          padding: '24px',
          borderBottom: '1px solid #eee',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{ margin: 0, fontSize: '20px', color: '#333' }}>Pusat Bantuan & Tutorial</h2>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#999'
          }}>&times;</button>
        </div>

        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p style={{ margin: '0 0 8px 0', color: '#666' }}>Pilih topik panduan interaktif yang ingin Anda pelajari hari ini:</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
            {tutorials.map(tut => (
              <div 
                key={tut.id}
                onClick={() => handleSelectTutorial(tut.path)}
                style={{
                  padding: '16px',
                  border: '1px solid #eaeaea',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  background: '#fafafa'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = '#1e6fd9'
                  e.currentTarget.style.background = '#f0f6ff'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = '#eaeaea'
                  e.currentTarget.style.background = '#fafafa'
                }}
              >
                <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#222' }}>{tut.title}</h3>
                <p style={{ margin: 0, fontSize: '14px', color: '#666', lineHeight: 1.4 }}>{tut.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
