import { NextResponse } from 'next/server';
import { registryClient } from '@/lib/registry/client';

export async function GET() {
  try {
    const healthStatus = registryClient.getHealthStatus();
    const now = Date.now();
    
    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      registry: {
        enabled: healthStatus.isEnabled,
        healthy: healthStatus.isHealthy,
        lastCheck: healthStatus.lastCheck ? new Date(healthStatus.lastCheck).toISOString() : null,
        nextCheck: new Date(healthStatus.nextCheck).toISOString(),
        timeSinceLastCheck: healthStatus.lastCheck ? now - healthStatus.lastCheck : null,
        timeToNextCheck: healthStatus.nextCheck - now,
      }
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// POST endpoint to manually reset Registry health status
export async function POST() {
  try {
    registryClient.resetHealth();
    
    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      message: 'Registry health status reset successfully'
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}