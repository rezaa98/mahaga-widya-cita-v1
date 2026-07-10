import type { CollectionConfig } from 'payload'

export const ContactSubmissions: CollectionConfig = {
  slug: 'contact-submissions',
  admin: {
    group: 'Data Audiens',
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'subject', 'createdAt'],
  },
  access: {
    read: () => true,
    create: () => true, // allow public form submissions
    update: () => false,
    delete: () => false,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Nama Lengkap',
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      label: 'Alamat Email',
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Nomor Telepon',
    },
    {
      name: 'institution',
      type: 'text',
      label: 'Instansi / Perusahaan',
    },
    {
      name: 'subject',
      type: 'text',
      required: true,
      label: 'Subjek Pesan',
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
      label: 'Isi Pesan',
    },
  ],
}
