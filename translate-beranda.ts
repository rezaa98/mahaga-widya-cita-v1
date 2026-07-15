import { getPayload } from 'payload';
import configPromise from './src/payload.config';
import { translateDocumentJSON } from './src/utils/translate';
import * as dotenv from 'dotenv';
dotenv.config();

async function run() {
  try {
    const payload = await getPayload({ config: configPromise });
    const slug = 'beranda';
    console.log(`Fetching global ${slug}...`);

    const doc = await payload.findGlobal({ slug, locale: 'id', depth: 0 });
    const { id, createdAt, updatedAt, ...docToTranslate } = doc as any;

    console.log(`Translating...`);
    const translatedData = await translateDocumentJSON(docToTranslate, 'English');

    console.log(`Updating payload...`);
    await payload.updateGlobal({
      slug,
      locale: 'en',
      data: translatedData,
      context: { skipAutoTranslate: true },
    });

    console.log(`✅ Successfully translated ${slug}`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

run();
