import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['id', 'en'];
const defaultLocale = 'id';

// Paths that should not be localized (Payload CMS admin, APIs, static files)
const publicFiles = [
  '/admin',
  '/api',
  '/_next',
  '/favicon.ico',
  '/icon.png',
  '/media',
  '/sitemap.xml',
  '/robots.txt',
  '/manifest.webmanifest',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the pathname is in the publicFiles list or starts with them
  if (
    publicFiles.some((file) => pathname.startsWith(file)) ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Check if there is any supported locale in the pathname
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // Redirect if there is no locale
  request.nextUrl.pathname = `/${defaultLocale}${pathname}`;
  
  // Return a 308 permanent redirect
  return NextResponse.redirect(request.nextUrl, 308);
}

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
