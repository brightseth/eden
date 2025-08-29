"use strict";
/**
 * Registry Health Monitoring Service
 * Tracks Registry availability and alerts on failures
 * Enforces Registry as single source of truth - no fallbacks
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.registryHealthMonitor = exports.RegistryHealthMonitor = void 0;
exports.checkRegistryHealth = checkRegistryHealth;
const generated_sdk_1 = require("@/lib/generated-sdk");
class RegistryHealthMonitor {
    constructor() {
        this.checkInterval = null;
        this.alertThreshold = 3; // Alert after 3 consecutive failures
        this.criticalThreshold = 5; // Critical after 5 consecutive failures
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
    startMonitoring(intervalMs = 30000) {
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
    stopMonitoring() {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
            this.checkInterval = null;
            console.log('[HealthMonitor] Stopped monitoring Registry');
        }
    }
    // Perform single health check
    async performHealthCheck() {
        const startTime = Date.now();
        try {
            // Try to fetch a minimal dataset to test connectivity
            const agents = await generated_sdk_1.registryApi.getAgents();
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
        }
        catch (error) {
            const latency = Date.now() - startTime;
            this.status.consecutiveFailures++;
            this.status.lastCheck = new Date();
            this.status.latency = latency;
            // Determine severity based on consecutive failures
            if (this.status.consecutiveFailures >= this.criticalThreshold) {
                this.status.status = 'critical';
                this.status.message = `CRITICAL: Registry unreachable for ${this.status.consecutiveFailures} consecutive checks`;
                this.alertCritical(error);
            }
            else if (this.status.consecutiveFailures >= this.alertThreshold) {
                this.status.status = 'degraded';
                this.status.message = `DEGRADED: Registry failing for ${this.status.consecutiveFailures} consecutive checks`;
                this.alertDegraded(error);
            }
            else {
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
    getStatus() {
        return { ...this.status };
    }
    // Check if Registry is healthy
    isHealthy() {
        return this.status.status === 'healthy';
    }
    // Alert when Registry becomes degraded
    alertDegraded(error) {
        console.warn('⚠️ [HealthMonitor] Registry DEGRADED:', {
            consecutiveFailures: this.status.consecutiveFailures,
            lastSuccess: this.status.lastSuccess,
            error: error instanceof Error ? error.message : 'Unknown error'
        });
        // Could integrate with external alerting services here
        // e.g., Sentry, DataDog, PagerDuty
    }
    // Alert when Registry becomes critical
    alertCritical(error) {
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
    logHealthStatus() {
        const emoji = {
            healthy: '✅',
            degraded: '⚠️',
            critical: '🚨'
        }[this.status.status];
        console.log(`${emoji} [HealthMonitor] Registry ${this.status.status}: ${this.status.message}`);
    }
    // Get health metrics for monitoring dashboards
    getMetrics() {
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
    enforceRegistryRequirement() {
        if (!this.isHealthy()) {
            throw new Error(`Registry is ${this.status.status}: ${this.status.message}. ` +
                'System cannot operate without Registry - no static fallback allowed.');
        }
    }
}
exports.RegistryHealthMonitor = RegistryHealthMonitor;
// Singleton instance
exports.registryHealthMonitor = new RegistryHealthMonitor();
// Auto-start monitoring if in browser
if (typeof window !== 'undefined') {
    exports.registryHealthMonitor.startMonitoring();
}
// Export for API routes
async function checkRegistryHealth() {
    const result = await exports.registryHealthMonitor.performHealthCheck();
    const status = exports.registryHealthMonitor.getStatus();
    const metrics = exports.registryHealthMonitor.getMetrics();
    return {
        healthy: result.success,
        status,
        metrics
    };
}
