function textFromValue(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(textFromValue);
  if (!value || typeof value !== "object") return [];
  return Object.entries(value as Record<string, unknown>).flatMap(([key, child]) =>
    key === "text" && typeof child === "string" ? [child] : textFromValue(child),
  );
}

const ENGLISH_SIGNALS = new Set([
  "and",
  "are",
  "as",
  "at",
  "awareness",
  "building",
  "business",
  "by",
  "for",
  "from",
  "government",
  "how",
  "in",
  "into",
  "is",
  "of",
  "on",
  "policy",
  "public",
  "the",
  "through",
  "to",
  "towards",
  "with",
]);

const INDONESIAN_SIGNALS = new Set([
  "adalah",
  "bagi",
  "benteng",
  "bisnis",
  "cara",
  "dalam",
  "dan",
  "dari",
  "dengan",
  "di",
  "era",
  "individu",
  "kebijakan",
  "kependudukan",
  "melalui",
  "membangun",
  "memahami",
  "menavigasi",
  "mengenal",
  "mengatasi",
  "meningkatkan",
  "pada",
  "panduan",
  "pelayanan",
  "pemerintah",
  "pemerintahan",
  "pemanfaatan",
  "pentingnya",
  "peran",
  "sebagai",
  "sektor",
  "terhadap",
  "untuk",
  "yang",
]);

/**
 * Prevents Indonesian fallback/copy data from leaking into public English pages.
 * This is deliberately conservative: uncertain documents remain available in
 * the CMS but are hidden from EN until an editor reviews their translation.
 */
export function isLikelyEnglishDocument(document: { content?: unknown; excerpt?: unknown; title?: unknown }): boolean {
  const text = textFromValue([document.title, document.excerpt, document.content])
    .join(" ")
    .toLocaleLowerCase()
    .replaceAll(/[^a-z\s'-]/g, " ");
  const words = text.split(/\s+/).filter(Boolean).slice(0, 800);
  if (!words.length) return false;

  const english = words.filter((word) => ENGLISH_SIGNALS.has(word)).length;
  const indonesian = words.filter((word) => INDONESIAN_SIGNALS.has(word)).length;
  if (indonesian >= 2 && indonesian > english) return false;
  if (words.length < 12) return english >= 1 && indonesian === 0;
  return english >= 3 && english >= indonesian * 1.25;
}
