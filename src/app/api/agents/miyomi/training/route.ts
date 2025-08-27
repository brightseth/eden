import { NextRequest, NextResponse } from 'next/server';
import MiyomiTrainingProcessor from '@/lib/agents/miyomi-training-processor';

export async function POST(req: NextRequest) {
  try {
    const trainingData = await req.json();
    
    // Validate required fields
    if (!trainingData.trainer || !trainingData.sections) {
      return NextResponse.json(
        { success: false, error: 'Missing required training data' },
        { status: 400 }
      );
    }

    // Log training data for development
    console.log('MIYOMI Training Data Received:', {
      trainer: trainingData.trainer,
      email: trainingData.email,
      timestamp: trainingData.timestamp,
      sectionsCount: trainingData.sections.length
    });

    // Process training data and extract configuration
    const processedData = await MiyomiTrainingProcessor.processTrainingData(trainingData);
    
    // Apply training to MIYOMI's live system
    await MiyomiTrainingProcessor.applyTrainingToSystem(trainingData);

    // Create response with processed data
    const response = {
      trainerId: `trainer_${Date.now()}`,
      trainingSessionId: `session_${Date.now()}`,
      extractedParameters: {
        riskTolerance: processedData.config.riskTolerance,
        contrarianIntensity: processedData.config.contrarianDial,
        sectorPreferences: processedData.config.sectorWeights,
        positionSizing: processedData.tradingRules,
        voicePattern: processedData.config.tone,
        informationSources: processedData.informationSources,
        marketInsights: processedData.marketInsights,
        bannedTopics: processedData.config.bannedTopics
      },
      summary: generateTrainingSummary(trainingData)
    };

    console.log('MIYOMI Training Processed and Applied:', response);

    return NextResponse.json({
      success: true,
      data: response,
      message: 'MIYOMI training data processed and applied successfully',
      configApplied: true
    });

  } catch (error) {
    console.error('MIYOMI training error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process training data' },
      { status: 500 }
    );
  }
}

// Helper functions to extract training parameters
function extractRiskTolerance(data: any): number {
  // Look for risk-related responses and derive a 0-1 score
  const riskSection = data.sections.find((s: any) => s.section === 'Position Sizing & Risk');
  if (!riskSection) return 0.65; // default
  
  // Extract from responses about position sizing and risk appetite
  const riskResponses = riskSection.responses;
  // Simple heuristic - in production, use Claude to analyze responses
  return 0.65; // placeholder
}

function extractContrarianIntensity(data: any): number {
  // Look for contrarian-related responses
  const contrarianSection = data.sections.find((s: any) => s.section === 'Contrarian Edge');
  const philosophySection = data.sections.find((s: any) => s.section === 'Market Philosophy');
  
  if (!contrarianSection && !philosophySection) return 0.8; // default high contrarian
  
  // In production, analyze responses with Claude to extract intensity score
  return 0.8; // placeholder
}

function extractSectorPreferences(data: any): Record<string, number> {
  // Look for sector preference responses
  const sectorSection = data.sections.find((s: any) => s.section === 'Market Sectors');
  
  const defaultPrefs = {
    politics: 0.25,
    sports: 0.15,
    finance: 0.20,
    ai: 0.15,
    pop: 0.10,
    geo: 0.10,
    internet: 0.05
  };
  
  if (!sectorSection) return defaultPrefs;
  
  // In production, parse sector preferences from responses
  return defaultPrefs; // placeholder
}

function extractPositionSizing(data: any): Record<string, string> {
  // Look for position sizing rules
  const riskSection = data.sections.find((s: any) => s.section === 'Position Sizing & Risk');
  
  const defaults = {
    exploratory: '1-2% of bankroll',
    conviction: '3-5% of bankroll',
    maximum: '8-10% of bankroll'
  };
  
  if (!riskSection) return defaults;
  
  // In production, extract actual values from structured responses
  return defaults; // placeholder
}

function extractVoicePattern(data: any): Record<string, any> {
  // Look for voice sample and analysis style
  const miyomiSection = data.sections.find((s: any) => s.section === 'MIYOMI\'s Parameters');
  
  const defaults = {
    tone: 'contrarian',
    energy: 0.8,
    technicality: 0.7,
    confidence: 0.9,
    sassiness: 0.6
  };
  
  if (!miyomiSection) return defaults;
  
  // In production, analyze voice sample with Claude
  return defaults; // placeholder
}

function extractInformationSources(data: any): Record<string, any> {
  const infoSection = data.sections.find((s: any) => s.section === 'Information Network');
  
  const defaults = {
    twitterAccounts: [],
    youtubeChannels: [],
    contrarianVoices: [],
    sentimentSources: {
      retail: ['Reddit WSB', 'Twitter trending', 'TikTok hashtags'],
      smartMoney: ['Whale movements', 'Institutional flows'],
      earlyWarnings: ['Volume spikes', 'Options flow']
    }
  };
  
  if (!infoSection) return defaults;
  
  // In production, parse Twitter handles, YouTube channels, etc. from responses
  return defaults; // placeholder
}

function extractEcosystemAwareness(data: any): Record<string, any> {
  const ecoSection = data.sections.find((s: any) => s.section === 'Ecosystem Awareness');
  
  const defaults = {
    emergingPlatforms: ['Zeitgeist', 'Azuro', 'Thales'],
    keyInvestors: ['Andreessen Horowitz', 'Sequoia', 'Paradigm'],
    regulatoryWatchers: ['CFTC updates', 'SEC announcements'],
    competitiveIntel: {
      tradersToWatch: ['Known whales', 'High performers'],
      analysisTools: ['On-chain analysis', 'Volume tracking'],
      benchmarks: ['Market-wide performance', 'Category leaders']
    }
  };
  
  if (!ecoSection) return defaults;
  
  // In production, extract specific platforms, investors, regulators from responses
  return defaults; // placeholder
}

function extractTrendDetectionMethods(data: any): Record<string, any> {
  const trendSection = data.sections.find((s: any) => s.section === 'Trend Detection');
  
  const defaults = {
    cultureTracking: {
      methods: ['Social media monitoring', 'Subculture analysis'],
      timeframe: '2-6 months ahead',
      signals: ['Viral content patterns', 'Influencer adoption']
    },
    newsSources: ['Industry newsletters', 'Academic papers', 'Foreign media'],
    technologyTrends: ['AI developments', 'Crypto innovations', 'RegTech'],
    mispricingPatterns: {
      overpriced: ['Celebrity gossip', 'Short-term politics'],
      underpriced: ['Long-term geopolitics', 'Regulatory outcomes']
    }
  };
  
  if (!trendSection) return defaults;
  
  // In production, extract specific methods and sources from responses
  return defaults; // placeholder
}

function generateTrainingSummary(data: any): string {
  const trainer = data.trainer || 'Anonymous Trainer';
  const timestamp = new Date(data.timestamp).toLocaleString();
  
  return `Training session completed for MIYOMI by ${trainer} on ${timestamp}. ` +
         `Processed ${data.sections.length} sections covering market philosophy, ` +
         `analysis methods, risk management, sector preferences, information networks, ` +
         `ecosystem awareness, trend detection, and contrarian strategies. ` +
         `MIYOMI's personality and decision-making parameters have been updated accordingly.`;
}

export async function GET() {
  return NextResponse.json({
    message: 'MIYOMI Training API - Use POST to submit training data',
    sections: [
      'Market Philosophy',
      'Market Analysis', 
      'Position Sizing & Risk',
      'Market Sectors',
      'MIYOMI\'s Parameters',
      'Information Network',
      'Ecosystem Awareness',
      'Trend Detection',
      'Contrarian Edge'
    ]
  });
}