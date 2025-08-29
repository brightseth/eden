import { Agent as RegistryAgent, Creation } from './sdk';
export declare class LiveRegistrySync {
    private client;
    private cache;
    private cacheExpiry;
    constructor();
    fetchLiveAgents(): Promise<RegistryAgent[]>;
    fetchAgentCreations(agentId: string): Promise<Creation[]>;
    transformToAcademyFormat(registryAgent: RegistryAgent): any;
    private estimateLaunchDate;
    private inferModel;
    private inferSocialProfiles;
    private inferVoice;
    getSyncStatus(): {
        lastSync: number;
        cacheValid: boolean;
        agentCount: number;
    };
    forceSync(): Promise<RegistryAgent[]>;
}
export declare const liveRegistrySync: LiveRegistrySync;
