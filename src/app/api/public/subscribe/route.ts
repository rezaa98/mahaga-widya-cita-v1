import { NextResponse } from "next/server";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import {
  cleanText,
  clientKey,
  consumeRateLimit,
  readLimitedJson,
  rejectOversizedRequest,
  validPublicOrigin,
  validSubmissionTiming,
} from "@/utils/publicSubmission";

export async function POST(request: Request) {
  if (!validPublicOrigin(request)) return NextResponse.json({ error: "Invalid origin." }, { status: 403 });
  if (rejectOversizedRequest(request, 4 * 1024))
    return NextResponse.json({ error: "Request is too large." }, { status: 413 });
  let body: Record<string, unknown>;
  try {
    body = await readLimitedJson(request, 4 * 1024);
  } catch (error) {
    if (error instanceof RangeError) return NextResponse.json({ error: "Request is too large." }, { status: 413 });
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (cleanText(body.website, 200) || !validSubmissionTiming(body.startedAt))
    return NextResponse.json({ error: "Submission rejected." }, { status: 400 });
  const email = cleanText(body.email, 254).toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(email)) return NextResponse.json({ error: "Invalid email." }, { status: 400 });
  const rate = consumeRateLimit(clientKey(request, "subscribe"), 5, 60 * 60 * 1000);
  if (!rate.allowed)
    return NextResponse.json(
      { error: "Too many subscriptions." },
      { status: 429, headers: { "Retry-After": String(rate.retryAfter) } },
    );
  try {
    const payload = await getPayload({ config: configPromise });
    const existing = await payload.find({
      collection: "subscribers",
      where: { email: { equals: email } },
      limit: 1,
      overrideAccess: true,
    });
    if (!existing.totalDocs) {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
      const recent = await payload.count({
        collection: "subscribers",
        where: { createdAt: { greater_than: oneHourAgo } },
        overrideAccess: true,
      });
      if (recent.totalDocs < 200) {
        await payload.create({ collection: "subscribers", data: { email }, overrideAccess: true });
      }
    }
    // Always return the same response so this endpoint cannot be used to
    // enumerate which email addresses are already subscribed.
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[public/subscribe] Unable to store subscription:", error);
    return NextResponse.json({ error: "Unable to process subscription." }, { status: 503 });
  }
}
