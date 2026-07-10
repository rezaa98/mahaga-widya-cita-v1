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
    {
      name: 'workingHours',
      label: 'Jam Kerja',
      type: 'text',
      required: true,
      defaultValue: 'Senin – Jumat, 08.00 – 17.00 WIB',
    },
    {
      name: 'locationTag',
      label: 'Tag Lokasi (Singkat)',
      type: 'text',
      required: true,
      defaultValue: 'Pangkalan Bun, Kalimantan Tengah',
      admin: {
        description: 'Teks singkat untuk ikon pin peta (misal: Jakarta Selatan, DKI Jakarta)',
      }
    },
    {
      name: 'whatsappCta',
      label: 'Pengaturan Tombol WhatsApp',
      type: 'group',
      fields: [
        {
          name: 'title',
          label: 'Judul Tombol',
          type: 'text',
          required: true,
          defaultValue: 'Chat via WhatsApp',
        },
        {
          name: 'subtitle',
          label: 'Sub-judul Tombol',
          type: 'text',
          required: true,
          defaultValue: 'Respons lebih cepat, langsung ke tim kami',
        },
        {
          name: 'defaultMessage',
          label: 'Pesan Default (Otomatis terisi)',
          type: 'textarea',
          required: true,
          defaultValue: 'Halo, saya ingin berkonsultasi dengan tim PT Mahaga Widya Cita.',
        }
      ]
    }
  ]
}
