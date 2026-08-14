"use client";

import React, { useState } from "react";
import { toast, useForm, useFormFields, useAuth, useDocumentInfo, useFormModified } from "@payloadcms/ui";
import { hasCapability } from "@/utils/access";
import { useAdminLanguage, useContentLocale } from "./adminLocale";

type AuthUser = { role?: unknown } | null | undefined;

const STATUS_ACTIONS: Record<string, { label: string; icon: string; nextStatuses: string[] }[]> = {
  draft: [{ label: "Kirim Review", icon: "send", nextStatuses: ["in_review"] }],
  in_review: [
    { label: "Setujui", icon: "check_circle", nextStatuses: ["approved"] },
    { label: "Minta Revisi", icon: "feedback", nextStatuses: ["revision_requested"] },
  ],
  revision_requested: [{ label: "Kirim Ulang", icon: "send", nextStatuses: ["in_review"] }],
  approved: [
    { label: "Publish", icon: "public", nextStatuses: ["published"] },
    { label: "Jadwalkan", icon: "schedule", nextStatuses: ["scheduled"] },
  ],
  scheduled: [{ label: "Publish Sekarang", icon: "public", nextStatuses: ["published"] }],
  published: [{ label: "Arsipkan", icon: "inventory_2", nextStatuses: ["archived"] }],
  archived: [{ label: "Aktifkan Ulang", icon: "unarchive", nextStatuses: ["draft"] }],
};

const EN_ACTION_LABELS: Record<string, string> = {
  "Kirim Review": "Send for Review",
  Setujui: "Approve",
  "Minta Revisi": "Request Revision",
  "Kirim Ulang": "Resubmit",
  Publish: "Publish",
  Jadwalkan: "Schedule",
  "Publish Sekarang": "Publish Now",
  Arsipkan: "Archive",
  "Aktifkan Ulang": "Reactivate",
};

/**
 * Sticky editorial action bar shown below the Payload editor toolbar. Displays
 * the current document status and available status transitions based on the
 * authenticated user's editorial role.
 */
export const EditorActionBar: React.FC = () => {
  const { user } = useAuth();
  const authUser = user as unknown as AuthUser;
  const docInfo = useDocumentInfo();
  const statusField = useFormFields(([fields]) => fields.status);
  const { submit } = useForm();
  const modified = useFormModified();
  const locale = useContentLocale();
  const isEn = useAdminLanguage() === "en";
  const [processingStatus, setProcessingStatus] = useState<string | null>(null);
  const previewSection =
    docInfo.collectionSlug === "journals"
      ? "jurnal"
      : docInfo.collectionSlug === "policy-reviews"
        ? "policy-reviews"
        : "artikel";

  const currentStatus = (statusField?.value as string) || "draft";
  const actions = STATUS_ACTIONS[currentStatus] || [];

  const canPublish = hasCapability(authUser, "publishContent");
  const canReview = hasCapability(authUser, "reviewContent");
  const canEdit = hasCapability(authUser, "manageContent");

  // Filter actions based on the user's capabilities
  const availableActions = actions.filter((action) => {
    const nextStatus = action.nextStatuses[0];
    if (["published", "scheduled"].includes(nextStatus)) return canPublish;
    if (["approved", "revision_requested"].includes(nextStatus)) return canReview || canPublish;
    if (["in_review", "draft"].includes(nextStatus)) return canEdit || canReview || canPublish;
    if (nextStatus === "archived") return canPublish;
    return false;
  });

  const statusLabel =
    (isEn
      ? {
          draft: "Draft",
          in_review: "In Review",
          revision_requested: "Revision Required",
          approved: "Approved",
          scheduled: "Scheduled",
          published: "Published",
          archived: "Archived",
        }
      : {
          draft: "Draft",
          in_review: "Menunggu Review",
          revision_requested: "Perlu Revisi",
          approved: "Disetujui",
          scheduled: "Terjadwal",
          published: "Published",
          archived: "Diarsipkan",
        })[currentStatus] || currentStatus;

  return (
    <div className="mwc-editor-action-bar">
      <div className="mwc-editor-action-bar__status">
        <span className="material-symbols-outlined" aria-hidden style={{ fontSize: 18 }}>
          {currentStatus === "published" ? "public" : currentStatus === "draft" ? "edit_note" : "pending"}
        </span>
        <span>
          {isEn ? "Status" : "Status"}: <strong>{statusLabel}</strong>
        </span>
        {modified && <small>{isEn ? "Save required" : "Perlu disimpan"}</small>}
        {!modified && <small className="is-saved">{isEn ? "All changes saved" : "Semua perubahan tersimpan"}</small>}
      </div>
      <div className="mwc-editor-action-bar__actions">
        <a
          className="mwc-editor-action-bar__preview"
          aria-disabled={!docInfo?.id || currentStatus !== "published"}
          href={
            docInfo?.id && currentStatus === "published"
              ? `/${locale}/${previewSection}/${String(docInfo.data?.slug || docInfo.id)}`
              : undefined
          }
          rel="noreferrer"
          target="_blank"
        >
          <span className="material-symbols-outlined" aria-hidden style={{ fontSize: 16 }}>
            visibility
          </span>
          {currentStatus === "published"
            ? `${isEn ? "Preview" : "Preview"} ${locale.toUpperCase()}`
            : isEn
              ? "Preview after publishing"
              : "Preview setelah terbit"}
        </a>
        {availableActions.map((action) => (
          <button
            className={`mwc-editor-action-bar__btn ${["revision_requested", "scheduled"].includes(action.nextStatuses[0]) ? "mwc-editor-action-bar__btn--secondary" : ""}`}
            key={action.label}
            disabled={Boolean(processingStatus)}
            onClick={async () => {
              const nextStatus = action.nextStatuses[0];
              setProcessingStatus(nextStatus);
              try {
                await submit({ overrides: { status: nextStatus } });
                toast.success(isEn ? "Editorial status saved" : "Status editorial berhasil disimpan");
              } catch {
                toast.error(isEn ? "Failed to save editorial status" : "Gagal menyimpan status editorial");
              } finally {
                setProcessingStatus(null);
              }
            }}
            type="button"
          >
            <span className="material-symbols-outlined" aria-hidden style={{ fontSize: 16 }}>
              {action.icon}
            </span>
            {processingStatus === action.nextStatuses[0]
              ? isEn
                ? "Saving…"
                : "Menyimpan…"
              : modified
                ? `${isEn ? "Save &" : "Simpan &"} ${isEn ? EN_ACTION_LABELS[action.label] || action.label : action.label}`
                : isEn
                  ? EN_ACTION_LABELS[action.label] || action.label
                  : action.label}
          </button>
        ))}
      </div>
    </div>
  );
};
