/**
 * MIYOMI Status API
 * Monitor scheduler status and workflow health
 */
import { NextRequest, NextResponse } from 'next/server';
import { miyomiScheduler } from '@/lib/agents/miyomi-scheduler';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const status = miyomiScheduler.getStatus();
    
    return NextResponse.json({
      scheduler: status,
      workflow: {
        next_scheduled_drops: getNextScheduledDrops(),
        daily_schedule: ['11:00 ET', '15:00 ET', '21:00 ET'],
        timezone: 'America/New_York'
      },
      health: await getHealthChecks()
    });

  } catch (error) {
    console.error('Error fetching MIYOMI status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function getNextScheduledDrops() {
  const now = new Date();
  const dropTimes = [11, 15, 21]; // Hours in ET
  const nextDrops = [];

  for (let day = 0; day <= 1; day++) {
    const targetDate = new Date(now);
    targetDate.setDate(targetDate.getDate() + day);

    for (const hour of dropTimes) {
      const dropTime = new Date(targetDate);
      dropTime.setHours(hour, 0, 0, 0);

      // Convert to ET
      const etTime = new Date(dropTime.toLocaleString('en-US', { timeZone: 'America/New_York' }));
      
      if (etTime > now) {
        nextDrops.push({
          time: etTime.toISOString(),
          timeET: dropTime.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            timeZone: 'America/New_York' 
          }),
          hoursUntil: Math.round((etTime.getTime() - now.getTime()) / (1000 * 60 * 60))
        });
      }
    }
  }

  return nextDrops.slice(0, 3); // Next 3 drops
}

async function getHealthChecks() {
  const health = {
    claude_sdk: 'unknown',
    eden_api: 'unknown',
    registry: 'unknown',
    overall: 'unknown'
  };

  try {
    // Check Claude SDK
    const claudeKey = process.env.ANTHROPIC_API_KEY;
    health.claude_sdk = claudeKey ? 'connected' : 'missing_key';

    // Check Eden API
    const edenKey = process.env.EDEN_API_KEY;
    const edenUrl = process.env.EDEN_BASE_URL;
    health.eden_api = (edenKey && edenUrl) ? 'configured' : 'missing_config';

    // Check Registry connection
    const registryUrl = process.env.REGISTRY_BASE_URL;
    health.registry = registryUrl ? 'configured' : 'missing_config';

    // Overall health
    const allGood = Object.values(health).every(status => 
      status === 'connected' || status === 'configured'
    );
    health.overall = allGood ? 'healthy' : 'needs_attention';

  } catch (error) {
    health.overall = 'error';
  }

  return health;
}