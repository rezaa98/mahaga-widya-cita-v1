import { CollectionAfterChangeHook } from 'payload';
import { translateText, translateLexicalJSON } from '../utils/translate';

export const autoTranslateHook: CollectionAfterChangeHook = async ({
  doc,
  req,
  operation,
  collection,
}) => {
  // Only auto-translate when the user is saving the default 'id' locale
  // and we haven't already skipped it to prevent infinite loops
  if (req.locale !== 'id' || req.context?.skipAutoTranslate) {
    return doc;
  }

  try {
    // 1. Fetch the 'en' locale version of this document
    const enDoc = await req.payload.findByID({
      collection: collection.slug,
      id: doc.id,
      locale: 'en',
      depth: 0,
    });

    // 2. Check if we need to translate (e.g. if the title in 'en' is missing or same as 'id' due to fallback)
    // When fallback is true, if 'en' doesn't exist, Payload returns the 'id' text.
    // To truly check if 'en' exists, we can fetch with fallback: false
    const enDocNoFallback = await req.payload.findByID({
      collection: collection.slug,
      id: doc.id,
      locale: 'en',
      fallbackLocale: 'none',
      depth: 0,
    });

    // If the title is already translated manually, don't overwrite it automatically
    // (Assuming 'title' is the main field. If it has a title in English, we skip).
    if (enDocNoFallback.title && enDocNoFallback.title !== doc.title) {
      // It seems it already has a custom translation. We skip.
      return doc;
    }

    // 3. Translate the fields
    console.log(`[Auto-Translate] Translating ${collection.slug} id ${doc.id} to English...`);
    
    const translatedTitle = await translateText(doc.title);
    const translatedExcerpt = doc.excerpt ? await translateText(doc.excerpt) : undefined;
    const translatedContent = doc.content ? await translateLexicalJSON(doc.content) : undefined;

    // 4. Update the 'en' locale
    await req.payload.update({
      collection: collection.slug,
      id: doc.id,
      locale: 'en',
      data: {
        title: translatedTitle,
        excerpt: translatedExcerpt,
        content: translatedContent,
      },
      context: {
        skipAutoTranslate: true, // Prevent infinite loop!
      },
    });
    
    console.log(`[Auto-Translate] Successfully translated ${collection.slug} id ${doc.id}`);
  } catch (error) {
    console.error(`[Auto-Translate] Error translating ${collection.slug} id ${doc.id}:`, error);
  }

  return doc;
};
