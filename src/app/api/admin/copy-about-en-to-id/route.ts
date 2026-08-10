import { NextResponse } from "next/server";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import { requireAdminAuth } from "@/utils/adminAuth";

type Row = Record<string, unknown> & { id?: string | null };

function copyLocalizedFields(targetRows: Row[], sourceRows: Row[], fields: string[], label: string): Row[] {
  const sourceById = new Map(sourceRows.map((row) => [row.id, row]));
  if (!targetRows.length || targetRows.length !== sourceRows.length || sourceById.size !== sourceRows.length) {
    throw new Error(`${label}: source and target row structures do not match.`);
  }

  return targetRows.map((target) => {
    const source = sourceById.get(target.id);
    if (!target.id || !source) throw new Error(`${label}: missing matching English row ID.`);

    const localized = Object.fromEntries(
      fields.map((field) => {
        const value = source[field];
        if (typeof value !== "string" || value.trim() === "") {
          throw new Error(`${label}: English field ${field} is empty for row ${target.id}.`);
        }
        return [field, value];
      }),
    );
    return { ...target, ...localized };
  });
}

function scopedSnapshot(document: any) {
  return {
    coreValues: document.coreValues?.map(({ id, letter, name, desc }: any) => ({ id, letter, name, desc })) ?? [],
    misi: document.misi?.map(({ id, title, text }: any) => ({ id, title, text })) ?? [],
    stats: document.stats?.map(({ id, label }: any) => ({ id, label })) ?? [],
  };
}

export async function POST(request: Request) {
  const authError = await requireAdminAuth(request);
  if (authError) return authError;

  try {
    const payload = await getPayload({ config: configPromise });
    const [idDocument, enDocument] = await Promise.all([
      payload.findGlobal({ slug: "tentang-kami", locale: "id", fallbackLocale: "none", depth: 0 }),
      payload.findGlobal({ slug: "tentang-kami", locale: "en", fallbackLocale: "none", depth: 0 }),
    ]);
    const enBefore = scopedSnapshot(enDocument);

    const data = {
      coreValues: copyLocalizedFields(
        (idDocument.coreValues as Row[]) ?? [],
        (enDocument.coreValues as Row[]) ?? [],
        ["letter", "name", "desc"],
        "coreValues",
      ),
      misi: copyLocalizedFields(
        (idDocument.misi as Row[]) ?? [],
        (enDocument.misi as Row[]) ?? [],
        ["title", "text"],
        "misi",
      ),
      stats: copyLocalizedFields(
        (idDocument.stats as Row[]) ?? [],
        (enDocument.stats as Row[]) ?? [],
        ["label"],
        "stats",
      ),
    };

    await payload.updateGlobal({
      slug: "tentang-kami",
      locale: "id",
      overrideAccess: true,
      context: { skipAutoTranslate: true },
      data,
    });

    const [idAfter, enAfter] = await Promise.all([
      payload.findGlobal({ slug: "tentang-kami", locale: "id", fallbackLocale: "none", depth: 0 }),
      payload.findGlobal({ slug: "tentang-kami", locale: "en", fallbackLocale: "none", depth: 0 }),
    ]);
    const idSnapshot = scopedSnapshot(idAfter);
    const enSnapshot = scopedSnapshot(enAfter);
    if (JSON.stringify(idSnapshot) !== JSON.stringify(enSnapshot)) {
      throw new Error("Post-copy verification failed: ID does not exactly match EN.");
    }
    if (JSON.stringify(enSnapshot) !== JSON.stringify(enBefore)) {
      throw new Error("Post-copy verification failed: English source changed unexpectedly.");
    }

    return NextResponse.json({
      copied: {
        coreValues: idSnapshot.coreValues.length,
        missions: idSnapshot.misi.length,
        stats: idSnapshot.stats.length,
      },
      success: true,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
