import { NextRequest, NextResponse } from 'next/server';

// Simplified working BART prototype
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { contractAddress, tokenId, requestedAmount, action = 'evaluate' } = body;

    // Mock collection data (representing real Gondi data)
    const collections = {
      '0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb': {
        name: 'CryptoPunks',
        floorPrice: 45.2,
        volume24h: 234.7,
        averageLTV: 0.65,
        totalLoans: 147,
        defaultRate: 0.018,
        tier: 'blue-chip'
      },
      '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d': {
        name: 'Bored Ape Yacht Club', 
        floorPrice: 28.9,
        volume24h: 189.3,
        averageLTV: 0.70,
        totalLoans: 203,
        defaultRate: 0.022,
        tier: 'blue-chip'
      },
      '0xa7d8d9ef8d8ce8992df33d8b8cf4aebabd5bd270': {
        name: 'Art Blocks Curated',
        floorPrice: 12.1,
        volume24h: 45.2,
        averageLTV: 0.60,
        totalLoans: 89,
        defaultRate: 0.015,
        tier: 'premium'
      }
    };

    const collection = collections[contractAddress?.toLowerCase()];
    
    if (!collection) {
      return NextResponse.json({
        approved: false,
        error: 'Collection not supported',
        wisdom: "Come i Gondi: we only lend against proven collateral with established markets.",
        supportedCollections: Object.keys(collections),
        timestamp: new Date().toISOString()
      });
    }

    // BART's risk assessment logic
    const requestedAmountNum = parseFloat(requestedAmount || '0');
    const maxLoanAmount = collection.floorPrice * collection.averageLTV;
    const requestedLTV = requestedAmountNum / collection.floorPrice;
    
    // Risk scoring (0-100)
    let riskScore = collection.defaultRate * 1000; // Base risk from default rate
    if (requestedLTV > collection.averageLTV) riskScore += 30;
    if (collection.volume24h < 50) riskScore += 20;
    if (requestedAmountNum > maxLoanAmount) riskScore += 25;

    // APR calculation based on risk and tier
    const tierRiskPremium = collection.tier === 'blue-chip' ? 0.02 : 
                           collection.tier === 'premium' ? 0.05 : 0.08;
    const baseAPR = 0.15; // 15% base
    const calculatedAPR = baseAPR + tierRiskPremium + (riskScore / 100 * 0.10);

    // Decision logic
    const approved = riskScore < 75 && requestedAmountNum <= maxLoanAmount;
    const recommendation = approved ? 
      (requestedAmountNum > maxLoanAmount * 0.9 ? 'COUNTER_OFFER' : 'APPROVED') :
      'DECLINED';

    // Renaissance banking wisdom
    const wisdom = getFlorentineWisdom(recommendation, collection, riskScore);

    // Response based on action
    if (action === 'evaluate') {
      return NextResponse.json({
        // NFT Analysis
        nft: {
          collection: collection.name,
          contractAddress,
          tokenId: tokenId || 'collection-wide',
          floorPrice: collection.floorPrice + ' ETH',
          tier: collection.tier
        },

        // Market Intelligence  
        marketData: {
          volume24h: collection.volume24h + ' ETH',
          activeLoans: collection.totalLoans,
          averageLTV: (collection.averageLTV * 100).toFixed(0) + '%',
          defaultRate: (collection.defaultRate * 100).toFixed(1) + '%'
        },

        // BART's Assessment
        assessment: {
          approved,
          recommendation,
          riskScore: Math.round(riskScore),
          requestedLTV: (requestedLTV * 100).toFixed(1) + '%',
          maxRecommendedLTV: (collection.averageLTV * 100).toFixed(0) + '%',
          suggestedAPR: (calculatedAPR * 100).toFixed(1) + '%'
        },

        // Loan Terms (if approved)
        loanTerms: approved ? {
          maxAmount: maxLoanAmount.toFixed(3) + ' ETH',
          recommendedAmount: Math.min(requestedAmountNum, maxLoanAmount).toFixed(3) + ' ETH',
          interestRate: (calculatedAPR * 100).toFixed(1) + '%',
          duration: riskScore < 30 ? '30-90 days' : riskScore < 60 ? '14-30 days' : '7-14 days',
          collateralRequirement: 'NFT held in escrow',
          liquidationThreshold: '120% of loan value'
        } : null,

        // Renaissance Wisdom
        florenceWisdom: wisdom,

        // System Status
        system: {
          mode: 'DEMO',
          timestamp: new Date().toISOString(),
          evaluationId: `bart-demo-${Date.now()}`,
          version: '1.0.0-prototype'
        }
      });
    }

    // If action is 'offer', simulate making an offer
    if (action === 'offer' && approved) {
      const offerAmount = Math.min(requestedAmountNum, maxLoanAmount);
      const repaymentAmount = offerAmount * (1 + calculatedAPR * (30 / 365)); // 30-day loan

      return NextResponse.json({
        offerCreated: true,
        offer: {
          id: `bart-offer-${Date.now()}`,
          collection: collection.name,
          principalAmount: offerAmount.toFixed(4) + ' WETH',
          apr: (calculatedAPR * 100).toFixed(1) + '%',
          duration: '30 days',
          repaymentAmount: repaymentAmount.toFixed(4) + ' WETH',
          expiration: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'active'
        },
        florenceWisdom: "Il denaro è il mezzo, non il fine - Money deployed with wisdom creates lasting prosperity.",
        demoNote: "🎭 DEMO MODE: This would create a real offer on Gondi platform with proper credentials."
      });
    }

    return NextResponse.json({ error: 'Invalid action or loan declined' }, { status: 400 });

  } catch (error) {
    console.error('[BART Demo] Error:', error);
    return NextResponse.json(
      { error: 'Demo processing failed', message: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const demo = searchParams.get('demo');

  if (demo === 'market') {
    // Show market overview
    return NextResponse.json({
      marketOverview: {
        totalValueLocked: '4,567 ETH',
        activeLoans: 1247,
        averageAPR: '19.5%',
        collections: 4,
        dailyVolume: '234 ETH',
        trend: 'neutral'
      },
      supportedCollections: [
        { name: 'CryptoPunks', floor: '45.2 ETH', loans: 147, tier: 'blue-chip' },
        { name: 'Bored Ape Yacht Club', floor: '28.9 ETH', loans: 203, tier: 'blue-chip' },
        { name: 'Art Blocks Curated', floor: '12.1 ETH', loans: 89, tier: 'premium' }
      ],
      bartPhilosophy: "Renaissance banking principles: Measure risk, price accordingly, maintain reserves, diversify exposure.",
      demoInstructions: {
        evaluate: "POST /api/agents/bart/demo with { contractAddress, requestedAmount }",
        offer: "POST /api/agents/bart/demo with { contractAddress, requestedAmount, action: 'offer' }"
      }
    });
  }

  // Default demo info
  return NextResponse.json({
    demo: 'BART - Renaissance NFT Lending Agent',
    description: 'AI agent applying 15th-century Florentine banking wisdom to modern NFT lending',
    capabilities: [
      'NFT collateral evaluation',
      'Risk-adjusted loan terms',
      'Market intelligence analysis', 
      'Renaissance banking wisdom',
      'Autonomous lending decisions'
    ],
    personality: 'Sophisticated, prudent, historically-informed financial mind',
    tagline: 'Banking the Digital Renaissance',
    status: 'Operational (Demo Mode)',
    tryIt: {
      cryptoPunks: { contractAddress: '0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb', requestedAmount: '30' },
      bayc: { contractAddress: '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d', requestedAmount: '20' },
      artBlocks: { contractAddress: '0xa7d8d9ef8d8ce8992df33d8b8cf4aebabd5bd270', requestedAmount: '8' }
    }
  });
}

function getFlorentineWisdom(recommendation: string, collection: any, riskScore: number): string {
  const wisdomBank = {
    APPROVED: [
      "Come diceva Lorenzo de' Medici: 'La prudenza nel prestito è la chiave della prosperità.'",
      "I Gondi credevano: better a modest profit with security than grand promises with peril.",
      "Nel spirito fiorentino: this loan aligns with our principles of measured risk and fair return."
    ],
    COUNTER_OFFER: [
      "Lorenzo de' Medici insegnava: 'Negotiate from wisdom, lend with caution' - let us find middle ground.",
      "Come i banchieri dei Medici: we see merit but suggest prudent adjustments for mutual benefit.",
      "La saggezza fiorentina: a thoughtful counteroffer protects both lender and borrower."
    ],
    DECLINED: [
      "Come banco dei Gondi: 'È meglio perdere un'opportunità che perdere il capitale.'",
      "I Medici learned: reputation and capital preservation outweigh any single transaction.",
      "Nel rispetto di Firenze: we decline not from fear, but from centuries of banking wisdom."
    ]
  };

  const options = wisdomBank[recommendation] || wisdomBank.DECLINED;
  return options[Math.floor(Math.random() * options.length)];
}