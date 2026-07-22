type MediaReference =
  | {
      alt?: string | null;
      url?: string | null;
    }
  | string
  | number
  | null
  | undefined;

type ContentWithImage = {
  featuredImage?: MediaReference;
  imageUrl?: string | null;
};

/**
 * Prefer the CMS media relationship while retaining the legacy URL during the
 * staged image migration. A numeric relationship is intentionally ignored: it
 * needs to be populated by Payload before a browser can render it.
 */
export function getContentImage<T extends object>(content: T): string | undefined {
  const mediaContent = content as T & ContentWithImage;
  const featuredImage = mediaContent.featuredImage;

  if (featuredImage && typeof featuredImage === "object" && featuredImage.url) {
    return featuredImage.url;
  }

  if (typeof featuredImage === "string" && featuredImage.startsWith("/")) {
    return featuredImage;
  }

  return mediaContent.imageUrl || undefined;
}

export function getContentImageAlt<T extends object>(content: T, fallback: string): string {
  const mediaContent = content as T & ContentWithImage;
  const featuredImage = mediaContent.featuredImage;

  if (featuredImage && typeof featuredImage === "object" && featuredImage.alt?.trim()) {
    return featuredImage.alt;
  }

  return fallback;
}

export function getLocalizedArticleHref(locale: string, slugOrID: string | number): string {
  return `/${locale}/artikel/${slugOrID}`;
}

export function getLocalizedArticlesHref(locale: string, search = ""): string {
  return `/${locale}/artikel${search}`;
}

export function createLexicalContent(paragraphs: string[]) {
  const children = paragraphs.map((p) => ({
    type: "paragraph",
    format: "",
    indent: 0,
    version: 1,
    children: [
      {
        mode: "normal",
        text: p,
        type: "text",
        style: "",
        detail: 0,
        format: 0,
        version: 1,
      },
    ],
  }));

  return {
    root: {
      type: "root",
      direction: null,
      format: "" as const,
      indent: 0,
      version: 1,
      children,
    },
  };
}

