const PRODUCTION_URL = "https://www.mahagawidyacita.com";

export function getServerURL() {
  const configured = process.env.NEXT_PUBLIC_SERVER_URL || process.env.SERVER_URL;

  if (configured) {
    try {
      const url = new URL(configured);
      if (url.protocol === "http:" || url.protocol === "https:") return url.origin;
    } catch {
      // Fall back to the canonical production URL below.
    }
  }

  return process.env.NODE_ENV === "production" ? PRODUCTION_URL : "http://localhost:3000";
}
