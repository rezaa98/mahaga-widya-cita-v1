import { NextResponse } from "next/server";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import { translateDocumentJSON } from "@/utils/translate";
import { requireAdminAuth } from "@/utils/adminAuth";

// Allow this route to run up to 5 minutes on Vercel Pro (or max allowed on Hobby)
export const maxDuration = 300;
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const authError = await requireAdminAuth(req);
  if (authError) return authError;

  try {
    const body = await req.json();
    const { identifier, id, isGlobal, sourceLocale = "id", targetLocale = "en" } = body;

    if (!identifier) {
      return NextResponse.json({ error: "Missing identifier" }, { status: 400 });
    }

    const payload = await getPayload({ config: configPromise });

    // 1. Fetch the source locale version to translate
    let docToTranslate;
    if (isGlobal) {
      docToTranslate = await payload.findGlobal({
        slug: identifier as any,
        locale: sourceLocale,
        fallbackLocale: "none",
        depth: 0,
      });
    } else {
      if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
      docToTranslate = await payload.findByID({
        collection: identifier as any,
        id,
        locale: sourceLocale,
        fallbackLocale: "none",
        depth: 0,
      });
    }

    if (!docToTranslate) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    console.log(`[Auto-Translate Webhook] Translating ${identifier} from ${sourceLocale} to ${targetLocale}...`);

    // Remove system fields
    const { id: docId, createdAt, updatedAt, ...cleanDoc } = docToTranslate;

    // Process translation
    const sourceLangStr = sourceLocale === "id" ? "Indonesian" : "English";
    const targetLangStr = targetLocale === "id" ? "Indonesian" : "English";
    const translatedData = await translateDocumentJSON(cleanDoc, targetLangStr, sourceLangStr);

    // Update target locale
    if (isGlobal) {
      await payload.updateGlobal({
        slug: identifier as any,
        locale: targetLocale,
        data: translatedData,
        context: { skipAutoTranslate: true },
      });
    } else {
      await payload.update({
        collection: identifier as any,
        id: docId,
        locale: targetLocale,
        data: translatedData,
        context: { skipAutoTranslate: true },
      });
    }

    console.log(`[Auto-Translate Webhook] Successfully translated ${identifier}`);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[Auto-Translate Webhook] Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
