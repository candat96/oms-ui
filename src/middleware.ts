// Next Imports
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Third-party Imports
import Negotiator from 'negotiator'
import { match as matchLocale } from '@formatjs/intl-localematcher'

import { withAuth } from 'next-auth/middleware'
import type { NextRequestWithAuth } from 'next-auth/middleware'

// Config Imports
import { i18n } from '@configs/i18n'

// Util Imports
import { getLocalizedUrl, isUrlMissingLocale } from '@/utils/i18n'
import { ensurePrefix, withoutSuffix } from '@/utils/string'

const HOME_PAGE_URL = '/home'

const getLocale = (request: NextRequest): string | undefined => {
  // Try to get locale from URL
  const urlLocale = i18n.locales.find(locale => request.nextUrl.pathname.startsWith(`/${locale}`))

  if (urlLocale) return urlLocale

  // Negotiator expects plain object so we need to transform headers
  const negotiatorHeaders: Record<string, string> = {}

  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value))

  // @ts-ignore locales are readonly
  const locales: string[] = i18n.locales

  // Use negotiator and intl-localematcher to get best locale
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages(locales)

  const locale = matchLocale(languages, locales, i18n.defaultLocale)

  return locale
}

const localizedRedirect = (url: string, locale: string | undefined, request: NextRequestWithAuth) => {
  let _url = url

  const isLocaleMissing = isUrlMissingLocale(_url)

  if (isLocaleMissing) {
    _url = getLocalizedUrl(_url, locale ?? i18n.defaultLocale)
  }

  const _basePath = process.env.BASEPATH ?? ''

  _url = ensurePrefix(_url, `${_basePath ?? ''}`)

  const redirectUrl = new URL(_url, request.url).toString()

  return NextResponse.redirect(redirectUrl)
}

export default withAuth(
  async function middleware(request: NextRequestWithAuth) {
    const locale = getLocale(request)
    const pathname = request.nextUrl.pathname
    const token = request.nextauth.token

    const isUserLoggedIn = !!token
    const guestRoutes = ['login', 'register', 'forgot-password']
    const sharedRoutes = ['shared-route']
    const privateRoute = ![...guestRoutes, ...sharedRoutes].some(route => pathname.endsWith(route))

    if (!isUserLoggedIn && privateRoute) {
      let redirectUrl = '/login'

      if (!(pathname === '/' || pathname === `/${locale}`)) {
        const searchParamsStr = new URLSearchParams({ redirectTo: withoutSuffix(pathname, '/') }).toString()

        redirectUrl += `?${searchParamsStr}`
      }

      return localizedRedirect(redirectUrl, locale, request)
    }

    // If the user is logged in and is trying to access a guest route, redirect to the root page
    const isRequestedRouteIsGuestRoute = guestRoutes.some(route => pathname.endsWith(route))

    if (isUserLoggedIn && isRequestedRouteIsGuestRoute) {
      return localizedRedirect(HOME_PAGE_URL, locale, request)
    }

    // If the user is logged in and is trying to access root page, redirect to the home page
    if (pathname === '/' || pathname === `/${locale}`) {
      return localizedRedirect(HOME_PAGE_URL, locale, request)
    }

    // If pathname already contains a locale, return next() else redirect with localized URL
    return isUrlMissingLocale(pathname) ? localizedRedirect(pathname, locale, request) : NextResponse.next()
  },
  {
    callbacks: {
      authorized: () => {
        return true
      }
    }
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - all items inside the public folder
     *    - images (public images)
     *    - next.svg (Next.js logo)
     *    - vercel.svg (Vercel logo)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images|next.svg|vercel.svg).*)'
  ]
}
