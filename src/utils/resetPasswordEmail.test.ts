import assert from "node:assert/strict";
import test from "node:test";
import { generateResetPasswordEmail, resetPasswordURL } from "./resetPasswordEmail";

test("reset password link is absolute and token is encoded", () => {
  const previousServerURL = process.env.NEXT_PUBLIC_SERVER_URL;
  try {
    process.env.NEXT_PUBLIC_SERVER_URL = "https://www.mahagawidyacita.com/ignored-path";

    assert.equal(resetPasswordURL("secure/token"), "https://www.mahagawidyacita.com/admin/reset/secure%2Ftoken");
  } finally {
    if (previousServerURL === undefined) delete process.env.NEXT_PUBLIC_SERVER_URL;
    else process.env.NEXT_PUBLIC_SERVER_URL = previousServerURL;
  }
});

test("reset password email contains corporate CTA and safe fallback URL", () => {
  const html = generateResetPasswordEmail({ email: "admin@example.com", token: "abc123" });
  assert.match(html, /PT Mahaga Widya Cita/);
  assert.match(html, /Atur ulang kata sandi/);
  assert.match(html, /https?:\/\/[^"<]+\/admin\/reset\/abc123/);
  assert.match(html, /60 menit/);
});
