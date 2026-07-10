import { GlobalConfig } from 'payload'

export const Kontak: GlobalConfig = {
  slug: 'kontak',
  label: 'Informasi Kontak',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'phone',
      label: 'Telepon / WhatsApp',
      type: 'text',
      required: true,
      defaultValue: '082 332 567 816',
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true,
      defaultValue: 'mwidyacita@gmail.com',
    },
    {
      name: 'address',
      label: 'Alamat',
      type: 'textarea',
      required: true,
      defaultValue: 'Jalan Iskandar RT 008 RW 000 Madurejo, Arut Selatan, Kab Kotawaringin Barat, Kalimantan Tengah',
    },
  ]
}
