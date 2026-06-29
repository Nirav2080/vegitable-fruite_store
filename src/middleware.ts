import { NextResponse, type NextRequest } from 'next/server';
import { verifyAdminToken, ADMIN_COOKIE } from '@/lib/admin-session';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // The login page itself must stay public.
  if (pathname === '/admin/login') {
    // If already authenticated, send them straight to the dashboard.
    const token = request.cookies.get(ADMIN_COOKIE)?.value;
    const session = await verifyAdminToken(token);
    if (session) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    return NextResponse.next();
  }

  // Protect everything else under /admin.
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get(ADMIN_COOKIE)?.value;
    const session = await verifyAdminToken(token);
    if (!session) {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
