"use client";

import Link from "next/link";
import React from "react";
import { useContentLocale, withLocale } from "./adminLocale";

/**
 * Custom cell rendering a journal cover + title + year in the admin list view.
 * Clicking anywhere on this cell directly navigates to the edit journal page.
 */
export const JournalTitleCell: React.FC<any> = ({ cellData, rowData }) => {
  const locale = useContentLocale();
  const title = cellData as string;
  const id = rowData?.id;
  const coverImage = rowData?.coverImage as
    { url?: string; sizes?: { card?: { url?: string } }; alt?: string } | undefined;
  const thumbUrl = coverImage?.sizes?.card?.url || coverImage?.url || null;

  const pubYear = rowData?.publicationYear as number | undefined;
  const volume = rowData?.volume as string | undefined;
  const issue = rowData?.issue as string | undefined;

  const metaParts = [pubYear && String(pubYear), volume && `Vol. ${volume}`, issue && `No. ${issue}`].filter(Boolean);
  const editHref = id ? withLocale(`/admin/collections/journals/${id}`, locale) : "#";

  return (
    <Link
      href={editHref}
      className="mwc-cell-journal"
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
        className="mwc-cell-journal__thumb"
        style={{
          width: 40,
          height: 54,
          borderRadius: 6,
          background: thumbUrl ? `url(${thumbUrl}) center / cover no-repeat` : "#e8eef7",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px solid rgba(0,0,0,0.06)",
          overflow: "hidden",
          transition: "all 0.15s ease",
        }}
      >
        {!thumbUrl && (
          <span aria-hidden className="material-symbols-outlined" style={{ fontSize: 18, color: "#94a3b8" }}>
            menu_book
          </span>
        )}
      </div>
      <div style={{ minWidth: 0 }}>
        <div
          className="mwc-cell-journal__title"
          style={{
            fontWeight: 600,
            color: "#1a2b4c",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: 280,
            fontSize: 14,
            transition: "color 0.15s ease",
          }}
        >
          {title || "(Tanpa judul)"}
        </div>
        {metaParts.length > 0 && <span style={{ fontSize: 12, color: "#64748b" }}>{metaParts.join(" · ")}</span>}
      </div>
    </Link>
  );
};
