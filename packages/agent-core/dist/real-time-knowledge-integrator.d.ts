/**
 * Real-Time Knowledge Integrator
 * Feeds live data to agents for enhanced, current responses
 * Integrates with existing real-time systems and training data
 */
export interface LiveKnowledgeUpdate {
    agent: string;
    domain: 'market' | 'social' | 'art' | 'governance' | 'collaboration';
    updateType: 'price' | 'news' | 'sentiment' | 'event' | 'trend' | 'creation';
    data: any;
    timestamp: string;
    confidence: number;
    source: string;
}
export interface AgentKnowledgeContext {
    agent: string;
    baseTrainingData: any;
    realtimeUpdates: LiveKnowledgeUpdate[];
    synthesizedContext: any;
    lastUpdate: string;
    knowledgeFreshness: number;
}
export interface KnowledgeStream {
    agentId: string;
    streamType: 'market' | 'social' | 'creative' | 'governance';
    isActive: boolean;
    updateFrequency: number;
    lastFetch: string;
    errorCount: number;
    dataPoints: LiveKnowledgeUpdate[];
}
export declare class RealTimeKnowledgeIntegrator {
    private activeStreams;
    private knowledgeCache;
    private updateIntervals;
    private citizenMarketData;
    private dataSources;
    constructor();
    /**
     * Initialize default knowledge streams for each agent
     */
    private initializeDefaultStreams;
    /**
     * Create and start a knowledge stream for an agent
     */
    createKnowledgeStream(agentId: string, streamType: 'market' | 'social' | 'creative' | 'governance', updateFrequency: number): KnowledgeStream;
    /**
     * Start a knowledge stream
     */
    private startStream;
    /**
     * Fetch update for a specific stream
     */
    private fetchStreamUpdate;
    /**
     * Fetch market-related updates
     */
    private fetchMarketUpdates;
    /**
     * Fetch social sentiment updates
     */
    private fetchSocialUpdates;
    /**
     * Fetch creative domain updates (for Abraham)
     */
    private fetchCreativeUpdates;
    /**
     * Fetch governance updates (for Citizen)
     */
    private fetchGovernanceUpdates;
    /**
     * Update agent knowledge context with new real-time data
     */
    private updateAgentKnowledge;
    /**
     * Synthesize training data with real-time updates
     */
    private synthesizeKnowledge;
    /**
     * Get real-time enhanced context for an agent
     */
    getRealTimeContext(agentId: string, query?: string): Promise<any>;
    /**
     * Stop a knowledge stream
     */
    stopStream(streamKey: string): void;
    /**
     * Get knowledge stream status
     */
    getStreamStatus(agentId?: string): any;
    private calculateOverallSentiment;
    private calculateAverageVolatility;
    private calculateFreshness;
    /**
     * Cleanup - stop all streams
     */
    shutdown(): void;
}
export declare const realTimeKnowledge: RealTimeKnowledgeIntegrator;
