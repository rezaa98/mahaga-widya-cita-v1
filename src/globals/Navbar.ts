import { GlobalConfig } from "payload";

export const Navbar: GlobalConfig = {
  slug: "navbar",
  label: "Navbar (Menu Atas)",
  admin: {
    group: "Website",
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "links",
      label: "Daftar Menu Navigasi",
      type: "array",
      required: true,
      fields: [
        {
          name: "label",
          label: "Label Menu (contoh: Tentang Kami)",
          type: "text",
          localized: true,
          required: true,
        },
        {
          name: "href",
          label: "URL Tautan",
          type: "text",
          localized: true,
          required: true,
        },
        {
          name: "children",
          label: "Sub Menu (Dropdown) - Opsional",
          type: "array",
          fields: [
            {
              name: "label",
              label: "Label Sub Menu",
              type: "text",
              localized: true,
              required: true,
            },
            {
              name: "href",
              label: "URL Tautan",
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
            { label: "Policy Review", href: "/policy-reviews" },
          ],
        },
        { label: "Kontak", href: "/kontak" },
      ],
    },
  ],
};
