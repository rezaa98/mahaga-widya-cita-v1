"use client";

/* Pre-existing sync-from-URL / status-load effects; keep until refactored. */
/* eslint-disable react-hooks/set-state-in-effect */

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { toast, useDocumentInfo, useFormModified } from "@payloadcms/ui";
import { CONTENT_LOCALES, useAdminLanguage, useContentLocale } from "./adminLocale";

type Availability = "checking" | "available" | "missing" | "new" | "error";
type TranslationState =
  "not_generated" | "queued" | "translating" | "needs_update" | "needs_review" | "approved" | "failed" | "unavailable";
type TranslationAction = "generate" | "update" | "retry" | "approve";

type TranslationStatus = {
  status: TranslationState;
  translatedAt?: string;
  model?: string;
  error?: string;
  canApprove?: boolean;
  canReview?: boolean;
  progress?: { completed: number; total: number };
  preview?: Array<{
    editable: boolean;
    field: string;
    issues: string[];
    source: string;
    translated: string;
  }>;
  previewTotal?: number;
  review?: { completed: number; fields: string[]; total: number };
  reviewExpiresAt?: string;
  publicationStatus?: "draft" | "live_on_save" | "published";
  auditLog?: Array<{ action: string; actorId?: number | string | null; at: string; details?: Record<string, unknown> }>;
};

const localizedPaths: Record<string, string[]> = {
  articles: ["title", "content", "excerpt"],
  journals: ["title", "abstract", "content", "keywords"],
  "policy-reviews": ["title", "summary", "content", "excerpt"],
  services: ["name", "title", "description", "content"],
  "team-members": ["name", "position", "bio"],
  categories: ["name", "title"],
  beranda: [
    "hero.badge",
    "hero.title",
    "hero.titleHighlight",
    "hero.titleSuffix",
    "hero.description",
    "hero.features[].text",
    "stats[].suffix",
    "stats[].label",
    "partners.title",
    "partners.list[].name",
    "servicesIntro.badge",
    "servicesIntro.title",
    "servicesIntro.description",
    "teamIntro.title",
    "teamIntro.description",
    "cta.title",
    "cta.description",
    "cta.waMessage",
    "cta.features[].text",
  ],
  "tentang-kami": ["hero.badge", "hero.title", "hero.titleHighlight", "hero.description"],
  kontak: ["heroTitle", "heroSubtitle", "phone", "address", "workingHours"],
  footer: ["companyDescription", "socialMedia[].url", "linksCompany[].label", "linksCompany[].url"],
  navbar: ["links[].label", "links[].href", "links[].children[].label", "links[].children[].href"],
};

const knownTranslationStates = new Set<TranslationState>([
  "not_generated",
  "queued",
  "translating",
  "needs_update",
  "needs_review",
  "approved",
  "failed",
]);

function valuesAtPath(value: unknown, segments: string[]): unknown[] {
  if (!segments.length) return [value];
  const [segment, ...rest] = segments;
  const isArray = segment.endsWith("[]");
  const key = isArray ? segment.slice(0, -2) : segment;
  const next = value && typeof value === "object" ? (value as Record<string, unknown>)[key] : undefined;
  if (isArray) {
    if (!Array.isArray(next) || next.length === 0) return [undefined];
    return next.flatMap((entry) => valuesAtPath(entry, rest));
  }
  return valuesAtPath(next, rest);
}

function contentProgress(data: Record<string, unknown>, slug: string) {
  const paths = localizedPaths[slug] || ["title", "name", "description", "content"];
  const meaningful = (value: unknown) => {
    if (typeof value === "string") return value.trim().length > 0;
    if (Array.isArray(value)) return value.some(meaningful);
    if (value && typeof value === "object") return Object.keys(value).length > 0;
    return false;
  };
  const values = paths.flatMap((path) => valuesAtPath(data, path.split(".")));
  return { filled: values.filter(meaningful).length, total: values.length };
}

function parseTranslationStatus(payload: unknown): TranslationStatus {
  const root = payload && typeof payload === "object" ? (payload as Record<string, unknown>) : {};
  const data = root.data && typeof root.data === "object" ? (root.data as Record<string, unknown>) : root;
  const rawStatus = data.status ?? data.translationStatus;
  const status =
    typeof rawStatus === "string" && knownTranslationStates.has(rawStatus as TranslationState)
      ? (rawStatus as TranslationState)
      : "not_generated";
  const rawProgress =
    data.progress && typeof data.progress === "object" ? (data.progress as Record<string, unknown>) : undefined;
  const completed = Number(rawProgress?.completed ?? rawProgress?.current);
  const total = Number(rawProgress?.total);
  const preview = Array.isArray(data.preview)
    ? data.preview.filter(
        (item): item is { editable: boolean; field: string; issues: string[]; source: string; translated: string } =>
          Boolean(
            item &&
            typeof item === "object" &&
            typeof item.field === "string" &&
            typeof item.source === "string" &&
            typeof item.translated === "string" &&
            typeof item.editable === "boolean" &&
            Array.isArray(item.issues),
          ),
      )
    : [];

  return {
    status,
    translatedAt:
      typeof (data.translatedAt ?? data.lastTranslatedAt) === "string"
        ? String(data.translatedAt ?? data.lastTranslatedAt)
        : undefined,
    model:
      typeof (data.model ?? data.translatedByModel) === "string"
        ? String(data.model ?? data.translatedByModel)
        : undefined,
    error: typeof (data.error ?? data.lastError) === "string" ? String(data.error ?? data.lastError) : undefined,
    canApprove: data.canApprove === true,
    canReview: data.canReview === true,
    progress: Number.isFinite(completed) && Number.isFinite(total) && total > 0 ? { completed, total } : undefined,
    preview,
    previewTotal: Number.isFinite(Number(data.previewTotal)) ? Number(data.previewTotal) : preview.length,
    review:
      data.review && typeof data.review === "object"
        ? {
            completed: Number((data.review as any).completed || 0),
            fields: Array.isArray((data.review as any).fields) ? (data.review as any).fields : [],
            total: Number((data.review as any).total || 0),
          }
        : undefined,
    reviewExpiresAt: typeof data.reviewExpiresAt === "string" ? data.reviewExpiresAt : undefined,
    publicationStatus:
      data.publicationStatus === "draft" ||
      data.publicationStatus === "published" ||
      data.publicationStatus === "live_on_save"
        ? data.publicationStatus
        : undefined,
    auditLog: Array.isArray(data.auditLog) ? (data.auditLog as TranslationStatus["auditLog"]) : [],
  };
}

export const LocaleDocumentControls: React.FC = () => {
  const locale = useContentLocale();
  const isEn = useAdminLanguage() === "en";
  const modified = useFormModified();
  const documentInfo = useDocumentInfo();
  const { collectionSlug, globalSlug, id } = documentInfo;
  const identifier = collectionSlug || globalSlug || "";
  const isGlobal = Boolean(globalSlug);
  const current = CONTENT_LOCALES[locale];
  const [availability, setAvailability] = useState<Availability>(id || globalSlug ? "checking" : "new");
  const [progress, setProgress] = useState({ filled: 0, total: 0 });
  const [translation, setTranslation] = useState<TranslationStatus>({ status: "unavailable" });
  const [translationChecking, setTranslationChecking] = useState(false);
  const [processingAction, setProcessingAction] = useState<TranslationAction | null>(null);
  const [processingField, setProcessingField] = useState<string | null>(null);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [draftEdits, setDraftEdits] = useState<Record<string, string>>({});

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("reviewTranslation") === "1") setReviewOpen(true);
  }, []);

  useEffect(() => {
    if (!modified) return;
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [modified]);

  useEffect(() => {
    if ((!id && !globalSlug) || !identifier) {
      setAvailability("new");
      return;
    }
    const controller = new AbortController();
    const endpoint = collectionSlug
      ? `/api/${collectionSlug}/${id}?locale=${locale}&fallback-locale=null&depth=0&draft=true`
      : `/api/globals/${globalSlug}?locale=${locale}&fallback-locale=null&depth=0&draft=true`;
    setAvailability("checking");
    fetch(endpoint, { credentials: "include", signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error(String(response.status));
        return response.json();
      })
      .then((json) => {
        const nextProgress = contentProgress((json?.doc || json) as Record<string, unknown>, identifier);
        setProgress(nextProgress);
        setAvailability(nextProgress.filled > 0 ? "available" : "missing");
      })
      .catch(() => {
        if (!controller.signal.aborted) setAvailability("error");
      });
    return () => controller.abort();
  }, [collectionSlug, globalSlug, id, identifier, locale]);

  const loadTranslationStatus = useCallback(
    async (signal?: AbortSignal) => {
      if ((!id && !globalSlug) || !identifier) {
        setTranslation({ status: "not_generated" });
        return;
      }
      const params = new URLSearchParams({
        identifier,
        id: id == null ? "" : String(id),
        isGlobal: isGlobal ? "1" : "0",
      });
      setTranslationChecking(true);
      try {
        const response = await fetch(`/api/translation-status?${params.toString()}`, {
          cache: "no-store",
          credentials: "include",
          signal,
        });
        if (!response.ok) throw new Error(String(response.status));
        setTranslation(parseTranslationStatus(await response.json()));
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          setTranslation({ status: "unavailable" });
        }
      } finally {
        if (!signal?.aborted) setTranslationChecking(false);
      }
    },
    [globalSlug, id, identifier, isGlobal],
  );

  useEffect(() => {
    const controller = new AbortController();
    void loadTranslationStatus(controller.signal);
    return () => controller.abort();
  }, [loadTranslationStatus]);

  useEffect(() => {
    if (!["queued", "translating"].includes(translation.status)) return;
    const interval = window.setInterval(() => void loadTranslationStatus(), 5000);
    return () => window.clearInterval(interval);
  }, [loadTranslationStatus, translation.status]);

  const availabilityText = useMemo(() => {
    if (availability === "checking") return isEn ? "Checking content…" : "Memeriksa konten…";
    if (availability === "available")
      return isEn
        ? `${progress.filled}/${progress.total} fields filled`
        : `${progress.filled}/${progress.total} field terisi`;
    if (availability === "missing") return isEn ? "This locale is empty" : "Locale ini masih kosong";
    if (availability === "new") return isEn ? `New ${current.shortLabel} content` : `Konten ${current.shortLabel} baru`;
    return isEn ? "Content status unavailable" : "Status konten tidak tersedia";
  }, [availability, current.shortLabel, isEn, progress.filled, progress.total]);

  const stateCopy = useMemo(
    () => ({
      not_generated: isEn ? "English not generated" : "Bahasa Inggris belum dibuat",
      queued: isEn ? "Queued" : "Menunggu antrean",
      translating: isEn ? "Translating" : "Sedang menerjemahkan",
      needs_update: isEn ? "Source changed — update needed" : "Sumber berubah — perlu diperbarui",
      needs_review: isEn ? "AI draft ready for review" : "Draf AI siap direview",
      approved: isEn ? "English approved" : "Bahasa Inggris disetujui",
      failed: isEn ? "Translation failed" : "Terjemahan gagal",
      unavailable: isEn ? "Workflow status unavailable" : "Status workflow tidak tersedia",
    }),
    [isEn],
  );

  const action = useMemo<TranslationAction | null>(() => {
    if (translationChecking || processingAction || modified || (!id && !globalSlug)) return null;
    if (locale === "en")
      return translation.status === "needs_review" &&
        translation.canApprove &&
        translation.review?.completed === translation.review?.total
        ? "approve"
        : null;
    if (translation.status === "queued") return "retry";
    if (translation.status === "failed") return "retry";
    if (translation.status === "needs_update") return "update";
    if (["not_generated", "unavailable"].includes(translation.status)) return "generate";
    return null;
  }, [
    globalSlug,
    id,
    locale,
    modified,
    processingAction,
    translation.canApprove,
    translation.review?.completed,
    translation.review?.total,
    translation.status,
    translationChecking,
  ]);

  const actionLabel = (nextAction: TranslationAction) =>
    ({
      generate: isEn ? "Generate English" : "Buat Bahasa Inggris",
      update: isEn ? "Update English" : "Perbarui Bahasa Inggris",
      retry:
        translation.status === "queued" ? (isEn ? "Process Now" : "Proses Sekarang") : isEn ? "Retry" : "Coba Lagi",
      approve: isEn ? "Approve English" : "Setujui Bahasa Inggris",
    })[nextAction];

  const runAction = async (nextAction: TranslationAction) => {
    setProcessingAction(nextAction);
    try {
      const response = await fetch("/api/translation-actions", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: nextAction, identifier, id: id ?? null, isGlobal }),
      });
      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as {
          code?: string;
          error?: string;
          message?: string;
        } | null;
        const localized: Record<string, string> = {
          CANDIDATE_CHANGED: isEn
            ? "The candidate changed. The latest status has been loaded."
            : "Kandidat berubah. Status terbaru sudah dimuat.",
          CANDIDATE_EXPIRED: isEn
            ? "This draft expired. Generate a fresh translation."
            : "Draf kedaluwarsa. Buat ulang terjemahan.",
          CANDIDATE_MISSING: isEn
            ? "The candidate is no longer available. The latest status has been loaded."
            : "Kandidat tidak lagi tersedia. Status terbaru sudah dimuat.",
          REVIEW_INCOMPLETE: isEn ? "Review every field before approval." : "Periksa setiap field sebelum menyetujui.",
          SOURCE_CHANGED: isEn
            ? "The Indonesian source changed. Update the English draft."
            : "Sumber Indonesia berubah. Perbarui draf Inggris.",
          WORKER_INCOMPLETE: isEn
            ? "The translation worker stopped before finishing. Please retry."
            : "Worker terjemahan berhenti sebelum selesai. Silakan coba lagi.",
        };
        throw new Error(
          (body?.code && localized[body.code]) || body?.error || body?.message || String(response.status),
        );
      }
      toast.success(
        nextAction === "approve"
          ? isEn
            ? "English translation approved"
            : "Terjemahan Inggris disetujui"
          : isEn
            ? "Translation request queued"
            : "Permintaan terjemahan masuk antrean",
      );
      await loadTranslationStatus();
    } catch (error) {
      const detail = error instanceof Error ? error.message : "Unknown error";
      toast.error(`${isEn ? "Translation action failed" : "Aksi terjemahan gagal"}: ${detail}`);
    } finally {
      setProcessingAction(null);
      await loadTranslationStatus();
    }
  };

  const reviewField = async (field: string, translated?: string) => {
    setProcessingField(field);
    try {
      const response = await fetch("/api/translation-actions", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "review", field, identifier, id: id ?? null, isGlobal, translated }),
      });
      const body = (await response.json().catch(() => null)) as { error?: string } | null;
      if (!response.ok) throw new Error(body?.error || String(response.status));
      toast.success(isEn ? `${field} reviewed` : `${field} selesai diperiksa`);
      await loadTranslationStatus();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : isEn ? "Review failed" : "Review gagal");
    } finally {
      setProcessingField(null);
      await loadTranslationStatus();
    }
  };

  const issueCopy = (issue: string) =>
    ({
      candidate_empty: isEn ? "Candidate is empty" : "Kandidat kosong",
      candidate_too_short: isEn ? "Candidate may be too short" : "Kandidat mungkin terlalu pendek",
      source_may_be_english: isEn ? "Indonesian source may be English" : "Sumber Indonesia mungkin berbahasa Inggris",
      unchanged_from_source: isEn ? "Candidate is unchanged" : "Kandidat tidak berubah",
    })[issue] || issue;

  const translatedDateValue = translation.translatedAt ? new Date(translation.translatedAt) : null;
  const translatedDate =
    translatedDateValue && !Number.isNaN(translatedDateValue.getTime())
      ? new Intl.DateTimeFormat(isEn ? "en-US" : "id-ID", { dateStyle: "medium", timeStyle: "short" }).format(
          translatedDateValue,
        )
      : null;

  return (
    <section
      className={`mwc-document-locale mwc-document-locale--${locale}`}
      aria-label={isEn ? "Translation workflow" : "Workflow terjemahan"}
    >
      <div className="mwc-document-locale__content">
        <span className="mwc-document-locale__badge">{current.shortLabel}</span>
        <strong>{isEn ? `Editing ${current.label}` : `Mengedit ${current.label}`}</strong>
        <span className={`mwc-document-locale__status mwc-document-locale__status--${availability}`}>
          {availabilityText}
        </span>
        {modified && (
          <span className="mwc-document-locale__dirty">
            {isEn ? "Save before translating" : "Simpan sebelum menerjemahkan"}
          </span>
        )}
      </div>

      {identifier && (id || globalSlug) && (
        <div className="mwc-translation-workflow">
          <span className={`mwc-translation-workflow__state mwc-translation-workflow__state--${translation.status}`}>
            <span aria-hidden className="mwc-translation-workflow__dot" />
            {translationChecking
              ? isEn
                ? "Checking workflow…"
                : "Memeriksa workflow…"
              : stateCopy[translation.status]}
          </span>
          {translation.progress && (
            <span className="mwc-translation-workflow__meta">
              {translation.progress.completed}/{translation.progress.total}
            </span>
          )}
          {translatedDate && (
            <span className="mwc-translation-workflow__meta">
              {isEn ? "Last:" : "Terakhir:"} {translatedDate}
            </span>
          )}
          {translation.model && <span className="mwc-translation-workflow__meta">{translation.model}</span>}
          {translation.publicationStatus && (
            <span className="mwc-translation-workflow__meta">
              {isEn ? "Publication:" : "Publikasi:"}{" "}
              {translation.publicationStatus === "draft"
                ? "Draft"
                : translation.publicationStatus === "published"
                  ? "Published"
                  : isEn
                    ? "Live when saved"
                    : "Tayang saat disimpan"}
            </span>
          )}
          {translation.error && (
            <span className="mwc-translation-workflow__error" title={translation.error}>
              {translation.error}
            </span>
          )}
          {locale === "id" && translation.status === "needs_review" && (
            <a className="mwc-translation-workflow__action" href="?locale=en&reviewTranslation=1">
              <span className="material-symbols-outlined" aria-hidden>
                rate_review
              </span>
              {isEn ? "Review English draft" : "Tinjau draf Inggris"}
            </a>
          )}
          {locale === "en" && translation.status === "needs_update" && (
            <a className="mwc-translation-workflow__action" href="?locale=id">
              <span className="material-symbols-outlined" aria-hidden>
                arrow_back
              </span>
              {isEn ? "Open Indonesian source" : "Buka sumber Indonesia"}
            </a>
          )}
          {locale === "en" && translation.status === "needs_review" && Boolean(translation.preview?.length) && (
            <details
              className="mwc-translation-preview"
              open={reviewOpen}
              onToggle={(event) => setReviewOpen(event.currentTarget.open)}
            >
              <summary>{isEn ? "Review AI draft" : "Tinjau draf AI"}</summary>
              {translation.review && (
                <p className="mwc-translation-preview__progress">
                  {isEn ? "Reviewed" : "Diperiksa"}: {translation.review.completed}/{translation.review.total}
                </p>
              )}
              <div className="mwc-translation-preview__grid">
                {translation.preview?.map((item) => (
                  <article
                    className={`mwc-translation-preview__item ${translation.review?.fields.includes(item.field) ? "is-reviewed" : ""}`}
                    key={item.field}
                  >
                    <div className="mwc-translation-preview__field">
                      <strong>{item.field}</strong>
                      {translation.review?.fields.includes(item.field) && (
                        <span>{isEn ? "Reviewed" : "Sudah diperiksa"}</span>
                      )}
                      {item.issues.map((issue) => (
                        <em key={issue}>{issueCopy(issue)}</em>
                      ))}
                    </div>
                    <div>
                      <small>{isEn ? "Indonesian source" : "Sumber Indonesia"}</small>
                      <p>{item.source}</p>
                    </div>
                    <div>
                      <small>{isEn ? "English candidate" : "Kandidat Inggris"}</small>
                      {item.editable && translation.canReview ? (
                        <textarea
                          aria-label={`${item.field} English candidate`}
                          onChange={(event) =>
                            setDraftEdits((value) => ({ ...value, [item.field]: event.target.value }))
                          }
                          value={draftEdits[item.field] ?? item.translated}
                        />
                      ) : (
                        <p>{item.translated}</p>
                      )}
                      {translation.canReview && (
                        <button
                          className="mwc-translation-preview__review"
                          disabled={processingField === item.field}
                          onClick={() =>
                            void reviewField(
                              item.field,
                              item.editable ? (draftEdits[item.field] ?? item.translated) : undefined,
                            )
                          }
                          type="button"
                        >
                          {processingField === item.field
                            ? isEn
                              ? "Saving…"
                              : "Menyimpan…"
                            : translation.review?.fields.includes(item.field)
                              ? isEn
                                ? "Save review"
                                : "Simpan review"
                              : isEn
                                ? "Mark reviewed"
                                : "Tandai diperiksa"}
                        </button>
                      )}
                    </div>
                  </article>
                ))}
                {(translation.previewTotal || 0) > (translation.preview?.length || 0) && (
                  <p className="mwc-translation-preview__notice">
                    {isEn
                      ? `Showing ${translation.preview?.length} of ${translation.previewTotal} field groups. Review long content in the editor before approval.`
                      : `Menampilkan ${translation.preview?.length} dari ${translation.previewTotal} grup field. Tinjau konten panjang di editor sebelum menyetujui.`}
                  </p>
                )}
              </div>
            </details>
          )}
          {locale === "en" && translation.status === "needs_review" && !translation.canApprove && (
            <span className="mwc-translation-workflow__meta">
              {isEn ? "Publisher approval required" : "Memerlukan persetujuan publisher"}
            </span>
          )}
          {locale === "en" &&
            translation.status === "needs_review" &&
            translation.canApprove &&
            translation.review &&
            translation.review.completed < translation.review.total && (
              <span className="mwc-translation-workflow__meta">
                {isEn ? "Review every field to enable approval" : "Periksa semua field untuk mengaktifkan persetujuan"}
              </span>
            )}
          {action && (
            <button className="mwc-translation-workflow__action" type="button" onClick={() => void runAction(action)}>
              <span className="material-symbols-outlined" aria-hidden>
                {action === "approve" ? "check_circle" : action === "retry" ? "refresh" : "translate"}
              </span>
              {actionLabel(action)}
            </button>
          )}
          {processingAction && (
            <button className="mwc-translation-workflow__action" type="button" disabled>
              {isEn ? "Processing…" : "Memproses…"}
            </button>
          )}
          {Boolean(translation.auditLog?.length) && (
            <details className="mwc-translation-audit">
              <summary>{isEn ? "Translation history" : "Riwayat terjemahan"}</summary>
              <ol>
                {translation.auditLog?.map((event, index) => (
                  <li key={`${event.at}-${index}`}>
                    <strong>{event.action.replaceAll("_", " ")}</strong>
                    <time dateTime={event.at}>
                      {new Intl.DateTimeFormat(isEn ? "en-US" : "id-ID", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      }).format(new Date(event.at))}
                    </time>
                  </li>
                ))}
              </ol>
            </details>
          )}
        </div>
      )}
    </section>
  );
};
