import assert from "node:assert/strict";
import test from "node:test";
import { TranslationError, translateStrings } from "./translate";

test("empty input does not call the provider or require an API key", async () => {
  const previousKey = process.env.GEMINI_API_KEY;
  delete process.env.GEMINI_API_KEY;
  try {
    const result = await translateStrings([], {
      sourceLanguage: "Indonesian",
      targetLanguage: "English",
    });
    assert.deepEqual(result.translations, []);
    assert.equal(result.metrics.requests, 0);
  } finally {
    if (previousKey === undefined) delete process.env.GEMINI_API_KEY;
    else process.env.GEMINI_API_KEY = previousKey;
  }
});

test("missing provider configuration fails instead of copying source text", async () => {
  const previousKey = process.env.GEMINI_API_KEY;
  delete process.env.GEMINI_API_KEY;
  try {
    await assert.rejects(
      translateStrings(["Konten Indonesia"], {
        sourceLanguage: "Indonesian",
        targetLanguage: "English",
      }),
      (error: unknown) => error instanceof TranslationError && error.code === "CONFIGURATION_ERROR",
    );
  } finally {
    if (previousKey === undefined) delete process.env.GEMINI_API_KEY;
    else process.env.GEMINI_API_KEY = previousKey;
  }
});
