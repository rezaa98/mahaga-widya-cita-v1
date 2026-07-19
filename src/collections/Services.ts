import type { CollectionConfig } from 'payload'
import { universalCollectionAutoTranslate } from '../hooks/universalAutoTranslate'
import { canManageSiteContent } from '../utils/access'

export const Services: CollectionConfig = {
  slug: 'services',
  admin: {
    group: 'Manajemen Konten',
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
  },
  access: {
    read: () => true,
    create: canManageSiteContent,
    update: canManageSiteContent,
    delete: canManageSiteContent,
  },
  hooks: {
    afterChange: [universalCollectionAutoTranslate],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Informasi Dasar',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              localized: true,
              label: 'Judul Layanan',
            },
            {
              name: 'slug',
              type: 'text',
              required: true,
              unique: true,
              index: true,
              label: 'Slug URL (contoh: konsultasi)',
            },
            {
              name: 'tagline',
              type: 'text',
              required: true,
              localized: true,
              label: 'Tagline Singkat',
            },
            {
              name: 'description',
              type: 'textarea',
              required: true,
              localized: true,
              label: 'Deskripsi Layanan',
            },
          ]
        },
        {
          label: 'Tampilan & Tema',
          fields: [
            {
              name: 'color',
              type: 'text',
              required: true,
              defaultValue: 'var(--color-primary-600)',
              label: 'Warna Tema (Hex / CSS Var)',
            },
            {
              name: 'gradient',
              type: 'text',
              required: true,
              defaultValue: 'linear-gradient(135deg, #1E6FD9, #0B2D6B)',
              label: 'Gradien Banner',
            },
          ]
        },
        {
          label: 'Detail Konten',
          fields: [
            {
              name: 'features',
              type: 'array',
              label: 'Fitur Utama',
              fields: [
                {
                  name: 'feature',
                  type: 'text',
                  localized: true,
                  required: true,
                },
              ],
            },
            {
              name: 'benefits',
              type: 'array',
              label: 'Keuntungan (Benefits)',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  localized: true,
                  required: true,
                },
                {
                  name: 'desc',
                  type: 'text',
                  localized: true,
                  required: true,
                },
              ],
            },
            {
              name: 'targetAudience',
              type: 'array',
              label: 'Target Audiens',
              fields: [
                {
                  name: 'audience',
                  type: 'text',
                  localized: true,
                  required: true,
                },
              ],
            },
          ]
        }
      ]
    }
  ],
}
