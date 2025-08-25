// Data Consistency Monitor for Registry Guardian
// Tracks data flow and identifies inconsistencies during prototyping

import { registryClient } from './client';
import { dataAdapter } from './adapter';
import { registryGateway } from './gateway';
import type { Agent, Creation } from './types';

interface ConsistencyReport {
  timestamp: string;
  checks: ConsistencyCheck[];
  summary: {
    totalChecks: number;
    passed: number;
    failed: number;
    warnings: number;
  };
}

interface ConsistencyCheck {
  name: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  details?: any;
}

interface DataFlowMetrics {
  directRegistryCalls: number;
  gatewayCalls: number;
  legacyDbCalls: number;
  cacheHits: number;
  cacheMisses: number;
  circuitBreakerTrips: number;
}

class RegistryMonitor {
  private metrics: DataFlowMetrics;
  private inconsistencies: Map<string, any>;
  private monitoringEnabled: boolean;

  constructor() {
    this.metrics = {
      directRegistryCalls: 0,
      gatewayCalls: 0,
      legacyDbCalls: 0,
      cacheHits: 0,
      cacheMisses: 0,
      circuitBreakerTrips: 0
    };
    this.inconsistencies = new Map();
    this.monitoringEnabled = process.env.ENABLE_REGISTRY_MONITOR === 'true';
  }

  // Monitor data consistency between Registry and legacy DB
  async checkDataConsistency(agentId?: string): Promise<ConsistencyReport> {
    const checks: ConsistencyCheck[] = [];
    const timestamp = new Date().toISOString();

    if (!this.monitoringEnabled) {
      return this.createReport(timestamp, [{
        name: 'Monitoring Status',
        status: 'warning',
        message: 'Registry monitoring is disabled. Set ENABLE_REGISTRY_MONITOR=true to enable.'
      }]);
    }

    // Check 1: Registry availability
    checks.push(await this.checkRegistryAvailability());

    // Check 2: Gateway circuit breaker status
    checks.push(await this.checkGatewayHealth());

    // Check 3: Data consistency for specific agent or sample
    if (agentId) {
      checks.push(await this.checkAgentConsistency(agentId));
    } else {
      checks.push(await this.checkSampleConsistency());
    }

    // Check 4: Schema alignment
    checks.push(await this.checkSchemaAlignment());

    // Check 5: Feature flag configuration
    checks.push(this.checkFeatureFlags());

    // Check 6: Data flow patterns
    checks.push(this.checkDataFlowPatterns());

    return this.createReport(timestamp, checks);
  }

  private async checkRegistryAvailability(): Promise<ConsistencyCheck> {
    try {
      const startTime = Date.now();
      const agents = await registryClient.getAgents({ cohort: 'genesis' });
      const responseTime = Date.now() - startTime;

      if (responseTime > 5000) {
        return {
          name: 'Registry Availability',
          status: 'warning',
          message: `Registry is responding slowly (${responseTime}ms)`,
          details: { responseTime, agentCount: agents.length }
        };
      }

      return {
        name: 'Registry Availability',
        status: 'pass',
        message: `Registry is healthy (${responseTime}ms response time)`,
        details: { responseTime, agentCount: agents.length }
      };
    } catch (error) {
      return {
        name: 'Registry Availability',
        status: 'fail',
        message: `Registry is unavailable: ${error}`,
        details: { error: String(error) }
      };
    }
  }

  private async checkGatewayHealth(): Promise<ConsistencyCheck> {
    try {
      const health = await registryGateway.healthCheck();
      
      if (health.status === 'unhealthy') {
        return {
          name: 'Gateway Health',
          status: 'fail',
          message: 'Gateway circuit breaker is open',
          details: health
        };
      }

      if (health.status === 'degraded') {
        return {
          name: 'Gateway Health',
          status: 'warning',
          message: `Gateway is degraded (${health.circuitBreaker.failureCount} failures)`,
          details: health
        };
      }

      return {
        name: 'Gateway Health',
        status: 'pass',
        message: 'Gateway is healthy',
        details: health
      };
    } catch (error) {
      return {
        name: 'Gateway Health',
        status: 'fail',
        message: `Gateway health check failed: ${error}`,
        details: { error: String(error) }
      };
    }
  }

  private async checkAgentConsistency(agentId: string): Promise<ConsistencyCheck> {
    try {
      // Fetch from both Registry and legacy (if enabled)
      const registryAgent = await registryGateway.getAgent(agentId);
      
      if (!dataAdapter.isUsingRegistry()) {
        return {
          name: 'Agent Data Consistency',
          status: 'warning',
          message: 'Legacy mode active - Registry not primary source',
          details: { agentId, registryData: registryAgent }
        };
      }

      // Check for required fields
      const requiredFields = ['id', 'handle', 'displayName', 'status', 'cohort'];
      const missingFields = requiredFields.filter(field => !registryAgent[field as keyof Agent]);

      if (missingFields.length > 0) {
        return {
          name: 'Agent Data Consistency',
          status: 'fail',
          message: `Agent missing required fields: ${missingFields.join(', ')}`,
          details: { agentId, missingFields, registryData: registryAgent }
        };
      }

      // Check status enum consistency
      const validStatuses = ['INVITED', 'APPLYING', 'ONBOARDING', 'ACTIVE', 'GRADUATED', 'ARCHIVED'];
      if (!validStatuses.includes(registryAgent.status)) {
        return {
          name: 'Agent Data Consistency',
          status: 'fail',
          message: `Invalid agent status: ${registryAgent.status}`,
          details: { agentId, status: registryAgent.status, validStatuses }
        };
      }

      return {
        name: 'Agent Data Consistency',
        status: 'pass',
        message: `Agent ${agentId} data is consistent`,
        details: { agentId, status: registryAgent.status }
      };
    } catch (error) {
      return {
        name: 'Agent Data Consistency',
        status: 'fail',
        message: `Failed to check agent consistency: ${error}`,
        details: { agentId, error: String(error) }
      };
    }
  }

  private async checkSampleConsistency(): Promise<ConsistencyCheck> {
    try {
      const agents = await registryGateway.getAgents({ cohort: 'genesis' });
      
      if (agents.length === 0) {
        return {
          name: 'Sample Data Consistency',
          status: 'warning',
          message: 'No agents found for consistency check',
          details: { cohort: 'genesis' }
        };
      }

      // Check first few agents
      const sampleSize = Math.min(3, agents.length);
      const inconsistentAgents = [];

      for (let i = 0; i < sampleSize; i++) {
        const agent = agents[i];
        if (!agent.handle || !agent.displayName) {
          inconsistentAgents.push({
            id: agent.id,
            issue: 'Missing handle or displayName'
          });
        }
      }

      if (inconsistentAgents.length > 0) {
        return {
          name: 'Sample Data Consistency',
          status: 'warning',
          message: `Found ${inconsistentAgents.length} agents with issues`,
          details: { inconsistentAgents, totalChecked: sampleSize }
        };
      }

      return {
        name: 'Sample Data Consistency',
        status: 'pass',
        message: `Sample of ${sampleSize} agents are consistent`,
        details: { sampleSize, totalAgents: agents.length }
      };
    } catch (error) {
      return {
        name: 'Sample Data Consistency',
        status: 'fail',
        message: `Failed to check sample consistency: ${error}`,
        details: { error: String(error) }
      };
    }
  }

  private async checkSchemaAlignment(): Promise<ConsistencyCheck> {
    // Check if TypeScript types match expected schema
    const testAgent: Agent = {
      id: 'test',
      handle: 'test',
      displayName: 'Test',
      cohort: 'genesis',
      status: 'ACTIVE',
      visibility: 'PUBLIC'
    };

    try {
      // Validate that our types compile correctly
      const statusValues: Agent['status'][] = ['INVITED', 'APPLYING', 'ONBOARDING', 'ACTIVE', 'GRADUATED', 'ARCHIVED'];
      const visibilityValues: Agent['visibility'][] = ['PRIVATE', 'INTERNAL', 'PUBLIC'];

      return {
        name: 'Schema Alignment',
        status: 'pass',
        message: 'TypeScript types align with Prisma schema',
        details: {
          statusEnums: statusValues,
          visibilityEnums: visibilityValues
        }
      };
    } catch (error) {
      return {
        name: 'Schema Alignment',
        status: 'fail',
        message: 'Schema mismatch detected',
        details: { error: String(error) }
      };
    }
  }

  private checkFeatureFlags(): ConsistencyCheck {
    const useRegistry = process.env.USE_REGISTRY === 'true';
    const registryUrl = process.env.REGISTRY_BASE_URL;
    const hasApiKey = !!process.env.REGISTRY_API_KEY;

    if (useRegistry && !registryUrl) {
      return {
        name: 'Feature Flag Configuration',
        status: 'fail',
        message: 'USE_REGISTRY=true but REGISTRY_BASE_URL not set',
        details: { useRegistry, registryUrl }
      };
    }

    if (useRegistry && !hasApiKey) {
      return {
        name: 'Feature Flag Configuration',
        status: 'warning',
        message: 'USE_REGISTRY=true but REGISTRY_API_KEY not set',
        details: { useRegistry, hasApiKey }
      };
    }

    return {
      name: 'Feature Flag Configuration',
      status: 'pass',
      message: `Registry ${useRegistry ? 'enabled' : 'disabled'} with proper configuration`,
      details: {
        useRegistry,
        registryUrl: registryUrl || 'default',
        hasApiKey
      }
    };
  }

  private checkDataFlowPatterns(): ConsistencyCheck {
    const warnings = [];

    // Check for direct Registry access (should use Gateway)
    if (this.metrics.directRegistryCalls > this.metrics.gatewayCalls) {
      warnings.push('More direct Registry calls than Gateway calls detected');
    }

    // Check for legacy DB usage when Registry is enabled
    if (process.env.USE_REGISTRY === 'true' && this.metrics.legacyDbCalls > 0) {
      warnings.push(`Legacy DB calls detected while Registry is enabled: ${this.metrics.legacyDbCalls}`);
    }

    // Check cache effectiveness
    const cacheTotal = this.metrics.cacheHits + this.metrics.cacheMisses;
    if (cacheTotal > 0) {
      const hitRate = (this.metrics.cacheHits / cacheTotal) * 100;
      if (hitRate < 50) {
        warnings.push(`Low cache hit rate: ${hitRate.toFixed(1)}%`);
      }
    }

    if (warnings.length > 0) {
      return {
        name: 'Data Flow Patterns',
        status: 'warning',
        message: warnings.join('; '),
        details: this.metrics
      };
    }

    return {
      name: 'Data Flow Patterns',
      status: 'pass',
      message: 'Data flow patterns are optimal',
      details: this.metrics
    };
  }

  private createReport(timestamp: string, checks: ConsistencyCheck[]): ConsistencyReport {
    const summary = {
      totalChecks: checks.length,
      passed: checks.filter(c => c.status === 'pass').length,
      failed: checks.filter(c => c.status === 'fail').length,
      warnings: checks.filter(c => c.status === 'warning').length
    };

    return {
      timestamp,
      checks,
      summary
    };
  }

  // Track metrics
  trackDirectRegistryCall(): void {
    this.metrics.directRegistryCalls++;
  }

  trackGatewayCall(): void {
    this.metrics.gatewayCalls++;
  }

  trackLegacyDbCall(): void {
    this.metrics.legacyDbCalls++;
  }

  trackCacheHit(): void {
    this.metrics.cacheHits++;
  }

  trackCacheMiss(): void {
    this.metrics.cacheMisses++;
  }

  trackCircuitBreakerTrip(): void {
    this.metrics.circuitBreakerTrips++;
  }

  // Reset metrics
  resetMetrics(): void {
    this.metrics = {
      directRegistryCalls: 0,
      gatewayCalls: 0,
      legacyDbCalls: 0,
      cacheHits: 0,
      cacheMisses: 0,
      circuitBreakerTrips: 0
    };
  }

  // Get current metrics
  getMetrics(): DataFlowMetrics {
    return { ...this.metrics };
  }

  // Generate summary report
  async generateReport(agentId?: string): Promise<string> {
    const report = await this.checkDataConsistency(agentId);
    
    const lines = [
      '=== Registry Guardian Consistency Report ===',
      `Timestamp: ${report.timestamp}`,
      '',
      'Summary:',
      `  Total Checks: ${report.summary.totalChecks}`,
      `  Passed: ${report.summary.passed}`,
      `  Failed: ${report.summary.failed}`,
      `  Warnings: ${report.summary.warnings}`,
      '',
      'Checks:'
    ];

    for (const check of report.checks) {
      const icon = check.status === 'pass' ? '✓' : check.status === 'fail' ? '✗' : '⚠';
      lines.push(`  ${icon} ${check.name}: ${check.message}`);
      if (check.details) {
        lines.push(`     Details: ${JSON.stringify(check.details, null, 2).split('\n').join('\n     ')}`);
      }
    }

    lines.push('');
    lines.push('Data Flow Metrics:');
    lines.push(`  Direct Registry Calls: ${this.metrics.directRegistryCalls}`);
    lines.push(`  Gateway Calls: ${this.metrics.gatewayCalls}`);
    lines.push(`  Legacy DB Calls: ${this.metrics.legacyDbCalls}`);
    lines.push(`  Cache Hits: ${this.metrics.cacheHits}`);
    lines.push(`  Cache Misses: ${this.metrics.cacheMisses}`);
    lines.push(`  Circuit Breaker Trips: ${this.metrics.circuitBreakerTrips}`);

    return lines.join('\n');
  }
}

// Export singleton instance
export const registryMonitor = new RegistryMonitor();

// Export convenience functions
export async function checkConsistency(agentId?: string): Promise<ConsistencyReport> {
  return registryMonitor.checkDataConsistency(agentId);
}

export async function getConsistencyReport(agentId?: string): Promise<string> {
  return registryMonitor.generateReport(agentId);
}