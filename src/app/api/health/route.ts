import { NextResponse } from 'next/server';

export const runtime = "nodejs";

// Lazy load Supabase to avoid bundling issues
async function getSupabase() {
  const { createClient } = await import("@/lib/supabase/server");
  return getSupabase();
}
export const runtime = "nodejs";
export const dynamic = "force-dynamic";import { registryClient } from '@/lib/registry/client';

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// GET /api/health - Backward compatible health check
// Query params:
// - ?type=liveness  -> liveness probe (never touches external deps)  
// - ?type=readiness -> readiness probe (checks DB + registry)
// - Default -> readiness probe for backward compatibility
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'readiness';
  
  const gitSha = process.env.VERCEL_GIT_COMMIT_SHA || 
                process.env.GIT_SHA || 
                'development';

  // Liveness probe - never touches external dependencies
  if (type === 'liveness') {
    return NextResponse.json({
      ok: true,
      timestamp: new Date().toISOString(),
      service: 'Eden Academy',
      version: '1.0.0',
      git: gitSha.substring(0, 8),
      type: 'liveness'
    }, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
  }

  // Readiness probe - checks external dependencies
  const checks = {
    database: { healthy: false, latency: 0, error: null as string | null },
    registry: { healthy: false, latency: 0, error: null as string | null },
    queue: { healthy: true, depth: 0, error: null as string | null }
  };

  let overallHealthy = true;
  const startTime = Date.now();

  // Database connectivity check
  try {
    const dbStart = Date.now();
    const supabase = await getSupabase();
    
    const { count, error } = await supabase
      .from('agent_archives')
      .select('*', { count: 'exact', head: true });
    
    checks.database.latency = Date.now() - dbStart;
    
    if (error) {
      checks.database.error = error.message;
      overallHealthy = false;
    } else {
      checks.database.healthy = true;
    }
  } catch (error) {
    checks.database.error = error instanceof Error ? error.message : 'Unknown database error';
    checks.database.latency = Date.now() - startTime;
    overallHealthy = false;
  }

  // Registry fallback status check
  try {
    const registryStart = Date.now();
    const healthResult = await registryClient.getSystemHealth();
    checks.registry.latency = Date.now() - registryStart;
    checks.registry.healthy = healthResult.status === 'healthy' || healthResult.status === 'disabled';
    
    if (!checks.registry.healthy) {
      checks.registry.error = healthResult.message || 'Registry health check failed';
    }
  } catch (error) {
    checks.registry.error = error instanceof Error ? error.message : 'Registry check failed';
    checks.registry.latency = Date.now() - startTime;
  }

  const totalLatency = Date.now() - startTime;

  const response = {
    ok: overallHealthy,
    timestamp: new Date().toISOString(),
    service: 'Eden Academy',
    version: '1.0.0',
    git: gitSha.substring(0, 8),
    type: 'readiness',
    latency: totalLatency,
    checks,
    // Legacy fields for backward compatibility
    status: overallHealthy ? 'healthy' : 'degraded',
    env: {
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      hasServiceKey: !!process.env.SUPABASE_SERVICE_KEY
    },
    features: {
      registrySync: process.env.ENABLE_REGISTRY_SYNC === 'true',
      registryStatus: checks.registry.healthy ? 'connected' : 'disconnected'
    }
  };

  return NextResponse.json(response, {
    status: overallHealthy ? 200 : 503,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    }
  });
}