"use client";

import React, { useEffect } from "react";
import { useTranslation } from "@payloadcms/ui";
import { useContentLocale } from "./adminLocale";

export const AdminLocaleShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const locale = useContentLocale();
  const { i18n, switchLanguage } = useTranslation();

  // A small bilingual corporate team expects one workspace language. Keep
  // Payload's interface copy aligned with the content locale selected by its
  // native Localizer instead of presenting a second competing language state.
  useEffect(() => {
    if (switchLanguage && i18n.language !== locale) void switchLanguage(locale);
  }, [i18n.language, locale, switchLanguage]);

  return <>{children}</>;
};
