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
