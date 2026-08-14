export const SITE_URL = "https://www.mahagawidyacita.com";

export function localizedAlternates(locale: string, path = "") {
  const normalizedPath = path && path !== "/" ? `/${path.replace(/^\/+|\/+$/g, "")}` : "";

  return {
    canonical: `/${locale}${normalizedPath}`,
    languages: {
      "id-ID": `/id${normalizedPath}`,
      "en-US": `/en${normalizedPath}`,
      "x-default": `/id${normalizedPath}`,
    },
  };
}

export function localizedAlternatesForLocales(locale: string, path: string, availableLocales: string[]) {
  const normalizedPath = path && path !== "/" ? `/${path.replace(/^\/+|\/+$/g, "")}` : "";
  const available = new Set(availableLocales);
  const languages: Record<string, string> = {};
  if (available.has("id")) languages["id-ID"] = `/id${normalizedPath}`;
  if (available.has("en")) languages["en-US"] = `/en${normalizedPath}`;
  languages["x-default"] = available.has("id") ? `/id${normalizedPath}` : `/${locale}${normalizedPath}`;
  return { canonical: `/${locale}${normalizedPath}`, languages };
}
