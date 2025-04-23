import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;
  
  // Check if the path is for the admin section
  if (path.startsWith('/admin')) {
    // Check if the user is authenticated (you would use your auth system here)
    const isAuthenticated = request.cookies.has('auth-token'); // Example check
    const isAdmin = request.cookies.get('user-role')?.value === 'admin'; // Example check
    
    // If not authenticated or not an admin, redirect to login
    // if (!isAuthenticated || !isAdmin) {
    //   return NextResponse.redirect(new URL('/login?from=' + path, request.url));
    // }
  }
  
  // Continue with the request
  return NextResponse.next();
}

// Configure the middleware to run only on specific paths
export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};