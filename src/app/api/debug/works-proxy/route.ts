export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  return new Response(JSON.stringify({
    base: process.env.WORKS_REGISTRY_URL || null,
    hasBypass: !!process.env.WORKS_REGISTRY_BYPASS,
    ts: new Date().toISOString()
  }), { headers: { 'content-type': 'application/json' }});
}