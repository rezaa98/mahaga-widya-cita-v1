import type { CollectionConfig } from "payload";
import { universalCollectionAutoTranslate } from "../hooks/universalAutoTranslate";
import { canManageSiteContent } from "../utils/access";

export const TeamMembers: CollectionConfig = {
  slug: "team-members",
  labels: {
    singular: { id: "Anggota Tim", en: "Team Member" },
    plural: { id: "Tim Ahli", en: "Team Members" },
  },
  admin: {
    group: { id: "Profil Perusahaan", en: "Corporate Profile" },
    useAsTitle: "name",
    defaultColumns: ["name", "category", "expertise", "updatedAt"],
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
          label: { id: "Data Profil", en: "Profile Details" },
          fields: [
            {
              name: "photo",
              type: "upload",
              relationTo: "media",
              label: { id: "Foto Profil", en: "Profile Photo" },
            },
            {
              name: "name",
              type: "text",
              required: true,
              localized: true,
              label: { id: "Nama Lengkap", en: "Full Name" },
            },
            {
              name: "initials",
              type: "text",
              required: true,
              label: { id: "Inisial (Maks 3 huruf)", en: "Initials (Max. 3 characters)" },
              maxLength: 3,
            },
            {
              name: "bio",
              type: "textarea",
              localized: true,
              label: { id: "Profil Singkat", en: "Short Profile" },
            },
          ],
        },
        {
          label: { id: "Jabatan & Afiliasi", en: "Role & Affiliation" },
          fields: [
            {
              name: "category",
              type: "select",
              required: true,
              label: { id: "Kategori Tim", en: "Team Category" },
              options: [
                { label: { id: "Manajemen Perusahaan", en: "Company Management" }, value: "management" },
                { label: { id: "Tenaga Ahli Profesional", en: "Professional Expert" }, value: "expert" },
              ],
              defaultValue: "expert",
            },
            {
              name: "role",
              type: "text",
              localized: true,
              label: { id: "Jabatan", en: "Role" },
              admin: {
                description: {
                  id: "Jabatan dalam manajemen atau peran profesional yang ditampilkan pada kartu profil.",
                  en: "The management position or professional role displayed on the profile card.",
                },
              },
            },
            {
              name: "expertise",
              type: "text",
              localized: true,
              label: { id: "Bidang Keahlian", en: "Area of Expertise" },
              admin: {
                description: {
                  id: "Opsional. Kosongkan jika anggota tim tidak perlu menampilkan bidang keahlian.",
                  en: "Optional. Leave blank when an area of expertise does not need to be displayed.",
                },
              },
            },
            {
              name: "institution",
              type: "text",
              localized: true,
              label: { id: "Instansi Asal (Khusus Tenaga Ahli)", en: "Institution (Experts Only)" },
              admin: {
                condition: (data) => data.category === "expert",
              },
            },
          ],
        },
        {
          label: { id: "Tampilan Lanjutan", en: "Advanced Appearance" },
          fields: [
            {
              name: "color",
              type: "text",
              required: true,
              defaultValue: "linear-gradient(135deg, #1E6FD9, #0B2D6B)",
              label: { id: "Gradien Warna (CSS)", en: "Color Gradient (CSS)" },
            },
            {
              name: "order",
              type: "number",
              label: { id: "Urutan Tampil", en: "Display Order" },
              defaultValue: 0,
              admin: {
                description: {
                  id: "Semakin kecil angkanya, semakin atas tampilannya.",
                  en: "Lower numbers appear first.",
                },
              },
            },
          ],
        },
      ],
    },
  ],
};
