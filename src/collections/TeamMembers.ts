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
              admin: {
                description: {
                  id: "💡 Rekomendasi: Pas foto formal rasio 3:4 atau 1:1, latar belakang bersih atau transparan.",
                  en: "💡 Recommended: Formal portrait photo with 3:4 or 1:1 ratio and clean background.",
                },
              },
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
              label: { id: "Inisial (Otomatis / Maks 3 huruf)", en: "Initials (Auto / Max. 3 characters)" },
              maxLength: 3,
              admin: {
                placeholder: "Otomatis dari nama (misal: AF)",
                description: {
                  id: "💡 Dibuat otomatis dari huruf depan nama. Tampil sebagai avatar bila foto belum diunggah.",
                  en: "💡 Automatically generated from initials. Displayed as avatar if photo is not yet uploaded.",
                },
              },
              hooks: {
                beforeValidate: [
                  ({ value, data }) => {
                    if (value && String(value).trim()) {
                      return String(value).trim().toUpperCase().slice(0, 3);
                    }
                    const rawName =
                      typeof data?.name === "string"
                        ? data.name
                        : typeof data?.name === "object" && data?.name
                          ? (data.name as any).id || (data.name as any).en
                          : "";
                    if (rawName) {
                      const words = String(rawName)
                        .replace(/^(Dr\.|Prof\.|Ir\.|H\.|Hj\.)\s+/gi, "")
                        .trim()
                        .split(/\s+/);
                      const inits = words
                        .map((w) => w[0])
                        .filter(Boolean)
                        .join("")
                        .toUpperCase()
                        .slice(0, 3);
                      return inits || "MWC";
                    }
                    return value || "MWC";
                  },
                ],
              },
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
