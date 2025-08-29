import type { Agent, Creation } from '@/lib/registry/types';
export interface UnifiedAgent extends Agent {
    monthlyRevenue: number;
    outputRate: number;
    launchDate: string;
    trainer: {
        name: string;
        id: string;
    };
    specialization: string;
    brandIdentity: {
        primaryColor: string;
        typography: 'bold' | 'regular';
        voice: string;
    };
    technicalProfile: {
        model: string;
        capabilities: string[];
        integrations: string[];
        outputRate: number;
    };
    socialProfiles: {
        twitter?: string;
        farcaster?: string;
        website?: string;
    };
    claudeSDKStatus: {
        hasClaudeSDK: boolean;
        hasEdenPlatform: boolean;
        dualInstantiation: boolean;
        registryIntegration: boolean;
        sdkVersion?: string;
        lastSync?: Date;
    };
}
declare class UnifiedAgentService {
    private transformToUnified;
    private inferModel;
    private extractSocialProfiles;
    getAgents(cohort?: string): Promise<UnifiedAgent[]>;
    getAgent(id: string): Promise<UnifiedAgent | null>;
    getAgentBySlug(slug: string): Promise<UnifiedAgent | null>;
    getAgentCreations(agentId: string): Promise<Creation[]>;
    getAgentsByCohort(cohort: string): Promise<UnifiedAgent[]>;
    getActiveAgents(): Promise<UnifiedAgent[]>;
    getUpcomingAgents(): Promise<UnifiedAgent[]>;
    calculateTotalRevenue(): Promise<number>;
    calculateAverageOutputRate(): Promise<number>;
    getHealthStatus(): Promise<{
        registry: boolean;
        fallback: boolean;
        message: string;
    }>;
    migrateToRegistry(): Promise<{
        success: boolean;
        message: string;
    }>;
}
export declare const agentService: UnifiedAgentService;
export declare function getEdenAgents(): Promise<UnifiedAgent[]>;
export declare function getAgentById(id: string): Promise<UnifiedAgent | null>;
export declare function getAgentBySlug(slug: string): Promise<UnifiedAgent | null>;
export declare function getAgentsByCohort(cohort: string): Promise<UnifiedAgent[]>;
export declare function getActiveAgents(): Promise<UnifiedAgent[]>;
export declare function getUpcomingAgents(): Promise<UnifiedAgent[]>;
export declare function calculateTotalRevenue(): Promise<number>;
export declare function calculateAverageOutputRate(): Promise<number>;
export type { UnifiedAgent };
