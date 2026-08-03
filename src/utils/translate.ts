import { GoogleGenAI } from "@google/genai";

const DEFAULT_MODEL = "gemini-3.6-flash";
const DEFAULT_MAX_BATCH_ITEMS = 24;
const DEFAULT_MAX_BATCH_TOKENS = 7_000;
const DEFAULT_RETRIES = 1;

const BUILT_IN_GLOSSARY: Readonly<Record<string, string>> = Object.freeze({
  "Mahaga Widya Cita": "Mahaga Widya Cita",
  MWC: "MWC",
  DOI: "DOI",
  ISSN: "ISSN",
  ORCID: "ORCID",
});

const TECHNICAL_KEYS = new Set([
  "blockName",
  "blockType",
  "direction",
  "filename",
  "format",
  "href",
  "icon",
  "id",
  "indent",
  "mimeType",
  "mode",
  "platform",
  "slug",
  "status",
  "style",
  "tag",
  "type",
  "url",
  "version",
]);

const PROTECTED_PATTERNS = [
  /https?:\/\/[^\s<>"']+/giu,
  /[\p{L}\p{N}._%+-]+@[\p{L}\p{N}.-]+\.[\p{L}]{2,}/giu,
  /<\/?[a-z][^>]*>/giu,
  /\{\{[^{}]+\}\}|\$\{[^{}]+\}|%\([^)]+\)[a-z]|%[a-z]|\{\d+\}/giu,
  /[-+]?\d+(?:[.,:/-]\d+)*(?:\s?%|\s?[A-Z]{2,4})?/gu,
] as const;

export interface TranslateStringsOptions {
  sourceLanguage: string;
  targetLanguage: string;
  glossary?: Record<string, string>;
  context?: string;
  model?: string;
  maxBatchItems?: number;
  maxBatchTokens?: number;
  retries?: number;
}

export interface TranslationMetrics {
  requests: number;
  retries: number;
  batches: number;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  latencyMs: number;
}

export interface TranslationBatchResult {
  translations: string[];
  provider: "google";
  model: string;
  metrics: TranslationMetrics;
}

export type TranslationErrorCode =
  "CONFIGURATION_ERROR" | "INPUT_TOO_LARGE" | "MODEL_ERROR" | "PARSE_ERROR" | "VALIDATION_ERROR";

export class TranslationError extends Error {
  readonly code: TranslationErrorCode;
  readonly retryable: boolean;
  override readonly cause?: unknown;

  constructor(code: TranslationErrorCode, message: string, options: { retryable?: boolean; cause?: unknown } = {}) {
    super(message);
    this.name = "TranslationError";
    this.code = code;
    this.retryable = options.retryable ?? false;
    this.cause = options.cause;
  }
}

interface TranslationBatch {
  startIndex: number;
  strings: string[];
}

interface UsageMetadata {
  promptTokenCount?: number;
  candidatesTokenCount?: number;
  totalTokenCount?: number;
}

function parseEnvironmentGlossary(): Record<string, string> {
  const raw = process.env.TRANSLATION_GLOSSARY_JSON;
  if (!raw) return {};

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("Expected an object");

    const glossary: Record<string, string> = {};
    for (const [source, target] of Object.entries(parsed)) {
      if (!source.trim() || typeof target !== "string" || !target.trim()) {
        throw new Error("Glossary keys and values must be non-empty strings");
      }
      glossary[source] = target;
    }
    return glossary;
  } catch (cause) {
    throw new TranslationError(
      "CONFIGURATION_ERROR",
      "TRANSLATION_GLOSSARY_JSON must be a JSON object containing string values.",
      { cause },
    );
  }
}

function createGlossary(custom: Record<string, string> | undefined): Record<string, string> {
  return {
    ...BUILT_IN_GLOSSARY,
    ...parseEnvironmentGlossary(),
    ...custom,
  };
}

function estimatedTokens(value: string): number {
  return Math.max(1, Math.ceil(value.length / 4));
}

function createBatches(
  strings: string[],
  maxBatchItems: number,
  maxBatchTokens: number,
  promptOverheadTokens: number,
): TranslationBatch[] {
  const availableTokens = maxBatchTokens - promptOverheadTokens;
  if (availableTokens < 256) {
    throw new TranslationError(
      "INPUT_TOO_LARGE",
      "Translation context and glossary leave too little room for source text in a batch.",
    );
  }

  const batches: TranslationBatch[] = [];
  let current: string[] = [];
  let currentTokens = 0;
  let startIndex = 0;

  strings.forEach((value, index) => {
    const itemTokens = estimatedTokens(value) + 12;
    if (itemTokens > availableTokens) {
      throw new TranslationError(
        "INPUT_TOO_LARGE",
        `Translation item ${index} is larger than the configured batch token limit.`,
      );
    }

    if (current.length > 0 && (current.length >= maxBatchItems || currentTokens + itemTokens > availableTokens)) {
      batches.push({ startIndex, strings: current });
      current = [];
      currentTokens = 0;
      startIndex = index;
    }

    current.push(value);
    currentTokens += itemTokens;
  });

  if (current.length) batches.push({ startIndex, strings: current });
  return batches;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function countLiteral(value: string, needle: string): number {
  if (!needle) return 0;
  return value.match(new RegExp(escapeRegExp(needle), "gu"))?.length ?? 0;
}

function collectProtectedFragments(source: string): string[] {
  const fragments = new Set<string>();
  for (const pattern of PROTECTED_PATTERNS) {
    for (const match of source.matchAll(pattern)) fragments.add(match[0]);
  }
  return [...fragments];
}

function validateProtectedContent(
  source: string,
  translated: string,
  glossary: Record<string, string>,
  itemIndex: number,
): void {
  for (const fragment of collectProtectedFragments(source)) {
    if (countLiteral(source, fragment) !== countLiteral(translated, fragment)) {
      throw new TranslationError(
        "VALIDATION_ERROR",
        `Protected value changed in translation item ${itemIndex}: ${fragment}`,
        { retryable: true },
      );
    }
  }

  for (const [sourceTerm, targetTerm] of Object.entries(glossary)) {
    const expectedCount = countLiteral(source, sourceTerm);
    if (expectedCount > 0 && countLiteral(translated, targetTerm) !== expectedCount) {
      throw new TranslationError(
        "VALIDATION_ERROR",
        `Glossary term was not preserved in translation item ${itemIndex}: ${sourceTerm}`,
        { retryable: true },
      );
    }
  }
}

function parseTranslationResponse(raw: string | undefined, expectedLength: number): string[] {
  if (!raw?.trim()) {
    throw new TranslationError("PARSE_ERROR", "The translation model returned an empty response.", {
      retryable: true,
    });
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (cause) {
    throw new TranslationError("PARSE_ERROR", "The translation model returned invalid JSON.", {
      retryable: true,
      cause,
    });
  }

  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new TranslationError("VALIDATION_ERROR", "The translation response must be a JSON object.", {
      retryable: true,
    });
  }

  const translations = (parsed as { translations?: unknown }).translations;
  if (!Array.isArray(translations) || translations.length !== expectedLength) {
    throw new TranslationError(
      "VALIDATION_ERROR",
      `Expected ${expectedLength} translated strings but received ${Array.isArray(translations) ? translations.length : 0}.`,
      { retryable: true },
    );
  }

  if (translations.some((item) => typeof item !== "string")) {
    throw new TranslationError("VALIDATION_ERROR", "Every translated item must be a string.", {
      retryable: true,
    });
  }

  return translations as string[];
}

function isRetryableProviderError(error: unknown): boolean {
  if (error instanceof TranslationError) return error.retryable;
  const candidate = error as { status?: unknown; code?: unknown; message?: unknown };
  const status = typeof candidate?.status === "number" ? candidate.status : Number(candidate?.code);
  if (status === 408 || status === 409 || status === 429 || status >= 500) return true;
  const message = typeof candidate?.message === "string" ? candidate.message : "";
  return /timeout|temporar|rate.?limit|quota|overload|unavailable|ECONNRESET|ETIMEDOUT/i.test(message);
}

function normalizeProviderError(error: unknown): TranslationError {
  if (error instanceof TranslationError) return error;
  const message = error instanceof Error ? error.message : "Unknown translation provider error";
  return new TranslationError("MODEL_ERROR", message, {
    retryable: isRetryableProviderError(error),
    cause: error,
  });
}

function delay(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function buildPrompt(strings: string[], options: TranslateStringsOptions, glossary: Record<string, string>): string {
  const glossaryLines = Object.entries(glossary).map(([source, target]) => `${source} => ${target}`);
  return [
    `Translate the JSON input from ${options.sourceLanguage} to ${options.targetLanguage}.`,
    "Return one natural, professional corporate translation for each input item in the same order.",
    "Preserve URLs, HTML tags, placeholders, numbers, units, punctuation tokens, and proper nouns exactly.",
    "Do not add explanations, markdown, or content not present in the source.",
    options.context ? `Editorial context: ${options.context}` : "",
    glossaryLines.length ? `Required glossary (source => required output):\n${glossaryLines.join("\n")}` : "",
    `Input: ${JSON.stringify({ strings })}`,
  ]
    .filter(Boolean)
    .join("\n\n");
}

function containsLexicalDocument(value: unknown): boolean {
  if (Array.isArray(value)) return value.some(containsLexicalDocument);
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  const root = record.root;
  if (root && typeof root === "object" && (root as Record<string, unknown>).type === "root") return true;
  return Object.values(record).some(containsLexicalDocument);
}

/**
 * Translates plain text strings. Document traversal and rich-text structure handling belong to the caller.
 * The function is atomic from the caller's perspective: any invalid batch throws and no partial result is returned.
 */
export async function translateStrings(
  strings: string[],
  options: TranslateStringsOptions,
): Promise<TranslationBatchResult> {
  if (!Array.isArray(strings) || strings.some((value) => typeof value !== "string")) {
    throw new TranslationError("VALIDATION_ERROR", "translateStrings expects an array of strings.");
  }
  if (!options.sourceLanguage?.trim() || !options.targetLanguage?.trim()) {
    throw new TranslationError("VALIDATION_ERROR", "Source and target languages are required.");
  }

  const model = (options.model ?? process.env.GEMINI_TRANSLATION_MODEL ?? DEFAULT_MODEL).trim();
  if (!model) throw new TranslationError("CONFIGURATION_ERROR", "Translation model is not configured.");
  if (strings.length === 0) {
    return {
      translations: [],
      provider: "google",
      model,
      metrics: {
        requests: 0,
        retries: 0,
        batches: 0,
        inputTokens: 0,
        outputTokens: 0,
        totalTokens: 0,
        latencyMs: 0,
      },
    };
  }

  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw new TranslationError("CONFIGURATION_ERROR", "GEMINI_API_KEY is not configured.");
  }

  const maxBatchItems = Math.floor(options.maxBatchItems ?? DEFAULT_MAX_BATCH_ITEMS);
  const maxBatchTokens = Math.floor(options.maxBatchTokens ?? DEFAULT_MAX_BATCH_TOKENS);
  const retries = Math.floor(options.retries ?? DEFAULT_RETRIES);
  if (!Number.isFinite(maxBatchItems) || maxBatchItems < 1) {
    throw new TranslationError("VALIDATION_ERROR", "maxBatchItems must be a positive integer.");
  }
  if (!Number.isFinite(maxBatchTokens) || maxBatchTokens < 256) {
    throw new TranslationError("VALIDATION_ERROR", "maxBatchTokens must be at least 256.");
  }
  if (!Number.isFinite(retries) || retries < 0) {
    throw new TranslationError("VALIDATION_ERROR", "retries must be zero or a positive integer.");
  }
  const glossary = createGlossary(options.glossary);
  const promptOverheadTokens = 180 + estimatedTokens(options.context ?? "") + estimatedTokens(JSON.stringify(glossary));
  const batches = createBatches(strings, maxBatchItems, maxBatchTokens, promptOverheadTokens);
  const client = new GoogleGenAI({ apiKey });
  const startedAt = Date.now();
  const metrics: TranslationMetrics = {
    requests: 0,
    retries: 0,
    batches: batches.length,
    inputTokens: 0,
    outputTokens: 0,
    totalTokens: 0,
    latencyMs: 0,
  };
  const translations: string[] = [];

  for (const batch of batches) {
    let translatedBatch: string[] | undefined;
    let lastError: TranslationError | undefined;

    for (let attempt = 0; attempt <= retries; attempt += 1) {
      if (attempt > 0) {
        metrics.retries += 1;
        await delay(400 * 2 ** (attempt - 1) + Math.floor(Math.random() * 200));
      }

      metrics.requests += 1;
      try {
        const response = await client.models.generateContent({
          model,
          contents: buildPrompt(batch.strings, options, glossary),
          config: {
            responseMimeType: "application/json",
            responseJsonSchema: {
              type: "object",
              additionalProperties: false,
              required: ["translations"],
              properties: {
                translations: {
                  type: "array",
                  minItems: batch.strings.length,
                  maxItems: batch.strings.length,
                  items: { type: "string" },
                },
              },
            },
          },
        });
        const usage = response.usageMetadata as UsageMetadata | undefined;
        const inputTokens = usage?.promptTokenCount ?? 0;
        const outputTokens = usage?.candidatesTokenCount ?? 0;
        metrics.inputTokens += inputTokens;
        metrics.outputTokens += outputTokens;
        metrics.totalTokens += usage?.totalTokenCount ?? inputTokens + outputTokens;

        translatedBatch = parseTranslationResponse(response.text, batch.strings.length);
        translatedBatch.forEach((translated, index) => {
          validateProtectedContent(batch.strings[index], translated, glossary, batch.startIndex + index);
        });
        break;
      } catch (error) {
        lastError = normalizeProviderError(error);
        if (!lastError.retryable || attempt === retries) break;
      }
    }

    if (!translatedBatch) {
      metrics.latencyMs = Date.now() - startedAt;
      throw lastError ?? new TranslationError("MODEL_ERROR", "Translation failed without an error response.");
    }
    translations.push(...translatedBatch);
  }

  metrics.latencyMs = Date.now() - startedAt;
  return { translations, provider: "google", model, metrics };
}

/** Compatibility wrapper for existing plain-text callers. Errors intentionally propagate. */
export async function translateText(text: string, targetLanguage = "English"): Promise<string> {
  if (!text) return text;
  const result = await translateStrings([text], {
    sourceLanguage: "Indonesian",
    targetLanguage,
  });
  return result.translations[0];
}

/**
 * @deprecated Rich-text structure must be traversed by a schema-aware caller and passed to translateStrings.
 */
export async function translateLexicalJSON(): Promise<never> {
  throw new TranslationError(
    "VALIDATION_ERROR",
    "translateLexicalJSON is unsupported. Extract Lexical text nodes and call translateStrings instead.",
  );
}

/**
 * @deprecated Prefer schema-aware extraction followed by translateStrings. Retained for legacy plain JSON tools.
 */
export async function translateDocumentJSON(
  jsonObj: any,
  targetLanguage = "English",
  sourceLanguage = "Indonesian",
): Promise<any> {
  if (jsonObj == null) return jsonObj;
  if (containsLexicalDocument(jsonObj)) {
    throw new TranslationError(
      "VALIDATION_ERROR",
      "translateDocumentJSON does not accept Lexical documents. Use a schema-aware text-node extractor.",
    );
  }

  const clone = JSON.parse(JSON.stringify(jsonObj)) as unknown;
  const strings: string[] = [];
  const setters: Array<(translated: string) => void> = [];

  const visit = (value: unknown, parent?: Record<string | number, unknown>, key?: string | number): void => {
    if (typeof value === "string") {
      if (parent && key !== undefined && /\p{L}/u.test(value)) {
        strings.push(value);
        setters.push((translated) => {
          parent[key] = translated;
        });
      }
      return;
    }
    if (Array.isArray(value)) {
      value.forEach((item, index) => visit(item, value as unknown as Record<number, unknown>, index));
      return;
    }
    if (value && typeof value === "object") {
      const record = value as Record<string, unknown>;
      Object.entries(record).forEach(([childKey, childValue]) => {
        if (!TECHNICAL_KEYS.has(childKey)) visit(childValue, record, childKey);
      });
    }
  };

  visit(clone);
  if (!strings.length) return clone;

  const result = await translateStrings(strings, { sourceLanguage, targetLanguage });
  result.translations.forEach((translation, index) => setters[index](translation));
  return clone;
}
