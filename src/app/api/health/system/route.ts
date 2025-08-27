import { NextRequest, NextResponse } from 'next/server';
import { registryClient } from '@/lib/registry/client';

// GET /api/health/system - Comprehensive system health check
export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  const systemChecks = {
    registry: { status: 'unknown', details: '', responseTime: 0, critical: true },
    database: { status: 'unknown', details: '', responseTime: 0, critical: true },
    api_endpoints: { status: 'unknown', details: '', responseTime: 0, critical: true },
    agent_infrastructure: { status: 'unknown', details: '', count: 0, critical: false },
    fallback_systems: { status: 'unknown', details: '', critical: false }
  };

  // Test 1: Registry Health
  try {
    const registryStart = Date.now();
    const { agents, isFromRegistry, error } = await registryClient.getAgentsWithFallbackDetection({
      status: 'ACTIVE'
    });
    systemChecks.registry.responseTime = Date.now() - registryStart;
    
    if (isFromRegistry && !error && agents.length > 0) {
      systemChecks.registry.status = 'healthy';
      systemChecks.registry.details = `Registry operational with ${agents.length} agents`;
    } else if (isFromRegistry && error) {
      systemChecks.registry.status = 'degraded';
      systemChecks.registry.details = error;
    } else {
      systemChecks.registry.status = 'unhealthy';
      systemChecks.registry.details = error || 'Registry not accessible';
    }
  } catch (error) {
    systemChecks.registry.status = 'unhealthy';
    systemChecks.registry.details = error instanceof Error ? error.message : 'Registry check failed';
    systemChecks.registry.responseTime = Date.now() - startTime;
  }

  // Test 2: Database Connectivity (via API endpoints)
  try {
    const dbStart = Date.now();
    const miyomiResponse = await fetch(`${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/api/miyomi/real-picks?limit=1`);
    systemChecks.database.responseTime = Date.now() - dbStart;
    
    if (miyomiResponse.ok) {
      systemChecks.database.status = 'healthy';
      systemChecks.database.details = 'Supabase database responding correctly';
    } else {
      systemChecks.database.status = 'degraded';
      systemChecks.database.details = `Database API returned ${miyomiResponse.status}`;
    }
  } catch (error) {
    systemChecks.database.status = 'unhealthy';
    systemChecks.database.details = error instanceof Error ? error.message : 'Database connectivity failed';
  }

  // Test 3: Core API Endpoints
  try {
    const apiStart = Date.now();
    const endpoints = [
      '/api/agents',
      '/api/metrics',
      '/api/health'
    ];
    
    const results = await Promise.allSettled(
      endpoints.map(async (endpoint) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}${endpoint}`);
        return { endpoint, ok: response.ok, status: response.status };
      })
    );
    
    systemChecks.api_endpoints.responseTime = Date.now() - apiStart;
    
    const successful = results.filter(r => r.status === 'fulfilled' && r.value.ok).length;
    const total = results.length;
    
    if (successful === total) {
      systemChecks.api_endpoints.status = 'healthy';
      systemChecks.api_endpoints.details = `All ${total} core API endpoints operational`;
    } else if (successful > 0) {
      systemChecks.api_endpoints.status = 'degraded';
      systemChecks.api_endpoints.details = `${successful}/${total} API endpoints operational`;
    } else {
      systemChecks.api_endpoints.status = 'unhealthy';
      systemChecks.api_endpoints.details = 'Critical API endpoints not responding';
    }
  } catch (error) {
    systemChecks.api_endpoints.status = 'unhealthy';
    systemChecks.api_endpoints.details = 'API endpoint testing failed';
  }

  // Test 4: Agent Infrastructure
  try {
    // Check agent-specific endpoints
    const agentEndpoints = [
      '/api/agents/miyomi/performance',
      '/api/miyomi/status',
      '/api/agents/abraham/status'
    ];
    
    const agentResults = await Promise.allSettled(
      agentEndpoints.map(async (endpoint) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}${endpoint}`);
        return response.ok;
      })
    );
    
    const workingAgents = agentResults.filter(r => r.status === 'fulfilled' && r.value).length;
    systemChecks.agent_infrastructure.count = workingAgents;
    
    if (workingAgents >= 2) {
      systemChecks.agent_infrastructure.status = 'healthy';
      systemChecks.agent_infrastructure.details = `${workingAgents} agent endpoints operational`;
    } else if (workingAgents > 0) {
      systemChecks.agent_infrastructure.status = 'degraded';
      systemChecks.agent_infrastructure.details = `Only ${workingAgents} agent endpoints working`;
    } else {
      systemChecks.agent_infrastructure.status = 'unhealthy';
      systemChecks.agent_infrastructure.details = 'No agent endpoints responding';
    }
  } catch (error) {
    systemChecks.agent_infrastructure.status = 'unhealthy';
    systemChecks.agent_infrastructure.details = 'Agent infrastructure check failed';
  }

  // Test 5: Fallback Systems
  try {
    const fallbackTests = [];
    
    // Test Registry fallback
    if (!registryClient.isEnabled()) {
      fallbackTests.push('Registry fallback mode active');
    } else if (systemChecks.registry.status !== 'healthy') {
      fallbackTests.push('Registry fallback available');
    }
    
    // Test local data availability
    try {
      const { EDEN_AGENTS } = await import('@/data/eden-agents-manifest');
      if (EDEN_AGENTS.length > 0) {
        fallbackTests.push('Local agent manifest available');
      }
    } catch {
      fallbackTests.push('Local agent manifest missing');
    }
    
    if (fallbackTests.some(test => test.includes('available') || test.includes('active'))) {
      systemChecks.fallback_systems.status = 'healthy';
      systemChecks.fallback_systems.details = fallbackTests.join(', ');
    } else {
      systemChecks.fallback_systems.status = 'warning';
      systemChecks.fallback_systems.details = 'Fallback systems not fully configured';
    }
  } catch (error) {
    systemChecks.fallback_systems.status = 'unhealthy';
    systemChecks.fallback_systems.details = 'Fallback system check failed';
  }

  // Calculate overall system health
  const totalResponseTime = Date.now() - startTime;
  const criticalChecks = Object.entries(systemChecks).filter(([_, check]) => check.critical);
  const nonCriticalChecks = Object.entries(systemChecks).filter(([_, check]) => !check.critical);
  
  const criticalHealthy = criticalChecks.filter(([_, check]) => check.status === 'healthy').length;
  const criticalUnhealthy = criticalChecks.filter(([_, check]) => check.status === 'unhealthy').length;
  const criticalDegraded = criticalChecks.filter(([_, check]) => 
    check.status === 'degraded' || check.status === 'warning').length;

  let overallStatus = 'healthy';
  let statusMessage = 'All systems operational';
  
  if (criticalUnhealthy > 0) {
    overallStatus = 'unhealthy';
    statusMessage = `${criticalUnhealthy} critical system(s) down`;
  } else if (criticalDegraded > 0) {
    overallStatus = 'degraded';
    statusMessage = `${criticalDegraded} critical system(s) degraded`;
  } else if (nonCriticalChecks.some(([_, check]) => check.status === 'unhealthy')) {
    overallStatus = 'warning';
    statusMessage = 'Non-critical systems issues detected';
  }

  const healthReport = {
    status: overallStatus,
    message: statusMessage,
    timestamp: new Date().toISOString(),
    responseTime: `${totalResponseTime}ms`,
    environment: {
      registry_enabled: registryClient.isEnabled(),
      registry_url: process.env.NEXT_PUBLIC_REGISTRY_URL,
      deployment_url: process.env.NEXT_PUBLIC_URL || 'localhost:3000'
    },
    checks: systemChecks,
    summary: {
      total_checks: Object.keys(systemChecks).length,
      critical_checks: criticalChecks.length,
      healthy: Object.values(systemChecks).filter(check => check.status === 'healthy').length,
      degraded: Object.values(systemChecks).filter(check => 
        check.status === 'degraded' || check.status === 'warning').length,
      unhealthy: Object.values(systemChecks).filter(check => check.status === 'unhealthy').length
    },
    alerts: generateSystemAlerts(systemChecks),
    uptime: {
      registry: systemChecks.registry.status === 'healthy' ? '100%' : 
                systemChecks.registry.status === 'degraded' ? '50%' : '0%',
      database: systemChecks.database.status === 'healthy' ? '100%' : 
                 systemChecks.database.status === 'degraded' ? '50%' : '0%',
      api: systemChecks.api_endpoints.status === 'healthy' ? '100%' : 
            systemChecks.api_endpoints.status === 'degraded' ? '50%' : '0%'
    }
  };

  // Return appropriate HTTP status
  const httpStatus = overallStatus === 'unhealthy' ? 503 : 
                    overallStatus === 'degraded' ? 207 : 
                    overallStatus === 'warning' ? 200 : 200;
  
  return NextResponse.json(healthReport, { status: httpStatus });
}

function generateSystemAlerts(checks: any): string[] {
  const alerts = [];
  
  for (const [checkName, check] of Object.entries(checks)) {
    if (check.status === 'unhealthy') {
      alerts.push(`CRITICAL: ${checkName.replace('_', ' ')} is down - ${check.details}`);
    } else if (check.status === 'degraded') {
      alerts.push(`WARNING: ${checkName.replace('_', ' ')} is degraded - ${check.details}`);
    }
  }
  
  if (alerts.length === 0) {
    alerts.push('No active alerts - all systems operational');
  }
  
  return alerts;
}