import { type BerthaConfig } from './config';
import { BerthaTrainingData } from '../training-data-loader';
export interface ClaudeMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}
export interface MarketAnalysis {
    asset: {
        name: string;
        collection: string;
        tokenId?: string;
        platform: string;
    };
    price: {
        current: number;
        currency: string;
        historicalRange: [number, number];
    };
    prediction: {
        direction: 'up' | 'down' | 'stable';
        targetPrice: number;
        timeframe: string;
        confidence: number;
    };
    reasoning: string[];
    risks: string[];
    recommendation: 'strong_buy' | 'buy' | 'hold' | 'sell' | 'strong_sell';
}
export interface CollectionStrategy {
    allocation: {
        category: string;
        percentage: number;
        rationale: string;
    }[];
    rebalancing: {
        action: string;
        assets: string[];
        timing: string;
    }[];
    opportunities: MarketAnalysis[];
}
export declare class BerthaClaudeSDK {
    private config;
    private conversationHistory;
    private anthropic;
    private trainingData;
    private trainingDataLoaded;
    constructor(config?: BerthaConfig, apiKey?: string);
    private initializeSystemPrompt;
    analyzeOpportunity(assetData: {
        name: string;
        collection: string;
        currentPrice: number;
        platform: string;
        historicalData?: any;
        socialMetrics?: any;
    }): Promise<MarketAnalysis>;
    generateStrategy(portfolio: {
        holdings: any[];
        totalValue: number;
        cashAvailable: number;
    }): Promise<CollectionStrategy>;
    processTrainerInterview(responses: Record<string, any>): Promise<Partial<BerthaConfig>>;
    private mockAnalyzeResponse;
    private mockStrategyResponse;
    /**
     * Chat with BERTHA about art market intelligence, collection analysis, and sophisticated collecting
     */
    chat(message: string, context?: Array<{
        role: string;
        content: string;
    }>): Promise<string>;
    private mockProcessInterview;
    /**
     * Load comprehensive training data for enhanced collection intelligence
     */
    loadTrainingData(): Promise<BerthaTrainingData | null>;
    /**
     * Get enhanced market analysis using comprehensive training data
     */
    analyzeOpportunityWithTraining(assetData: {
        name: string;
        collection: string;
        currentPrice: number;
        platform: string;
        historicalData?: any;
        socialMetrics?: any;
        collectorType?: string;
    }): Promise<MarketAnalysis>;
    /**
     * Get collector profile analysis
     */
    getCollectorProfile(profileType: string): Promise<{
        profile_id: string;
        name: string;
        characteristics: string[];
        decision_factors: string[];
        typical_budget_range: string;
        acquisition_timeline: string;
        behavioral_patterns: {
            research_depth: string;
            risk_tolerance: string;
            market_sensitivity: string;
            influence_factors: string[];
        };
    } | null | undefined>;
    /**
     * Get market prediction for specific model
     */
    getMarketPrediction(modelName: string): Promise<{
        model_name: string;
        description: string;
        accuracy_rate: string;
        time_horizon: string;
        input_factors: string[];
    } | null | undefined>;
    /**
     * Get enhanced chat response using training data
     */
    getChatWithTraining(message: string): Promise<string>;
    /**
     * Get training data statistics
     */
    getTrainingStats(): Promise<{
        collector_profiles: number;
        prediction_models: number;
        gallery_relationships: number;
        price_algorithms: number;
        notable_sales: number;
        prediction_accuracy: any;
        last_updated: string;
        training_version: string;
    } | null>;
    /**
     * Create enhanced analysis using training data context
     */
    private createEnhancedAnalysis;
}
export declare const berthaClaude: BerthaClaudeSDK;
export declare function syncWithEdenIntelligence(edenData: any, claudeAnalysis: MarketAnalysis): Promise<any>;
