import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import { translateDocumentJSON } from '@/utils/translate';

// Allow this route to run up to 5 minutes on Vercel Pro (or max allowed on Hobby)
export const maxDuration = 300;
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { identifier, id, isGlobal } = body;
    
    if (!identifier) {
      return NextResponse.json({ error: 'Missing identifier' }, { status: 400 });
    }

    const payload = await getPayload({ config: configPromise });

    // 1. Fetch the 'id' locale version to translate
    let docToTranslate;
    if (isGlobal) {
      docToTranslate = await payload.findGlobal({
        slug: identifier as any,
        locale: 'id',
        fallbackLocale: 'none',
        depth: 0,
      });
    } else {
      if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
      docToTranslate = await payload.findByID({
        collection: identifier as any,
        id,
        locale: 'id',
        fallbackLocale: 'none',
        depth: 0,
      });
    }

    if (!docToTranslate) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    console.log(`[Auto-Translate Webhook] Translating ${identifier}...`);
    
    // Remove system fields
    const { id: docId, createdAt, updatedAt, ...cleanDoc } = docToTranslate;
    
    // Process translation
    const translatedData = await translateDocumentJSON(cleanDoc);

    // Update 'en' locale
    if (isGlobal) {
      await payload.updateGlobal({
        slug: identifier as any,
        locale: 'en',
        data: translatedData,
      });
    } else {
      await payload.update({
        collection: identifier as any,
        id: docId,
        locale: 'en',
        data: translatedData,
      });
    }
    
    console.log(`[Auto-Translate Webhook] Successfully translated ${identifier}`);
    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('[Auto-Translate Webhook] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
