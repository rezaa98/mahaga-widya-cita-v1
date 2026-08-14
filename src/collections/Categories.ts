import type { CollectionConfig } from "payload";
import { universalCollectionAutoTranslate } from "../hooks/universalAutoTranslate";
import { canManageContent } from "../utils/access";

export const Categories: CollectionConfig = {
  slug: "categories",
  labels: {
    singular: { id: "Kategori", en: "Category" },
    plural: { id: "Kategori", en: "Categories" },
  },
  admin: {
    group: { id: "Manajemen Konten", en: "Content Management" },
    useAsTitle: "name",
    components: {
      edit: { beforeDocumentControls: ["@/components/admin/LocaleDocumentControls#LocaleDocumentControls"] },
    },
  },
  access: {
    read: () => true,
    create: canManageContent,
    update: canManageContent,
    delete: canManageContent,
  },
  hooks: {
    afterChange: [universalCollectionAutoTranslate],
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      localized: true,
      label: { id: "Nama Kategori", en: "Category Name" },
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      label: { id: "Slug URL", en: "URL Slug" },
      admin: {
        position: "sidebar",
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (value)
              return value
                .toLowerCase()
                .replace(/ /g, "-")
                .replace(/[^\w-]+/g, "");
            if (data?.name)
              return data.name
                .toLowerCase()
                .replace(/ /g, "-")
                .replace(/[^\w-]+/g, "");
            return value;
          },
        ],
      },
    },
  ],
};
