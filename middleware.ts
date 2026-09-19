// Middleware for admin route protection
// Currently implements token-based authentication
// Role-based access will be enhanced in subsequent tasks
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  hasSafeBrowserOrigin,
  isMutatingMethod,
  requestBodyIsTooLarge,
} from '@/lib/request-security';

const ADMIN_COOKIE = "addis_admin_session";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Protect admin routes
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const session = request.cookies.get(ADMIN_COOKIE)?.value;
    
    if (!session) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }
  
  if (pathname.startsWith('/api/admin/') && isMutatingMethod(request.method)) {
    if (!hasSafeBrowserOrigin(request)) {
      return NextResponse.json({ error: 'Cross-origin request rejected.' }, { status: 403 });
    }
    if (requestBodyIsTooLarge(request)) {
      return NextResponse.json({ error: 'Request body is too large.' }, { status: 413 });
    }
  }

  const response = NextResponse.next();
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  return response;
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
  ],
};
