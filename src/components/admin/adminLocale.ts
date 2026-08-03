"use client";

import { useLocale, useTranslation } from "@payloadcms/ui";

export type AdminContentLocale = "id" | "en";

export const CONTENT_LOCALES: Record<AdminContentLocale, { code: AdminContentLocale; label: string; shortLabel: string }> = {
  id: { code: "id", label: "Indonesia", shortLabel: "ID" },
  en: { code: "en", label: "English", shortLabel: "EN" },
};

export function useAdminLanguage() {
  const { i18n } = useTranslation();
  return i18n.language === "en" ? "en" : "id";
}

export function useContentLocale(): AdminContentLocale {
  const locale = useLocale();
  return locale?.code === "en" ? "en" : "id";
}

export function withLocale(href: string, locale: AdminContentLocale) {
  const [path, hash = ""] = href.split("#", 2);
  const [pathname, query = ""] = path.split("?", 2);
  const params = new URLSearchParams(query);
  params.set("locale", locale);
  return `${pathname}?${params.toString()}${hash ? `#${hash}` : ""}`;
}

export function localeHref(pathname: string, search: string, locale: AdminContentLocale) {
  const params = new URLSearchParams(search);
  params.set("locale", locale);
  return `${pathname}?${params.toString()}`;
}
