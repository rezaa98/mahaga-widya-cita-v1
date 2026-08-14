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
  if (rejectOversizedRequest(request, 32 * 1024))
    return NextResponse.json({ error: "Request is too large." }, { status: 413 });

  let body: Record<string, unknown>;
  try {
    body = await readLimitedJson(request, 32 * 1024);
  } catch (error) {
    if (error instanceof RangeError) return NextResponse.json({ error: "Request is too large." }, { status: 413 });
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (cleanText(body.website, 200) || !validSubmissionTiming(body.startedAt)) {
    return NextResponse.json({ error: "Submission rejected." }, { status: 400 });
  }

  const data = {
    name: cleanText(body.name, 100),
    email: cleanText(body.email, 254).toLowerCase(),
    phone: cleanText(body.phone, 30),
    institution: cleanText(body.institution, 150),
    subject: cleanText(body.subject, 150),
    message: cleanText(body.message, 5000),
  };
  if (!data.name || !data.email || !data.subject || !data.message || !/^\S+@\S+\.\S+$/.test(data.email)) {
    return NextResponse.json({ error: "Required fields are invalid." }, { status: 400 });
  }

  const rate = consumeRateLimit(clientKey(request, "contact"), 5, 10 * 60 * 1000);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: "Too many submissions." },
      { status: 429, headers: { "Retry-After": String(rate.retryAfter) } },
    );
  }

  try {
    const payload = await getPayload({ config: configPromise });
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    const [recentForEmail, recentGlobal] = await Promise.all([
      payload.count({
        collection: "contact-submissions",
        where: { and: [{ email: { equals: data.email } }, { createdAt: { greater_than: tenMinutesAgo } }] },
        overrideAccess: true,
      }),
      payload.count({
        collection: "contact-submissions",
        where: { createdAt: { greater_than: tenMinutesAgo } },
        overrideAccess: true,
      }),
    ]);
    if (recentForEmail.totalDocs >= 3 || recentGlobal.totalDocs >= 100) {
      return NextResponse.json({ error: "Too many submissions." }, { status: 429, headers: { "Retry-After": "600" } });
    }
    await payload.create({ collection: "contact-submissions", data, overrideAccess: true });
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("[public/contact] Unable to store submission:", error);
    return NextResponse.json({ error: "Unable to process submission." }, { status: 503 });
  }
}
