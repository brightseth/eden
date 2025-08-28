import { NextRequest, NextResponse } from 'next/server';
import { rateLimitMiddleware } from '@/lib/security/auth-middleware';

export async function GET(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResponse = await rateLimitMiddleware(request, 'api', {
    windowMs: 60 * 1000, // 1 minute
    max: 20 // 20 requests per minute
  });

  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    // Mock lending data for BART's portfolio
    const lendingData = {
      overview: {
        totalDeployed: '156.7 ETH',
        activeLoans: 47,
        averageAPR: '21.5%',
        totalRevenue: '12.3 ETH',
        defaultRate: '1.8%',
        portfolioHealth: 'excellent'
      },
      recentLoans: [
        {
          id: 'loan-001',
          borrower: '0x742d35Cc6574C0532c3c0004EADb',
          collateralNFT: {
            collection: 'CryptoPunks',
            tokenId: '3100',
            floorPrice: '45.2 ETH'
          },
          loanAmount: '31.5 ETH',
          interestRate: '22%',
          duration: '30 days',
          status: 'active',
          originatedAt: '2025-08-20T10:30:00Z'
        },
        {
          id: 'loan-002', 
          borrower: '0x8ba1f109551bD432803012645Hac',
          collateralNFT: {
            collection: 'Bored Ape Yacht Club',
            tokenId: '1847',
            floorPrice: '28.9 ETH'
          },
          loanAmount: '20.2 ETH',
          interestRate: '21%',
          duration: '14 days',
          status: 'active',
          originatedAt: '2025-08-25T14:15:00Z'
        },
        {
          id: 'loan-003',
          borrower: '0x1f3A3F3e3F3e3F3e3F3e3F3e3F3',
          collateralNFT: {
            collection: 'Art Blocks Curated',
            tokenId: '159000456',
            floorPrice: '12.1 ETH'
          },
          loanAmount: '8.4 ETH', 
          interestRate: '19%',
          duration: '21 days',
          status: 'repaid',
          originatedAt: '2025-08-15T09:45:00Z',
          repaidAt: '2025-08-28T11:20:00Z'
        }
      ],
      riskMetrics: {
        portfolioVaR: '8.2%', // Value at Risk
        concentrationByCollection: {
          'CryptoPunks': '35%',
          'Bored Ape Yacht Club': '28%', 
          'Art Blocks Curated': '18%',
          'Azuki': '12%',
          'Others': '7%'
        },
        avgLoanToValue: '70%',
        volatilityScore: 'moderate'
      },
      marketIntelligence: {
        currentTrends: [
          'Punk floor price stabilizing at 44-46 ETH',
          'Increased demand for short-term liquidity',
          'Art Blocks showing strong collection performance'
        ],
        rateEnvironment: {
          competitorRates: '18-25%',
          bartAdvantage: '+2.5% premium for superior service',
          marketDepth: 'sufficient'
        },
        opportunityScore: 85 // Out of 100
      },
      performance: {
        monthlyROI: '2.1%',
        annualizedReturn: '25.2%',
        sharpeRatio: 1.85,
        successfulLoans: 234,
        totalOriginatedVolume: '2,847 ETH'
      },
      operationalMetrics: {
        avgAssessmentTime: '12 minutes',
        automationRate: '87%',
        customerSatisfaction: '94%',
        systemUptime: '99.8%'
      },
      lastUpdated: new Date().toISOString()
    };

    return NextResponse.json(lendingData);
  } catch (error) {
    console.error('[BART Lending API] Error fetching lending data:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch lending data',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResponse = await rateLimitMiddleware(request, 'api', {
    windowMs: 60 * 1000, // 1 minute  
    max: 5 // 5 lending decisions per minute
  });

  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    const body = await request.json();
    const { action, loanRequest } = body;

    if (action !== 'evaluate_loan') {
      return NextResponse.json(
        { error: 'Invalid action. Use "evaluate_loan"' },
        { status: 400 }
      );
    }

    // Simulate loan evaluation
    const evaluation = await evaluateLoanRequest(loanRequest);
    
    return NextResponse.json({
      action: 'evaluate_loan',
      status: 'success',
      evaluation,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('[BART Lending API] Error evaluating loan:', error);
    return NextResponse.json(
      { 
        error: 'Failed to evaluate loan request',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

async function evaluateLoanRequest(loanRequest: any) {
  // Mock sophisticated loan evaluation
  const { collateral, requestedAmount, duration, borrower } = loanRequest;
  
  // Simulate risk assessment
  const baseRisk = 0.15; // 15% base risk
  const collectionMultiplier = getCollectionRiskMultiplier(collateral?.collection);
  const durationMultiplier = getDurationRiskMultiplier(duration);
  
  const finalRisk = Math.min(baseRisk * collectionMultiplier * durationMultiplier, 0.35);
  const recommendedAPR = Math.max(0.18, finalRisk * 1.5 + 0.12); // Minimum 18% APR
  
  const floorPrice = collateral?.floorPrice || 30; // Default 30 ETH
  const maxLTV = finalRisk < 0.2 ? 0.75 : 0.65; // Higher LTV for lower risk
  const maxLoan = floorPrice * maxLTV;
  
  const approved = requestedAmount <= maxLoan && finalRisk < 0.3;
  
  return {
    approved,
    riskScore: Math.round(finalRisk * 100) / 100,
    recommendedAPR: Math.round(recommendedAPR * 1000) / 10, // Convert to percentage
    maxLoanAmount: Math.round(maxLoan * 100) / 100,
    loanToValue: Math.round((requestedAmount / floorPrice) * 1000) / 10,
    conditions: approved ? [
      'Standard NFT custody via Gondi protocol',
      'Automated liquidation at 120% of loan value',
      '24-hour grace period for repayment'
    ] : [
      'Request exceeds risk tolerance',
      'Consider lower loan amount or shorter duration'
    ],
    reasoning: `Based on ${collateral?.collection || 'NFT'} collection risk profile, requested duration of ${duration} days, and current market conditions.`
  };
}

function getCollectionRiskMultiplier(collection?: string): number {
  const riskMultipliers: Record<string, number> = {
    'CryptoPunks': 0.8, // Lower risk
    'Bored Ape Yacht Club': 0.9,
    'Art Blocks Curated': 1.0,
    'Azuki': 1.1,
    'Doodles': 1.2,
    'Default': 1.3 // Higher risk for unknown collections
  };
  
  return riskMultipliers[collection || 'Default'] || riskMultipliers.Default;
}

function getDurationRiskMultiplier(duration?: number): number {
  if (!duration) return 1.2;
  if (duration <= 7) return 0.9;    // Short term = lower risk
  if (duration <= 30) return 1.0;   // Medium term = baseline
  if (duration <= 90) return 1.1;   // Longer term = higher risk
  return 1.3; // Very long term = much higher risk
}