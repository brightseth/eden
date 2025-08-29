import { type ReconciledAgent } from './data-reconciliation';
import type { Agent, Creation, AgentQuery } from './types';
export declare class RegistryMigrationService {
    private migrationInProgress;
    private lastMigrationAttempt;
    private readonly MIGRATION_COOLDOWN;
    private transformManifestToRegistry;
    private mapManifestStatusToRegistry;
    private inferPrimaryMedium;
    private calculateProgressPercent;
    getAgents(query?: AgentQuery): Promise<Agent[] | ReconciledAgent[]>;
    getAgent(id: string, include?: string[]): Promise<Agent | null>;
    getAgentCreations(agentId: string, status?: 'curated' | 'published'): Promise<Creation[]>;
    private getStaticWorksBySlug;
    migrateToRegistry(): Promise<{
        success: boolean;
        message: string;
        migratedCount: number;
    }>;
    checkRegistryHealth(): Promise<{
        available: boolean;
        latency?: number;
        error?: string;
    }>;
    getMigrationStatus(): {
        inProgress: boolean;
        lastAttempt: number;
        canRetry: boolean;
    };
}
export declare const migrationService: RegistryMigrationService;
export declare function getAgentsWithFallback(query?: AgentQuery): Promise<Agent[]>;
export declare function getAgentWithFallback(id: string, include?: string[]): Promise<Agent | null>;
export declare function getAgentCreationsWithFallback(agentId: string, status?: 'curated' | 'published'): Promise<Creation[]>;
