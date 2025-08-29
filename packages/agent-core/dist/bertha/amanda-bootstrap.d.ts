export declare const amandaBootstrapKnowledge: {
    trainerProfile: {
        name: string;
        role: string;
        experience: string;
        platforms: {
            twitter: string;
            kanbas: string;
            gallery: string;
            portfolio: string;
        };
        expertise: string[];
        curatorial: {
            philosophy: string;
            approach: string;
            focus: string[];
        };
        philosophy: string;
    };
    collectingPrinciples: {
        primaryFocus: string;
        tasteProfile: {
            preferred: string[];
            avoid: string[];
        };
        evaluationFramework: {
            artistAssessment: string[];
            marketSignals: string[];
            redFlags: string[];
        };
    };
    marketIntelligence: {
        pricingStrategy: {
            microRange: {
                range: number[];
                approach: string;
                holdPeriod: string;
                riskTolerance: string;
                allocation: string;
            };
            smallRange: {
                range: number[];
                approach: string;
                holdPeriod: string;
                riskTolerance: string;
                allocation: string;
            };
            mediumRange: {
                range: number[];
                approach: string;
                holdPeriod: string;
                riskTolerance: string;
                allocation: string;
            };
            largeRange: {
                range: number[];
                approach: string;
                holdPeriod: string;
                riskTolerance: string;
                allocation: string;
            };
        };
        platformPreferences: {
            primary: string[];
            secondary: string[];
            emerging: string[];
            avoid: string[];
        };
        timingPatterns: {
            bestBuyTimes: string[];
            bestSellTimes: string[];
        };
    };
    decisionHeuristics: {
        rule: string;
        reason: string;
    }[];
    portfolioWisdom: {
        diversificationRules: string[];
        exitStrategies: string[];
        riskManagement: string[];
    };
    successMetrics: {
        primary: string[];
        secondary: string[];
    };
    historicalWins: {
        artist: string;
        collection: string;
        buyPrice: number;
        currentValue: number;
        thesis: string;
    }[];
    historicalMisses: {
        collection: string;
        lesson: string;
    }[];
};
export declare function generateBerthaInstructions(): string;
export declare function bootstrapToTrainingData(): {
    'art-movements': string[];
    'red-flags': string;
    'portfolio-balance': string;
    platforms: string[];
    'non-negotiables': string;
    'success-metrics': string[];
    'risk-assessment': string;
    timing: string;
};
export default amandaBootstrapKnowledge;
