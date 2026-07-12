"use client"
import React, { useEffect, useState } from 'react'

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

type DashboardData = {
  stats: Stats
  recentActivity: ActivityItem[]
  weeklyArticles: number[]
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
    height: '40px',
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
    borderBottom: '1px solid #c3c6d7',
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
    height: '256px',
    width: '100%',
    position: 'relative' as const,
  },
  chartGridLines: {
    position: 'absolute' as const,
    inset: 0,
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'space-between',
    paddingBottom: '32px',
  },
  gridLine: {
    borderBottom: '1px solid #e1e2ed',
    width: '100%',
    height: 0,
  },
  chartLabels: {
    position: 'absolute' as const,
    bottom: 0,
    left: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'space-around',
    fontSize: '11px',
    color: '#9ca3af',
    padding: '0 8px',
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
  @keyframes sparklineDraw {
    from { stroke-dashoffset: 1000; }
    to { stroke-dashoffset: 0; }
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
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

function buildChartPath(data: number[]): string {
  if (!data || data.length === 0) return ''
  const max = Math.max(...data, 1)
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * 100
    const y = 35 - (v / max) * 30
    return `${x},${y}`
  })
  const pathParts: string[] = []
  for (let i = 0; i < points.length; i++) {
    if (i === 0) {
      pathParts.push(`M${points[0]}`)
    } else {
      const [prevX, prevY] = points[i - 1].split(',').map(Number)
      const [curX, curY] = points[i].split(',').map(Number)
      const cpX = (prevX + curX) / 2
      pathParts.push(`C${cpX},${prevY} ${cpX},${curY} ${curX},${curY}`)
    }
  }
  return pathParts.join(' ')
}

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

  const sparklineStyle: React.CSSProperties = {
    strokeDasharray: 1000,
    strokeDashoffset: 0,
    animation: 'sparklineDraw 2s ease-out forwards',
  }

  const weekLabels = ['3 Mgg Lalu', '2 Mgg Lalu', 'Mgg Lalu', 'Minggu Ini']
  const chartPath = data ? buildChartPath(data.weeklyArticles) : ''
  const maxWeekly = data ? Math.max(...data.weeklyArticles, 1) : 1

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
            {loading ? (
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
                      <h3 style={styles.statValue}>{data?.stats.articles.total ?? 0}</h3>
                      <p style={styles.statSub}>
                        {data?.stats.articles.published ?? 0} Published · {data?.stats.articles.draft ?? 0} Draft
                      </p>
                    </div>
                    <span style={styles.badge}>
                      <span style={styles.iconSmall}>article</span>
                      Artikel
                    </span>
                  </div>
                  <div style={styles.sparklineContainer}>
                    <svg style={{ width: '100%', height: '100%', overflow: 'visible' }} preserveAspectRatio="none" viewBox="0 0 100 30">
                      <path style={{ ...sparklineStyle }} d="M0,25 Q10,15 20,20 T40,10 T60,15 T80,5 T100,0" fill="none" stroke="#004ac6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    </svg>
                  </div>
                </div>

                {/* Contacts */}
                <div style={styles.statCard}>
                  <div style={styles.statHeader}>
                    <div>
                      <p style={styles.statLabel}>Pesan Kontak</p>
                      <h3 style={styles.statValue}>{data?.stats.contacts.total ?? 0}</h3>
                      <p style={styles.statSub}>{data?.stats.contacts.recentCount ?? 0} baru 30 hari ini</p>
                    </div>
                    <span style={styles.badgeNeutral}>
                      <span style={styles.iconSmall}>mail</span>
                      Baru
                    </span>
                  </div>
                  <div style={styles.sparklineContainer}>
                    <svg style={{ width: '100%', height: '100%', overflow: 'visible' }} preserveAspectRatio="none" viewBox="0 0 100 30">
                      <path style={{ ...sparklineStyle }} d="M0,15 Q20,25 40,15 T60,20 T80,10 T100,5" fill="none" stroke="#f59e0b" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    </svg>
                  </div>
                </div>

                {/* Subscribers */}
                <div style={styles.statCard}>
                  <div style={styles.statHeader}>
                    <div>
                      <p style={styles.statLabel}>Subscribers</p>
                      <h3 style={styles.statValue}>{data?.stats.subscribers.total ?? 0}</h3>
                      <p style={styles.statSub}>{data?.stats.subscribers.recentCount ?? 0} baru 30 hari ini</p>
                    </div>
                    <span style={styles.badge}>
                      <span style={styles.iconSmall}>trending_up</span>
                      Aktif
                    </span>
                  </div>
                  <div style={styles.sparklineContainer}>
                    <svg style={{ width: '100%', height: '100%', overflow: 'visible' }} preserveAspectRatio="none" viewBox="0 0 100 30">
                      <path style={{ ...sparklineStyle }} d="M0,20 Q20,10 40,15 T60,5 T80,10 T100,0" fill="none" stroke="#10b981" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    </svg>
                  </div>
                </div>

                {/* Media */}
                <div style={styles.statCard}>
                  <div style={styles.statHeader}>
                    <div>
                      <p style={styles.statLabel}>Media Files</p>
                      <h3 style={styles.statValue}>{data?.stats.media.total ?? 0}</h3>
                      <p style={styles.statSub}>{data?.stats.users.total ?? 0} admin users</p>
                    </div>
                    <span style={styles.outlineIcon}>perm_media</span>
                  </div>
                  <div style={styles.sparklineContainer}>
                    <svg style={{ width: '100%', height: '100%', overflow: 'visible' }} preserveAspectRatio="none" viewBox="0 0 100 30">
                      <path style={{ ...sparklineStyle }} d="M0,5 Q20,15 40,5 T60,20 T80,15 T100,10" fill="none" stroke="#c3c6d7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                    </svg>
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
                <h3 style={styles.chartTitle}>Artikel per Minggu</h3>
                <span style={{ fontSize: '12px', color: '#9ca3af' }}>4 minggu terakhir</span>
              </div>
              <div style={styles.chartArea}>
                <div style={styles.chartGridLines}>
                  {[0, 1, 2, 3, 4].map(i => (
                    <div key={i} style={styles.gridLine} />
                  ))}
                </div>
                {data && data.weeklyArticles.length > 0 ? (
                  <svg
                    style={{ width: '100%', height: '100%', position: 'absolute', inset: 0, zIndex: 10, paddingTop: '8px', paddingBottom: '32px' }}
                    preserveAspectRatio="none"
                    viewBox="0 0 100 40"
                  >
                    <defs>
                      <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#004ac6" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#004ac6" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path d={`${chartPath} L100,40 L0,40 Z`} fill="url(#chartGradient)" />
                    <path style={sparklineStyle} d={chartPath} fill="none" stroke="#004ac6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.8" />
                    {/* Data labels */}
                    {data.weeklyArticles.map((v, i) => {
                      const x = (i / (data.weeklyArticles.length - 1)) * 100
                      const y = 35 - (v / maxWeekly) * 30
                      return (
                        <g key={i}>
                          <circle cx={x} cy={y} r="1.5" fill="#004ac6" />
                          {v > 0 && (
                            <text 
                              x={x} 
                              y={y - 3} 
                              fontSize="4" 
                              textAnchor={i === 0 ? "start" : i === data.weeklyArticles.length - 1 ? "end" : "middle"} 
                              fill="#004ac6" 
                              fontWeight="600"
                            >
                              {v}
                            </text>
                          )}
                        </g>
                      )
                    })}
                  </svg>
                ) : (
                  <div style={{
                    position: 'absolute', inset: 0, display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    color: '#9ca3af', fontSize: '13px', paddingBottom: '32px',
                  }}>
                    {loading ? 'Memuat data chart...' : 'Belum ada data artikel'}
                  </div>
                )}
                <div style={styles.chartLabels}>
                  {weekLabels.map(l => <span key={l}>{l}</span>)}
                </div>
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
