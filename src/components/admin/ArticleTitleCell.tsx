'use client'

import React from 'react'

/**
 * Custom cell rendering an article thumbnail + title + category in the admin
 * list view, giving editors a visual overview at a glance.
 */
export const ArticleTitleCell: React.FC<any> = ({ cellData, rowData }) => {
  const title = cellData as string
  const featuredImage = rowData?.featuredImage as
    | { url?: string; sizes?: { card?: { url?: string } }; alt?: string }
    | undefined
  const imageUrl = rowData?.imageUrl as string | undefined

  const thumbUrl =
    featuredImage?.sizes?.card?.url || featuredImage?.url || imageUrl || null

  const category = rowData?.category as
    | { name?: string }
    | string
    | number
    | null
    | undefined
  const categoryName =
    category && typeof category === 'object' ? category.name : null

  return (
    <div className="mwc-cell-article" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <div
        className="mwc-cell-article__thumb"
        style={{
          width: 48,
          height: 48,
          borderRadius: 8,
          background: thumbUrl ? `url(${thumbUrl}) center / cover no-repeat` : '#e8eef7',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#94a3b8',
          fontSize: 18,
          overflow: 'hidden',
        }}
      >
        {!thumbUrl && (
          <span aria-hidden className="material-symbols-outlined" style={{ fontSize: 22, color: '#94a3b8' }}>
            image
          </span>
        )}
      </div>
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontWeight: 600,
            color: '#1a2b4c',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: 320,
            fontSize: 14,
          }}
        >
          {title || '(Tanpa judul)'}
        </div>
        {categoryName && (
          <span className="mwc-cell-article__category">{categoryName}</span>
        )}
      </div>
    </div>
  )
}
