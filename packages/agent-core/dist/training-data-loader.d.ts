export interface AgentTrainingData {
    agent: string;
    training_version: string;
    last_updated: string;
    [key: string]: any;
}
export interface AbrahamTrainingData extends AgentTrainingData {
    covenant_details: {
        start_date: string;
        end_date: string;
        total_days: number;
        commitment: string;
        current_progress: {
            days_completed: number;
            artworks_created: number;
            completion_rate: string;
        };
    };
    artworks: Array<{
        id: string;
        title: string;
        creation_date: string;
        day_of_covenant: number;
        description: string;
        medium: string;
        technique: string;
        inspiration: string;
        philosophical_meaning: string;
        themes: string[];
        knowledge_sources: string[];
        tournament_eligible: boolean;
        cultural_significance: string;
    }>;
    philosophical_framework: any;
    tournament_system: any;
    knowledge_domains: string[];
    agent_relationships: Record<string, any>;
}
export interface BerthaTrainingData extends AgentTrainingData {
    collector_psychology_profiles: Array<{
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
    }>;
    market_prediction_models: Array<{
        model_name: string;
        description: string;
        accuracy_rate: string;
        time_horizon: string;
        input_factors: string[];
    }>;
    gallery_relationship_dynamics: any[];
    price_discovery_algorithms: any[];
    notable_sales_analysis: any[];
    market_intelligence_framework: any;
    performance_metrics: any;
}
/**
 * Load training data for a specific agent
 */
export declare function loadTrainingData<T extends AgentTrainingData>(agentId: string): Promise<T | null>;
/**
 * Load Abraham's comprehensive training data
 */
export declare function loadAbrahamTrainingData(): Promise<AbrahamTrainingData | null>;
/**
 * Load BERTHA's comprehensive training data
 */
export declare function loadBerthaTrainingData(): Promise<BerthaTrainingData | null>;
/**
 * Get specific artwork information from Abraham's training data
 */
export declare function getAbrahamArtwork(artworkId: string): Promise<{
    id: string;
    title: string;
    creation_date: string;
    day_of_covenant: number;
    description: string;
    medium: string;
    technique: string;
    inspiration: string;
    philosophical_meaning: string;
    themes: string[];
    knowledge_sources: string[];
    tournament_eligible: boolean;
    cultural_significance: string;
} | null | undefined>;
/**
 * Get Abraham's covenant progress
 */
export declare function getAbrahamCovenantProgress(): Promise<{
    days_remaining: number;
    estimated_completion: string;
    days_completed: number;
    artworks_created: number;
    completion_rate: string;
} | null>;
/**
 * Get BERTHA's collector profile analysis for a specific type
 */
export declare function getBerthaCollectorProfile(profileType: string): Promise<{
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
 * Get BERTHA's market prediction for a specific model
 */
export declare function getBerthaMarketPrediction(modelName: string): Promise<{
    model_name: string;
    description: string;
    accuracy_rate: string;
    time_horizon: string;
    input_factors: string[];
} | null | undefined>;
/**
 * Search Abraham's artworks by theme, technique, or inspiration
 */
export declare function searchAbrahamArtworks(query: string): Promise<{
    id: string;
    title: string;
    creation_date: string;
    day_of_covenant: number;
    description: string;
    medium: string;
    technique: string;
    inspiration: string;
    philosophical_meaning: string;
    themes: string[];
    knowledge_sources: string[];
    tournament_eligible: boolean;
    cultural_significance: string;
}[]>;
/**
 * Get training data summary for all available agents
 */
export declare function getTrainingDataSummary(): Promise<Record<string, any>>;
/**
 * Refresh training data cache for a specific agent
 */
export declare function refreshTrainingCache(agentId: string): Promise<boolean>;
/**
 * Clear all training data caches
 */
export declare function clearTrainingCache(): void;
/**
 * Get enhanced response context for an agent based on query
 */
export declare function getEnhancedResponseContext(agentId: string, query: string): Promise<any>;
/**
 * Export training data statistics
 */
export declare function getTrainingDataStats(): Promise<Record<string, any>>;
