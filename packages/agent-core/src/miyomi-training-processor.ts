/**
 * MIYOMI Training Data Processor
 * Converts training interview responses into MIYOMI's operational configuration
 */

import { MiyomiConfig } from './miyomi-claude-sdk';

interface TrainingResponse {
  trainer: string;
  email?: string;
  timestamp: string;
  sections: {
    section: string;
    responses: {
      question: string;
      response: any;
    }[];
  }[];
}

interface ProcessedTrainingData {
  config: MiyomiConfig;
  informationSources: {
    twitter: string[];
    youtube: string[];
    newsletters: string[];
    contrarians: string[];
  };
  marketInsights: {
    overpriced: string[];
    underpriced: string[];
    emergingPlatforms: string[];
    keyInvestors: string[];
  };
  tradingRules: {
    maxPositionSize: number;
    dailyLimit: number;
    autoExecuteThreshold: number;
    exitTriggers: string[];
  };
}

export class MiyomiTrainingProcessor {
  /**
   * Process training interview data into operational config
   */
  static async processTrainingData(trainingData: TrainingResponse): Promise<ProcessedTrainingData> {
    const sections = this.organizeSections(trainingData.sections);
    
    // Extract key parameters from each section
    const riskTolerance = this.extractRiskTolerance(sections);
    const contrarianIntensity = this.extractContrarianIntensity(sections);
    const sectorWeights = this.extractSectorWeights(sections);
    const tradingRules = this.extractTradingRules(sections);
    const informationSources = this.extractInformationSources(sections);
    const marketInsights = this.extractMarketInsights(sections);
    const toneProfile = this.extractToneProfile(sections);

    return {
      config: {
        riskTolerance,
        contrarianDial: contrarianIntensity,
        sectorWeights,
        bannedTopics: this.extractBannedTopics(sections),
        tone: toneProfile
      },
      informationSources,
      marketInsights,
      tradingRules
    };
  }

  private static organizeSections(sections: any[]): Record<string, any> {
    const organized: Record<string, any> = {};
    sections.forEach(section => {
      const sectionKey = section.section.toLowerCase().replace(/\s+/g, '-');
      organized[sectionKey] = {};
      section.responses.forEach((resp: any) => {
        const questionKey = resp.question.substring(0, 50).toLowerCase().replace(/[^a-z0-9]+/g, '-');
        organized[sectionKey][questionKey] = resp.response;
      });
    });
    return organized;
  }

  private static extractRiskTolerance(sections: Record<string, any>): number {
    const riskSection = sections['position-sizing-&-risk'] || sections['position-sizing-risk'];
    const philosophy = sections['market-philosophy'];
    
    let riskScore = 0.5; // Default moderate risk
    
    // Check position sizing rules
    if (riskSection) {
      const sizingRules = riskSection['define-your-position-sizing-thresholds'];
      if (sizingRules) {
        // Parse position sizes to determine risk tolerance
        if (sizingRules[2]?.includes('10%') || sizingRules[2]?.includes('15%')) {
          riskScore += 0.2; // Higher risk tolerance
        }
        if (sizingRules[0]?.includes('1%') || sizingRules[0]?.includes('2%')) {
          riskScore -= 0.1; // Conservative starts
        }
      }
    }
    
    // Check risk appetite from philosophy
    if (philosophy) {
      const riskAppetite = philosophy['how-essential-is-taking-positions-that-make-others'];
      if (riskAppetite === 'Essential') riskScore += 0.2;
      if (riskAppetite === 'Very Important') riskScore += 0.1;
      if (riskAppetite === 'Avoid') riskScore -= 0.2;
    }
    
    return Math.max(0.2, Math.min(0.95, riskScore));
  }

  private static extractContrarianIntensity(sections: Record<string, any>): number {
    const contrarianSection = sections['contrarian-edge'];
    const philosophy = sections['market-philosophy'];
    
    let contrarianScore = 0.7; // Default high contrarian
    
    if (philosophy) {
      const thesis = philosophy['define-your-contrarian-trading-philosophy-in-one'] || '';
      // Analyze thesis for contrarian intensity
      if (thesis.toLowerCase().includes('consensus wrong')) contrarianScore += 0.1;
      if (thesis.toLowerCase().includes('crowd psychology')) contrarianScore += 0.1;
    }
    
    if (contrarianSection) {
      const signals = contrarianSection['what-signals-tell-you-consensus-is-about-to-break'];
      if (signals) contrarianScore += 0.05;
      
      const nycAdvantage = contrarianSection['how-does-your-nyc-perspective-give-you-edge'];
      if (nycAdvantage && nycAdvantage.length > 100) contrarianScore += 0.05;
    }
    
    return Math.max(0.5, Math.min(0.99, contrarianScore));
  }

  private static extractSectorWeights(sections: Record<string, any>): Record<string, number> {
    const sectorSection = sections['market-sectors'];
    
    // Default weights
    let weights = {
      politics: 0.20,
      sports: 0.15,
      finance: 0.20,
      ai: 0.15,
      pop: 0.10,
      geo: 0.10,
      internet: 0.10
    };
    
    if (sectorSection) {
      const preferences = sectorSection['rank-your-preferred-prediction-market-categories'];
      if (preferences) {
        // Parse ranked preferences
        const lines = preferences.split('\n');
        const totalWeight = 1.0;
        const decrementFactor = 0.85;
        let currentWeight = 0.25;
        
        lines.forEach((line: string, index: number) => {
          const normalizedLine = line.toLowerCase();
          Object.keys(weights).forEach(sector => {
            if (normalizedLine.includes(sector) || 
                (sector === 'politics' && normalizedLine.includes('politic')) ||
                (sector === 'ai' && (normalizedLine.includes('tech') || normalizedLine.includes('artificial')))) {
              weights[sector as keyof typeof weights] = currentWeight;
            }
          });
          currentWeight *= decrementFactor;
        });
      }
    }
    
    // Normalize weights to sum to 1
    const total = Object.values(weights).reduce((sum, w) => sum + w, 0);
    Object.keys(weights).forEach(key => {
      weights[key as keyof typeof weights] = weights[key as keyof typeof weights] / total;
    });
    
    return weights;
  }

  private static extractTradingRules(sections: Record<string, any>): any {
    const riskSection = sections['position-sizing-&-risk'] || sections['position-sizing-risk'];
    const parametersSection = sections['miyomi-s-parameters'] || sections['miyomis-parameters'];
    
    const rules = {
      maxPositionSize: 500,
      dailyLimit: 1500,
      autoExecuteThreshold: 0.85,
      exitTriggers: []
    };
    
    if (parametersSection) {
      const autonomyLimits = parametersSection['define-miyomi-s-trading-authority'];
      if (autonomyLimits) {
        // Parse max position size
        const maxPos = autonomyLimits[0];
        if (maxPos) {
          const match = maxPos.match(/\$?([\d,]+)/);
          if (match) rules.maxPositionSize = parseInt(match[1].replace(/,/g, ''));
        }
        
        // Parse daily limit
        const dailyLimit = autonomyLimits[1];
        if (dailyLimit) {
          const match = dailyLimit.match(/\$?([\d,]+)/);
          if (match) rules.dailyLimit = parseInt(match[1].replace(/,/g, ''));
        }
      }
      
      const confidenceThresholds = parametersSection['when-should-miyomi-auto-execute-vs-ask-for'];
      if (confidenceThresholds) {
        // Parse auto-execute threshold
        const autoExec = confidenceThresholds[0];
        if (autoExec) {
          const match = autoExec.match(/(\d+)%?/);
          if (match) rules.autoExecuteThreshold = parseInt(match[1]) / 100;
        }
      }
    }
    
    if (riskSection) {
      const exitStrategy = riskSection['specific-conditions-that-trigger-exits-not-theory'];
      if (exitStrategy) {
        rules.exitTriggers = exitStrategy.split('\n').filter((t: string) => t.trim());
      }
    }
    
    return rules;
  }

  private static extractInformationSources(sections: Record<string, any>): any {
    const infoSection = sections['information-network'];
    
    const sources = {
      twitter: [] as string[],
      youtube: [] as string[],
      newsletters: [] as string[],
      contrarians: [] as string[]
    };
    
    if (infoSection) {
      // Extract Twitter accounts
      const twitterAccounts = infoSection['top-10-twitter-x-accounts-you-follow-for-market'];
      if (twitterAccounts) {
        const handles = twitterAccounts.match(/@[\w]+/g) || [];
        sources.twitter = handles;
      }
      
      // Extract YouTube channels
      const youtubeChannels = infoSection['youtube-channels-podcasts-that-give-you-edge-in'];
      if (youtubeChannels) {
        sources.youtube = youtubeChannels.split('\n').filter((c: string) => c.trim());
      }
      
      // Extract contrarian voices
      const contrarianVoices = infoSection['who-are-the-best-contrarian-voices-you-follow'];
      if (contrarianVoices) {
        sources.contrarians = contrarianVoices.split('\n').filter((v: string) => v.trim());
      }
    }
    
    // Check trend detection section for news sources
    const trendSection = sections['trend-detection'];
    if (trendSection) {
      const newsSources = trendSection['non-obvious-news-sources-that-give-you-early'];
      if (newsSources) {
        sources.newsletters = newsSources.split(',').map((s: string) => s.trim());
      }
    }
    
    return sources;
  }

  private static extractMarketInsights(sections: Record<string, any>): any {
    const insights = {
      overpriced: [] as string[],
      underpriced: [] as string[],
      emergingPlatforms: [] as string[],
      keyInvestors: [] as string[]
    };
    
    // Extract from Market Sectors
    const sectorSection = sections['market-sectors'];
    if (sectorSection) {
      const overratedUnderrated = sectorSection['list-overrated-and-underrated-market-categories'];
      if (overratedUnderrated) {
        if (overratedUnderrated[0]) {
          insights.overpriced = overratedUnderrated[0].split('\n').filter((s: string) => s.trim());
        }
        if (overratedUnderrated[1]) {
          insights.underpriced = overratedUnderrated[1].split('\n').filter((s: string) => s.trim());
        }
      }
    }
    
    // Extract from Trend Detection
    const trendSection = sections['trend-detection'];
    if (trendSection) {
      const inefficiencies = trendSection['where-do-you-find-the-most-consistent-mispricings'];
      if (inefficiencies) {
        if (inefficiencies[0]) {
          insights.overpriced = [...insights.overpriced, ...inefficiencies[0].split('\n').filter((s: string) => s.trim())];
        }
        if (inefficiencies[1]) {
          insights.underpriced = [...insights.underpriced, ...inefficiencies[1].split('\n').filter((s: string) => s.trim())];
        }
      }
    }
    
    // Extract from Ecosystem Awareness
    const ecosystemSection = sections['ecosystem-awareness'];
    if (ecosystemSection) {
      const platforms = ecosystemSection['what-new-prediction-market-platforms-should-miyomi'];
      if (platforms) {
        // Extract platform names
        const platformNames = platforms.match(/(?:Zeitgeist|Azuro|Thales|[\w]+(?:\s+Market)?)/gi) || [];
        insights.emergingPlatforms = platformNames;
      }
      
      const investors = ecosystemSection['vcs-and-investors-whose-moves-signal-market'];
      if (investors) {
        // Extract investor names
        const investorNames = investors.match(/(?:Andreessen|Sequoia|Paradigm|[\w]+(?:\s+Capital)?)/gi) || [];
        insights.keyInvestors = investorNames;
      }
    }
    
    return insights;
  }

  private static extractToneProfile(sections: Record<string, any>): any {
    const parametersSection = sections['miyomi-s-parameters'] || sections['miyomis-parameters'];
    
    let tone = {
      energy: 0.8,
      sass: 0.7,
      profanity: 0.2
    };
    
    if (parametersSection) {
      const voiceSample = parametersSection['write-a-100-word-market-analysis-as-you-would'];
      if (voiceSample) {
        // Analyze voice sample for tone
        const sample = voiceSample.toLowerCase();
        
        // Energy detection
        if (sample.includes('!')) tone.energy += 0.1;
        if (sample.includes('absolutely') || sample.includes('definitely')) tone.energy += 0.05;
        
        // Sass detection
        if (sample.includes('obviously') || sample.includes('clearly')) tone.sass += 0.1;
        if (sample.includes('lol') || sample.includes('lmao')) tone.sass += 0.1;
        
        // Profanity detection (mild)
        if (sample.includes('damn') || sample.includes('hell')) tone.profanity += 0.1;
        if (sample.includes('shit') || sample.includes('fuck')) tone.profanity += 0.3;
      }
    }
    
    // Normalize values
    tone.energy = Math.min(1, tone.energy);
    tone.sass = Math.min(1, tone.sass);
    tone.profanity = Math.min(0.5, tone.profanity); // Cap profanity
    
    return tone;
  }

  private static extractBannedTopics(sections: Record<string, any>): string[] {
    const parametersSection = sections['miyomi-s-parameters'] || sections['miyomis-parameters'];
    
    // Default banned topics for safety
    const banned = ['medical', 'pregnancy', 'personal-health', 'suicide', 'self-harm'];
    
    if (parametersSection) {
      const nonNegotiables = parametersSection['rules-miyomi-must-never-break'];
      if (nonNegotiables) {
        // Extract additional banned topics from rules
        const lines = nonNegotiables.toLowerCase().split('\n');
        lines.forEach((line: string) => {
          if (line.includes('never') || line.includes('avoid') || line.includes('no')) {
            // Extract topic keywords
            if (line.includes('violence')) banned.push('violence');
            if (line.includes('drugs')) banned.push('drugs');
            if (line.includes('conspiracy')) banned.push('conspiracy-theories');
          }
        });
      }
    }
    
    return [...new Set(banned)]; // Remove duplicates
  }

  /**
   * Apply training data to MIYOMI's live configuration
   */
  static async applyTrainingToSystem(trainingData: TrainingResponse): Promise<void> {
    const processed = await this.processTrainingData(trainingData);
    
    // Save to database or configuration store
    await this.saveConfiguration(processed);
    
    // Update MIYOMI's Claude SDK
    const { miyomiSDK } = await import('./miyomi-claude-sdk');
    await miyomiSDK.updateConfig(processed.config);
    
    console.log('Training applied successfully:', {
      trainer: trainingData.trainer,
      timestamp: trainingData.timestamp,
      configUpdated: true,
      sectorsUpdated: Object.keys(processed.config.sectorWeights).length,
      sourcesUpdated: processed.informationSources.twitter.length + 
                      processed.informationSources.youtube.length
    });
  }

  private static async saveConfiguration(processed: ProcessedTrainingData): Promise<void> {
    // TODO: Implement database save
    // For now, save to local storage or API
    if (typeof window !== 'undefined') {
      localStorage.setItem('miyomi-training-config', JSON.stringify(processed));
    }
    
    // Also save to API endpoint
    try {
      await fetch('/api/agents/miyomi/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(processed)
      });
    } catch (error) {
      console.error('Failed to save config to API:', error);
    }
  }
}

export default MiyomiTrainingProcessor;