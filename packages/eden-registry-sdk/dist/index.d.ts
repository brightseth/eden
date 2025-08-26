/**
 * Eden Registry SDK
 * Official SDK for accessing Eden Genesis Registry - the single source of truth for all agent data
 *
 * ENFORCES:
 * - No static data fallbacks
 * - All agent data from Registry
 * - Contract validation on responses
 * - Proper error handling
 */
export interface Agent {
    id: string;
    handle: string;
    displayName: string;
    role: 'creator' | 'curator' | 'collector' | 'governance' | 'predictor';
    status: 'INVITED' | 'ONBOARDING' | 'ACTIVE' | 'GRADUATED';
    visibility: 'PUBLIC' | 'PRIVATE';
    cohort: string;
    profile: AgentProfile;
    counts: AgentCounts;
    createdAt: string;
    updatedAt: string;
}
export interface AgentProfile {
    statement: string;
    tags: string[];
    links: {
        specialty: {
            medium: string;
            description: string;
            dailyGoal: string;
        };
    };
}
export interface AgentCounts {
    creations: number;
    personas: number;
    artifacts: number;
}
export interface Creation {
    id: string;
    agentId: string;
    type: 'artwork' | 'text' | 'prediction' | 'curation' | 'governance';
    title: string;
    description: string;
    metadata: Record<string, any>;
    status: 'draft' | 'published' | 'curated';
    createdAt: string;
    updatedAt: string;
}
export interface ApiResponse<T> {
    success: boolean;
    data: T;
    error?: string;
    meta?: {
        total: number;
        page: number;
        limit: number;
    };
}
export interface SDKConfig {
    baseUrl?: string;
    timeout?: number;
    headers?: Record<string, string>;
    onError?: (error: Error) => void;
}
export declare class RegistryClient {
    private baseUrl;
    private timeout;
    private headers;
    private onError?;
    constructor(config?: SDKConfig);
    private request;
    private validateResponse;
    agents: {
        list: (params?: {
            cohort?: string;
            status?: string;
            role?: string;
            limit?: number;
            offset?: number;
        }) => Promise<Agent[]>;
        get: (id: string) => Promise<Agent>;
        getByHandle: (handle: string) => Promise<Agent>;
        update: (id: string, updates: Partial<Agent>) => Promise<Agent>;
    };
    creations: {
        list: (agentId: string, params?: {
            status?: "draft" | "published" | "curated";
            type?: string;
            limit?: number;
            offset?: number;
        }) => Promise<Creation[]>;
        get: (agentId: string, creationId: string) => Promise<Creation>;
        create: (agentId: string, creation: Omit<Creation, "id" | "agentId" | "createdAt" | "updatedAt">) => Promise<Creation>;
        update: (agentId: string, creationId: string, updates: Partial<Creation>) => Promise<Creation>;
    };
    health(): Promise<{
        status: 'ok' | 'degraded' | 'down';
        message: string;
        timestamp: string;
    }>;
    batch: {
        getAgents: (ids: string[]) => Promise<Agent[]>;
        getCreations: (agentIds: string[]) => Promise<Record<string, Creation[]>>;
    };
}
export declare const registryClient: RegistryClient;
export declare const getAgent: (id: string) => Promise<Agent>;
export declare const getAgentByHandle: (handle: string) => Promise<Agent>;
export declare const listAgents: (params?: Parameters<typeof registryClient.agents.list>[0]) => Promise<Agent[]>;
export declare const getAgentCreations: (agentId: string, params?: Parameters<typeof registryClient.creations.list>[1]) => Promise<Creation[]>;
export declare const SDK_VERSION = "1.0.0";
export declare const REGISTRY_VERSION = "1.0.0";
