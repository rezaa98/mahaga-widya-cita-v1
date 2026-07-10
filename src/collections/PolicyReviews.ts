import type { CollectionConfig } from 'payload'

export const PolicyReviews: CollectionConfig = {
  slug: 'policy-reviews',
  admin: {
    group: 'Manajemen Konten',
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Konten Ulasan',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              label: 'Judul Policy Review',
            },
            {
              name: 'summary',
              type: 'richText',
              label: 'Ringkasan (Summary)',
            },
          ]
        },
        {
          label: 'Dokumen',
          fields: [
            {
              name: 'document',
              type: 'upload',
              relationTo: 'media',
              required: true,
              label: 'File Dokumen (PDF dll)',
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
  ],
}
