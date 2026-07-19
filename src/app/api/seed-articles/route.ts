import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { articlesPart1 } from './data1';
import { articlesPart2 } from './data2';
import { requireAdminAuth } from '@/utils/adminAuth';

export async function GET(req: Request) {
  const authError = await requireAdminAuth(req);
  if (authError) return authError;
  try {
    const payload = await getPayload({ config: configPromise });
    
    // Combine articles
    const allArticlesData = [...articlesPart1, ...articlesPart2];
    
    let insertedCount = 0;
    let categoryMap = new Map();

    // Setup basic categories first
    const existingCats = await payload.find({ collection: 'categories' });
    if (existingCats.totalDocs === 0) {
      const cat1 = await payload.create({ collection: 'categories', data: { name: 'Tata Kelola', slug: 'tata-kelola' } });
      const cat2 = await payload.create({ collection: 'categories', data: { name: 'Smart City', slug: 'smart-city' } });
      const cat3 = await payload.create({ collection: 'categories', data: { name: 'Teknologi', slug: 'teknologi' } });
      categoryMap.set('Tata Kelola', cat1.id);
      categoryMap.set('Smart City', cat2.id);
      categoryMap.set('Teknologi', cat3.id);
    } else {
      existingCats.docs.forEach(cat => categoryMap.set(cat.name, cat.id));
    }
    
    // Get array of category IDs to assign randomly
    const categoryIds = Array.from(categoryMap.values());

    for (let i = 0; i < allArticlesData.length; i++) {
      const art = allArticlesData[i];
      const randomCategoryId = categoryIds[i % categoryIds.length];
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
          direction: null,
          format: '' as const,
          indent: 0,
          version: 1,
          children: children,
        }
      };

      await payload.create({
        collection: 'articles',
        data: {
          title: art.title,
          imageUrl: art.imageUrl,
          category: randomCategoryId,
          status: 'published',
          publishedAt: randomDate,
          content: contentObj,
        }
      });
      
      insertedCount++;
    }

    return NextResponse.json({ 
      success: true, 
      message: `Successfully seeded ${insertedCount} articles.`,
    });
    
  } catch (error: any) {
    console.error("Seeding Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
