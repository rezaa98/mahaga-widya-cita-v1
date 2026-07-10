import type { CollectionConfig } from 'payload'

export const TeamMembers: CollectionConfig = {
  slug: 'team-members',
  admin: {
    group: 'Manajemen Konten',
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'expertise', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Data Profil',
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
              label: 'Nama Lengkap',
            },
            {
              name: 'initials',
              type: 'text',
              required: true,
              label: 'Inisial (Maks 3 huruf)',
              maxLength: 3,
            },
            {
              name: 'bio',
              type: 'textarea',
              label: 'Profil Singkat (Khusus Manajemen)',
              admin: {
                condition: (data) => data.category === 'management',
              },
            },
          ]
        },
        {
          label: 'Jabatan & Afiliasi',
          fields: [
            {
              name: 'category',
              type: 'select',
              required: true,
              label: 'Kategori Tim',
              options: [
                { label: 'Manajemen Perusahaan', value: 'management' },
                { label: 'Tenaga Ahli', value: 'expert' },
              ],
              defaultValue: 'expert',
            },
            {
              name: 'role',
              type: 'text',
              label: 'Jabatan (Khusus Manajemen)',
              admin: {
                condition: (data) => data.category === 'management',
              },
            },
            {
              name: 'expertise',
              type: 'text',
              required: true,
              label: 'Bidang Keahlian',
            },
            {
              name: 'institution',
              type: 'text',
              label: 'Instansi Asal (Khusus Tenaga Ahli)',
              admin: {
                condition: (data) => data.category === 'expert',
              },
            },
          ]
        },
        {
          label: 'Tampilan (Advanced)',
          fields: [
            {
              name: 'color',
              type: 'text',
              required: true,
              defaultValue: 'linear-gradient(135deg, #1E6FD9, #0B2D6B)',
              label: 'Gradien Warna (CSS)',
            },
            {
              name: 'order',
              type: 'number',
              label: 'Urutan Tampil',
              defaultValue: 0,
              admin: {
                description: 'Semakin kecil angkanya, semakin atas tampilannya',
              }
            }
          ]
        }
      ]
    }
  ],
}
