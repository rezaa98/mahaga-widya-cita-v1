import { GlobalConfig } from 'payload'

export const TentangKami: GlobalConfig = {
  slug: 'tentang-kami',
  label: 'Halaman Tentang Kami',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'hero',
      label: 'Bagian Hero (Atas)',
      type: 'group',
      fields: [
        { name: 'badge', type: 'text', defaultValue: 'TENTANG KAMI', required: true },
        { name: 'title', type: 'text', defaultValue: 'Building Better Decisions.', required: true },
        { name: 'titleHighlight', type: 'text', defaultValue: 'Creating Sustainable Impact.', required: true },
        { name: 'description', type: 'textarea', defaultValue: 'Your One-Stop Consulting Partner', required: true },
      ]
    },
    {
      name: 'values',
      label: 'Nilai Kami',
      type: 'array',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea', required: true },
        { 
          name: 'icon', 
          type: 'select', 
          options: [
            { label: 'Check Circle', value: 'CheckCircle2' },
            { label: 'Award', value: 'Award' },
            { label: 'Target', value: 'Target' },
            { label: 'Eye', value: 'Eye' },
            { label: 'Users', value: 'Users' },
            { label: 'Building', value: 'Building2' },
            { label: 'Globe', value: 'Globe' },
            { label: 'Book Open', value: 'BookOpen' }
          ], 
          defaultValue: 'Award',
          required: true
        },
      ]
    },

    {
      name: 'ceoMessage',
      label: 'Pesan CEO',
      type: 'group',
      fields: [
        { name: 'quote', type: 'textarea', required: true, defaultValue: 'Kami percaya bahwa kualitas tata kelola suatu bangsa dimulai dari kualitas manusianya. Setiap program yang kami rancang adalah investasi jangka panjang bagi kemajuan Indonesia — sebuah misi yang kami emban dengan penuh dedikasi dan kebanggaan.' },
      ]
    }
  ]
}
