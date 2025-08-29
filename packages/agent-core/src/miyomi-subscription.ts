/**
 * MIYOMI Subscription & Revenue System
 * Handles tiers, payments, and access control for premium picks
 */

import { createClient } from '@supabase/supabase-js';

export interface SubscriptionTier {
  id: string;
  name: 'FREE' | 'CONTRARIAN' | 'ORACLE' | 'WHALE';
  price: number; // Monthly price in USD
  features: string[];
  limits: {
    picksPerDay: number;
    maxEdgeAccess: number; // Max edge percentage they can see
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
  pickAccess: string[]; // Array of pick IDs they have access to
}

export interface PickAccess {
  pickId: string;
  requiredTier: string;
  edgeThreshold: number; // Minimum edge to be premium
  isExclusive: boolean;
  releaseDelay: number; // Hours delay for lower tiers
}

export interface RevenueMetrics {
  totalMRR: number;
  totalSubscribers: number;
  tierDistribution: Record<string, number>;
  churnRate: number;
  averageRevenue: number;
  lifetimeValue: number;
}

export class MiyomiSubscriptionManager {
  private supabase: any;
  
  // Define subscription tiers
  static readonly TIERS: Record<string, SubscriptionTier> = {
    FREE: {
      id: 'tier_free',
      name: 'FREE',
      price: 0,
      features: [
        '1 pick per day',
        'Basic market analysis',
        'Community chat access',
        '24hr delayed picks'
      ],
      limits: {
        picksPerDay: 1,
        maxEdgeAccess: 10,
        videoAccess: false,
        alertsEnabled: false,
        backtestingAccess: false,
        apiAccess: false,
        prioritySupport: false
      }
    },
    CONTRARIAN: {
      id: 'tier_contrarian',
      name: 'CONTRARIAN',
      price: 49,
      features: [
        '5 picks per day',
        'Real-time contrarian alerts',
        'Video content access',
        'Edge up to 20%',
        'Basic backtesting',
        '12hr early access'
      ],
      limits: {
        picksPerDay: 5,
        maxEdgeAccess: 20,
        videoAccess: true,
        alertsEnabled: true,
        backtestingAccess: true,
        apiAccess: false,
        prioritySupport: false
      }
    },
    ORACLE: {
      id: 'tier_oracle',
      name: 'ORACLE',
      price: 199,
      features: [
        'Unlimited picks',
        'All edge opportunities',
        'Priority alerts',
        'Full backtesting suite',
        'API access (1000 calls/day)',
        'Custom video scripts',
        '6hr early access',
        'Monthly strategy call'
      ],
      limits: {
        picksPerDay: 999,
        maxEdgeAccess: 100,
        videoAccess: true,
        alertsEnabled: true,
        backtestingAccess: true,
        apiAccess: true,
        prioritySupport: true
      }
    },
    WHALE: {
      id: 'tier_whale',
      name: 'WHALE',
      price: 999,
      features: [
        'Everything in Oracle',
        'Instant pick access',
        'Custom market analysis',
        'White-glove support',
        'API access (unlimited)',
        'Custom integration support',
        'Direct access to MIYOMI team',
        'Quarterly performance review'
      ],
      limits: {
        picksPerDay: 999,
        maxEdgeAccess: 100,
        videoAccess: true,
        alertsEnabled: true,
        backtestingAccess: true,
        apiAccess: true,
        prioritySupport: true
      }
    }
  };

  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!
    );
  }

  /**
   * Create a new subscription for a user
   */
  async createSubscription(
    userId: string,
    tierId: string,
    paymentMethodId?: string
  ): Promise<UserSubscription> {
    const tier = MiyomiSubscriptionManager.TIERS[tierId];
    if (!tier) {
      throw new Error(`Invalid tier: ${tierId}`);
    }

    // For paid tiers, create Stripe subscription
    let stripeData = {};
    if (tier.price > 0 && paymentMethodId) {
      stripeData = await this.createStripeSubscription(userId, tier, paymentMethodId);
    }

    // Create subscription record
    const subscription: UserSubscription = {
      userId,
      tierId: tier.id,
      status: tier.price === 0 ? 'active' : 'trialing',
      startDate: new Date().toISOString(),
      endDate: this.calculateEndDate(tier),
      ...stripeData,
      totalRevenue: 0,
      pickAccess: []
    };

    // Store in database
    const { data, error } = await this.supabase
      .from('miyomi_subscriptions')
      .insert(subscription)
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Check if user has access to a specific pick
   */
  async checkPickAccess(userId: string, pickId: string): Promise<{
    hasAccess: boolean;
    reason?: string;
    upgradeRequired?: string;
  }> {
    // Get user's subscription
    const subscription = await this.getUserSubscription(userId);
    if (!subscription) {
      return {
        hasAccess: false,
        reason: 'No active subscription',
        upgradeRequired: 'CONTRARIAN'
      };
    }

    // Get pick details
    const pick = await this.getPickDetails(pickId);
    if (!pick) {
      return { hasAccess: false, reason: 'Pick not found' };
    }

    const userTier = MiyomiSubscriptionManager.TIERS[subscription.tierId];
    
    // Check edge access
    if (pick.edge > userTier.limits.maxEdgeAccess / 100) {
      return {
        hasAccess: false,
        reason: `This pick requires ${pick.requiredTier} tier or higher`,
        upgradeRequired: pick.requiredTier
      };
    }

    // Check daily limits
    const todayPicks = await this.getTodayPickCount(userId);
    if (todayPicks >= userTier.limits.picksPerDay) {
      return {
        hasAccess: false,
        reason: 'Daily pick limit reached',
        upgradeRequired: this.getNextTier(subscription.tierId)
      };
    }

    // Check release delay for lower tiers
    if (pick.releaseDelay > 0) {
      const pickAge = Date.now() - new Date(pick.createdAt).getTime();
      const delayMs = pick.releaseDelay * 60 * 60 * 1000;
      if (pickAge < delayMs) {
        return {
          hasAccess: false,
          reason: `Available in ${Math.ceil((delayMs - pickAge) / (60 * 60 * 1000))} hours`,
          upgradeRequired: this.getNextTier(subscription.tierId)
        };
      }
    }

    return { hasAccess: true };
  }

  /**
   * Process a payment and update subscription
   */
  async processPayment(
    userId: string,
    amount: number,
    paymentMethodId: string
  ): Promise<{
    success: boolean;
    subscription?: UserSubscription;
    error?: string;
  }> {
    try {
      // Process payment via Stripe
      const paymentIntent = await this.createPaymentIntent(amount, paymentMethodId);
      
      if (paymentIntent.status !== 'succeeded') {
        return { success: false, error: 'Payment failed' };
      }

      // Update subscription
      const subscription = await this.upgradeSubscription(userId, amount);
      
      // Track revenue
      await this.trackRevenue(userId, amount, 'subscription');

      return { success: true, subscription };

    } catch (error) {
      console.error('Payment processing error:', error);
      return { success: false, error: 'Payment processing failed' };
    }
  }

  /**
   * Get revenue metrics
   */
  async getRevenueMetrics(): Promise<RevenueMetrics> {
    // Get all active subscriptions
    const { data: subscriptions } = await this.supabase
      .from('miyomi_subscriptions')
      .select('*')
      .eq('status', 'active');

    if (!subscriptions) {
      return {
        totalMRR: 0,
        totalSubscribers: 0,
        tierDistribution: {},
        churnRate: 0,
        averageRevenue: 0,
        lifetimeValue: 0
      };
    }

    // Calculate MRR
    const mrr = subscriptions.reduce((total, sub) => {
      const tier = Object.values(MiyomiSubscriptionManager.TIERS)
        .find(t => t.id === sub.tierId);
      return total + (tier?.price || 0);
    }, 0);

    // Calculate tier distribution
    const tierDist: Record<string, number> = {};
    subscriptions.forEach(sub => {
      tierDist[sub.tierId] = (tierDist[sub.tierId] || 0) + 1;
    });

    // Calculate churn (simplified - would need historical data)
    const { data: churned } = await this.supabase
      .from('miyomi_subscriptions')
      .select('count')
      .eq('status', 'canceled')
      .gte('endDate', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

    const churnRate = churned?.[0]?.count / subscriptions.length || 0;

    // Calculate average revenue per user
    const avgRevenue = mrr / subscriptions.length;

    // Calculate LTV (simplified)
    const ltv = avgRevenue * (1 / (churnRate || 0.1)) * 12; // Assumes monthly churn

    return {
      totalMRR: mrr,
      totalSubscribers: subscriptions.length,
      tierDistribution: tierDist,
      churnRate,
      averageRevenue: avgRevenue,
      lifetimeValue: ltv
    };
  }

  /**
   * Apply pick access rules based on tier
   */
  async applyPickAccess(pick: any, userTier: string): Promise<any> {
    const tier = MiyomiSubscriptionManager.TIERS[userTier];
    
    // Hide certain fields for lower tiers
    if (tier.name === 'FREE') {
      delete pick.sources;
      delete pick.detailedReasoning;
      pick.confidence = Math.round(pick.confidence * 10) / 10; // Less precision
      pick.edge = Math.min(pick.edge, 0.1); // Cap edge visibility
    }

    if (tier.name === 'CONTRARIAN') {
      pick.edge = Math.min(pick.edge, 0.2); // Cap at 20%
    }

    // Add tier badge
    pick.accessTier = tier.name;
    
    return pick;
  }

  // Helper methods
  private async createStripeSubscription(userId: string, tier: SubscriptionTier, paymentMethodId: string) {
    // Implement Stripe subscription creation
    // This would integrate with Stripe API
    return {
      stripeCustomerId: `cus_${userId}`,
      stripeSubscriptionId: `sub_${Date.now()}`
    };
  }

  private calculateEndDate(tier: SubscriptionTier): string {
    const date = new Date();
    if (tier.price === 0) {
      date.setFullYear(date.getFullYear() + 100); // Effectively never expires
    } else {
      date.setMonth(date.getMonth() + 1); // Monthly subscription
    }
    return date.toISOString();
  }

  private async getUserSubscription(userId: string): Promise<UserSubscription | null> {
    const { data } = await this.supabase
      .from('miyomi_subscriptions')
      .select('*')
      .eq('userId', userId)
      .eq('status', 'active')
      .single();
    
    return data;
  }

  private async getPickDetails(pickId: string): Promise<any> {
    const { data } = await this.supabase
      .from('miyomi_picks')
      .select('*')
      .eq('id', pickId)
      .single();
    
    return data;
  }

  private async getTodayPickCount(userId: string): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const { count } = await this.supabase
      .from('miyomi_pick_access')
      .select('count')
      .eq('userId', userId)
      .gte('accessedAt', today.toISOString());
    
    return count || 0;
  }

  private getNextTier(currentTierId: string): string {
    const tiers = ['FREE', 'CONTRARIAN', 'ORACLE', 'WHALE'];
    const currentIndex = tiers.findIndex(t => 
      MiyomiSubscriptionManager.TIERS[t].id === currentTierId
    );
    return tiers[Math.min(currentIndex + 1, tiers.length - 1)];
  }

  private async createPaymentIntent(amount: number, paymentMethodId: string) {
    // Implement Stripe payment intent creation
    return { status: 'succeeded' };
  }

  private async upgradeSubscription(userId: string, amount: number) {
    // Implement subscription upgrade logic
    return {} as UserSubscription;
  }

  private async trackRevenue(userId: string, amount: number, type: string) {
    await this.supabase
      .from('miyomi_revenue')
      .insert({
        userId,
        amount,
        type,
        createdAt: new Date().toISOString()
      });
  }
}

// Export singleton
export const subscriptionManager = new MiyomiSubscriptionManager();