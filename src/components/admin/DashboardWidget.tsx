"use client"
import React, { useEffect, useState } from 'react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

// ─── Types ────────────────────────────────────────────────────────────────────

type Stats = {
  articles: { total: number; published: number; draft: number }
  users: { total: number }
  subscribers: { total: number; recentCount: number }
  media: { total: number }
  contacts: { total: number; recentCount: number }
}

type ActivityItem = {
  type: 'article' | 'contact' | 'subscriber' | 'media'
  label: string
  detail: string
  time: string
  link: string
}

type WeeklyChartData = {
  name: string
  articles: number
  contacts: number
  subscribers: number
  media: number
}

type DashboardData = {
  stats: Stats
  recentActivity: ActivityItem[]
  weeklyChartData: WeeklyChartData[]
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = {
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    minHeight: '100vh',
    backgroundColor: '#faf8ff',
    color: '#191b23',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontSize: '14px',
    lineHeight: '20px',
    margin: '-20px -20px 0 -20px',
    padding: 0,
  },
  contentCanvas: {
    flex: 1,
    overflowY: 'auto' as const,
    padding: '32px',
  },
  welcomeSection: {
    marginBottom: '32px',
  },
  welcomeTitle: {
    fontSize: '30px',
    lineHeight: '38px',
    fontWeight: 700,
    letterSpacing: '-0.02em',
    color: '#191b23',
    margin: '0 0 8px 0',
    fontFamily: 'Inter, sans-serif',
  },
  welcomeSubtitle: {
    fontSize: '16px',
    lineHeight: '24px',
    fontWeight: 400,
    color: '#434655',
    margin: 0,
  },
  quickActions: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '16px',
    marginBottom: '40px',
  },
  btnPrimary: {
    padding: '10px 24px',
    background: 'linear-gradient(to right, #004ac6, #1d4ed8)',
    color: '#ffffff',
    borderRadius: '8px',
    border: 'none',
    fontSize: '12px',
    lineHeight: '16px',
    letterSpacing: '0.05em',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    textDecoration: 'none',
    fontFamily: 'Inter, sans-serif',
  },
  btnOutline: {
    padding: '10px 24px',
    backgroundColor: '#ffffff',
    color: '#004ac6',
    borderRadius: '8px',
    border: '1px solid #c3c6d7',
    fontSize: '12px',
    lineHeight: '16px',
    letterSpacing: '0.05em',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    textDecoration: 'none',
    fontFamily: 'Inter, sans-serif',
  },
  bentoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '24px',
    marginBottom: '24px',
  },
  statCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #c3c6d7',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'space-between',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  },
  statHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px',
  },
  statLabel: {
    fontSize: '11px',
    lineHeight: '14px',
    fontWeight: 500,
    color: '#434655',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    margin: 0,
  },
  statValue: {
    fontSize: '28px',
    lineHeight: '36px',
    fontWeight: 700,
    color: '#191b23',
    marginTop: '6px',
  },
  statSub: {
    fontSize: '11px',
    color: '#6b7280',
    marginTop: '4px',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 8px',
    borderRadius: '9999px',
    backgroundColor: '#f0fdf4',
    color: '#15803d',
    fontSize: '11px',
    lineHeight: '14px',
    fontWeight: 500,
  },
  badgeNeutral: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 8px',
    borderRadius: '9999px',
    backgroundColor: '#eff6ff',
    color: '#1d4ed8',
    fontSize: '11px',
    lineHeight: '14px',
    fontWeight: 500,
  },
  sparklineContainer: {
    height: '60px',
    width: '100%',
    marginTop: '8px',
  },
  skeletonBlock: {
    backgroundColor: '#e1e2ed',
    borderRadius: '6px',
    animation: 'pulse 1.5s ease-in-out infinite',
  },
  chartsGrid: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '24px',
  },
  chartCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #c3c6d7',
    borderRadius: '12px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
    padding: '24px',
  },
  chartHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '16px',
    marginBottom: '24px',
  },
  chartTitle: {
    fontSize: '16px',
    lineHeight: '24px',
    fontWeight: 600,
    color: '#191b23',
    margin: 0,
  },
  chartArea: {
    height: '300px',
    width: '100%',
  },
  activityCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #c3c6d7',
    borderRadius: '12px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column' as const,
  },
  activityHeader: {
    borderBottom: '1px solid #c3c6d7',
    paddingBottom: '16px',
    marginBottom: '16px',
  },
  activityList: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '14px',
  },
  activityItem: {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start',
  },
  activityIcon: (bg: string, color: string) => ({
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: bg,
    color: color,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: '2px',
  }),
  activityText: {
    fontSize: '13px',
    lineHeight: '18px',
    color: '#191b23',
    margin: 0,
  },
  activityTime: {
    fontSize: '11px',
    lineHeight: '14px',
    fontWeight: 500,
    color: '#9ca3af',
    marginTop: '2px',
  },
  viewAllBtn: {
    width: '100%',
    marginTop: '16px',
    padding: '8px',
    textAlign: 'center' as const,
    color: '#004ac6',
    fontSize: '12px',
    lineHeight: '16px',
    letterSpacing: '0.05em',
    fontWeight: 600,
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontFamily: 'Inter, sans-serif',
    textDecoration: 'none',
    display: 'block',
  },
  iconSmall: {
    fontFamily: 'Material Symbols Outlined',
    fontWeight: 400,
    fontStyle: 'normal',
    fontSize: '14px',
    lineHeight: 1,
    letterSpacing: 'normal',
    textTransform: 'none' as const,
    display: 'inline-block',
    whiteSpace: 'nowrap' as const,
    wordWrap: 'normal' as const,
    direction: 'ltr' as const,
    fontFeatureSettings: '"liga"',
    WebkitFontSmoothing: 'antialiased',
  },
  iconMedium: {
    fontFamily: 'Material Symbols Outlined',
    fontWeight: 400,
    fontStyle: 'normal',
    fontSize: '18px',
    lineHeight: 1,
    letterSpacing: 'normal',
    textTransform: 'none' as const,
    display: 'inline-block',
    whiteSpace: 'nowrap' as const,
    wordWrap: 'normal' as const,
    direction: 'ltr' as const,
    fontFeatureSettings: '"liga"',
    WebkitFontSmoothing: 'antialiased',
  },
  iconLarge: {
    fontFamily: 'Material Symbols Outlined',
    fontWeight: 400,
    fontStyle: 'normal',
    fontSize: '16px',
    lineHeight: 1,
    letterSpacing: 'normal',
    textTransform: 'none' as const,
    display: 'inline-block',
    whiteSpace: 'nowrap' as const,
    wordWrap: 'normal' as const,
    direction: 'ltr' as const,
    fontFeatureSettings: '"liga"',
    WebkitFontSmoothing: 'antialiased',
  },
  outlineIcon: {
    fontFamily: 'Material Symbols Outlined',
    fontWeight: 400,
    fontStyle: 'normal',
    fontSize: '24px',
    lineHeight: 1,
    letterSpacing: 'normal',
    textTransform: 'none' as const,
    display: 'inline-block',
    whiteSpace: 'nowrap' as const,
    wordWrap: 'normal' as const,
    direction: 'ltr' as const,
    fontFeatureSettings: '"liga"',
    WebkitFontSmoothing: 'antialiased',
    color: '#c3c6d7',
  },
} as const

const cssAnimation = `
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  .recharts-tooltip-cursor {
    fill: #f3f4f8;
  }
`

// ─── Helpers ──────────────────────────────────────────────────────────────────

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(mins / 60)
  const days = Math.floor(hours / 24)
  if (mins < 2) return 'Baru saja'
  if (mins < 60) return `${mins} menit lalu`
  if (hours < 24) return `${hours} jam lalu`
  if (days < 7) return `${days} hari lalu`
  return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
}

function activityConfig(type: ActivityItem['type']): { bg: string; color: string; icon: string } {
  switch (type) {
    case 'article': return { bg: '#b4c5ff', color: '#004ac6', icon: 'edit_document' }
    case 'contact': return { bg: '#fef3c7', color: '#b45309', icon: 'mail' }
    case 'subscriber': return { bg: '#dcfce7', color: '#15803d', icon: 'person_add' }
    case 'media': return { bg: '#e1e2ed', color: '#434655', icon: 'image' }
  }
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e4e6ee',
        padding: '12px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        fontSize: '12px'
      }}>
        <p style={{ margin: '0 0 8px 0', fontWeight: 600, color: '#191b23' }}>{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ margin: '4px 0', color: entry.color, fontWeight: 500 }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function SkeletonStatCard() {
  return (
    <div style={styles.statCard}>
      <div style={styles.statHeader}>
        <div>
          <div style={{ ...styles.skeletonBlock, width: '80px', height: '12px', marginBottom: '10px' }} />
          <div style={{ ...styles.skeletonBlock, width: '60px', height: '28px' }} />
        </div>
        <div style={{ ...styles.skeletonBlock, width: '50px', height: '22px', borderRadius: '9999px' }} />
      </div>
      <div style={{ ...styles.skeletonBlock, width: '100%', height: '40px' }} />
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export const DashboardWidget: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [greeting, setGreeting] = useState('Selamat Datang')

  useEffect(() => {
    // Load fonts
    const materialId = 'material-symbols-font'
    if (!document.getElementById(materialId)) {
      const link = document.createElement('link')
      link.id = materialId
      link.rel = 'stylesheet'
      link.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap'
      document.head.appendChild(link)
    }
    const interId = 'inter-font'
    if (!document.getElementById(interId)) {
      const link = document.createElement('link')
      link.id = interId
      link.rel = 'stylesheet'
      link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
      document.head.appendChild(link)
    }

    // Dynamic greeting
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Selamat Pagi')
    else if (hour < 15) setGreeting('Selamat Siang')
    else if (hour < 18) setGreeting('Selamat Sore')
    else setGreeting('Selamat Malam')

    // Fetch dashboard stats
    fetch('/api/admin/dashboard-stats')
      .then(r => r.json())
      .then((json: DashboardData) => {
        setData(json)
        setLoading(false)
      })
      .catch(() => {
        setError(true)
        setLoading(false)
      })
  }, [])

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: cssAnimation }} />
      <main style={styles.main}>
        <div style={styles.contentCanvas}>

          {/* Welcome */}
          <div style={styles.welcomeSection}>
            <h2 style={styles.welcomeTitle}>{greeting}, Admin 👋</h2>
            <p style={styles.welcomeSubtitle}>
              {loading
                ? 'Memuat data dashboard...'
                : error
                  ? 'Tidak dapat memuat data. Cek koneksi atau server.'
                  : `Ada ${data?.stats.contacts.recentCount ?? 0} pesan kontak baru dalam 30 hari terakhir.`}
            </p>
          </div>

          {/* Quick Actions */}
          <div style={styles.quickActions}>
            <a href="/admin/collections/articles/create" style={styles.btnPrimary}>
              <span style={styles.iconMedium}>post_add</span>
              Artikel Baru
            </a>
            <a href="/admin/collections/users/create" style={styles.btnPrimary}>
              <span style={styles.iconMedium}>person_add</span>
              User Baru
            </a>
            <a href="/admin/collections/contact-submissions" style={styles.btnOutline}>
              <span style={styles.iconMedium}>mail</span>
              Lihat Pesan Kontak
            </a>
            <a href="/admin/collections/subscribers" style={styles.btnOutline}>
              <span style={styles.iconMedium}>people</span>
              Subscriber
            </a>
            <a href="/admin/collections/media/create" style={styles.btnOutline}>
              <span style={styles.iconMedium}>upload_file</span>
              Upload Media
            </a>
          </div>

          {/* Stat Cards */}
          <div style={styles.bentoGrid}>
            {loading || !data ? (
              <>
                <SkeletonStatCard />
                <SkeletonStatCard />
                <SkeletonStatCard />
                <SkeletonStatCard />
              </>
            ) : (
              <>
                {/* Articles */}
                <div style={styles.statCard}>
                  <div style={styles.statHeader}>
                    <div>
                      <p style={styles.statLabel}>Total Artikel</p>
                      <h3 style={styles.statValue}>{data.stats.articles.total}</h3>
                      <p style={styles.statSub}>
                        {data.stats.articles.published} Published · {data.stats.articles.draft} Draft
                      </p>
                    </div>
                    <span style={styles.badge}>
                      <span style={styles.iconSmall}>article</span>
                      Artikel
                    </span>
                  </div>
                  <div style={styles.sparklineContainer}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={data.weeklyChartData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorArticles" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#004ac6" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#004ac6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <Tooltip content={<CustomTooltip />} cursor={false} />
                        <Area type="monotone" dataKey="articles" stroke="#004ac6" fillOpacity={1} fill="url(#colorArticles)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Contacts */}
                <div style={styles.statCard}>
                  <div style={styles.statHeader}>
                    <div>
                      <p style={styles.statLabel}>Pesan Kontak</p>
                      <h3 style={styles.statValue}>{data.stats.contacts.total}</h3>
                      <p style={styles.statSub}>{data.stats.contacts.recentCount} baru 30 hari ini</p>
                    </div>
                    <span style={styles.badgeNeutral}>
                      <span style={styles.iconSmall}>mail</span>
                      Baru
                    </span>
                  </div>
                  <div style={styles.sparklineContainer}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={data.weeklyChartData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorContacts" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <Tooltip content={<CustomTooltip />} cursor={false} />
                        <Area type="monotone" dataKey="contacts" stroke="#f59e0b" fillOpacity={1} fill="url(#colorContacts)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Subscribers */}
                <div style={styles.statCard}>
                  <div style={styles.statHeader}>
                    <div>
                      <p style={styles.statLabel}>Subscribers</p>
                      <h3 style={styles.statValue}>{data.stats.subscribers.total}</h3>
                      <p style={styles.statSub}>{data.stats.subscribers.recentCount} baru 30 hari ini</p>
                    </div>
                    <span style={styles.badge}>
                      <span style={styles.iconSmall}>trending_up</span>
                      Aktif
                    </span>
                  </div>
                  <div style={styles.sparklineContainer}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={data.weeklyChartData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorSubs" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <Tooltip content={<CustomTooltip />} cursor={false} />
                        <Area type="monotone" dataKey="subscribers" stroke="#10b981" fillOpacity={1} fill="url(#colorSubs)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Media */}
                <div style={styles.statCard}>
                  <div style={styles.statHeader}>
                    <div>
                      <p style={styles.statLabel}>Media Files</p>
                      <h3 style={styles.statValue}>{data.stats.media.total}</h3>
                      <p style={styles.statSub}>{data.stats.users.total} admin users</p>
                    </div>
                    <span style={styles.outlineIcon}>perm_media</span>
                  </div>
                  <div style={styles.sparklineContainer}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={data.weeklyChartData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorMedia" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#64748b" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#64748b" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <Tooltip content={<CustomTooltip />} cursor={false} />
                        <Area type="monotone" dataKey="media" stroke="#64748b" fillOpacity={1} fill="url(#colorMedia)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Charts & Activity */}
          <div style={styles.chartsGrid}>
            {/* Weekly Articles Chart */}
            <div style={styles.chartCard}>
              <div style={styles.chartHeader}>
                <h3 style={styles.chartTitle}>Grafik Pertumbuhan</h3>
                <span style={{ fontSize: '12px', color: '#9ca3af' }}>4 minggu terakhir</span>
              </div>
              <div style={styles.chartArea}>
                {loading || !data ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#9ca3af' }}>
                    Memuat data chart...
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.weeklyChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorArticlesMain" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#004ac6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#004ac6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e6ee" />
                      <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#7a7e90' }} axisLine={false} tickLine={false} dy={10} />
                      <YAxis tick={{ fontSize: 11, fill: '#7a7e90' }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area 
                        type="monotone" 
                        dataKey="articles" 
                        name="Artikel" 
                        stroke="#004ac6" 
                        fillOpacity={1} 
                        fill="url(#colorArticlesMain)" 
                        strokeWidth={3} 
                        activeDot={{ r: 6, strokeWidth: 0, fill: '#004ac6' }} 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Recent Activity */}
            <div style={styles.activityCard}>
              <div style={styles.activityHeader}>
                <h3 style={styles.chartTitle}>Aktivitas Terbaru</h3>
              </div>
              <div style={styles.activityList}>
                {loading ? (
                  [0, 1, 2, 3].map(i => (
                    <div key={i} style={styles.activityItem}>
                      <div style={{ ...styles.skeletonBlock, width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ ...styles.skeletonBlock, width: '80%', height: '12px', marginBottom: '6px' }} />
                        <div style={{ ...styles.skeletonBlock, width: '50%', height: '10px' }} />
                      </div>
                    </div>
                  ))
                ) : !data || data.recentActivity.length === 0 ? (
                  <div style={{ color: '#9ca3af', fontSize: '13px', textAlign: 'center', padding: '24px 0' }}>
                    Belum ada aktivitas tercatat.
                  </div>
                ) : (
                  data.recentActivity.map((item, idx) => {
                    const cfg = activityConfig(item.type)
                    return (
                      <a key={idx} href={item.link} style={{ textDecoration: 'none' }}>
                        <div style={styles.activityItem}>
                          <div style={styles.activityIcon(cfg.bg, cfg.color)}>
                            <span style={styles.iconLarge}>{cfg.icon}</span>
                          </div>
                          <div>
                            <p style={styles.activityText}>
                              <span style={{ fontWeight: 600 }}>{item.label}</span>{' '}
                              <span style={{ color: '#6b7280' }}>{item.detail}</span>
                            </p>
                            <div style={styles.activityTime}>{timeAgo(item.time)}</div>
                          </div>
                        </div>
                      </a>
                    )
                  })
                )}
              </div>
              <a href="/admin/collections/articles" style={styles.viewAllBtn}>
                Lihat Semua Aktivitas →
              </a>
            </div>
          </div>

        </div>
      </main>
    </>
  )
}
