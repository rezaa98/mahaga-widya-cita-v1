import { getPayload } from 'payload'
import configPromise from './payload.config'

async function seed() {
  const payload = await getPayload({ config: configPromise })

  payload.logger.info('Seeding database...')

  // Clean existing data
  await payload.delete({ collection: 'articles', where: {} })
  await payload.delete({ collection: 'categories', where: {} })
  await payload.delete({ collection: 'policy-reviews', where: {} })

  // 1. Create a Category
  const category1 = await payload.create({
    collection: 'categories',
    data: {
      name: 'Teknologi & Inovasi',
      slug: 'teknologi-inovasi',
    },
  })

  const category2 = await payload.create({
    collection: 'categories',
    data: {
      name: 'Kebijakan Publik',
      slug: 'kebijakan-publik',
    },
  })

  // 2. Create Articles
  const article1 = await payload.create({
    collection: 'articles',
    data: {
      title: 'Masa Depan AI di Sektor Pemerintahan',
      slug: 'masa-depan-ai-pemerintahan',
      category: category1.id,
      status: 'published',
      publishedAt: new Date().toISOString(),
      content: {
        root: {
          type: 'root',
          format: '',
          indent: 0,
          version: 1,
          children: [
            {
              type: 'paragraph',
              format: '',
              indent: 0,
              version: 1,
              children: [
                {
                  mode: 'normal',
                  text: 'Kecerdasan Buatan (AI) kini menjadi fokus utama bagi banyak negara dalam mengembangkan ekosistem pemerintahan cerdas (smart government).',
                  type: 'text',
                  style: '',
                  detail: 0,
                  format: 0,
                  version: 1,
                },
              ],
            },
          ],
        },
      },
    },
  })

  const article2 = await payload.create({
    collection: 'articles',
    data: {
      title: 'Strategi Transformasi Digital UMKM',
      slug: 'strategi-transformasi-digital-umkm',
      category: category1.id,
      status: 'published',
      publishedAt: new Date(Date.now() - 86400000).toISOString(),
      content: {
        root: {
          type: 'root',
          format: '',
          indent: 0,
          version: 1,
          children: [
            {
              type: 'paragraph',
              format: '',
              indent: 0,
              version: 1,
              children: [
                {
                  mode: 'normal',
                  text: 'Transformasi digital tidak lagi menjadi pilihan, melainkan keharusan bagi UMKM yang ingin bertahan di era pasca-pandemi.',
                  type: 'text',
                  style: '',
                  detail: 0,
                  format: 0,
                  version: 1,
                },
              ],
            },
          ],
        },
      },
    },
  })

  const article3 = await payload.create({
    collection: 'articles',
    data: {
      title: 'Analisis Dampak UU Pelindungan Data Pribadi',
      slug: 'dampak-uupdp-indonesia',
      category: category2.id,
      status: 'published',
      publishedAt: new Date(Date.now() - 172800000).toISOString(),
      content: {
        root: {
          type: 'root',
          format: '',
          indent: 0,
          version: 1,
          children: [
            {
              type: 'paragraph',
              format: '',
              indent: 0,
              version: 1,
              children: [
                {
                  mode: 'normal',
                  text: 'Dengan disahkannya UU PDP, banyak perusahaan mulai mengevaluasi ulang arsitektur sistem informasi dan tata kelola data mereka.',
                  type: 'text',
                  style: '',
                  detail: 0,
                  format: 0,
                  version: 1,
                },
              ],
            },
          ],
        },
      },
    },
  })

  payload.logger.info('Seeding complete!')
  process.exit(0)
}

seed()
