// Temporary middleware for authentication transition
// Will be re-enabled with NextAuth v5 compatible implementation after Sprint 1
import { NextResponse } from 'next/server';

export function middleware(request: Request) {
  // For now, allow all requests during authentication migration
  // Route protection will be re-enabled after Sprint 1 completion
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
  ],
};