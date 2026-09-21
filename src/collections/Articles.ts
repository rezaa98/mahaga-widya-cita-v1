import type { CollectionConfig } from "payload";
import { APIError } from "payload";
import { universalCollectionAutoTranslate } from "../hooks/universalAutoTranslate";
import {
  canManageContent,
  canManageOwnContent,
  canManageOwnContentOrReview,
  canPublishContent,
  canReadPublishedOrAuthenticated,
  canReviewContent,
} from "@/utils/access";

const EDITOR_STATUSES = ["draft", "in_review", "revision_requested"];
const REVIEWER_STATUSES = ["in_review", "revision_requested", "approved"];

function extractPlainTextFromLexical(lexical: any): string {
  if (!lexical) return "";
  const texts: string[] = [];
  const walk = (node: any) => {
    if (!node) return;
    if (typeof node.text === "string" && node.text.trim()) {
      texts.push(node.text.trim());
    }
    if (Array.isArray(node.children)) {
      node.children.forEach(walk);
    }
  };
  walk(lexical.root || lexical);
  return texts.join(" ").trim();
}

/**
 * Collection access determines which documents a role may open. This hook
 * protects the status transition itself, including requests made outside the
 * admin UI, so an editor cannot publish via a handcrafted API request.
 * It also applies smart auto-fill defaults for excerpt and featured image.
 */
function guardArticleStatusTransition({ data, originalDoc, operation, req }: any) {
  // The translation job mirrors an already-authorized document into the other
  // locale. It must not be treated as a human editorial status transition.
  if (req.context?.skipAutoTranslate) {
    return data;
  }

  // Smart Auto-fill: Excerpt and Featured Image defaults for beginner friendliness
  if (data) {
    const currentLocale = req?.locale || "id";
    const rawExcerpt =
      typeof data.excerpt === "string"
        ? data.excerpt
        : data.excerpt && typeof data.excerpt === "object"
          ? data.excerpt[currentLocale]
          : null;

    if (!rawExcerpt || !String(rawExcerpt).trim()) {
      const plainText = extractPlainTextFromLexical(data.content);
      if (plainText) {
        const snippet = plainText.length > 160 ? plainText.slice(0, 157).replace(/\s+\S*$/, "") + "..." : plainText;
        if (typeof data.excerpt === "object" && data.excerpt !== null) {
          data.excerpt[currentLocale] = snippet;
        } else {
          data.excerpt = snippet;
        }
      }
    }

    if (!data.featuredImage && Array.isArray(data.gallery) && data.gallery.length > 0) {
      const firstImg = data.gallery[0]?.image;
      if (firstImg) {
        data.featuredImage = firstImg;
      }
    }
  }

  if (operation === "create" && req.user?.id && !canPublishContent({ req })) {
    // Editors own newly created documents, which keeps own-content access
    // effective without trusting a manually supplied author value.
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
      throw new APIError("Reviewer tidak memiliki izin untuk menerbitkan atau menjadwalkan artikel.", 403);
    }
    return data;
  }

  if (canManageContent({ req }) && EDITOR_STATUSES.includes(nextStatus)) {
    return data;
  }

  throw new APIError("Status artikel ini tidak dapat diubah dengan peran Anda.", 403);
}

export const Articles: CollectionConfig = {
  slug: "articles",
  labels: {
    singular: { id: "Artikel", en: "Article" },
    plural: { id: "Artikel", en: "Articles" },
  },
  versions: {
    drafts: {
      autosave: true,
    },
    maxPerDoc: 15,
  },
  admin: {
    group: { id: "Manajemen Konten", en: "Content Management" },
    useAsTitle: "title",
    defaultColumns: ["title", "status", "author", "updatedAt"],
    listSearchableFields: ["title", "slug", "excerpt"],
    description:
      "Kelola draft, proses review, dan publikasi artikel. Gunakan tombol Preview untuk memeriksa artikel yang sudah dipublikasikan.",
    preview: (doc, { locale }) => {
      const slug = typeof doc.slug === "string" ? doc.slug : null;
      return slug ? `/${locale || "id"}/artikel/${slug}` : null;
    },
    components: {
      edit: {
        beforeDocumentControls: [
          "@/components/admin/LocaleDocumentControls#LocaleDocumentControls",
          "@/components/admin/EditorActionBar#EditorActionBar",
        ],
      },
    },
  },
  access: {
    // Visitors only see published articles; authenticated CMS users retain
    // access to drafts and content awaiting review.
    read: canReadPublishedOrAuthenticated,
    create: canManageContent,
    update: canManageOwnContentOrReview,
    delete: canManageOwnContent,
  },
  hooks: {
    beforeChange: [guardArticleStatusTransition],
    afterChange: [universalCollectionAutoTranslate],
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Konten Penulisan",
          admin: {
            description:
              "Tulis judul, naskah artikel, dan ringkasan. Anda dapat menyisipkan foto langsung di tengah tulisan menggunakan tombol media pada toolbar editor.",
          },
          fields: [
            {
              name: "title",
              type: "text",
              required: true,
              localized: true,
              admin: {
                components: {
                  Cell: "@/components/admin/ArticleTitleCell#ArticleTitleCell",
                },
              },
              label: "Judul Artikel",
              access: {
                update: canManageContent,
              },
            },
            {
              name: "content",
              type: "richText",
              required: true,
              localized: true,
              label: "Isi Artikel",
              admin: {
                description:
                  "Tulis naskah artikel Anda di sini. Ingin menyisipkan foto di sela-sela paragraf? Klik ikon media/gambar pada toolbar editor atau ketik '/' lalu pilih Gambar.",
              },
              access: {
                update: canManageContent,
              },
            },
            {
              name: "excerpt",
              type: "textarea",
              localized: true,
              maxLength: 320,
              label: "Ringkasan Artikel (Opsional)",
              admin: {
                placeholder:
                  "Tulis 1–2 kalimat ringkasan menarik, atau biarkan kosong agar sistem mengisinya otomatis dari paragraf pertama...",
                description:
                  "💡 Opsional — Bila dikosongkan, sistem akan otomatis mengambil kalimat pembuka naskah Anda untuk cuplikan di Google dan kartu berita.",
              },
              access: {
                update: canManageContent,
              },
            },
          ],
        },
        {
          label: "Media",
          admin: {
            description:
              "Atur Gambar Utama (sampul/banner artikel) dan tambahkan Galeri Dokumentasi di bawah jika artikel memiliki banyak foto kegiatan.",
          },
          fields: [
            {
              name: "featuredImage",
              type: "upload",
              relationTo: "media",
              label: "Gambar Utama Artikel / Sampul (Opsional)",
              admin: {
                description:
                  "💡 Opsional — Rekomendasi: Lanskap 16:9 (1200 × 675 px). Jika Anda mengunggah Galeri Dokumentasi di bawah, foto pertama otomatis dijadikan sampul bila bagian ini tidak dipilih.",
              },
              access: {
                update: canManageContent,
              },
            },
            {
              name: "featuredImageCaption",
              type: "text",
              localized: true,
              label: "Caption Gambar Utama",
              admin: {
                condition: (_, siblingData) => Boolean(siblingData?.featuredImage),
              },
              access: {
                update: canManageContent,
              },
            },
            {
              name: "featuredImageCredit",
              type: "text",
              label: "Kredit / Sumber Gambar",
              admin: {
                condition: (_, siblingData) => Boolean(siblingData?.featuredImage),
              },
              access: {
                update: canManageContent,
              },
            },
            {
              name: "gallery",
              type: "array",
              label: "Dokumentasi & Galeri Foto Tambahan",
              labels: {
                singular: "Foto Dokumentasi",
                plural: "Daftar Foto Dokumentasi",
              },
              admin: {
                description:
                  "Opsional. Unggah beberapa foto dokumentasi kegiatan atau foto pelengkap artikel. Semua foto ini akan otomatis ditampilkan rapi di bagian bawah artikel.",
              },
              fields: [
                {
                  name: "image",
                  type: "upload",
                  relationTo: "media",
                  required: true,
                  label: "Pilih / Unggah Foto",
                },
                {
                  name: "caption",
                  type: "text",
                  localized: true,
                  label: "Keterangan Foto (Caption)",
                  admin: {
                    description: "Keterangan singkat kegiatan atau momen pada foto.",
                  },
                },
              ],
              access: {
                update: canManageContent,
              },
            },
            {
              name: "imageUrl",
              type: "text",
              label: "Legacy Thumbnail Image URL",
              admin: {
                description:
                  "Dipertahankan sementara untuk artikel lama. Gunakan “Gambar Utama Artikel” untuk konten baru.",
                condition: (_, siblingData) => !siblingData?.featuredImage,
              },
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
      label: "Tautan URL Halaman (Otomatis)",
      admin: {
        position: "sidebar",
        description:
          "💡 Otomatis dibuat dari judul artikel (contoh: 'penerapan-ai-dalam-layanan'). Anda tidak perlu mengubah ini kecuali menginginkan alamat tautan khusus.",
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
      label: { id: "Penulis", en: "Author" },
      admin: {
        position: "sidebar",
      },
      access: {
        create: canManageContent,
        update: canPublishContent,
      },
    },
    {
      name: "category",
      type: "relationship",
      relationTo: "categories",
      label: { id: "Kategori", en: "Category" },
      admin: {
        position: "sidebar",
      },
      access: {
        update: canManageContent,
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
      admin: {
        position: "sidebar",
        description: {
          id: "Editor dapat mengirim review; reviewer dapat menyetujui atau meminta revisi; hanya admin yang dapat menjadwalkan atau menerbitkan.",
          en: "Editors can submit for review; reviewers can approve or request revisions; only administrators can schedule or publish.",
        },
        components: {
          Cell: "@/components/admin/EditorialStatusCell#EditorialStatusCell",
        },
      },
    },
    {
      name: "reviewNotes",
      type: "textarea",
      label: { id: "Catatan Review", en: "Review Notes" },
      admin: {
        position: "sidebar",
        condition: (_, siblingData) => ["in_review", "revision_requested", "approved"].includes(siblingData?.status),
      },
      access: {
        update: canReviewContent,
      },
    },
    {
      name: "reviewSummary",
      type: "ui",
      admin: {
        position: "sidebar",
        components: { Field: "@/components/admin/ReviewPanel#ReviewPanel" },
      },
    },
    {
      name: "publishedAt",
      type: "date",
      label: { id: "Tanggal Publikasi", en: "Publication Date" },
      admin: {
        position: "sidebar",
      },
      access: {
        create: canPublishContent,
        update: canPublishContent,
      },
    },
  ],
};
