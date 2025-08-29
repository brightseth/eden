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
declare class RegistryMonitor {
    private metrics;
    private inconsistencies;
    private monitoringEnabled;
    constructor();
    checkDataConsistency(agentId?: string): Promise<ConsistencyReport>;
    private checkRegistryAvailability;
    private checkGatewayHealth;
    private checkAgentConsistency;
    private checkSampleConsistency;
    private checkSchemaAlignment;
    private checkFeatureFlags;
    private checkDataFlowPatterns;
    private createReport;
    trackDirectRegistryCall(): void;
    trackGatewayCall(): void;
    trackLegacyDbCall(): void;
    trackCacheHit(): void;
    trackCacheMiss(): void;
    trackCircuitBreakerTrip(): void;
    resetMetrics(): void;
    getMetrics(): DataFlowMetrics;
    generateReport(agentId?: string): Promise<string>;
}
export declare const registryMonitor: RegistryMonitor;
export declare function checkConsistency(agentId?: string): Promise<ConsistencyReport>;
export declare function getConsistencyReport(agentId?: string): Promise<string>;
export {};
