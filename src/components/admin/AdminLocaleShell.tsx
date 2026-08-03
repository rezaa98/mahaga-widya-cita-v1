"use client";

import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CONTENT_LOCALES, localeHref, useAdminLanguage, useContentLocale } from "./adminLocale";

const isDocumentRoute = (pathname: string) =>
  /^\/admin\/(collections\/[^/]+\/(create|[^/]+)|globals\/[^/]+)/.test(pathname);

export const AdminLocaleShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const locale = useContentLocale();
  const adminLanguage = useAdminLanguage();
  const copy = adminLanguage === "en";
  const current = CONTENT_LOCALES[locale];
  const other = locale === "id" ? CONTENT_LOCALES.en : CONTENT_LOCALES.id;
  const hide = pathname.includes("/login") || pathname.includes("/logout");
  const editing = isDocumentRoute(pathname);

  return (
    <>
      {!hide && (
        <aside className={`mwc-locale-shell mwc-locale-shell--${locale}`} aria-label={copy ? "Content language" : "Bahasa konten"}>
          <span className="mwc-locale-shell__context">
            <span className="material-symbols-outlined" aria-hidden>translate</span>
            <span>
              <small>{copy ? "Content being viewed" : "Konten yang sedang dilihat"}</small>
              <strong>{current.label} ({current.shortLabel})</strong>
            </span>
          </span>
          <span className="mwc-locale-shell__meta">
            {copy ? "Admin interface" : "Antarmuka admin"}: {adminLanguage === "en" ? "English" : "Indonesia"}
          </span>
          {!editing ? (
            <button
              type="button"
              onClick={() => router.replace(localeHref(pathname, searchParams.toString(), other.code), { scroll: false })}
            >
              {copy ? `Switch content to ${other.shortLabel}` : `Ganti konten ke ${other.shortLabel}`}
            </button>
          ) : (
            <span className="mwc-locale-shell__hint">
              {copy ? "Use the language control in the editor to switch safely." : "Gunakan kontrol bahasa di editor untuk berpindah dengan aman."}
            </span>
          )}
        </aside>
      )}
      {children}
    </>
  );
};
