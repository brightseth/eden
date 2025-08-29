/**
 * MIYOMI Claude SDK Integration
 * Handles communication with Claude for market analysis and pick generation
 */
export interface MarketPick {
    market: string;
    platform: 'Kalshi' | 'Polymarket' | 'Manifold' | 'Melee' | 'Myriad';
    position: 'YES' | 'NO' | 'OVER' | 'UNDER';
    confidence: number;
    edge: number;
    odds: number;
    reasoning: string;
    sector: 'politics' | 'sports' | 'finance' | 'ai' | 'pop' | 'geo' | 'internet';
    risk_level: 'low' | 'medium' | 'high';
    timeframe: string;
    sources: string[];
}
export interface MiyomiConfig {
    riskTolerance: number;
    contrarianDial: number;
    sectorWeights: Record<string, number>;
    bannedTopics: string[];
    tone: {
        energy: number;
        sass: number;
        profanity: number;
    };
}
export declare class MiyomiClaudeSDK {
    private anthropic;
    private config;
    private configLoaded;
    constructor(apiKey: string);
    loadTrainedConfig(): Promise<void>;
    updateConfig(newConfig: Partial<MiyomiConfig>): Promise<void>;
    /**
     * Generate market picks based on current config and market conditions
     */
    generatePicks(maxPicks?: number): Promise<MarketPick[]>;
    /**
     * Analyze a specific market for contrarian opportunities
     */
    analyzeMarket(marketDescription: string, currentOdds: number): Promise<{
        recommendation: 'YES' | 'NO' | 'SKIP';
        confidence: number;
        edge: number;
        reasoning: string;
        risk_flags: string[];
    }>;
    /**
     * Generate content script for video creation
     */
    generateVideoScript(pick: MarketPick): Promise<{
        script: string;
        title: string;
        hook: string;
        cta: string;
    }>;
    private buildSystemPrompt;
    private fetchRelevantMarkets;
    private findContrarianOpportunities;
    private buildPickGenerationPrompt;
    private parsePicks;
    /**
     * Chat with MIYOMI about markets, contrarian strategies, or predictions
     */
    chat(message: string, context?: Array<{
        role: string;
        content: string;
    }>): Promise<string>;
    private validatePick;
}
export declare const miyomiSDK: MiyomiClaudeSDK;
