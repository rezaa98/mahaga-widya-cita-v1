"use client";

import React from "react";

/**
 * Custom cell rendering a journal cover + title + year in the admin list view.
 */
export const JournalTitleCell: React.FC<any> = ({ cellData, rowData }) => {
  const title = cellData as string;
  const coverImage = rowData?.coverImage as
    { url?: string; sizes?: { card?: { url?: string } }; alt?: string } | undefined;
  const thumbUrl = coverImage?.sizes?.card?.url || coverImage?.url || null;

  const pubYear = rowData?.publicationYear as number | undefined;
  const volume = rowData?.volume as string | undefined;
  const issue = rowData?.issue as string | undefined;

  const metaParts = [pubYear && String(pubYear), volume && `Vol. ${volume}`, issue && `No. ${issue}`].filter(Boolean);

  return (
    <div className="mwc-cell-journal" style={{ display: "flex", gap: 12, alignItems: "center" }}>
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
          style={{
            fontWeight: 600,
            color: "#1a2b4c",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: 280,
            fontSize: 14,
          }}
        >
          {title || "(Tanpa judul)"}
        </div>
        {metaParts.length > 0 && <span style={{ fontSize: 12, color: "#64748b" }}>{metaParts.join(" · ")}</span>}
      </div>
    </div>
  );
};
