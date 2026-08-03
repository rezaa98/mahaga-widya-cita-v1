import { NextResponse } from "next/server";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import { authorizeTranslationRequest } from "@/translation/auth";
import { queueTranslation } from "@/translation/service";
import { TRANSLATABLE_COLLECTIONS, TRANSLATABLE_GLOBALS } from "@/translation/types";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

type BulkRequest = {
  collection?: string;
  dryRun?: boolean;
  includeGlobals?: boolean;
  limit?: number;
  page?: number;
  runNow?: boolean;
};

export async function GET() {
  return NextResponse.json(
    { error: "Use POST. Bulk translation changes server state and cannot be triggered by a link." },
    { headers: { Allow: "POST" }, status: 405 },
  );
}

export async function POST(req: Request) {
  const payload = await getPayload({ config: configPromise });
  const auth = await authorizeTranslationRequest(payload, req, ["manageSiteContent"]);
  if (auth.error) return auth.error;

  let body: BulkRequest;
  try {
    body = (await req.json()) as BulkRequest;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const page = Math.max(1, Math.floor(Number(body.page) || 1));
  const limit = Math.min(50, Math.max(1, Math.floor(Number(body.limit) || 20)));
  const selectedCollections = body.collection
    ? TRANSLATABLE_COLLECTIONS.filter((slug) => slug === body.collection)
    : TRANSLATABLE_COLLECTIONS;

  if (body.collection && selectedCollections.length === 0) {
    return NextResponse.json({ error: "Unsupported collection." }, { status: 400 });
  }

  const resources: Array<{ identifier: string; resourceId?: string; resourceType: "collection" | "global" }> = [];
  let hasNextPage = false;

  try {
    for (const identifier of selectedCollections) {
      const result = await payload.find({
        collection: identifier,
        depth: 0,
        draft: true,
        fallbackLocale: "none" as any,
        limit,
        locale: "id",
        overrideAccess: true,
        page,
      });
      hasNextPage ||= result.hasNextPage;
      resources.push(
        ...result.docs.map((doc) => ({ identifier, resourceId: String(doc.id), resourceType: "collection" as const })),
      );
    }

    if (body.includeGlobals && page === 1) {
      resources.push(...TRANSLATABLE_GLOBALS.map((identifier) => ({ identifier, resourceType: "global" as const })));
    }

    if (body.dryRun) {
      return NextResponse.json({ dryRun: true, hasNextPage, nextPage: hasNextPage ? page + 1 : null, resources });
    }

    const queued: typeof resources = [];
    const unchanged: typeof resources = [];
    const failed: Array<(typeof resources)[number] & { error: string }> = [];
    for (const resource of resources) {
      try {
        const result = await queueTranslation(payload, resource);
        if (result.skipped) unchanged.push(resource);
        else queued.push(resource);
      } catch (error) {
        failed.push({
          ...resource,
          error: error instanceof Error ? error.message : "Unable to queue translation.",
        });
      }
    }

    let runResult: unknown;
    if (body.runNow && queued.length) {
      runResult = await payload.jobs.run({
        limit: Math.min(10, queued.length),
        overrideAccess: true,
        queue: "translations",
      });
    }

    return NextResponse.json({
      failed,
      hasNextPage,
      nextPage: hasNextPage ? page + 1 : null,
      queued,
      runResult,
      success: failed.length === 0,
      unchanged,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Bulk translation failed." },
      { status: 500 },
    );
  }
}
