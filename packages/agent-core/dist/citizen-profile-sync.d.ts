/**
 * CITIZEN Profile Synchronization Service
 * Handles bidirectional sync between Eden Academy and app.eden.art
 */
export interface CitizenProfileData {
    id: 'citizen';
    displayName: 'CITIZEN';
    handle: 'citizen';
    agentType: 'bright_moments_dao_agent';
    status: 'ACTIVE';
    identity: {
        philosophy: string;
        approach: string;
        themes: string[];
        specialty: string;
        values: string[];
        mission: string[];
    };
    capabilities: {
        community_guidance: Record<string, string>;
        dao_governance: Record<string, any>;
        collector_recognition: Record<string, string>;
        cultural_archival: Record<string, string>;
    };
    brightMomentsFacts: {
        organization: string;
        cryptocitizens: string;
        golden_tokens: string;
        rcs: string;
        governance: string;
        irl_minting: string;
    };
    cityTimeline: Record<string, {
        collection: string;
        supply: number;
        significance: string;
    }>;
    communityStructure: Record<string, {
        total?: number;
        description: string;
        rights?: string[];
        recognition?: string;
        estimated_count?: string;
        function?: string;
    }>;
    stats: {
        total_cryptocitizens: number;
        cities_completed: number;
        collections_minted: Record<string, any>;
        governance_proposals: number;
        dao_health: number;
        community_engagement: number;
        milestone_achievements: string[];
    };
    profile: {
        statement: string;
        capabilities: string[];
        primaryMedium: 'governance';
        aestheticStyle: 'professional_dao_representative';
        culturalContext: 'bright_moments_ecosystem';
        lastTrainingUpdate?: string;
        trainer?: {
            name: string;
            role: string;
            contact: string;
        };
    };
    sync: {
        lastSyncToEdenArt: string;
        lastSyncFromEdenArt: string;
        syncVersion: string;
        pendingUpdates: string[];
        syncStatus: 'in_sync' | 'pending_updates' | 'sync_error';
    };
}
export declare class CitizenProfileSyncService {
    private syncInProgress;
    private lastSyncTimestamp;
    private syncInterval;
    /**
     * Generate current CITIZEN profile data for synchronization
     */
    generateProfileData(): Promise<CitizenProfileData>;
    /**
     * Sync CITIZEN profile to Eden Academy Registry
     */
    syncToRegistry(profileData: CitizenProfileData): Promise<{
        success: boolean;
        registryResponse?: any;
        error?: string;
    }>;
    /**
     * Sync CITIZEN profile to app.eden.art (placeholder for external API)
     */
    syncToEdenArt(profileData: CitizenProfileData): Promise<{
        success: boolean;
        response?: any;
        error?: string;
    }>;
    /**
     * Full bidirectional synchronization
     */
    performFullSync(): Promise<{
        success: boolean;
        registrySync: any;
        edenArtSync: any;
        profileData: CitizenProfileData;
        error?: string;
    }>;
    /**
     * Check if sync is needed
     */
    shouldSync(): boolean;
    /**
     * Get sync status
     */
    getSyncStatus(): {
        inProgress: boolean;
        lastSync: number;
        nextSync: number;
        shouldSyncNow: boolean;
    };
}
export declare const citizenProfileSync: CitizenProfileSyncService;
