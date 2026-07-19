import { APIError, type CollectionConfig } from 'payload'
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

function slugify(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined

  return value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
}

function guardJournalStatusTransition({ data, originalDoc, operation, req }: any) {
  // Background localization mirrors an already-authorized journal record.
  if (req.context?.skipAutoTranslate) return data

  if (operation === 'create' && req.user?.id && !canPublishContent({ req })) {
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
      throw new APIError('Reviewer tidak memiliki izin untuk menerbitkan atau menjadwalkan jurnal.', 403)
    }
    return data
  }

  if (canManageContent({ req }) && EDITOR_STATUSES.includes(nextStatus)) {
    return data
  }

  throw new APIError('Status jurnal ini tidak dapat diubah dengan peran Anda.', 403)
}

async function validatePDF(value: unknown, { req }: { req: any }) {
  if (!value) return 'Dokumen jurnal dalam format PDF wajib diunggah.'

  const media = typeof value === 'object'
    ? value as { filename?: string; mimeType?: string }
    : await req.payload.findByID({
        collection: 'media',
        id: value as string | number,
        depth: 0,
      })

  const isPDF = media?.mimeType === 'application/pdf' || media?.filename?.toLowerCase().endsWith('.pdf')
  return isPDF || 'Dokumen jurnal harus berupa file PDF.'
}

export const Journals: CollectionConfig = {
  slug: 'journals',
  versions: { drafts: { autosave: true }, maxPerDoc: 15 },
  admin: {
    group: 'Manajemen Konten',
    useAsTitle: 'title',
    defaultColumns: ['title', 'publicationYear', 'status', 'updatedAt'],
    listSearchableFields: ['title', 'slug', 'doi'],
    description: 'Kelola metadata publikasi, dokumen PDF, proses review, dan status publikasi jurnal.',
    preview: (doc, { locale }) => {
      const slug = typeof doc.slug === 'string' ? doc.slug : null
      return slug ? `/${locale || 'id'}/jurnal/${slug}` : null
    },
  },
  access: {
    read: canReadPublishedOrAuthenticated,
    create: canManageContent,
    update: canManageOwnContentOrReview,
    delete: canManageOwnContent,
  },
  hooks: {
    beforeChange: [guardJournalStatusTransition],
    afterChange: [universalCollectionAutoTranslate],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Konten Jurnal',
          admin: {
            description: 'Tambahkan judul, abstrak, ringkasan, dan kata kunci dalam bahasa aktif.',
          },
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              localized: true,
              label: 'Judul Jurnal',
              admin: {
                components: {
                  Cell: '@/components/admin/JournalTitleCell#JournalTitleCell',
                },
              },
              access: { update: canManageContent },
            },
            {
              name: 'abstract',
              type: 'richText',
              required: true,
              localized: true,
              label: 'Abstrak',
              access: { update: canManageContent },
            },
            {
              name: 'content',
              type: 'richText',
              localized: true,
              label: 'Ringkasan / Isi Tambahan',
              admin: {
                description: 'Opsional. Gunakan untuk ringkasan eksekutif atau konteks yang tampil pada halaman jurnal.',
              },
              access: { update: canManageContent },
            },
            {
              name: 'keywords',
              type: 'array',
              localized: true,
              label: 'Kata Kunci',
              minRows: 1,
              fields: [
                {
                  name: 'keyword',
                  type: 'text',
                  required: true,
                  label: 'Kata Kunci',
                },
              ],
              access: { update: canManageContent },
            },
          ],
        },
        {
          label: 'Media & Publikasi',
          admin: {
            description: 'Upload cover dan PDF final, lalu lengkapi metadata penerbitan agar jurnal mudah ditemukan dan dikutip.',
          },
          fields: [
            {
              name: 'coverImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Cover Jurnal',
              access: { update: canManageContent },
            },
            {
              name: 'document',
              type: 'upload',
              relationTo: 'media',
              required: true,
              label: 'Dokumen Jurnal (PDF)',
              validate: validatePDF,
              access: { update: canManageContent },
            },
            {
              name: 'language',
              type: 'select',
              required: true,
              defaultValue: 'id',
              label: 'Bahasa Publikasi',
              options: [
                { label: 'Bahasa Indonesia', value: 'id' },
                { label: 'English', value: 'en' },
                { label: 'Bilingual', value: 'bilingual' },
              ],
              access: { update: canManageContent },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'publicationYear',
                  type: 'number',
                  required: true,
                  label: 'Tahun Terbit',
                  min: 1900,
                  max: 2100,
                  admin: { width: '25%' },
                  access: { update: canManageContent },
                },
                {
                  name: 'volume',
                  type: 'text',
                  label: 'Volume',
                  admin: { width: '25%' },
                  access: { update: canManageContent },
                },
                {
                  name: 'issue',
                  type: 'text',
                  label: 'Nomor / Issue',
                  admin: { width: '25%' },
                  access: { update: canManageContent },
                },
                {
                  name: 'pages',
                  type: 'text',
                  label: 'Halaman',
                  admin: { width: '25%' },
                  access: { update: canManageContent },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'doi',
                  type: 'text',
                  label: 'DOI',
                  admin: { width: '50%' },
                  access: { update: canManageContent },
                },
                {
                  name: 'issn',
                  type: 'text',
                  label: 'ISSN',
                  admin: { width: '50%' },
                  access: { update: canManageContent },
                },
              ],
            },
          ],
        },
        {
          label: 'Penulis',
          admin: {
            description: 'Tambahkan penulis sesuai urutan kontribusi dan sertakan afiliasi institusinya.',
          },
          fields: [
            {
              name: 'authors',
              type: 'array',
              required: true,
              minRows: 1,
              label: 'Daftar Penulis',
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'name',
                      type: 'text',
                      required: true,
                      label: 'Nama Penulis',
                      admin: { width: '50%' },
                    },
                    {
                      name: 'affiliation',
                      type: 'text',
                      label: 'Afiliasi / Institusi',
                      admin: { width: '50%' },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'email',
                      type: 'email',
                      label: 'Email Publik (Opsional)',
                      admin: { width: '50%' },
                    },
                    {
                      name: 'publicProfile',
                      type: 'text',
                      label: 'URL Profil Publik (Opsional)',
                      admin: { width: '50%' },
                    },
                  ],
                },
              ],
              access: { update: canManageContent },
            },
          ],
        },
        {
          label: 'SEO',
          admin: {
            description: 'Opsional. Gunakan metadata khusus bila judul atau abstrak jurnal perlu disesuaikan untuk mesin pencari.',
          },
          fields: [
            {
              name: 'metaTitle',
              type: 'text',
              localized: true,
              label: 'Meta Title',
              maxLength: 60,
              access: { update: canManageContent },
            },
            {
              name: 'metaDescription',
              type: 'textarea',
              localized: true,
              label: 'Meta Description',
              maxLength: 160,
              access: { update: canManageContent },
            },
            {
              name: 'canonicalUrl',
              type: 'text',
              label: 'Canonical URL (Opsional)',
              admin: {
                description: 'Kosongkan untuk menggunakan URL jurnal pada website ini.',
              },
              access: { update: canManageContent },
            },
            {
              name: 'ogImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Open Graph Image',
              access: { update: canManageContent },
            },
          ],
        },
      ],
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { position: 'sidebar' },
      access: { update: canManageContent },
      hooks: {
        beforeValidate: [
          ({ value, data }) => slugify(value) || slugify(data?.title) || value,
        ],
      },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      label: 'Penanggung Jawab Konten',
      admin: { position: 'sidebar' },
      access: {
        create: canManageContent,
        update: canPublishContent,
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      label: 'Kategori',
      admin: { position: 'sidebar' },
      access: { update: canManageContent },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      admin: {
        position: 'sidebar',
        description: 'Editor dapat mengirim review; reviewer dapat menyetujui atau meminta revisi; hanya admin yang dapat menjadwalkan atau menerbitkan.',
        components: {
          Cell: '@/components/admin/EditorialStatusCell#EditorialStatusCell',
        },
      },
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Menunggu Review', value: 'in_review' },
        { label: 'Perlu Revisi', value: 'revision_requested' },
        { label: 'Disetujui', value: 'approved' },
        { label: 'Terjadwal', value: 'scheduled' },
        { label: 'Published', value: 'published' },
        { label: 'Diarsipkan', value: 'archived' },
      ],
    },
    {
      name: 'reviewNotes',
      type: 'textarea',
      label: 'Catatan Review',
      admin: {
        position: 'sidebar',
        condition: (_, siblingData) => ['in_review', 'revision_requested', 'approved'].includes(siblingData?.status),
      },
      access: { update: canReviewContent },
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: 'Tanggal Publikasi',
      admin: { position: 'sidebar' },
      access: {
        create: canPublishContent,
        update: canPublishContent,
      },
    },
  ],
}
