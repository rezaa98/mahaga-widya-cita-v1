import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["id", "en"];
const defaultLocale = "id";
const publicFiles = [
  "/admin",
  "/api",
  "/_next",
  "/favicon.ico",
  "/icon.png",
  "/media",
  "/sitemap.xml",
  "/robots.txt",
  "/manifest.webmanifest",
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (publicFiles.some((file) => pathname.startsWith(file)) || pathname.includes(".")) {
    return NextResponse.next();
  }
  const pathnameHasLocale = locales.some((locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`);
  if (pathnameHasLocale) return NextResponse.next();

  const localizedURL = request.nextUrl.clone();
  localizedURL.pathname = `/${defaultLocale}${pathname}`;
  return NextResponse.redirect(localizedURL, 308);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
