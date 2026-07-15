import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { dataIndividu } from '../seed-articles/data_individu';
import { dataBisnis } from '../seed-articles/data_bisnis';
import { dataPemerintah } from '../seed-articles/data_pemerintah';
import { requireAdminAuth } from '@/utils/adminAuth';

export async function GET(req: Request) {
  const authError = await requireAdminAuth(req);
  if (authError) return authError;

  try {
    const payload = await getPayload({ config: configPromise });
    
    // Combine articles
    const allArticlesData = [...dataIndividu, ...dataBisnis, ...dataPemerintah];
    
    let insertedCount = 0;
    let categoryMap = new Map();

    // Setup basic categories first
    const existingCats = await payload.find({ collection: 'categories' });
    existingCats.docs.forEach((cat: any) => categoryMap.set(cat.name, cat.id));

    // Ensure our 3 categories exist
    const neededCats = [
      { name: 'Individu', slug: 'individu' },
      { name: 'Bisnis', slug: 'bisnis' },
      { name: 'Pemerintah', slug: 'pemerintah' }
    ];

    for (const cat of neededCats) {
      if (!categoryMap.has(cat.name)) {
        const createdCat = await payload.create({ collection: 'categories', data: { name: cat.name, slug: cat.slug } });
        categoryMap.set(cat.name, createdCat.id);
      }
    }

    for (let i = 0; i < allArticlesData.length; i++) {
      const art = allArticlesData[i];
      const categoryId = categoryMap.get(art.categoryName);
      
      // Generate deterministic slug
      const slug = art.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      
      // Random date between now and 6 months ago
      const randomDate = new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString();
      
      // Build Lexical JSON format from paragraphs
      const children = art.paragraphs.map(p => ({
        type: 'paragraph',
        format: '',
        indent: 0,
        version: 1,
        children: [
          {
            mode: 'normal',
            text: p,
            type: 'text',
            style: '',
            detail: 0,
            format: 0,
            version: 1,
          }
        ]
      }));

      const contentObj = {
        root: {
          type: 'root',
          format: '',
          indent: 0,
          version: 1,
          children: children,
        }
      };

      await payload.create({
        collection: 'articles',
        data: {
          title: art.title,
          slug: slug,
          imageUrl: art.imageUrl,
          category: categoryId,
          status: 'published',
          publishedAt: randomDate,
          content: contentObj,
        }
      });
      
      insertedCount++;
    }

    return NextResponse.json({ 
      success: true, 
      message: `Successfully seeded ${insertedCount} new articles!`,
    });
    
  } catch (error: any) {
    console.error("Seeding Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
