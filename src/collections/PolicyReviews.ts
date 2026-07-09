import type { CollectionConfig } from 'payload'

export const PolicyReviews: CollectionConfig = {
  slug: 'policy-reviews',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
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
      name: 'document',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'summary',
      type: 'richText',
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
