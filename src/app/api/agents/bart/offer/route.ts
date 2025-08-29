import { NextRequest, NextResponse } from 'next/server';
import { bartGondiService } from '@/lib/agents/bart-gondi-integration';
import { bartRiskManager } from '@/lib/agents/bart-risk-manager';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      contractAddress, 
      tokenId, 
      requestedAmount, 
      duration = 30,
      offerType = 'collection' // 'collection' | 'single'
    } = body;

    if (!contractAddress || !requestedAmount) {
      return NextResponse.json(
        { error: 'Contract address and requested amount are required' },
        { status: 400 }
      );
    }

    // Get system status
    const gondiStatus = bartGondiService.getStatus();
    const riskStatus = bartRiskManager.getStatus();

    // Risk assessment using the new risk manager
    const loanRequest = {
      contractAddress,
      tokenId: tokenId || '0',
      requestedAmount: parseFloat(requestedAmount),
      duration: parseInt(duration)
    };

    const riskAssessment = await bartRiskManager.assessLoan(loanRequest);

    let offerResult = null;
    
    // If approved and not in dry-run mode, make the actual offer
    if (riskAssessment.approved && !riskAssessment.dryRun && gondiStatus.initialized) {
      const offerParams = {
        contractAddress,
        tokenId: tokenId || '0',
        principalAmount: Math.min(requestedAmount, riskAssessment.maxLoanAmount).toString(),
        apr: Math.floor(riskAssessment.adjustedAPR * 10000), // Convert to basis points
        duration: duration * 24 * 60 * 60, // Convert days to seconds
        currency: 'WETH' as const,
        repayment: (Math.min(requestedAmount, riskAssessment.maxLoanAmount) * (1 + riskAssessment.adjustedAPR * (duration / 365))).toString(),
        expiration: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 days from now
      };

      if (offerType === 'single' && tokenId) {
        offerResult = await bartGondiService.makeSingleNftOffer(offerParams);
      } else {
        // Collection offer
        const collectionOfferParams = {
          collectionId: contractAddress,
          ...offerParams
        };
        offerResult = await bartGondiService.makeOffer(collectionOfferParams);
      }
    }

    // Renaissance banking wisdom based on the outcome
    let florenceWisdom = "";
    if (riskAssessment.dryRun) {
      florenceWisdom = "In pratica, non in teoria - BART learns through simulation before risking real capital.";
    } else if (riskAssessment.approved) {
      florenceWisdom = "Come i Medici: prudent capital deployment with measured risk yields lasting prosperity.";
    } else {
      florenceWisdom = "La prudenza è la madre della prosperità - Better to decline than risk the house of Gondi.";
    }

    const response = {
      // Risk Assessment
      riskAssessment: {
        approved: riskAssessment.approved,
        riskScore: riskAssessment.riskScore,
        tier: riskAssessment.tier,
        reasoning: riskAssessment.reasoning,
        recommendedLTV: (riskAssessment.recommendedLTV * 100).toFixed(1) + '%',
        adjustedAPR: (riskAssessment.adjustedAPR * 100).toFixed(1) + '%',
        maxLoanAmount: riskAssessment.maxLoanAmount.toFixed(4) + ' ETH'
      },

      // System Status
      systemStatus: {
        gondiConnection: gondiStatus.mockMode ? 'mock' : 'live',
        dryRunMode: riskAssessment.dryRun,
        riskPolicyVersion: riskStatus.policyVersion,
        environment: gondiStatus.environment
      },

      // Offer Result (if any)
      offerResult: offerResult ? {
        success: offerResult.success,
        transactionHash: offerResult.transactionHash,
        offerId: offerResult.offerId,
        nftId: offerResult.nftId,
        error: offerResult.error
      } : null,

      // Simulation (if dry run)
      simulation: riskAssessment.simulatedOutcome,

      // BART's Renaissance Wisdom
      florenceWisdom,
      
      timestamp: new Date().toISOString(),
      evaluationId: `bart-offer-${Date.now()}`
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('[BART Offer API] Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process lending offer',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const gondiStatus = bartGondiService.getStatus();
    const riskStatus = bartRiskManager.getStatus();

    return NextResponse.json({
      bartLendingSystem: {
        status: 'operational',
        capabilities: [
          'NFT collateral evaluation',
          'Risk-adjusted lending terms', 
          'Renaissance banking principles',
          'Single NFT and collection offers',
          'Dry-run simulation mode'
        ],
        connectionStatus: {
          gondi: gondiStatus.mockMode ? 'mock mode' : 'live connection',
          riskEngine: 'active',
          environment: gondiStatus.environment
        },
        riskPolicy: {
          version: riskStatus.policyVersion,
          dryRunEnabled: riskStatus.dryRunEnabled,
          supportedCollections: riskStatus.supportedCollections,
          reserveRatio: riskStatus.reserveRatio,
          maxDailyVolume: riskStatus.maxDailyVolume
        }
      }
    });
  } catch (error) {
    console.error('[BART Offer API] Status error:', error);
    return NextResponse.json(
      { error: 'Failed to get system status' },
      { status: 500 }
    );
  }
}