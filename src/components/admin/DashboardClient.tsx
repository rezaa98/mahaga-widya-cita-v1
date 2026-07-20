"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ImportJournalModal } from "./ImportJournalModal";

type Stats = {
  articles: { total: number; published: number; draft: number };
  journals: { total: number; published: number; draft: number };
  users: { total: number };
  subscribers: { total: number; recentCount: number };
  media: { total: number };
  contacts: { total: number; recentCount: number };
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
type DashboardData = { stats: Stats; recentActivity: ActivityItem[]; weeklyChartData: WeeklyChartData[] };

const icons: Record<ActivityItem["type"], string> = {
  article: "article",
  journal: "menu_book",
  contact: "mail",
  subscriber: "person_add",
  media: "image",
};

function useAdminLocale() {
  const searchParams = useSearchParams();
  const [locale, setLocale] = useState("id");

  useEffect(() => {
    const updateLocale = () => {
      const urlLocale = searchParams?.get("locale") || new URLSearchParams(window.location.search).get("locale");
      if (urlLocale && (urlLocale === "en" || urlLocale === "id")) {
        setLocale(urlLocale);
        return;
      }
      const cookieMatch =
        document.cookie.match(/payload-locale=([^;]+)/) || document.cookie.match(/payload-lng=([^;]+)/);
      if (cookieMatch && (cookieMatch[1] === "en" || cookieMatch[1] === "id")) {
        setLocale(cookieMatch[1]);
        return;
      }
      setLocale("id");
    };

    updateLocale();
    const interval = setInterval(updateLocale, 400);
    return () => clearInterval(interval);
  }, [searchParams]);

  return locale;
}

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

function AttentionPanel({ data, isEn }: { data: DashboardData; isEn: boolean }) {
  const items = [
    {
      count: data.stats.articles.draft,
      label: isEn ? "draft articles" : "artikel draft",
      href: "/admin/collections/articles?where[status][equals]=draft",
      icon: "article",
    },
    {
      count: data.stats.journals.draft,
      label: isEn ? "draft journals" : "jurnal draft",
      href: "/admin/collections/journals?where[status][equals]=draft",
      icon: "menu_book",
    },
    {
      count: data.stats.contacts.recentCount,
      label: isEn ? "new messages" : "pesan baru",
      href: "/admin/collections/contact-submissions",
      icon: "mail",
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
            <a href={item.href} key={item.label}>
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

function ActivityList({ data, loading, isEn }: { data: DashboardData | null; loading: boolean; isEn: boolean }) {
  return (
    <section className="mwc-panel mwc-activity" aria-labelledby="activity-title">
      <div className="mwc-panel__heading">
        <div>
          <p className="mwc-eyebrow">Timeline</p>
          <h2 id="activity-title">{isEn ? "Recent Activity" : "Aktivitas terbaru"}</h2>
        </div>
        <a href="/admin/collections/articles">{isEn ? "View content" : "Lihat konten"}</a>
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
            <a href={item.link} key={`${item.time}-${index}`}>
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
  const locale = useAdminLocale();
  const isEn = locale === "en";

  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [request, setRequest] = useState(0);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (isEn) {
      return hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
    }
    return hour < 12 ? "Selamat pagi" : hour < 15 ? "Selamat siang" : hour < 18 ? "Selamat sore" : "Selamat malam";
  }, [isEn]);

  const actionItems = useMemo(
    () => [
      {
        href: "/admin/collections/articles/create",
        icon: "post_add",
        label: isEn ? "New Article" : "Artikel Baru",
        primary: true,
      },
      {
        href: "/admin/collections/journals/create",
        icon: "note_add",
        label: isEn ? "New Journal" : "Jurnal Baru",
        primary: true,
      },
      { href: "/admin/collections/media/create", icon: "upload_file", label: isEn ? "Upload Media" : "Upload Media" },
      { href: "/admin/collections/contact-submissions", icon: "mail", label: isEn ? "Inbox Messages" : "Pesan Masuk" },
    ],
    [isEn],
  );

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
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
            <button onClick={() => setRequest((value) => value + 1)} type="button">
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
            href="/admin/collections/articles"
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
            href="/admin/collections/journals"
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
            href="/admin/collections/contact-submissions"
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
            href="/admin/collections/media"
            icon="perm_media"
            label={isEn ? "Media" : "Media"}
            loading={loading}
            tone="slate"
            value={data?.stats.media.total}
          />
        </section>

        {data && !error && (
          <section className="mwc-dashboard__content">
            <div className="mwc-dashboard__primary">
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
              <ActivityList data={data} isEn={isEn} loading={loading} />
            </div>
            <AttentionPanel data={data} isEn={isEn} />
          </section>
        )}
      </div>
    </main>
  );
};
