"use client";

import React, { useState } from "react";
import Link from "next/link";
import { HelpCenterModal } from "./HelpCenterModal";
import { useAdminLanguage, useContentLocale } from "./adminLocale";

export const CustomNavLinks: React.FC = () => {
  const locale = useContentLocale();
  const isEn = useAdminLanguage() === "en";
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  return (
    <div
      className="custom-nav-links"
      style={{ padding: "0 1rem", display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "1rem" }}
    >
      <Link
        href={`/${locale}`}
        target="_blank"
        title={isEn ? "View website" : "Lihat website"}
        rel="noreferrer"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          textDecoration: "none",
          color: "var(--theme-elevation-500)",
        }}
      >
        <span aria-hidden="true" className="material-symbols-outlined" style={{ fontSize: "1.2rem" }}>
          open_in_new
        </span>
        <span>{isEn ? "View website" : "Lihat website"}</span>
      </Link>

      <button
        onClick={() => setIsHelpModalOpen(true)}
        title={isEn ? "Open help" : "Buka bantuan"}
        type="button"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          background: "none",
          border: "none",
          color: "var(--theme-elevation-500)",
          cursor: "pointer",
          padding: 0,
          font: "inherit",
        }}
      >
        <span aria-hidden="true" className="material-symbols-outlined" style={{ fontSize: "1.2rem" }}>
          help
        </span>
        <span>{isEn ? "Help" : "Bantuan"}</span>
      </button>

      <HelpCenterModal isOpen={isHelpModalOpen} onClose={() => setIsHelpModalOpen(false)} />
    </div>
  );
};
