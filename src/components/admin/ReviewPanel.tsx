'use client'

import React from 'react'
import { useFormFields } from '@payloadcms/ui'

/**
 * Compact review notes display shown in the article/journal sidebar when the
 * document is in a review-related status. Makes the notes more prominent and
 * visually connected to the editorial workflow.
 */
export const ReviewPanel: React.FC = () => {
  const statusField = useFormFields(([fields]) => fields.status)
  const reviewNotesField = useFormFields(([fields]) => fields.reviewNotes)

  const currentStatus = (statusField?.value as string) || 'draft'
  const reviewNotes = (reviewNotesField?.value as string) || ''

  // Only show when relevant
  const showPanel = ['in_review', 'revision_requested', 'approved'].includes(currentStatus)
  if (!showPanel) return null

  const statusConfig: Record<string, { label: string; icon: string; borderColor: string }> = {
    in_review: { label: 'Dalam Review', icon: 'rate_review', borderColor: '#f59e0b' },
    revision_requested: { label: 'Revisi Diperlukan', icon: 'feedback', borderColor: '#ef4444' },
    approved: { label: 'Disetujui', icon: 'check_circle', borderColor: '#10b981' },
  }

  const config = statusConfig[currentStatus] || statusConfig.in_review

  return (
    <div
      className="mwc-review-panel"
      style={{
        margin: '16px 0',
        padding: 16,
        borderRadius: 10,
        border: `2px solid ${config.borderColor}`,
        background: '#fafbfc',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: reviewNotes ? 12 : 0,
          fontWeight: 600,
          fontSize: 13,
          color: config.borderColor,
        }}
      >
        <span className="material-symbols-outlined" aria-hidden style={{ fontSize: 18 }}>
          {config.icon}
        </span>
        {config.label}
      </div>
      {reviewNotes && (
        <div
          style={{
            fontSize: 13,
            lineHeight: 1.55,
            color: '#475569',
            whiteSpace: 'pre-wrap',
            padding: '10px 12px',
            background: '#fff',
            borderRadius: 6,
            border: '1px solid #e5e7eb',
          }}
        >
          {reviewNotes}
        </div>
      )}
      {!reviewNotes && currentStatus === 'in_review' && (
        <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>
          Belum ada catatan review. Reviewer dapat menambahkan catatan di field "Catatan Review" di bawah.
        </p>
      )}
    </div>
  )
}
