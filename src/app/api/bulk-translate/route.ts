import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { translateDocumentJSON } from '@/utils/translate';

const COLLECTIONS = ['articles', 'categories', 'services', 'team-members'] as const;
const GLOBALS = ['beranda', 'footer', 'kontak', 'navbar', 'tentang-kami'] as const;

export async function GET(req: Request) {
  try {
    const payload = await getPayload({ config: configPromise });
    
    let logs: string[] = [];
    const log = (msg: string) => {
      console.log(msg);
      logs.push(msg);
    };

    log("=== STARTING BULK TRANSLATION ===");

    // Translate Globals
    for (const slug of GLOBALS) {
      try {
        log(`\nFetching global [${slug}]...`);
        const doc = await payload.findGlobal({
          slug,
          locale: 'id',
          fallbackLocale: 'none',
          depth: 0,
        });

        if (doc) {
          log(`Translating global [${slug}]...`);
          const { id, createdAt, updatedAt, ...docToTranslate } = doc;
          const translatedData = await translateDocumentJSON(docToTranslate);
          
          await payload.updateGlobal({
            slug,
            locale: 'en',
            data: translatedData,
            context: { skipAutoTranslate: true },
          });
          log(`✅ Global [${slug}] translated successfully.`);
        }
      } catch (e: any) {
        log(`❌ Error global [${slug}]: ${e.message}`);
      }
    }

    // Translate Collections
    for (const collection of COLLECTIONS) {
      try {
        log(`\nFetching collection [${collection}]...`);
        const result = await payload.find({
          collection,
          locale: 'id',
          fallbackLocale: 'none',
          depth: 0,
          limit: 100,
        });

        log(`Found ${result.docs.length} items in [${collection}]`);

        for (const doc of result.docs) {
          log(`Translating [${collection}] ID: ${doc.id}...`);
          const { id, createdAt, updatedAt, sizes, url, filename, mimeType, filesize, width, height, focalX, focalY, ...docToTranslate } = doc as any;
          const translatedData = await translateDocumentJSON(docToTranslate);
          
          await payload.update({
            collection,
            id: doc.id,
            locale: 'en',
            data: translatedData,
            context: { skipAutoTranslate: true },
          });
          log(`✅ [${collection}] ID: ${doc.id} translated successfully.`);
        }
      } catch (e: any) {
        log(`❌ Error collection [${collection}]: ${e.message}`);
      }
    }

    log("\n=== BULK TRANSLATION COMPLETED ===");
    return Response.json({ success: true, logs });
  } catch (error: any) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
