/**
 * BART Claude SDK Integration
 * Handles communication with Claude for NFT lending analysis and autonomous finance
 */
export interface LoanRequest {
    collateralNFT: {
        collection: string;
        tokenId: string;
        floorPrice: number;
        rarityRank?: number;
        attributes?: Record<string, any>;
    };
    requestedAmount: number;
    duration: number;
    borrowerAddress: string;
    borrowerCreditScore?: number;
}
export interface LoanDecision {
    approved: boolean;
    loanAmount?: number;
    interestRate?: number;
    duration?: number;
    loanToValue?: number;
    riskScore: number;
    reasoning: string;
    conditions: string[];
    liquidationThreshold?: number;
}
export interface RiskAssessment {
    collectionRisk: 'low' | 'medium' | 'high';
    liquidityRisk: 'low' | 'medium' | 'high';
    marketRisk: 'low' | 'medium' | 'high';
    creditRisk: 'low' | 'medium' | 'high';
    overallRisk: number;
    recommendations: string[];
    timeframe: string;
}
export interface BartConfig {
    riskTolerance: number;
    maxLTV: number;
    baseInterestRate: number;
    preferredCollections: string[];
    maxLoanDuration: number;
    reserveRatio: number;
    lendingPhilosophy: {
        conservatism: number;
        opportunism: number;
        renaissance_wisdom: number;
    };
}
export declare class BartClaudeSDK {
    private anthropic;
    private config;
    private configLoaded;
    constructor(apiKey?: string);
    loadTrainedConfig(): Promise<void>;
    updateConfig(newConfig: Partial<BartConfig>): Promise<void>;
    /**
     * Evaluate a loan request and make an autonomous lending decision using real Gondi data
     */
    evaluateLoan(loanRequest: LoanRequest): Promise<LoanDecision>;
    /**
     * Perform comprehensive risk assessment on a collection using real market data
     */
    assessRisk(collectionName: string, timeframe?: string): Promise<RiskAssessment>;
    catch(error: any): void;
}
export declare const bartSDK: BartClaudeSDK;
