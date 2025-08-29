import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || '';
  
  // Handle *.eden2.io subdomains
  if (host.includes('.eden2.io')) {
    const subdomain = host.split('.')[0];
    
    // Skip www and api subdomains
    if (['www', 'api'].includes(subdomain)) {
      return NextResponse.next();
    }
    
    // Route to agent-specific page
    return NextResponse.rewrite(
      new URL(`/${subdomain}${request.nextUrl.pathname}`, request.url)
    );
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
};
