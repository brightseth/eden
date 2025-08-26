import { NextResponse } from 'next/server';

// GET /api/health
export async function GET() {
  try {
    const registryUrl = process.env.EDEN_REGISTRY_API_URL || 'http://localhost:3005'
    const enableRegistrySync = process.env.ENABLE_REGISTRY_SYNC === 'true'
    
    // Basic health check
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      service: 'Eden Academy',
      env: {
        hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        hasServiceKey: !!process.env.SUPABASE_SERVICE_KEY
      },
      features: {
        registrySync: enableRegistrySync,
        registryUrl: enableRegistrySync ? registryUrl : null
      }
    }
    
    // If Registry sync is enabled, test connectivity
    if (enableRegistrySync) {
      try {
        const registryResponse = await fetch(`${registryUrl}/api/v1/status`, {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
          signal: AbortSignal.timeout(3000) // 3 second timeout
        })
        
        if (registryResponse.ok) {
          health.features.registryStatus = 'connected'
        } else {
          health.features.registryStatus = 'degraded'
          health.status = 'degraded'
        }
      } catch (error) {
        health.features.registryStatus = 'disconnected'
        health.status = 'degraded'
      }
    }
    
    return NextResponse.json(health)
  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}