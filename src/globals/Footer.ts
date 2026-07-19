import { GlobalConfig } from "payload";
import { universalGlobalAutoTranslate } from "../hooks/universalAutoTranslate";
import { canManageSiteContent } from '../utils/access';

export const Footer: GlobalConfig = {
  slug: "footer",
  label: "Footer",
  admin: {
    group: "Website",
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
      label: "Deskripsi Singkat Perusahaan",
      type: "textarea",
      localized: true,
      required: true,
      defaultValue:
        "Platform terdepan untuk edukasi profesional dan penguatan tata kelola bagi ASN dan profesional Indonesia.",
    },
    {
      name: "socialMedia",
      label: "Media Sosial",
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
          label: "URL Tautan",
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
      label: "Tautan Kolom Perusahaan",
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
      label: "Tautan Kolom Layanan",
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
      label: "Teks Hak Cipta (Copyright)",
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
