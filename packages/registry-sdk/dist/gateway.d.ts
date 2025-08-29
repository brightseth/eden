import { type GovernanceProposal, type SnapshotProposal, type VotingPowerResult, type ProposalSyncResult, type SnapshotSpace } from './snapshot-service';
import type { Agent, AgentQuery, Creation, CreationPost, Profile, Persona } from './types';
interface GatewayConfig {
    maxRetries: number;
    retryDelay: number;
    circuitBreakerThreshold: number;
    circuitBreakerTimeout: number;
    enableCache: boolean;
    cacheTimeout: number;
}
interface CircuitBreakerState {
    failureCount: number;
    lastFailureTime: number;
    isOpen: boolean;
    nextRetryTime: number;
}
declare class RegistryGateway {
    private config;
    private circuitBreaker;
    private cache;
    private traceCounter;
    private apiClient;
    constructor(config?: Partial<GatewayConfig>);
    private generateTraceId;
    private checkCircuitBreaker;
    private handleFailure;
    private handleSuccess;
    private getCached;
    private setCache;
    private gatewayCall;
    getAgents(query?: AgentQuery): Promise<Agent[]>;
    getAgent(id: string, include?: string[]): Promise<Agent>;
    getAgentProfile(id: string): Promise<Profile>;
    getAgentPersonas(id: string): Promise<Persona[]>;
    getAgentCreations(id: string, status?: 'CURATED' | 'PUBLISHED'): Promise<Creation[]>;
    postCreation(agentId: string, creation: Omit<Creation, 'id'>, headers?: Record<string, string | undefined>): Promise<Creation>;
    startMagicAuth(email: string): Promise<{
        message: string;
        success: boolean;
    }>;
    completeMagicAuth(token: string): Promise<{
        success: boolean;
        token?: string;
        user?: any;
        error?: string;
    }>;
    authenticateRequest(headers: Record<string, string | undefined>): Promise<{
        authenticated: boolean;
        user?: any;
        error?: string;
    }>;
    healthCheck(): Promise<{
        status: 'healthy' | 'degraded' | 'unhealthy';
        circuitBreaker: CircuitBreakerState;
        cache: {
            redis: boolean;
            fallback: boolean;
            memorySize: number;
            totalEntries: number;
            stats?: any;
        };
    }>;
    createSnapshotProposal(spaceId: string, proposal: GovernanceProposal, headers?: Record<string, string | undefined>): Promise<SnapshotProposal>;
    getSnapshotSpace(spaceId: string): Promise<SnapshotSpace>;
    getSnapshotProposal(proposalId: string): Promise<SnapshotProposal>;
    getSnapshotVotingPower(spaceId: string, address: string): Promise<VotingPowerResult>;
    castSnapshotVote(proposalId: string, choice: number, address: string, headers?: Record<string, string | undefined>): Promise<{
        success: boolean;
        txHash?: string;
    }>;
    syncSnapshotProposal(proposalId: string, registryWorkId: string, headers?: Record<string, string | undefined>): Promise<ProposalSyncResult>;
    clearCache(): void;
    resetCircuitBreaker(): void;
}
export declare const registryGateway: RegistryGateway;
export { RegistryGateway };
export declare function getAgents(query?: AgentQuery): Promise<Agent[]>;
export declare function getAgent(id: string, include?: string[]): Promise<Agent>;
export declare function getAgentCreations(agentId: string, status?: 'curated' | 'published'): Promise<Creation[]>;
export declare function postCreation(agentId: string, creation: CreationPost): Promise<Creation>;
