import type { CollectionConfig } from "payload";
import { isAdminApiUser } from "@/utils/access";

export const TranslationRecords: CollectionConfig = {
  slug: "translation-records",
  labels: {
    singular: { id: "Status Terjemahan", en: "Translation Status" },
    plural: { id: "Status Terjemahan", en: "Translation Statuses" },
  },
  admin: {
    hidden: true,
    useAsTitle: "resourceKey",
  },
  access: {
    read: ({ req }) => isAdminApiUser(req.user),
    create: ({ req }) => isAdminApiUser(req.user),
    update: ({ req }) => isAdminApiUser(req.user),
    delete: ({ req }) => req.user?.role === "super_admin",
  },
  fields: [
    { name: "resourceKey", type: "text", required: true, unique: true, index: true },
    {
      name: "resourceType",
      type: "select",
      required: true,
      options: [
        { label: "Collection", value: "collection" },
        { label: "Global", value: "global" },
      ],
    },
    { name: "identifier", type: "text", required: true, index: true },
    { name: "resourceId", type: "text", index: true },
    { name: "targetLocale", type: "select", required: true, defaultValue: "en", options: ["en"] },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "not_generated",
      index: true,
      options: ["not_generated", "queued", "translating", "needs_update", "needs_review", "approved", "failed"],
    },
    { name: "sourceHash", type: "text", index: true },
    { name: "sourceUpdatedAt", type: "date" },
    { name: "candidateData", type: "json" },
    { name: "generatedFields", type: "json" },
    { name: "manualLocks", type: "json", defaultValue: [] },
    { name: "translatedAt", type: "date" },
    { name: "provider", type: "text" },
    { name: "model", type: "text" },
    { name: "metrics", type: "json" },
    { name: "lastError", type: "textarea" },
    { name: "approvedAt", type: "date" },
    { name: "approvedBy", type: "relationship", relationTo: "users" },
  ],
};
