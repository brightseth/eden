import { NextRequest, NextResponse } from 'next/server';
import { checkRegistryHealth } from '@/lib/registry/health-monitor';

// GET /api/registry/health - Check Registry health status
export async function GET(request: NextRequest) {
  try {
    const health = await checkRegistryHealth();

    // Determine HTTP status based on Registry health
    const httpStatus = health.healthy ? 200 : 
                      health.status.status === 'degraded' ? 503 : 500;

    return NextResponse.json({
      success: health.healthy,
      registry: {
        status: health.status.status,
        message: health.status.message,
        lastCheck: health.status.lastCheck,
        lastSuccess: health.status.lastSuccess,
        consecutiveFailures: health.status.consecutiveFailures,
        latency: `${health.status.latency}ms`
      },
      metrics: {
        availability: `${health.metrics.availability}%`,
        avgLatency: `${health.metrics.avgLatency}ms`,
        lastOutage: health.metrics.lastOutage
      },
      enforcement: {
        mode: 'strict',
        fallbacks: 'disabled',
        message: 'Registry is the single source of truth - no static data fallbacks'
      }
    }, { status: httpStatus });

  } catch (error) {
    console.error('[Registry Health API] Error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Health check failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      enforcement: {
        mode: 'strict',
        fallbacks: 'disabled',
        message: 'System requires Registry - cannot operate with static data'
      }
    }, { status: 500 });
  }
}