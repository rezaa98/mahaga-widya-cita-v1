"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const DashboardNavLink: React.FC = () => {
  const pathname = usePathname();
  const isActive = pathname === "/admin";

  return (
    <div style={{ padding: "0 0 16px 0", borderBottom: "1px solid var(--theme-elevation-150)", marginBottom: "16px" }}>
      <Link
        href="/admin"
        style={{
          display: "flex",
          alignItems: "center",
          padding: "10px 16px",
          textDecoration: "none",
          color: isActive ? "var(--theme-elevation-1000, #000)" : "var(--theme-elevation-800, #444)",
          backgroundColor: isActive ? "var(--theme-elevation-50, #f3f4f6)" : "transparent",
          borderRadius: "4px",
          fontWeight: isActive ? 600 : 500,
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => {
          if (!isActive) e.currentTarget.style.backgroundColor = "var(--theme-elevation-50, #f3f4f6)";
        }}
        onMouseLeave={(e) => {
          if (!isActive) e.currentTarget.style.backgroundColor = "transparent";
        }}
      >
        <span
          style={{
            fontFamily: "Material Symbols Outlined",
            marginRight: "12px",
            fontSize: "18px",
            fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
            color: isActive ? "#004ac6" : "inherit",
          }}
        >
          dashboard
        </span>
        Dashboard
      </Link>
    </div>
  );
};
