"use client";

import React, { useState } from "react";
import Link from "next/link";
import { HelpCenterModal } from "./HelpCenterModal";
import { useAdminLanguage, useContentLocale } from "./adminLocale";
import { ExternalLink, HelpCircle } from "lucide-react";

export const CustomNavLinks: React.FC = () => {
  const locale = useContentLocale();
  const isEn = useAdminLanguage() === "en";
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  return (
    <div
      className="custom-nav-links"
      style={{
        padding: "12px 8px 8px",
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        marginTop: "12px",
        borderTop: "1px solid var(--theme-elevation-100, #e2e8f0)",
      }}
    >
      <Link
        href={`/${locale}`}
        target="_blank"
        rel="noreferrer"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "8px 12px",
          borderRadius: "6px",
          textDecoration: "none",
          fontSize: "13px",
          fontWeight: 500,
          color: "var(--theme-elevation-700, #475569)",
          transition: "background 0.12s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--theme-elevation-50, #f1f5f9)")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
      >
        <ExternalLink size={16} style={{ color: "#3b82f6" }} />
        <span>{isEn ? "View Website" : "Lihat Website"}</span>
      </Link>

      <button
        onClick={() => setIsHelpModalOpen(true)}
        type="button"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "8px 12px",
          borderRadius: "6px",
          border: "none",
          background: "transparent",
          fontSize: "13px",
          fontWeight: 500,
          color: "var(--theme-elevation-700, #475569)",
          cursor: "pointer",
          width: "100%",
          textAlign: "left",
          transition: "background 0.12s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--theme-elevation-50, #f1f5f9)")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
      >
        <HelpCircle size={16} style={{ color: "#059669" }} />
        <span>{isEn ? "Help & FAQ" : "Panduan & FAQ"}</span>
      </button>

      <HelpCenterModal isOpen={isHelpModalOpen} onClose={() => setIsHelpModalOpen(false)} />
    </div>
  );
};
