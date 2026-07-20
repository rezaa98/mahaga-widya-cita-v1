"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useParams } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";

const defaultNavLinks = [
  {
    label: "Tentang Kami",
    href: "/tentang-kami",
    children: [
      { label: "Profil Perusahaan", href: "/tentang-kami" },
      { label: "Manajemen", href: "/tim#manajemen" },
      { label: "Tenaga Ahli", href: "/tim#ahli" },
      { label: "Our DNA", href: "/tentang-kami#our-dna" },
    ],
  },
  {
    label: "Layanan",
    href: "/layanan",
    children: [
      { label: "Smart Consulting", href: "/layanan/konsultasi" },
      { label: "Smart Executive Education", href: "/layanan/edukasi" },
      { label: "Smart Software Service", href: "/layanan/software" },
      { label: "Smart Governance Review", href: "/layanan/governance-review" },
      { label: "Smart Online Course", href: "/layanan/online-course" },
      { label: "Smart Digital Conference", href: "/layanan/digital-conference" },
    ],
  },
  {
    label: "Artikel",
    href: "/artikel",
    children: [
      { label: "Untuk Individu", href: "/artikel?kategori=individu" },
      { label: "Untuk Bisnis", href: "/artikel?kategori=bisnis" },
      { label: "Untuk Pemerintah", href: "/artikel?kategori=pemerintah" },
      { label: "Policy Review", href: "/policy-reviews" },
    ],
  },
  { label: "Kontak", href: "/kontak" },
];

export default function Navbar() {
  const [links, setLinks] = useState<any[]>(defaultNavLinks);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [langDropdown, setLangDropdown] = useState(false);
  
  const pathname = usePathname();
  const params = useParams();
  const locale = (params?.locale as string) || 'id';
  
  const isDarkHero = pathname === `/${locale}` || pathname === `/${locale}/tentang-kami` || pathname === '/' || pathname === '/tentang-kami';
  const shouldBeSolid = scrolled || !isDarkHero;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    
    // Fetch dynamic navbar links, services, and feature settings from CMS with locale
    Promise.all([
      fetch(`/api/globals/navbar?locale=${locale}`).then(res => res.json()).catch(() => null),
      fetch(`/api/services?locale=${locale}&limit=10`).then(res => res.json()).catch(() => null),
      fetch(`/api/globals/pengaturan-fitur`).then(res => res.json()).catch(() => null),
    ]).then(([navbarData, servicesData, featureData]) => {
      let currentLinks = [...defaultNavLinks];
      
      if (navbarData?.links && Array.isArray(navbarData.links) && navbarData.links.length > 0) {
        currentLinks = navbarData.links;
      }
      
      // Inject live services into the "Layanan" / "Services" dropdown
      if (servicesData?.docs && Array.isArray(servicesData.docs)) {
        const dynamicServiceChildren = servicesData.docs.map((s: any) => ({
          label: s.title,
          href: `/layanan/${s.slug}`,
        }));
        
        // Find the Services link (either 'Layanan' or 'Services')
        const servicesLinkIndex = currentLinks.findIndex((l: any) => 
          l.label.toLowerCase() === 'layanan' || l.label.toLowerCase() === 'services' || l.href?.includes('/layanan')
        );
        
        if (servicesLinkIndex !== -1) {
          currentLinks[servicesLinkIndex].children = dynamicServiceChildren;
        } else {
          // If not found, add it
          currentLinks.splice(1, 0, {
            label: locale === 'en' ? 'Services' : 'Layanan',
            href: `/layanan`,
            children: dynamicServiceChildren
          });
        }
      }

      const isPolicyReviewsEnabled = featureData?.enablePolicyReviews !== false;
      if (!isPolicyReviewsEnabled) {
        currentLinks = currentLinks.map((link: any) => {
          if (link.children && Array.isArray(link.children)) {
            return {
              ...link,
              children: link.children.filter((child: any) => 
                !child.href?.includes('/policy-reviews') && child.label?.toLowerCase() !== 'policy review'
              ),
            }
          }
          return link;
        }).filter((link: any) => !link.href?.includes('/policy-reviews'));
      }
      
      setLinks(currentLinks);
    });
      
    return () => window.removeEventListener("scroll", handleScroll);
  }, [locale]);

  const switchLanguage = (newLocale: string) => {
    if (newLocale === locale) return;
    const currentPath = pathname || '/';
    // Remove the current locale prefix from the path if it exists
    const pathWithoutLocale = currentPath.startsWith(`/${locale}`) 
      ? currentPath.replace(`/${locale}`, '') 
      : currentPath;
    
    const newPath = `/${newLocale}${pathWithoutLocale.startsWith('/') ? pathWithoutLocale : '/' + pathWithoutLocale}`;
    window.location.href = newPath;
  };

  return (
    <>
      <nav
        className={`navbar ${shouldBeSolid ? "scrolled" : "transparent"}`}
        style={{ padding: "0" }}
      >
        <div className="container">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              height: "72px",
              gap: "2rem",
            }}
          >
            {/* Logo */}
            <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.625rem", flexShrink: 0 }}>
              <Image 
                src="/logo-transparent.png" 
                alt="Logo PT Mahaga Widya Cita" 
                width={48} 
                height={48} 
                style={{ objectFit: 'contain' }}
              />
              <span
                className="logo-text"
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: "700",
                  fontSize: "1.125rem",
                  color: shouldBeSolid ? "var(--color-primary-900)" : "white",
                  lineHeight: "1.2",
                  letterSpacing: "-0.02em",
                  transition: "color 0.25s ease",
                }}
              >
                PT Mahaga Widya Cita
              </span>
            </Link>

            {/* Desktop Nav */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.125rem",
                flex: 1,
                justifyContent: "center",
              }}
              className="desktop-nav"
            >
              {links.map((link) => (
                <div
                  key={link.label}
                  style={{ position: "relative" }}
                  onMouseEnter={() => link.children && link.children.length > 0 && setOpenDropdown(link.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <Link
                    href={link.href && link.href.startsWith('/') ? `/${locale}${link.href}` : (link.href || '#')}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.25rem",
                      padding: "0.5rem 0.75rem",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      color: shouldBeSolid ? "var(--color-neutral-700)" : "rgba(255,255,255,0.88)",
                      borderRadius: "8px",
                      transition: "all 0.2s ease",
                      whiteSpace: "nowrap",
                    }}
                    onMouseOver={(e) => {
                      (e.currentTarget as HTMLElement).style.background = shouldBeSolid
                        ? "var(--color-primary-50)"
                        : "rgba(255,255,255,0.12)";
                      (e.currentTarget as HTMLElement).style.color = shouldBeSolid
                        ? "var(--color-primary-600)"
                        : "white";
                    }}
                    onMouseOut={(e) => {
                      (e.currentTarget as HTMLElement).style.background = "transparent";
                      (e.currentTarget as HTMLElement).style.color = shouldBeSolid
                        ? "var(--color-neutral-700)"
                        : "rgba(255,255,255,0.88)";
                    }}
                  >
                    {link.label}
                    {link.children && link.children.length > 0 && <ChevronDown size={14} />}
                  </Link>

                  {/* Dropdown */}
                  {link.children && link.children.length > 0 && openDropdown === link.label && (
                    <div
                      style={{
                        position: "absolute",
                        top: "100%",
                        left: "50%",
                        transform: "translateX(-50%)",
                        paddingTop: "8px", // Invisible bridge to prevent mouse leave
                        zIndex: 100,
                      }}
                    >
                      <div
                        style={{
                          background: "white",
                          borderRadius: "12px",
                          boxShadow: "0 12px 40px rgba(11,45,107,0.16)",
                          border: "1px solid var(--color-neutral-100)",
                          padding: "0.5rem",
                          minWidth: "220px",
                          animation: "fadeInUp 0.2s ease",
                        }}
                      >
                      {link.children.map((child: any) => (
                        <Link
                          key={child.label}
                          href={(child.href && child.href.startsWith('/')) ? `/${locale}${child.href}` : (child.href || '#')}
                          style={{
                            display: "block",
                            padding: "0.625rem 0.875rem",
                            fontSize: "0.875rem",
                            fontWeight: "500",
                            color: "var(--color-neutral-700)",
                            borderRadius: "8px",
                            transition: "all 0.15s ease",
                          }}
                          onMouseOver={(e) => {
                            (e.currentTarget as HTMLElement).style.background = "var(--color-primary-50)";
                            (e.currentTarget as HTMLElement).style.color = "var(--color-primary-600)";
                          }}
                          onMouseOut={(e) => {
                            (e.currentTarget as HTMLElement).style.background = "transparent";
                            (e.currentTarget as HTMLElement).style.color = "var(--color-neutral-700)";
                          }}
                        >
                          {child.label}
                        </Link>
                      ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Language Switcher & CTA Buttons */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", flexShrink: 0 }}
              className="desktop-nav"
            >
              <div 
                style={{ position: "relative" }}
                onMouseEnter={() => setLangDropdown(true)}
                onMouseLeave={() => setLangDropdown(false)}
              >
                <button
                  style={{
                    background: "transparent",
                    border: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.25rem",
                    cursor: "pointer",
                    padding: "0.5rem 0.75rem",
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    color: shouldBeSolid ? "var(--color-neutral-700)" : "white",
                  }}
                >
                  {locale.toUpperCase()} <ChevronDown size={14} />
                </button>
                {langDropdown && (
                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      right: 0,
                      paddingTop: "8px",
                      zIndex: 100,
                    }}
                  >
                    <div
                      style={{
                        background: "white",
                        borderRadius: "8px",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                        border: "1px solid var(--color-neutral-100)",
                        padding: "0.5rem",
                        minWidth: "120px",
                        animation: "fadeInUp 0.2s ease",
                      }}
                    >
                      <button
                        onClick={() => switchLanguage('id')}
                        style={{
                          display: "block",
                          width: "100%",
                          textAlign: "left",
                          padding: "0.5rem 0.75rem",
                          fontSize: "0.875rem",
                          color: locale === 'id' ? "var(--color-primary-600)" : "var(--color-neutral-700)",
                          fontWeight: locale === 'id' ? "700" : "500",
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          borderRadius: "4px",
                        }}
                        onMouseOver={(e) => (e.currentTarget.style.background = "var(--color-primary-50)")}
                        onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
                      >
                        ID - Indonesia
                      </button>
                      <button
                        onClick={() => switchLanguage('en')}
                        style={{
                          display: "block",
                          width: "100%",
                          textAlign: "left",
                          padding: "0.5rem 0.75rem",
                          fontSize: "0.875rem",
                          color: locale === 'en' ? "var(--color-primary-600)" : "var(--color-neutral-700)",
                          fontWeight: locale === 'en' ? "700" : "500",
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          borderRadius: "4px",
                        }}
                        onMouseOver={(e) => (e.currentTarget.style.background = "var(--color-primary-50)")}
                        onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
                      >
                        EN - English
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <Link
                href={`/${locale}/login`}
                className="btn btn-sm"
                style={{
                  background: "transparent",
                  color: shouldBeSolid ? "var(--color-primary-700)" : "white",
                  border: `1.5px solid ${shouldBeSolid ? "var(--color-primary-200)" : "rgba(255,255,255,0.5)"}`,
                  borderRadius: "var(--radius-full)",
                  transition: "all 0.25s ease",
                }}
              >
                {locale === 'en' ? 'Login' : 'Masuk'}
              </Link>
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="mobile-nav-toggle"
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: shouldBeSolid ? "var(--color-primary-900)" : "white",
                padding: "0.375rem",
                display: "none",
              }}
              aria-label="Toggle mobile menu"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div
            style={{
              background: "white",
              borderTop: "1px solid var(--color-neutral-100)",
              padding: "1rem 0",
              maxHeight: "80vh",
              overflowY: "auto",
            }}
          >
            <div className="container">
              {links.map((link) => (
                <div key={link.label}>
                  <Link
                    href={link.href && link.href.startsWith('/') ? `/${locale}${link.href}` : (link.href || '#')}
                    onClick={() => setMobileOpen(false)}
                    style={{
                      display: "block",
                      padding: "0.75rem 0",
                      fontWeight: "600",
                      fontSize: "0.9375rem",
                      color: "var(--color-neutral-800)",
                      borderBottom: "1px solid var(--color-neutral-100)",
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                    }}
                  >
                    {link.label}
                  </Link>
                  {link.children?.map((child: any) => (
                    <Link
                      key={child.label}
                      href={(child.href && child.href.startsWith('/')) ? `/${locale}${child.href}` : (child.href || '#')}
                      onClick={() => setMobileOpen(false)}
                      style={{
                        display: "block",
                        padding: "0.5rem 1rem",
                        fontSize: "0.875rem",
                        color: "var(--color-primary-600)",
                        borderBottom: "1px solid var(--color-neutral-50)",
                      }}
                    >
                      → {child.label}
                    </Link>
                  ))}
                </div>
              ))}
              <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.25rem" }}>
                <Link href="/login" className="btn btn-secondary" style={{ flex: 1, justifyContent: "center" }}>
                  Masuk
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      <style jsx>{`
        @media (max-width: 1024px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-nav-toggle {
            display: flex !important;
          }
        }
      `}</style>
    </>
  );
}
