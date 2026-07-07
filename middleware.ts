import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protected routes that require authentication
  const protectedRoutes = ['/profile', '/dashboard', '/watchlist', '/watch'];
  const authRoutes = ['/auth/login', '/auth/register', '/auth/forgot-password'];

  // Check if the current route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Get auth token from cookies (Firebase handles session)
  const hasToken = request.cookies.has('session');

  // If trying to access protected route without token, redirect to login
  if (isProtectedRoute && !hasToken) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // If accessing auth route with token, redirect to home
  // This is optional - you can allow authenticated users to view login/register
  // if (isAuthRoute && hasToken) {
  //   return NextResponse.redirect(new URL('/', request.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
