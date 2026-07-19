import type { CollectionConfig } from 'payload'
import { APIError } from 'payload'
import { universalCollectionAutoTranslate } from '../hooks/universalAutoTranslate'
import {
  canManageContent,
  canManageOwnContent,
  canManageOwnContentOrReview,
  canPublishContent,
  canReadPublishedOrAuthenticated,
  canReviewContent,
} from '@/utils/access'

const EDITOR_STATUSES = ['draft', 'in_review', 'revision_requested']
const REVIEWER_STATUSES = ['in_review', 'revision_requested', 'approved']

/**
 * Collection access determines which documents a role may open. This hook
 * protects the status transition itself, including requests made outside the
 * admin UI, so an editor cannot publish via a handcrafted API request.
 */
function guardArticleStatusTransition({ data, originalDoc, operation, req }: any) {
  // The translation job mirrors an already-authorized document into the other
  // locale. It must not be treated as a human editorial status transition.
  if (req.context?.skipAutoTranslate) {
    return data
  }

  if (operation === 'create' && req.user?.id && !canPublishContent({ req })) {
    // Editors own newly created documents, which keeps own-content access
    // effective without trusting a manually supplied author value.
    data.author = req.user.id
  }

  const nextStatus = data.status || originalDoc?.status || 'draft'

  if (canPublishContent({ req })) {
    if (nextStatus === 'published' && originalDoc?.status !== 'published' && !data.publishedAt) {
      data.publishedAt = new Date().toISOString()
    }
    return data
  }

  if (canReviewContent({ req })) {
    if (operation === 'create' || !REVIEWER_STATUSES.includes(nextStatus)) {
      throw new APIError('Reviewer tidak memiliki izin untuk menerbitkan atau menjadwalkan artikel.', 403)
    }
    return data
  }

  if (canManageContent({ req }) && EDITOR_STATUSES.includes(nextStatus)) {
    return data
  }

  throw new APIError('Status artikel ini tidak dapat diubah dengan peran Anda.', 403)
}

export const Articles: CollectionConfig = {
  slug: 'articles',
  admin: {
    group: 'Manajemen Konten',
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'author', 'updatedAt'],
    listSearchableFields: ['title', 'slug', 'excerpt'],
    description: 'Kelola draft, proses review, dan publikasi artikel. Gunakan tombol Preview untuk memeriksa artikel yang sudah dipublikasikan.',
    preview: (doc, { locale }) => {
      const slug = typeof doc.slug === 'string' ? doc.slug : null
      return slug ? `/${locale || 'id'}/artikel/${slug}` : null
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
      type: 'tabs',
      tabs: [
        {
          label: 'Konten Penulisan',
          admin: {
            description: 'Isi judul, ringkasan, dan artikel. Gambar dapat diunggah langsung melalui tombol media di editor.',
          },
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              localized: true,
              admin: {
                components: {
                  Cell: '@/components/admin/ArticleTitleCell#ArticleTitleCell',
                },
              },
              label: 'Judul Artikel',
              access: {
                update: canManageContent,
              },
            },
            {
              name: 'content',
              type: 'richText',
              required: true,
              localized: true,
              label: 'Isi Artikel',
              access: {
                update: canManageContent,
              },
            },
            {
              name: 'excerpt',
              type: 'textarea',
              localized: true,
              maxLength: 320,
              label: 'Ringkasan Artikel',
              admin: {
                description: 'Digunakan pada card artikel, hasil pencarian, dan metadata SEO.',
              },
              access: {
                update: canManageContent,
              },
            },
          ]
        },
        {
          label: 'Media',
          admin: {
            description: 'Pilih thumbnail dari Media Library. Field URL lama hanya digunakan sebagai fallback untuk artikel yang belum dimigrasikan.',
          },
          fields: [
            {
              name: 'featuredImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Gambar Utama Artikel',
              admin: {
                description: 'Upload gambar baru atau pilih gambar dari Media Library. Gambar ini digunakan sebagai thumbnail dan hero artikel.',
              },
              access: {
                update: canManageContent,
              },
            },
            {
              name: 'featuredImageCaption',
              type: 'text',
              localized: true,
              label: 'Caption Gambar Utama',
              admin: {
                condition: (_, siblingData) => Boolean(siblingData?.featuredImage),
              },
              access: {
                update: canManageContent,
              },
            },
            {
              name: 'featuredImageCredit',
              type: 'text',
              label: 'Kredit / Sumber Gambar',
              admin: {
                condition: (_, siblingData) => Boolean(siblingData?.featuredImage),
              },
              access: {
                update: canManageContent,
              },
            },
            {
              name: 'imageUrl',
              type: 'text',
              label: 'Legacy Thumbnail Image URL',
              admin: {
                description: 'Dipertahankan sementara untuk artikel lama. Gunakan “Gambar Utama Artikel” untuk konten baru.',
                condition: (_, siblingData) => !siblingData?.featuredImage,
              },
              access: {
                update: canManageContent,
              },
            },
          ]
        }
      ]
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      admin: {
        position: 'sidebar',
      },
      access: {
        update: canManageContent,
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (value) return value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
            if (data?.title) return data.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
            return value
          },
        ],
      },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        position: 'sidebar',
      },
      access: {
        create: canManageContent,
        update: canPublishContent,
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      admin: {
        position: 'sidebar',
      },
      access: {
        update: canManageContent,
      },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Menunggu Review', value: 'in_review' },
        { label: 'Perlu Revisi', value: 'revision_requested' },
        { label: 'Disetujui', value: 'approved' },
        { label: 'Terjadwal', value: 'scheduled' },
        { label: 'Published', value: 'published' },
        { label: 'Diarsipkan', value: 'archived' },
      ],
      defaultValue: 'draft',
      admin: {
        position: 'sidebar',
        description: 'Editor dapat mengirim review; reviewer dapat menyetujui atau meminta revisi; hanya admin yang dapat menjadwalkan atau menerbitkan.',
        components: {
          Cell: '@/components/admin/EditorialStatusCell#EditorialStatusCell',
        },
      },
    },
    {
      name: 'reviewNotes',
      type: 'textarea',
      label: 'Catatan Review',
      admin: {
        position: 'sidebar',
        condition: (_, siblingData) => ['in_review', 'revision_requested', 'approved'].includes(siblingData?.status),
      },
      access: {
        update: canReviewContent,
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
      access: {
        create: canPublishContent,
        update: canPublishContent,
      },
    },
  ],
}
