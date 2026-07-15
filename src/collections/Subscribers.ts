import type { CollectionConfig } from 'payload'

export const Subscribers: CollectionConfig = {
  slug: 'subscribers',
  admin: {
    group: 'Data Audiens',
    useAsTitle: 'email',
    defaultColumns: ['email', 'createdAt'],
  },
  access: {
    read: ({ req }) => {
      // Only authenticated users (admins) can read subscriber list
      return !!req.user;
    },
    create: () => true, // allow public subscriptions
    update: () => false,
    delete: () => false,
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
      label: 'Alamat Email',
    },
  ],
}
