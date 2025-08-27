/**
 * Launch Status API
 * Provides real-time status of staged feature launches
 */

import { NextRequest, NextResponse } from 'next/server';
import { stagedLaunchManager } from '@/lib/launch/staged-launch';
import { FEATURE_FLAGS } from '@/config/flags';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const featureKey = url.searchParams.get('feature');

    if (featureKey) {
      // Get status for specific feature
      if (!FEATURE_FLAGS[featureKey]) {
        return NextResponse.json(
          { error: 'Feature not found' }, 
          { status: 404 }
        );
      }

      const status = stagedLaunchManager.getLaunchStatus(featureKey);
      
      return NextResponse.json({
        feature: featureKey,
        ...status,
        flagConfig: FEATURE_FLAGS[featureKey]
      });
    }

    // Get status for all features
    const allFeatures = Object.keys(FEATURE_FLAGS);
    const statuses = allFeatures.reduce((acc, key) => {
      acc[key] = {
        ...stagedLaunchManager.getLaunchStatus(key),
        flagConfig: FEATURE_FLAGS[key]
      };
      return acc;
    }, {} as Record<string, any>);

    return NextResponse.json({
      features: statuses,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('[Launch Status API] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, featureKey, stage, reason } = body;

    if (!featureKey || !FEATURE_FLAGS[featureKey]) {
      return NextResponse.json(
        { error: 'Invalid feature key' }, 
        { status: 400 }
      );
    }

    switch (action) {
      case 'start':
        const startStage = stage || 'dev';
        const started = await stagedLaunchManager.startLaunch(featureKey, startStage);
        return NextResponse.json({ success: started, action: 'started', stage: startStage });

      case 'advance':
        const advanced = await stagedLaunchManager.advanceStage(featureKey);
        return NextResponse.json({ success: advanced, action: 'advanced' });

      case 'rollback':
        await stagedLaunchManager.rollback(featureKey, reason || 'Manual rollback');
        return NextResponse.json({ success: true, action: 'rollback' });

      case 'force':
        if (!stage) {
          return NextResponse.json(
            { error: 'Stage required for force action' }, 
            { status: 400 }
          );
        }
        await stagedLaunchManager.forceStage(featureKey, stage, reason || 'Manual override');
        return NextResponse.json({ success: true, action: 'forced', stage });

      default:
        return NextResponse.json(
          { error: 'Invalid action. Use: start, advance, rollback, force' }, 
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('[Launch Control API] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}