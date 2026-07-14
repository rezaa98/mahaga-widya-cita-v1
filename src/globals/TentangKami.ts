import { GlobalConfig } from "payload";
import { universalGlobalAutoTranslate } from "../hooks/universalAutoTranslate";

export const TentangKami: GlobalConfig = {
  slug: "tentang-kami",
  label: "Halaman Tentang Kami",
  admin: {
    group: "Website",
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [universalGlobalAutoTranslate],
  },
  fields: [
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
            description: "Unggah gambar untuk mengganti background warna gradient di hero section.",
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
      fields: [
        { name: "value", type: "text", required: true, label: "Angka (misal: 7+)" },
        { name: "label", type: "text", required: true, label: "Label (misal: Area Layanan)", localized: true },
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
      fields: [
        { name: "title", type: "text", required: true, localized: true },
        { name: "text", type: "textarea", required: true, localized: true },
      ],
    },

    {
      name: "coreValues",
      label: "Core Value (FUTURISTIC)",
      type: "array",
      fields: [
        { name: "letter", type: "text", required: true, label: "Huruf (misal: F)", localized: true },
        { name: "name", type: "text", required: true, label: "Kata (misal: FORESIGHT)", localized: true },
        { name: "desc", type: "textarea", required: true, label: "Deskripsi", localized: true },
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
            "Kami percaya bahwa kualitas tata kelola suatu bangsa dimulai dari kualitas manusianya. Setiap program yang kami rancang adalah investasi jangka panjang bagi kemajuan Indonesia — sebuah misi yang kami emban dengan penuh dedikasi dan kebanggaan.",
          localized: true,
        },
      ],
    },
  ],
};
