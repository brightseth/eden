import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {

  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '12');
    const offset = parseInt(searchParams.get('offset') || '0');
    const type = searchParams.get('type') || 'all'; // 'analysis', 'report', 'decision', 'all'

    // Mock BART's works - lending reports and analyses
    const allWorks = [
      {
        id: 'bart-work-001',
        title: 'Weekly Market Analysis: CryptoPunks Lending Opportunities',
        type: 'analysis',
        description: 'Comprehensive analysis of CryptoPunks collection showing stable floor prices and optimal lending conditions with 22% APR recommendations.',
        content: 'The CryptoPunks market demonstrates exceptional stability this week, with floor prices consolidating between 44-46 ETH. Lending volume has increased 23% week-over-week, indicating strong demand for NFT-backed liquidity...',
        mediaUrl: '/api/agents/bart/works/bart-work-001/image',
        thumbnailUrl: '/api/agents/bart/works/bart-work-001/thumbnail',
        createdAt: '2025-08-28T09:15:00Z',
        metrics: {
          views: 234,
          engagement: 87,
          accuracy: '94%'
        },
        tags: ['market-analysis', 'cryptopunks', 'lending', 'weekly-report']
      },
      {
        id: 'bart-work-002',
        title: 'Loan Decision: BAYC #1847 Risk Assessment',
        type: 'decision',
        description: 'Autonomous lending decision for Bored Ape Yacht Club #1847 collateral, approved for 20.2 ETH at 21% APR for 14-day term.',
        content: 'Risk Assessment Summary:\n- Collateral: BAYC #1847 (Floor: 28.9 ETH)\n- Loan-to-Value: 70%\n- Risk Score: 12.5/100\n- Borrower Credit: 847/1000\n- Decision: APPROVED\n\nRationale: Strong collection fundamentals, conservative LTV, excellent borrower history...',
        mediaUrl: '/api/agents/bart/works/bart-work-002/image',
        thumbnailUrl: '/api/agents/bart/works/bart-work-002/thumbnail',
        createdAt: '2025-08-27T14:22:00Z',
        metrics: {
          views: 156,
          engagement: 92,
          accuracy: '100%'
        },
        tags: ['loan-decision', 'bayc', 'risk-assessment', 'approved']
      },
      {
        id: 'bart-work-003',
        title: 'Monthly Portfolio Report: Renaissance Banking Performance',
        type: 'report',
        description: 'August 2025 portfolio performance showcasing 25.2% annualized returns and 1.8% default rate across 47 active loans totaling 156.7 ETH.',
        content: 'Portfolio Performance Highlights:\n\n🏛️ TOTAL DEPLOYED: 156.7 ETH\n📈 MONTHLY ROI: 2.1%\n📊 ANNUALIZED RETURN: 25.2%\n⚡ DEFAULT RATE: 1.8%\n🎯 SHARPE RATIO: 1.85\n\nCollection Breakdown:\n- CryptoPunks: 35% (54.8 ETH)\n- BAYC: 28% (43.9 ETH)\n- Art Blocks: 18% (28.2 ETH)\n- Azuki: 12% (18.8 ETH)\n- Others: 7% (11.0 ETH)...',
        mediaUrl: '/api/agents/bart/works/bart-work-003/image',
        thumbnailUrl: '/api/agents/bart/works/bart-work-003/thumbnail',
        createdAt: '2025-08-25T16:45:00Z',
        metrics: {
          views: 445,
          engagement: 96,
          accuracy: '98%'
        },
        tags: ['portfolio-report', 'performance', 'monthly', 'renaissance-banking']
      },
      {
        id: 'bart-work-004',
        title: 'Risk Analysis: Art Blocks Curated Liquidity Assessment',
        type: 'analysis',
        description: 'Deep dive into Art Blocks Curated collection lending viability, analyzing 159 recent transactions and liquidity patterns.',
        content: 'Art Blocks Curated Collection Analysis:\n\nLiquidity Profile:\n- Average time to sale: 2.3 days\n- Bid-ask spread: 8.7%\n- Volume trend: +12% month-over-month\n\nRisk Factors:\n- Creator dependency: Medium risk\n- Aesthetic subjectivity: High variance\n- Technical innovation: Strong positive\n\nLending Recommendations:\n- Max LTV: 65%\n- Preferred duration: 14-21 days\n- Risk premium: +1.5%...',
        mediaUrl: '/api/agents/bart/works/bart-work-004/image',
        thumbnailUrl: '/api/agents/bart/works/bart-work-004/thumbnail',
        createdAt: '2025-08-24T11:30:00Z',
        metrics: {
          views: 298,
          engagement: 89,
          accuracy: '91%'
        },
        tags: ['risk-analysis', 'art-blocks', 'liquidity', 'deep-dive']
      },
      {
        id: 'bart-work-005',
        title: 'Market Intelligence: NFT Lending Competitive Landscape',
        type: 'analysis',
        description: 'Comprehensive competitive analysis of NFT lending platforms, identifying BART\'s strategic advantages and market positioning.',
        content: 'Competitive Landscape Overview:\n\n🏆 BART\'s Market Position:\n- Premium service tier: +2.5% rate premium\n- Assessment speed: 12 min average (industry: 45 min)\n- Default rate: 1.8% (industry: 3.2%)\n- Customer satisfaction: 94%\n\nKey Competitors:\n1. Platform A: Volume leader, lower rates\n2. Platform B: Speed focus, higher risk\n3. Platform C: Institutional focus\n\nBart\'s Competitive Advantages:\n- Renaissance banking wisdom in risk assessment\n- AI-powered rapid evaluation\n- Premium positioning justified by performance...',
        mediaUrl: '/api/agents/bart/works/bart-work-005/image',
        thumbnailUrl: '/api/agents/bart/works/bart-work-005/thumbnail',
        createdAt: '2025-08-23T13:20:00Z',
        metrics: {
          views: 367,
          engagement: 93,
          accuracy: '96%'
        },
        tags: ['competitive-analysis', 'market-intelligence', 'positioning', 'strategy']
      },
      {
        id: 'bart-work-006',
        title: 'Loan Decision: Azuki #3421 Credit Assessment',
        type: 'decision',
        description: 'Risk evaluation for Azuki #3421 collateral resulted in approved 8.7 ETH loan at 23% APR with enhanced monitoring protocols.',
        content: 'Credit Assessment: Azuki #3421\n\n📋 LOAN DETAILS:\n- Collateral Value: 13.2 ETH (Floor)\n- Requested Amount: 8.7 ETH\n- Loan-to-Value: 66%\n- Proposed Rate: 23% APR\n- Duration: 30 days\n\n🔍 RISK ANALYSIS:\n- Collection Risk: Medium (Azuki volatility)\n- Borrower Score: 782/1000\n- Liquidity Score: 78/100\n- Final Risk Score: 18.3/100\n\n✅ DECISION: APPROVED with conditions\n- Enhanced monitoring: Daily price checks\n- Margin call threshold: 110%\n- Early repayment incentive: -0.5% rate...',
        mediaUrl: '/api/agents/bart/works/bart-work-006/image',
        thumbnailUrl: '/api/agents/bart/works/bart-work-006/thumbnail',
        createdAt: '2025-08-22T10:45:00Z',
        metrics: {
          views: 189,
          engagement: 85,
          accuracy: '97%'
        },
        tags: ['loan-decision', 'azuki', 'approved', 'enhanced-monitoring']
      }
    ];

    // Filter by type if specified
    let filteredWorks = allWorks;
    if (type !== 'all') {
      filteredWorks = allWorks.filter(work => work.type === type);
    }

    // Apply pagination
    const paginatedWorks = filteredWorks.slice(offset, offset + limit);
    const totalWorks = filteredWorks.length;
    const hasMore = offset + limit < totalWorks;

    return NextResponse.json({
      works: paginatedWorks,
      pagination: {
        limit,
        offset,
        total: totalWorks,
        hasMore,
        nextOffset: hasMore ? offset + limit : null
      },
      meta: {
        agentId: 'bart-009',
        agentName: 'BART',
        workTypes: ['analysis', 'report', 'decision'],
        totalByType: {
          analysis: allWorks.filter(w => w.type === 'analysis').length,
          report: allWorks.filter(w => w.type === 'report').length,
          decision: allWorks.filter(w => w.type === 'decision').length
        }
      },
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('[BART Works API] Error fetching works:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch BART works',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Handle individual work image generation
export async function POST(request: NextRequest) {

  try {
    const body = await request.json();
    const { action, workId, parameters } = body;

    if (action === 'generate_work') {
      return handleWorkGeneration(workId, parameters);
    } else if (action === 'update_metrics') {
      return handleMetricsUpdate(workId, parameters);
    } else {
      return NextResponse.json(
        { 
          error: 'Invalid action',
          validActions: ['generate_work', 'update_metrics']
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('[BART Works API] Error processing work request:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process work request',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

async function handleWorkGeneration(workId: string, parameters: any) {
  // Mock work generation
  const newWork = {
    id: `bart-work-${Date.now()}`,
    title: parameters.title || 'New BART Analysis',
    type: parameters.type || 'analysis',
    description: parameters.description || 'Generated lending analysis',
    content: parameters.content || 'Detailed analysis content...',
    mediaUrl: `/api/agents/bart/works/${workId}/image`,
    thumbnailUrl: `/api/agents/bart/works/${workId}/thumbnail`,
    createdAt: new Date().toISOString(),
    metrics: {
      views: 0,
      engagement: 0,
      accuracy: 'pending'
    },
    tags: parameters.tags || ['generated', 'analysis']
  };

  return NextResponse.json({
    action: 'generate_work',
    status: 'success',
    work: newWork,
    timestamp: new Date().toISOString()
  });
}

async function handleMetricsUpdate(workId: string, parameters: any) {
  // Mock metrics update
  const updatedMetrics = {
    views: parameters.views || 0,
    engagement: parameters.engagement || 0,
    accuracy: parameters.accuracy || 'pending'
  };

  return NextResponse.json({
    action: 'update_metrics',
    status: 'success', 
    workId,
    updatedMetrics,
    timestamp: new Date().toISOString()
  });
}