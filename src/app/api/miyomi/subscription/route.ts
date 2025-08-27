/**
 * MIYOMI Subscription API
 * Handles subscription creation, upgrades, and payment processing
 */
import { NextRequest, NextResponse } from 'next/server';
import { subscriptionManager, MiyomiSubscriptionManager } from '@/lib/agents/miyomi-subscription';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { userId, tierId, paymentMethodId } = await request.json();

    if (!userId || !tierId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create or upgrade subscription
    const subscription = await subscriptionManager.createSubscription(
      userId,
      tierId,
      paymentMethodId
    );

    return NextResponse.json({
      success: true,
      subscription,
      message: `Successfully subscribed to ${tierId} tier`
    });

  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json(
      { error: 'Subscription failed' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (userId) {
      // Get user's current subscription
      const { data } = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/miyomi_subscriptions?userId=eq.${userId}&status=eq.active`, {
        headers: {
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`
        }
      }).then(res => res.json());

      return NextResponse.json(data?.[0] || null);
    }

    // Return available tiers
    return NextResponse.json(MiyomiSubscriptionManager.TIERS);

  } catch (error) {
    console.error('Get subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscription' },
      { status: 500 }
    );
  }
}