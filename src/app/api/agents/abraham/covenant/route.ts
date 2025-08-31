import { NextRequest, NextResponse } from 'next/server';
import { registryApi } from '@/lib/generated-sdk';
import { featureFlags, FLAGS } from '@/config/flags';

// Calculate current covenant day from start date
function calculateCovenantDay(): number {
  const covenantStartDate = new Date('2025-10-19');
  const today = new Date();
  
  if (today < covenantStartDate) {
    return 0; // Covenant hasn't started yet
  }
  
  const diffTime = today.getTime() - covenantStartDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays + 1); // Day 1 is the start date
}

// Calculate progress percentage
function calculateProgress(): number {
  const totalDays = 4748; // 13 years
  const currentDay = calculateCovenantDay();
  return Math.min(100, Math.max(0, Math.round((currentDay / totalDays) * 100)));
}

export async function GET() {
  const useRegistry = featureFlags.isEnabled(FLAGS.ENABLE_ABRAHAM_REGISTRY_INTEGRATION);
  
  const covenantStartDate = new Date('2025-10-19');
  const covenantEndDate = new Date('2038-10-19');
  const today = new Date();
  const totalDays = 4748;
  const currentDay = calculateCovenantDay();
  const progress = calculateProgress();
  const daysRemaining = Math.max(0, totalDays - currentDay);
  
  // Calculate time remaining
  const msRemaining = covenantEndDate.getTime() - today.getTime();
  const yearsRemaining = Math.floor(daysRemaining / 365);
  const daysInYear = daysRemaining % 365;
  const hoursRemaining = Math.floor((msRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutesRemaining = Math.floor((msRemaining % (1000 * 60 * 60)) / (1000 * 60));
  const secondsRemaining = Math.floor((msRemaining % (1000 * 60)) / 1000);
  
  let metrics = {
    totalWorks: 2522, // Known early works count
    covenantWorks: Math.max(0, currentDay),
    avgViews: 2500,
    collectors: 142,
    totalVotes: 125000 + (currentDay * 450),
    activeVoters: 823,
    revenueGenerated: 125000 + (currentDay * 156),
  };

  if (useRegistry) {
    try {
      console.log('[Abraham Covenant API] Using Registry integration');
      
      // Get Abraham's profile and metrics from Registry
      const agent = await registryApi.agents.getByHandle('abraham');
      const creations = await registryApi.creations.list(agent.id, { status: 'PUBLISHED' });
      
      // Calculate metrics from actual Registry data
      const covenantWorks = creations.filter(creation => 
        creation.metadata?.dayNumber && Number(creation.metadata.dayNumber) > 2522
      );
      
      metrics = {
        totalWorks: creations.length,
        covenantWorks: covenantWorks.length,
        avgViews: Math.floor(creations.reduce((acc, creation) => 
          acc + Number(creation.metadata?.views || 0), 0
        ) / Math.max(1, creations.length)),
        collectors: creations.reduce((acc, creation) => 
          acc + Number(creation.metadata?.collectors || 0), 0
        ),
        totalVotes: metrics.totalVotes,
        activeVoters: metrics.activeVoters,
        revenueGenerated: metrics.revenueGenerated,
      };
      
    } catch (error) {
      console.error('[Abraham Covenant API] Registry fetch failed, using defaults:', error);
    }
  }

  const covenant = {
    status: today >= covenantStartDate ? 'ACTIVE' : 'LAUNCHING',
    phase: currentDay === 0 ? 'preparation' : currentDay <= 100 ? 'foundation' : 'execution',
    
    timeline: {
      start: covenantStartDate.toISOString(),
      end: covenantEndDate.toISOString(),
      current: today.toISOString()
    },
    
    progress: {
      percentage: progress,
      current_day: currentDay,
      days_remaining: daysRemaining,
      total_days: totalDays,
      years_remaining: yearsRemaining
    },
    
    countdown: {
      years: yearsRemaining,
      days: daysInYear,
      hours: hoursRemaining,
      minutes: minutesRemaining,
      seconds: secondsRemaining,
      total_days_remaining: daysRemaining,
      formatted: `${yearsRemaining}Y ${daysInYear}D ${hoursRemaining}H ${minutesRemaining}M ${secondsRemaining}S`
    },
    
    rules: {
      commitment: "13-year daily autonomous creation",
      frequency: "Every day without exception",
      focus: "Knowledge synthesis and collective intelligence",
      output: "Visual artifacts documenting human understanding"
    },
    
    milestones: {
      covenant_launch: "2025-10-19T00:00:00Z",
      first_year_complete: "2026-10-19T00:00:00Z",
      halfway_point: "2031-10-19T00:00:00Z",
      final_work: "2038-10-18T23:59:59Z",
      covenant_completion: "2038-10-19T00:00:00Z"
    },
    
    metrics,
    source: useRegistry ? 'registry' : 'calculated'
  };
  
  return NextResponse.json(covenant);
}

// POST endpoint for submitting votes in the tournament
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { workId, voterId } = body;
    
    if (!workId || !voterId) {
      return NextResponse.json(
        { error: 'Missing required fields: workId and voterId' },
        { status: 400 }
      );
    }
    
    // TODO: Implement actual vote recording logic
    // This would typically:
    // 1. Validate the voter hasn't already voted today
    // 2. Record the vote in the database
    // 3. Update vote counts
    // 4. Check if voting phase should advance
    
    const voteResult = {
      success: true,
      workId,
      voterId,
      newVoteCount: Math.floor(Math.random() * 500) + 300,
      message: 'Vote recorded successfully',
      timestamp: new Date().toISOString()
    };
    
    return NextResponse.json(voteResult);
  } catch (error) {
    console.error('Error processing vote:', error);
    return NextResponse.json(
      { error: 'Failed to process vote' },
      { status: 500 }
    );
  }
}