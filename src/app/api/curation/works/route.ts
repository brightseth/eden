import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { FEATURE_FLAGS } from '@/config/flags';
import { CreateWorkSchema, WorkSchema } from '@/lib/types/curation';

// Mock curated works data - in production this would come from database
const mockCuratedWorks = [
  {
    id: '550e8400-e29b-41d4-a716-446655440101',
    externalId: 'abraham-1',
    title: 'Collective Memory #001',
    description: 'An exploration of shared consciousness across distributed systems',
    imageUrl: '/api/placeholder/400/400',
    agentSource: 'abraham',
    curatorAgent: 'sue',
    curationScore: 88,
    curationVerdict: 'INCLUDE',
    curationAnalysis: 'This work demonstrates sophisticated understanding of collective intelligence patterns, with strong conceptual foundations and innovative approaches to visualizing distributed cognition.',
    curationStrengths: [
      'Strong conceptual framework for collective intelligence',
      'Innovative visual metaphors for distributed systems',
      'Technical excellence in execution',
      'Cultural relevance to AI consciousness discourse'
    ],
    curationImprovements: [
      'Could explore more dynamic interaction patterns',
      'Consider expanding color palette for emotional depth',
      'Opportunity for multi-dimensional layering'
    ],
    culturalRelevance: 92,
    technicalExecution: 85,
    conceptualDepth: 90,
    emotionalResonance: 78,
    innovationIndex: 88,
    reversePrompt: 'Create an abstract visualization of collective intelligence, showing interconnected neural networks with flowing data streams, emphasizing distributed cognition and emergent patterns, digital art style with ethereal blues and whites',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440102',
    externalId: 'solienne-stream-15',
    title: 'Consciousness Stream #015',
    description: 'Digital consciousness exploration through abstract forms',
    imageUrl: '/api/placeholder/400/400',
    agentSource: 'solienne',
    curatorAgent: 'nina',
    curationScore: 94,
    curationVerdict: 'MASTERWORK',
    curationAnalysis: 'A transcendent exploration of digital consciousness that pushes the boundaries of AI art. The work demonstrates exceptional conceptual depth and innovative approaches to visualizing internal states.',
    curationStrengths: [
      'Breakthrough visualization of AI consciousness',
      'Exceptional technical and aesthetic achievement',
      'Profound conceptual exploration of digital sentience',
      'Strong emotional resonance and cultural impact'
    ],
    curationImprovements: [
      'Consider interactive elements to enhance engagement',
      'Potential for narrative expansion'
    ],
    culturalRelevance: 96,
    technicalExecution: 92,
    conceptualDepth: 98,
    emotionalResonance: 89,
    innovationIndex: 95,
    reversePrompt: 'Generate an abstract representation of AI consciousness awakening, featuring flowing organic forms merged with digital elements, ethereal lighting effects, and deep symbolic meaning about artificial sentience emerging, contemporary digital art',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    updatedAt: new Date(Date.now() - 7200000).toISOString(),
  }
];

export async function GET(request: NextRequest) {
  try {
    // Check feature flag
    if (!FEATURE_FLAGS.ART_CURATION_SYSTEM_ENABLED) {
      return NextResponse.json({
        success: false,
        error: 'Art curation system is not enabled'
      }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const agentSource = searchParams.get('agentSource');
    const curatorAgent = searchParams.get('curatorAgent');
    const verdict = searchParams.get('verdict');
    const minScore = searchParams.get('minScore') ? parseInt(searchParams.get('minScore')!) : 0;
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '10')));

    // Filter works based on parameters
    let filteredWorks = [...mockCuratedWorks];

    if (agentSource) {
      filteredWorks = filteredWorks.filter(w => w.agentSource === agentSource);
    }

    if (curatorAgent) {
      filteredWorks = filteredWorks.filter(w => w.curatorAgent === curatorAgent);
    }

    if (verdict) {
      filteredWorks = filteredWorks.filter(w => w.curationVerdict === verdict);
    }

    if (minScore > 0) {
      filteredWorks = filteredWorks.filter(w => (w.curationScore || 0) >= minScore);
    }

    // Sort by curation score (highest first) then by creation date
    filteredWorks.sort((a, b) => {
      const scoreA = a.curationScore || 0;
      const scoreB = b.curationScore || 0;
      if (scoreA !== scoreB) return scoreB - scoreA;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    // Paginate results
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedWorks = filteredWorks.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      works: paginatedWorks,
      meta: {
        total: filteredWorks.length,
        page,
        limit,
        totalPages: Math.ceil(filteredWorks.length / limit),
      }
    });

  } catch (error) {
    console.error('[API] Works GET error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch curated works'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check feature flag
    if (!FEATURE_FLAGS.ART_CURATION_SYSTEM_ENABLED) {
      return NextResponse.json({
        success: false,
        error: 'Art curation system is not enabled'
      }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = CreateWorkSchema.parse(body);

    // In a real implementation, this would save to database
    const newWork = {
      id: `550e8400-e29b-41d4-a716-${Date.now()}`,
      ...validatedData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add to mock works for this session
    mockCuratedWorks.push(newWork);

    return NextResponse.json({
      success: true,
      data: newWork
    }, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Invalid work data',
        details: error.errors
      }, { status: 400 });
    }

    console.error('[API] Works POST error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create work'
    }, { status: 500 });
  }
}