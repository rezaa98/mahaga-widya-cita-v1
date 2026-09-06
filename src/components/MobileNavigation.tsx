"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowUpRight, ChevronDown, Globe2, Menu, X } from "lucide-react";

type NavigationLink = {
  label: string;
  href?: string | null;
  children?: NavigationLink[];
};

type Props = {
  links: NavigationLink[];
  locale: string;
  pathname: string | null;
  solid: boolean;
  onLanguageChange: (locale: string) => void;
};

export default function MobileNavigation({ links, locale, pathname, solid, onLanguageChange }: Props) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const sectionId = useId();
  const isEn = locale === "en";
  const hrefFor = (href?: string | null) => (href?.startsWith("/") ? `/${locale}${href}` : href || "#");
  const isActive = (href: string) => pathname === href || (href !== `/${locale}` && pathname?.startsWith(`${href}/`));

  const changeOpen = (next: boolean) => {
    setOpen(next);
    if (!next) setExpanded(null);
  };

  // Release the modal and scroll lock if a tablet rotates into desktop navigation.
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1200px)");
    const onChange = () => {
      if (desktop.matches) changeOpen(false);
    };
    desktop.addEventListener("change", onChange);
    return () => desktop.removeEventListener("change", onChange);
  }, []);

  return (
    <Dialog.Root open={open} onOpenChange={changeOpen}>
      <Dialog.Trigger asChild>
        <button
          className={`mobile-nav-toggle ${solid ? "is-solid" : "is-transparent"}`}
          aria-label={isEn ? "Open navigation menu" : "Buka menu navigasi"}
        >
          <Menu size={22} aria-hidden="true" />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="mobile-menu-overlay" />
        <Dialog.Content className="mobile-menu-panel" aria-describedby={undefined}>
          <div className="mobile-menu-heading">
            <div className="mobile-menu-brand">
              <Image src="/logo-transparent.png" alt="" width={36} height={40} />
              <div>
                <span>PT Mahaga Widya Cita</span>
                <Dialog.Title>{isEn ? "Explore" : "Jelajahi"}</Dialog.Title>
              </div>
            </div>
            <Dialog.Close
              className="mobile-menu-close"
              aria-label={isEn ? "Close navigation menu" : "Tutup menu navigasi"}
            >
              <X size={21} aria-hidden="true" />
            </Dialog.Close>
          </div>

          <div className="mobile-menu-scroll">
            <nav aria-label={isEn ? "Main navigation" : "Navigasi utama"} className="mobile-menu-links">
              <Link
                href={`/${locale}`}
                className="mobile-menu-home"
                aria-current={pathname === `/${locale}` ? "page" : undefined}
                onClick={() => changeOpen(false)}
              >
                {isEn ? "Home" : "Beranda"}
                <ArrowUpRight size={18} aria-hidden="true" />
              </Link>
              {links.map((link, index) => {
                const href = hrefFor(link.href);
                const hasChildren = Boolean(link.children?.length);
                const sectionOpen = expanded === link.label;
                const id = `${sectionId}-${index}`;
                return (
                  <div key={link.label} className="mobile-menu-group" data-active={isActive(href) || undefined}>
                    <div className="mobile-menu-row">
                      <Link
                        href={href}
                        aria-current={pathname === href ? "page" : undefined}
                        onClick={() => changeOpen(false)}
                      >
                        {link.label}
                      </Link>
                      {hasChildren && (
                        <button
                          aria-expanded={sectionOpen}
                          aria-controls={id}
                          aria-label={`Submenu ${link.label}`}
                          onClick={() => setExpanded(sectionOpen ? null : link.label)}
                        >
                          <ChevronDown size={19} aria-hidden="true" />
                        </button>
                      )}
                    </div>
                    {hasChildren && (
                      <div id={id} hidden={!sectionOpen} className="mobile-menu-submenu">
                        {link.children!.map((child) => (
                          <Link
                            key={`${child.label}-${child.href}`}
                            href={hrefFor(child.href)}
                            onClick={() => changeOpen(false)}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
            <div className="mobile-menu-actions">
              <p>{isEn ? "Let’s discuss your next step." : "Mari diskusikan langkah Anda."}</p>
              <Link href={`/${locale}/kontak`} className="mobile-menu-cta" onClick={() => changeOpen(false)}>
                {isEn ? "Talk to our team" : "Hubungi Tim Kami"}
                <ArrowUpRight size={18} aria-hidden="true" />
              </Link>
            </div>
          </div>
          <div className="mobile-menu-bottom">
            <div className="mobile-menu-languages" role="group" aria-label={isEn ? "Language" : "Bahasa"}>
              <Globe2 size={17} aria-hidden="true" />
              {(
                [
                  ["id", "ID"],
                  ["en", "EN"],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  aria-label={value === "id" ? "Bahasa Indonesia" : "English"}
                  aria-pressed={locale === value}
                  onClick={() => {
                    if (value === locale) return;
                    changeOpen(false);
                    onLanguageChange(value);
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
            <Link href="/admin" className="mobile-menu-login" onClick={() => changeOpen(false)}>
              {isEn ? "Login" : "Masuk"}
              <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
