import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor, UploadFeature } from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Categories } from './collections/Categories'
import { Articles } from './collections/Articles'
import { Journals } from './collections/Journals'
import { PolicyReviews } from './collections/PolicyReviews'

import { ContactSubmissions } from './collections/ContactSubmissions'
import { Subscribers } from './collections/Subscribers'
import { Services } from './collections/Services'
import { TeamMembers } from './collections/TeamMembers'
import { Beranda } from './globals/Beranda'
import { TentangKami } from './globals/TentangKami'
import { Kontak } from './globals/Kontak'
import { Footer } from './globals/Footer'
import { Navbar } from './globals/Navbar'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '- Mahaga Widya Cita CMS',
    },
    components: {
      providers: ['@/components/admin/ThemeForceProvider#ThemeForceProvider'],
      Nav: '@/components/admin/CustomNav#CustomNav',
      views: {
        dashboard: {
          Component: '@/components/admin/DashboardWidget#DashboardWidget',
        },
        login: {
          Component: '@/components/admin/CustomLogin#CustomLogin',
        },
      },
      graphics: {
        Logo: '@/components/admin/Logo#Logo',
        Icon: '@/components/admin/Icon#Icon',
      },
    },
  },
  globals: [
    Beranda,
    TentangKami,
    Kontak,
    Footer,
    Navbar,
  ],
  collections: [
    Users,
    Media,
    Categories,
    Articles,
    Journals,
    PolicyReviews,
    ContactSubmissions,
    Subscribers,
    Services,
    TeamMembers,
  ],
  localization: {
    locales: ['id', 'en'],
    defaultLocale: 'id',
    fallback: true,
  },
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      // The default editor includes UploadFeature without a collection allow-list.
      // Replace only that feature so inline rich-text uploads can use the shared
      // Media library, never an arbitrary future upload collection.
      ...defaultFeatures.filter((feature) => feature.key !== 'upload'),
      UploadFeature({
        enabledCollections: ['media'],
      }),
    ],
  }),
  secret: process.env.PAYLOAD_SECRET || (process.env.NODE_ENV === 'production' ? (() => { throw new Error('PAYLOAD_SECRET is missing in production!') })() : 'fallback-secret-key'),
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/postgres',
    },
    push: true,
  }),
  plugins: [
    vercelBlobStorage({
      enabled: !!process.env.BLOB_READ_WRITE_TOKEN,
      collections: {
        media: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
    })
  ],
})
