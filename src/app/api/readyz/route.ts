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
/**
 * Readiness probe - checks external dependencies
 * Returns 200 only when all critical systems are healthy
 * Returns 503 with details when systems are degraded
 */
export async function GET() {
  const checks = {
    database: { healthy: false, latency: 0, error: null as string | null },
    registry: { healthy: false, latency: 0, error: null as string | null },
    queue: { healthy: true, depth: 0, error: null as string | null } // Placeholder - no actual queue yet
  };

  let overallHealthy = true;
  const startTime = Date.now();

  // Database connectivity check
  try {
    const dbStart = Date.now();
    const supabase = await getSupabase();
    
    // Simple connectivity test - just count records from a known table
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
      // Registry failure doesn't fail readiness - it's a fallback
    }
  } catch (error) {
    checks.registry.error = error instanceof Error ? error.message : 'Registry check failed';
    checks.registry.latency = Date.now() - startTime;
    // Registry failure doesn't fail readiness - it's a fallback
  }

  const totalLatency = Date.now() - startTime;
  const gitSha = process.env.VERCEL_GIT_COMMIT_SHA || 
                process.env.GIT_SHA || 
                'development';

  const response = {
    ok: overallHealthy,
    timestamp: new Date().toISOString(),
    service: 'Eden Academy',
    version: '1.0.0',
    git: gitSha.substring(0, 8),
    latency: totalLatency,
    checks
  };

  return NextResponse.json(response, {
    status: overallHealthy ? 200 : 503,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    }
  });
}