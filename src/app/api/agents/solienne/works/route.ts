// Academy → Registry Pure Proxy
// No fallbacks, no direct storage access

import { NextResponse } from "next/server";

// Configuration for works-registry endpoint
// In production: set WORKS_REGISTRY_URL in environment
const REGISTRY_BASE = process.env.WORKS_REGISTRY_URL || "http://localhost:3005";

// Hop-by-hop headers to strip
const HOP_BY_HOP_HEADERS = [
  'transfer-encoding',
  'connection', 
  'keep-alive',
  'upgrade',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailer'
];

export async function GET(req: Request) {
  try {
    // Build Registry URL with proper path
    const src = new URL(req.url);
    const registryUrl = `${REGISTRY_BASE}/api/v1/agents/solienne/works${src.search}`;
    
    // Build request headers with optional bypass token
    const requestHeaders: Record<string, string> = { 
      'x-academy': 'eden',
      'x-forwarded-for': req.headers.get('x-forwarded-for') || 'unknown'
    };
    
    // Add bypass token if configured (for Vercel protection)
    if (process.env.WORKS_REGISTRY_BYPASS) {
      requestHeaders['x-vercel-protection-bypass'] = process.env.WORKS_REGISTRY_BYPASS;
    }
    
    // Forward to Registry with academy identifier
    const response = await fetch(registryUrl, {
      headers: requestHeaders,
      cache: 'no-store'
    });

    // Handle errors
    if (!response.ok) {
      console.error(`Registry error: ${response.status} for ${registryUrl}`);
      return NextResponse.json(
        { error: 'Registry unavailable', status: response.status },
        { status: response.status }
      );
    }

    // Strip hop-by-hop headers
    const responseHeaders = new Headers(response.headers);
    HOP_BY_HOP_HEADERS.forEach(h => responseHeaders.delete(h));
    
    // Add cache control
    responseHeaders.set('cache-control', 'public, max-age=60, stale-while-revalidate=300');
    
    // Return proxied response
    return new Response(response.body, {
      status: response.status,
      headers: responseHeaders
    });
    
  } catch (error) {
    console.error('[SOLIENNE Works Proxy] Fatal error:', error);
    return NextResponse.json(
      { error: 'Proxy error', message: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    );
  }
}