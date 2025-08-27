import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { applySecurityHeaders, handleCORSPreflight } from '@/lib/security/security-headers';
import { createAuthMiddleware } from '@/lib/security/auth-middleware';

// Create specialized middleware for different endpoint types
const chatAuthMiddleware = createAuthMiddleware({
  requireAuth: true,
  rateLimit: {
    requests: 10,
    windowMs: 60000 // 1 minute
  }
});

const apiAuthMiddleware = createAuthMiddleware({
  requireAuth: false,
  allowAnonymous: true,
  rateLimit: {
    requests: 100,
    windowMs: 60000 // 1 minute
  }
});

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle CORS preflight requests first
  const corsResponse = handleCORSPreflight(request);
  if (corsResponse) {
    return corsResponse;
  }

  let response = NextResponse.next();

  // Apply security-specific middleware for different endpoint types
  if (pathname.startsWith('/api/')) {
    // Chat endpoints - require authentication and heavy rate limiting
    if (pathname.includes('/chat')) {
      const authResult = await chatAuthMiddleware(request);
      if (!authResult.success) {
        return authResult.response!;
      }
      
      // Add rate limiting headers to successful responses
      if (authResult.context) {
        response.headers.set('X-RateLimit-Limit', '10');
        response.headers.set('X-RateLimit-Window', '60000');
      }
    }
    // Admin endpoints - require admin role
    else if (pathname.startsWith('/api/admin/')) {
      const adminAuthMiddleware = createAuthMiddleware({
        requireAuth: true,
        requiredRole: 'admin',
        rateLimit: {
          requests: 50,
          windowMs: 60000
        }
      });
      
      const authResult = await adminAuthMiddleware(request);
      if (!authResult.success) {
        return authResult.response!;
      }
    }
    // Webhook endpoints - require API key
    else if (pathname.startsWith('/api/webhook/')) {
      const webhookAuthMiddleware = createAuthMiddleware({
        requireAuth: false,
        allowAnonymous: true,
        apiKeyRequired: true,
        rateLimit: {
          requests: 1000,
          windowMs: 60000
        }
      });
      
      const authResult = await webhookAuthMiddleware(request);
      if (!authResult.success) {
        return authResult.response!;
      }
    }
    // General API endpoints - public with rate limiting
    else {
      const authResult = await apiAuthMiddleware(request);
      if (!authResult.success) {
        return authResult.response!;
      }
    }

    // Apply security headers to all API responses
    response = applySecurityHeaders(response, request);
  }

  // Apply security headers to all responses
  response = applySecurityHeaders(response, request);

  // Protect admin dashboard pages
  if (pathname.startsWith('/admin/')) {
    const adminPageAuthMiddleware = createAuthMiddleware({
      requireAuth: true,
      requiredRole: 'admin',
      rateLimit: {
        requests: 100,
        windowMs: 60000
      }
    });
    
    const authResult = await adminPageAuthMiddleware(request);
    if (!authResult.success) {
      // Redirect to login or show unauthorized
      return NextResponse.redirect(new URL('/api/auth/login', request.url));
    }
  }

  // Redirect deleted and duplicate routes
  const redirects: Record<string, string> = {
    '/train': '/academy',
    '/academy/agent/miyomi': '/academy', 
    '/academy/agent/artcollector': '/academy',
    '/academy/agent/daomanager': '/academy',
    '/academy/agent/agent07': '/apply',
    '/academy/agent/agent08': '/apply',
    '/academy/agent/agent09': '/apply',
    '/academy/agent/agent10': '/apply',
    // Redirect old structure to new
    '/academy/abraham/covenant': '/academy/agent/abraham',
    '/academy/abraham/early-works': '/academy/agent/abraham/early-works',
    '/academy/abraham/drops': '/academy/agent/abraham',
    '/academy/solienne/generations': '/academy/agent/solienne/generations',
    '/academy/solienne/paris-photo': '/academy/agent/solienne',
    '/academy/solienne/practice': '/academy/agent/solienne',
    '/academy/solienne/drops': '/academy/agent/solienne'
  };

  if (redirects[pathname]) {
    return NextResponse.redirect(new URL(redirects[pathname], request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Legacy redirect routes
    '/train',
    '/academy/agent/miyomi', 
    '/academy/agent/artcollector',
    '/academy/agent/daomanager',
    '/academy/agent/agent07',
    '/academy/agent/agent08',
    '/academy/agent/agent09',
    '/academy/agent/agent10',
    '/academy/abraham/:path*',
    '/academy/solienne/:path*',
    '/agents/:path*',
    // Admin page protection
    '/admin/:path*',
    // API security routes
    '/api/((?!_next/static|_next/image|favicon.ico).*)',
    // Apply to all API endpoints for security headers
    '/api/:path*'
  ]
};