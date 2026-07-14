import type { CollectionConfig } from 'payload'
import { universalCollectionAutoTranslate } from '../hooks/universalAutoTranslate'

export const Articles: CollectionConfig = {
  slug: 'articles',
  admin: {
    group: 'Manajemen Konten',
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'status', 'publishedAt'],
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [universalCollectionAutoTranslate],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Konten Penulisan',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              localized: true,
              label: 'Judul Artikel',
            },
            {
              name: 'content',
              type: 'richText',
              required: true,
              localized: true,
              label: 'Isi Artikel',
            },
          ]
        },
        {
          label: 'Media',
          fields: [
            {
              name: 'imageUrl',
              type: 'text',
              label: 'Thumbnail Image URL',
              admin: {
                description: 'URL gambar untuk thumbnail artikel (contoh: https://images.unsplash.com/...)',
              },
            },
          ]
        }
      ]
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (value) return value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
            if (data?.title) return data.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
            return value
          },
        ],
      },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      defaultValue: 'draft',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
