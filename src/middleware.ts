import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { applySecurityHeaders, handleCORSPreflight } from '@/lib/security/security-headers';
import { createAuthMiddleware } from '@/lib/security/auth-middleware';

// Create specialized middleware for different endpoint types
const chatAuthMiddleware = createAuthMiddleware({
  requireAuth: false,
  allowAnonymous: true,
  rateLimit: {
    requests: 10,
    windowMs: 600000 // 10 minutes to match chat config
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

  // 301 Redirect Vercel hosts to canonical eden2.io domains
  const host = request.headers.get('host');
  if (host && host.includes('vercel.app')) {
    const url = new URL(request.url);
    
    // Map Vercel hostnames to canonical eden2.io domains
    if (host.includes('eden-academy-') || host.includes('eden-academy.')) {
      url.host = 'academy.eden2.io';
    } else if (host.includes('eden-genesis-registry') || host.includes('eden-registry')) {
      url.host = 'registry.eden2.io';
    } else if (host.includes('solienne-')) {
      url.host = 'solienne.eden2.io';
    }
    
    // Only redirect if we successfully mapped to a canonical domain
    if (url.host.endsWith('.eden2.io')) {
      return NextResponse.redirect(url, 301);
    }
  }

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

  // Protect admin dashboard pages (temporarily disabled for demo)
  if (pathname.startsWith('/admin/') && process.env.NODE_ENV === 'production-with-auth') {
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

  // CRITICAL FIX: Stop API endpoints from being accessible as pages
  if (pathname.startsWith('/api/agents/') && !pathname.includes('/api/agents?')) {
    // Extract agent name from /api/agents/abraham -> abraham  
    const segments = pathname.split('/');
    const agentName = segments[3];
    
    if (agentName && 
        !pathname.includes('/works') && 
        !pathname.includes('/profile') && 
        !pathname.includes('/predictions') &&
        !pathname.includes('/evaluate') &&
        !pathname.includes('/advisory-report') && 
        !pathname.includes('/collection-dashboard') && 
        !pathname.includes('/registry-works') &&
        !pathname.includes('/chat') &&
        !pathname.includes('/status') &&
        !pathname.includes('/training')) {
      // Redirect /api/agents/abraham -> /agents/abraham
      return NextResponse.redirect(new URL(`/agents/${agentName}`, request.url), 301);
    }
  }

  // Redirect root agent names to proper structure
  const rootAgentPaths = ['abraham', 'solienne', 'citizen', 'miyomi', 'bertha', 'geppetto', 'koru', 'sue'];
  if (rootAgentPaths.includes(pathname.slice(1))) {
    const agentName = pathname.slice(1);
    return NextResponse.redirect(new URL(`/agents/${agentName}`, request.url), 301);
  }

  // Phase 2: URL Grammar Normalization - Canonical URL structure
  // Redirect legacy /academy/agent/* paths to canonical /agents/* structure
  if (pathname.startsWith('/academy/agent/')) {
    const agentPath = pathname.replace('/academy/agent/', '/agents/');
    return NextResponse.redirect(new URL(agentPath, request.url), 301);
  }

  // Redirect deleted and duplicate routes
  const redirects: Record<string, string> = {
    '/train': '/academy',
    '/academy/agent/miyomi': '/agents/miyomi', 
    '/academy/agent/artcollector': '/academy',
    '/academy/agent/daomanager': '/academy',
    '/academy/agent/agent07': '/apply',
    '/academy/agent/agent08': '/apply',
    '/academy/agent/agent09': '/apply',
    '/academy/agent/agent10': '/apply',
    // Redirect old structure to new canonical paths
    '/academy/abraham/covenant': '/agents/abraham',
    '/academy/abraham/early-works': '/agents/abraham',
    '/academy/abraham/drops': '/agents/abraham',
    '/academy/solienne/generations': '/agents/solienne',
    '/academy/solienne/paris-photo': '/agents/solienne',
    '/academy/solienne/practice': '/agents/solienne',
    '/academy/solienne/drops': '/agents/solienne'
  };

  if (redirects[pathname]) {
    return NextResponse.redirect(new URL(redirects[pathname], request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths for domain redirects (excluding static assets)
    '/((?!_next/static|_next/image|favicon.ico).*)',
    // CRITICAL: Fix broken API endpoint routing
    '/api/agents/:path*',
    // CRITICAL: Fix root agent path redirects 
    '/abraham',
    '/solienne',
    '/citizen', 
    '/miyomi',
    '/bertha',
    '/geppetto',
    '/koru',
    '/sue',
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