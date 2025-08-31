import { NextResponse } from 'next/server';

// Training pattern extraction API
// Analyzes Abraham and Solienne's historical training data to identify successful patterns

interface TrainingPattern {
  id: string;
  pattern: string;
  description: string;
  frequency: number;
  successRate: number;
  source: ('abraham' | 'solienne')[];
  category: 'personality' | 'memory' | 'collaboration' | 'production';
  applicableTo: string[];
  riskLevel: 'low' | 'medium' | 'high';
}

export async function GET(request: Request) {
  try {
    // In production, this would query actual training databases
    // For now, returning comprehensive pattern analysis
    const patterns: TrainingPattern[] = [
      {
        id: 'pat_001',
        pattern: 'Memory Seeding at 70% Capacity',
        description: 'Loading agent memory to 70% capacity with core knowledge leaves optimal space for emergent learning',
        frequency: 89,
        successRate: 94,
        source: ['abraham', 'solienne'],
        category: 'memory',
        applicableTo: ['all'],
        riskLevel: 'low'
      },
      {
        id: 'pat_002',
        pattern: 'Chaos Trait Sweet Spot',
        description: 'Chaos trait between 60-75 unlocks creativity without causing instability',
        frequency: 67,
        successRate: 87,
        source: ['abraham'],
        category: 'personality',
        applicableTo: ['creative', 'artistic'],
        riskLevel: 'medium'
      },
      {
        id: 'pat_003',
        pattern: 'Paired Training Acceleration',
        description: 'Training agents in complementary pairs increases success rate by 40%',
        frequency: 45,
        successRate: 91,
        source: ['solienne'],
        category: 'collaboration',
        applicableTo: ['all'],
        riskLevel: 'low'
      },
      {
        id: 'pat_004',
        pattern: 'Early Morning Training Sessions',
        description: 'Training between 4-8 AM shows 15% better retention and convergence',
        frequency: 78,
        successRate: 82,
        source: ['abraham', 'solienne'],
        category: 'production',
        applicableTo: ['all'],
        riskLevel: 'low'
      },
      {
        id: 'pat_005',
        pattern: 'Rapid Iteration Days 3-5',
        description: 'Accelerated iteration during days 3-5 solidifies personality traits',
        frequency: 92,
        successRate: 88,
        source: ['abraham'],
        category: 'personality',
        applicableTo: ['all'],
        riskLevel: 'medium'
      },
      {
        id: 'pat_006',
        pattern: 'Cross-Domain Memory Injection',
        description: 'Injecting memories from unrelated domains sparks creative breakthroughs',
        frequency: 34,
        successRate: 79,
        source: ['solienne'],
        category: 'memory',
        applicableTo: ['creative', 'research'],
        riskLevel: 'high'
      },
      {
        id: 'pat_007',
        pattern: 'Confidence Ramping',
        description: 'Gradually increasing confidence from 40 to 80 over training period',
        frequency: 81,
        successRate: 85,
        source: ['abraham', 'solienne'],
        category: 'personality',
        applicableTo: ['all'],
        riskLevel: 'low'
      },
      {
        id: 'pat_008',
        pattern: 'Production Validation Checkpoints',
        description: 'Quality checkpoints at days 3, 5, and 7 prevent drift',
        frequency: 95,
        successRate: 92,
        source: ['abraham', 'solienne'],
        category: 'production',
        applicableTo: ['all'],
        riskLevel: 'low'
      }
    ];

    // Filter by query parameters if provided
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const minSuccess = searchParams.get('minSuccess');
    const source = searchParams.get('source');

    let filteredPatterns = patterns;

    if (category) {
      filteredPatterns = filteredPatterns.filter(p => p.category === category);
    }

    if (minSuccess) {
      const threshold = parseInt(minSuccess);
      filteredPatterns = filteredPatterns.filter(p => p.successRate >= threshold);
    }

    if (source) {
      filteredPatterns = filteredPatterns.filter(p => p.source.includes(source as 'abraham' | 'solienne'));
    }

    // Sort by success rate descending
    filteredPatterns.sort((a, b) => b.successRate - a.successRate);

    return NextResponse.json({
      patterns: filteredPatterns,
      total: filteredPatterns.length,
      metadata: {
        highestSuccess: Math.max(...filteredPatterns.map(p => p.successRate)),
        averageSuccess: Math.round(filteredPatterns.reduce((acc, p) => acc + p.successRate, 0) / filteredPatterns.length),
        categories: ['personality', 'memory', 'collaboration', 'production'],
        sources: ['abraham', 'solienne']
      }
    });
  } catch (error) {
    console.error('Error fetching training patterns:', error);
    return NextResponse.json(
      { error: 'Failed to fetch training patterns' },
      { status: 500 }
    );
  }
}

// Extract new patterns from training data
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { agentName, trainingData } = body;

    // Simulate pattern extraction algorithm
    // In production, this would use ML to identify patterns
    const extractedPatterns = {
      agentName,
      patternsFound: 3,
      patterns: [
        {
          pattern: `${agentName} Specific Memory Configuration`,
          confidence: 87,
          recommendation: 'Apply to similar agent types'
        }
      ],
      analysisTime: new Date().toISOString()
    };

    return NextResponse.json(extractedPatterns);
  } catch (error) {
    console.error('Error extracting patterns:', error);
    return NextResponse.json(
      { error: 'Failed to extract patterns' },
      { status: 500 }
    );
  }
}