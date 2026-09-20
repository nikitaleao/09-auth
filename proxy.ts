import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { checkSession } from './lib/api/serverApi';
import parse from 'set-cookie-parser';

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

      const setCookieHeaders = sessionResponse.headers['set-cookie'];

      if (setCookieHeaders) {
        const parsedCookies = parse.splitCookiesString(setCookieHeaders);

        parsedCookies.forEach(cookieStr => {
          const [parsedCookie] = parse.parse([cookieStr]);
          if (parsedCookie) {
            response.cookies.set(parsedCookie.name, parsedCookie.value, {
              path: parsedCookie.path || '/',
              httpOnly: parsedCookie.httpOnly,
              secure: parsedCookie.secure,
              sameSite: parsedCookie.sameSite as 'strict' | 'lax' | 'none',
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
