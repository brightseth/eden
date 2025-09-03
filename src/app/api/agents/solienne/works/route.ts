import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const BASE = process.env.WORKS_REGISTRY_URL;
const BYPASS = process.env.WORKS_REGISTRY_BYPASS;

const HOP = new Set(['connection','keep-alive','proxy-authenticate','proxy-authorization','te','trailer','transfer-encoding','upgrade']);

export async function GET(req: Request) {
  if (!BASE) {
    return NextResponse.json({ error: 'WORKS_REGISTRY_URL not set' }, { status: 500 });
  }

  const u = new URL(req.url);
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
    
    // Add cache control
    h.set('cache-control', 'public, max-age=60, stale-while-revalidate=300');
    
    return new NextResponse(r.body, { status: r.status, headers: h });
  } catch (e: any) {
    const reason = e.name === 'AbortError' ? 'timeout' : String(e);
    console.error(`[SOLIENNE Works Proxy] Failed: ${reason} for ${target}`);
    return NextResponse.json({ error: 'proxy_failed', reason, target }, { status: 502 });
  } finally {
    clearTimeout(t);
  }
}