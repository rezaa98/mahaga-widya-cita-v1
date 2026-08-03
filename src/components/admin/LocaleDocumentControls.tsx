"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { toast, useDocumentInfo, useFormModified } from "@payloadcms/ui";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CONTENT_LOCALES, localeHref, useAdminLanguage, useContentLocale } from "./adminLocale";

type Availability = "checking" | "available" | "missing" | "new" | "error";

const meaningfulKeys: Record<string, string[]> = {
  articles: ["title", "content", "excerpt"],
  journals: ["title", "abstract", "content", "keywords"],
  "policy-reviews": ["title", "summary", "content", "excerpt"],
  services: ["name", "title", "description", "content"],
  "team-members": ["name", "position", "bio"],
  categories: ["name", "title"],
  beranda: ["hero", "featuredData", "about", "services", "cta"],
  "tentang-kami": ["hero", "title", "description", "vision", "mission"],
  kontak: ["title", "description", "address"],
  footer: ["description", "copyright", "links"],
  navbar: ["links", "ctaLabel"],
};

function hasContent(data: Record<string, unknown>, slug: string) {
  const keys = meaningfulKeys[slug] || ["title", "name", "description", "content"];
  const meaningful = (value: unknown): boolean => {
    if (typeof value === "string") return value.trim().length > 0;
    if (Array.isArray(value)) return value.some(meaningful);
    if (value && typeof value === "object") return Object.values(value).some(meaningful);
    return false;
  };
  return keys.some((key) => meaningful(data?.[key]));
}

export const LocaleDocumentControls: React.FC = () => {
  const locale = useContentLocale();
  const adminLanguage = useAdminLanguage();
  const copy = adminLanguage === "en";
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const modified = useFormModified();
  const { collectionSlug, globalSlug, id } = useDocumentInfo();
  const slug = collectionSlug || globalSlug || "";
  const other = locale === "id" ? CONTENT_LOCALES.en : CONTENT_LOCALES.id;
  const current = CONTENT_LOCALES[locale];
  const [availability, setAvailability] = useState<Availability>(id || globalSlug ? "checking" : "new");

  useEffect(() => {
    if (!modified) return;
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [modified]);

  useEffect(() => {
    if ((!id && !globalSlug) || !slug) {
      setAvailability("new");
      return;
    }
    const controller = new AbortController();
    const endpoint = collectionSlug
      ? `/api/${collectionSlug}/${id}?locale=${locale}&fallback-locale=null&depth=0&draft=true`
      : `/api/globals/${globalSlug}?locale=${locale}&fallback-locale=null&depth=0&draft=true`;
    setAvailability("checking");
    fetch(endpoint, { credentials: "include", signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error(String(response.status));
        return response.json();
      })
      .then((json) => setAvailability(hasContent((json?.doc || json) as Record<string, unknown>, slug) ? "available" : "missing"))
      .catch(() => {
        if (!controller.signal.aborted) setAvailability("error");
      });
    return () => controller.abort();
  }, [collectionSlug, globalSlug, id, locale, slug]);

  const statusText = useMemo(() => {
    if (availability === "checking") return copy ? "Checking translation…" : "Memeriksa terjemahan…";
    if (availability === "available") return copy ? `${current.shortLabel} content is available` : `Konten ${current.shortLabel} tersedia`;
    if (availability === "missing") return copy ? `${current.shortLabel} is empty — fallback is not counted` : `${current.shortLabel} masih kosong — fallback tidak dihitung`;
    if (availability === "new") return copy ? `New ${current.shortLabel} content` : `Konten ${current.shortLabel} baru`;
    return copy ? "Translation status unavailable" : "Status terjemahan tidak tersedia";
  }, [availability, copy, current.shortLabel]);

  const switchLocale = useCallback(() => {
    if (modified) {
      const proceed = window.confirm(
        copy
          ? `Unsaved changes in ${current.shortLabel} will be lost. Switch to ${other.shortLabel}?`
          : `Perubahan ${current.shortLabel} belum tersimpan dan akan hilang. Tetap pindah ke ${other.shortLabel}?`,
      );
      if (!proceed) return;
    }
    toast.info(copy ? `Opening ${other.label} content` : `Membuka konten ${other.label}`);
    router.replace(localeHref(pathname, searchParams.toString(), other.code), { scroll: false });
  }, [copy, current.shortLabel, modified, other, pathname, router, searchParams]);

  return (
    <section className={`mwc-document-locale mwc-document-locale--${locale}`} aria-label={copy ? "Document content language" : "Bahasa konten dokumen"}>
      <div>
        <span className="mwc-document-locale__badge">{current.shortLabel}</span>
        <span>
          <small>{copy ? "Editing content version" : "Sedang mengedit versi konten"}</small>
          <strong>{current.label}</strong>
        </span>
      </div>
      <span className={`mwc-document-locale__status mwc-document-locale__status--${availability}`}>{statusText}</span>
      {modified && <span className="mwc-document-locale__dirty">{copy ? "Unsaved changes" : "Perubahan belum tersimpan"}</span>}
      <button type="button" onClick={switchLocale}>{copy ? `Switch to ${other.shortLabel}` : `Pindah ke ${other.shortLabel}`}</button>
    </section>
  );
};
