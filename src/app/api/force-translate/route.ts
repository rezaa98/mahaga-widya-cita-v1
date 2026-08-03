import { NextResponse } from "next/server";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import { authorizeTranslationRequest } from "@/translation/auth";
import { getTranslationRecord } from "@/translation/records";
import { parseTranslationResource } from "@/translation/request";
import { queueTranslation } from "@/translation/service";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET() {
  return NextResponse.json(
    { error: "Use POST. Translation cannot be triggered by a link." },
    { headers: { Allow: "POST" }, status: 405 },
  );
}

export async function POST(req: Request) {
  const payload = await getPayload({ config: configPromise });
  const auth = await authorizeTranslationRequest(payload, req, ["manageContent", "manageSiteContent"]);
  if (auth.error) return auth.error;

  try {
    const body = await req.json();
    const resource = parseTranslationResource(body);
    const { job } = await queueTranslation(payload, resource, undefined, { force: true });
    if (job) await payload.jobs.runByID({ id: job.id, overrideAccess: true });
    const record = await getTranslationRecord(payload, resource);
    return NextResponse.json({ data: record, success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Translation failed." },
      { status: 400 },
    );
  }
}
