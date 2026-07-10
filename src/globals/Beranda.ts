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
            { name: 'Kementerian PAN-RB', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Logo_of_the_Ministry_of_Administrative_and_Bureaucratic_Reform_of_the_Republic_of_Indonesia.svg/512px-Logo_of_the_Ministry_of_Administrative_and_Bureaucratic_Reform_of_the_Republic_of_Indonesia.svg.png' },
            { name: 'BKN', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Logo_BKN_Terbaru.png/512px-Logo_BKN_Terbaru.png' },
            { name: 'BPKP', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Logo_BPKP_Indonesia_-_Badan_Pengawasan_Keuangan_dan_Pembangunan.png/512px-Logo_BPKP_Indonesia_-_Badan_Pengawasan_Keuangan_dan_Pembangunan.png' },
            { name: 'LAN RI', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Lembaga_Administrasi_Negara_Republik_Indonesia.png/512px-Lembaga_Administrasi_Negara_Republik_Indonesia.png' },
            { name: 'Setjen DPR RI', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Logo_Dewan_Perwakilan_Rakyat_Republik_Indonesia_2020.svg/512px-Logo_Dewan_Perwakilan_Rakyat_Republik_Indonesia_2020.svg.png' },
            { name: 'Bappenas', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Logo_Bappenas_Indonesia.svg/512px-Logo_Bappenas_Indonesia.svg.png' },
            { name: 'Kemendagri', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Logo_Kementerian_Dalam_Negeri.svg/512px-Logo_Kementerian_Dalam_Negeri.svg.png' },
            { name: 'Kemenkeu', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Kementerian_Keuangan_Republik_Indonesia.png/512px-Kementerian_Keuangan_Republik_Indonesia.png' },
            { name: 'KemenPUPR', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Logo_PUPR.png/512px-Logo_PUPR.png' },
            { name: 'Ombudsman RI', logoUrl: 'https://upload.wikimedia.org/wikipedia/id/thumb/7/77/Logo_Ombudsman_Republik_Indonesia.png/512px-Logo_Ombudsman_Republik_Indonesia.png' },
          ]
        }
      ]
    }
  ]
}
