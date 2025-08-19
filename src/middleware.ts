import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Skip middleware for static assets and API routes
  if (path.startsWith('/_next/') || path.startsWith('/api/')) {
    return NextResponse.next();
  }
  
  // Check if the path is for the admin section
  if (path.startsWith('/admin')) {
    try {
      // Get token from cookie
      const token = request.cookies.get('token')?.value;
      console.log('🔍 MIDDLEWARE - Path:', path, 'Token exists:', !!token);
      
      // Special handling for login page
      if (path === '/admin/login') {
        if (token) {
          // If user is already logged in, verify token and redirect to dashboard
          try {
            const jwtSecret = process.env.JWT_SECRET;
            if (!jwtSecret) {
              console.error('JWT_SECRET is not defined');
              return NextResponse.next();
            }
            
            const secret = new TextEncoder().encode(jwtSecret);
            const { payload } = await jwtVerify(token, secret);
            
            if (payload.role === 'admin') {
              console.log('✅ Already authenticated, redirecting to dashboard');
              return NextResponse.redirect(new URL('/admin/dashboard', request.url));
            }
          } catch (error) {
            // Token is invalid, allow access to login page
            console.log('Invalid token, allowing access to login page');
          }
        }
        return NextResponse.next();
      }
      
      // For all other admin pages, require authentication
      if (!token) {
        console.log('❌ No token found, redirecting to login');
        return NextResponse.redirect(new URL('/admin/login?from=' + encodeURIComponent(path), request.url));
      }
      
      // Verify token  
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        console.error('JWT_SECRET is not defined');
        return NextResponse.redirect(new URL('/admin/login?error=config_error', request.url));
      }
      
      // Use jose for Edge Runtime compatibility
      const secret = new TextEncoder().encode(jwtSecret);
      const { payload } = await jwtVerify(token, secret);
      console.log('✅ Token verified, role:', payload.role);
      
      // Check if user has admin role
      if (payload.role !== 'admin') {
        console.log('❌ User role is not admin:', payload.role);
        return NextResponse.redirect(new URL('/admin/login?error=unauthorized', request.url));
      }
      
      console.log('✅ User authenticated, allowing access to:', path);
      // Token is valid and user is admin, continue
      return NextResponse.next();
    } catch (error) {
      // Token is invalid, redirect to login
      console.error('🚨 MIDDLEWARE ERROR:', {
        error: error.message,
        path: path,
        hasToken: !!request.cookies.get('token')?.value,
        tokenLength: request.cookies.get('token')?.value?.length,
        jwtSecret: !!process.env.JWT_SECRET
      });
      return NextResponse.redirect(new URL('/admin/login?error=invalid_token', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};