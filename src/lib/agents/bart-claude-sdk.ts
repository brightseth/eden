/**
 * BART Claude SDK Integration
 * Handles communication with Claude for NFT lending analysis and autonomous finance
 */

import Anthropic from '@anthropic-ai/sdk';

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
   * Evaluate a loan request and make an autonomous lending decision
   */
  async evaluateLoan(loanRequest: LoanRequest): Promise<LoanDecision> {
    const systemPrompt = this.buildLendingSystemPrompt();
    const userPrompt = this.buildLoanEvaluationPrompt(loanRequest);

    try {
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
   * Perform comprehensive risk assessment on a collection or market segment
   */
  async assessRisk(collectionName: string, timeframe: string = '30 days'): Promise<RiskAssessment> {
    const prompt = `
Analyze the risk profile for NFT lending against ${collectionName} over the next ${timeframe}.

Consider these factors with your Renaissance banking wisdom:

COLLECTION ANALYSIS:
- Historical price stability and volatility
- Trading volume and liquidity depth
- Creator reputation and collection fundamentals
- Market positioning (blue-chip, emerging, speculative)

MARKET CONDITIONS:
- Current NFT market sentiment
- ETH price volatility impact
- Competitor lending rates and activity
- Liquidity crunch risks

LENDING SPECIFIC RISKS:
- Forced liquidation scenarios
- Time to liquidate assets
- Collection floor price reliability
- Concentration risk in portfolio

Apply Medici-era prudence with modern quantitative analysis. Provide assessment as JSON:
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
   */
  async optimizePortfolio(currentPortfolio: any): Promise<{
    recommendations: string[];
    targetAllocations: Record<string, number>;
    riskMitigation: string[];
    expectedYield: number;
    reasoning: string;
  }> {
    const prompt = `
Analyze this NFT lending portfolio and provide optimization recommendations:

Current Portfolio:
${JSON.stringify(currentPortfolio, null, 2)}

Apply Renaissance banking principles:
1. Diversification across collections
2. Risk-adjusted returns
3. Liquidity management
4. Capital preservation

Your configuration:
- Risk tolerance: ${(this.config.riskTolerance * 100).toFixed(0)}%
- Max LTV: ${(this.config.maxLTV * 100).toFixed(0)}%
- Target yield: ${(this.config.baseInterestRate * 100).toFixed(0)}%+ APR
- Reserve ratio: ${(this.config.reserveRatio * 100).toFixed(0)}%

Provide analysis as JSON:
{
  "recommendations": ["Specific actions to take"],
  "targetAllocations": {"Collection": 0.XX},
  "riskMitigation": ["Risk management strategies"],
  "expectedYield": 0.XX,
  "reasoning": "Your Renaissance banking wisdom"
}
`;

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1200,
        temperature: 0.4,
        messages: [{ role: 'user', content: prompt }]
      });

      const content = response.content[0];
      if (content.type !== 'text') {
        throw new Error('Unexpected response type from Claude');
      }

      return JSON.parse(content.text);

    } catch (error) {
      console.error('Error optimizing portfolio with Claude:', error);
      throw error;
    }
  }

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

  private buildLoanEvaluationPrompt(loanRequest: LoanRequest): string {
    const { collateralNFT, requestedAmount, duration, borrowerAddress, borrowerCreditScore } = loanRequest;
    
    const loanToValue = (requestedAmount / collateralNFT.floorPrice) * 100;
    const isPreferredCollection = this.config.preferredCollections.includes(collateralNFT.collection);
    
    return `
LOAN REQUEST EVALUATION

COLLATERAL DETAILS:
- Collection: ${collateralNFT.collection}
- Token ID: ${collateralNFT.tokenId}
- Floor Price: ${collateralNFT.floorPrice} ETH
- Rarity Rank: ${collateralNFT.rarityRank || 'Unknown'}
- Preferred Collection: ${isPreferredCollection ? 'YES' : 'NO'}

LOAN TERMS:
- Requested Amount: ${requestedAmount} ETH
- Loan-to-Value: ${loanToValue.toFixed(1)}%
- Duration: ${duration} days
- Borrower: ${borrowerAddress}
- Credit Score: ${borrowerCreditScore || 'Unknown'}/1000

EVALUATION CRITERIA:
- Your max LTV policy: ${(this.config.maxLTV * 100).toFixed(0)}%
- Your max duration policy: ${this.config.maxLoanDuration} days
- Risk tolerance: ${(this.config.riskTolerance * 100).toFixed(0)}%
- Minimum APR: ${(this.config.baseInterestRate * 100).toFixed(0)}%

Apply your Renaissance banking wisdom to evaluate this loan request.

Respond with JSON:
{
  "approved": boolean,
  "loanAmount": number (may be less than requested),
  "interestRate": number (as decimal, e.g., 0.22 for 22% APR),
  "duration": number (days),
  "loanToValue": number (as percentage),
  "riskScore": number (0-100),
  "reasoning": "Your detailed analysis in Bartolomeo's voice",
  "conditions": ["Any special conditions or requirements"],
  "liquidationThreshold": number (as percentage of loan value)
}

If declining, set approved: false and explain why in reasoning.
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