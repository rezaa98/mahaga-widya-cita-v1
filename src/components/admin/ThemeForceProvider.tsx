"use client";
import React, { useEffect } from "react";

export const ThemeForceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    const html = document.documentElement;

    const setLight = () => {
      if (html.getAttribute("data-theme") !== "light") {
        html.setAttribute("data-theme", "light");
      }
    };

    // Set immediately
    setLight();

    // Observe and force back to light if Payload tries to change it
    const observer = new MutationObserver(setLight);
    observer.observe(html, { attributes: true, attributeFilter: ["data-theme"] });

    return () => observer.disconnect();
  }, []);

  return <>{children}</>;
};
