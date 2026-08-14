import type { CollectionConfig } from "payload";
import { canBootstrapOrManageUsers, canManageUsers, canReadUser, canUpdateUser } from "../utils/access";
import { generateResetPasswordEmail } from "../utils/resetPasswordEmail";

export const Users: CollectionConfig = {
  slug: "users",
  labels: {
    singular: { id: "Pengguna", en: "User" },
    plural: { id: "Pengguna", en: "Users" },
  },
  admin: {
    group: { id: "Sistem", en: "System" },
    useAsTitle: "email",
  },
  auth: {
    forgotPassword: {
      expiration: 60 * 60 * 1000,
      generateEmailHTML: (args) => generateResetPasswordEmail({ email: args?.user?.email, token: args?.token }),
      generateEmailSubject: () => "Atur ulang kata sandi | PT Mahaga Widya Cita",
    },
  },
  access: {
    // The first account becomes a super administrator. Every following user
    // management action is limited to an existing super administrator.
    create: canBootstrapOrManageUsers,
    read: canReadUser,
    update: canUpdateUser,
    delete: canManageUsers,
  },
  hooks: {
    beforeChange: [
      async ({ data, operation, req }) => {
        if (operation !== "create") return data;

        const { totalDocs } = await req.payload.count({
          collection: "users",
          overrideAccess: true,
        });

        return totalDocs === 0 ? { ...data, role: "super_admin" } : data;
      },
    ],
  },
  fields: [
    {
      name: "role",
      type: "select",
      label: { id: "Peran", en: "Role" },
      options: [
        { label: "Super Admin", value: "super_admin" },
        { label: "Admin", value: "admin" },
        { label: "Editor", value: "editor" },
        { label: "Reviewer", value: "reviewer" },
        { label: "Member (Legacy / Read-only)", value: "member" },
      ],
      defaultValue: "editor",
      required: true,
      saveToJWT: true,
      access: {
        create: canManageUsers,
        update: canManageUsers,
      },
      admin: {
        description: {
          id: "Member dipertahankan untuk akun lama dan hanya memiliki akses baca. Gunakan Editor, Reviewer, Admin, atau Super Admin untuk akun baru.",
          en: "Member is retained for legacy read-only accounts. Use Editor, Reviewer, Admin, or Super Admin for new accounts.",
        },
      },
    },
  ],
};
