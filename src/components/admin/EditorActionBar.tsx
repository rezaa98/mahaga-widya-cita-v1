'use client'

import React from 'react'
import { useFormFields, useAuth, useDocumentInfo } from '@payloadcms/ui'
import { hasCapability } from '@/utils/access'

type AuthUser = { role?: unknown } | null | undefined

const STATUS_ACTIONS: Record<string, { label: string; icon: string; nextStatuses: string[] }[]> = {
  draft: [
    { label: 'Kirim Review', icon: 'send', nextStatuses: ['in_review'] },
  ],
  in_review: [
    { label: 'Setujui', icon: 'check_circle', nextStatuses: ['approved'] },
    { label: 'Minta Revisi', icon: 'feedback', nextStatuses: ['revision_requested'] },
  ],
  revision_requested: [
    { label: 'Kirim Ulang', icon: 'send', nextStatuses: ['in_review'] },
  ],
  approved: [
    { label: 'Publish', icon: 'public', nextStatuses: ['published'] },
    { label: 'Jadwalkan', icon: 'schedule', nextStatuses: ['scheduled'] },
  ],
  scheduled: [
    { label: 'Publish Sekarang', icon: 'public', nextStatuses: ['published'] },
  ],
  published: [
    { label: 'Arsipkan', icon: 'inventory_2', nextStatuses: ['archived'] },
  ],
  archived: [
    { label: 'Aktifkan Ulang', icon: 'unarchive', nextStatuses: ['draft'] },
  ],
}

/**
 * Sticky editorial action bar shown below the Payload editor toolbar. Displays
 * the current document status and available status transitions based on the
 * authenticated user's editorial role.
 */
export const EditorActionBar: React.FC = () => {
  const { user } = useAuth()
  const authUser = user as unknown as AuthUser
  const docInfo = useDocumentInfo()
  const statusField = useFormFields(([fields]) => fields.status)

  const currentStatus = (statusField?.value as string) || 'draft'
  const actions = STATUS_ACTIONS[currentStatus] || []

  const canPublish = hasCapability(authUser, 'publishContent')
  const canReview = hasCapability(authUser, 'reviewContent')
  const canEdit = hasCapability(authUser, 'manageContent')

  // Filter actions based on the user's capabilities
  const availableActions = actions.filter((action) => {
    const nextStatus = action.nextStatuses[0]
    if (['published', 'scheduled'].includes(nextStatus)) return canPublish
    if (['approved', 'revision_requested'].includes(nextStatus)) return canReview || canPublish
    if (['in_review', 'draft'].includes(nextStatus)) return canEdit || canReview || canPublish
    if (nextStatus === 'archived') return canPublish
    return false
  })

  if (availableActions.length === 0) return null

  const statusLabel = {
    draft: 'Draft',
    in_review: 'Menunggu Review',
    revision_requested: 'Perlu Revisi',
    approved: 'Disetujui',
    scheduled: 'Terjadwal',
    published: 'Published',
    archived: 'Diarsipkan',
  }[currentStatus] || currentStatus

  return (
    <div className="mwc-editor-action-bar">
      <div className="mwc-editor-action-bar__status">
        <span className="material-symbols-outlined" aria-hidden style={{ fontSize: 18 }}>
          {currentStatus === 'published' ? 'public' : currentStatus === 'draft' ? 'edit_note' : 'pending'}
        </span>
        <span>Status: <strong>{statusLabel}</strong></span>
      </div>
      <div className="mwc-editor-action-bar__actions">
        <a
          className="mwc-editor-action-bar__preview"
          href={docInfo?.id ? `/${currentStatus === 'published' ? 'id' : 'id'}/artikel/${(docInfo as any)?.data?.slug || docInfo.id}` : '#'}
          rel="noreferrer"
          target="_blank"
        >
          <span className="material-symbols-outlined" aria-hidden style={{ fontSize: 16 }}>visibility</span>
          Preview
        </a>
        {availableActions.map((action) => (
          <button
            className="mwc-editor-action-bar__btn"
            key={action.label}
            onClick={() => {
              if (statusField && 'setValue' in statusField) {
                ;(statusField as any).setValue(action.nextStatuses[0])
              }
            }}
            type="button"
          >
            <span className="material-symbols-outlined" aria-hidden style={{ fontSize: 16 }}>{action.icon}</span>
            {action.label}
          </button>
        ))}
      </div>
    </div>
  )
}
