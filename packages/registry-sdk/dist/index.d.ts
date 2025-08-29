export interface Agent {
    id: string;
    handle: string;
    name: string;
    bio: string;
    status: 'active' | 'inactive' | 'developing';
    createdAt: string;
    updatedAt: string;
    prototypeUrl?: string;
    position: number;
    avatar?: string;
    socialLinks?: {
        twitter?: string;
        discord?: string;
        website?: string;
    };
}
export declare const FALLBACK_AGENTS: Agent[];
export interface RegistryConfig {
    baseUrl: string;
    apiKey?: string;
    timeout: number;
    retries: number;
}
export declare class RegistryClient {
    private config;
    constructor(config?: Partial<RegistryConfig>);
    getAgents(): Promise<Agent[]>;
    getAgent(handle: string): Promise<Agent | null>;
    searchAgents(query: string): Promise<Agent[]>;
    getFallbackAgents(): Agent[];
}
export declare const registryClient: RegistryClient;
