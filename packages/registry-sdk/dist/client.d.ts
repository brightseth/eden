import { Agent, AgentQuery, Creation, CreationPost, Profile, Persona, Artifact, Progress, ExperimentalApplication, ApplicationGatewayResponse } from './types';
declare class RegistryClient {
    private baseUrl;
    private apiKey;
    private useRegistry;
    private isHealthy;
    private lastHealthCheck;
    private healthCheckInterval;
    constructor();
    private generateTraceId;
    private handleResponse;
    private checkHealth;
    private fetchWithRetry;
    getAgents(query?: AgentQuery): Promise<Agent[]>;
    getAgent(id: string, include?: string[]): Promise<Agent>;
    getAgentByHandle(handle: string): Promise<Agent | null>;
    getAgentProfile(id: string): Promise<Profile>;
    getAgentPersonas(id: string): Promise<Persona[]>;
    getAgentArtifacts(id: string): Promise<Artifact[]>;
    getAgentCreations(id: string, status?: 'curated' | 'published'): Promise<Creation[]>;
    postCreation(agentId: string, creation: CreationPost): Promise<Creation>;
    getDashboardProgress(cohort?: string): Promise<Progress[]>;
    getAgentsWithISR(query?: AgentQuery): Promise<{
        agents: Agent[];
        revalidate: number;
    }>;
    getAgentsWithFallbackDetection(query?: AgentQuery): Promise<{
        agents: Agent[];
        isFromRegistry: boolean;
        error?: string;
    }>;
    isEnabled(): boolean;
    getHealthStatus(): {
        isEnabled: boolean;
        isHealthy: boolean;
        lastCheck: number;
        nextCheck: number;
    };
    resetHealth(): void;
    /**
     * Submit experimental application form (like Bertha trainer form)
     */
    submitExperimentalApplication(application: ExperimentalApplication): Promise<ApplicationGatewayResponse>;
    /**
     * Submit application through Gateway (intelligent routing)
     */
    submitApplicationThroughGateway(application: ExperimentalApplication): Promise<ApplicationGatewayResponse>;
    /**
     * Get experimental applications for review
     */
    getExperimentalApplications(includeExperimental?: boolean): Promise<any[]>;
    /**
     * Check system health with all new features
     */
    getSystemHealth(): Promise<any>;
}
export declare const registryClient: RegistryClient;
export declare function getAgentsForISR(query?: AgentQuery): Promise<{
    props: {
        agents: Agent[];
    };
    revalidate: number;
}>;
export {};
