"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@payloadcms/ui'
import { startInteractiveTour } from './interactiveTour'
import { HelpCenterModal } from './HelpCenterModal'
import { hasCapability } from '@/utils/access'

type MenuItem = { label: string; href: string; icon: string }
type AuthUser = { email?: unknown; name?: unknown; role?: unknown } | null | undefined

function getMenuGroups(user: AuthUser): { label: string; items: MenuItem[] }[] {
  const canManageContent = hasCapability(user, 'manageContent')
  const canReviewContent = hasCapability(user, 'reviewContent')
  const canManageSite = hasCapability(user, 'manageSiteContent')
  const canUseContent = canManageContent || canReviewContent

  return [
    {
      label: 'Content',
      items: [
        ...(canManageSite ? [{ label: 'Dashboard', href: '/admin', icon: 'grid_view' }] : []),
        ...(canUseContent ? [
          { label: 'Articles', href: '/admin/collections/articles', icon: 'article' },
          { label: 'Journals', href: '/admin/collections/journals', icon: 'menu_book' },
          { label: 'Policy Reviews', href: '/admin/collections/policy-reviews', icon: 'policy' },
        ] : []),
        ...(canManageContent ? [{ label: 'Categories', href: '/admin/collections/categories', icon: 'category' }] : []),
      ],
    },
    {
      label: 'Website',
      items: canManageSite ? [
        { label: 'Landing Page', href: '/admin/globals/beranda', icon: 'web' },
        { label: 'About Us', href: '/admin/globals/tentang-kami', icon: 'info' },
        { label: 'Contact Us', href: '/admin/globals/kontak', icon: 'contact_mail' },
        { label: 'Navbar', href: '/admin/globals/navbar', icon: 'menu' },
        { label: 'Footer', href: '/admin/globals/footer', icon: 'border_bottom' },
        { label: 'Services', href: '/admin/collections/services', icon: 'handshake' },
        { label: 'Team Members', href: '/admin/collections/team-members', icon: 'group' },
      ] : [],
    },
  ].filter((group) => group.items.length > 0)
}

function isActiveRoute(pathname: string, href: string): boolean {
  return href === '/admin' ? pathname === href : pathname === href || pathname.startsWith(`${href}/`)
}

function displayRole(role: unknown): string {
  if (typeof role !== 'string') return 'CMS user'
  return role.replaceAll('_', ' ')
}

function displayName(user: AuthUser): string {
  if (typeof user?.name === 'string' && user.name.trim()) return user.name
  if (typeof user?.email === 'string' && user.email.trim()) return user.email
  return 'Mahaga user'
}

export const CustomNav: React.FC = () => {
  const pathname = usePathname()
  const { user } = useAuth()
  const [isHelpModalOpen, setIsHelpModalOpen] = React.useState(false)
  const [isMobileOpen, setIsMobileOpen] = React.useState(false)
  // Payload's client auth type does not include project-specific fields, even
  // though `role` is persisted in the user JWT by the Users collection.
  const authUser = user as unknown as AuthUser
  const menuGroups = getMenuGroups(authUser)
  const canManageUsers = hasCapability(authUser, 'manageUsers')

  React.useEffect(() => {
    setIsMobileOpen(false)
  }, [pathname])

  React.useEffect(() => {
    if (!isMobileOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMobileOpen(false)
    }

    document.body.classList.add('admin-nav-open')
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.classList.remove('admin-nav-open')
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [isMobileOpen])

  React.useEffect(() => {
    if (typeof window === 'undefined' || !window.location.search.includes('tour=1')) return

    const url = new URL(window.location.href)
    url.searchParams.delete('tour')
    window.history.replaceState({}, '', url.toString())

    const timer = window.setTimeout(() => startInteractiveTour(pathname), 500)
    return () => window.clearTimeout(timer)
  }, [pathname])

  return (
    <>
      <button
        aria-controls="mahaga-admin-navigation"
        aria-expanded={isMobileOpen}
        aria-label={isMobileOpen ? 'Tutup navigasi' : 'Buka navigasi'}
        className="custom-nav__mobile-toggle"
        onClick={() => setIsMobileOpen((open) => !open)}
        type="button"
      >
        <span aria-hidden="true" className="material-symbols-outlined">{isMobileOpen ? 'close' : 'menu'}</span>
      </button>

      <button
        aria-label="Tutup navigasi"
        className="custom-nav__overlay"
        onClick={() => setIsMobileOpen(false)}
        tabIndex={isMobileOpen ? 0 : -1}
        type="button"
      />

      <nav
        aria-label="Navigasi admin"
        className={`nav custom-nav${isMobileOpen ? ' custom-nav--mobile-open' : ''}`}
        id="mahaga-admin-navigation"
      >
        <div className="custom-nav__brand">
          <img alt="Mahaga Widya Cita" className="custom-nav__logo" src="/logo-transparent.png" />
          <div className="custom-nav__brand-copy">
            <span>Mahaga</span>
            <small>Admin workspace</small>
          </div>
        </div>

        <div className="custom-nav__scroll-area">
          {menuGroups.map((group) => (
            <section className="custom-nav__group" key={group.label}>
              <h2 className="custom-nav__group-label">{group.label}</h2>
              <div className="custom-nav__items">
                {group.items.map((item) => {
                  const isActive = isActiveRoute(pathname, item.href)
                  return (
                    <Link
                      aria-current={isActive ? 'page' : undefined}
                      className={`custom-nav__item${isActive ? ' custom-nav__item--active' : ''}`}
                      data-label={item.label}
                      href={item.href}
                      key={item.href}
                      onClick={() => setIsMobileOpen(false)}
                      title={item.label}
                    >
                      <span aria-hidden="true" className="material-symbols-outlined custom-nav__item-icon">{item.icon}</span>
                      <span className="custom-nav__item-label">{item.label}</span>
                    </Link>
                  )
                })}
              </div>
            </section>
          ))}
        </div>

        <div className="custom-nav__footer">
          <div className="custom-nav__profile" title={displayName(authUser)}>
            <span aria-hidden="true" className="custom-nav__avatar">{displayName(authUser).charAt(0).toUpperCase()}</span>
            <div className="custom-nav__profile-copy">
              <span>{displayName(authUser)}</span>
              <small>{displayRole(authUser?.role)}</small>
            </div>
          </div>

          <div className="custom-nav__footer-actions">
            <Link className="custom-nav__utility" href="/id" target="_blank" title="Lihat website" rel="noreferrer">
              <span aria-hidden="true" className="material-symbols-outlined">open_in_new</span>
              <span>Lihat website</span>
            </Link>
            {canManageUsers && (
              <Link className="custom-nav__utility" href="/admin/collections/users" title="Kelola pengguna">
                <span aria-hidden="true" className="material-symbols-outlined">manage_accounts</span>
                <span>Pengguna</span>
              </Link>
            )}
            <button className="custom-nav__utility" onClick={() => setIsHelpModalOpen(true)} title="Buka bantuan" type="button">
              <span aria-hidden="true" className="material-symbols-outlined">help</span>
              <span>Bantuan</span>
            </button>
            <Link className="custom-nav__utility custom-nav__utility--logout" href="/admin/logout" title="Keluar">
              <span aria-hidden="true" className="material-symbols-outlined">logout</span>
              <span>Keluar</span>
            </Link>
          </div>
        </div>
      </nav>

      <HelpCenterModal isOpen={isHelpModalOpen} onClose={() => setIsHelpModalOpen(false)} />
    </>
  )
}
