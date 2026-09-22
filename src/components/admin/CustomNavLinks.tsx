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
      style={{
        padding: "12px 14px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        marginTop: "16px",
        borderTop: "1px solid var(--theme-elevation-150, #e2e8f0)",
      }}
    >
      <Link
        href={`/${locale}`}
        target="_blank"
        title={isEn ? "View live website" : "Buka website publik di tab baru"}
        rel="noreferrer"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "8px 12px",
          borderRadius: "8px",
          textDecoration: "none",
          fontSize: "13px",
          fontWeight: 600,
          color: "var(--theme-elevation-700, #334155)",
          backgroundColor: "var(--theme-elevation-50, #f8fafc)",
          border: "1px solid var(--theme-elevation-150, #e2e8f0)",
          transition: "all 0.15s ease",
        }}
      >
        <span aria-hidden="true" className="material-symbols-outlined" style={{ fontSize: "16px", color: "#2563eb" }}>
          open_in_new
        </span>
        <span>{isEn ? "View Live Website" : "Lihat Website"}</span>
      </Link>

      <button
        onClick={() => setIsHelpModalOpen(true)}
        title={isEn ? "Open Beginner Help Guide" : "Buka Panduan & Bantuan Pemula"}
        type="button"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "8px 12px",
          borderRadius: "8px",
          background: "#eff6ff",
          border: "1px solid #bfdbfe",
          color: "#1d4ed8",
          cursor: "pointer",
          fontSize: "13px",
          fontWeight: 650,
          textAlign: "left",
          transition: "all 0.15s ease",
        }}
      >
        <span aria-hidden="true" className="material-symbols-outlined" style={{ fontSize: "16px", color: "#1d4ed8" }}>
          help
        </span>
        <span>{isEn ? "Help & FAQ Guide" : "Panduan & Bantuan"}</span>
      </button>

      <HelpCenterModal isOpen={isHelpModalOpen} onClose={() => setIsHelpModalOpen(false)} />
    </div>
  );
};
