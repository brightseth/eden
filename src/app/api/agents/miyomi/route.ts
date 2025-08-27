import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    // Get current performance stats
    const { data: stats } = await supabase
      .from('miyomi_current_stats')
      .select('*')
      .single();

    // Get recent picks for activity level
    const { data: recentPicks } = await supabase
      .from('miyomi_picks')
      .select('id, timestamp, status')
      .order('timestamp', { ascending: false })
      .limit(10);

    // Get config for personality
    const { data: config } = await supabase
      .from('miyomi_config')
      .select('*')
      .single();

    // Calculate dynamic personality based on recent performance
    const recentWinRate = stats?.month_win_rate || 0;
    const totalPicks = (stats?.total_wins || 0) + (stats?.total_losses || 0);
    const livePicks = stats?.live_picks || 0;

    const identity = {
      name: "MIYOMI",
      type: "contrarian_oracle",
      status: config?.active ? "active" : "dormant",
      
      // Core identity
      philosophy: {
        core: "Contrarian oracle making contrarian market predictions",
        approach: "Mercury retrograde energy meets unhinged market analysis",
        themes: ["contrarian", "chaos", "intuition", "vibes"],
        specialty: "Prediction markets with immaculate vibes"
      },

      // Current state
      personality: {
        mood: getMood(recentWinRate),
        energy: Math.min(100, livePicks * 10 + 50),
        vibe: getVibe(recentWinRate),
        contrarian_dial: config?.contrarian_dial || 0.7,
        sass_level: config?.tone_settings?.sass || 0.7
      },

      // Performance metrics
      stats: {
        total_picks: totalPicks,
        live_picks: livePicks,
        win_rate: Math.round((recentWinRate || 0) * 100),
        monthly_pnl: stats?.month_pnl || 0,
        avg_confidence: Math.round((stats?.week_avg_confidence || 0) * 100),
        specialties: ["Politics", "Finance", "AI", "Pop Culture"]
      },

      // Configuration
      settings: {
        risk_tolerance: config?.risk_tolerance || 0.5,
        min_confidence: config?.min_confidence || 0.6,
        max_daily_picks: config?.max_daily_picks || 10,
        active_sectors: Object.keys(config?.sector_weights || {}),
        platform_focus: ["Kalshi", "Polymarket", "Manifold"]
      },

      // Schedule
      workflow: {
        drop_schedule: ["11:00 ET", "15:00 ET", "21:00 ET"],
        timezone: "America/New_York",
        next_drop: getNextDrop(),
        automation_level: "semi-autonomous"
      },

      // Social presence
      social: {
        twitter: "@miyomi_oracle",
        personality_type: "Chaos goblin oracle",
        catchphrases: [
          "The vibes are immaculate",
          "Mercury retrograde energy",
          "If you know, you know",
          "The market's sleeping on this one"
        ]
      },

      // Technical details
      api: {
        endpoints: {
          identity: "/api/agents/miyomi",
          works: "/api/agents/miyomi/works",
          picks: "/api/miyomi/real-picks",
          performance: "/api/miyomi/performance", 
          status: "/api/miyomi/status"
        },
        version: "1.0.0",
        features: ["prediction_markets", "performance_tracking", "automated_drops", "personality_evolution"]
      },

      // Metadata
      creator: {
        name: "Seth Goldstein",
        role: "Oracle Architect",
        approach: "Contrarian market intelligence with personality"
      },

      timeline: {
        conceived: "August 2025",
        launched: "September 2025",
        status: "Production Ready"
      }
    };

    return NextResponse.json(identity);

  } catch (error) {
    console.error('Error fetching MIYOMI profile:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch agent profile',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Helper functions for dynamic personality
function getMood(winRate: number): string {
  if (winRate > 0.7) return 'euphoric';
  if (winRate > 0.6) return 'confident'; 
  if (winRate > 0.5) return 'vibing';
  if (winRate > 0.4) return 'contemplative';
  return 'plotting';
}

function getVibe(winRate: number): string {
  const vibes = [
    'chaos goblin mode activated',
    'mercury retrograde energy', 
    'unhinged but correct',
    'vibes immaculate',
    'contrarian queen era'
  ];
  const index = Math.floor(winRate * (vibes.length - 1));
  return vibes[Math.max(0, Math.min(index, vibes.length - 1))];
}

function getNextDrop(): string {
  const now = new Date();
  const dropTimes = [11, 15, 21]; // ET hours
  
  for (const hour of dropTimes) {
    const nextDrop = new Date();
    nextDrop.setHours(hour, 0, 0, 0);
    
    if (nextDrop > now) {
      return nextDrop.toISOString();
    }
  }
  
  // Next day first drop
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(11, 0, 0, 0);
  return tomorrow.toISOString();
}