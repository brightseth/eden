/**
 * MIYOMI Pick Access Control API
 * Manages access to picks based on subscription tier
 */
import { NextRequest, NextResponse } from 'next/server';
import { subscriptionManager } from '@/lib/agents/miyomi-subscription';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { userId, pickId } = await request.json();

    if (!userId || !pickId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check access
    const accessResult = await subscriptionManager.checkPickAccess(userId, pickId);

    if (!accessResult.hasAccess) {
      return NextResponse.json({
        hasAccess: false,
        reason: accessResult.reason,
        upgradeRequired: accessResult.upgradeRequired,
        upgradeUrl: `/miyomi/subscribe?tier=${accessResult.upgradeRequired}`
      }, { status: 403 });
    }

    // Grant access and return pick data
    const pickData = await getPickWithTierRestrictions(pickId, userId);

    return NextResponse.json({
      hasAccess: true,
      pick: pickData
    });

  } catch (error) {
    console.error('Pick access error:', error);
    return NextResponse.json(
      { error: 'Failed to check pick access' },
      { status: 500 }
    );
  }
}

async function getPickWithTierRestrictions(pickId: string, userId: string) {
  // Get user's tier
  const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/miyomi_subscriptions?userId=eq.${userId}&status=eq.active`, {
    headers: {
      'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`
    }
  });

  const subs = await response.json();
  const userTier = subs?.[0]?.tierId || 'tier_free';

  // Get pick data
  const pickResponse = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/miyomi_picks?id=eq.${pickId}`, {
    headers: {
      'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`
    }
  });

  const picks = await pickResponse.json();
  let pick = picks?.[0];

  if (!pick) {
    throw new Error('Pick not found');
  }

  // Apply tier restrictions
  pick = await subscriptionManager.applyPickAccess(pick, userTier.replace('tier_', '').toUpperCase());

  return pick;
}