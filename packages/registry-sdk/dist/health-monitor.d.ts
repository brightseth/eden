/**
 * Registry Health Monitoring Service
 * Tracks Registry availability and alerts on failures
 * Enforces Registry as single source of truth - no fallbacks
 */
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
export declare class RegistryHealthMonitor {
    private status;
    private checkInterval;
    private alertThreshold;
    private criticalThreshold;
    constructor();
    startMonitoring(intervalMs?: number): void;
    stopMonitoring(): void;
    performHealthCheck(): Promise<HealthCheckResult>;
    getStatus(): HealthStatus;
    isHealthy(): boolean;
    private alertDegraded;
    private alertCritical;
    private logHealthStatus;
    getMetrics(): {
        availability: number;
        avgLatency: number;
        status: string;
        lastOutage: Date | null;
    };
    enforceRegistryRequirement(): void;
}
export declare const registryHealthMonitor: RegistryHealthMonitor;
export declare function checkRegistryHealth(): Promise<{
    healthy: boolean;
    status: HealthStatus;
    metrics: ReturnType<typeof registryHealthMonitor.getMetrics>;
}>;
export {};
