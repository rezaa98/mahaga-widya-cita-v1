'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

type Stats = {
  articles: { total: number; published: number; draft: number }
  journals: { total: number; published: number; draft: number }
  users: { total: number }
  subscribers: { total: number; recentCount: number }
  media: { total: number }
  contacts: { total: number; recentCount: number }
}

type ActivityItem = { type: 'article' | 'journal' | 'contact' | 'subscriber' | 'media'; label: string; detail: string; time: string; link: string }
type WeeklyChartData = { name: string; articles: number; journals: number; contacts: number; subscribers: number; media: number }
type DashboardData = { stats: Stats; recentActivity: ActivityItem[]; weeklyChartData: WeeklyChartData[] }

const icons: Record<ActivityItem['type'], string> = { article: 'article', journal: 'menu_book', contact: 'mail', subscriber: 'person_add', media: 'image' }
const actionItems = [
  { href: '/admin/collections/articles/create', icon: 'post_add', label: 'Artikel Baru', primary: true },
  { href: '/admin/collections/journals/create', icon: 'note_add', label: 'Jurnal Baru', primary: true },
  { href: '/admin/collections/media/create', icon: 'upload_file', label: 'Upload Media' },
  { href: '/admin/collections/contact-submissions', icon: 'mail', label: 'Pesan Masuk' },
]

function timeAgo(value: string) {
  const minutes = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 60000))
  if (minutes < 2) return 'Baru saja'
  if (minutes < 60) return `${minutes} menit lalu`
  if (minutes < 1440) return `${Math.floor(minutes / 60)} jam lalu`
  if (minutes < 10080) return `${Math.floor(minutes / 1440)} hari lalu`
  return new Date(value).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
}

function Icon({ children }: { children: string }) { return <span aria-hidden className="material-symbols-outlined mwc-dashboard__icon">{children}</span> }

function MetricCard({ label, value, detail, href, icon, tone = 'blue', loading }: { label: string; value?: number; detail: string; href: string; icon: string; tone?: string; loading: boolean }) {
  return <a className={`mwc-metric mwc-metric--${tone}`} href={href} aria-label={`Buka ${label}`}>
    <span className="mwc-metric__icon"><Icon>{icon}</Icon></span>
    <span className="mwc-metric__body"><span className="mwc-metric__label">{label}</span><strong className={loading ? 'mwc-skeleton mwc-metric__value' : 'mwc-metric__value'}>{loading ? '' : value}</strong><small>{detail}</small></span>
  </a>
}

function AttentionPanel({ data }: { data: DashboardData }) {
  const items = [
    { count: data.stats.articles.draft, label: 'artikel draft', href: '/admin/collections/articles?where[status][equals]=draft', icon: 'article' },
    { count: data.stats.journals.draft, label: 'jurnal draft', href: '/admin/collections/journals?where[status][equals]=draft', icon: 'menu_book' },
    { count: data.stats.contacts.recentCount, label: 'pesan baru', href: '/admin/collections/contact-submissions', icon: 'mail' },
  ].filter((item) => item.count > 0)
  return <section className="mwc-panel mwc-attention" aria-labelledby="attention-title"><div className="mwc-panel__heading"><div><p className="mwc-eyebrow">Prioritas</p><h2 id="attention-title">Perlu perhatian</h2></div><Icon>notifications</Icon></div>{items.length ? <div className="mwc-attention__list">{items.map((item) => <a href={item.href} key={item.label}><span className="mwc-attention__count">{item.count}</span><span><Icon>{item.icon}</Icon>{item.label}</span><Icon>chevron_right</Icon></a>)}</div> : <p className="mwc-empty">Tidak ada tindakan mendesak saat ini.</p>}</section>
}

function ActivityList({ data, loading }: { data: DashboardData | null; loading: boolean }) {
  return <section className="mwc-panel mwc-activity" aria-labelledby="activity-title"><div className="mwc-panel__heading"><div><p className="mwc-eyebrow">Timeline</p><h2 id="activity-title">Aktivitas terbaru</h2></div><a href="/admin/collections/articles">Lihat konten</a></div>{loading ? <div className="mwc-activity__list">{Array.from({ length: 4 }, (_, index) => <div className="mwc-activity__skeleton" key={index}><span className="mwc-skeleton" /><span><i className="mwc-skeleton" /><i className="mwc-skeleton" /></span></div>)}</div> : !data?.recentActivity.length ? <p className="mwc-empty">Belum ada aktivitas tercatat.</p> : <div className="mwc-activity__list">{data.recentActivity.map((item, index) => <a href={item.link} key={`${item.time}-${index}`}><span className={`mwc-activity__type mwc-activity__type--${item.type}`}><Icon>{icons[item.type]}</Icon></span><span><strong>{item.label}</strong><small>{item.detail}</small><time dateTime={item.time}>{timeAgo(item.time)}</time></span></a>)}</div>}</section>
}

export const DashboardClient: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [request, setRequest] = useState(0)
  const greeting = useMemo(() => {
    const hour = new Date().getHours()
    return hour < 12 ? 'Selamat pagi' : hour < 15 ? 'Selamat siang' : hour < 18 ? 'Selamat sore' : 'Selamat malam'
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true); setError(null)
    const load = async () => {
      try {
        const response = await fetch('/api/admin/dashboard-stats', { signal: controller.signal })
        if (!response.ok) throw new Error(`Dashboard tidak dapat dimuat (${response.status})`)
        const responseData = await response.json()
        if (!responseData?.stats || !Array.isArray(responseData?.weeklyChartData)) throw new Error('Format data dashboard tidak valid')
        setData(responseData as DashboardData)
      } catch (cause) {
        if (!controller.signal.aborted) setError(cause instanceof Error ? cause.message : 'Dashboard tidak dapat dimuat')
      } finally { if (!controller.signal.aborted) setLoading(false) }
    }
    void load()
    return () => controller.abort()
  }, [request])

  const subtitle = error ? 'Data belum tersedia. Silakan coba muat ulang.' : loading ? 'Menyiapkan ringkasan operasional Anda…' : data?.stats.contacts.recentCount ? `Ada ${data.stats.contacts.recentCount} pesan kontak baru dalam 30 hari terakhir.` : 'Ringkasan konten dan aktivitas website Anda.'
  return <main className="mwc-dashboard"><div className="mwc-dashboard__canvas"><header className="mwc-dashboard__header"><div><p className="mwc-eyebrow">Mahaga Widya Cita CMS</p><h1>{greeting}</h1><p>{subtitle}</p></div><a className="mwc-dashboard__site-link" href="/id" target="_blank" rel="noreferrer"><Icon>open_in_new</Icon>Lihat website</a></header>
    <nav className="mwc-actions" aria-label="Aksi cepat">{actionItems.map((item) => <a className={item.primary ? 'mwc-action mwc-action--primary' : 'mwc-action'} href={item.href} key={item.href}><Icon>{item.icon}</Icon>{item.label}</a>)}</nav>
    {error && <section className="mwc-dashboard__error" role="alert"><span><Icon>error</Icon>{error}</span><button onClick={() => setRequest((value) => value + 1)} type="button"><Icon>refresh</Icon>Coba lagi</button></section>}
    <section className="mwc-metrics" aria-label="Ringkasan konten"><MetricCard detail={data ? `${data.stats.articles.published} published · ${data.stats.articles.draft} draft` : 'Memuat status…'} href="/admin/collections/articles" icon="article" label="Artikel" loading={loading} value={data?.stats.articles.total} /><MetricCard detail={data ? `${data.stats.journals.published} published · ${data.stats.journals.draft} draft` : 'Memuat status…'} href="/admin/collections/journals" icon="menu_book" label="Jurnal" loading={loading} tone="purple" value={data?.stats.journals.total} /><MetricCard detail={data ? `${data.stats.contacts.recentCount} baru 30 hari ini` : 'Memuat status…'} href="/admin/collections/contact-submissions" icon="mail" label="Pesan kontak" loading={loading} tone="amber" value={data?.stats.contacts.total} /><MetricCard detail={data ? `${data.stats.media.total} file di library` : 'Memuat status…'} href="/admin/collections/media" icon="perm_media" label="Media" loading={loading} tone="slate" value={data?.stats.media.total} /></section>
    {data && !error && <section className="mwc-dashboard__content"><div className="mwc-dashboard__primary"><section className="mwc-panel mwc-chart"><div className="mwc-panel__heading"><div><p className="mwc-eyebrow">Publikasi</p><h2>Pertumbuhan konten</h2></div><span>4 minggu terakhir</span></div>{data.weeklyChartData.length ? <div className="mwc-chart__area"><ResponsiveContainer height="100%" width="100%"><AreaChart data={data.weeklyChartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}><defs><linearGradient id="mwc-content-growth" x1="0" x2="0" y1="0" y2="1"><stop offset="5%" stopColor="#2563eb" stopOpacity={0.28} /><stop offset="95%" stopColor="#2563eb" stopOpacity={0} /></linearGradient></defs><CartesianGrid stroke="#e4e6ee" strokeDasharray="3 3" vertical={false} /><XAxis axisLine={false} dataKey="name" tick={{ fill: '#687087', fontSize: 11 }} tickLine={false} /><YAxis allowDecimals={false} axisLine={false} tick={{ fill: '#687087', fontSize: 11 }} tickLine={false} /><Tooltip /><Area dataKey="articles" fill="url(#mwc-content-growth)" name="Artikel" stroke="#2563eb" strokeWidth={2.5} type="monotone" /><Area dataKey="journals" fill="none" name="Jurnal" stroke="#7c3aed" strokeWidth={2.5} type="monotone" /></AreaChart></ResponsiveContainer></div> : <p className="mwc-empty">Belum ada data pertumbuhan untuk ditampilkan.</p>}</section><ActivityList data={data} loading={loading} /></div><AttentionPanel data={data} /></section>}
  </div></main>
}
