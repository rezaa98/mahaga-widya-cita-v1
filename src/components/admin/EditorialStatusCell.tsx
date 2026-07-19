import type { DefaultServerCellComponentProps } from 'payload'

const STATUS_STYLES: Record<string, { background: string; color: string; label: string }> = {
  draft: { label: 'Draft', background: '#f1f5f9', color: '#475569' },
  in_review: { label: 'Menunggu Review', background: '#fef3c7', color: '#92400e' },
  revision_requested: { label: 'Perlu Revisi', background: '#fee2e2', color: '#b91c1c' },
  approved: { label: 'Disetujui', background: '#dbeafe', color: '#1d4ed8' },
  scheduled: { label: 'Terjadwal', background: '#ede9fe', color: '#6d28d9' },
  published: { label: 'Published', background: '#dcfce7', color: '#15803d' },
  archived: { label: 'Diarsipkan', background: '#e5e7eb', color: '#4b5563' },
}

export function EditorialStatusCell({ cellData }: DefaultServerCellComponentProps) {
  const status = typeof cellData === 'string' ? cellData : 'draft'
  const style = STATUS_STYLES[status] || STATUS_STYLES.draft

  return (
    <span
      style={{
        alignItems: 'center',
        background: style.background,
        borderRadius: '999px',
        color: style.color,
        display: 'inline-flex',
        fontSize: '0.75rem',
        fontWeight: 700,
        lineHeight: 1,
        maxWidth: '100%',
        padding: '0.4rem 0.65rem',
        whiteSpace: 'nowrap',
      }}
    >
      {style.label}
    </span>
  )
}
