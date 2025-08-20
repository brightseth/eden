import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Redirect deleted routes
  const redirects: Record<string, string> = {
    '/train': '/academy',
    '/academy/agent/geppetto': '/academy',
    '/academy/agent/miyomi': '/academy', 
    '/academy/agent/artcollector': '/academy',
    '/academy/agent/daomanager': '/academy',
    '/academy/agent/agent07': '/apply',
    '/academy/agent/agent08': '/apply',
    '/academy/agent/agent09': '/apply',
    '/academy/agent/agent10': '/apply'
  };

  if (redirects[pathname]) {
    return NextResponse.redirect(new URL(redirects[pathname], request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/train',
    '/academy/agent/geppetto',
    '/academy/agent/miyomi', 
    '/academy/agent/artcollector',
    '/academy/agent/daomanager',
    '/academy/agent/agent07',
    '/academy/agent/agent08',
    '/academy/agent/agent09',
    '/academy/agent/agent10'
  ]
};