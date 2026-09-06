import { GlobalConfig } from "payload";
import { universalGlobalAutoTranslate } from "../hooks/universalAutoTranslate";
import { canManageSiteContent } from "../utils/access";

export const Beranda: GlobalConfig = {
  slug: "beranda",
  label: { id: "Beranda (Landing Page)", en: "Home (Landing Page)" },
  admin: {
    group: { id: "Website", en: "Website" },
    components: {
      elements: { beforeDocumentControls: ["@/components/admin/LocaleDocumentControls#LocaleDocumentControls"] },
    },
  },
  access: {
    read: () => true,
    update: canManageSiteContent,
  },
  hooks: {
    afterChange: [universalGlobalAutoTranslate],
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: { id: "Struktur & Hero", en: "Structure & Hero" },
          description: {
            id: "Atur bagian yang tampil dan pesan utama di area teratas halaman.",
            en: "Control section visibility and the primary message at the top of the page.",
          },
          fields: [
            {
              name: "visibility",
              type: "group",
              label: { id: "Visibilitas Bagian", en: "Section Visibility" },
              admin: {
                className: "mwc-global-settings mwc-visibility-settings",
                description: {
                  id: "Pengaturan global — berlaku untuk halaman Indonesia dan Inggris.",
                  en: "Global settings — these apply to both Indonesian and English pages.",
                },
              },
              fields: [
                {
                  name: "showHero",
                  type: "checkbox",
                  defaultValue: true,
                  label: { id: "Tampilkan Hero", en: "Show Hero" },
                },
                {
                  name: "showStats",
                  type: "checkbox",
                  defaultValue: true,
                  label: { id: "Tampilkan Statistik", en: "Show Statistics" },
                },
                {
                  name: "showPartners",
                  type: "checkbox",
                  defaultValue: true,
                  label: { id: "Tampilkan Mitra", en: "Show Partners" },
                },
                {
                  name: "showServices",
                  type: "checkbox",
                  defaultValue: true,
                  label: { id: "Tampilkan Area Layanan", en: "Show Services Area" },
                },
                {
                  name: "showArticles",
                  type: "checkbox",
                  defaultValue: true,
                  label: { id: "Tampilkan Artikel Terbaru", en: "Show Latest Articles" },
                },
                {
                  name: "showTeam",
                  type: "checkbox",
                  defaultValue: true,
                  label: { id: "Tampilkan Tim Ahli", en: "Show Expert Team" },
                },
                {
                  name: "showCTA",
                  type: "checkbox",
                  defaultValue: true,
                  label: { id: "Tampilkan Call to Action (CTA)", en: "Show Call to Action (CTA)" },
                },
              ],
            },
            {
              name: "hero",
              label: { id: "Hero (Bagian Atas)", en: "Hero (Top Section)" },
              type: "group",
              fields: [
                {
                  name: "badge",
                  label: { id: "Teks Badge / Label", en: "Badge Text / Label" },
                  type: "text",
                  localized: true,
                  required: true,
                  defaultValue: "Platform Edukasi & Tata Kelola Terpercaya Sejak 2015",
                },
                {
                  name: "title",
                  label: { id: "Judul Utama", en: "Main Title" },
                  type: "text",
                  localized: true,
                  required: true,
                  defaultValue: "Platform Edukasi &",
                },
                {
                  name: "titleHighlight",
                  label: { id: "Teks Sorotan (Warna Emas)", en: "Highlighted Text (Gold)" },
                  type: "text",
                  localized: true,
                  required: true,
                  defaultValue: "Tata Kelola",
                },
                {
                  name: "titleSuffix",
                  label: { id: "Teks Setelah Sorotan", en: "Text After Highlight" },
                  type: "text",
                  localized: true,
                  required: true,
                  defaultValue: "untuk Profesional Indonesia",
                },
                {
                  name: "description",
                  label: { id: "Deskripsi / Subjudul", en: "Description / Subtitle" },
                  type: "textarea",
                  localized: true,
                  required: true,
                  defaultValue:
                    "Tingkatkan kompetensi SDM dan perkuat tata kelola instansi Anda melalui program edukasi, konsultasi, dan webinar berkualitas tinggi bersama para pakar terbaik Indonesia.",
                },
                {
                  name: "features",
                  label: { id: "Fitur Singkat (Ceklis)", en: "Short Features (Checklist)" },
                  type: "array",
                  maxRows: 4,
                  fields: [
                    {
                      name: "text",
                      type: "text",
                      localized: true,
                      required: true,
                    },
                  ],
                  defaultValue: [
                    { text: "Sertifikat Digital Resmi" },
                    { text: "Webinar Gratis Setiap Bulan" },
                    { text: "500+ Materi Edukasi" },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: { id: "Konten Beranda", en: "Home Content" },
          description: {
            id: "Kelola statistik, mitra, pengantar layanan, dan konten pilihan.",
            en: "Manage statistics, partners, the services introduction, and featured content.",
          },
          fields: [
            {
              name: "stats",
              label: { id: "Statistik Pencapaian", en: "Achievement Statistics" },
              type: "array",
              maxRows: 4,
              fields: [
                {
                  name: "value",
                  label: { id: "Angka (contoh: 500)", en: "Value (example: 500)" },
                  type: "number",
                  required: true,
                },
                {
                  name: "suffix",
                  label: { id: "Akhiran (contoh: +)", en: "Suffix (example: +)" },
                  type: "text",
                  localized: true,
                },
                {
                  name: "label",
                  label: { id: "Teks Label", en: "Label Text" },
                  type: "text",
                  localized: true,
                  required: true,
                },
                {
                  name: "icon",
                  label: { id: "Ikon", en: "Icon" },
                  type: "select",
                  options: [
                    { label: { id: "Mikrofon / Webinar", en: "Microphone / Webinar" }, value: "Mic2" },
                    { label: { id: "Pengguna / Orang", en: "Users / People" }, value: "Users" },
                    { label: { id: "Gedung / Instansi", en: "Building / Institution" }, value: "Building2" },
                    { label: { id: "Global / Mitra", en: "Global / Partner" }, value: "Globe" },
                    { label: { id: "Target", en: "Target" }, value: "Target" },
                    { label: { id: "Centang", en: "Check" }, value: "CheckCircle2" },
                  ],
                  defaultValue: "Mic2",
                },
              ],
              defaultValue: [
                { value: 500, suffix: "+", label: "Sesi Webinar", icon: "Mic2" },
                { value: 10000, suffix: "+", label: "Peserta Terdaftar", icon: "Users" },
                { value: 200, suffix: "+", label: "Instansi Mitra", icon: "Building2" },
                { value: 50, suffix: "+", label: "Mitra Strategis", icon: "Globe" },
              ],
            },
            {
              name: "partners",
              label: { id: "Mitra Strategis", en: "Strategic Partners" },
              type: "group",
              fields: [
                {
                  name: "title",
                  label: { id: "Judul Bagian", en: "Section Title" },
                  type: "text",
                  localized: true,
                  required: true,
                  defaultValue: "Dipercaya oleh Lebih dari 200 Instansi dan Mitra Strategis",
                },
                {
                  name: "list",
                  label: { id: "Daftar Mitra", en: "Partner List" },
                  type: "array",
                  fields: [
                    {
                      name: "name",
                      label: { id: "Nama Instansi/Mitra", en: "Institution/Partner Name" },
                      type: "text",
                      localized: true,
                      required: true,
                    },
                    {
                      name: "logo",
                      label: { id: "Unggah Logo (Utama)", en: "Upload Logo (Primary)" },
                      type: "upload",
                      relationTo: "media",
                      admin: {
                        description: {
                          id: "Logo perusahaan/instansi. Sebaiknya gunakan latar transparan (PNG).",
                          en: "Company/institution logo. A transparent background (PNG) is recommended.",
                        },
                      },
                    },
                    {
                      name: "logoUrl",
                      label: { id: "URL Logo (Alternatif)", en: "Logo URL (Alternative)" },
                      type: "text",
                      admin: {
                        description: {
                          id: "Isi URL gambar hanya jika tidak mengunggah logo di atas.",
                          en: "Enter an image URL only when no logo is uploaded above.",
                        },
                      },
                    },
                  ],
                  defaultValue: [
                    { name: "Kementerian PAN-RB", logoUrl: "/media/partner_kementerian_pan_rb.png" },
                    { name: "BKN", logoUrl: "/media/partner_bkn.png" },
                    { name: "BPKP", logoUrl: "/media/partner_bpkp.png" },
                    { name: "LAN RI", logoUrl: "/media/partner_lan_ri.png" },
                    { name: "Setjen DPR RI", logoUrl: "/media/partner_setjen_dpr_ri.png" },
                    { name: "Bappenas", logoUrl: "/media/partner_bappenas.png" },
                    { name: "Kemendagri", logoUrl: "/media/partner_kemendagri.png" },
                    { name: "Kemenkeu", logoUrl: "/media/partner_kemenkeu.png" },
                    { name: "KemenPUPR", logoUrl: "/media/partner_kemenpupr.png" },
                    { name: "Ombudsman RI", logoUrl: "/media/partner_ombudsman_ri.png" },
                  ],
                },
              ],
            },
            {
              name: "servicesIntro",
              label: { id: "Pengantar Bagian Layanan", en: "Services Section Introduction" },
              type: "group",
              fields: [
                {
                  name: "badge",
                  label: { id: "Teks Badge (Kecil di Atas)", en: "Badge Text (Small, Above)" },
                  type: "text",
                  localized: true,
                  required: true,
                  defaultValue: "Your Next Move",
                },
                {
                  name: "title",
                  label: { id: "Judul Utama Bagian Layanan", en: "Services Section Main Title" },
                  type: "text",
                  localized: true,
                  required: true,
                  defaultValue: "Melihat Peluang.\nMenentukan Langkah.\nMenciptakan Nilai.",
                  admin: {
                    description: {
                      id: "Gunakan HTML <br /> untuk membuat baris baru.",
                      en: "Use HTML <br /> to create a new line.",
                    },
                  },
                },
                {
                  name: "description",
                  label: { id: "Deskripsi Singkat", en: "Short Description" },
                  type: "textarea",
                  localized: true,
                  required: true,
                  defaultValue:
                    "Kami membantu Anda melihat peluang, mengambil langkah yang tepat, dan mengembangkan potensi menjadi sesuatu yang bernilai.",
                },
              ],
            },
            {
              name: "teamIntro",
              label: { id: "Pengantar Bagian Tim", en: "Team Section Introduction" },
              type: "group",
              fields: [
                {
                  name: "title",
                  label: { id: "Judul Bagian Tim", en: "Team Section Title" },
                  type: "text",
                  localized: true,
                  required: true,
                  defaultValue: "Manajemen Perusahaan",
                },
                {
                  name: "description",
                  label: { id: "Narasi Singkat", en: "Short Narrative" },
                  type: "textarea",
                  localized: true,
                  required: true,
                  defaultValue:
                    "Profesional yang mengedepankan strategi, tata kelola, dan inovasi untuk menghadirkan nilai bagi setiap klien.",
                },
              ],
            },
            {
              name: "featuredData",
              label: { id: "Konten Pilihan (Opsional)", en: "Featured Content (Optional)" },
              type: "group",
              admin: {
                className: "mwc-global-settings",
                description: {
                  id: "Pilihan global — item yang sama digunakan pada halaman Indonesia dan Inggris.",
                  en: "Global selection — the same items are used on Indonesian and English pages.",
                },
              },
              fields: [
                {
                  name: "services",
                  label: { id: "Layanan Pilihan", en: "Featured Services" },
                  type: "relationship",
                  relationTo: "services",
                  hasMany: true,
                  admin: {
                    description: {
                      id: "Pilih layanan yang tampil di Beranda (maksimal 6 disarankan).",
                      en: "Select services to display on Home (up to 6 recommended).",
                    },
                  },
                },
                {
                  name: "articles",
                  label: { id: "Artikel Pilihan", en: "Featured Articles" },
                  type: "relationship",
                  relationTo: "articles",
                  hasMany: true,
                  admin: {
                    description: {
                      id: "Pilih artikel yang tampil di Beranda (maksimal 3 disarankan).",
                      en: "Select articles to display on Home (up to 3 recommended).",
                    },
                  },
                },
                {
                  name: "team",
                  label: { id: "Tim Pilihan", en: "Featured Team" },
                  type: "relationship",
                  relationTo: "team-members",
                  hasMany: true,
                  admin: {
                    description: {
                      id: "Pilih anggota tim yang tampil di Beranda (maksimal 4 disarankan).",
                      en: "Select team members to display on Home (up to 4 recommended).",
                    },
                  },
                },
              ],
            },
          ],
        },
        {
          label: { id: "Konversi & CTA", en: "Conversion & CTA" },
          description: {
            id: "Kelola ajakan tindakan dan tujuan WhatsApp pada bagian bawah halaman.",
            en: "Manage the call to action and WhatsApp destination at the bottom of the page.",
          },
          fields: [
            {
              name: "cta",
              label: { id: "Call to Action (Bagian Bawah)", en: "Call to Action (Bottom Section)" },
              type: "group",
              fields: [
                {
                  name: "title",
                  label: { id: "Judul Utama", en: "Main Title" },
                  type: "text",
                  localized: true,
                  required: true,
                  defaultValue: "Siap bertransformasi bersama kami?",
                  admin: {
                    description: {
                      id: "Gunakan Enter/baris baru untuk memisahkan baris teks.",
                      en: "Use Enter/new lines to split the text into lines.",
                    },
                  },
                },
                {
                  name: "description",
                  label: { id: "Deskripsi", en: "Description" },
                  type: "textarea",
                  localized: true,
                  required: true,
                  defaultValue:
                    "Lebih dari 200 instansi pemerintah dan swasta telah mempercayakan pengembangan SDM dan tata kelola mereka kepada PT Mahaga Widya Cita.",
                },
                {
                  name: "waNumber",
                  label: { id: "Nomor WhatsApp", en: "WhatsApp Number" },
                  type: "text",
                  required: true,
                  defaultValue: "6221123456789",
                  admin: {
                    description: {
                      id: "Gunakan format internasional tanpa awalan + (contoh: 62812...).",
                      en: "Use international format without the + prefix (example: 62812...).",
                    },
                  },
                },
                {
                  name: "waMessage",
                  label: { id: "Pesan Default WhatsApp", en: "Default WhatsApp Message" },
                  type: "text",
                  localized: true,
                  required: true,
                  defaultValue: "Halo, saya ingin konsultasi mengenai layanan PT Mahaga Widya Cita",
                },
                {
                  name: "features",
                  label: { id: "Poin Keunggulan (Bawah Tombol)", en: "Benefit Points (Below Button)" },
                  type: "array",
                  fields: [{ name: "text", type: "text", required: true, localized: true }],
                  defaultValue: [
                    { text: "Respon Cepat" },
                    { text: "Konsultasi Awal Gratis" },
                    { text: "Tim Berpengalaman 10+ Tahun" },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
