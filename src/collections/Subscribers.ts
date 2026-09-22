import type { CollectionConfig } from "payload";
import { canManageAudience, canViewAudience } from "../utils/access";

export const Subscribers: CollectionConfig = {
  slug: "subscribers",
  labels: {
    singular: { id: "Pelanggan", en: "Subscriber" },
    plural: { id: "Daftar Email / Newsletter", en: "Email Subscribers" },
  },
  admin: {
    group: { id: "Pesan & Pengunjung", en: "Messages & Visitors" },
    useAsTitle: "email",
    defaultColumns: ["email", "createdAt"],
  },
  access: {
    read: canViewAudience,
    create: canManageAudience,
    update: canManageAudience,
    delete: canManageAudience,
  },
  fields: [
    {
      name: "email",
      type: "email",
      required: true,
      unique: true,
      label: { id: "Alamat Email", en: "Email Address" },
    },
  ],
};
