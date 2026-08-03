import { NextResponse } from "next/server";
import { getPayload } from "payload";
import configPromise from "@payload-config";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const payload = await getPayload({ config: configPromise });
    const result = await payload.jobs.run({
      limit: 25,
      overrideAccess: true,
      processingOrder: "createdAt",
      queue: "translations",
    });
    return NextResponse.json({ result, success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Translation job runner failed." },
      { status: 500 },
    );
  }
}
