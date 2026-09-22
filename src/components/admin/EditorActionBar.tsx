"use client";

import React, { useState } from "react";
import { toast, useForm, useFormFields, useAuth, useDocumentInfo, useFormModified } from "@payloadcms/ui";
import {
  Globe,
  Eye,
  FileEdit,
  Clock,
  Rocket,
  Send,
  CheckCircle2,
  MessageSquareWarning,
  CalendarClock,
  Archive,
  RotateCcw,
} from "lucide-react";
import { hasCapability } from "@/utils/access";
import { useAdminLanguage, useContentLocale } from "./adminLocale";
import { TranslationModal } from "./TranslationModal";

type AuthUser = { role?: unknown } | null | undefined;

const ACTION_ICONS: Record<string, React.ComponentType<{ size?: number; style?: React.CSSProperties }>> = {
  rocket_launch: Rocket,
  send: Send,
  check_circle: CheckCircle2,
  feedback: MessageSquareWarning,
  public: Globe,
  schedule: CalendarClock,
  inventory_2: Archive,
  unarchive: RotateCcw,
};

const STATUS_ACTIONS: Record<string, { label: string; icon: string; nextStatuses: string[] }[]> = {
  draft: [
    { label: "Publikasikan", icon: "rocket_launch", nextStatuses: ["published"] },
    { label: "Kirim Review", icon: "send", nextStatuses: ["in_review"] },
  ],
  in_review: [
    { label: "Setujui", icon: "check_circle", nextStatuses: ["approved"] },
    { label: "Minta Revisi", icon: "feedback", nextStatuses: ["revision_requested"] },
  ],
  revision_requested: [{ label: "Kirim Ulang", icon: "send", nextStatuses: ["in_review"] }],
  approved: [
    { label: "Publikasikan", icon: "public", nextStatuses: ["published"] },
    { label: "Jadwalkan", icon: "schedule", nextStatuses: ["scheduled"] },
  ],
  scheduled: [{ label: "Publikasikan Sekarang", icon: "public", nextStatuses: ["published"] }],
  published: [{ label: "Arsipkan", icon: "inventory_2", nextStatuses: ["archived"] }],
  archived: [{ label: "Aktifkan Ulang", icon: "unarchive", nextStatuses: ["draft"] }],
};

const EN_ACTION_LABELS: Record<string, string> = {
  Publikasikan: "Publish",
  "Kirim Review": "Send for Review",
  Setujui: "Approve",
  "Minta Revisi": "Request Revision",
  "Kirim Ulang": "Resubmit",
  Publish: "Publish",
  Jadwalkan: "Schedule",
  "Publikasikan Sekarang": "Publish Now",
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
  const [translationModalOpen, setTranslationModalOpen] = useState(false);
  const [isPostPublish, setIsPostPublish] = useState(false);

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
          draft: "Draf (Belum Tayang)",
          in_review: "Menunggu Review",
          revision_requested: "Perlu Revisi",
          approved: "Disetujui",
          scheduled: "Terjadwal",
          published: "Tayang di Website",
          archived: "Diarsipkan",
        })[currentStatus] || currentStatus;

  return (
    <>
      <div className="mwc-editor-action-bar">
        <div className="mwc-editor-action-bar__status">
          {currentStatus === "published" ? (
            <Globe size={16} style={{ color: "#166534" }} />
          ) : currentStatus === "draft" ? (
            <FileEdit size={16} style={{ color: "#64748b" }} />
          ) : (
            <Clock size={16} style={{ color: "#b45309" }} />
          )}
          <span>
            {isEn ? "Status" : "Status"}: <strong>{statusLabel}</strong>
          </span>
          {modified && <small>{isEn ? "Save required" : "Perlu disimpan"}</small>}
          {!modified && <small className="is-saved">{isEn ? "All changes saved" : "Semua perubahan tersimpan"}</small>}
        </div>
        <div className="mwc-editor-action-bar__actions">
          <a
            className="mwc-editor-action-bar__preview"
            aria-disabled={!docInfo?.id}
            href={
              docInfo?.id
                ? `/${locale}/${previewSection}/${String(docInfo.data?.slug || docInfo.id)}?preview=1`
                : undefined
            }
            rel="noreferrer"
            target="_blank"
            title={
              !docInfo?.id
                ? isEn
                  ? "Save draft first to preview"
                  : "Simpan draf terlebih dahulu untuk melihat pratinjau"
                : undefined
            }
          >
            <Eye size={15} />
            {currentStatus === "published"
              ? `${isEn ? "View on Web" : "Lihat di Web"} (${locale.toUpperCase()})`
              : `${isEn ? "Preview Draft" : "Pratinjau Draf"} (${locale.toUpperCase()})`}
          </a>

          {availableActions.map((action) => {
            const ActionIcon = ACTION_ICONS[action.icon] || Rocket;
            return (
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

                    // Trigger post-publish translation modal when published in Indonesian
                    if (nextStatus === "published" && locale === "id") {
                      setIsPostPublish(true);
                      setTranslationModalOpen(true);
                    }
                  } catch {
                    toast.error(isEn ? "Failed to save editorial status" : "Gagal menyimpan status editorial");
                  } finally {
                    setProcessingStatus(null);
                  }
                }}
                type="button"
              >
                <ActionIcon size={15} />
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
            );
          })}
        </div>
      </div>

      <TranslationModal
        isOpen={translationModalOpen}
        onClose={() => setTranslationModalOpen(false)}
        identifier={docInfo.collectionSlug || docInfo.globalSlug || ""}
        id={docInfo.id}
        isGlobal={Boolean(docInfo.globalSlug)}
        isPostPublish={isPostPublish}
        docTitle={String(docInfo.data?.title || "")}
        collectionSlug={docInfo.collectionSlug}
      />
    </>
  );
};
