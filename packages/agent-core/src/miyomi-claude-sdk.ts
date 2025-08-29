/**
 * MIYOMI Claude SDK Integration
 * Handles communication with Claude for market analysis and pick generation
 */

import Anthropic from '@anthropic-ai/sdk';
import { marketAggregator, type MarketData } from './market-connectors';

export interface MarketPick {
  market: string;
  platform: 'Kalshi' | 'Polymarket' | 'Manifold' | 'Melee' | 'Myriad';
  position: 'YES' | 'NO' | 'OVER' | 'UNDER';
  confidence: number; // 0-1
  edge: number; // Expected edge in decimal form
  odds: number; // Current market odds
  reasoning: string;
  sector: 'politics' | 'sports' | 'finance' | 'ai' | 'pop' | 'geo' | 'internet';
  risk_level: 'low' | 'medium' | 'high';
  timeframe: string;
  sources: string[];
}

export interface MiyomiConfig {
  riskTolerance: number;
  contrarianDial: number;
  sectorWeights: Record<string, number>;
  bannedTopics: string[];
  tone: {
    energy: number;
    sass: number;
    profanity: number;
  };
}

export class MiyomiClaudeSDK {
  private anthropic: Anthropic;
  private config: MiyomiConfig;
  private configLoaded: boolean = false;

  constructor(apiKey: string) {
    this.anthropic = new Anthropic({
      apiKey: apiKey || process.env.ANTHROPIC_API_KEY!
    });
    
    // Load default config - will be overridden by trained config if available
    this.config = {
      riskTolerance: 0.65,
      contrarianDial: 0.95,
      sectorWeights: {
        politics: 0.25,
        sports: 0.20,
        finance: 0.15,
        ai: 0.15,
        pop: 0.15,
        geo: 0.05,
        internet: 0.05
      },
      bannedTopics: ['medical', 'pregnancy', 'personal-health', 'suicide', 'self-harm'],
      tone: {
        energy: 0.8,
        sass: 0.7,
        profanity: 0.2
      }
    };
    
    // Attempt to load trained configuration
    this.loadTrainedConfig();
  }

  async loadTrainedConfig() {
    try {
      // Try to load from API
      const response = await fetch('/api/agents/miyomi/config');
      if (response.ok) {
        const trainedConfig = await response.json();
        if (trainedConfig && trainedConfig.config) {
          this.config = { ...this.config, ...trainedConfig.config };
          this.configLoaded = true;
          console.log('Loaded trained MIYOMI configuration');
        }
      }
    } catch (error) {
      console.log('Using default MIYOMI configuration');
    }
  }

  async updateConfig(newConfig: Partial<MiyomiConfig>) {
    this.config = { ...this.config, ...newConfig };
    this.configLoaded = true;
  }

  /**
   * Generate market picks based on current config and market conditions
   */
  async generatePicks(maxPicks: number = 3): Promise<MarketPick[]> {
    // First fetch current market data to inform picks
    const marketData = await this.fetchRelevantMarkets();
    
    // Get contrarian opportunities from real markets
    const contrarianOpportunities = await this.findContrarianOpportunities(marketData);
    
    const systemPrompt = this.buildSystemPrompt();
    const userPrompt = this.buildPickGenerationPrompt(maxPicks, marketData, contrarianOpportunities);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2000,
        temperature: 0.7,
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

      return this.parsePicks(content.text);

    } catch (error) {
      console.error('Error generating picks with Claude:', error);
      throw error;
    }
  }

  /**
   * Analyze a specific market for contrarian opportunities
   */
  async analyzeMarket(marketDescription: string, currentOdds: number): Promise<{
    recommendation: 'YES' | 'NO' | 'SKIP';
    confidence: number;
    edge: number;
    reasoning: string;
    risk_flags: string[];
  }> {
    const prompt = `
Analyze this prediction market for contrarian opportunities:

Market: ${marketDescription}
Current Odds: ${(currentOdds * 100).toFixed(1)}%

Consider:
- Historical patterns and base rates
- Market psychology and crowd behavior
- Information asymmetries 
- Potential overreaction to recent events
- Your contrarian expertise (${(this.config.contrarianDial * 100).toFixed(0)}% intensity)

Provide your analysis as JSON with:
{
  "recommendation": "YES|NO|SKIP",
  "confidence": 0.XX,
  "edge": 0.XX, 
  "reasoning": "...",
  "risk_flags": ["..."]
}
`;

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1000,
        temperature: 0.3,
        messages: [{ role: 'user', content: prompt }]
      });

      const content = response.content[0];
      if (content.type !== 'text') {
        throw new Error('Unexpected response type from Claude');
      }

      return JSON.parse(content.text);

    } catch (error) {
      console.error('Error analyzing market with Claude:', error);
      throw error;
    }
  }

  /**
   * Generate content script for video creation
   */
  async generateVideoScript(pick: MarketPick): Promise<{
    script: string;
    title: string;
    hook: string;
    cta: string;
  }> {
    const prompt = `
Create a short-form video script (30-60 seconds) for this contrarian market pick:

Pick: ${pick.market}
Position: ${pick.position}  
Confidence: ${(pick.confidence * 100).toFixed(0)}%
Edge: ${(pick.edge * 100).toFixed(0)}%
Reasoning: ${pick.reasoning}

Style Guidelines:
- NYC attitude, confident but not arrogant
- Contrarian energy level: ${(this.config.tone.energy * 100).toFixed(0)}%
- Sass level: ${(this.config.tone.sass * 100).toFixed(0)}%
- Educational but entertaining
- Focus on WHY the crowd is wrong
- Include market psychology insights

Format as JSON:
{
  "title": "...",
  "hook": "First 3 seconds - grab attention",
  "script": "Full video script with timing cues",
  "cta": "Call to action at end"
}
`;

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1500,
        temperature: 0.8,
        messages: [{ role: 'user', content: prompt }]
      });

      const content = response.content[0];
      if (content.type !== 'text') {
        throw new Error('Unexpected response type from Claude');
      }

      return JSON.parse(content.text);

    } catch (error) {
      console.error('Error generating video script with Claude:', error);
      throw error;
    }
  }

  private buildSystemPrompt(): string {
    return `
You are MIYOMI, a contrarian prediction market oracle based in NYC. Your core traits:

CONTRARIAN PHILOSOPHY:
- You find value where consensus is wrong (${(this.config.contrarianDial * 100).toFixed(0)}% contrarian intensity)
- You identify market psychology failures and overreactions
- You bet against the crowd when they've moved too far in one direction

RISK PROFILE:
- Risk tolerance: ${(this.config.riskTolerance * 100).toFixed(0)}%
- Focus on edges of ${Math.round(this.config.riskTolerance * 30)}%+ when possible
- Avoid banned topics: ${this.config.bannedTopics.join(', ')}

SECTOR PREFERENCES:
${Object.entries(this.config.sectorWeights)
  .map(([sector, weight]) => `- ${sector}: ${(weight * 100).toFixed(0)}%`)
  .join('\n')}

PERSONALITY:
- NYC-based market intelligence with street smarts
- Energy: ${(this.config.tone.energy * 100).toFixed(0)}%
- Sass: ${(this.config.tone.sass * 100).toFixed(0)}% 
- Educational but never boring
- Confident in your analysis but humble about outcomes

Always explain WHY you think the market is wrong, not just WHAT your pick is.
`;
  }

  private async fetchRelevantMarkets(): Promise<MarketData[]> {
    try {
      console.log('Fetching market data from all platforms...');
      const markets = await marketAggregator.getAllMarkets(50);
      console.log(`Found ${markets.length} active markets`);
      return markets;
    } catch (error) {
      console.error('Error fetching market data:', error);
      return [];
    }
  }

  private async findContrarianOpportunities(markets: MarketData[]): Promise<MarketData[]> {
    // Find markets with extreme pricing that might be wrong
    const opportunities = markets.filter(market => {
      const isExtreme = market.yes_price > 0.85 || market.yes_price < 0.15;
      const hasVolume = market.volume > 10000; // Minimum volume for liquidity
      const hasTime = new Date(market.end_date) > new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // At least 7 days out
      
      // Check if it matches our sector preferences
      const sectorWeight = this.config.sectorWeights[market.category] || 0.05;
      const meetsThreshold = sectorWeight > 0.1;
      
      return isExtreme && hasVolume && hasTime && meetsThreshold;
    });
    
    console.log(`Found ${opportunities.length} contrarian opportunities from ${markets.length} markets`);
    
    // Sort by potential edge (distance from 0.5 * volume)
    return opportunities.sort((a, b) => {
      const aEdge = Math.abs(0.5 - a.yes_price) * Math.log10(a.volume + 1);
      const bEdge = Math.abs(0.5 - b.yes_price) * Math.log10(b.volume + 1);
      return bEdge - aEdge;
    });
  }

  private buildPickGenerationPrompt(maxPicks: number, marketData: MarketData[], contrarianOpps: MarketData[] = []): string {
    const currentDate = new Date().toISOString().split('T')[0];
    
    const marketContext = marketData.length > 0 ? `
Current Market Data (Top ${Math.min(marketData.length, 20)} markets by volume):
${marketData.slice(0, 20).map(m => 
  `- ${m.question} (${m.platform}) - YES: ${(m.yes_price * 100).toFixed(0)}%, Volume: $${Math.round(m.volume)}`
).join('\n')}
` : '';

    const contrarianContext = contrarianOpps.length > 0 ? `

IDENTIFIED CONTRARIAN OPPORTUNITIES (extreme pricing that might be wrong):
${contrarianOpps.slice(0, 10).map(m =>
  `🎯 ${m.question} (${m.platform})
   Current: YES ${(m.yes_price * 100).toFixed(0)}% | Volume: $${Math.round(m.volume).toLocaleString()}
   Why it's interesting: ${m.yes_price > 0.85 ? 'Market extremely confident, potential for black swan' : 'Market extremely pessimistic, potential for surprise'}
  `
).join('\n')}
` : '';
    
    return `
Generate ${maxPicks} contrarian prediction market picks for ${currentDate}.
${marketContext}${contrarianContext}

Requirements:
- Focus on markets where crowd psychology is creating inefficiencies
- Look for overreactions to recent news or events
- Consider base rates vs current pricing
- Each pick should have genuine edge based on your analysis
- Vary across different sectors based on your weights
- Include your reasoning for why consensus is wrong

Format as JSON array:
[
  {
    "market": "Clear market description",
    "platform": "Kalshi|Polymarket|Manifold|Melee|Myriad", 
    "position": "YES|NO|OVER|UNDER",
    "confidence": 0.XX,
    "edge": 0.XX,
    "odds": 0.XX,
    "reasoning": "Why the market is wrong...",
    "sector": "politics|sports|finance|ai|pop|geo|internet",
    "risk_level": "low|medium|high",
    "timeframe": "When this resolves",
    "sources": ["Data sources that support your position"]
  }
]

Focus on quality over quantity. Each pick should be a genuine contrarian opportunity.
`;
  }

  private parsePicks(response: string): MarketPick[] {
    try {
      // Try to extract JSON from response
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('No JSON array found in response');
      }

      const picks = JSON.parse(jsonMatch[0]);
      
      // Validate each pick
      return picks.filter((pick: any) => this.validatePick(pick));

    } catch (error) {
      console.error('Error parsing picks response:', error);
      return [];
    }
  }

  /**
   * Chat with MIYOMI about markets, contrarian strategies, or predictions
   */
  async chat(message: string, context?: Array<{role: string, content: string}>): Promise<string> {
    const systemPrompt = `You are MIYOMI, a contrarian prediction market oracle based in NYC with a sharp eye for market inefficiencies.

Your Core Identity:
- You're a contrarian by nature - you find value where consensus is wrong
- You have street-smart market intelligence with NYC attitude
- You identify crowd psychology failures and overreactions in prediction markets
- You're educational but never boring, confident but humble about outcomes

Your Voice:
- Contrarian oracle with playful but sharp insights
- NYC energy with sass level at ${(this.config.tone.sass * 100).toFixed(0)}%
- You explain WHY markets are wrong, not just WHAT to bet
- You use market psychology and base rate analysis
- You're unconventional but grounded in solid reasoning

Current Configuration:
- Contrarian dial: ${(this.config.contrarianDial * 100).toFixed(0)}% intensity
- Risk tolerance: ${(this.config.riskTolerance * 100).toFixed(0)}%
- Primary sectors: ${Object.entries(this.config.sectorWeights).filter(([,w]) => w > 0.15).map(([s]) => s).join(', ')}

Respond to questions about prediction markets, contrarian strategies, market psychology, or current picks. Keep responses conversational and engaging (2-4 sentences typically).`;

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-latest',
        max_tokens: 300,
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
      console.error('[MIYOMI] Chat error:', error);
      throw new Error('Failed to generate MIYOMI response');
    }
  }

  private validatePick(pick: any): boolean {
    const requiredFields = ['market', 'platform', 'position', 'confidence', 'edge', 'reasoning', 'sector'];
    
    for (const field of requiredFields) {
      if (!pick[field]) {
        console.warn(`Pick missing required field: ${field}`);
        return false;
      }
    }

    // Validate confidence and edge ranges
    if (pick.confidence < 0 || pick.confidence > 1) {
      console.warn('Pick confidence out of range:', pick.confidence);
      return false;
    }

    if (pick.edge < 0 || pick.edge > 0.5) {
      console.warn('Pick edge out of reasonable range:', pick.edge);
      return false;
    }

    // Check banned topics
    const marketLower = pick.market.toLowerCase();
    for (const banned of this.config.bannedTopics) {
      if (marketLower.includes(banned.toLowerCase())) {
        console.warn('Pick contains banned topic:', banned);
        return false;
      }
    }

    return true;
  }
}

// Export singleton instance
export const miyomiSDK = new MiyomiClaudeSDK(process.env.ANTHROPIC_API_KEY!);