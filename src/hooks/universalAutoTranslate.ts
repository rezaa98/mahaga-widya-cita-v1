import { CollectionAfterChangeHook, GlobalAfterChangeHook } from 'payload';
import { translateDocumentJSON } from '../utils/translate';

// Generic translator logic for both collections and globals
async function processTranslation(req: any, doc: any, identifier: string, isGlobal: boolean = false) {
  // Only auto-translate when the user is saving the default 'id' locale
  // and we haven't already skipped it to prevent infinite loops
  if (req.locale !== 'id' || req.context?.skipAutoTranslate) {
    return doc;
  }

  try {
    // 1. Fetch the 'en' locale version of this document without fallback
    // For collections, identifier is collection.slug. For globals, identifier is global.slug.
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

    // A simple heuristic: if 'en' version has data that differs from 'id' version 
    // in one of the main fields, or if we want to be safe, we only auto-translate if 
    // it's an initial translation (e.g. they just created it, or they explicitly requested it)
    // Actually, since this is universal, we can just check if any key exists in the DB for 'en'
    // but findGlobal/findByID always returns the structure.
    // If the translation shouldn't overwrite manual edits, we could check timestamps or specific fields.
    // We will assume that if they save 'id' and we get here, we will translate the 'id' doc and update 'en'.
    // NOTE: To prevent overwriting manual 'en' edits, they should edit 'en' locale explicitly.
    // Since this runs after 'id' changes, it WILL overwrite 'en'.
    
    console.log(`[Auto-Translate] Translating ${identifier} to English...`);
    
    // We don't want to translate the entire doc with system fields like id, createdAt, etc.
    // But translateDocumentJSON handles this by preserving JSON structure and only translating text.
    // Let's remove system fields just to save AI tokens and prevent accidental modifications.
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
  return processTranslation(req, doc, collection.slug, false);
};

export const universalGlobalAutoTranslate: GlobalAfterChangeHook = async ({
  doc,
  req,
  global,
}) => {
  return processTranslation(req, doc, global.slug, true);
};
