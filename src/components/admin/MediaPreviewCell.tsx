"use client";

import React from "react";

/**
 * Renders a small thumbnail preview of a media file in the admin list view.
 */
export const MediaPreviewCell: React.FC<any> = ({ rowData }) => {
  const url = rowData?.url as string | undefined;
  const thumbnailURL = rowData?.sizes?.thumbnail?.url as string | undefined;
  const mimeType = rowData?.mimeType as string | undefined;
  const filename = rowData?.filename as string | undefined;

  const isImage = mimeType?.startsWith("image/");
  const previewUrl = thumbnailURL || url;

  return (
    <div className="mwc-cell-media" style={{ display: "flex", gap: 10, alignItems: "center" }}>
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 6,
          background: isImage && previewUrl ? `url(${previewUrl}) center / cover no-repeat` : "#f1f5f9",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px solid rgba(0,0,0,0.06)",
          overflow: "hidden",
        }}
      >
        {(!isImage || !previewUrl) && (
          <span aria-hidden className="material-symbols-outlined" style={{ fontSize: 20, color: "#64748b" }}>
            {mimeType === "application/pdf" ? "picture_as_pdf" : "insert_drive_file"}
          </span>
        )}
      </div>
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: "#334155",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: 200,
          }}
        >
          {filename || "(unnamed)"}
        </div>
        <div style={{ fontSize: 11, color: "#94a3b8", textTransform: "uppercase" }}>
          {mimeType?.split("/").pop() || "file"}
        </div>
      </div>
    </div>
  );
};
