import { NextResponse } from "next/server";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import { translateDocumentJSON } from "@/utils/translate";
import { requireAdminAuth } from "@/utils/adminAuth";

export async function GET(request: Request) {
  const authError = await requireAdminAuth(request);
  if (authError) return authError;
  try {
    const payload = await getPayload({ config: configPromise });
    const url = new URL(request.url);
    const slug = url.searchParams.get("slug") as any;

    if (!slug) return NextResponse.json({ error: "No slug" });

    console.log(`Force translating ${slug}...`);
    const doc = await payload.findGlobal({ slug, locale: "id", depth: 0 });
    const { id, createdAt, updatedAt, ...docToTranslate } = doc as any;

    const translatedData = await translateDocumentJSON(docToTranslate, "English");

    await payload.updateGlobal({
      slug,
      locale: "en",
      data: translatedData,
      context: { skipAutoTranslate: true },
    });

    console.log(`✅ Successfully translated ${slug}`);
    return NextResponse.json({ success: true, slug });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message });
  }
}
