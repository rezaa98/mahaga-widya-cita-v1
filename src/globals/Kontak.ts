import { GlobalConfig } from "payload";
import { universalGlobalAutoTranslate } from "../hooks/universalAutoTranslate";
import { canManageSiteContent } from '../utils/access';

export const Kontak: GlobalConfig = {
  slug: "kontak",
  label: "Informasi Kontak",
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
      name: "heroTitle",
      label: "Judul Utama (Hero)",
      type: "text",
      localized: true,
      required: true,
      defaultValue: "Mari Berkolaborasi Bersama Kami",
    },
    {
      name: "heroSubtitle",
      label: "Sub-judul (Hero)",
      type: "textarea",
      localized: true,
      required: true,
      defaultValue:
        "Tim kami siap membantu kebutuhan edukasi dan konsultasi instansi Anda. Respons dalam 1×24 jam kerja.",
    },
    {
      name: "phone",
      label: "Telepon / WhatsApp",
      type: "text",
      localized: true,
      required: true,
      defaultValue: "082 332 567 816",
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      required: true,
      defaultValue: "mwidyacita@gmail.com",
    },
    {
      name: "address",
      label: "Alamat",
      type: "textarea",
      localized: true,
      required: true,
      defaultValue: "Jalan Iskandar RT 008 RW 000 Madurejo, Arut Selatan, Kab Kotawaringin Barat, Kalimantan Tengah",
    },
    {
      name: "workingHours",
      label: "Jam Kerja",
      type: "text",
      localized: true,
      required: true,
      defaultValue: "Senin – Jumat, 08.00 – 17.00 WIB",
    },
    {
      name: "locationTag",
      label: "Tag Lokasi (Singkat)",
      type: "text",
      localized: true,
      required: true,
      defaultValue: "Pangkalan Bun, Kalimantan Tengah",
      admin: {
        description: "Teks singkat untuk ikon pin peta (misal: Jakarta Selatan, DKI Jakarta)",
      },
    },
    {
      name: "whatsappCta",
      label: "Pengaturan Tombol WhatsApp",
      type: "group",
      fields: [
        {
          name: "title",
          label: "Judul Tombol",
          type: "text",
          localized: true,
          required: true,
          defaultValue: "Chat via WhatsApp",
        },
        {
          name: "subtitle",
          label: "Sub-judul Tombol",
          type: "text",
          localized: true,
          required: true,
          defaultValue: "Respons lebih cepat, langsung ke tim kami",
        },
        {
          name: "defaultMessage",
          label: "Pesan Default (Otomatis terisi)",
          type: "textarea",
          localized: true,
          required: true,
          defaultValue: "Halo, saya ingin berkonsultasi dengan tim PT Mahaga Widya Cita.",
        },
      ],
    },
    {
      name: "formSubjects",
      label: "Pilihan Subjek Formulir",
      type: "array",
      minRows: 1,
      admin: {
        description: "Daftar pilihan keperluan / subjek yang akan muncul di dropdown formulir kontak.",
      },
      fields: [
        {
          name: "subject",
          label: "Subjek",
          type: "text",
          localized: true,
          required: true,
        },
      ],
      defaultValue: [
        { subject: "Konsultasi Tata Kelola" },
        { subject: "Smart Executive Education" },
        { subject: "Smart Software Service" },
        { subject: "Smart Online Course" },
        { subject: "Pendaftaran Webinar" },
        { subject: "Kemitraan & Kolaborasi" },
        { subject: "Lainnya" },
      ],
    },
  ],
};
