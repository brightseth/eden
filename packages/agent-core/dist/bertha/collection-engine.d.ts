export interface CollectionDecision {
    decision: 'buy' | 'pass' | 'watch' | 'sell';
    confidence: number;
    reasoning: string[];
    archetype: string;
    priceTarget?: number;
    riskFactors: string[];
    urgency: 'immediate' | 'within_week' | 'monitor' | 'no_rush';
}
export interface ArtworkEvaluation {
    artwork: {
        id: string;
        title: string;
        artist: string;
        collection?: string;
        currentPrice: number;
        currency: string;
        platform: string;
    };
    signals: {
        technical: number;
        cultural: number;
        market: number;
        aesthetic: number;
    };
    metadata: {
        created: string;
        medium: string;
        edition?: number;
        provenance: string[];
    };
}
export declare class BerthaCollectionEngine {
    private trainingData;
    private config;
    constructor();
    private loadTrainingData;
    evaluateArtwork(evaluation: ArtworkEvaluation): Promise<CollectionDecision[]>;
    getConsensusDecision(evaluation: ArtworkEvaluation): Promise<CollectionDecision>;
    private getArchetypeDecision;
    private getTrainingResponse;
    private evaluateAesthetics;
    private evaluatePrice;
    private checkVetoRules;
    private consolidateReasons;
    private consolidateRisks;
    private calculateUrgency;
    private calculatePriceTarget;
    evaluatePortfolio(holdings: any[]): Promise<{
        overallHealth: number;
        recommendations: string[];
        rebalanceNeeded: boolean;
    }>;
}
export declare const berthaEngine: BerthaCollectionEngine;
export declare function evaluateArtworkForTesting(title: string, artist: string, price: number, signals: {
    technical: number;
    cultural: number;
    market: number;
    aesthetic: number;
}): Promise<CollectionDecision>;
