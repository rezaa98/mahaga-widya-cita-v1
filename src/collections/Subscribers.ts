import type { CollectionConfig } from 'payload'
import { canManageAudience, canViewAudience } from '../utils/access'

export const Subscribers: CollectionConfig = {
  slug: 'subscribers',
  admin: {
    group: 'Data Audiens',
    useAsTitle: 'email',
    defaultColumns: ['email', 'createdAt'],
  },
  access: {
    read: canViewAudience,
    create: () => true, // allow public subscriptions
    update: canManageAudience,
    delete: canManageAudience,
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
