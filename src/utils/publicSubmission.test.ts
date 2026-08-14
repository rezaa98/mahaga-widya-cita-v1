import assert from "node:assert/strict";
import test from "node:test";
import {
  cleanText,
  consumeRateLimit,
  rejectOversizedRequest,
  validPublicOrigin,
  validSubmissionTiming,
} from "./publicSubmission";

test("cleanText normalizes untrusted text and enforces its limit", () => {
  assert.equal(cleanText("  hello\0world  ", 8), "hellowor");
  assert.equal(cleanText({ value: "invalid" }, 20), "");
});

test("rate limiter rejects requests after the configured limit", () => {
  const key = `test:${Date.now()}:${Math.random()}`;
  assert.equal(consumeRateLimit(key, 2, 60_000).allowed, true);
  assert.equal(consumeRateLimit(key, 2, 60_000).allowed, true);
  const blocked = consumeRateLimit(key, 2, 60_000);
  assert.equal(blocked.allowed, false);
  assert.ok(blocked.retryAfter > 0);
});

test("submission timing rejects bots and stale forms", () => {
  assert.equal(validSubmissionTiming(Date.now()), false);
  assert.equal(validSubmissionTiming(Date.now() - 3_000), true);
  assert.equal(validSubmissionTiming(Date.now() - 25 * 60 * 60 * 1_000), false);
});

test("request guards enforce body size and trusted browser origins", () => {
  const allowed = new Request("https://www.mahagawidyacita.com/api/public/contact", {
    headers: { "content-length": "1024", origin: "https://www.mahagawidyacita.com" },
  });
  const oversized = new Request("https://www.mahagawidyacita.com/api/public/contact", {
    headers: { "content-length": "50000", origin: "https://www.mahagawidyacita.com" },
  });
  const foreign = new Request("https://www.mahagawidyacita.com/api/public/contact", {
    headers: { origin: "https://attacker.example" },
  });
  assert.equal(validPublicOrigin(allowed), true);
  assert.equal(rejectOversizedRequest(allowed, 32 * 1024), false);
  assert.equal(rejectOversizedRequest(oversized, 32 * 1024), true);
  assert.equal(validPublicOrigin(foreign), false);
});
