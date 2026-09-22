"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAdminLanguage } from "./adminLocale";
import { LayoutDashboard } from "lucide-react";

export const DashboardNavLink: React.FC = () => {
  const pathname = usePathname();
  const isEn = useAdminLanguage() === "en";
  const isActive = pathname === "/admin";

  return (
    <div
      style={{
        padding: "0 8px 8px",
        marginBottom: "8px",
        borderBottom: "1px solid var(--theme-elevation-100, #e2e8f0)",
      }}
    >
      <Link
        href="/admin"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "8px 12px",
          textDecoration: "none",
          color: isActive ? "#2563eb" : "var(--theme-elevation-800, #334155)",
          backgroundColor: isActive ? "var(--theme-elevation-100, #eff6ff)" : "transparent",
          borderRadius: "6px",
          fontWeight: isActive ? 650 : 500,
          fontSize: "13.5px",
          transition: "all 0.12s ease",
        }}
        onMouseEnter={(e) => {
          if (!isActive) e.currentTarget.style.backgroundColor = "var(--theme-elevation-50, #f1f5f9)";
        }}
        onMouseLeave={(e) => {
          if (!isActive) e.currentTarget.style.backgroundColor = "transparent";
        }}
      >
        <LayoutDashboard size={17} style={{ color: isActive ? "#2563eb" : "#64748b" }} />
        <span>{isEn ? "Dashboard" : "Beranda Admin"}</span>
      </Link>
    </div>
  );
};
