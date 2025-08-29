/**
 * MIYOMI Flexible Revenue Engine
 * Supports multiple business models: picks, referrals, sponsorships, ads
 */
export interface RevenueSource {
    id: string;
    type: 'subscription' | 'referral' | 'sponsorship' | 'advertising' | 'affiliate' | 'api' | 'data';
    name: string;
    description: string;
    isActive: boolean;
    priority: number;
    metrics: {
        revenue: number;
        volume: number;
        conversionRate: number;
        avgValue: number;
    };
}
export interface BusinessModel {
    id: string;
    name: string;
    description: string;
    sources: RevenueSource[];
    targetAudience: string[];
    kpis: string[];
}
export interface SponsorshipOpportunity {
    id: string;
    platform: string;
    type: 'traffic_driving' | 'pick_featuring' | 'video_integration' | 'newsletter_mention';
    rate: number;
    terms: {
        minViews?: number;
        minClicks?: number;
        exclusivity?: boolean;
        duration?: string;
    };
    isActive: boolean;
}
export interface ReferralProgram {
    id: string;
    platform: string;
    commission: number;
    cookieDuration: number;
    minPayout: number;
    trackingPixel?: string;
    deepLinkTemplate?: string;
}
export declare class MiyomiRevenueEngine {
    static readonly BUSINESS_MODELS: Record<string, BusinessModel>;
    private currentModel;
    private activeOpportunities;
    private referralPrograms;
    constructor(modelId?: string);
    /**
     * Switch business model dynamically
     */
    switchBusinessModel(modelId: string): void;
    /**
     * Generate referral links for prediction platforms
     */
    generateReferralLink(platform: string, pickId?: string, userId?: string): string;
    /**
     * Track click and conversion events
     */
    trackEvent(event: {
        type: 'click' | 'signup' | 'deposit' | 'trade';
        platform: string;
        userId?: string;
        pickId?: string;
        value?: number;
        metadata?: any;
    }): Promise<void>;
    /**
     * Calculate revenue attribution
     */
    calculateAttribution(period?: 'day' | 'week' | 'month'): Promise<{
        total: number;
        breakdown: Record<string, number>;
        topSource: [string, number];
    }>;
    /**
     * Get sponsorship opportunities from platforms
     */
    getSponsorshipOpportunities(): Promise<SponsorshipOpportunity[]>;
    /**
     * Create sponsored pick with tracking
     */
    createSponsoredPick(pick: any, sponsorship: SponsorshipOpportunity): Promise<any>;
    /**
     * Optimize revenue mix based on performance
     */
    optimizeRevenueMix(): Promise<{
        currentMix: {
            total: number;
            breakdown: Record<string, number>;
            topSource: [string, number];
        };
        recommendations: {
            action: string;
            reason: string;
            impact: string;
        }[];
        optimalModel: string;
    }>;
    /**
     * A/B test different revenue approaches
     */
    startRevenueExperiment(experiment: {
        name: string;
        variants: string[];
        trafficSplit: number[];
        duration: number;
    }): Promise<{
        experimentId: string;
        status: string;
        variants: {
            modelId: string;
            traffic: number;
            metrics: {
                revenue: number;
                conversions: number;
                users: number;
            };
        }[];
    }>;
    private loadReferralPrograms;
    private loadSponsorshipOpportunities;
    private getPlatformBaseUrl;
    private getReferralCode;
    private getRevenueSourceForEvent;
    private updateMetrics;
    private getSourceRevenue;
    private analyzeSourcePerformance;
    private suggestOptimalModel;
    private generateTrackingPixel;
}
export declare const revenueEngine: MiyomiRevenueEngine;
