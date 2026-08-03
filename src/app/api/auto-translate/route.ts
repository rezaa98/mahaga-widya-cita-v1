import { NextResponse } from "next/server";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import { authorizeTranslationRequest } from "@/translation/auth";
import { getTranslationRecord } from "@/translation/records";
import { parseTranslationResource } from "@/translation/request";
import { queueTranslation } from "@/translation/service";

// Allow this route to run up to 5 minutes on Vercel Pro (or max allowed on Hobby)
export const maxDuration = 300;
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const payload = await getPayload({ config: configPromise });
    const auth = await authorizeTranslationRequest(payload, req, ["manageContent", "manageSiteContent"]);
    if (auth.error) return auth.error;
    if ((body.sourceLocale && body.sourceLocale !== "id") || (body.targetLocale && body.targetLocale !== "en")) {
      return NextResponse.json({ error: "Only Indonesian to English translation is supported." }, { status: 400 });
    }
    const resource = parseTranslationResource(body);
    const { job } = await queueTranslation(payload, resource);
    if (job) await payload.jobs.runByID({ id: job.id, overrideAccess: true });
    const record = await getTranslationRecord(payload, resource);
    return NextResponse.json({ data: record, status: record?.status || "queued", success: true });
  } catch (error) {
    console.error("[Auto-Translate] Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Translation failed." },
      { status: 500 },
    );
  }
}
