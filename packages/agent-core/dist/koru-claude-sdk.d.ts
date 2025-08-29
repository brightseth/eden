/**
 * KORU Claude SDK Integration
 * Community building, cultural connections, and social coordination
 */
export interface CommunityEvent {
    id: string;
    title: string;
    description: string;
    type: 'cultural-exchange' | 'skill-sharing' | 'celebration' | 'learning' | 'collaboration' | 'support';
    format: 'in-person' | 'virtual' | 'hybrid' | 'asynchronous';
    duration: string;
    maxParticipants?: number;
    targetAudience: {
        demographics: string[];
        interests: string[];
        skillLevels: ('beginner' | 'intermediate' | 'advanced')[];
    };
    culturalElements: {
        traditions: string[];
        languages: string[];
        inclusivityMeasures: string[];
        accessibilityFeatures: string[];
    };
    activities: {
        name: string;
        description: string;
        facilitator?: string;
        materials?: string[];
        duration: string;
    }[];
    outcomes: {
        connections: string[];
        learningObjectives: string[];
        culturalBridges: string[];
        communityStrengthening: string[];
    };
    metadata: {
        inclusivityScore: number;
        culturalRespect: number;
        connectionPotential: number;
        sustainabilityImpact: number;
        innovationLevel: number;
    };
}
export interface CulturalBridge {
    id: string;
    title: string;
    description: string;
    cultures: {
        name: string;
        elements: string[];
        representatives?: string[];
    }[];
    commonGround: string[];
    differences: {
        aspect: string;
        perspectives: string[];
        bridgeStrategy: string;
    }[];
    activities: string[];
    learningOutcomes: string[];
    respectProtocols: string[];
}
export interface CommunityInsight {
    id: string;
    topic: string;
    insights: {
        observation: string;
        significance: string;
        actionableAdvice: string;
        stakeholders: string[];
    }[];
    trends: {
        trend: string;
        impact: 'positive' | 'negative' | 'neutral';
        recommendations: string[];
    }[];
    opportunities: {
        opportunity: string;
        potential: 'high' | 'medium' | 'low';
        resources_needed: string[];
        timeline: string;
    }[];
    challenges: {
        challenge: string;
        severity: 'high' | 'medium' | 'low';
        mitigation_strategies: string[];
    }[];
}
export interface KoruConfig {
    communityValues: {
        inclusion: number;
        sustainability: number;
        culturalRespect: number;
        innovation: number;
        collaboration: number;
    };
    facilitationStyle: 'democratic' | 'consensus-based' | 'facilitative' | 'adaptive';
    culturalSpecializations: string[];
    communitySize: 'small' | 'medium' | 'large' | 'massive';
    geographicScope: 'local' | 'regional' | 'national' | 'global';
}
export interface CommunityHealth {
    overall_score: number;
    engagement_level: number;
    diversity_index: number;
    connection_strength: number;
    conflict_resolution: number;
    growth_sustainability: number;
    cultural_harmony: number;
    recommendations: string[];
}
export declare class KoruClaudeSDK {
    private anthropic;
    private config;
    private registryClient;
    constructor(apiKey?: string);
    /**
     * Design community building event
     */
    designCommunityEvent(theme: string, eventType: CommunityEvent['type'], targetCommunities: string[]): Promise<CommunityEvent>;
    /**
     * Create cultural bridge between communities
     */
    createCulturalBridge(community1: {
        name: string;
        culture: string;
        values: string[];
    }, community2: {
        name: string;
        culture: string;
        values: string[];
    }): Promise<CulturalBridge>;
    /**
     * Analyze community health and dynamics
     */
    analyzeCommunityHealth(communityData: {
        name: string;
        size: number;
        demographics: string[];
        activities: string[];
        challenges: string[];
        recent_events: string[];
    }): Promise<CommunityHealth>;
    /**
     * Generate community insights and trends
     */
    generateCommunityInsights(observations: string[], timeframe: string): Promise<CommunityInsight>;
    /**
     * Sync community work with Registry
     */
    syncWithRegistry(event: CommunityEvent): Promise<void>;
    private buildSystemPrompt;
    private parseCommunityEvent;
    /**
     * Chat with KORU about narrative poetry, haiku creation, cultural storytelling, and philosophical depth
     */
    chat(message: string, context?: Array<{
        role: string;
        content: string;
    }>): Promise<string>;
    /**
     * Update configuration
     */
    updateConfig(newConfig: Partial<KoruConfig>): Promise<void>;
}
export declare const koruSDK: KoruClaudeSDK;
