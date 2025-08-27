import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rate limiting for chat endpoints - simplified without feature flags for now
  if (pathname.startsWith('/api/agents/') && pathname.endsWith('/chat')) {
    const response = NextResponse.next();
    // Basic rate limiting headers
    response.headers.set('X-RateLimit-Limit', '10');
    response.headers.set('X-RateLimit-Window', '60000');
    return response;
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
    // New agent chat endpoints
    '/api/agents/:path*/chat',
    '/agents/:path*'
  ]
};