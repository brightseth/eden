/**
 * Coinbase Commerce Integration for MIYOMI Revenue System
 * Handles subscription payments and premium access
 */

export interface SubscriptionTier {
  id: string;
  name: string;
  price: number; // USD
  features: string[];
  coinbaseChargeCode: string;
}

export const MIYOMI_SUBSCRIPTION_TIERS: SubscriptionTier[] = [
  {
    id: 'free',
    name: 'Public Access',
    price: 0,
    features: [
      'View public performance metrics',
      'See daily picks after resolution',
      'Basic market analysis insights'
    ],
    coinbaseChargeCode: ''
  },
  {
    id: 'premium',
    name: 'Premium Signals',
    price: 29,
    features: [
      'Real-time picks before market close',
      'Detailed reasoning and edge calculations',
      'SMS/email notifications for high-confidence picks',
      'Performance analytics dashboard',
      'Historical pick database access'
    ],
    coinbaseChargeCode: 'MIYOMI_PREMIUM_MONTHLY'
  },
  {
    id: 'professional',
    name: 'Professional Trader',
    price: 99,
    features: [
      'All Premium features',
      'API access for automated trading',
      'Custom market analysis requests',
      'Direct trainer dashboard access',
      'Priority support and custom alerts'
    ],
    coinbaseChargeCode: 'MIYOMI_PRO_MONTHLY'
  }
];

export class CoinbaseCommerceClient {
  private apiKey: string;
  private baseUrl = 'https://api.commerce.coinbase.com';

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.COINBASE_COMMERCE_API_KEY || '';
  }

  /**
   * Create a new charge for subscription payment
   */
  async createCharge(
    tierCode: string,
    userEmail: string,
    metadata: Record<string, any> = {}
  ): Promise<{
    id: string;
    hosted_url: string;
    redirect_url?: string;
    expires_at: string;
  }> {
    const tier = MIYOMI_SUBSCRIPTION_TIERS.find(t => t.coinbaseChargeCode === tierCode);
    if (!tier) {
      throw new Error(`Invalid subscription tier: ${tierCode}`);
    }

    try {
      const response = await fetch(`${this.baseUrl}/charges`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'X-CC-Api-Version': '2018-03-22'
        },
        body: JSON.stringify({
          name: `MIYOMI ${tier.name} Subscription`,
          description: `Monthly access to ${tier.name} features`,
          pricing_type: 'fixed_price',
          local_price: {
            amount: tier.price.toString(),
            currency: 'USD'
          },
          metadata: {
            tier_id: tier.id,
            user_email: userEmail,
            agent: 'miyomi',
            ...metadata
          },
          redirect_url: `${process.env.NEXT_PUBLIC_BASE_URL}/sites/miyomi?payment=success`,
          cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/sites/miyomi?payment=cancelled`
        })
      });

      if (!response.ok) {
        throw new Error(`Coinbase Commerce API error: ${response.status}`);
      }

      const charge = await response.json();
      return {
        id: charge.data.id,
        hosted_url: charge.data.hosted_url,
        redirect_url: charge.data.redirect_url,
        expires_at: charge.data.expires_at
      };

    } catch (error) {
      console.error('Error creating Coinbase charge:', error);
      throw error;
    }
  }

  /**
   * Verify payment completion via webhook
   */
  async verifyPayment(chargeId: string): Promise<{
    paid: boolean;
    tier: string;
    userEmail: string;
    amount: number;
    transaction_id?: string;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/charges/${chargeId}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'X-CC-Api-Version': '2018-03-22'
        }
      });

      if (!response.ok) {
        throw new Error(`Coinbase Commerce API error: ${response.status}`);
      }

      const charge = await response.json();
      const data = charge.data;

      return {
        paid: data.timeline.some((event: any) => event.status === 'COMPLETED'),
        tier: data.metadata.tier_id,
        userEmail: data.metadata.user_email,
        amount: parseFloat(data.pricing.local.amount),
        transaction_id: data.payments?.[0]?.transaction_id
      };

    } catch (error) {
      console.error('Error verifying payment:', error);
      throw error;
    }
  }

  /**
   * Handle webhook signature validation
   */
  validateWebhook(payload: string, signature: string, secret: string): boolean {
    const crypto = require('crypto');
    const computedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload, 'utf8')
      .digest('hex');

    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(computedSignature, 'hex')
    );
  }
}

export const coinbaseCommerce = new CoinbaseCommerceClient();