import { type OnchainData } from './spirit-client';
import type { Agent } from './types';
interface ReconciledAgent extends Agent {
    onchain?: OnchainData | null;
    lastSyncAt?: string;
    dataSource: 'registry' | 'registry+spirit' | 'fallback';
}
interface ReconciliationResult {
    agents: ReconciledAgent[];
    meta: {
        total: number;
        spiritDataAvailable: boolean;
        lastSyncAt: string;
        conflicts?: ReconciliationConflict[];
    };
}
interface ReconciliationConflict {
    agentId: string;
    field: string;
    registryValue: any;
    spiritValue: any;
    resolution: 'registry_wins' | 'merge' | 'skip';
}
export declare class DataReconciliationService {
    private conflicts;
    reconcileAgentData(registryAgents: Agent[]): Promise<ReconciliationResult>;
    private mergeAgentData;
    private resolveConflicts;
    private getConflictResolution;
    getAgentOnchainData(agentId: string): Promise<OnchainData | null>;
    healthCheck(): Promise<{
        reconciliationAvailable: boolean;
        spiritRegistryHealth: {
            available: boolean;
            latency?: number;
            error?: string;
        };
    }>;
    getStats(): {
        conflictsDetected: number;
        lastReconciliation?: string;
    };
}
export declare const dataReconciliation: DataReconciliationService;
export type { ReconciledAgent, ReconciliationResult, ReconciliationConflict };
