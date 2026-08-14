import type { CollectionConfig } from "payload";
import { universalCollectionAutoTranslate } from "../hooks/universalAutoTranslate";
import { canManageSiteContent } from "../utils/access";

export const Services: CollectionConfig = {
  slug: "services",
  labels: {
    singular: { id: "Layanan", en: "Service" },
    plural: { id: "Layanan", en: "Services" },
  },
  admin: {
    group: { id: "Profil Perusahaan", en: "Corporate Profile" },
    useAsTitle: "title",
    defaultColumns: ["title", "slug", "updatedAt"],
    components: {
      edit: { beforeDocumentControls: ["@/components/admin/LocaleDocumentControls#LocaleDocumentControls"] },
    },
  },
  access: {
    read: () => true,
    create: canManageSiteContent,
    update: canManageSiteContent,
    delete: canManageSiteContent,
  },
  hooks: {
    afterChange: [universalCollectionAutoTranslate],
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: { id: "Informasi Dasar", en: "Basic Information" },
          fields: [
            {
              name: "title",
              type: "text",
              required: true,
              localized: true,
              label: { id: "Judul Layanan", en: "Service Title" },
            },
            {
              name: "slug",
              type: "text",
              required: true,
              unique: true,
              index: true,
              label: { id: "Slug URL (contoh: konsultasi)", en: "URL Slug (example: consulting)" },
            },
            {
              name: "tagline",
              type: "text",
              required: true,
              localized: true,
              label: { id: "Tagline Singkat", en: "Short Tagline" },
            },
            {
              name: "description",
              type: "textarea",
              required: true,
              localized: true,
              label: { id: "Deskripsi Layanan", en: "Service Description" },
            },
          ],
        },
        {
          label: { id: "Tampilan & Tema", en: "Appearance & Theme" },
          fields: [
            {
              name: "color",
              type: "text",
              required: true,
              defaultValue: "var(--color-primary-600)",
              label: { id: "Warna Tema (Hex / CSS Var)", en: "Theme Color (Hex / CSS Var)" },
            },
            {
              name: "gradient",
              type: "text",
              required: true,
              defaultValue: "linear-gradient(135deg, #1E6FD9, #0B2D6B)",
              label: { id: "Gradien Banner", en: "Banner Gradient" },
            },
          ],
        },
        {
          label: { id: "Detail Konten", en: "Content Details" },
          fields: [
            {
              name: "features",
              type: "array",
              label: { id: "Fitur Utama", en: "Key Features" },
              fields: [
                {
                  name: "feature",
                  type: "text",
                  localized: true,
                  required: true,
                },
              ],
            },
            {
              name: "benefits",
              type: "array",
              label: { id: "Keuntungan", en: "Benefits" },
              fields: [
                {
                  name: "title",
                  type: "text",
                  localized: true,
                  required: true,
                },
                {
                  name: "desc",
                  type: "text",
                  localized: true,
                  required: true,
                },
              ],
            },
            {
              name: "targetAudience",
              type: "array",
              label: { id: "Target Audiens", en: "Target Audience" },
              fields: [
                {
                  name: "audience",
                  type: "text",
                  localized: true,
                  required: true,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
