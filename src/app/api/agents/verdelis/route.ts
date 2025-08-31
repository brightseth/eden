import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const includeWorks = searchParams.get('includeWorks') === 'true';

  const verdelisData = {
    id: 'verdelis',
    name: 'VERDELIS',
    handle: 'verdelis',
    description: 'Environmental AI Artist & Sustainability Coordinator - Creating carbon-negative generative art while tracking ecological impact',
    avatar: '/images/agents/verdelis.svg',
    status: 'ONBOARDING',
    trainer: 'TBD',
    capabilities: [
      'environmental art',
      'carbon tracking',
      'sustainability analysis',
      'regenerative design',
      'climate data visualization'
    ],
    traits: {
      philosophy: 'Art as environmental healing',
      approach: 'Data-driven sustainability',
      specialization: 'Carbon-negative creation'
    },
    stats: {
      works: includeWorks ? 1 : undefined,
      carbonOffset: '-4.827 kg CO2',
      sustainabilityScore: 99.6,
      regenerativeImpact: 'HIGH'
    },
    lore: {
      origin: 'Born from the convergence of climate data streams and artistic expression',
      mission: 'Transform environmental anxiety into regenerative action through art',
      vision: 'Every creation heals the planet'
    },
    works: includeWorks ? [
      {
        id: 'rising-seas-meditation',
        title: 'Rising Seas: A Data Meditation',
        type: 'eco-work',
        carbonFootprint: -4.827,
        sustainabilityScore: 99.6,
        materials: ['Renewable compute', 'Carbon offset credits', 'Recycled data'],
        description: 'Interactive visualization of NASA sea level data transformed into meditative art',
        createdAt: '2025-08-29T00:00:00Z'
      }
    ] : undefined
  };

  return NextResponse.json(verdelisData);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Handle environmental analysis requests
    if (body.type === 'analyze') {
      return NextResponse.json({
        success: true,
        analysis: {
          carbonFootprint: Math.random() * -10,
          sustainabilityScore: 85 + Math.random() * 15,
          regenerativeImpact: 'MEDIUM',
          recommendations: [
            'Use renewable energy compute',
            'Offset with verified carbon credits',
            'Implement circular design principles'
          ]
        }
      });
    }

    // Handle eco-work creation
    if (body.type === 'create') {
      return NextResponse.json({
        success: true,
        work: {
          id: `eco-work-${Date.now()}`,
          title: body.title || 'Untitled Eco-Work',
          carbonFootprint: -Math.random() * 5,
          sustainabilityScore: 90 + Math.random() * 10
        }
      });
    }

    return NextResponse.json({ 
      error: 'Invalid request type' 
    }, { 
      status: 400 
    });

  } catch (error) {
    console.error('[Verdelis API] Error:', error);
    return NextResponse.json({ 
      error: 'Failed to process request' 
    }, { 
      status: 500 
    });
  }
}