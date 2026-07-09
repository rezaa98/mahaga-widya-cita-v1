import type { CollectionConfig } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
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
