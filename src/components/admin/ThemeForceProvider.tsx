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

    // Ensure Material Symbols font link is present in head
    if (!document.getElementById("mwc-material-symbols-font")) {
      const link = document.createElement("link");
      link.id = "mwc-material-symbols-font";
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block";
      document.head.appendChild(link);
    }

    // Observe and force back to light if Payload tries to change it
    const observer = new MutationObserver(setLight);
    observer.observe(html, { attributes: true, attributeFilter: ["data-theme"] });

    return () => observer.disconnect();
  }, []);

  return <>{children}</>;
};
