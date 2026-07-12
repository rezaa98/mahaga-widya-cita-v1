"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";

const defaultNavLinks = [
  {
    label: "Tentang Kami",
    href: "/tentang-kami",
    children: [
      { label: "Profil Perusahaan", href: "/tentang-kami" },
      { label: "Manajemen", href: "/tim#manajemen" },
      { label: "Tenaga Ahli", href: "/tim#ahli" },
      { label: "Pesan CEO", href: "/tentang-kami#ceo" },
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
  
  const pathname = usePathname();
  const isDarkHero = pathname === '/' || pathname === '/tentang-kami';
  const shouldBeSolid = scrolled || !isDarkHero;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    
    // Fetch dynamic navbar links from CMS
    fetch('/api/globals/navbar')
      .then(res => res.json())
      .then(data => {
        if (data?.links && Array.isArray(data.links) && data.links.length > 0) {
          setLinks(data.links);
        }
      })
      .catch(err => console.error("Error fetching navbar links:", err));
      
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: "700",
                  fontSize: "0.9375rem",
                  color: shouldBeSolid ? "var(--color-primary-900)" : "white",
                  lineHeight: "1.2",
                  transition: "color 0.25s ease",
                }}
              >
                PT Mahaga<br />Widya Cita
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
                    href={link.href}
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
                          href={child.href}
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

            {/* CTA Buttons */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", flexShrink: 0 }}
              className="desktop-nav"
            >
              <Link
                href="/login"
                className="btn btn-sm"
                style={{
                  background: "transparent",
                  color: shouldBeSolid ? "var(--color-primary-700)" : "white",
                  border: `1.5px solid ${shouldBeSolid ? "var(--color-primary-200)" : "rgba(255,255,255,0.5)"}`,
                  borderRadius: "var(--radius-full)",
                  transition: "all 0.25s ease",
                }}
              >
                Masuk
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
                    href={link.href}
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
                  {link.children?.map((child) => (
                    <Link
                      key={child.label}
                      href={child.href}
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
