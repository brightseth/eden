import { NextRequest, NextResponse } from 'next/server';
import { bartGondiService } from '@/lib/agents/bart-gondi-integration';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { contractAddress, tokenId, requestedAmount } = body;

    if (!contractAddress || !tokenId) {
      return NextResponse.json(
        { error: 'Contract address and token ID are required' },
        { status: 400 }
      );
    }

    // Get real evaluation from Gondi integration
    const evaluation = await bartGondiService.evaluateNFT(contractAddress, tokenId);
    
    // Add BART's Renaissance banking wisdom to the evaluation
    const maxLoanAmount = evaluation.estimatedValue * evaluation.recommendedLTV;
    const requestedLoanAmount = requestedAmount ? parseFloat(requestedAmount) : maxLoanAmount;
    
    // BART's risk assessment
    let bartRiskAdjustment = 0;
    let bartRecommendation = 'APPROVED';
    let bartReasoning = evaluation.reasoning;

    if (!evaluation.supported) {
      bartRiskAdjustment = 50;
      bartRecommendation = 'DECLINED';
      bartReasoning = 'Collection not whitelisted on Gondi platform. BART follows Renaissance principle: only lend against proven collateral.';
    } else if (requestedLoanAmount > maxLoanAmount) {
      bartRiskAdjustment = 25;
      bartRecommendation = 'COUNTER_OFFER';
      bartReasoning = `Requested amount (${requestedLoanAmount.toFixed(2)} ETH) exceeds prudent LTV. BART recommends maximum ${maxLoanAmount.toFixed(2)} ETH based on Medici banking principles.`;
    } else if (evaluation.riskScore > 30) {
      bartRiskAdjustment = 10;
      bartRecommendation = 'APPROVED_WITH_CONDITIONS';
      bartReasoning = `${evaluation.reasoning}. Higher risk requires additional monitoring and premium rate.`;
    }

    const finalAPR = Math.max(0.15, evaluation.suggestedAPR + (bartRiskAdjustment / 100 * 0.1));

    const response = {
      nft: {
        contractAddress,
        tokenId,
        collection: evaluation.collection,
        estimatedValue: evaluation.estimatedValue,
        supported: evaluation.supported
      },
      gondiAnalysis: {
        recommendedLTV: evaluation.recommendedLTV,
        suggestedAPR: evaluation.suggestedAPR,
        riskScore: evaluation.riskScore,
        liquidityScore: evaluation.liquidityScore,
        reasoning: evaluation.reasoning
      },
      bartAssessment: {
        recommendation: bartRecommendation,
        maxLoanAmount: maxLoanAmount,
        recommendedAmount: Math.min(requestedLoanAmount, maxLoanAmount),
        adjustedAPR: finalAPR,
        riskAdjustment: bartRiskAdjustment,
        reasoning: bartReasoning,
        florentineWisdom: getBartWisdom(evaluation, bartRecommendation)
      },
      loanTerms: bartRecommendation !== 'DECLINED' ? {
        principalAmount: Math.min(requestedLoanAmount, maxLoanAmount).toFixed(4),
        interestRate: (finalAPR * 100).toFixed(1) + '%',
        recommendedDuration: getDurationRecommendation(evaluation.riskScore),
        currency: 'WETH',
        liquidationThreshold: '120%',
        conditions: getConditions(evaluation, bartRiskAdjustment)
      } : null,
      timestamp: new Date().toISOString(),
      evaluationId: `bart-eval-${Date.now()}`
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('[BART Evaluate API] Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to evaluate NFT',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const collection = searchParams.get('collection');

    if (collection) {
      // Get collection-specific data
      const collections = await bartGondiService.getCollectionData();
      const collectionData = collections.find(c => 
        c.name.toLowerCase().includes(collection.toLowerCase()) ||
        c.contractAddress.toLowerCase() === collection.toLowerCase()
      );

      if (!collectionData) {
        return NextResponse.json(
          { error: 'Collection not found or not supported' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        collection: collectionData,
        bartGuidelines: {
          maxLTV: collectionData.averageLTV,
          suggestedAPR: `${(0.15 + collectionData.defaultRate * 2).toFixed(1)}%`,
          riskLevel: collectionData.defaultRate > 0.03 ? 'high' : 
                    collectionData.defaultRate > 0.02 ? 'medium' : 'low',
          recommendation: collectionData.supported ? 
            'Approved for lending' : 'Not supported by Gondi platform'
        }
      });
    }

    // Return general evaluation guidelines
    return NextResponse.json({
      evaluationCriteria: {
        supportedCollections: 'Only Gondi-whitelisted collections accepted',
        maxLTV: '40-75% depending on collection risk profile',
        baseAPR: '15-30% based on risk assessment',
        evaluationFactors: [
          'Collection floor price stability',
          'Trading volume and liquidity',
          'Historical default rates',
          'Gondi platform support',
          'Renaissance banking risk principles'
        ]
      },
      process: {
        step1: 'Verify NFT is from supported collection',
        step2: 'Assess current market value and liquidity',
        step3: 'Apply risk-adjusted LTV ratios',
        step4: 'Calculate APR with Renaissance prudence',
        step5: 'Provide loan terms or counteroffer'
      }
    });

  } catch (error) {
    console.error('[BART Evaluate API] Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to get evaluation guidelines',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

function getBartWisdom(evaluation: any, recommendation: string): string {
  const wisdom = [
    "Come diceva Lorenzo de' Medici: 'Measure twice, lend once'",
    "Nel mondo del prestito, la prudenza è la madre della prosperità",
    "I Gondi hanno sempre creduto: better a smaller safe profit than a large risky loss",
    "La saggezza fiorentina insegna: diversify your risk, protect your capital",
    "Come banco dei Medici, we learned: reputation is worth more than any single loan"
  ];

  if (recommendation === 'DECLINED') {
    return "As the Gondi family learned: 'È meglio perdere un'opportunità che perdere il capitale' - Better to miss an opportunity than lose capital.";
  } else if (recommendation === 'COUNTER_OFFER') {
    return "Lorenzo de' Medici taught us: 'Negotiate from strength, lend with wisdom' - A prudent counteroffer protects both parties.";
  } else {
    return wisdom[Math.floor(Math.random() * wisdom.length)];
  }
}

function getDurationRecommendation(riskScore: number): string {
  if (riskScore < 20) return '30-90 days';
  if (riskScore < 40) return '14-30 days';
  return '7-14 days';
}

function getConditions(evaluation: any, riskAdjustment: number): string[] {
  const baseConditions = [
    'NFT held in Gondi escrow during loan term',
    'Full repayment required before due date',
    'No partial payments accepted'
  ];

  if (riskAdjustment > 20) {
    baseConditions.push('Enhanced monitoring due to elevated risk profile');
    baseConditions.push('Potential for rate adjustment based on collection performance');
  }

  if (evaluation.liquidityScore < 50) {
    baseConditions.push('Extended liquidation timeline due to lower liquidity');
  }

  return baseConditions;
}