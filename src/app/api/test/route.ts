import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Lazy load Supabase to avoid bundling issues
async function getSupabase() {
  const { createClient } = await import("@/lib/supabase/server");
  return createClient();
}
/**
 * Database connectivity and schema validation endpoint
 * Tests actual database connections and returns structured data
 */
export async function GET() {
  const startTime = Date.now();
  const tests = {
    database: { healthy: false, latency: 0, error: null as string | null },
    schemas: { 
      agent_archives: { exists: false, count: 0, error: null as string | null },
      critiques: { exists: false, count: 0, error: null as string | null }
    }
  };

  try {
    const supabase = await getSupabase();
    
    // Test 1: Agent Archives table
    const archivesStart = Date.now();
    try {
      const { data: archives, error: archivesError, count: archivesCount } = await supabase
        .from('agent_archives')
        .select('id, agent_id, title, created_date', { count: 'exact' })
        .limit(3);

      if (archivesError) {
        tests.schemas.agent_archives.error = archivesError.message;
      } else {
        tests.schemas.agent_archives.exists = true;
        tests.schemas.agent_archives.count = archivesCount || 0;
      }
      
    } catch (error) {
      tests.schemas.agent_archives.error = error instanceof Error ? error.message : 'Unknown error';
    }

    // Test 2: Critiques table  
    try {
      const { count: critiquesCount, error: critiquesError } = await supabase
        .from('critiques')
        .select('*', { count: 'exact', head: true });

      if (critiquesError) {
        tests.schemas.critiques.error = critiquesError.message;
      } else {
        tests.schemas.critiques.exists = true;
        tests.schemas.critiques.count = critiquesCount || 0;
      }
    } catch (error) {
      tests.schemas.critiques.error = error instanceof Error ? error.message : 'Unknown error';
    }

    tests.database.healthy = tests.schemas.agent_archives.exists || tests.schemas.critiques.exists;
    tests.database.latency = Date.now() - startTime;

    const gitSha = process.env.VERCEL_GIT_COMMIT_SHA || 
                  process.env.GIT_SHA || 
                  'development';

    return NextResponse.json({
      ok: tests.database.healthy,
      timestamp: new Date().toISOString(),
      service: 'Eden Academy - Database Test',
      version: '1.0.0', 
      git: gitSha.substring(0, 8),
      latency: tests.database.latency,
      tests,
      environment: {
        hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        hasServiceKey: !!process.env.SUPABASE_SERVICE_KEY,
        nodeEnv: process.env.NODE_ENV
      }
    }, {
      status: tests.database.healthy ? 200 : 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });

  } catch (error) {
    return NextResponse.json({
      ok: false,
      timestamp: new Date().toISOString(),
      service: 'Eden Academy - Database Test',
      error: error instanceof Error ? error.message : 'Unknown error',
      latency: Date.now() - startTime
    }, { 
      status: 500,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
  }
}