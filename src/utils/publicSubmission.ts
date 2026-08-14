import { createHash } from "node:crypto";

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export function clientKey(request: Request, scope: string) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const address = forwarded || request.headers.get("x-real-ip") || "unknown";
  return `${scope}:${createHash("sha256").update(address).digest("hex")}`;
}

export function consumeRateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  if (buckets.size > 10_000) {
    for (const [bucketKey, bucket] of buckets) if (bucket.resetAt <= now) buckets.delete(bucketKey);
  }
  const existing = buckets.get(key);
  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfter: 0 };
  }
  if (existing.count >= limit) {
    return { allowed: false, retryAfter: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)) };
  }
  existing.count += 1;
  return { allowed: true, retryAfter: 0 };
}

export function cleanText(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().replaceAll("\u0000", "").slice(0, maxLength) : "";
}

export function validSubmissionTiming(startedAt: unknown) {
  const timestamp = Number(startedAt);
  const elapsed = Date.now() - timestamp;
  return Number.isFinite(timestamp) && elapsed >= 2500 && elapsed <= 24 * 60 * 60 * 1000;
}

export function rejectOversizedRequest(request: Request, maxBytes: number) {
  const declaredSize = Number(request.headers.get("content-length") || 0);
  return Number.isFinite(declaredSize) && declaredSize > maxBytes;
}

export async function readLimitedJson(request: Request, maxBytes: number): Promise<Record<string, unknown>> {
  if (!request.body) throw new SyntaxError("Missing request body.");
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > maxBytes) {
      await reader.cancel();
      throw new RangeError("Request body is too large.");
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  const parsed = JSON.parse(new TextDecoder().decode(bytes));
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new SyntaxError("Invalid JSON object.");
  return parsed as Record<string, unknown>;
}

export function validPublicOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    const host = new URL(origin).hostname.toLocaleLowerCase();
    const configuredHosts = [process.env.VERCEL_URL, process.env.VERCEL_PROJECT_PRODUCTION_URL]
      .filter((value): value is string => Boolean(value))
      .map((value) =>
        value
          .replace(/^https?:\/\//, "")
          .split("/")[0]
          .toLocaleLowerCase(),
      );
    return [
      "mahagawidyacita.com",
      "www.mahagawidyacita.com",
      ...(process.env.NODE_ENV === "production" ? [] : ["localhost", "127.0.0.1"]),
      ...configuredHosts,
    ].includes(host);
  } catch {
    return false;
  }
}
