import { GlobalConfig } from "payload";
import { universalGlobalAutoTranslate } from "../hooks/universalAutoTranslate";
import { canManageSiteContent } from "../utils/access";

export const Navbar: GlobalConfig = {
  slug: "navbar",
  label: { id: "Navbar (Menu Atas)", en: "Navbar (Top Menu)" },
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
      name: "links",
      label: { id: "Daftar Menu Navigasi", en: "Navigation Menu" },
      type: "array",
      required: true,
      fields: [
        {
          name: "label",
          label: { id: "Label Menu (contoh: Tentang Kami)", en: "Menu Label (example: About Us)" },
          type: "text",
          localized: true,
          required: true,
        },
        {
          name: "href",
          label: { id: "URL Tautan", en: "Link URL" },
          type: "text",
          localized: true,
          required: true,
        },
        {
          name: "children",
          label: { id: "Submenu (Dropdown) — Opsional", en: "Optional Dropdown Submenu" },
          type: "array",
          fields: [
            {
              name: "label",
              label: { id: "Label Submenu", en: "Submenu Label" },
              type: "text",
              localized: true,
              required: true,
            },
            {
              name: "href",
              label: { id: "URL Tautan", en: "Link URL" },
              type: "text",
              localized: true,
              required: true,
            },
          ],
        },
      ],
      defaultValue: [
        {
          label: "Tentang Kami",
          href: "/tentang-kami",
          children: [
            { label: "Profil Perusahaan", href: "/tentang-kami" },
            { label: "Manajemen", href: "/tim#manajemen" },
            { label: "Tenaga Ahli", href: "/tim#ahli" },
            { label: "Our DNA", href: "/tentang-kami#our-dna" },
          ],
        },
        {
          label: "Layanan",
          href: "/layanan",
          children: [
            { label: "Smart Consulting", href: "/layanan/konsultasi" },
            { label: "Smart Executive Education", href: "/layanan/edukasi" },
            { label: "Smart Software Service", href: "/layanan/software" },
            { label: "Smart Governance Review", href: "/layanan/governance-review" },
            { label: "Smart Online Course", href: "/layanan/online-course" },
            { label: "Smart Digital Conference", href: "/layanan/digital-conference" },
          ],
        },
        {
          label: "Artikel",
          href: "/artikel",
          children: [
            { label: "Untuk Individu", href: "/artikel?kategori=individu" },
            { label: "Untuk Bisnis", href: "/artikel?kategori=bisnis" },
            { label: "Untuk Pemerintah", href: "/artikel?kategori=pemerintah" },
            { label: "Jurnal", href: "/jurnal" },
            { label: "Policy Review", href: "/policy-reviews" },
          ],
        },
        { label: "Kontak", href: "/kontak" },
      ],
    },
  ],
};
