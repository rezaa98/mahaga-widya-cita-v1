import type { CollectionConfig } from "payload";
import { APIError } from "payload";
import { universalCollectionAutoTranslate } from "../hooks/universalAutoTranslate";
import { canManageContent, canManageOwnContentOrReview, canPublishContent, canReviewContent } from "../utils/access";

const EDITOR_STATUSES = ["draft", "in_review", "revision_requested"];
const REVIEWER_STATUSES = ["in_review", "revision_requested", "approved"];

function guardPolicyReviewStatusTransition({ data, originalDoc, operation, req }: any) {
  if (req.context?.skipAutoTranslate) return data;

  if (operation === "create" && req.user?.id && !canPublishContent({ req })) {
    data.author = req.user.id;
  }

  const nextStatus = data.status || originalDoc?.status || "draft";

  if (canPublishContent({ req })) {
    if (nextStatus === "published" && originalDoc?.status !== "published" && !data.publishedAt) {
      data.publishedAt = new Date().toISOString();
    }
    return data;
  }

  if (canReviewContent({ req })) {
    if (operation === "create" || !REVIEWER_STATUSES.includes(nextStatus)) {
      throw new APIError("Reviewer tidak memiliki izin untuk menerbitkan atau menjadwalkan policy review.", 403);
    }
    return data;
  }

  if (canManageContent({ req }) && EDITOR_STATUSES.includes(nextStatus)) {
    return data;
  }

  throw new APIError("Status policy review ini tidak dapat diubah dengan peran Anda.", 403);
}

export const PolicyReviews: CollectionConfig = {
  slug: "policy-reviews",
  labels: {
    singular: { id: "Policy Review", en: "Policy Review" },
    plural: { id: "Policy Reviews", en: "Policy Reviews" },
  },
  versions: { drafts: { autosave: true }, maxPerDoc: 15 },
  admin: {
    group: { id: "Manajemen Konten", en: "Content Management" },
    useAsTitle: "title",
    defaultColumns: ["title", "status", "updatedAt"],
    listSearchableFields: ["title", "slug", "summary"],
    components: {
      edit: {
        beforeDocumentControls: [
          "@/components/admin/LocaleDocumentControls#LocaleDocumentControls",
          "@/components/admin/EditorActionBar#EditorActionBar",
        ],
      },
    },
    hidden: ({ user }) => {
      if (!user) return true;
      return false;
    },
  },
  access: {
    // Public visitors can only retrieve published reviews. CMS users retain
    // access to drafts so editorial work can happen safely in the admin.
    read: async ({ req }) => {
      try {
        const settings = await req.payload.findGlobal({ slug: "pengaturan-fitur" as any });
        if (settings?.enablePolicyReviews === false && req.user?.role !== "super_admin") {
          return false;
        }
      } catch (e) {
        // Fallback
      }

      if (req.user) return true;

      // Records created before this workflow had no status and were already
      // public. Keep those visible until they are explicitly migrated.
      return {
        or: [{ status: { equals: "published" } }, { status: { exists: false } }],
      };
    },
    create: canManageContent,
    update: canManageOwnContentOrReview,
    delete: canPublishContent,
  },
  hooks: {
    beforeChange: [guardPolicyReviewStatusTransition],
    afterChange: [universalCollectionAutoTranslate],
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Konten Ulasan",
          fields: [
            {
              name: "title",
              type: "text",
              required: true,
              localized: true,
              label: "Judul Policy Review",
              access: {
                update: canManageContent,
              },
            },
            {
              name: "summary",
              type: "richText",
              localized: true,
              label: "Ringkasan (Summary)",
              access: {
                update: canManageContent,
              },
            },
            {
              name: "excerpt",
              type: "textarea",
              localized: true,
              maxLength: 320,
              label: "Deskripsi Singkat",
              admin: {
                description: "Dipakai pada metadata SEO dan preview Policy Review.",
              },
              access: {
                update: canManageContent,
              },
            },
          ],
        },
        {
          label: "Dokumen",
          fields: [
            {
              name: "document",
              type: "upload",
              relationTo: "media",
              required: true,
              label: "File Dokumen (PDF dll)",
              access: {
                update: canManageContent,
              },
            },
          ],
        },
      ],
    },
    {
      name: "slug",
      type: "text",
      unique: true,
      admin: {
        position: "sidebar",
      },
      access: {
        update: canManageContent,
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (value)
              return value
                .toLowerCase()
                .replace(/ /g, "-")
                .replace(/[^\w-]+/g, "");
            if (data?.title)
              return data.title
                .toLowerCase()
                .replace(/ /g, "-")
                .replace(/[^\w-]+/g, "");
            return value;
          },
        ],
      },
    },
    {
      name: "author",
      type: "relationship",
      relationTo: "users",
      admin: {
        position: "sidebar",
        readOnly: true,
      },
      access: {
        create: canPublishContent,
        update: canPublishContent,
      },
    },
    {
      name: "status",
      type: "select",
      label: { id: "Status Editorial", en: "Editorial Status" },
      options: [
        { label: "Draft", value: "draft" },
        { label: { id: "Menunggu Review", en: "In Review" }, value: "in_review" },
        { label: { id: "Perlu Revisi", en: "Revision Required" }, value: "revision_requested" },
        { label: { id: "Disetujui", en: "Approved" }, value: "approved" },
        { label: { id: "Terjadwal", en: "Scheduled" }, value: "scheduled" },
        { label: "Published", value: "published" },
        { label: { id: "Diarsipkan", en: "Archived" }, value: "archived" },
      ],
      defaultValue: "draft",
      required: true,
      admin: {
        position: "sidebar",
        components: { Cell: "@/components/admin/EditorialStatusCell#EditorialStatusCell" },
      },
      access: {
        // The beforeChange hook validates the exact transition. Field access
        // only decides which editorial roles may submit a status value.
        create: canManageContent,
        update: ({ req }) => canManageContent({ req }) || canPublishContent({ req }) || canReviewContent({ req }),
      },
    },
    {
      name: "publishedAt",
      type: "date",
      admin: {
        position: "sidebar",
        condition: (data) => data.status === "published" || data.status === "scheduled",
      },
      access: {
        create: canPublishContent,
        update: canPublishContent,
      },
    },
    {
      name: "reviewNotes",
      type: "textarea",
      label: "Catatan Review",
      admin: {
        position: "sidebar",
      },
      access: {
        create: canReviewContent,
        update: canReviewContent,
      },
    },
  ],
};
