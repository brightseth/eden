/**
 * BART Risk Management System
 * Implements Renaissance banking principles with modern risk controls
 */
export interface RiskPolicy {
    metadata: {
        name: string;
        version: string;
        lastUpdated: string;
        description: string;
    };
    global: {
        maxExposurePercentage: number;
        maxDailyVolume: string;
        reserveRatio: number;
        defaultDryRun: boolean;
    };
    collections: Record<string, CollectionPolicy>;
    tiers: Record<string, TierPolicy>;
    durations: Record<string, DurationPolicy>;
    market_conditions: Record<string, MarketConditionPolicy>;
    dry_run: DryRunConfig;
    banking_wisdom: BankingRule[];
}
export interface CollectionPolicy {
    address: string;
    tier: string;
    maxLTV: number;
    baseAPR: number;
    maxLoanAmount: string;
    requiredLiquidity: string;
}
export interface TierPolicy {
    description: string;
    minFloorPrice: string;
    maxDefaultRate: number;
    minVolume24h: string;
}
export interface DurationPolicy {
    riskMultiplier: number;
    aprBonus: number;
}
export interface MarketConditionPolicy {
    ltvBonus?: number;
    ltvPenalty?: number;
    ltvAdjustment?: number;
    aprDiscount?: number;
    aprPremium?: number;
    aprAdjustment?: number;
}
export interface DryRunConfig {
    enabled: boolean;
    mode: 'simulation' | 'validation' | 'disabled';
    log_level: 'minimal' | 'detailed' | 'verbose';
    simulation_outcomes: {
        success_rate: number;
        default_rate: number;
        avg_repayment_days: number;
    };
}
export interface BankingRule {
    rule: string;
    threshold?: number;
    max_concentration?: number;
    min_cash_ratio?: number;
    risk_premium_per_tier?: Record<string, number>;
}
export interface LoanRequest {
    contractAddress: string;
    tokenId: string;
    requestedAmount: number;
    duration: number;
    collectionName?: string;
    floorPrice?: number;
}
export interface RiskAssessment {
    approved: boolean;
    recommendedLTV: number;
    adjustedAPR: number;
    maxLoanAmount: number;
    riskScore: number;
    tier: string;
    reasoning: string[];
    dryRun: boolean;
    simulatedOutcome?: {
        wouldSucceed: boolean;
        projectedRepayment: number;
        riskFactors: string[];
    };
}
export declare class BartRiskManager {
    private policy;
    private policyPath;
    constructor(policyPath?: string);
    private loadPolicy;
    /**
     * Assess loan request against risk policy
     */
    assessLoan(request: LoanRequest): Promise<RiskAssessment>;
    private getCollectionPolicy;
    private getDurationCategory;
    private simulateLoanOutcome;
    /**
     * Get current risk policy status
     */
    getStatus(): {
        policyVersion: string;
        dryRunEnabled: boolean;
        globalDryRun: boolean;
        supportedCollections: number;
        reserveRatio: number;
        maxDailyVolume: string;
    };
    /**
     * Enable/disable dry run mode
     */
    setDryRun(enabled: boolean): void;
    /**
     * Reload policy from file
     */
    reloadPolicy(): void;
}
export declare const bartRiskManager: BartRiskManager;
