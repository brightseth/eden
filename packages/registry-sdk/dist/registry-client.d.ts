import { Agent, AgentProfileConfig } from '@/lib/profile/types';
export interface RegistryResponse<T> {
    data?: T;
    error?: string;
    source: 'registry' | 'cache' | 'fallback';
}
interface RegistryWork {
    id: string;
    agentId: string;
    title: string;
    mediaUri?: string;
    description?: string;
    createdAt: string;
    metadata?: Record<string, any>;
}
interface RegistryLore {
    version: string;
    identity: any;
    origin: any;
    philosophy: any;
    expertise: any;
    voice: any;
    culture: any;
    personality: any;
    relationships: any;
    currentContext: any;
    conversationFramework: any;
    knowledge: any;
    timeline: any;
    artisticPractice?: any;
    divinationPractice?: any;
    curationPhilosophy?: any;
    governanceFramework?: any;
    updatedAt: string;
    updatedBy: string;
}
declare class RegistryClient {
    private baseUrl;
    private apiKey;
    private cache;
    private cacheTimeout;
    private isAvailable;
    private lastHealthCheck;
    private healthCheckInterval;
    constructor();
    private checkHealth;
    private getCachedData;
    private setCachedData;
    private transformRegistryAgent;
    getAgent(handle: string): Promise<RegistryResponse<Agent>>;
    getAgentConfig(handle: string): Promise<RegistryResponse<AgentProfileConfig>>;
    getAgentWorks(handle: string, limit?: number): Promise<RegistryResponse<RegistryWork[]>>;
    getAgentLore(handle: string): Promise<RegistryResponse<RegistryLore>>;
    getAllAgents(): Promise<RegistryResponse<Agent[]>>;
    private getFallbackAgent;
    private getFallbackConfig;
    private getFallbackLore;
    private getFallbackAgents;
    subscribeToAgent(handle: string, callback: (agent: Agent) => void): () => void;
    subscribeToWorks(handle: string, callback: (works: RegistryWork[]) => void): () => void;
    clearCache(): void;
    refreshAgent(handle: string): Promise<RegistryResponse<Agent>>;
}
export declare const registryClient: RegistryClient;
export {};
