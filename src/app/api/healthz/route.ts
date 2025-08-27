import { NextResponse } from 'next/server';

/**
 * Liveness probe - never touches external dependencies
 * Returns 200 if the service is alive, regardless of dependencies
 */
export async function GET() {
  const gitSha = process.env.VERCEL_GIT_COMMIT_SHA || 
                process.env.GIT_SHA || 
                'development';
                
  return NextResponse.json({
    ok: true,
    timestamp: new Date().toISOString(),
    service: 'Eden Academy',
    version: '1.0.0',
    git: gitSha.substring(0, 8)
  }, {
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    }
  });
}