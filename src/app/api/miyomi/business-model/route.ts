/**
 * MIYOMI Business Model Management API
 * Switch between revenue models and track performance
 */
import { NextRequest, NextResponse } from 'next/server';
import { revenueEngine, MiyomiRevenueEngine } from '@/lib/agents/miyomi-revenue-engine';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'models':
        // Return available business models
        return NextResponse.json(MiyomiRevenueEngine.BUSINESS_MODELS);

      case 'attribution':
        // Get current revenue attribution
        const attribution = await revenueEngine.calculateAttribution();
        return NextResponse.json(attribution);

      case 'opportunities':
        // Get sponsorship opportunities
        const opportunities = await revenueEngine.getSponsorshipOpportunities();
        return NextResponse.json(opportunities);

      case 'recommendations':
        // Get optimization recommendations
        const recommendations = await revenueEngine.optimizeRevenueMix();
        return NextResponse.json(recommendations);

      default:
        return NextResponse.json(
          { error: 'Invalid action parameter' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Business model API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch business model data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, modelId, experiment } = body;

    switch (action) {
      case 'switch_model':
        if (!modelId || !MiyomiRevenueEngine.BUSINESS_MODELS[modelId]) {
          return NextResponse.json(
            { error: 'Invalid model ID' },
            { status: 400 }
          );
        }

        revenueEngine.switchBusinessModel(modelId);
        return NextResponse.json({
          success: true,
          message: `Switched to ${modelId} model`,
          model: MiyomiRevenueEngine.BUSINESS_MODELS[modelId]
        });

      case 'start_experiment':
        if (!experiment?.name || !experiment?.variants) {
          return NextResponse.json(
            { error: 'Missing experiment parameters' },
            { status: 400 }
          );
        }

        const experimentResult = await revenueEngine.startRevenueExperiment(experiment);
        return NextResponse.json({
          success: true,
          experiment: experimentResult
        });

      case 'track_event':
        const { event } = body;
        if (!event?.type || !event?.platform) {
          return NextResponse.json(
            { error: 'Invalid event data' },
            { status: 400 }
          );
        }

        await revenueEngine.trackEvent(event);
        return NextResponse.json({ success: true });

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Business model API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { pickId, sponsorshipId } = body;

    if (!pickId || !sponsorshipId) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Get pick data
    const pickResponse = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/miyomi_picks?id=eq.${pickId}`, {
      headers: {
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`
      }
    });

    const picks = await pickResponse.json();
    const pick = picks?.[0];

    if (!pick) {
      return NextResponse.json(
        { error: 'Pick not found' },
        { status: 404 }
      );
    }

    // Get sponsorship opportunity
    const opportunities = await revenueEngine.getSponsorshipOpportunities();
    const sponsorship = opportunities.find(o => o.id === sponsorshipId);

    if (!sponsorship) {
      return NextResponse.json(
        { error: 'Sponsorship opportunity not found' },
        { status: 404 }
      );
    }

    // Create sponsored pick
    const sponsoredPick = await revenueEngine.createSponsoredPick(pick, sponsorship);

    return NextResponse.json({
      success: true,
      sponsoredPick
    });

  } catch (error) {
    console.error('Sponsored pick creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create sponsored pick' },
      { status: 500 }
    );
  }
}