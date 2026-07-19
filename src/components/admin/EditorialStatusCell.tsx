'use client'

import React from 'react'

const STATUS_CONFIG: Record<string, { label: string; bg: string; color: string; icon: string; tip: string }> = {
  draft: {
    label: 'Draft',
    bg: '#f1f5f9',
    color: '#475569',
    icon: 'edit_note',
    tip: 'Konten sedang ditulis dan belum dikirim untuk review.',
  },
  in_review: {
    label: 'Menunggu Review',
    bg: '#fef3c7',
    color: '#92400e',
    icon: 'rate_review',
    tip: 'Konten sedang ditinjau oleh reviewer.',
  },
  revision_requested: {
    label: 'Perlu Revisi',
    bg: '#fee2e2',
    color: '#991b1b',
    icon: 'feedback',
    tip: 'Reviewer meminta perubahan sebelum disetujui.',
  },
  approved: {
    label: 'Disetujui',
    bg: '#d1fae5',
    color: '#065f46',
    icon: 'check_circle',
    tip: 'Konten disetujui dan siap untuk dipublikasikan oleh admin.',
  },
  scheduled: {
    label: 'Terjadwal',
    bg: '#dbeafe',
    color: '#1e40af',
    icon: 'schedule',
    tip: 'Konten dijadwalkan untuk dipublikasikan secara otomatis.',
  },
  published: {
    label: 'Published',
    bg: '#dcfce7',
    color: '#166534',
    icon: 'public',
    tip: 'Konten sudah dipublikasikan dan dapat diakses publik.',
  },
  archived: {
    label: 'Diarsipkan',
    bg: '#f3f4f6',
    color: '#6b7280',
    icon: 'inventory_2',
    tip: 'Konten diarsipkan dan tidak ditampilkan di website.',
  },
}

const DEFAULT_STATUS = {
  label: 'Unknown',
  bg: '#f3f4f6',
  color: '#6b7280',
  icon: 'help',
  tip: '',
}

export const EditorialStatusCell: React.FC<any> = ({ cellData }) => {
  const status = typeof cellData === 'string' ? cellData : ''
  const config = STATUS_CONFIG[status] || DEFAULT_STATUS

  return (
    <span
      className="mwc-status-badge"
      title={config.tip}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        padding: '4px 10px',
        borderRadius: 100,
        fontSize: 12,
        fontWeight: 600,
        lineHeight: 1,
        background: config.bg,
        color: config.color,
        whiteSpace: 'nowrap',
        cursor: config.tip ? 'help' : 'default',
      }}
    >
      <span
        aria-hidden
        className="material-symbols-outlined"
        style={{ fontSize: 15, lineHeight: 1 }}
      >
        {config.icon}
      </span>
      {config.label}
    </span>
  )
}
