import { GlobalConfig } from "payload";
import { universalGlobalAutoTranslate } from "../hooks/universalAutoTranslate";
import { canManageSiteContent } from "../utils/access";

export const Kontak: GlobalConfig = {
  slug: "kontak",
  label: { id: "Informasi Kontak", en: "Contact Information" },
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
      name: "heroTitle",
      label: { id: "Judul Utama (Hero)", en: "Main Hero Title" },
      type: "text",
      localized: true,
      required: true,
      defaultValue: "Mari Berkolaborasi Bersama Kami",
    },
    {
      name: "heroSubtitle",
      label: { id: "Subjudul (Hero)", en: "Hero Subtitle" },
      type: "textarea",
      localized: true,
      required: true,
      defaultValue: "Tim kami siap membantu kebutuhan edukasi dan konsultasi instansi Anda.",
    },
    {
      name: "phone",
      label: { id: "Telepon / WhatsApp", en: "Phone / WhatsApp" },
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
      label: { id: "Alamat", en: "Address" },
      type: "textarea",
      localized: true,
      required: true,
      defaultValue: "Jalan Iskandar RT 008 RW 000 Madurejo, Arut Selatan, Kab Kotawaringin Barat, Kalimantan Tengah",
    },
    {
      name: "workingHours",
      label: { id: "Jam Kerja", en: "Business Hours" },
      type: "text",
      localized: true,
      required: true,
      defaultValue: "Senin – Jumat, 08.00 – 17.00 WIB",
    },
    {
      name: "locationTag",
      label: { id: "Tag Lokasi (Singkat)", en: "Short Location Tag" },
      type: "text",
      localized: true,
      required: true,
      defaultValue: "Pangkalan Bun, Kalimantan Tengah",
      admin: {
        description: {
          id: "Teks singkat untuk ikon pin peta (misal: Jakarta Selatan, DKI Jakarta).",
          en: "Short text displayed beside the map pin (for example: South Jakarta, Jakarta).",
        },
      },
    },
    {
      name: "whatsappCta",
      label: { id: "Pengaturan Tombol WhatsApp", en: "WhatsApp Button Settings" },
      type: "group",
      fields: [
        {
          name: "title",
          label: { id: "Judul Tombol", en: "Button Title" },
          type: "text",
          localized: true,
          required: true,
          defaultValue: "Chat via WhatsApp",
        },
        {
          name: "subtitle",
          label: { id: "Subjudul Tombol", en: "Button Subtitle" },
          type: "text",
          localized: true,
          required: true,
          defaultValue: "Respons lebih cepat, langsung ke tim kami",
        },
        {
          name: "defaultMessage",
          label: { id: "Pesan Default (Otomatis terisi)", en: "Default Prefilled Message" },
          type: "textarea",
          localized: true,
          required: true,
          defaultValue: "Halo, saya ingin berkonsultasi dengan tim PT Mahaga Widya Cita.",
        },
      ],
    },
    {
      name: "formSubjects",
      label: { id: "Pilihan Subjek Formulir", en: "Form Subject Options" },
      type: "array",
      minRows: 1,
      admin: {
        description: {
          id: "Daftar pilihan keperluan atau subjek pada formulir kontak.",
          en: "Options displayed in the contact form subject dropdown.",
        },
      },
      fields: [
        {
          name: "subject",
          label: { id: "Subjek", en: "Subject" },
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
