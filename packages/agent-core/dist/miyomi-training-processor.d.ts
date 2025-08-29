/**
 * MIYOMI Training Data Processor
 * Converts training interview responses into MIYOMI's operational configuration
 */
import { MiyomiConfig } from './miyomi-claude-sdk';
interface TrainingResponse {
    trainer: string;
    email?: string;
    timestamp: string;
    sections: {
        section: string;
        responses: {
            question: string;
            response: any;
        }[];
    }[];
}
interface ProcessedTrainingData {
    config: MiyomiConfig;
    informationSources: {
        twitter: string[];
        youtube: string[];
        newsletters: string[];
        contrarians: string[];
    };
    marketInsights: {
        overpriced: string[];
        underpriced: string[];
        emergingPlatforms: string[];
        keyInvestors: string[];
    };
    tradingRules: {
        maxPositionSize: number;
        dailyLimit: number;
        autoExecuteThreshold: number;
        exitTriggers: string[];
    };
}
export declare class MiyomiTrainingProcessor {
    /**
     * Process training interview data into operational config
     */
    static processTrainingData(trainingData: TrainingResponse): Promise<ProcessedTrainingData>;
    private static organizeSections;
    private static extractRiskTolerance;
    private static extractContrarianIntensity;
    private static extractSectorWeights;
    private static extractTradingRules;
    private static extractInformationSources;
    private static extractMarketInsights;
    private static extractToneProfile;
    private static extractBannedTopics;
    /**
     * Apply training data to MIYOMI's live configuration
     */
    static applyTrainingToSystem(trainingData: TrainingResponse): Promise<void>;
    private static saveConfiguration;
}
export default MiyomiTrainingProcessor;
