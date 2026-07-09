import React from 'react'
import { RichText } from '@payloadcms/richtext-lexical/react'

type Props = {
  content: any
  className?: string
}

export default function RichTextRenderer({ content, className = '' }: Props) {
  if (!content) return null

  return (
    <div className={`rich-text ${className}`}>
      <RichText data={content} />
    </div>
  )
}
