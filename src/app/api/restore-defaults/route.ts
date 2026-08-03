import { NextResponse } from "next/server";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import { queueTranslation } from "@/translation/service";
import { Navbar } from "@/globals/Navbar";
import { Footer } from "@/globals/Footer";
import { Beranda } from "@/globals/Beranda";
import { TentangKami } from "@/globals/TentangKami";
import { Kontak } from "@/globals/Kontak";
import { requireAdminAuth } from "@/utils/adminAuth";

function extractDefaults(fields: any[]): any {
  const result: any = {};
  for (const field of fields) {
    if (field.type === "group" || field.type === "tab") {
      result[field.name] = extractDefaults(field.fields);
    } else if (field.type === "tabs") {
      for (const tab of field.tabs) {
        Object.assign(result, extractDefaults(tab.fields));
      }
    } else if (field.name && field.defaultValue !== undefined) {
      result[field.name] = field.defaultValue;
    }
  }
  return result;
}

export async function GET() {
  return NextResponse.json(
    { error: "Use POST. Restoring defaults changes server state." },
    { headers: { Allow: "POST" }, status: 405 },
  );
}

export async function POST(request: Request) {
  const authError = await requireAdminAuth(request);
  if (authError) return authError;
  try {
    const payload = await getPayload({ config: configPromise });

    const globals = [
      { slug: "navbar", config: Navbar },
      { slug: "footer", config: Footer },
      { slug: "beranda", config: Beranda },
      { slug: "tentang-kami", config: TentangKami },
      { slug: "kontak", config: Kontak },
    ];

    for (const g of globals) {
      console.log(`Restoring defaults for ${g.slug}...`);
      const defaultData = extractDefaults(g.config.fields);

      // Restore ID
      await payload.updateGlobal({
        slug: g.slug as any,
        locale: "id",
        data: defaultData,
        context: { skipAutoTranslate: true },
      });

      // English remains unchanged until an editor reviews and approves the
      // candidate produced by the shared translation workflow.
      await queueTranslation(payload, {
        identifier: g.slug,
        resourceType: "global",
      });
      console.log(`✅ ${g.slug} restored and queued for English review.`);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message });
  }
}
