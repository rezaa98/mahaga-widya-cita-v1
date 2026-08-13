import { GlobalConfig } from "payload";
import { universalGlobalAutoTranslate } from "../hooks/universalAutoTranslate";
import { canManageSiteContent } from "../utils/access";

export const TentangKami: GlobalConfig = {
  slug: "tentang-kami",
  label: { id: "Halaman Tentang Kami", en: "About Us Page" },
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
          name: "showStats",
          type: "checkbox",
          defaultValue: false,
          label: { id: "Tampilkan Statistik", en: "Show Statistics" },
          admin: {
            description: {
              id: "Jika aktif, baris angka (500+ klien, dll.) tampil di bawah hero.",
              en: "When enabled, the stats row (500+ clients, etc.) appears below the hero.",
            },
          },
        },
      ],
    },
    {
      name: "hero",
      label: "Bagian Hero (Atas)",
      type: "group",
      fields: [
        {
          name: "backgroundImage",
          type: "upload",
          relationTo: "media",
          label: "Gambar Latar Belakang (Opsional)",
          required: false,
          admin: {
            description: {
              id: "Opsional. Jika kosong, hero memakai visual solar yang sama dengan beranda. Unggah gambar hanya jika ingin mengganti visual tersebut.",
              en: "Optional. When empty, the hero uses the same solar visual as the homepage. Upload an image only if you want to replace that visual.",
            },
          },
        },
        { name: "badge", type: "text", defaultValue: "TENTANG KAMI", required: true, localized: true },
        { name: "title", type: "text", defaultValue: "Building Better Decisions.", required: true, localized: true },
        {
          name: "titleHighlight",
          type: "text",
          defaultValue: "Creating Sustainable Impact.",
          required: true,
          localized: true,
        },
        {
          name: "description",
          type: "textarea",
          defaultValue: "Your One-Stop Consulting Partner",
          required: true,
          localized: true,
        },
      ],
    },
    {
      name: "stats",
      label: "Statistik Singkat (Angka)",
      type: "array",
      localized: true,
      admin: {
        description: {
          id: "Ditampilkan di frontend hanya jika 'Tampilkan Statistik' aktif.",
          en: "Shown on the frontend only when 'Show Statistics' is enabled.",
        },
      },
      fields: [
        { name: "value", type: "text", required: true, label: "Angka (misal: 7+)" },
        { name: "label", type: "text", required: true, label: "Label (misal: Area Layanan)" },
        {
          name: "icon",
          type: "select",
          options: [
            { label: "Check Circle", value: "CheckCircle2" },
            { label: "Award", value: "Award" },
            { label: "Target", value: "Target" },
            { label: "Eye", value: "Eye" },
            { label: "Users", value: "Users" },
            { label: "Building", value: "Building2" },
            { label: "Globe", value: "Globe" },
            { label: "Book Open", value: "BookOpen" },
          ],
          defaultValue: "Target",
          required: true,
        },
      ],
    },
    {
      name: "profil",
      label: "Profil Perusahaan",
      type: "group",
      fields: [
        {
          name: "paragraph1",
          type: "textarea",
          required: true,
          defaultValue:
            "PT Mahaga Widya Cita merupakan perusahaan konsultan multidisiplin Indonesia yang berkomitmen menghadirkan solusi yang terintegrasi, inovatif, dan berkelanjutan bagi instansi pemerintah, BUMN, perusahaan swasta, institusi pendidikan, serta organisasi pembangunan.",
          localized: true,
        },
        {
          name: "paragraph2",
          type: "textarea",
          required: true,
          defaultValue:
            "Kami menyediakan layanan konsultasi yang mencakup konsultasi pemerintahan, bisnis dan investasi, perpajakan, riset strategis, solusi penyediaan tenaga profesional (workforce solutions), konsultasi teknologi, serta pengembangan sumber daya manusia. Dengan menggabungkan keahlian multidisiplin, pendekatan berbasis data, dan pemanfaatan teknologi, kami membantu organisasi menghadapi tantangan yang kompleks, meningkatkan kinerja, serta menciptakan nilai yang berkelanjutan.",
          localized: true,
        },
        {
          name: "paragraph3",
          type: "textarea",
          required: true,
          defaultValue:
            "Dilandasi integritas, profesionalisme, dan inovasi, PT Mahaga Widya Cita berkomitmen menjadi mitra strategis terpercaya yang mendukung pembangunan berkelanjutan serta mendorong keunggulan organisasi di seluruh Indonesia.",
          localized: true,
        },
      ],
    },
    {
      name: "visi",
      label: "Visi",
      type: "textarea",
      localized: true,
      required: true,
      defaultValue:
        "Menjadi perusahaan konsultan multidisiplin terdepan di Indonesia yang menghadirkan solusi inovatif, berbasis data, dan berkelanjutan untuk mendorong kemajuan organisasi serta berkontribusi terhadap pembangunan nasional.",
    },
    {
      name: "misi",
      label: "Misi",
      type: "array",
      localized: true,
      fields: [
        { name: "title", type: "text", required: true },
        { name: "text", type: "textarea", required: true },
      ],
    },

    {
      name: "coreValues",
      label: "Core Value (FUTURISTIC)",
      type: "array",
      localized: true,
      fields: [
        { name: "letter", type: "text", required: true, label: "Huruf (misal: F)" },
        { name: "name", type: "text", required: true, label: "Kata (misal: FORESIGHT)" },
        { name: "desc", type: "textarea", required: true, label: "Deskripsi" },
      ],
    },

    {
      name: "ceoMessage",
      label: "Pesan CEO",
      type: "group",
      fields: [
        {
          name: "ceo",
          type: "relationship",
          relationTo: "team-members",
          required: true,
          label: "Pilih Anggota Tim (CEO)",
          admin: {
            description: "Pilih anggota tim yang akan ditampilkan sebagai CEO di halaman ini.",
          },
        },
        {
          name: "quote",
          type: "textarea",
          required: true,
          defaultValue:
            "Masa depan dibentuk oleh keputusan yang diambil hari ini. PT Mahaga Widya Cita tidak sekadar menghadirkan layanan konsultansi, tetapi merumuskan strategi dan memperkuat kapasitas sebagai fondasi transformasi jangka panjang. Berlandaskan integritas, profesionalisme, dan inovasi, kami berkomitmen menjadi mitra strategis yang mengakselerasi transformasi, menciptakan kemajuan yang bernilai, dan memperkuat daya saing.",
          localized: true,
        },
      ],
    },
  ],
};
