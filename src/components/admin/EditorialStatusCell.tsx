"use client";

import React from "react";
import { useAdminLanguage } from "./adminLocale";
import {
  FileEdit,
  Clock,
  MessageSquareWarning,
  CheckCircle2,
  CalendarClock,
  Globe,
  Archive,
  HelpCircle,
} from "lucide-react";

const STATUS_CONFIG: Record<
  string,
  {
    label: string;
    bg: string;
    color: string;
    icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
    tip: string;
  }
> = {
  draft: {
    label: "Draft",
    bg: "#f1f5f9",
    color: "#475569",
    icon: FileEdit,
    tip: "Konten sedang ditulis dan belum dikirim untuk review.",
  },
  in_review: {
    label: "Menunggu Review",
    bg: "#fef3c7",
    color: "#92400e",
    icon: Clock,
    tip: "Konten sedang ditinjau oleh reviewer.",
  },
  revision_requested: {
    label: "Perlu Revisi",
    bg: "#fee2e2",
    color: "#991b1b",
    icon: MessageSquareWarning,
    tip: "Reviewer meminta perubahan sebelum disetujui.",
  },
  approved: {
    label: "Disetujui",
    bg: "#d1fae5",
    color: "#065f46",
    icon: CheckCircle2,
    tip: "Konten disetujui dan siap untuk dipublikasikan oleh admin.",
  },
  scheduled: {
    label: "Terjadwal",
    bg: "#dbeafe",
    color: "#1e40af",
    icon: CalendarClock,
    tip: "Konten dijadwalkan untuk dipublikasikan secara otomatis.",
  },
  published: {
    label: "Dipublikasikan",
    bg: "#dcfce7",
    color: "#166534",
    icon: Globe,
    tip: "Konten sudah dipublikasikan dan dapat diakses publik.",
  },
  archived: {
    label: "Diarsipkan",
    bg: "#f3f4f6",
    color: "#6b7280",
    icon: Archive,
    tip: "Konten diarsipkan dan tidak ditampilkan di website.",
  },
};

const DEFAULT_STATUS = {
  label: "Unknown",
  bg: "#f3f4f6",
  color: "#6b7280",
  icon: HelpCircle,
  tip: "",
};

export const EditorialStatusCell: React.FC<any> = ({ cellData }) => {
  const isEn = useAdminLanguage() === "en";
  const status = typeof cellData === "string" ? cellData : "";
  const config = STATUS_CONFIG[status] || DEFAULT_STATUS;
  const englishCopy: Record<string, { label: string; tip: string }> = {
    draft: { label: "Draft", tip: "Content is being written and has not been submitted for review." },
    in_review: { label: "In Review", tip: "Content is currently being reviewed." },
    revision_requested: { label: "Revision Required", tip: "A reviewer requested changes before approval." },
    approved: { label: "Approved", tip: "Content is approved and ready for an administrator to publish." },
    scheduled: { label: "Scheduled", tip: "Content is scheduled for automatic publication." },
    published: { label: "Published", tip: "Content is published and publicly accessible." },
    archived: { label: "Archived", tip: "Content is archived and hidden from the website." },
  };
  const localizedConfig = isEn && englishCopy[status] ? { ...config, ...englishCopy[status] } : config;
  const StatusIcon = localizedConfig.icon;

  return (
    <span
      className="mwc-status-badge"
      title={localizedConfig.tip}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "4px 10px",
        borderRadius: 100,
        fontSize: 12,
        fontWeight: 600,
        lineHeight: 1,
        background: localizedConfig.bg,
        color: localizedConfig.color,
        whiteSpace: "nowrap",
        cursor: localizedConfig.tip ? "help" : "default",
      }}
    >
      <StatusIcon size={13} style={{ flexShrink: 0 }} />
      {localizedConfig.label}
    </span>
  );
};
