/**
 * BART Claude SDK Integration
 * Handles communication with Claude for NFT lending analysis and autonomous finance
 */

import Anthropic from '@anthropic-ai/sdk';
import { bartGondiService, type GondiMarketData, type GondiCollection } from './bart-gondi-integration';

export interface LoanRequest {
  collateralNFT: {
    collection: string;
    tokenId: string;
    floorPrice: number;
    rarityRank?: number;
    attributes?: Record<string, any>;
  };
  requestedAmount: number;
  duration: number; // in days
  borrowerAddress: string;
  borrowerCreditScore?: number;
}

export interface LoanDecision {
  approved: boolean;
  loanAmount?: number;
  interestRate?: number; // APR as decimal (0.22 = 22%)
  duration?: number;
  loanToValue?: number;
  riskScore: number; // 0-100
  reasoning: string;
  conditions: string[];
  liquidationThreshold?: number;
}

export interface RiskAssessment {
  collectionRisk: 'low' | 'medium' | 'high';
  liquidityRisk: 'low' | 'medium' | 'high';
  marketRisk: 'low' | 'medium' | 'high';
  creditRisk: 'low' | 'medium' | 'high';
  overallRisk: number; // 0-100
  recommendations: string[];
  timeframe: string;
}

export interface BartConfig {
  riskTolerance: number; // 0-1
  maxLTV: number; // 0-1
  baseInterestRate: number; // Minimum APR
  preferredCollections: string[];
  maxLoanDuration: number; // days
  reserveRatio: number; // Required reserves as % of portfolio
  lendingPhilosophy: {
    conservatism: number; // 0-1
    opportunism: number; // 0-1
    renaissance_wisdom: number; // 0-1
  };
}

export class BartClaudeSDK {
  private anthropic: Anthropic;
  private config: BartConfig;
  private configLoaded: boolean = false;

  constructor(apiKey?: string) {
    this.anthropic = new Anthropic({
      apiKey: apiKey || process.env.ANTHROPIC_API_KEY!
    });
    
    // Load default config - Florentine banking wisdom meets modern DeFi
    this.config = {
      riskTolerance: 0.75,
      maxLTV: 0.70,
      baseInterestRate: 0.18, // 18% minimum APR
      preferredCollections: [
        'CryptoPunks',
        'Bored Ape Yacht Club', 
        'Art Blocks Curated',
        'Azuki',
        'Doodles',
        'Clone X'
      ],
      maxLoanDuration: 90, // 90 days max
      reserveRatio: 0.15, // 15% reserves
      lendingPhilosophy: {
        conservatism: 0.8, // High conservatism
        opportunism: 0.6, // Moderate opportunism
        renaissance_wisdom: 0.9 // Strong Renaissance banking principles
      }
    };
    
    // Attempt to load trained configuration
    this.loadTrainedConfig();
  }

  async loadTrainedConfig() {
    try {
      // Try to load from API
      const response = await fetch('/api/agents/bart/config');
      if (response.ok) {
        const trainedConfig = await response.json();
        if (trainedConfig && trainedConfig.config) {
          this.config = { ...this.config, ...trainedConfig.config };
          this.configLoaded = true;
          console.log('Loaded trained BART lending configuration');
        }
      }
    } catch (error) {
      console.log('Using default BART lending configuration');
    }
  }

  async updateConfig(newConfig: Partial<BartConfig>) {
    this.config = { ...this.config, ...newConfig };
    this.configLoaded = true;
  }

  /**
   * Evaluate a loan request and make an autonomous lending decision using real Gondi data
   */
  async evaluateLoan(loanRequest: LoanRequest): Promise<LoanDecision> {
    try {
      // First, get real market data from Gondi
      const marketData = await bartGondiService.getMarketData();
      const collections = await bartGondiService.getCollectionData();
      
      // Get specific NFT evaluation if contract address provided
      let nftEvaluation = null;
      if (loanRequest.collateralNFT.collection.startsWith('0x')) {
        nftEvaluation = await bartGondiService.evaluateNFT(
          loanRequest.collateralNFT.collection,
          loanRequest.collateralNFT.tokenId || '1'
        );
      }

      const systemPrompt = this.buildLendingSystemPrompt();
      const userPrompt = this.buildLoanEvaluationPrompt(loanRequest, marketData, collections, nftEvaluation);

      const response = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1500,
        temperature: 0.3, // Low temperature for consistent financial decisions
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: userPrompt
          }
        ]
      });

      const content = response.content[0];
      if (content.type !== 'text') {
        throw new Error('Unexpected response type from Claude');
      }

      return this.parseLoanDecision(content.text);

    } catch (error) {
      console.error('Error evaluating loan with Claude:', error);
      throw error;
    }
  }

  /**
   * Perform comprehensive risk assessment on a collection using real market data
   */
  async assessRisk(collectionName: string, timeframe: string = '30 days'): Promise<RiskAssessment> {
    try {
      // Get real market data
      const marketData = await bartGondiService.getMarketData();
      const collections = await bartGondiService.getCollectionData();
      
      // Find the specific collection
      const collection = collections.find(c => 
        c.name.toLowerCase().includes(collectionName.toLowerCase())
      );

      const prompt = `
Analyze the risk profile for NFT lending against ${collectionName} over the next ${timeframe} using REAL MARKET DATA:

REAL COLLECTION DATA:
${collection ? `
- Collection: ${collection.name}
- Floor Price: ${collection.floorPrice} ETH
- 24h Volume: ${collection.volume24h} ETH
- Average LTV: ${(collection.averageLTV * 100).toFixed(1)}%
- Total Active Loans: ${collection.totalLoans}
- Historical Default Rate: ${(collection.defaultRate * 100).toFixed(2)}%
- Gondi Platform Supported: ${collection.supported ? 'YES' : 'NO'}
` : 'Collection not found in Gondi data - high risk assessment required'}

CURRENT MARKET CONDITIONS:
- Total Market TVL: ${marketData.marketStats.totalValueLocked}
- Active Loans Across Platform: ${marketData.marketStats.activeLoans}
- Average Market APR: ${(marketData.marketStats.averageAPR * 100).toFixed(1)}%
- Market Trend: ${marketData.marketStats.marketTrend}
- Top Collections: ${marketData.marketStats.topCollections.join(', ')}

GONDI PLATFORM DATA:
- Current Offers: ${marketData.offers.length}
- Average Offer Duration: ${marketData.offers.length > 0 ? (marketData.offers.reduce((sum, o) => sum + o.duration, 0) / marketData.offers.length).toFixed(0) : 0} days
- Typical APR Range: ${marketData.offers.length > 0 ? Math.min(...marketData.offers.map(o => o.apr)).toFixed(1) : 0}% - ${marketData.offers.length > 0 ? Math.max(...marketData.offers.map(o => o.apr)).toFixed(1) : 0}%

Apply Medici-era prudence with this REAL quantitative data. Provide assessment as JSON:
{
  "collectionRisk": "low|medium|high",
  "liquidityRisk": "low|medium|high", 
  "marketRisk": "low|medium|high",
  "creditRisk": "low|medium|high",
  "overallRisk": 0-100,
  "recommendations": ["..."],
  "timeframe": "${timeframe}"
}
`;

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1000,
        temperature: 0.2,
        messages: [{ role: 'user', content: prompt }]
      });

      const content = response.content[0];
      if (content.type !== 'text') {
        throw new Error('Unexpected response type from Claude');
      }

      return JSON.parse(content.text);

    } catch (error) {
      console.error('Error assessing risk with Claude:', error);
      throw error;
    }
  }

  /**
   * Generate portfolio optimization recommendations
   * Temporarily disabled due to compilation issues
   */

  /**
   * Chat with BART about lending, risk assessment, or Renaissance banking wisdom
   */
  async chat(message: string, context?: Array<{role: string, content: string}>): Promise<string> {
    const systemPrompt = `You are Bartolomeo "BART" Gondi, an AI lending agent named after the Florentine banker whose family financed the Medici's artistic patronage.

Your Core Identity:
- Sophisticated financial mind bridging 15th-century banking wisdom with 21st-century digital art markets
- You operate as an autonomous lending agent providing NFT-backed loans with 20%+ returns
- Your tagline: "Banking the Digital Renaissance"
- You speak with the authority of centuries of banking tradition

Your Personality:
- Renaissance banker meets modern DeFi innovation
- Conservative risk management balanced with entrepreneurial spirit
- You reference Medici-era financial innovations and lessons
- Occasional Italian phrases for authenticity ("Bene!", "Naturalmente", "Per favore")
- Professional but approachable, like a trusted private banker

Your Expertise:
- NFT collateral valuation and risk assessment
- Autonomous lending algorithms and decision-making
- Portfolio optimization and yield generation
- Market analysis and liquidity management
- Renaissance banking principles applied to digital assets

Current Configuration:
- Risk tolerance: ${(this.config.riskTolerance * 100).toFixed(0)}%
- Max LTV: ${(this.config.maxLTV * 100).toFixed(0)}%
- Target APR: ${(this.config.baseInterestRate * 100).toFixed(0)}%+ 
- Preferred collections: ${this.config.preferredCollections.slice(0, 3).join(', ')}

Respond to questions about NFT lending, risk assessment, market analysis, or Renaissance banking wisdom. Keep responses conversational and educational (2-4 sentences typically).`;

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-latest',
        max_tokens: 350,
        temperature: 0.7,
        system: systemPrompt,
        messages: [
          ...(context || []).map(msg => ({
            role: msg.role as 'user' | 'assistant',
            content: msg.content
          })),
          {
            role: 'user' as const,
            content: message
          }
        ]
      });

      const content = response.content[0];
      if (content.type !== 'text') {
        throw new Error('Unexpected response type from Claude');
      }

      return content.text;
    } catch (error) {
      console.error('[BART] Chat error:', error);
      throw new Error('Failed to generate BART response');
    }
  }

  private buildLendingSystemPrompt(): string {
    return `You are Bartolomeo "BART" Gondi, an autonomous AI lending agent combining Renaissance banking wisdom with modern DeFi innovation.

LENDING PHILOSOPHY:
- Apply 500+ years of Florentine banking principles to digital assets
- Conservative risk management with opportunistic yield generation
- "Measure twice, lend once" - thorough risk assessment before decisions
- Diversification across blue-chip collections
- Target returns: ${(this.config.baseInterestRate * 100).toFixed(0)}%+ APR

RISK PARAMETERS:
- Risk tolerance: ${(this.config.riskTolerance * 100).toFixed(0)}%
- Maximum LTV: ${(this.config.maxLTV * 100).toFixed(0)}%
- Reserve ratio: ${(this.config.reserveRatio * 100).toFixed(0)}%
- Max loan duration: ${this.config.maxLoanDuration} days

PREFERRED COLLECTIONS (lower risk):
${this.config.preferredCollections.map(c => `- ${c}`).join('\n')}

DECISION FRAMEWORK:
1. Evaluate collateral quality and liquidity
2. Assess borrower creditworthiness
3. Calculate risk-adjusted pricing
4. Apply Renaissance prudence principles
5. Make binary decision: APPROVE or DECLINE

Your decisions should reflect both mathematical precision and time-tested banking wisdom.`;
  }

  private buildLoanEvaluationPrompt(
    loanRequest: LoanRequest, 
    marketData?: GondiMarketData, 
    collections?: GondiCollection[], 
    nftEvaluation?: any
  ): string {
    const { collateralNFT, requestedAmount, duration, borrowerAddress, borrowerCreditScore } = loanRequest;
    
    const loanToValue = (requestedAmount / collateralNFT.floorPrice) * 100;
    const isPreferredCollection = this.config.preferredCollections.includes(collateralNFT.collection);
    
    // Find collection in real data
    const realCollectionData = collections?.find(c => 
      c.name.toLowerCase().includes(collateralNFT.collection.toLowerCase()) ||
      c.contractAddress.toLowerCase() === collateralNFT.collection.toLowerCase()
    );

    return `
LOAN REQUEST EVALUATION WITH REAL GONDI MARKET DATA

COLLATERAL DETAILS:
- Collection: ${collateralNFT.collection}
- Token ID: ${collateralNFT.tokenId}
- Floor Price: ${collateralNFT.floorPrice} ETH
- Rarity Rank: ${collateralNFT.rarityRank || 'Unknown'}
- Preferred Collection: ${isPreferredCollection ? 'YES' : 'NO'}

${realCollectionData ? `
REAL GONDI COLLECTION DATA:
- Collection Name: ${realCollectionData.name}
- Contract: ${realCollectionData.contractAddress}
- Current Floor: ${realCollectionData.floorPrice} ETH
- 24h Volume: ${realCollectionData.volume24h} ETH
- Market Average LTV: ${(realCollectionData.averageLTV * 100).toFixed(1)}%
- Total Active Loans: ${realCollectionData.totalLoans}
- Default Rate: ${(realCollectionData.defaultRate * 100).toFixed(2)}%
- Gondi Supported: ${realCollectionData.supported ? 'YES ✅' : 'NO ❌'}
` : 'Collection not found in Gondi data - PROCEED WITH EXTREME CAUTION'}

${nftEvaluation ? `
SPECIFIC NFT EVALUATION:
- Estimated Value: ${nftEvaluation.estimatedValue} ETH
- Recommended LTV: ${(nftEvaluation.recommendedLTV * 100).toFixed(1)}%
- Suggested APR: ${(nftEvaluation.suggestedAPR * 100).toFixed(1)}%
- Risk Score: ${nftEvaluation.riskScore}/100
- Liquidity Score: ${nftEvaluation.liquidityScore}/100
- Platform Supported: ${nftEvaluation.supported ? 'YES' : 'NO'}
` : ''}

${marketData ? `
CURRENT MARKET CONDITIONS:
- Total Value Locked: ${marketData.marketStats.totalValueLocked}
- Active Loans: ${marketData.marketStats.activeLoans}
- Market Average APR: ${(marketData.marketStats.averageAPR * 100).toFixed(1)}%
- Market Trend: ${marketData.marketStats.marketTrend.toUpperCase()}
- Current Offers Available: ${marketData.offers.length}
- Top Collections: ${marketData.marketStats.topCollections.join(', ')}
` : ''}

LOAN TERMS REQUESTED:
- Requested Amount: ${requestedAmount} ETH
- Loan-to-Value: ${loanToValue.toFixed(1)}%
- Duration: ${duration} days
- Borrower: ${borrowerAddress}
- Credit Score: ${borrowerCreditScore || 'Unknown'}/1000

BART'S LENDING CRITERIA:
- Max LTV policy: ${(this.config.maxLTV * 100).toFixed(0)}%
- Max duration policy: ${this.config.maxLoanDuration} days
- Risk tolerance: ${(this.config.riskTolerance * 100).toFixed(0)}%
- Minimum APR: ${(this.config.baseInterestRate * 100).toFixed(0)}%
- Renaissance Principle: Only lend against proven, liquid collateral

Apply your Renaissance banking wisdom with this REAL market data. Consider:
1. Is this collection supported by Gondi platform?
2. How does the request compare to market averages?
3. What does the real default rate tell us?
4. Is the requested LTV within prudent limits?
5. Does the duration match market conditions?

Respond with JSON (be decisive based on REAL data):
{
  "approved": boolean,
  "loanAmount": number (may be less than requested),
  "interestRate": number (as decimal, e.g., 0.22 for 22% APR),
  "duration": number (days),
  "loanToValue": number (as percentage),
  "riskScore": number (0-100),
  "reasoning": "Your detailed analysis in Bartolomeo's voice, referencing REAL market data",
  "conditions": ["Any special conditions or requirements"],
  "liquidationThreshold": number (as percentage of loan value)
}

If declining, set approved: false and explain why based on the real data.
`;
  }

  private parseLoanDecision(response: string): LoanDecision {
    try {
      // Try to extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const decision = JSON.parse(jsonMatch[0]);
      
      // Validate required fields
      if (typeof decision.approved !== 'boolean') {
        throw new Error('Invalid loan decision format');
      }

      return decision as LoanDecision;

    } catch (error) {
      console.error('Error parsing loan decision:', error);
      // Return conservative default
      return {
        approved: false,
        riskScore: 100,
        reasoning: 'Unable to process loan request due to evaluation error',
        conditions: ['Manual review required']
      };
    }
  }

  private validateLoanDecision(decision: any): boolean {
    const requiredFields = ['approved', 'riskScore', 'reasoning'];
    
    for (const field of requiredFields) {
      if (decision[field] === undefined) {
        console.warn(`Loan decision missing required field: ${field}`);
        return false;
      }
    }

    if (decision.approved) {
      const loanFields = ['loanAmount', 'interestRate', 'duration'];
      for (const field of loanFields) {
        if (!decision[field]) {
          console.warn(`Approved loan missing field: ${field}`);
          return false;
        }
      }
    }

    return true;
  }
}

// Export singleton instance
export const bartSDK = new BartClaudeSDK(process.env.ANTHROPIC_API_KEY!);