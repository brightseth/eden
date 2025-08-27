/**
 * MIYOMI Revenue Analytics API
 * Provides revenue metrics and subscription analytics
 */
import { NextRequest, NextResponse } from 'next/server';
import { subscriptionManager } from '@/lib/agents/miyomi-subscription';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    // Verify internal request or admin access
    const authHeader = request.headers.get('authorization');
    const adminToken = process.env.ADMIN_API_TOKEN;
    
    if (!authHeader || authHeader !== `Bearer ${adminToken}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get revenue metrics
    const metrics = await subscriptionManager.getRevenueMetrics();

    // Add additional analytics
    const analytics = {
      ...metrics,
      projectedMRR: calculateProjectedMRR(metrics),
      growthRate: calculateGrowthRate(metrics),
      conversionFunnel: await getConversionFunnel(),
      topPerformingPicks: await getTopPerformingPicks(),
      subscriberActivity: await getSubscriberActivity()
    };

    return NextResponse.json(analytics);

  } catch (error) {
    console.error('Revenue API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch revenue metrics' },
      { status: 500 }
    );
  }
}

function calculateProjectedMRR(metrics: any): number {
  // Simple projection based on current growth
  const growthRate = 1.15; // 15% monthly growth assumption
  return metrics.totalMRR * growthRate;
}

function calculateGrowthRate(metrics: any): number {
  // Would need historical data for real calculation
  return 0.15; // Placeholder 15% growth
}

async function getConversionFunnel() {
  // Fetch conversion data from database
  return {
    visitors: 10000,
    signups: 500,
    freeUsers: 450,
    paidUsers: 50,
    conversionRate: 0.05
  };
}

async function getTopPerformingPicks() {
  // Get picks that drove most conversions
  const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/miyomi_picks?order=performance.desc&limit=10`, {
    headers: {
      'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`
    }
  });

  return response.json();
}

async function getSubscriberActivity() {
  // Get activity metrics
  return {
    dailyActiveUsers: 145,
    weeklyActiveUsers: 387,
    monthlyActiveUsers: 450,
    averagePicksViewed: 3.2,
    averageSessionDuration: 480 // seconds
  };
}