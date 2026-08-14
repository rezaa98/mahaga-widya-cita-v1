import { GlobalConfig } from "payload";
import { universalGlobalAutoTranslate } from "../hooks/universalAutoTranslate";
import { canManageSiteContent } from "../utils/access";

export const Footer: GlobalConfig = {
  slug: "footer",
  label: { id: "Footer", en: "Footer" },
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
      name: "companyDescription",
      label: { id: "Deskripsi Singkat Perusahaan", en: "Short Company Description" },
      type: "textarea",
      localized: true,
      required: true,
      defaultValue:
        "Platform terdepan untuk edukasi profesional dan penguatan tata kelola bagi ASN dan profesional Indonesia.",
    },
    {
      name: "socialMedia",
      label: { id: "Media Sosial", en: "Social Media" },
      type: "array",
      fields: [
        {
          name: "platform",
          type: "select",
          required: true,
          options: [
            { label: "Instagram", value: "instagram" },
            { label: "YouTube", value: "youtube" },
            { label: "LinkedIn", value: "linkedin" },
            { label: "Twitter / X", value: "twitter" },
          ],
        },
        {
          name: "url",
          label: { id: "URL Tautan", en: "Link URL" },
          type: "text",
          localized: true,
          required: true,
        },
      ],
      defaultValue: [
        { platform: "instagram", url: "#" },
        { platform: "youtube", url: "#" },
        { platform: "linkedin", url: "#" },
        { platform: "twitter", url: "#" },
      ],
    },
    {
      name: "linksCompany",
      label: { id: "Tautan Kolom Perusahaan", en: "Company Column Links" },
      type: "array",
      fields: [
        { name: "label", type: "text", required: true, localized: true },
        { name: "url", type: "text", required: true, localized: true },
      ],
      defaultValue: [
        { label: "Profil Perusahaan", url: "/tentang-kami" },
        { label: "Manajemen", url: "/tentang-kami#manajemen" },
        { label: "Tenaga Ahli", url: "/tentang-kami#ahli" },
        { label: "Mitra", url: "/mitra" },
        { label: "Karir", url: "/karir" },
      ],
    },
    {
      name: "linksServices",
      label: { id: "Tautan Kolom Layanan", en: "Services Column Links" },
      type: "array",
      fields: [
        { name: "label", type: "text", required: true, localized: true },
        { name: "url", type: "text", required: true, localized: true },
      ],
      defaultValue: [
        { label: "Smart Consulting", url: "/layanan/konsultasi" },
        { label: "Smart Executive Education", url: "/layanan/edukasi" },
        { label: "Smart Software Service", url: "/layanan/software" },
        { label: "Smart Governance Review", url: "/layanan/governance-review" },
        { label: "Smart Online Course", url: "/kursus" },
        { label: "Smart Digital Conference", url: "/webinar" },
      ],
    },
    {
      name: "copyrightText",
      label: { id: "Teks Hak Cipta", en: "Copyright Text" },
      type: "text",
      localized: true,
      required: true,
      defaultValue: "PT Mahaga Widya Cita. Hak Cipta Dilindungi.",
      admin: {
        description:
          "Tahun akan ditambahkan secara otomatis (contoh: © 2026 PT Mahaga Widya Cita. Hak Cipta Dilindungi.)",
      },
    },
  ],
};
