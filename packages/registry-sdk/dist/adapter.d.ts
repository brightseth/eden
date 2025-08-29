import type { Agent, AgentQuery, Creation, CreationPost } from './types';
export declare class DataAdapter {
    private gatewayOnly;
    constructor();
    getAgents(query?: AgentQuery): Promise<Agent[]>;
    getAgent(id: string, include?: string[]): Promise<Agent | null>;
    postCreation(agentId: string, creation: CreationPost): Promise<Creation | null>;
    getAgentCreations(agentId: string, status?: 'curated' | 'published'): Promise<Creation[]>;
    private getCachedData;
    private setCachedData;
    private retryQueue;
    private queueForRetry;
    private processRetryQueue;
    isUsingGateway(): boolean;
    getEnforcementStatus(): string;
}
export declare const dataAdapter: DataAdapter;
export declare function getAgents(query?: AgentQuery): Promise<Agent[]>;
export declare function getAgent(id: string, include?: string[]): Promise<Agent | null>;
export declare function getAgentCreations(agentId: string, status?: 'curated' | 'published'): Promise<Creation[]>;
export declare function postCreation(agentId: string, creation: CreationPost): Promise<Creation | null>;
