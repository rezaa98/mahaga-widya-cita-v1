"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface ImportJournalModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEn?: boolean;
}

export const ImportJournalModal: React.FC<ImportJournalModalProps> = ({ isOpen, onClose, isEn = false }) => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const router = useRouter();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const res = await fetch("/api/admin/import-journal-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "Gagal mengimpor jurnal dari URL.");
      }

      setSuccessMsg(isEn ? "Journal successfully imported!" : "Jurnal berhasil diimpor otomatis!");
      setUrl("");

      setTimeout(() => {
        onClose();
        if (data.doc?.id) {
          router.push(`/admin/collections/journals/${data.doc.id}`);
        } else {
          router.refresh();
        }
      }, 1200);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat mengimpor jurnal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(15, 23, 42, 0.6)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#ffffff",
          borderRadius: "16px",
          maxWidth: "540px",
          width: "100%",
          padding: "28px",
          boxShadow: "0 20px 50px -12px rgba(0, 0, 0, 0.25)",
          border: "1px solid #e2e8f0",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h3 style={{ margin: 0, fontSize: "1.25rem", color: "#0f172a", fontWeight: 700 }}>
            {isEn ? "Import Journal via OJS Link" : "Impor Jurnal Otomatis via Link OJS"}
          </h3>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "1.2rem",
              color: "#64748b",
            }}
          >
            ✕
          </button>
        </div>

        <p style={{ color: "#64748b", fontSize: "0.92rem", margin: "0 0 20px 0", lineHeight: 1.5 }}>
          {isEn
            ? "Paste the article URL from an Open Journal System (OJS) page. The system will automatically scrape and extract title, authors, abstract, DOI, and publication details."
            : "Tempelkan tautan (URL) halaman artikel jurnal dari OJS. Sistem akan secara otomatis membaca dan mengekstrak judul, penulis, abstrak, DOI, serta detail publikasinya."}
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "18px" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.88rem",
                fontWeight: 650,
                color: "#334155",
                marginBottom: "8px",
              }}
            >
              {isEn ? "OJS Journal Article URL" : "URL Artikel Jurnal OJS"}
            </label>
            <input
              type="url"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Contoh: http://178.128.120.64/index.php/wiga/article/view/1465"
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: "10px",
                border: "1px solid #cbd5e1",
                fontSize: "0.92rem",
                outline: "none",
              }}
            />
          </div>

          {error && (
            <div
              style={{
                background: "#fef2f2",
                border: "1px solid #fecaca",
                color: "#991b1b",
                padding: "12px 14px",
                borderRadius: "10px",
                fontSize: "0.88rem",
                marginBottom: "18px",
              }}
            >
              ⚠️ {error}
            </div>
          )}

          {successMsg && (
            <div
              style={{
                background: "#f0fdf4",
                border: "1px solid #bbf7d0",
                color: "#166534",
                padding: "12px 14px",
                borderRadius: "10px",
                fontSize: "0.88rem",
                marginBottom: "18px",
              }}
            >
              ✅ {successMsg}
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              style={{
                padding: "10px 18px",
                borderRadius: "8px",
                border: "1px solid #cbd5e1",
                background: "#f8fafc",
                color: "#475569",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {isEn ? "Cancel" : "Batal"}
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "10px 20px",
                borderRadius: "8px",
                border: "none",
                background: loading ? "#93c5fd" : "#2563eb",
                color: "#ffffff",
                fontWeight: 650,
                cursor: loading ? "wait" : "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              {loading ? (isEn ? "Importing..." : "Memproses Impor...") : isEn ? "Import Journal" : "Impor Jurnal"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
