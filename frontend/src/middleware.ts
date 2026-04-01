import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

// Define supported locales
const locales = ['en', 'uz', 'ko'];
const defaultLocale = 'en';

// Get the preferred locale
function getLocale(request: NextRequest) {
  // Negotiator expects plain object headers
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  // Use negotiator and intl-localematcher to get best locale
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
  const locale = match(languages, locales, defaultLocale);
  return locale;
}

export function middleware(request: NextRequest) {
  // Check if pathname includes a locale
  const pathname = request.nextUrl.pathname;
  
  // Check if request contains a cookie with a preferred locale
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
  
  // Use cookie locale if available, otherwise detect from headers
  const locale = cookieLocale || getLocale(request);

  // Store the locale in a cookie
  const response = NextResponse.next();
  if (!cookieLocale) {
    response.cookies.set('NEXT_LOCALE', locale);
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg).*)'],
};