import type { CollectionConfig } from 'payload'
import { canManageMedia } from '@/utils/access'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    useAsTitle: 'alt',
    defaultColumns: ['filename', 'alt', 'mimeType', 'updatedAt'],
    listSearchableFields: ['alt', 'filename'],
  },
  access: {
    read: () => true,
    create: canManageMedia,
    update: canManageMedia,
    delete: canManageMedia,
  },
  upload: {
    staticDir: 'public/media',
    focalPoint: true,
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 768,
        height: 1024,
        position: 'centre',
      },
      {
        name: 'tablet',
        width: 1024,
        height: undefined,
        position: 'centre',
      },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*', 'application/pdf'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      localized: true,
      label: 'Alt Text',
      admin: {
        description: 'Deskripsikan gambar secara ringkas untuk aksesibilitas. Wajib untuk setiap media.',
      },
    },
    {
      name: 'caption',
      type: 'text',
      localized: true,
      label: 'Caption',
    },
    {
      name: 'credit',
      type: 'text',
      label: 'Kredit / Sumber',
      admin: {
        description: 'Cantumkan fotografer, organisasi, atau lisensi bila diperlukan.',
      },
    },
  ],
}
