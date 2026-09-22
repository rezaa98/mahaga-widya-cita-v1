"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "@payloadcms/ui";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ImportJournalModal } from "./ImportJournalModal";
import { useAdminLanguage, useContentLocale, withLocale } from "./adminLocale";
import {
  Home,
  Building2,
  PhoneCall,
  Users,
  Briefcase,
  PenSquare,
  ArrowRight,
  ExternalLink,
  FileText,
  BookOpen,
  FileCheck,
  UploadCloud,
  Mail,
  Link as LinkIcon,
  HelpCircle,
  CheckCircle2,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { HelpCenterModal } from "./HelpCenterModal";

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
          {loading ? "" : (value ?? 0)}
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
  const { user } = useAuth();
  const locale = useContentLocale();
  const isEn = useAdminLanguage() === "en";
  const authUser = user as unknown as { role?: unknown; name?: unknown; email?: unknown } | null;
  const role = typeof authUser?.role === "string" ? authUser.role : "member";
  const canCreateContent = ["admin", "editor", "super_admin"].includes(role);
  const canReviewContent = ["admin", "reviewer", "super_admin"].includes(role);
  const canManageMedia = ["admin", "editor", "super_admin"].includes(role);

  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [request, setRequest] = useState(0);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  // Friendly personal greeting
  const userName =
    typeof authUser?.name === "string" && authUser.name.trim()
      ? authUser.name.trim()
      : typeof authUser?.email === "string"
        ? authUser.email.split("@")[0]
        : null;

  const greeting = isEn
    ? `Welcome back${userName ? `, ${userName}` : ""}! 👋`
    : `Selamat datang${userName ? `, ${userName}` : ""}! 👋`;

  const actionItems = useMemo(
    () =>
      [
        {
          href: withLocale("/admin/collections/articles/create", locale),
          icon: <PenSquare size={16} />,
          label: isEn ? "Write New Article" : "Tulis Berita / Artikel Baru",
          primary: true,
          visible: canCreateContent,
        },
        {
          href: withLocale("/admin/collections/articles?where[status][equals]=in_review", locale),
          icon: <FileCheck size={16} />,
          label: isEn ? "Review Content" : "Review Konten",
          primary: false,
          visible: canReviewContent,
        },
        {
          href: withLocale("/admin/collections/media/create", locale),
          icon: <UploadCloud size={16} />,
          label: isEn ? "Upload Media" : "Upload Foto / Media",
          visible: canManageMedia,
        },
        {
          href: withLocale("/admin/collections/contact-submissions", locale),
          icon: <Mail size={16} />,
          label: isEn ? "Inbox Messages" : "Pesan Masuk",
          visible: ["admin", "super_admin"].includes(role),
        },
      ].filter((item) => item.visible),
    [canCreateContent, canManageMedia, canReviewContent, isEn, locale, role],
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

  const subtitle = isEn
    ? "Easily manage your website pages, news articles, and visitor messages without technical complexity."
    : "Kelola halaman, tulisan berita, dan pesan website Anda dengan mudah tanpa perlu keahlian teknis.";

  return (
    <main className="mwc-dashboard">
      <div className="mwc-dashboard__canvas">
        {/* Welcome Header */}
        <header className="mwc-dashboard__header">
          <div className="mwc-dashboard__header-left">
            <span className="mwc-dashboard__tag">
              <Sparkles size={13} style={{ color: "#2563eb" }} />
              <span>PT Mahaga Widya Cita CMS</span>
            </span>
            <h1>{greeting}</h1>
            <p>{subtitle}</p>
          </div>
          <div className="mwc-dashboard__header-right">
            <button
              type="button"
              className="mwc-header-btn mwc-header-btn--help"
              onClick={() => setIsHelpModalOpen(true)}
              title={isEn ? "Open Beginner Guide" : "Buka Panduan Bantuan"}
            >
              <HelpCircle size={16} />
              <span>{isEn ? "Beginner Guide" : "Panduan Bantuan"}</span>
            </button>
            <a className="mwc-header-btn mwc-header-btn--site" href={`/${locale}`} target="_blank" rel="noreferrer">
              <ExternalLink size={16} />
              <span>{isEn ? "View Website" : "Lihat Website"}</span>
            </a>
          </div>
        </header>

        {/* Action Buttons Bar */}
        <nav className="mwc-actions" aria-label={isEn ? "Quick actions" : "Aksi cepat"}>
          {actionItems.map((item) => (
            <a
              className={item.primary ? "mwc-action mwc-action--primary" : "mwc-action"}
              href={item.href}
              key={item.href}
            >
              {item.icon}
              {item.label}
            </a>
          ))}
          <button
            type="button"
            className="mwc-action"
            onClick={() => setIsImportModalOpen(true)}
            style={{ cursor: "pointer" }}
            hidden={!canCreateContent}
          >
            <LinkIcon size={15} />
            {isEn ? "Import Journal (OJS)" : "Impor Jurnal (Link OJS)"}
          </button>
        </nav>
        <ImportJournalModal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} isEn={isEn} />
        <HelpCenterModal isOpen={isHelpModalOpen} onClose={() => setIsHelpModalOpen(false)} />

        {/* Panduan Singkat Pemula (3 Langkah Mudah) */}
        <section className="mwc-quick-guide" aria-label={isEn ? "Quick guide for beginners" : "Panduan singkat pemula"}>
          <div className="mwc-quick-guide__top">
            <div className="mwc-quick-guide__title-wrap">
              <span className="mwc-quick-guide__bulb">💡</span>
              <div>
                <h3>{isEn ? "3 Easy Steps to Manage Website" : "3 Langkah Mudah Mengelola Website"}</h3>
                <p>
                  {isEn
                    ? "Safe, intuitive, and foolproof. Follow these simple steps:"
                    : "Sangat mudah dan aman. Ikuti 3 langkah berikut untuk mengupdate website:"}
                </p>
              </div>
            </div>
            <button type="button" className="mwc-quick-guide__btn-link" onClick={() => setIsHelpModalOpen(true)}>
              {isEn ? "View FAQ & Interactive Tour →" : "Buka Tanya Jawab (FAQ) & Tutorial →"}
            </button>
          </div>
          <div className="mwc-quick-guide__steps">
            <div className="mwc-quick-guide__step">
              <span className="mwc-quick-guide__num">1</span>
              <div>
                <strong>{isEn ? "1. Select Section" : "1. Pilih Bagian Halaman"}</strong>
                <p>
                  {isEn
                    ? "Click any card in the control center below for the page you want to update."
                    : "Klik salah satu kartu di bawah sesuai bagian halaman yang ingin Anda perbarui."}
                </p>
              </div>
            </div>
            <div className="mwc-quick-guide__step">
              <span className="mwc-quick-guide__num">2</span>
              <div>
                <strong>{isEn ? "2. Edit Text or Photo" : "2. Ubah Tulisan atau Foto"}</strong>
                <p>
                  {isEn
                    ? "Type your new text or upload images. Each field includes clear dimension guides."
                    : "Ketik teks baru atau upload gambar. Setiap kolom sudah dilengkapi petunjuk ukuran."}
                </p>
              </div>
            </div>
            <div className="mwc-quick-guide__step">
              <span className="mwc-quick-guide__num">3</span>
              <div>
                <strong>{isEn ? "3. Save (Done!)" : "3. Klik Simpan (Selesai!)"}</strong>
                <p>
                  {isEn
                    ? "Click the blue 'Save' button at the bottom right. All changes are securely saved!"
                    : "Klik tombol biru 'Simpan' di pojok kanan bawah. Perubahan otomatis aman tersimpan!"}
                </p>
              </div>
            </div>
          </div>
          <div className="mwc-quick-guide__bottom">
            <span>
              🛡️{" "}
              {isEn
                ? "Worry-free editing: You can always use the 'Preview' button to check the live design before publishing."
                : "Bebas rasa khawatir: Tersedia tombol 'Pratinjau' (Preview) untuk melihat hasil tampilan sebelum dipublikasikan ke publik."}
            </span>
          </div>
        </section>

        {/* Pusat Kendali Halaman & Konten (8 Visual Cards) */}
        <section
          className="mwc-control-hub"
          aria-label={isEn ? "Website Pages Control Center" : "Pusat Kendali Halaman Website"}
        >
          <div className="mwc-control-hub__header">
            <div>
              <p className="mwc-eyebrow">{isEn ? "CLICK TO EDIT" : "KLIK UNTUK MENGEDIT LANGSUNG"}</p>
              <h2>{isEn ? "Website Pages & Content Center" : "Pusat Kendali Halaman & Konten"}</h2>
              <p className="mwc-control-hub__subtitle">
                {isEn
                  ? "Select the page or content you want to edit. Direct 1-click access without searching through menus."
                  : "Pilih bagian tampilan website yang ingin Anda ubah. Langsung klik kartu di bawah tanpa perlu bingung mencari di menu samping."}
              </p>
            </div>
          </div>

          <div className="mwc-control-hub__grid">
            {/* 1. Beranda */}
            <a href={withLocale("/admin/globals/beranda", locale)} className="mwc-hub-card mwc-hub-card--blue">
              <div className="mwc-hub-card__top">
                <span className="mwc-hub-card__icon">
                  <Home size={22} strokeWidth={2.2} />
                </span>
                <span className="mwc-hub-card__badge">{isEn ? "Landing Page" : "Halaman Utama"}</span>
              </div>
              <h3>{isEn ? "Homepage (Beranda)" : "Halaman Beranda (Depan)"}</h3>
              <p>
                {isEn
                  ? "Edit banner hero message, statistics, partner logos, and call-to-action."
                  : "Ubah tulisan banner depan, angka statistik prestasi, logo mitra kerja, dan tombol ajakan."}
              </p>
              <div className="mwc-hub-card__action">
                <span>{isEn ? "Edit Homepage" : "Edit Tampilan Beranda"}</span>
                <ArrowRight size={15} strokeWidth={2.5} />
              </div>
            </a>

            {/* 2. Tentang Kami */}
            <a href={withLocale("/admin/globals/tentang-kami", locale)} className="mwc-hub-card mwc-hub-card--indigo">
              <div className="mwc-hub-card__top">
                <span className="mwc-hub-card__icon">
                  <Building2 size={22} strokeWidth={2.2} />
                </span>
                <span className="mwc-hub-card__badge">{isEn ? "About Us" : "Profil Korporat"}</span>
              </div>
              <h3>{isEn ? "About Us & Profile" : "Tentang Kami & Profil"}</h3>
              <p>
                {isEn
                  ? "Update vision, mission, corporate profile, core values, and CEO statement."
                  : "Kelola visi-misi, sejarah singkat, profil korporat, nilai inti, dan pesan direktur."}
              </p>
              <div className="mwc-hub-card__action">
                <span>{isEn ? "Edit Profile" : "Edit Tentang Kami"}</span>
                <ArrowRight size={15} strokeWidth={2.5} />
              </div>
            </a>

            {/* 3. Layanan */}
            <a href={withLocale("/admin/collections/services", locale)} className="mwc-hub-card mwc-hub-card--purple">
              <div className="mwc-hub-card__top">
                <span className="mwc-hub-card__icon">
                  <Briefcase size={22} strokeWidth={2.2} />
                </span>
                <span className="mwc-hub-card__badge">{isEn ? "Services" : "Layanan"}</span>
              </div>
              <h3>{isEn ? "Consulting Services" : "Layanan Konsultasi"}</h3>
              <p>
                {isEn
                  ? "Manage consulting areas, features, benefits, and service descriptions."
                  : "Tambah & kelola bidang layanan konsultasi, fitur keunggulan, dan penjelasan paket layanan."}
              </p>
              <div className="mwc-hub-card__action">
                <span>{isEn ? "Manage Services" : "Kelola Layanan"}</span>
                <ArrowRight size={15} strokeWidth={2.5} />
              </div>
            </a>

            {/* 4. Tim Ahli */}
            <a
              href={withLocale("/admin/collections/team-members", locale)}
              className="mwc-hub-card mwc-hub-card--emerald"
            >
              <div className="mwc-hub-card__top">
                <span className="mwc-hub-card__icon">
                  <Users size={22} strokeWidth={2.2} />
                </span>
                <span className="mwc-hub-card__badge">{isEn ? "Team" : "Profil Tim"}</span>
              </div>
              <h3>{isEn ? "Expert Team & Board" : "Tim Ahli & Manajemen"}</h3>
              <p>
                {isEn
                  ? "Add or update team profile photos, titles, biographies, and expertise."
                  : "Tambah atau perbarui pas foto profil, gelar, jabatan, biografi, dan keahlian anggota tim."}
              </p>
              <div className="mwc-hub-card__action">
                <span>{isEn ? "Manage Team" : "Kelola Anggota Tim"}</span>
                <ArrowRight size={15} strokeWidth={2.5} />
              </div>
            </a>

            {/* 5. Kontak */}
            <a href={withLocale("/admin/globals/kontak", locale)} className="mwc-hub-card mwc-hub-card--amber">
              <div className="mwc-hub-card__top">
                <span className="mwc-hub-card__icon">
                  <PhoneCall size={22} strokeWidth={2.2} />
                </span>
                <span className="mwc-hub-card__badge">{isEn ? "Contact" : "Informasi Kontak"}</span>
              </div>
              <h3>{isEn ? "Contact & Location" : "Kontak & Alamat Kantor"}</h3>
              <p>
                {isEn
                  ? "Update WhatsApp number, official email, office address, and Google Maps."
                  : "Ubah nomor WhatsApp, email kantor, nomor telepon, alamat gedung, dan peta Google Maps."}
              </p>
              <div className="mwc-hub-card__action">
                <span>{isEn ? "Edit Contact" : "Ubah Kontak & Alamat"}</span>
                <ArrowRight size={15} strokeWidth={2.5} />
              </div>
            </a>

            {/* 6. Artikel & Berita */}
            <a href={withLocale("/admin/collections/articles", locale)} className="mwc-hub-card mwc-hub-card--rose">
              <div className="mwc-hub-card__top">
                <span className="mwc-hub-card__icon">
                  <PenSquare size={22} strokeWidth={2.2} />
                </span>
                <span className="mwc-hub-card__badge">{isEn ? "Articles" : "Publikasi Berita"}</span>
              </div>
              <h3>{isEn ? "Articles & News" : "Artikel & Berita Kegiatan"}</h3>
              <p>
                {isEn
                  ? "Create news articles with banner cover and multi-photo documentation gallery."
                  : "Tulis rilis berita resmi lengkap dengan foto sampul dan album galeri dokumentasi kegiatan."}
              </p>
              <div className="mwc-hub-card__action">
                <span>{isEn ? "Manage Articles" : "Buka Daftar Artikel"}</span>
                <ArrowRight size={15} strokeWidth={2.5} />
              </div>
            </a>

            {/* 7. Jurnal Ilmiah */}
            <a href={withLocale("/admin/collections/journals", locale)} className="mwc-hub-card mwc-hub-card--cyan">
              <div className="mwc-hub-card__top">
                <span className="mwc-hub-card__icon">
                  <BookOpen size={22} strokeWidth={2.2} />
                </span>
                <span className="mwc-hub-card__badge">{isEn ? "Journals" : "Karya Ilmiah"}</span>
              </div>
              <h3>{isEn ? "Scientific Journals" : "Jurnal & Riset Publikasi"}</h3>
              <p>
                {isEn
                  ? "Manage scientific publications, DOI metadata, PDF documents, and OJS imports."
                  : "Kelola publikasi karya ilmiah, nomor DOI, berkas PDF dokumen, dan impor dari link OJS."}
              </p>
              <div className="mwc-hub-card__action">
                <span>{isEn ? "Manage Journals" : "Kelola Jurnal"}</span>
                <ArrowRight size={15} strokeWidth={2.5} />
              </div>
            </a>

            {/* 8. Pesan Masuk */}
            <a
              href={withLocale("/admin/collections/contact-submissions", locale)}
              className="mwc-hub-card mwc-hub-card--orange"
            >
              <div className="mwc-hub-card__top">
                <span className="mwc-hub-card__icon">
                  <Mail size={22} strokeWidth={2.2} />
                </span>
                <span className="mwc-hub-card__badge">{isEn ? "Inbox" : "Pesan Masuk"}</span>
              </div>
              <h3>{isEn ? "Visitor Inbox Messages" : "Pesan Masuk Pengunjung"}</h3>
              <p>
                {isEn
                  ? "View inquiries, collaboration offers, and messages sent via the contact form."
                  : "Lihat pesan pertanyaan, tawaran kerjasama, dan kontak yang dikirim pengunjung website."}
              </p>
              <div className="mwc-hub-card__action">
                <span>{isEn ? "View Messages" : "Buka Pesan Masuk"}</span>
                <ArrowRight size={15} strokeWidth={2.5} />
              </div>
            </a>
          </div>
        </section>

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

        {/* Ringkasan Singkat Website (4 Clean Metric Cards) */}
        <section className="mwc-metrics" aria-label={isEn ? "Content summary" : "Ringkasan konten"}>
          <MetricCard
            detail={
              data
                ? `${data.stats.articles.published} ${isEn ? "published" : "terbit"} · ${data.stats.articles.draft} draft`
                : isEn
                  ? "Loading..."
                  : "Memuat..."
            }
            href={withLocale("/admin/collections/articles", locale)}
            icon="article"
            label={isEn ? "Articles & News" : "Artikel Berita"}
            loading={loading}
            value={data?.stats.articles.total}
          />
          <MetricCard
            detail={
              data
                ? `${data.stats.journals.published} ${isEn ? "published" : "terbit"} · ${data.stats.journals.draft} draft`
                : isEn
                  ? "Loading..."
                  : "Memuat..."
            }
            href={withLocale("/admin/collections/journals", locale)}
            icon="menu_book"
            label={isEn ? "Scientific Journals" : "Jurnal Ilmiah"}
            loading={loading}
            tone="purple"
            value={data?.stats.journals.total}
          />
          <MetricCard
            detail={
              data
                ? `${data.stats.contacts.recentCount} ${isEn ? "new in 30 days" : "baru 30 hari ini"}`
                : isEn
                  ? "Loading..."
                  : "Memuat..."
            }
            href={withLocale("/admin/collections/contact-submissions", locale)}
            icon="mail"
            label={isEn ? "Visitor Messages" : "Pesan Masuk Formulir"}
            loading={loading}
            tone="amber"
            value={data?.stats.contacts.total}
          />
          <MetricCard
            detail={
              data
                ? `${data.stats.media.total} ${isEn ? "files in gallery" : "file di galeri"}`
                : isEn
                  ? "Loading..."
                  : "Memuat..."
            }
            href={withLocale("/admin/collections/media", locale)}
            icon="perm_media"
            label={isEn ? "Photos & Media" : "Galeri Foto & Media"}
            loading={loading}
            tone="slate"
            value={data?.stats.media.total}
          />
        </section>

        {/* Technical / Advanced Details Collapsible (Accordion) */}
        {data && !error && (
          <details className="mwc-advanced-details">
            <summary className="mwc-advanced-details__summary">
              <div className="mwc-advanced-details__summary-left">
                <span className="material-symbols-outlined" style={{ fontSize: "20px", color: "#64748b" }}>
                  settings_suggest
                </span>
                <span className="mwc-advanced-details__title">
                  {isEn
                    ? "Advanced System Status, AI Translation Queue & Activity Timeline"
                    : "Rincian Teknis: Status Terjemahan AI & Riwayat Aktivitas"}
                </span>
                <span className="mwc-advanced-details__hint">
                  {isEn ? "(Click to expand)" : "(Klik untuk membuka rincian teknis)"}
                </span>
              </div>
              <span className="mwc-advanced-details__badge">
                {data.stats.translations.needsReview +
                  data.stats.translations.needsUpdate +
                  data.stats.translations.failed >
                0 ? (
                  <span style={{ color: "#b45309", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                    ⚠️ {isEn ? "Attention required" : "Perlu perhatian"}
                  </span>
                ) : (
                  <span style={{ color: "#166534", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                    <CheckCircle2 size={14} /> {isEn ? "All Synced & Translated" : "Semua Tersinkron Otomatis"}
                  </span>
                )}
              </span>
            </summary>

            <div className="mwc-advanced-details__body">
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
            </div>
          </details>
        )}
      </div>
    </main>
  );
};
