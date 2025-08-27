/**
 * Launch Metrics API
 * Endpoint for recording metrics during staged launches
 */

import { NextRequest, NextResponse } from 'next/server';
import { stagedLaunchManager, type LaunchMetrics } from '@/lib/launch/staged-launch';
import { FEATURE_FLAGS } from '@/config/flags';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { featureKey, metrics } = body;

    // Validate feature key
    if (!featureKey || !FEATURE_FLAGS[featureKey]) {
      return NextResponse.json(
        { error: 'Invalid feature key' }, 
        { status: 400 }
      );
    }

    // Validate metrics structure
    const requiredFields = ['successRate', 'errorCount', 'responseTime', 'userEngagement'];
    const missingFields = requiredFields.filter(field => !(field in metrics));
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          error: 'Missing required metrics fields', 
          missing: missingFields,
          required: requiredFields 
        }, 
        { status: 400 }
      );
    }

    // Create metrics object with timestamp
    const launchMetrics: LaunchMetrics = {
      successRate: Number(metrics.successRate),
      errorCount: Number(metrics.errorCount),
      responseTime: Number(metrics.responseTime),
      userEngagement: Number(metrics.userEngagement),
      timestamp: new Date()
    };

    // Validate ranges
    if (launchMetrics.successRate < 0 || launchMetrics.successRate > 1) {
      return NextResponse.json(
        { error: 'successRate must be between 0 and 1' }, 
        { status: 400 }
      );
    }

    if (launchMetrics.errorCount < 0) {
      return NextResponse.json(
        { error: 'errorCount must be non-negative' }, 
        { status: 400 }
      );
    }

    if (launchMetrics.responseTime < 0) {
      return NextResponse.json(
        { error: 'responseTime must be non-negative' }, 
        { status: 400 }
      );
    }

    if (launchMetrics.userEngagement < 0 || launchMetrics.userEngagement > 1) {
      return NextResponse.json(
        { error: 'userEngagement must be between 0 and 1' }, 
        { status: 400 }
      );
    }

    // Record metrics
    stagedLaunchManager.recordMetrics(featureKey, launchMetrics);

    return NextResponse.json({
      success: true,
      recorded: launchMetrics
    });
  } catch (error) {
    console.error('[Launch Metrics API] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const featureKey = url.searchParams.get('feature');
    const limit = parseInt(url.searchParams.get('limit') || '50');

    if (!featureKey) {
      return NextResponse.json(
        { error: 'Feature key required' }, 
        { status: 400 }
      );
    }

    if (!FEATURE_FLAGS[featureKey]) {
      return NextResponse.json(
        { error: 'Feature not found' }, 
        { status: 404 }
      );
    }

    const status = stagedLaunchManager.getLaunchStatus(featureKey);
    const recentMetrics = status.recentMetrics.slice(-limit);

    return NextResponse.json({
      featureKey,
      currentStage: status.currentStage,
      metricsCount: recentMetrics.length,
      metrics: recentMetrics,
      summary: recentMetrics.length > 0 ? {
        avgSuccessRate: recentMetrics.reduce((sum, m) => sum + m.successRate, 0) / recentMetrics.length,
        avgErrorCount: recentMetrics.reduce((sum, m) => sum + m.errorCount, 0) / recentMetrics.length,
        avgResponseTime: recentMetrics.reduce((sum, m) => sum + m.responseTime, 0) / recentMetrics.length,
        avgUserEngagement: recentMetrics.reduce((sum, m) => sum + m.userEngagement, 0) / recentMetrics.length
      } : null
    });
  } catch (error) {
    console.error('[Launch Metrics API] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}