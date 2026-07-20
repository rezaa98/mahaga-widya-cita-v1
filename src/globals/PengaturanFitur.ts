import { GlobalConfig } from "payload";
import { isSuperAdminUser } from "../utils/access";

export const PengaturanFitur: GlobalConfig = {
  slug: "pengaturan-fitur",
  label: {
    id: "Pengaturan Fitur & Modul",
    en: "Feature & Module Settings",
  },
  admin: {
    group: {
      id: "Pengaturan Sistem",
      en: "System Settings",
    },
  },
  access: {
    read: () => true,
    update: isSuperAdminUser,
  },
  fields: [
    {
      name: "enablePolicyReviews",
      type: "checkbox",
      defaultValue: true,
      label: {
        id: "Aktifkan Modul Policy Review",
        en: "Enable Policy Review Module",
      },
      admin: {
        description: {
          id: "Jika dinonaktifkan, seluruh halaman dan tautan Policy Review di website dan Admin UI akan tersembunyi / dinonaktifkan.",
          en: "If disabled, all Policy Review pages and links on the website and Admin UI will be hidden/disabled.",
        },
      },
    },
  ],
};
