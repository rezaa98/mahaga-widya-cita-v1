import type { CollectionConfig } from "payload";
import { canManageMedia } from "@/utils/access";

export const Media: CollectionConfig = {
  slug: "media",
  labels: {
    singular: { id: "Media", en: "Media" },
    plural: { id: "Media", en: "Media" },
  },
  admin: {
    group: { id: "Aset", en: "Assets" },
    useAsTitle: "alt",
    defaultColumns: ["filename", "alt", "mimeType", "updatedAt"],
    listSearchableFields: ["alt", "filename"],
  },
  access: {
    read: () => true,
    create: canManageMedia,
    update: canManageMedia,
    delete: canManageMedia,
  },
  upload: {
    staticDir: "public/media",
    focalPoint: true,
    imageSizes: [
      {
        name: "thumbnail",
        width: 400,
        height: 300,
        position: "centre",
      },
      {
        name: "card",
        width: 768,
        height: 1024,
        position: "centre",
      },
      {
        name: "tablet",
        width: 1024,
        height: undefined,
        position: "centre",
      },
    ],
    adminThumbnail: "thumbnail",
    mimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif", "application/pdf"],
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
      localized: true,
      label: { id: "Teks Alternatif", en: "Alternative Text" },
      admin: {
        description: {
          id: "Deskripsikan gambar secara ringkas untuk aksesibilitas. Wajib untuk setiap media.",
          en: "Briefly describe the image for accessibility. Required for every media item.",
        },
      },
    },
    {
      name: "caption",
      type: "text",
      localized: true,
      label: { id: "Keterangan", en: "Caption" },
    },
    {
      name: "credit",
      type: "text",
      label: { id: "Kredit / Sumber", en: "Credit / Source" },
      admin: {
        description: {
          id: "Cantumkan fotografer, organisasi, atau lisensi bila diperlukan.",
          en: "Include the photographer, organization, or license when applicable.",
        },
      },
    },
  ],
};
