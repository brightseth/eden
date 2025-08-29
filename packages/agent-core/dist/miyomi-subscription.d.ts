/**
 * MIYOMI Subscription & Revenue System
 * Handles tiers, payments, and access control for premium picks
 */
export interface SubscriptionTier {
    id: string;
    name: 'FREE' | 'CONTRARIAN' | 'ORACLE' | 'WHALE';
    price: number;
    features: string[];
    limits: {
        picksPerDay: number;
        maxEdgeAccess: number;
        videoAccess: boolean;
        alertsEnabled: boolean;
        backtestingAccess: boolean;
        apiAccess: boolean;
        prioritySupport: boolean;
    };
}
export interface UserSubscription {
    userId: string;
    tierId: string;
    status: 'active' | 'canceled' | 'past_due' | 'trialing';
    startDate: string;
    endDate: string;
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
    totalRevenue: number;
    pickAccess: string[];
}
export interface PickAccess {
    pickId: string;
    requiredTier: string;
    edgeThreshold: number;
    isExclusive: boolean;
    releaseDelay: number;
}
export interface RevenueMetrics {
    totalMRR: number;
    totalSubscribers: number;
    tierDistribution: Record<string, number>;
    churnRate: number;
    averageRevenue: number;
    lifetimeValue: number;
}
export declare class MiyomiSubscriptionManager {
    private supabase;
    static readonly TIERS: Record<string, SubscriptionTier>;
    constructor();
    /**
     * Create a new subscription for a user
     */
    createSubscription(userId: string, tierId: string, paymentMethodId?: string): Promise<UserSubscription>;
    /**
     * Check if user has access to a specific pick
     */
    checkPickAccess(userId: string, pickId: string): Promise<{
        hasAccess: boolean;
        reason?: string;
        upgradeRequired?: string;
    }>;
    /**
     * Process a payment and update subscription
     */
    processPayment(userId: string, amount: number, paymentMethodId: string): Promise<{
        success: boolean;
        subscription?: UserSubscription;
        error?: string;
    }>;
    /**
     * Get revenue metrics
     */
    getRevenueMetrics(): Promise<RevenueMetrics>;
    /**
     * Apply pick access rules based on tier
     */
    applyPickAccess(pick: any, userTier: string): Promise<any>;
    private createStripeSubscription;
    private calculateEndDate;
    private getUserSubscription;
    private getPickDetails;
    private getTodayPickCount;
    private getNextTier;
    private createPaymentIntent;
    private upgradeSubscription;
    private trackRevenue;
}
export declare const subscriptionManager: MiyomiSubscriptionManager;
