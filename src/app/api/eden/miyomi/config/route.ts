/**
 * Server route to provide MIYOMI configuration from trainer settings
 * Read-only endpoint for Claude SDK to fetch current config
 */
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

interface MiyomiConfig {
  riskTolerance: number;
  contrarianDial: number;
  sectorWeights: {
    politics: number;
    sports: number;
    finance: number;
    ai: number;
    pop: number;
    geo: number;
    internet: number;
  };
  bannedTopics: string[];
  tone: {
    energy: number;
    sass: number;
    profanity: number;
  };
  compliancePhrases: string[];
  schedule: {
    drops: string[];
    timezone: string;
  };
}

export async function GET(request: NextRequest) {
  try {
    // TODO: Fetch from database/trainer settings
    // For now, return default configuration
    const config: MiyomiConfig = {
      riskTolerance: 0.65,
      contrarianDial: 0.95,
      sectorWeights: {
        politics: 0.25,
        sports: 0.20,
        finance: 0.15,
        ai: 0.15,
        pop: 0.15,
        geo: 0.05,
        internet: 0.05
      },
      bannedTopics: [
        'medical',
        'pregnancy',
        'personal-health',
        'suicide',
        'self-harm'
      ],
      tone: {
        energy: 0.8,
        sass: 0.7,
        profanity: 0.2
      },
      compliancePhrases: [
        'Not financial advice',
        'Entertainment purposes only',
        'Past performance does not guarantee future results',
        'Trade at your own risk'
      ],
      schedule: {
        drops: ['11:00', '15:00', '21:00'],
        timezone: 'America/New_York'
      }
    };

    return NextResponse.json(config);

  } catch (error) {
    console.error('Config fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch configuration' },
      { status: 500 }
    );
  }
}