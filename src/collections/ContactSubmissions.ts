import type { CollectionConfig } from "payload";
import { canManageAudience, canViewAudience } from "../utils/access";

export const ContactSubmissions: CollectionConfig = {
  slug: "contact-submissions",
  labels: {
    singular: { id: "Pesan Masuk", en: "Contact Submission" },
    plural: { id: "Pesan Masuk", en: "Contact Submissions" },
  },
  admin: {
    group: { id: "Data Audiens", en: "Audience Data" },
    useAsTitle: "name",
    defaultColumns: ["name", "email", "subject", "createdAt"],
  },
  access: {
    read: canViewAudience,
    create: canManageAudience,
    update: canManageAudience,
    delete: canManageAudience,
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      maxLength: 100,
      label: "Nama Lengkap",
    },
    {
      name: "email",
      type: "email",
      required: true,
      label: "Alamat Email",
    },
    {
      name: "phone",
      type: "text",
      label: "Nomor Telepon",
      maxLength: 30,
    },
    {
      name: "institution",
      type: "text",
      label: "Instansi / Perusahaan",
      maxLength: 150,
    },
    {
      name: "subject",
      type: "text",
      required: true,
      maxLength: 150,
      label: "Subjek Pesan",
    },
    {
      name: "message",
      type: "textarea",
      required: true,
      maxLength: 5000,
      label: "Isi Pesan",
    },
  ],
};
