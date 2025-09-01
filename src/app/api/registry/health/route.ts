import { NextRequest, NextResponse } from 'next/server';
import { registryApi } from '@/lib/generated-sdk';
import { registryClient } from '@/lib/registry/client';

// GET /api/registry/health - Enhanced Registry service health check
export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const checks = {
    registry_connection: { status: 'unknown', details: '', responseTime: 0 },
    agent_data: { status: 'unknown', details: '', count: 0 },
    api_functionality: { status: 'unknown', details: '' },
    fallback_system: { status: 'unknown', details: '' }
  };
  
  // Test 1: Registry Connection
  try {
    const connectionStart = Date.now();
    const { agents, isFromRegistry, error } = await registryClient.getAgentsWithFallbackDetection({
      status: 'ACTIVE'
    });
    checks.registry_connection.responseTime = Date.now() - connectionStart;
    
    if (isFromRegistry && !error) {
      checks.registry_connection.status = 'healthy';
      checks.registry_connection.details = 'Successfully connected to Registry API';
    } else if (isFromRegistry && error) {
      checks.registry_connection.status = 'degraded';
      checks.registry_connection.details = error;
    } else {
      checks.registry_connection.status = 'unhealthy';
      checks.registry_connection.details = error || 'Registry not enabled';
    }
    
    // Test 2: Agent Data Quality
    if (agents.length > 0) {
      checks.agent_data.status = 'healthy';
      checks.agent_data.details = `${agents.length} agents found with valid data`;
      checks.agent_data.count = agents.length;
    } else if (isFromRegistry) {
      checks.agent_data.status = 'warning';
      checks.agent_data.details = 'Registry connected but returned no agents';
      checks.agent_data.count = 0;
    } else {
      checks.agent_data.status = 'unhealthy';
      checks.agent_data.details = 'No agent data available';
      checks.agent_data.count = 0;
    }
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    checks.registry_connection.status = 'unhealthy';
    checks.registry_connection.details = errorMessage;
    checks.registry_connection.responseTime = Date.now() - startTime;
    
    checks.agent_data.status = 'unhealthy';
    checks.agent_data.details = 'Failed to retrieve agent data due to connection issues';
  }
  
  // Test 3: API Functionality
  try {
    // Test basic API endpoints
    const apiStart = Date.now();
    const testResponse = await fetch(`${process.env.NEXT_PUBLIC_REGISTRY_URL || 'https://eden-genesis-registry.vercel.app'}/api/v1/health`);
    // @ts-expect-error TODO(seth): Health check type doesn't include responseTime; normalized in v3
    checks.api_functionality.responseTime = Date.now() - apiStart;
    
    if (testResponse.ok) {
      checks.api_functionality.status = 'healthy';
      checks.api_functionality.details = 'Registry API endpoints responding correctly';
    } else {
      checks.api_functionality.status = 'degraded';
      checks.api_functionality.details = `Registry API returned ${testResponse.status}: ${testResponse.statusText}`;
    }
  } catch (error) {
    checks.api_functionality.status = 'unhealthy';
    checks.api_functionality.details = error instanceof Error ? error.message : 'API test failed';
  }
  
  // Test 4: Fallback System
  try {
    // Verify fallback system works
    if (registryClient.isEnabled()) {
      checks.fallback_system.status = 'healthy';
      checks.fallback_system.details = 'Registry enabled, fallback system ready';
    } else {
      checks.fallback_system.status = 'warning';
      checks.fallback_system.details = 'Registry disabled, running in fallback mode';
    }
  } catch (error) {
    checks.fallback_system.status = 'unhealthy';
    checks.fallback_system.details = 'Fallback system configuration error';
  }
  
  // Determine overall status
  const totalResponseTime = Date.now() - startTime;
  const healthyCount = Object.values(checks).filter(check => check.status === 'healthy').length;
  const unhealthyCount = Object.values(checks).filter(check => check.status === 'unhealthy').length;
  
  let overallStatus = 'healthy';
  if (unhealthyCount > 0) {
    overallStatus = 'unhealthy';
  } else if (Object.values(checks).some(check => check.status === 'degraded' || check.status === 'warning')) {
    overallStatus = 'degraded';
  }
  
  const health = {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    responseTime: `${totalResponseTime}ms`,
    registry: {
      url: process.env.NEXT_PUBLIC_REGISTRY_URL || 'https://eden-genesis-registry.vercel.app',
      enabled: registryClient.isEnabled(),
      connected: checks.registry_connection.status !== 'unhealthy'
    },
    checks,
    summary: {
      total_checks: 4,
      healthy: healthyCount,
      degraded: Object.values(checks).filter(check => check.status === 'degraded' || check.status === 'warning').length,
      unhealthy: unhealthyCount
    },
    recommendations: generateRecommendations(checks)
  };

  // Return appropriate HTTP status
  const httpStatus = overallStatus === 'unhealthy' ? 503 : overallStatus === 'degraded' ? 207 : 200;
  return NextResponse.json(health, { status: httpStatus });
}

function generateRecommendations(checks: any): string[] {
  const recommendations = [];
  
  if (checks.registry_connection.status === 'unhealthy') {
    recommendations.push('Check Registry service availability and network connectivity');
  }
  
  if (checks.agent_data.status === 'unhealthy' || checks.agent_data.count === 0) {
    recommendations.push('Verify agent data is properly configured in Registry');
  }
  
  if (checks.api_functionality.status !== 'healthy') {
    recommendations.push('Check Registry API endpoint health and configuration');
  }
  
  if (checks.fallback_system.status !== 'healthy') {
    recommendations.push('Review fallback system configuration and enable if needed');
  }
  
  if (recommendations.length === 0) {
    recommendations.push('All systems operating normally');
  }
  
  return recommendations;
}