import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { checkSession } from './lib/api/serverApi';
import * as cookie from 'cookie';

const privateRoutes = ['/profile', '/notes'];
const publicRoutes = ['/sign-in', '/sign-up'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookieStore = await cookies();

  let accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  const response = NextResponse.next();

  if (!accessToken && refreshToken) {
    try {
      const sessionResponse = await checkSession();

      const setCookieHeader = sessionResponse.headers['set-cookie'];

      if (setCookieHeader) {
        const rawCookies = Array.isArray(setCookieHeader)
          ? setCookieHeader
          : [setCookieHeader];

        rawCookies.forEach(cookieStr => {
          const parsedCookie = cookie.parseSetCookie(cookieStr);

          if (
            parsedCookie &&
            parsedCookie.name &&
            parsedCookie.value !== undefined
          ) {
            response.cookies.set(parsedCookie.name, parsedCookie.value, {
              path: parsedCookie.path || '/',
              httpOnly: parsedCookie.httpOnly,
              secure: parsedCookie.secure,
              sameSite:
                typeof parsedCookie.sameSite === 'string'
                  ? (parsedCookie.sameSite.toLowerCase() as
                      | 'strict'
                      | 'lax'
                      | 'none')
                  : undefined,
              expires: parsedCookie.expires,
              maxAge: parsedCookie.maxAge,
            });

            if (parsedCookie.name === 'accessToken') {
              accessToken = parsedCookie.value;
            }
          }
        });
      }
    } catch {}
  }

  const isPrivateKey = privateRoutes.some(route => pathname.startsWith(route));
  const isPublicKey = publicRoutes.some(route => pathname.startsWith(route));

  if (isPrivateKey && !accessToken) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  if (isPublicKey && accessToken) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};
