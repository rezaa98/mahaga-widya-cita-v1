import type { CollectionConfig } from 'payload'
import { universalCollectionAutoTranslate } from '../hooks/universalAutoTranslate'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    group: 'Manajemen Konten',
    useAsTitle: 'name',
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [universalCollectionAutoTranslate],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (value) return value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
            if (data?.name) return data.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
            return value
          },
        ],
      },
    },
  ],
}
