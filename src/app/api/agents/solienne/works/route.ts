import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const BASE = process.env.WORKS_REGISTRY_URL;
const BYPASS = process.env.WORKS_REGISTRY_BYPASS;

const HOP = new Set(['connection','keep-alive','proxy-authenticate','proxy-authorization','te','trailer','transfer-encoding','upgrade']);

export async function GET(req: Request) {
  const u = new URL(req.url);
  
  // Registry-First Pattern (ADR-022 compliance)
  // 1. Try Registry API first
  try {
    const registryUrl = `https://registry.eden2.io/api/v1/agents/solienne/works${u.search}`;
    const registryResponse = await fetch(registryUrl, {
      headers: {
        'accept': 'application/json',
        'x-academy': 'eden'
      },
      cache: 'no-store',
      signal: AbortSignal.timeout(5000)
    });
    
    if (registryResponse.ok) {
      const data = await registryResponse.json();
      console.log('[SOLIENNE Works] Registry success');
      return NextResponse.json(data, {
        headers: {
          'cache-control': 'public, max-age=60, stale-while-revalidate=300',
          'x-data-source': 'registry'
        }
      });
    }
  } catch (e) {
    console.log('[SOLIENNE Works] Registry fallback:', String(e));
  }
  
  // 2. Fallback to Works Registry if configured
  if (BASE) {
    const target = `${BASE}/api/v1/agents/solienne/works${u.search}`;
    const ac = new AbortController();
    const t = setTimeout(() => ac.abort(), 7000);

    try {
      const headers: Record<string, string> = { 
        'accept': 'application/json',
        'x-academy': 'eden',
        'x-forwarded-for': req.headers.get('x-forwarded-for') || 'unknown'
      };
      
      if (BYPASS) {
        headers['x-vercel-protection-bypass'] = BYPASS;
      }

      const r = await fetch(target, {
        headers,
        cache: 'no-store',
        signal: ac.signal
      });
      
      const h = new Headers(r.headers);
      for (const k of Array.from(h.keys())) {
        if (HOP.has(k.toLowerCase())) h.delete(k);
      }
      
      // Add cache control and source header
      h.set('cache-control', 'public, max-age=60, stale-while-revalidate=300');
      h.set('x-data-source', 'works-registry');
      
      // Parse and clean the response to fix URL encoding issues
      try {
        const data = await r.json();
        if (data.items) {
          data.items = data.items.map((item: any) => ({
            ...item,
            signed_url: item.signed_url?.replace(/%0A/g, '')
          }));
        }
        console.log('[SOLIENNE Works] Works Registry success');
        return NextResponse.json(data, { status: r.status, headers: h });
      } catch {
        // If parsing fails, return raw body
        return new NextResponse(r.body, { status: r.status, headers: h });
      }
    } catch (e: any) {
      const reason = e.name === 'AbortError' ? 'timeout' : String(e);
      console.error(`[SOLIENNE Works Proxy] Works Registry failed: ${reason} for ${target}`);
    } finally {
      clearTimeout(t);
    }
  }
  
  // 3. Never fail - return structured empty state (ADR-022)
  console.log('[SOLIENNE Works] Using fallback empty state');
  return NextResponse.json({ 
    items: [], 
    nextCursor: null,
    metadata: {
      total: 0,
      source: 'fallback',
      message: 'No works available - using graceful degradation'
    }
  }, {
    headers: {
      'cache-control': 'public, max-age=30, stale-while-revalidate=60',
      'x-data-source': 'fallback'
    }
  });
}