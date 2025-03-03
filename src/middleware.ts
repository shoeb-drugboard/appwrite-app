import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const authRoutes = ['/user/login', '/user/register'];

const protectedRoutes = ['/user/profile', '/user/orders', '/checkout'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Simple cookie check (fast but less secure)
  const hasSession =
    request.cookies.has('appwrite-session') ||
    request.cookies.has('a_session_') ||
    request.cookies.has('a_session');

  if (isAuthRoute && hasSession) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If accessing protected routes while not logged in, redirect to login
  if (isProtectedRoute && !hasSession) {
    return NextResponse.redirect(new URL('/user/login', request.url));
  }

  return NextResponse.next();
}

// Note: For enhanced security, you could verify the session with Appwrite
// but this requires initializing the client in Edge middleware
// which has limitations and performance implications

export const config = {
  matcher: [...authRoutes, ...protectedRoutes],
};
