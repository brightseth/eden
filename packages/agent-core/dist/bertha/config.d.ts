export interface BerthaConfig {
    identity: {
        name: string;
        handle: string;
        role: string;
        version: string;
    };
    claude: {
        model: string;
        systemPrompt: string;
        temperature: number;
        maxTokens: number;
        capabilities: string[];
    };
    collection: {
        priceRanges: {
            micro: [number, number];
            small: [number, number];
            medium: [number, number];
            large: [number, number];
        };
        riskTolerance: number;
        holdingPeriod: string;
        rebalanceFrequency: string;
    };
    taste: {
        preferredMovements: string[];
        avoidList: string[];
        qualitySignals: string[];
        culturalWeights: Record<string, number>;
    };
    market: {
        dataSources: string[];
        updateFrequency: string;
        predictionHorizon: string;
        confidenceThreshold: number;
    };
    decision: {
        evaluationCriteria: {
            criterion: string;
            weight: number;
            threshold?: number;
        }[];
        vetoRules: string[];
        emergencyStopConditions: string[];
    };
}
export declare const berthaConfig: BerthaConfig;
export declare function incorporateTrainingData(trainingResponses: any): Partial<BerthaConfig>;
export default berthaConfig;
