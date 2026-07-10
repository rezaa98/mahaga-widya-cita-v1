"use client"
import React, { useEffect } from 'react'

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
    fontSize: '20px',
    lineHeight: '28px',
    fontWeight: 600,
    color: '#191b23',
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
  sparklineContainer: {
    height: '40px',
    width: '100%',
    marginTop: '8px',
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
  toggleGroup: {
    display: 'flex',
    gap: '8px',
  },
  toggleActive: {
    padding: '4px 12px',
    fontSize: '11px',
    lineHeight: '14px',
    fontWeight: 600,
    letterSpacing: '0.05em',
    borderRadius: '9999px',
    backgroundColor: '#e7e7f3',
    color: '#191b23',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'Inter, sans-serif',
  },
  toggleInactive: {
    padding: '4px 12px',
    fontSize: '11px',
    lineHeight: '14px',
    fontWeight: 600,
    letterSpacing: '0.05em',
    borderRadius: '9999px',
    backgroundColor: 'transparent',
    color: '#434655',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'Inter, sans-serif',
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
    justifyContent: 'space-between',
    fontSize: '11px',
    color: '#c3c6d7',
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
    gap: '16px',
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
    fontSize: '14px',
    lineHeight: '20px',
    color: '#191b23',
    margin: 0,
  },
  activityTime: {
    fontSize: '11px',
    lineHeight: '14px',
    fontWeight: 500,
    color: '#c3c6d7',
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
`

export const DashboardWidget: React.FC = () => {
  useEffect(() => {
    // Load Material Symbols font
    const linkId = 'material-symbols-font'
    if (!document.getElementById(linkId)) {
      const link = document.createElement('link')
      link.id = linkId
      link.rel = 'stylesheet'
      link.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap'
      document.head.appendChild(link)
    }

    // Load Inter font
    const interLinkId = 'inter-font'
    if (!document.getElementById(interLinkId)) {
      const link = document.createElement('link')
      link.id = interLinkId
      link.rel = 'stylesheet'
      link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
      document.head.appendChild(link)
    }
  }, [])

  const sparklineStyle: React.CSSProperties = {
    strokeDasharray: 1000,
    strokeDashoffset: 0,
    animation: 'sparklineDraw 2s ease-out forwards',
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: cssAnimation }} />
      <main style={styles.main}>
        <div style={styles.contentCanvas}>
          {/* Welcome Section */}
          <div style={styles.welcomeSection}>
            <h2 style={styles.welcomeTitle}>Good Morning, Admin</h2>
            <p style={styles.welcomeSubtitle}>Here&apos;s what&apos;s happening with your content today.</p>
          </div>

          {/* Quick Actions */}
          <div style={styles.quickActions}>
            <a href="/admin/collections/articles/create" style={styles.btnPrimary}>
              <span style={styles.iconMedium}>post_add</span>
              New Article
            </a>
            <a href="/admin/collections/users/create" style={styles.btnPrimary}>
              <span style={styles.iconMedium}>person_add</span>
              New User
            </a>
            <a href="/admin/collections/media/create" style={styles.btnOutline}>
              <span style={styles.iconMedium}>upload_file</span>
              Upload Media
            </a>
          </div>

          {/* Bento Grid */}
          <div style={styles.bentoGrid}>
            {/* Stat Card 1 */}
            <div style={styles.statCard}>
              <div style={styles.statHeader}>
                <div>
                  <p style={styles.statLabel}>Total Articles</p>
                  <h3 style={styles.statValue}>2.4k</h3>
                </div>
                <span style={styles.badge}>
                  <span style={styles.iconSmall}>trending_up</span>
                  +12%
                </span>
              </div>
              <div style={styles.sparklineContainer}>
                <svg style={{ width: '100%', height: '100%', overflow: 'visible' }} preserveAspectRatio="none" viewBox="0 0 100 30">
                  <path style={{ ...sparklineStyle, color: '#004ac6' }} d="M0,25 Q10,15 20,20 T40,10 T60,15 T80,5 T100,0" fill="none" stroke="#004ac6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              </div>
            </div>

            {/* Stat Card 2 */}
            <div style={styles.statCard}>
              <div style={styles.statHeader}>
                <div>
                  <p style={styles.statLabel}>Total Users</p>
                  <h3 style={styles.statValue}>850</h3>
                </div>
                <span style={styles.badge}>
                  <span style={styles.iconSmall}>trending_up</span>
                  +5%
                </span>
              </div>
              <div style={styles.sparklineContainer}>
                <svg style={{ width: '100%', height: '100%', overflow: 'visible' }} preserveAspectRatio="none" viewBox="0 0 100 30">
                  <path style={{ ...sparklineStyle, color: '#004ac6' }} d="M0,15 Q20,25 40,15 T60,20 T80,10 T100,5" fill="none" stroke="#004ac6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              </div>
            </div>

            {/* Stat Card 3 */}
            <div style={styles.statCard}>
              <div style={styles.statHeader}>
                <div>
                  <p style={styles.statLabel}>Subscribers</p>
                  <h3 style={styles.statValue}>1.2k</h3>
                </div>
                <span style={styles.badge}>
                  <span style={styles.iconSmall}>trending_up</span>
                  +8%
                </span>
              </div>
              <div style={styles.sparklineContainer}>
                <svg style={{ width: '100%', height: '100%', overflow: 'visible' }} preserveAspectRatio="none" viewBox="0 0 100 30">
                  <path style={{ ...sparklineStyle, color: '#004ac6' }} d="M0,20 Q20,10 40,15 T60,5 T80,10 T100,0" fill="none" stroke="#004ac6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              </div>
            </div>

            {/* Stat Card 4 */}
            <div style={styles.statCard}>
              <div style={styles.statHeader}>
                <div>
                  <p style={styles.statLabel}>Media Files</p>
                  <h3 style={styles.statValue}>4.2k</h3>
                </div>
                <span style={styles.outlineIcon}>perm_media</span>
              </div>
              <div style={styles.sparklineContainer}>
                <svg style={{ width: '100%', height: '100%', overflow: 'visible' }} preserveAspectRatio="none" viewBox="0 0 100 30">
                  <path style={{ ...sparklineStyle, color: '#c3c6d7' }} d="M0,5 Q20,15 40,5 T60,20 T80,15 T100,10" fill="none" stroke="#c3c6d7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              </div>
            </div>
          </div>

          {/* Charts & Activity Grid */}
          <div style={styles.chartsGrid}>
            {/* Main Chart Area */}
            <div style={styles.chartCard}>
              <div style={styles.chartHeader}>
                <h3 style={styles.chartTitle}>Content Activity</h3>
                <div style={styles.toggleGroup}>
                  <button style={styles.toggleActive}>Week</button>
                  <button style={styles.toggleInactive}>Month</button>
                </div>
              </div>
              
              {/* Simulated Area Chart */}
              <div style={styles.chartArea}>
                <div style={styles.chartGridLines}>
                  <div style={styles.gridLine}></div>
                  <div style={styles.gridLine}></div>
                  <div style={styles.gridLine}></div>
                  <div style={styles.gridLine}></div>
                  <div style={styles.gridLine}></div>
                </div>
                <svg style={{ width: '100%', height: '100%', position: 'absolute', inset: 0, zIndex: 10, paddingTop: '8px', paddingBottom: '32px' }} preserveAspectRatio="none" viewBox="0 0 100 40">
                  <defs>
                    <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#004ac6" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#004ac6" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d="M0,30 Q10,10 20,20 T40,15 T60,25 T80,5 T100,10 L100,40 L0,40 Z" fill="url(#chartGradient)" />
                  <path style={sparklineStyle} d="M0,30 Q10,10 20,20 T40,15 T60,25 T80,5 T100,10" fill="none" stroke="#004ac6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.5" />
                </svg>
                <div style={styles.chartLabels}>
                  <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                </div>
              </div>
            </div>

            {/* Recent Activity List */}
            <div style={styles.activityCard}>
              <div style={styles.activityHeader}>
                <h3 style={styles.chartTitle}>Recent Activity</h3>
              </div>
              <div style={styles.activityList}>
                {/* Activity Item 1 */}
                <div style={styles.activityItem}>
                  <div style={styles.activityIcon('#b4c5ff', '#004ac6')}>
                    <span style={styles.iconLarge}>edit_document</span>
                  </div>
                  <div>
                    <p style={styles.activityText}><span style={{ fontWeight: 600 }}>Sarah Jenkins</span> updated article &quot;Q3 Product Roadmap&quot;</p>
                    <div style={styles.activityTime}>2 hours ago</div>
                  </div>
                </div>

                {/* Activity Item 2 */}
                <div style={styles.activityItem}>
                  <div style={styles.activityIcon('#dcfce7', '#15803d')}>
                    <span style={styles.iconLarge}>person_add</span>
                  </div>
                  <div>
                    <p style={styles.activityText}><span style={{ fontWeight: 600 }}>New User</span> registered: michael.c@example.com</p>
                    <div style={styles.activityTime}>4 hours ago</div>
                  </div>
                </div>

                {/* Activity Item 3 */}
                <div style={styles.activityItem}>
                  <div style={styles.activityIcon('#e1e2ed', '#434655')}>
                    <span style={styles.iconLarge}>image</span>
                  </div>
                  <div>
                    <p style={styles.activityText}><span style={{ fontWeight: 600 }}>Admin</span> uploaded 5 new assets to &quot;Hero Banners&quot;</p>
                    <div style={styles.activityTime}>5 hours ago</div>
                  </div>
                </div>

                {/* Activity Item 4 */}
                <div style={styles.activityItem}>
                  <div style={styles.activityIcon('#fee2e2', '#b91c1c')}>
                    <span style={styles.iconLarge}>delete</span>
                  </div>
                  <div>
                    <p style={styles.activityText}><span style={{ fontWeight: 600 }}>System</span> removed archived category &quot;Old Promo&quot;</p>
                    <div style={styles.activityTime}>Yesterday</div>
                  </div>
                </div>
              </div>
              <button style={styles.viewAllBtn}>
                View All Activity
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
