import assert from "node:assert/strict";
import test from "node:test";
import { isLikelyEnglishDocument } from "./contentLanguage";

test("accepts an English article", () => {
  assert.equal(
    isLikelyEnglishDocument({
      title: "Building Cybersecurity Awareness in the Family Environment",
      excerpt: "Learn how families can build safer habits and protect personal information online.",
    }),
    true,
  );
});

test("rejects an Indonesian article stored in the English locale", () => {
  assert.equal(
    isLikelyEnglishDocument({
      title: "Meningkatkan Literasi Digital di Era Pemerintahan Terbuka",
      excerpt: "Panduan untuk memahami peran teknologi dalam pelayanan pemerintah dan masyarakat.",
    }),
    false,
  );
});

test("reads text from rich-text content", () => {
  assert.equal(
    isLikelyEnglishDocument({
      title: "Public Policy",
      content: {
        root: { children: [{ children: [{ text: "The policy is designed for business and government." }] }] },
      },
    }),
    true,
  );
});

test("rejects empty localized content", () => {
  assert.equal(isLikelyEnglishDocument({}), false);
});
