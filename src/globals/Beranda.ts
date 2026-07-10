import { GlobalConfig } from 'payload'

export const Beranda: GlobalConfig = {
  slug: 'beranda',
  label: 'Beranda (Landing Page)',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'hero',
      label: 'Pengaturan Hero (Atas)',
      type: 'group',
      fields: [
        {
          name: 'badge',
          label: 'Teks Badge / Label',
          type: 'text',
          required: true,
          defaultValue: 'Platform Edukasi & Tata Kelola Terpercaya Sejak 2015',
        },
        {
          name: 'title',
          label: 'Judul Utama',
          type: 'text',
          required: true,
          defaultValue: 'Platform Edukasi &',
        },
        {
          name: 'titleHighlight',
          label: 'Teks Sorotan (Warna Emas)',
          type: 'text',
          required: true,
          defaultValue: 'Tata Kelola',
        },
        {
          name: 'titleSuffix',
          label: 'Teks Setelah Sorotan',
          type: 'text',
          required: true,
          defaultValue: 'untuk Profesional Indonesia',
        },
        {
          name: 'description',
          label: 'Deskripsi / Sub-judul',
          type: 'textarea',
          required: true,
          defaultValue: 'Tingkatkan kompetensi SDM dan perkuat tata kelola instansi Anda melalui program edukasi, konsultasi, dan webinar berkualitas tinggi bersama para pakar terbaik Indonesia.',
        },
        {
          name: 'features',
          label: 'Fitur Singkat (Ceklis)',
          type: 'array',
          maxRows: 4,
          fields: [
            {
              name: 'text',
              type: 'text',
              required: true,
            }
          ],
          defaultValue: [
            { text: 'Sertifikat Digital Resmi' },
            { text: 'Webinar Gratis Setiap Bulan' },
            { text: '500+ Materi Edukasi' }
          ]
        }
      ]
    },
    {
      name: 'stats',
      label: 'Statistik Pencapaian',
      type: 'array',
      maxRows: 4,
      fields: [
        {
          name: 'value',
          label: 'Angka (contoh: 500)',
          type: 'number',
          required: true,
        },
        {
          name: 'suffix',
          label: 'Akhiran (contoh: +)',
          type: 'text',
        },
        {
          name: 'label',
          label: 'Label Text',
          type: 'text',
          required: true,
        },
        {
          name: 'icon',
          label: 'Icon',
          type: 'select',
          options: [
            { label: 'Mic / Webinar', value: 'Mic2' },
            { label: 'Pengguna / Orang', value: 'Users' },
            { label: 'Gedung / Instansi', value: 'Building2' },
            { label: 'Global / Mitra', value: 'Globe' },
            { label: 'Target', value: 'Target' },
            { label: 'Check', value: 'CheckCircle2' }
          ],
          defaultValue: 'Mic2'
        }
      ],
      defaultValue: [
        { value: 500, suffix: '+', label: 'Sesi Webinar', icon: 'Mic2' },
        { value: 10000, suffix: '+', label: 'Peserta Terdaftar', icon: 'Users' },
        { value: 200, suffix: '+', label: 'Instansi Mitra', icon: 'Building2' },
        { value: 50, suffix: '+', label: 'Mitra Strategis', icon: 'Globe' },
      ]
    },
    {
      name: 'partners',
      label: 'Mitra Strategis (Partners)',
      type: 'group',
      fields: [
        {
          name: 'title',
          label: 'Judul Bagian',
          type: 'text',
          required: true,
          defaultValue: 'Dipercaya oleh Lebih dari 200 Instansi dan Mitra Strategis',
        },
        {
          name: 'list',
          label: 'Daftar Mitra',
          type: 'array',
          fields: [
            {
              name: 'name',
              label: 'Nama Instansi/Mitra',
              type: 'text',
              required: true,
            },
            {
              name: 'logo',
              label: 'Logo Upload (Utama)',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Logo perusahaan/instansi. Sebaiknya menggunakan latar transparan (PNG).',
              },
            },
            {
              name: 'logoUrl',
              label: 'Logo URL (Alternatif)',
              type: 'text',
              admin: {
                description: 'Isi dengan URL gambar jika tidak mengunggah logo di atas.',
              }
            }
          ],
          defaultValue: [
            { name: 'Kementerian PAN-RB', logoUrl: '/media/partner_kementerian_pan_rb.png' },
            { name: 'BKN', logoUrl: '/media/partner_bkn.png' },
            { name: 'BPKP', logoUrl: '/media/partner_bpkp.png' },
            { name: 'LAN RI', logoUrl: '/media/partner_lan_ri.png' },
            { name: 'Setjen DPR RI', logoUrl: '/media/partner_setjen_dpr_ri.png' },
            { name: 'Bappenas', logoUrl: '/media/partner_bappenas.png' },
            { name: 'Kemendagri', logoUrl: '/media/partner_kemendagri.png' },
            { name: 'Kemenkeu', logoUrl: '/media/partner_kemenkeu.png' },
            { name: 'KemenPUPR', logoUrl: '/media/partner_kemenpupr.png' },
            { name: 'Ombudsman RI', logoUrl: '/media/partner_ombudsman_ri.png' },
          ]
        }
      ]
    }
  ]
}
