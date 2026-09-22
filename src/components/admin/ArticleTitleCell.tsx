"use client";

import Link from "next/link";
import React from "react";
import { useContentLocale, withLocale } from "./adminLocale";
import { Image as ImageIcon } from "lucide-react";

/**
 * Custom cell rendering an article thumbnail + title + category in the admin
 * list view, giving editors a visual overview at a glance.
 * Clicking anywhere on this cell directly navigates to the edit article page.
 */
export const ArticleTitleCell: React.FC<any> = ({ cellData, rowData }) => {
  const locale = useContentLocale();
  const title = cellData as string;
  const id = rowData?.id;
  const featuredImage = rowData?.featuredImage as
    { url?: string; sizes?: { card?: { url?: string } }; alt?: string } | undefined;
  const imageUrl = rowData?.imageUrl as string | undefined;

  const thumbUrl = featuredImage?.sizes?.card?.url || featuredImage?.url || imageUrl || null;

  const category = rowData?.category as { name?: string } | string | number | null | undefined;
  const categoryName = category && typeof category === "object" ? category.name : null;

  const editHref = id ? withLocale(`/admin/collections/articles/${id}`, locale) : "#";

  return (
    <Link
      href={editHref}
      className="mwc-cell-article"
      style={{
        display: "flex",
        gap: 12,
        alignItems: "center",
        textDecoration: "none",
        color: "inherit",
        cursor: "pointer",
        padding: "4px 0",
      }}
    >
      <div
        className="mwc-cell-article__thumb"
        style={{
          width: 48,
          height: 48,
          borderRadius: 8,
          background: thumbUrl ? `url(${thumbUrl}) center / cover no-repeat` : "#e8eef7",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#94a3b8",
          fontSize: 18,
          overflow: "hidden",
          transition: "transform 0.15s ease",
        }}
      >
        {!thumbUrl && <ImageIcon size={22} color="#94a3b8" />}
      </div>
      <div style={{ minWidth: 0 }}>
        <div
          className="mwc-cell-article__title"
          style={{
            fontWeight: 600,
            color: "#1a2b4c",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: 340,
            fontSize: 14,
            transition: "color 0.15s ease",
          }}
        >
          {title || "(Tanpa judul)"}
        </div>
        {categoryName && <span className="mwc-cell-article__category">{categoryName}</span>}
      </div>
    </Link>
  );
};
