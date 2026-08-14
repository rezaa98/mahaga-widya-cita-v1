"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ImportJournalModal } from "./ImportJournalModal";
import { useAdminLanguage, useContentLocale, withLocale } from "./adminLocale";

type Stats = {
  articles: { total: number; published: number; draft: number };
  journals: { total: number; published: number; draft: number };
  users: { total: number };
  subscribers: { total: number; recentCount: number };
  media: { total: number };
  contacts: { total: number; recentCount: number };
  translations: { failed: number; needsReview: number; needsUpdate: number; processing: number };
};

type ActivityItem = {
  type: "article" | "journal" | "contact" | "subscriber" | "media";
  label: string;
  detail: string;
  time: string;
  link: string;
};
type WeeklyChartData = {
  name: string;
  articles: number;
  journals: number;
  contacts: number;
  subscribers: number;
  media: number;
};
type TranslationQueueItem = {
  href: string;
  identifier: string;
  resourceId: null | string;
  status: "failed" | "needs_review" | "needs_update" | "queued" | "translating";
  updatedAt: string;
};
type DashboardData = {
  stats: Stats;
  recentActivity: ActivityItem[];
  translationQueue: TranslationQueueItem[];
  weeklyChartData: WeeklyChartData[];
};

const icons: Record<ActivityItem["type"], string> = {
  article: "article",
  journal: "menu_book",
  contact: "mail",
  subscriber: "person_add",
  media: "image",
};

function timeAgo(value: string, isEn: boolean) {
  const minutes = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 60000));
  if (minutes < 2) return isEn ? "Just now" : "Baru saja";
  if (minutes < 60) return isEn ? `${minutes}m ago` : `${minutes} menit lalu`;
  if (minutes < 1440) return isEn ? `${Math.floor(minutes / 60)}h ago` : `${Math.floor(minutes / 60)} jam lalu`;
  if (minutes < 10080) return isEn ? `${Math.floor(minutes / 1440)}d ago` : `${Math.floor(minutes / 1440)} hari lalu`;
  return new Date(value).toLocaleDateString(isEn ? "en-US" : "id-ID", { day: "numeric", month: "short" });
}

function Icon({ children }: { children: string }) {
  return (
    <span aria-hidden className="material-symbols-outlined mwc-dashboard__icon">
      {children}
    </span>
  );
}

function MetricCard({
  label,
  value,
  detail,
  href,
  icon,
  tone = "blue",
  loading,
}: {
  label: string;
  value?: number;
  detail: string;
  href: string;
  icon: string;
  tone?: string;
  loading: boolean;
}) {
  return (
    <a className={`mwc-metric mwc-metric--${tone}`} href={href} aria-label={label}>
      <span className="mwc-metric__icon">
        <Icon>{icon}</Icon>
      </span>
      <span className="mwc-metric__body">
        <span className="mwc-metric__label">{label}</span>
        <strong className={loading ? "mwc-skeleton mwc-metric__value" : "mwc-metric__value"}>
          {loading ? "" : value}
        </strong>
        <small>{detail}</small>
      </span>
    </a>
  );
}

function AttentionPanel({ data, isEn, locale }: { data: DashboardData; isEn: boolean; locale: "id" | "en" }) {
  const reviewTarget = data.translationQueue.find((item) => item.status === "needs_review")?.href;
  const recoveryTarget = data.translationQueue.find((item) => ["failed", "needs_update"].includes(item.status))?.href;
  const items = [
    {
      count: data.stats.articles.draft,
      label: isEn ? "draft articles" : "artikel draft",
      href: "/admin/collections/articles?where[status][equals]=draft",
      icon: "article",
      translationTarget: false,
    },
    {
      count: data.stats.journals.draft,
      label: isEn ? "draft journals" : "jurnal draft",
      href: "/admin/collections/journals?where[status][equals]=draft",
      icon: "menu_book",
      translationTarget: false,
    },
    {
      count: data.stats.contacts.recentCount,
      label: isEn ? "new messages" : "pesan baru",
      href: "/admin/collections/contact-submissions",
      icon: "mail",
      translationTarget: false,
    },
    {
      count: data.stats.translations.needsReview,
      label: isEn ? "translations awaiting review" : "terjemahan menunggu review",
      href: reviewTarget || "#translation-queue",
      icon: "rate_review",
      translationTarget: Boolean(reviewTarget),
    },
    {
      count: data.stats.translations.needsUpdate + data.stats.translations.failed,
      label: isEn ? "translations need recovery" : "terjemahan perlu diperbaiki",
      href: recoveryTarget || "#translation-queue",
      icon: "translate",
      translationTarget: Boolean(recoveryTarget),
    },
  ].filter((item) => item.count > 0);

  return (
    <section className="mwc-panel mwc-attention" aria-labelledby="attention-title">
      <div className="mwc-panel__heading">
        <div>
          <p className="mwc-eyebrow">{isEn ? "Priority" : "Prioritas"}</p>
          <h2 id="attention-title">{isEn ? "Needs Attention" : "Perlu perhatian"}</h2>
        </div>
        <Icon>notifications</Icon>
      </div>
      {items.length ? (
        <div className="mwc-attention__list">
          {items.map((item) => (
            <a href={item.translationTarget ? item.href : withLocale(item.href, locale)} key={item.label}>
              <span className="mwc-attention__count">{item.count}</span>
              <span>
                <Icon>{item.icon}</Icon>
                {item.label}
              </span>
              <Icon>chevron_right</Icon>
            </a>
          ))}
        </div>
      ) : (
        <p className="mwc-empty">
          {isEn ? "No urgent actions required at this time." : "Tidak ada tindakan mendesak saat ini."}
        </p>
      )}
    </section>
  );
}

function TranslationPanel({ data, isEn }: { data: DashboardData; isEn: boolean }) {
  const labels = {
    failed: isEn ? "Failed" : "Gagal",
    needs_review: isEn ? "Needs review" : "Perlu review",
    needs_update: isEn ? "Source changed" : "Sumber berubah",
    queued: isEn ? "Queued" : "Dalam antrean",
    translating: isEn ? "Translating" : "Diterjemahkan",
  };
  return (
    <section
      className="mwc-panel mwc-translation-queue"
      id="translation-queue"
      aria-labelledby="translation-queue-title"
    >
      <div className="mwc-panel__heading">
        <div>
          <p className="mwc-eyebrow">AI Translation</p>
          <h2 id="translation-queue-title">{isEn ? "Translation Queue" : "Antrean terjemahan"}</h2>
        </div>
        <span>
          {data.stats.translations.needsReview + data.stats.translations.needsUpdate + data.stats.translations.failed}
        </span>
      </div>
      <div className="mwc-translation-queue__summary">
        <span>
          <strong>{data.stats.translations.needsReview}</strong>
          {isEn ? "Review" : "Review"}
        </span>
        <span>
          <strong>{data.stats.translations.needsUpdate}</strong>
          {isEn ? "Update" : "Perbarui"}
        </span>
        <span>
          <strong>{data.stats.translations.failed}</strong>
          {isEn ? "Failed" : "Gagal"}
        </span>
        <span>
          <strong>{data.stats.translations.processing}</strong>
          {isEn ? "Processing" : "Diproses"}
        </span>
      </div>
      {data.translationQueue.length ? (
        <div className="mwc-translation-queue__list">
          {data.translationQueue.map((item) => (
            <a href={item.href} key={`${item.identifier}-${item.resourceId || "global"}`}>
              <span>
                <strong>{item.identifier}</strong>
                <small>{item.resourceId ? `#${item.resourceId}` : "Global"}</small>
              </span>
              <em className={`is-${item.status}`}>{labels[item.status]}</em>
              <Icon>chevron_right</Icon>
            </a>
          ))}
        </div>
      ) : (
        <p className="mwc-empty">{isEn ? "Translation queue is clear." : "Tidak ada antrean terjemahan."}</p>
      )}
    </section>
  );
}

function ActivityList({
  data,
  loading,
  isEn,
  locale,
}: {
  data: DashboardData | null;
  loading: boolean;
  isEn: boolean;
  locale: "id" | "en";
}) {
  return (
    <section className="mwc-panel mwc-activity" aria-labelledby="activity-title">
      <div className="mwc-panel__heading">
        <div>
          <p className="mwc-eyebrow">Timeline</p>
          <h2 id="activity-title">{isEn ? "Recent Activity" : "Aktivitas terbaru"}</h2>
        </div>
        <a href={withLocale("/admin/collections/articles", locale)}>{isEn ? "View content" : "Lihat konten"}</a>
      </div>
      {loading ? (
        <div className="mwc-activity__list">
          {Array.from({ length: 4 }, (_, index) => (
            <div className="mwc-activity__skeleton" key={index}>
              <span className="mwc-skeleton" />
              <span>
                <i className="mwc-skeleton" />
                <i className="mwc-skeleton" />
              </span>
            </div>
          ))}
        </div>
      ) : !data?.recentActivity.length ? (
        <p className="mwc-empty">{isEn ? "No recent activity recorded." : "Belum ada aktivitas tercatat."}</p>
      ) : (
        <div className="mwc-activity__list">
          {data.recentActivity.map((item, index) => (
            <a href={withLocale(item.link, locale)} key={`${item.time}-${index}`}>
              <span className={`mwc-activity__type mwc-activity__type--${item.type}`}>
                <Icon>{icons[item.type]}</Icon>
              </span>
              <span>
                <strong>{item.label}</strong>
                <small>{item.detail}</small>
                <time dateTime={item.time}>{timeAgo(item.time, isEn)}</time>
              </span>
            </a>
          ))}
        </div>
      )}
    </section>
  );
}

export const DashboardClient: React.FC = () => {
  const locale = useContentLocale();
  const isEn = useAdminLanguage() === "en";

  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [request, setRequest] = useState(0);

  // Keep the first server/client render deterministic across UTC and the user's timezone.
  const greeting = isEn ? "Welcome back" : "Selamat datang";

  const actionItems = useMemo(
    () => [
      {
        href: withLocale("/admin/collections/articles/create", locale),
        icon: "post_add",
        label: isEn ? "New Article" : "Artikel Baru",
        primary: true,
      },
      {
        href: withLocale("/admin/collections/journals/create", locale),
        icon: "note_add",
        label: isEn ? "New Journal" : "Jurnal Baru",
        primary: true,
      },
      { href: withLocale("/admin/collections/media/create", locale), icon: "upload_file", label: "Upload Media" },
      {
        href: withLocale("/admin/collections/contact-submissions", locale),
        icon: "mail",
        label: isEn ? "Inbox Messages" : "Pesan Masuk",
      },
    ],
    [isEn, locale],
  );

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      try {
        const response = await fetch(`/api/admin/dashboard-stats?locale=${locale}`, { signal: controller.signal });
        if (!response.ok)
          throw new Error(
            isEn
              ? `Failed to load dashboard (${response.status})`
              : `Dashboard tidak dapat dimuat (${response.status})`,
          );
        const responseData = await response.json();
        if (!responseData?.stats || !Array.isArray(responseData?.weeklyChartData)) {
          throw new Error(isEn ? "Invalid dashboard data format" : "Format data dashboard tidak valid");
        }
        setData(responseData as DashboardData);
      } catch (cause) {
        if (!controller.signal.aborted) {
          setError(
            cause instanceof Error ? cause.message : isEn ? "Failed to load dashboard" : "Dashboard tidak dapat dimuat",
          );
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };
    void load();
    return () => controller.abort();
  }, [request, locale, isEn]);

  const reloadDashboard = () => {
    setLoading(true);
    setError(null);
    setRequest((value) => value + 1);
  };

  const subtitle = error
    ? isEn
      ? "Data unavailable. Please try reloading."
      : "Data belum tersedia. Silakan coba muat ulang."
    : loading
      ? isEn
        ? "Preparing your operational summary…"
        : "Menyiapkan ringkasan operasional Anda…"
      : data?.stats.contacts.recentCount
        ? isEn
          ? `There are ${data.stats.contacts.recentCount} new contact messages in the last 30 days.`
          : `Ada ${data.stats.contacts.recentCount} pesan kontak baru dalam 30 hari terakhir.`
        : isEn
          ? "Summary of your website content and activities."
          : "Ringkasan konten dan aktivitas website Anda.";

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  return (
    <main className="mwc-dashboard">
      <div className="mwc-dashboard__canvas">
        <header className="mwc-dashboard__header">
          <div>
            <p className="mwc-eyebrow">Mahaga Widya Cita CMS</p>
            <h1>{greeting}</h1>
            <p>{subtitle}</p>
          </div>
          <a className="mwc-dashboard__site-link" href={`/${locale}`} target="_blank" rel="noreferrer">
            <Icon>open_in_new</Icon>
            {isEn ? "View website" : "Lihat website"}
          </a>
        </header>

        <nav className="mwc-actions" aria-label="Aksi cepat">
          {actionItems.map((item) => (
            <a
              className={item.primary ? "mwc-action mwc-action--primary" : "mwc-action"}
              href={item.href}
              key={item.href}
            >
              <Icon>{item.icon}</Icon>
              {item.label}
            </a>
          ))}
          <button
            type="button"
            className="mwc-action mwc-action--primary"
            onClick={() => setIsImportModalOpen(true)}
            style={{ background: "#7e22ce", borderColor: "#7e22ce", cursor: "pointer" }}
          >
            <Icon>link</Icon>
            {isEn ? "Import Journal (OJS Link)" : "Impor Jurnal (Link OJS)"}
          </button>
        </nav>
        <ImportJournalModal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} isEn={isEn} />
        {error && (
          <section className="mwc-dashboard__error" role="alert">
            <span>
              <Icon>error</Icon>
              {error}
            </span>
            <button onClick={reloadDashboard} type="button">
              <Icon>refresh</Icon>
              {isEn ? "Retry" : "Coba lagi"}
            </button>
          </section>
        )}

        <section className="mwc-metrics" aria-label={isEn ? "Content summary" : "Ringkasan konten"}>
          <MetricCard
            detail={
              data
                ? `${data.stats.articles.published} published · ${data.stats.articles.draft} draft`
                : isEn
                  ? "Loading status…"
                  : "Memuat status…"
            }
            href={withLocale("/admin/collections/articles", locale)}
            icon="article"
            label={isEn ? "Articles" : "Artikel"}
            loading={loading}
            value={data?.stats.articles.total}
          />
          <MetricCard
            detail={
              data
                ? `${data.stats.journals.published} published · ${data.stats.journals.draft} draft`
                : isEn
                  ? "Loading status…"
                  : "Memuat status…"
            }
            href={withLocale("/admin/collections/journals", locale)}
            icon="menu_book"
            label={isEn ? "Journals" : "Jurnal"}
            loading={loading}
            tone="purple"
            value={data?.stats.journals.total}
          />
          <MetricCard
            detail={
              data
                ? `${data.stats.contacts.recentCount} ${isEn ? "new in 30 days" : "baru 30 hari ini"}`
                : isEn
                  ? "Loading status…"
                  : "Memuat status…"
            }
            href={withLocale("/admin/collections/contact-submissions", locale)}
            icon="mail"
            label={isEn ? "Contact Messages" : "Pesan kontak"}
            loading={loading}
            tone="amber"
            value={data?.stats.contacts.total}
          />
          <MetricCard
            detail={
              data
                ? `${data.stats.media.total} ${isEn ? "files in library" : "file di library"}`
                : isEn
                  ? "Loading status…"
                  : "Memuat status…"
            }
            href={withLocale("/admin/collections/media", locale)}
            icon="perm_media"
            label={isEn ? "Media" : "Media"}
            loading={loading}
            tone="slate"
            value={data?.stats.media.total}
          />
        </section>

        {data && !error && (
          <section className="mwc-dashboard__content">
            <TranslationPanel data={data} isEn={isEn} />
            <section className="mwc-panel mwc-chart">
              <div className="mwc-panel__heading">
                <div>
                  <p className="mwc-eyebrow">{isEn ? "Publications" : "Publikasi"}</p>
                  <h2>{isEn ? "Content Growth" : "Pertumbuhan konten"}</h2>
                </div>
                <span>{isEn ? "Last 4 weeks" : "4 minggu terakhir"}</span>
              </div>
              {data.weeklyChartData.length ? (
                <div className="mwc-chart__area">
                  <ResponsiveContainer height="100%" width="100%">
                    <AreaChart data={data.weeklyChartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="mwc-content-growth" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="5%" stopColor="#2563eb" stopOpacity={0.28} />
                          <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="#e4e6ee" strokeDasharray="3 3" vertical={false} />
                      <XAxis
                        axisLine={false}
                        dataKey="name"
                        tick={{ fill: "#687087", fontSize: 11 }}
                        tickLine={false}
                      />
                      <YAxis
                        allowDecimals={false}
                        axisLine={false}
                        tick={{ fill: "#687087", fontSize: 11 }}
                        tickLine={false}
                      />
                      <Tooltip />
                      <Area
                        dataKey="articles"
                        fill="url(#mwc-content-growth)"
                        name={isEn ? "Articles" : "Artikel"}
                        stroke="#2563eb"
                        strokeWidth={2.5}
                        type="monotone"
                      />
                      <Area
                        dataKey="journals"
                        fill="none"
                        name={isEn ? "Journals" : "Jurnal"}
                        stroke="#7c3aed"
                        strokeWidth={2.5}
                        type="monotone"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="mwc-empty">
                  {isEn ? "No growth data available to display." : "Belum ada data pertumbuhan untuk ditampilkan."}
                </p>
              )}
            </section>
            <AttentionPanel data={data} isEn={isEn} locale={locale} />
            <ActivityList data={data} isEn={isEn} loading={loading} locale={locale} />
          </section>
        )}
      </div>
    </main>
  );
};
