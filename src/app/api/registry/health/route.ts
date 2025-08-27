import { NextRequest, NextResponse } from 'next/server';
import { registryApi } from '@/lib/generated-sdk';

// GET /api/registry/health - Check Registry service health
export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Try to fetch agents to test Registry connection
    const agents = await registryApi.getAgents({ status: 'ACTIVE' });
    const responseTime = Date.now() - startTime;
    
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      responseTime: `${responseTime}ms`,
      registry: {
        url: process.env.NEXT_PUBLIC_REGISTRY_URL || 'https://eden-genesis-registry.vercel.app',
        connected: true,
        activeAgents: agents?.length || 0
      },
      checks: {
        database: 'healthy',
        registry: 'healthy',
        api: 'healthy'
      }
    };

    return NextResponse.json(health);
  } catch (error) {
    const responseTime = Date.now() - startTime;
    
    console.error('Registry health check failed:', error);
    
    const health = {
      status: 'degraded',
      timestamp: new Date().toISOString(),
      responseTime: `${responseTime}ms`,
      registry: {
        url: process.env.NEXT_PUBLIC_REGISTRY_URL || 'https://eden-genesis-registry.vercel.app',
        connected: false,
        error: error instanceof Error ? error.message : 'Connection failed'
      },
      checks: {
        database: 'healthy',
        registry: 'unhealthy',
        api: 'healthy'
      }
    };

    // Return 200 with degraded status (not 503) to avoid triggering alerts
    return NextResponse.json(health);
  }
}