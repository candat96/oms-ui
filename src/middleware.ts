import { NextResponse } from 'next/server'

import type { NextRequestWithAuth } from 'next-auth/middleware'
import { withAuth } from 'next-auth/middleware'

import { ensurePrefix, withoutSuffix } from './utils/string'

const HOME_PAGE_URL = '/home'

const _redirect = (url: string, request: NextRequestWithAuth) => {
  const _url = ensurePrefix(url, `${process.env.BASEPATH}`)

  const redirectUrl = new URL(_url, request.url).toString()

  return NextResponse.redirect(redirectUrl)
}

export default withAuth(
  async function middleware(request: NextRequestWithAuth) {
    const pathname = request.nextUrl.pathname
    const token = request.nextauth.token

    const isUserLoggedIn = !!token
    const guestRoutes = ['login', 'register', 'forgot-password']
    const sharedRoutes = ['shared-route']
    const privateRoute = ![...guestRoutes, ...sharedRoutes].some(route => pathname.endsWith(route))

    if (!isUserLoggedIn && privateRoute) {
      let redirectUrl = '/login'

      if (pathname !== '/') {
        const searchParamsStr = new URLSearchParams({ redirectTo: withoutSuffix(pathname, '/') }).toString()

        redirectUrl += `?${searchParamsStr}`
      }

      return _redirect(redirectUrl, request)
    }

    const isRequestedRouteIsGuestRoute = guestRoutes.some(route => pathname.endsWith(route))

    if (isUserLoggedIn && isRequestedRouteIsGuestRoute) {
      const url = new URL(request.url)
      const searchParams = new URLSearchParams(url.search)
      const redirectURL = searchParams.get('redirectTo') ?? HOME_PAGE_URL

      return _redirect(redirectURL, request)
    }

    if (pathname === '/') return _redirect(HOME_PAGE_URL, request)

    return NextResponse.next()
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
