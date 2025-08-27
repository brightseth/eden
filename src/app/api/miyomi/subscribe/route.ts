/**
 * MIYOMI Subscription API
 * Creates Coinbase Commerce payments for premium access
 */
import { NextRequest, NextResponse } from 'next/server';
import { coinbaseCommerce, MIYOMI_SUBSCRIPTION_TIERS } from '@/lib/coinbase-commerce';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { tier, email, metadata } = await request.json();

    // Validate tier
    const subscriptionTier = MIYOMI_SUBSCRIPTION_TIERS.find(t => t.id === tier);
    if (!subscriptionTier || tier === 'free') {
      return NextResponse.json(
        { error: 'Invalid subscription tier' },
        { status: 400 }
      );
    }

    // Validate email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email required' },
        { status: 400 }
      );
    }

    console.log(`Creating subscription charge for ${email} - ${tier}`);

    // Create Coinbase Commerce charge
    const charge = await coinbaseCommerce.createCharge(
      subscriptionTier.coinbaseChargeCode,
      email,
      {
        source: 'miyomi_site',
        timestamp: new Date().toISOString(),
        ...metadata
      }
    );

    return NextResponse.json({
      success: true,
      tier: subscriptionTier,
      payment: {
        charge_id: charge.id,
        hosted_url: charge.hosted_url,
        expires_at: charge.expires_at
      }
    });

  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to create subscription' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // Return available subscription tiers
  return NextResponse.json({
    tiers: MIYOMI_SUBSCRIPTION_TIERS
  });
}