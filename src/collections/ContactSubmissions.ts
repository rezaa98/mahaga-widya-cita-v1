import type { CollectionConfig } from "payload";
import { canManageAudience, canViewAudience } from "../utils/access";

export const ContactSubmissions: CollectionConfig = {
  slug: "contact-submissions",
  labels: {
    singular: { id: "Pesan Masuk", en: "Contact Message" },
    plural: { id: "Pesan Masuk Formulir", en: "Inbox Messages" },
  },
  admin: {
    group: { id: "Pesan & Pengunjung", en: "Messages & Visitors" },
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
      label: { id: "Nama Lengkap", en: "Full Name" },
    },
    {
      name: "email",
      type: "email",
      required: true,
      label: { id: "Alamat Email", en: "Email Address" },
    },
    {
      name: "phone",
      type: "text",
      label: { id: "Nomor Telepon", en: "Phone Number" },
      maxLength: 30,
    },
    {
      name: "institution",
      type: "text",
      label: { id: "Instansi / Perusahaan", en: "Institution / Company" },
      maxLength: 150,
    },
    {
      name: "subject",
      type: "text",
      required: true,
      maxLength: 150,
      label: { id: "Subjek Pesan", en: "Message Subject" },
    },
    {
      name: "message",
      type: "textarea",
      required: true,
      maxLength: 5000,
      label: { id: "Isi Pesan", en: "Message" },
    },
  ],
};
