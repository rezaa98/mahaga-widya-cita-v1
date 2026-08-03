"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useDocumentInfo, useFormModified } from "@payloadcms/ui";
import { CONTENT_LOCALES, useContentLocale } from "./adminLocale";

type Availability = "checking" | "available" | "missing" | "new" | "error";

const localizedPaths: Record<string, string[]> = {
  articles: ["title", "content", "excerpt"],
  journals: ["title", "abstract", "content", "keywords"],
  "policy-reviews": ["title", "summary", "content", "excerpt"],
  services: ["name", "title", "description", "content"],
  "team-members": ["name", "position", "bio"],
  categories: ["name", "title"],
  beranda: [
    "hero.badge", "hero.title", "hero.titleHighlight", "hero.titleSuffix", "hero.description", "hero.features[].text",
    "stats[].suffix", "stats[].label", "partners.title", "partners.list[].name", "servicesIntro.badge",
    "servicesIntro.title", "servicesIntro.description", "cta.title", "cta.description", "cta.waMessage", "cta.features[].text",
  ],
  "tentang-kami": ["hero.badge", "hero.title", "hero.titleHighlight", "hero.description"],
  kontak: ["heroTitle", "heroSubtitle", "phone", "address", "workingHours"],
  footer: ["companyDescription", "socialMedia[].url", "linksCompany[].label", "linksCompany[].url"],
  navbar: ["links[].label", "links[].href", "links[].children[].label", "links[].children[].href"],
};

function valuesAtPath(value: unknown, segments: string[]): unknown[] {
  if (!segments.length) return [value];
  const [segment, ...rest] = segments;
  const isArray = segment.endsWith("[]");
  const key = isArray ? segment.slice(0, -2) : segment;
  const next = value && typeof value === "object" ? (value as Record<string, unknown>)[key] : undefined;
  if (isArray) {
    if (!Array.isArray(next) || next.length === 0) return [undefined];
    return next.flatMap((entry) => valuesAtPath(entry, rest));
  }
  return valuesAtPath(next, rest);
}

function contentProgress(data: Record<string, unknown>, slug: string) {
  const paths = localizedPaths[slug] || ["title", "name", "description", "content"];
  const meaningful = (value: unknown) => {
    if (typeof value === "string") return value.trim().length > 0;
    if (Array.isArray(value)) return value.some(meaningful);
    if (value && typeof value === "object") return Object.keys(value).length > 0;
    return false;
  };
  const values = paths.flatMap((path) => valuesAtPath(data, path.split(".")));
  return { filled: values.filter(meaningful).length, total: values.length };
}

export const LocaleDocumentControls: React.FC = () => {
  const locale = useContentLocale();
  const copy = locale === "en";
  const modified = useFormModified();
  const { collectionSlug, globalSlug, id } = useDocumentInfo();
  const slug = collectionSlug || globalSlug || "";
  const current = CONTENT_LOCALES[locale];
  const [availability, setAvailability] = useState<Availability>(id || globalSlug ? "checking" : "new");
  const [progress, setProgress] = useState({ filled: 0, total: 0 });

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
      .then((json) => {
        const nextProgress = contentProgress((json?.doc || json) as Record<string, unknown>, slug);
        setProgress(nextProgress);
        setAvailability(nextProgress.filled > 0 ? "available" : "missing");
      })
      .catch(() => {
        if (!controller.signal.aborted) setAvailability("error");
      });
    return () => controller.abort();
  }, [collectionSlug, globalSlug, id, locale, slug]);

  const statusText = useMemo(() => {
    if (availability === "checking") return copy ? "Checking translation…" : "Memeriksa terjemahan…";
    if (availability === "available") return copy
      ? `${progress.filled}/${progress.total} translated fields`
      : `${progress.filled}/${progress.total} field terisi`;
    if (availability === "missing") return copy ? `${current.shortLabel} is empty — fallback is not counted` : `${current.shortLabel} masih kosong — fallback tidak dihitung`;
    if (availability === "new") return copy ? `New ${current.shortLabel} content` : `Konten ${current.shortLabel} baru`;
    return copy ? "Translation status unavailable" : "Status terjemahan tidak tersedia";
  }, [availability, copy, current.shortLabel, progress.filled, progress.total]);

  return (
    <section className={`mwc-document-locale mwc-document-locale--${locale}`} aria-label={copy ? "Document content language" : "Bahasa konten dokumen"}>
      <span className="mwc-document-locale__badge">{current.shortLabel}</span>
      <strong>{copy ? `Editing ${current.label} content` : `Mengedit konten ${current.label}`}</strong>
      <span className={`mwc-document-locale__status mwc-document-locale__status--${availability}`}>{statusText}</span>
      {modified && <span className="mwc-document-locale__dirty">{copy ? "Unsaved changes" : "Perubahan belum tersimpan"}</span>}
    </section>
  );
};
