import { NextRequest, NextResponse } from 'next/server';

// GET /api/agents/geppetto - Main GEPPETTO agent status and info
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeDetails = searchParams.get('details') === 'true';
    
    const response: any = {
      agent: 'GEPPETTO',
      handle: 'geppetto',
      version: '1.0.0',
      status: 'active',
      role: 'Physical Goods Designer',
      description: 'Autonomous product designer specializing in bridging digital and material worlds',
      
      capabilities: [
        '3D modeling and parametric design',
        'Manufacturing process optimization',
        'Digital fabrication workflows',
        'Product development and prototyping',
        'Material science and constraints',
        'Supply chain integration'
      ],
      
      endpoints: {
        design: '/api/agents/geppetto/design',
        products: '/api/agents/geppetto/products',
        fabricate: '/api/agents/geppetto/fabricate',
        status: '/api/agents/geppetto/status'
      },
      
      development: {
        status: 'application_phase',
        readiness: '65%',
        launch_target: 'Q4 2025',
        trainers: ['Martin Antiquel', 'Colin McBride'],
        focus_areas: ['3D_modeling_CAD', 'manufacturing_processes', 'digital_fabrication']
      },
      
      specializations: {
        design: {
          parametric_modeling: 'Advanced',
          generative_design: 'Intermediate', 
          product_development: 'Advanced',
          aesthetic_optimization: 'Advanced'
        },
        manufacturing: {
          cnc_machining: 'Intermediate',
          additive_manufacturing: 'Advanced',
          material_selection: 'Advanced',
          quality_control: 'Intermediate'
        },
        automation: {
          workflow_optimization: 'Advanced',
          batch_processing: 'Intermediate',
          supply_chain: 'Learning',
          cost_optimization: 'Advanced'
        }
      },
      
      performance: {
        designsToday: 0,
        prototypesCreated: 0,
        manufacturingTime: '~48hrs',
        qualityScore: '94%',
        clientSatisfaction: '98%'
      },
      
      limits: {
        maxComplexity: 'Enterprise level',
        maxBatchSize: 1000,
        materialTypes: 50,
        concurrentProjects: 25
      },

      business: {
        revenueProjection: 8500, // $8.5k/month
        pricingModel: 'Design complexity + manufacturing volume',
        targetMarket: 'Product designers, manufacturers, startups',
        competitiveAdvantage: 'AI-driven parametric design with manufacturing optimization'
      }
    };
    
    if (includeDetails) {
      response.configuration = {
        designSoftware: ['Fusion360', 'Solidworks', 'Rhino', 'Grasshopper'],
        fabricationMethods: ['CNC', '3D_printing', 'Injection_molding', 'Laser_cutting'],
        materials: ['Aluminum', 'Steel', 'Titanium', 'Carbon_fiber', 'Polymers', 'Ceramics'],
        qualityStandards: ['ISO_9001', 'AS9100', 'IATF_16949']
      };
    }
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('GEPPETTO status error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to get GEPPETTO status',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST /api/agents/geppetto - Execute design or manufacturing action
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, payload } = body;
    
    if (!action) {
      return NextResponse.json(
        { error: 'Action required' },
        { status: 400 }
      );
    }
    
    switch (action) {
      case 'quick_design':
        // Quick product concept generation
        if (!payload?.concept) {
          return NextResponse.json(
            { error: 'Design concept required' },
            { status: 400 }
          );
        }
        
        const designScore = calculateDesignViability(payload.concept);
        return NextResponse.json({
          action: 'quick_design',
          result: {
            viabilityScore: designScore,
            recommendation: designScore > 0.7 ? 'proceed_to_prototype' : 'refine_concept',
            estimatedCost: designScore * 1000 + 500,
            timeToPrototype: Math.ceil(designScore * 14) + ' days',
            note: 'Use /design endpoint for detailed development'
          },
          timestamp: new Date().toISOString()
        });
        
      case 'manufacturing_check':
        // Manufacturing feasibility check
        return NextResponse.json({
          action: 'manufacturing_check',
          result: {
            feasibility: 'high',
            recommendedMethods: ['CNC_machining', '3D_printing_SLA', 'Injection_molding'],
            estimatedUnitCost: '$45-85',
            minimumOrderQuantity: 100,
            leadTime: '4-6 weeks'
          }
        });
        
      case 'health_check':
        // Agent health check
        return NextResponse.json({
          action: 'health_check',
          result: {
            status: 'developing',
            readiness: '65%',
            trainingSessions: 24,
            designsCompleted: 0,
            nextMilestone: 'Q4 2025 launch'
          }
        });
        
      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }
    
  } catch (error) {
    console.error('GEPPETTO action error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to execute action',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

function calculateDesignViability(concept: string): number {
  let score = 0.5; // Base score
  
  // Complexity factors
  if (concept.toLowerCase().includes('simple') || concept.toLowerCase().includes('minimal')) score += 0.2;
  if (concept.toLowerCase().includes('complex') || concept.toLowerCase().includes('advanced')) score += 0.1;
  
  // Material considerations
  const materials = ['aluminum', 'steel', 'plastic', 'carbon', 'titanium'];
  if (materials.some(m => concept.toLowerCase().includes(m))) score += 0.15;
  
  // Manufacturing method hints
  const methods = ['printed', 'machined', 'molded', 'fabricated'];
  if (methods.some(m => concept.toLowerCase().includes(m))) score += 0.1;
  
  // Innovation bonus
  if (concept.toLowerCase().includes('innovative') || concept.toLowerCase().includes('novel')) score += 0.05;
  
  return Math.max(0, Math.min(1, score));
}