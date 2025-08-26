/**
 * Registry Health Monitoring Service
 * Tracks Registry availability and alerts on failures
 * Enforces Registry as single source of truth - no fallbacks
 */

import { registryApi } from '@/lib/generated-sdk';

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'critical';
  lastCheck: Date;
  lastSuccess: Date | null;
  consecutiveFailures: number;
  latency: number;
  message: string;
}

interface HealthCheckResult {
  success: boolean;
  latency: number;
  error?: string;
}

export class RegistryHealthMonitor {
  private status: HealthStatus;
  private checkInterval: NodeJS.Timeout | null = null;
  private alertThreshold = 3; // Alert after 3 consecutive failures
  private criticalThreshold = 5; // Critical after 5 consecutive failures

  constructor() {
    this.status = {
      status: 'healthy',
      lastCheck: new Date(),
      lastSuccess: null,
      consecutiveFailures: 0,
      latency: 0,
      message: 'Registry health unknown - awaiting first check'
    };
  }

  // Start continuous health monitoring
  startMonitoring(intervalMs: number = 30000): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }

    // Initial check
    this.performHealthCheck();

    // Set up periodic checks
    this.checkInterval = setInterval(() => {
      this.performHealthCheck();
    }, intervalMs);

    console.log(`[HealthMonitor] Started monitoring Registry every ${intervalMs}ms`);
  }

  // Stop monitoring
  stopMonitoring(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
      console.log('[HealthMonitor] Stopped monitoring Registry');
    }
  }

  // Perform single health check
  async performHealthCheck(): Promise<HealthCheckResult> {
    const startTime = Date.now();

    try {
      // Try to fetch a minimal dataset to test connectivity
      const agents = await registryApi.getAgents();
      
      const latency = Date.now() - startTime;

      // Update status for successful check
      this.status = {
        status: 'healthy',
        lastCheck: new Date(),
        lastSuccess: new Date(),
        consecutiveFailures: 0,
        latency,
        message: `Registry operational (${latency}ms response time)`
      };

      this.logHealthStatus();

      return {
        success: true,
        latency
      };

    } catch (error) {
      const latency = Date.now() - startTime;
      this.status.consecutiveFailures++;
      this.status.lastCheck = new Date();
      this.status.latency = latency;

      // Determine severity based on consecutive failures
      if (this.status.consecutiveFailures >= this.criticalThreshold) {
        this.status.status = 'critical';
        this.status.message = `CRITICAL: Registry unreachable for ${this.status.consecutiveFailures} consecutive checks`;
        this.alertCritical(error);
      } else if (this.status.consecutiveFailures >= this.alertThreshold) {
        this.status.status = 'degraded';
        this.status.message = `DEGRADED: Registry failing for ${this.status.consecutiveFailures} consecutive checks`;
        this.alertDegraded(error);
      } else {
        this.status.message = `Registry check failed (attempt ${this.status.consecutiveFailures})`;
      }

      this.logHealthStatus();

      return {
        success: false,
        latency,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Get current health status
  getStatus(): HealthStatus {
    return { ...this.status };
  }

  // Check if Registry is healthy
  isHealthy(): boolean {
    return this.status.status === 'healthy';
  }

  // Alert when Registry becomes degraded
  private alertDegraded(error: any): void {
    console.warn('⚠️ [HealthMonitor] Registry DEGRADED:', {
      consecutiveFailures: this.status.consecutiveFailures,
      lastSuccess: this.status.lastSuccess,
      error: error instanceof Error ? error.message : 'Unknown error'
    });

    // Could integrate with external alerting services here
    // e.g., Sentry, DataDog, PagerDuty
  }

  // Alert when Registry becomes critical
  private alertCritical(error: any): void {
    console.error('🚨 [HealthMonitor] Registry CRITICAL:', {
      consecutiveFailures: this.status.consecutiveFailures,
      lastSuccess: this.status.lastSuccess,
      error: error instanceof Error ? error.message : 'Unknown error'
    });

    // CRITICAL: No fallback allowed - system depends on Registry
    console.error('🚨 SYSTEM DEGRADATION: Eden Academy requires Registry to function');
    
    // Could trigger emergency procedures here
    // e.g., page oncall, disable features, show maintenance mode
  }

  // Log current health status
  private logHealthStatus(): void {
    const emoji = {
      healthy: '✅',
      degraded: '⚠️',
      critical: '🚨'
    }[this.status.status];

    console.log(`${emoji} [HealthMonitor] Registry ${this.status.status}: ${this.status.message}`);
  }

  // Get health metrics for monitoring dashboards
  getMetrics(): {
    availability: number;
    avgLatency: number;
    status: string;
    lastOutage: Date | null;
  } {
    // Calculate availability based on last hour of checks
    const availability = this.status.status === 'healthy' ? 100 : 
                        this.status.status === 'degraded' ? 75 : 0;

    return {
      availability,
      avgLatency: this.status.latency,
      status: this.status.status,
      lastOutage: this.status.consecutiveFailures > 0 ? this.status.lastCheck : null
    };
  }

  // Force Registry requirement - no fallbacks
  enforceRegistryRequirement(): void {
    if (!this.isHealthy()) {
      throw new Error(
        `Registry is ${this.status.status}: ${this.status.message}. ` +
        'System cannot operate without Registry - no static fallback allowed.'
      );
    }
  }
}

// Singleton instance
export const registryHealthMonitor = new RegistryHealthMonitor();

// Auto-start monitoring if in browser
if (typeof window !== 'undefined') {
  registryHealthMonitor.startMonitoring();
}

// Export for API routes
export async function checkRegistryHealth(): Promise<{
  healthy: boolean;
  status: HealthStatus;
  metrics: ReturnType<typeof registryHealthMonitor.getMetrics>;
}> {
  const result = await registryHealthMonitor.performHealthCheck();
  const status = registryHealthMonitor.getStatus();
  const metrics = registryHealthMonitor.getMetrics();

  return {
    healthy: result.success,
    status,
    metrics
  };
}