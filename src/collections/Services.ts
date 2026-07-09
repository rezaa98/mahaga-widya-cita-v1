import type { CollectionConfig } from 'payload'

export const Services: CollectionConfig = {
  slug: 'services',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
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
      label: 'Tagline Singkat',
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      label: 'Deskripsi Layanan',
    },
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
    {
      name: 'features',
      type: 'array',
      label: 'Fitur Utama',
      fields: [
        {
          name: 'feature',
          type: 'text',
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
          required: true,
        },
        {
          name: 'desc',
          type: 'text',
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
          required: true,
        },
      ],
    },
  ],
}
