"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@payloadcms/ui';
import { startInteractiveTour } from './interactiveTour';
import { HelpCenterModal } from './HelpCenterModal';
import { hasCapability } from '@/utils/access';

type MenuItem = { label: string; href: string; icon: string }

function getMenuGroups(user: { role?: unknown } | null | undefined): { label: string; items: MenuItem[] }[] {
  const canManageContent = hasCapability(user, 'manageContent')
  const canReviewContent = hasCapability(user, 'reviewContent')
  const canManageSite = hasCapability(user, 'manageSiteContent')
  const canUseContent = canManageContent || canReviewContent

  return [
    {
      label: 'CONTENT MANAGEMENT',
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
      label: 'WEBSITE MANAGEMENT',
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

export const CustomNav: React.FC = () => {
  const pathname = usePathname();
  const { user } = useAuth();
  const [isHelpModalOpen, setIsHelpModalOpen] = React.useState(false);
  // Payload's client auth type does not include project-specific fields, even
  // though `role` is saved in the JWT by the Users collection.
  const authUser = user as unknown as { role?: unknown } | null | undefined;
  const menuGroups = getMenuGroups(authUser);
  const canManageUsers = hasCapability(authUser, 'manageUsers');

  React.useEffect(() => {
    if (typeof window !== 'undefined' && window.location.search.includes('tour=1')) {
      // Remove tour=1 from URL without reloading
      const url = new URL(window.location.href)
      url.searchParams.delete('tour')
      window.history.replaceState({}, '', url.toString())
      
      // Add slight delay to allow page transition and elements to mount
      setTimeout(() => {
        startInteractiveTour(pathname)
      }, 500)
    }
  }, [pathname])

  return (
    <nav className="custom-nav" style={{
      width: '280px',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: '#ffffff',
      borderRight: '1px solid #e4e6ee',
      padding: '24px 0 20px',
      position: 'sticky',
      top: 0,
      flexShrink: 0,
    }}>
      {/* Header / Logo Area */}
      <div style={{ padding: '0 24px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src="/logo-transparent.png" alt="Logo" style={{ height: '32px', width: 'auto', flexShrink: 0 }} />
          <span style={{ fontWeight: 800, fontSize: '18px', color: '#1a1c27', letterSpacing: '-0.02em' }}>
            Mahaga Admin
          </span>
        </div>
      </div>

      {/* Menu Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px' }}>
        {menuGroups.map((group, i) => (
          <div key={i} style={{ marginBottom: '28px' }}>
            <div style={{
              fontWeight: 700,
              fontSize: '11px',
              color: '#7a7e90',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '12px',
              paddingLeft: '8px',
            }}>
              {group.label}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {group.items.map((item, j) => {
                const isActive = pathname === item.href;
                return (
                  <Link href={item.href} key={j} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    color: isActive ? '#1d4ed8' : '#434655',
                    background: isActive ? '#dbeafe' : 'transparent',
                    fontWeight: isActive ? 600 : 500,
                    fontSize: '14px',
                    transition: 'all 0.2s ease',
                    borderLeft: isActive ? '4px solid #2563eb' : '4px solid transparent',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = '#f3f4f8';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}>
                    <span className="material-symbols-outlined" style={{ 
                      fontSize: '20px', 
                      color: isActive ? '#2563eb' : '#7a7e90',
                      fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0"
                    }}>
                      {item.icon}
                    </span>
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Area */}
      <div style={{ padding: '0 16px', marginTop: 'auto' }}>
        <div style={{ height: '1px', background: '#e4e6ee', marginBottom: '16px', margin: '0 8px 16px' }} />
        
        {canManageUsers && <Link href="/admin/collections/users" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '10px 14px',
          borderRadius: '8px',
          textDecoration: 'none',
          color: '#434655',
          fontWeight: 500,
          fontSize: '14px',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f8'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
          <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#7a7e90' }}>
            settings
          </span>
          Settings
        </Link>}
        
        <button onClick={(e) => { e.preventDefault(); setIsHelpModalOpen(true); }} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '10px 14px',
          borderRadius: '8px',
          border: 'none',
          background: 'transparent',
          color: '#434655',
          fontWeight: 500,
          fontSize: '14px',
          cursor: 'pointer',
          width: '100%',
          textAlign: 'left',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f8'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
          <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#7a7e90' }}>
            help_center
          </span>
          Help Center
        </button>
        
        <Link href="/admin/logout" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '10px 14px',
          borderRadius: '8px',
          textDecoration: 'none',
          color: '#dc2626',
          fontWeight: 500,
          fontSize: '14px',
          marginBottom: '12px',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = '#fee2e2'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
          <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#dc2626' }}>
            logout
          </span>
          Logout
        </Link>

      </div>
      <HelpCenterModal isOpen={isHelpModalOpen} onClose={() => setIsHelpModalOpen(false)} />
    </nav>
  );
};
