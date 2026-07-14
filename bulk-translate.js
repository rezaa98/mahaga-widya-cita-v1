import payload from 'payload';
import configPromise from './src/payload.config.ts';
import { translateDocumentJSON } from './src/utils/translate.ts';

const COLLECTIONS = ['articles', 'categories', 'services', 'team-members'];
const GLOBALS = ['beranda', 'footer', 'kontak', 'navbar', 'tentang-kami'];

async function run() {
  const config = await configPromise;
  await payload.init({
    config,
    local: true,
  });

  console.log("=== STARTING BULK TRANSLATION ===");

  // Translate Globals
  for (const slug of GLOBALS) {
    try {
      console.log(`\nFetching global [${slug}]...`);
      const doc = await payload.findGlobal({
        slug,
        locale: 'id',
        fallbackLocale: 'none',
        depth: 0,
      });

      if (doc) {
        console.log(`Translating global [${slug}]...`);
        const { id, createdAt, updatedAt, ...docToTranslate } = doc;
        const translatedData = await translateDocumentJSON(docToTranslate);
        
        await payload.updateGlobal({
          slug,
          locale: 'en',
          data: translatedData,
          context: { skipAutoTranslate: true },
        });
        console.log(`✅ Global [${slug}] translated successfully.`);
      }
    } catch (e) {
      console.log(`❌ Error global [${slug}]: ${e.message}`);
    }
  }

  // Translate Collections
  for (const collection of COLLECTIONS) {
    try {
      console.log(`\nFetching collection [${collection}]...`);
      const result = await payload.find({
        collection,
        locale: 'id',
        fallbackLocale: 'none',
        depth: 0,
        limit: 100, // Assuming <100 items per collection for now
      });

      console.log(`Found ${result.docs.length} items in [${collection}]`);

      for (const doc of result.docs) {
        console.log(`Translating [${collection}] ID: ${doc.id}...`);
        const { id, createdAt, updatedAt, ...docToTranslate } = doc;
        const translatedData = await translateDocumentJSON(docToTranslate);
        
        await payload.update({
          collection,
          id: doc.id,
          locale: 'en',
          data: translatedData,
          context: { skipAutoTranslate: true },
        });
        console.log(`✅ [${collection}] ID: ${doc.id} translated successfully.`);
      }
    } catch (e) {
      console.log(`❌ Error collection [${collection}]: ${e.message}`);
    }
  }

  console.log("\n=== BULK TRANSLATION COMPLETED ===");
  process.exit(0);
}

run();
