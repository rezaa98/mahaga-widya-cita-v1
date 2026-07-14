import { CollectionAfterChangeHook, GlobalAfterChangeHook } from 'payload';
import { translateDocumentJSON } from '../utils/translate';

import { after } from 'next/server';

// Generic translator logic for both collections and globals
async function processTranslation(req: any, doc: any, identifier: string, isGlobal: boolean = false) {
  // Only auto-translate when the user is saving the default 'id' locale
  // and we haven't already skipped it to prevent infinite loops
  if (req.locale !== 'id' || req.context?.skipAutoTranslate) {
    return doc;
  }

  try {
    // 1. Fetch the 'en' locale version of this document without fallback
    let enDocNoFallback;
    if (isGlobal) {
      enDocNoFallback = await req.payload.findGlobal({
        slug: identifier,
        locale: 'en',
        fallbackLocale: 'none',
        depth: 0,
      });
    } else {
      enDocNoFallback = await req.payload.findByID({
        collection: identifier,
        id: doc.id,
        locale: 'en',
        fallbackLocale: 'none',
        depth: 0,
      });
    }

    console.log(`[Auto-Translate] Translating ${identifier} to English...`);
    
    // We don't want to translate the entire doc with system fields like id, createdAt, etc.
    const { id, createdAt, updatedAt, ...docToTranslate } = doc;
    
    const translatedData = await translateDocumentJSON(docToTranslate);

    // 4. Update the 'en' locale
    if (isGlobal) {
      await req.payload.updateGlobal({
        slug: identifier,
        locale: 'en',
        data: translatedData,
        context: { skipAutoTranslate: true },
      });
    } else {
      await req.payload.update({
        collection: identifier,
        id: doc.id,
        locale: 'en',
        data: translatedData,
        context: { skipAutoTranslate: true },
      });
    }
    
    console.log(`[Auto-Translate] Successfully translated ${identifier}`);
  } catch (error) {
    console.error(`[Auto-Translate] Error translating ${identifier}:`, error);
  }

  return doc;
}

export const universalCollectionAutoTranslate: CollectionAfterChangeHook = async ({
  doc,
  req,
  collection,
}) => {
  // Run translation properly in the background using Next.js after()
  // This sends the response immediately and runs the LLM in the background.
  try {
    after(async () => {
      await processTranslation(req, doc, collection.slug, false);
    });
  } catch (err) {
    // Fallback if after() is not available in the current context
    processTranslation(req, doc, collection.slug, false).catch(console.error);
  }
  return doc;
};

export const universalGlobalAutoTranslate: GlobalAfterChangeHook = async ({
  doc,
  req,
  global,
}) => {
  try {
    after(async () => {
      await processTranslation(req, doc, global.slug, true);
    });
  } catch (err) {
    processTranslation(req, doc, global.slug, true).catch(console.error);
  }
  return doc;
};
