"use client";

/* eslint-disable react-hooks/set-state-in-effect */

import React, { useCallback, useEffect, useState } from "react";

import {
  Sparkles,
  Globe,
  CheckCircle2,
  ArrowRight,
  X,
  RefreshCw,
  ExternalLink,
  AlertCircle,
  FileCheck,
} from "lucide-react";
import { toast } from "@payloadcms/ui";
import { withLocale } from "./adminLocale";

export interface TranslationModalProps {
  isOpen: boolean;
  onClose: () => void;
  identifier: string;
  id?: string | number | null;
  isGlobal?: boolean;
  isPostPublish?: boolean;
  docTitle?: string;
  collectionSlug?: string;
}

type ModalState = "prompt" | "translating" | "success" | "error";

export const TranslationModal: React.FC<TranslationModalProps> = ({
  isOpen,
  onClose,
  identifier,
  id,
  isGlobal = false,
  isPostPublish = false,
  docTitle,
}) => {
  const [modalState, setModalState] = useState<ModalState>("prompt");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [statusText, setStatusText] = useState<string>("");
  const [rawStatus, setRawStatus] = useState<string>("checking");
  const [checking, setChecking] = useState(false);

  const fetchStatus = useCallback(async () => {
    if (!identifier || (!id && !isGlobal)) return;
    setChecking(true);
    try {
      const params = new URLSearchParams({
        identifier,
        id: id == null ? "" : String(id),
        isGlobal: isGlobal ? "1" : "0",
      });
      const res = await fetch(`/api/translation-status?${params.toString()}`, {
        cache: "no-store",
        credentials: "include",
      });
      if (res.ok) {
        const json = await res.json();
        const data = json?.data || json;
        const status = data?.status || data?.translationStatus || "not_generated";
        setRawStatus(status);
        if (status === "approved") {
          setStatusText("Versi Inggris sudah disetujui dan siap tayang.");
        } else if (status === "needs_review") {
          setStatusText("Draf terjemahan Inggris sudah siap untuk ditinjau.");
        } else if (status === "needs_update") {
          setStatusText("Konten Indonesia baru saja diubah. Terjemahan Inggris perlu diperbarui.");
        } else if (status === "translating" || status === "queued") {
          setStatusText("AI sedang memproses terjemahan...");
        } else {
          setStatusText("Versi Bahasa Inggris belum dibuat.");
        }
      }
    } catch {
      // ignore
    } finally {
      setChecking(false);
    }
  }, [id, identifier, isGlobal]);

  useEffect(() => {
    if (isOpen) {
      void fetchStatus();
    }
  }, [fetchStatus, isOpen]);

  const handleClose = useCallback(() => {
    setModalState("prompt");
    setErrorMessage("");
    onClose();
  }, [onClose]);

  if (!isOpen) return null;

  const handleTranslate = async (actionType: "generate" | "update" | "retry" = "generate") => {
    setModalState("translating");
    setErrorMessage("");

    try {
      const res = await fetch("/api/translation-actions", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: actionType,
          identifier,
          id: id ?? null,
          isGlobal,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error || data?.message || "Gagal memproses terjemahan.");
      }

      toast.success("Versi Bahasa Inggris berhasil dibuat oleh AI!");
      setModalState("success");
      await fetchStatus();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan pada AI terjemahan.";
      setErrorMessage(msg);
      setModalState("error");
      toast.error(msg);
    }
  };

  const handleOpenEnglish = () => {
    handleClose();
    if (typeof window !== "undefined") {
      const targetUrl = withLocale(window.location.pathname, "en");
      window.location.href = targetUrl;
    }
  };

  const statusBadge = () => {
    if (checking) {
      return (
        <span className="mwc-trans-badge mwc-trans-badge--neutral">
          <RefreshCw className="animate-spin" size={12} /> Memeriksa status...
        </span>
      );
    }
    if (rawStatus === "approved") {
      return (
        <span className="mwc-trans-badge mwc-trans-badge--success">
          <CheckCircle2 size={13} /> Selesai & Disetujui
        </span>
      );
    }
    if (rawStatus === "needs_review") {
      return (
        <span className="mwc-trans-badge mwc-trans-badge--warning">
          <FileCheck size={13} /> Siap Ditinjau
        </span>
      );
    }
    if (rawStatus === "needs_update") {
      return (
        <span className="mwc-trans-badge mwc-trans-badge--warning">
          <AlertCircle size={13} /> Perlu Diperbarui
        </span>
      );
    }
    return (
      <span className="mwc-trans-badge mwc-trans-badge--neutral">
        <Globe size={13} /> Belum Ada Versi Inggris
      </span>
    );
  };

  return (
    <div className="mwc-trans-modal-backdrop" onClick={handleClose} role="dialog" aria-modal="true">
      <div className="mwc-trans-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="mwc-trans-modal__header">
          <div className="mwc-trans-modal__title-box">
            <div className="mwc-trans-modal__icon">
              <Globe size={22} color="#1d4ed8" />
            </div>
            <div>
              <h3 className="mwc-trans-modal__title">
                {isPostPublish ? "🎉 Konten Berhasil Diterbitkan!" : "Terjemahan Bahasa Inggris (AI)"}
              </h3>
              <p className="mwc-trans-modal__subtitle">
                {isPostPublish
                  ? "Konten Bahasa Indonesia telah tersimpan. Ingin buat versi Bahasa Inggris?"
                  : docTitle
                    ? `Kelola terjemahan untuk: "${docTitle}"`
                    : "Terjemahkan naskah ke Bahasa Inggris secara otomatis."}
              </p>
            </div>
          </div>
          <button className="mwc-trans-modal__close" onClick={handleClose} aria-label="Tutup modal">
            <X size={18} />
          </button>
        </div>

        {/* Body Content */}
        <div className="mwc-trans-modal__body">
          {/* Status info box */}
          <div className="mwc-trans-modal__card">
            <div className="mwc-trans-modal__card-header">
              <span className="mwc-trans-modal__card-label">Status Terjemahan:</span>
              {statusBadge()}
            </div>
            <p className="mwc-trans-modal__card-desc">{statusText}</p>
          </div>

          {modalState === "translating" && (
            <div className="mwc-trans-modal__loading">
              <div className="mwc-trans-modal__spinner">
                <RefreshCw className="animate-spin" size={32} color="#1d4ed8" />
              </div>
              <p className="mwc-trans-modal__loading-title">AI Sedang Menerjemahkan Konten...</p>
              <p className="mwc-trans-modal__loading-desc">
                Sistem sedang memproses judul, paragraf naskah, dan istilah teknis ke Bahasa Inggris. Proses ini memakan
                waktu sekitar 2–5 detik.
              </p>
            </div>
          )}

          {modalState === "success" && (
            <div className="mwc-trans-modal__success-box">
              <div className="mwc-trans-modal__success-icon">
                <CheckCircle2 size={36} color="#16a34a" />
              </div>
              <h4 className="mwc-trans-modal__success-title">Terjemahan Inggris Berhasil Dibuat!</h4>
              <p className="mwc-trans-modal__success-desc">
                Naskah telah selesai diterjemahkan dengan rapi. Anda dapat langsung membuka versi Bahasa Inggris untuk
                memeriksa dan menyempurnakannya.
              </p>
            </div>
          )}

          {modalState === "error" && (
            <div className="mwc-trans-modal__error-box">
              <AlertCircle size={24} color="#dc2626" />
              <div>
                <strong>Gagal Menerjemahkan</strong>
                <p>{errorMessage}</p>
              </div>
            </div>
          )}

          {modalState === "prompt" && (
            <div className="mwc-trans-modal__features">
              <div className="mwc-trans-modal__feature-item">
                <Sparkles size={18} color="#2563eb" />
                <div>
                  <strong>Otomatis & Presisi</strong>
                  <p>Ditenagai AI Gemini untuk menerjemahkan tata bahasa dan konteks naskah secara alami.</p>
                </div>
              </div>
              <div className="mwc-trans-modal__feature-item">
                <FileCheck size={18} color="#059669" />
                <div>
                  <strong>Bisa Ditinjau & Diedit Kapan Saja</strong>
                  <p>Hasil terjemahan tetap dapat Anda sesuaikan atau edit secara manual sebelum dipublikasikan.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mwc-trans-modal__footer">
          {modalState === "translating" ? (
            <div className="mwc-trans-modal__footer-translating">
              <span>Mohon tunggu sebentar...</span>
            </div>
          ) : modalState === "success" ? (
            <div className="mwc-trans-modal__footer-buttons">
              <button className="mwc-btn mwc-btn--secondary" onClick={handleClose} type="button">
                Tutup & Tetap di Sini
              </button>
              <button className="mwc-btn mwc-btn--primary" onClick={handleOpenEnglish} type="button">
                <span>Buka Versi Inggris (EN)</span>
                <ArrowRight size={16} />
              </button>
            </div>
          ) : modalState === "error" ? (
            <div className="mwc-trans-modal__footer-buttons">
              <button className="mwc-btn mwc-btn--secondary" onClick={handleClose} type="button">
                Tutup
              </button>
              <button className="mwc-btn mwc-btn--primary" onClick={() => handleTranslate("retry")} type="button">
                <RefreshCw size={15} />
                <span>Coba Lagi</span>
              </button>
            </div>
          ) : (
            <div className="mwc-trans-modal__footer-buttons">
              <button className="mwc-btn mwc-btn--secondary" onClick={handleClose} type="button">
                {isPostPublish ? "Nanti Saja" : "Tutup"}
              </button>
              {rawStatus === "needs_review" || rawStatus === "approved" ? (
                <>
                  <button
                    className="mwc-btn mwc-btn--secondary"
                    onClick={() => handleTranslate("update")}
                    type="button"
                    title="Generate ulang terjemahan dengan naskah terbaru"
                  >
                    <RefreshCw size={14} />
                    <span>Perbarui Terjemahan</span>
                  </button>
                  <button className="mwc-btn mwc-btn--primary" onClick={handleOpenEnglish} type="button">
                    <span>Buka Editor Inggris (EN)</span>
                    <ExternalLink size={15} />
                  </button>
                </>
              ) : (
                <button className="mwc-btn mwc-btn--primary" onClick={() => handleTranslate("generate")} type="button">
                  <Sparkles size={16} />
                  <span>{isPostPublish ? "Terjemahkan ke Inggris Sekarang" : "Buat Terjemahan Inggris (AI)"}</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
