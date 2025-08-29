export interface AcquisitionTarget {
    id: string;
    title: string;
    artist: string;
    platform: string;
    currentPrice: number;
    currency: string;
    discoverySource: string;
    evaluationScore: number;
    confidence: number;
    urgency: 'immediate' | 'within_week' | 'monitor' | 'no_rush';
    reasoning: string[];
    marketSignals: any;
    discoveredAt: string;
}
export interface DailyAcquisition {
    date: string;
    target: AcquisitionTarget | null;
    acquisitionStatus: 'pending' | 'acquired' | 'failed' | 'passed';
    finalPrice?: number;
    transactionHash?: string;
    reasoning: string;
    alternativeOptions: AcquisitionTarget[];
    scanStats: {
        platformsScanned: number;
        artworksEvaluated: number;
        hoursSpent: number;
        confidenceThreshold: number;
    };
}
export interface CollectionStrategy {
    dailyBudget: {
        min: number;
        max: number;
    };
    priceRanges: {
        experimental: number;
        conviction: number;
        blueChip: number;
    };
    categoryTargets: {
        generative: number;
        aiArt: number;
        photography: number;
        experimental: number;
        other: number;
    };
    riskTolerance: number;
    diversificationRules: string[];
}
export declare class AutonomousCollector {
    private strategy;
    private acquisitionHistory;
    private lastScan;
    private currentTargets;
    constructor();
    executeDailyAcquisition(): Promise<DailyAcquisition>;
    private scanPlatforms;
    private scanPlatform;
    private evaluateTargets;
    private applyRiskFilters;
    private selectDailyTarget;
    private executeAcquisition;
    private generateArtworkTitle;
    private generateArtistName;
    private randomCategory;
    getAcquisitionHistory(): DailyAcquisition[];
    getStrategy(): CollectionStrategy;
    updateStrategy(updates: Partial<CollectionStrategy>): void;
    getCurrentTargets(): AcquisitionTarget[];
}
export declare const autonomousCollector: AutonomousCollector;
