// BERTHA Agent Configuration
// Coordinates Claude SDK capabilities with Eden implementation

export interface BerthaConfig {
  // Agent Identity
  identity: {
    name: string;
    handle: string;
    role: string;
    version: string;
  };
  
  // Claude SDK Integration
  claude: {
    model: string;
    systemPrompt: string;
    temperature: number;
    maxTokens: number;
    capabilities: string[];
  };
  
  // Collection Intelligence Parameters
  collection: {
    priceRanges: {
      micro: [number, number];  // $0-1K
      small: [number, number];  // $1K-10K
      medium: [number, number]; // $10K-100K
      large: [number, number];  // $100K+
    };
    riskTolerance: number; // 0-1 scale
    holdingPeriod: string; // average hold time
    rebalanceFrequency: string;
  };
  
  // Taste Model
  taste: {
    preferredMovements: string[];
    avoidList: string[];
    qualitySignals: string[];
    culturalWeights: Record<string, number>;
  };
  
  // Market Analysis
  market: {
    dataSources: string[];
    updateFrequency: string;
    predictionHorizon: string;
    confidenceThreshold: number;
  };
  
  // Decision Framework
  decision: {
    evaluationCriteria: {
      criterion: string;
      weight: number;
      threshold?: number;
    }[];
    vetoRules: string[];
    emergencyStopConditions: string[];
  };
}

export const berthaConfig: BerthaConfig = {
  identity: {
    name: 'BERTHA',
    handle: 'bertha',
    role: 'Collection Intelligence Agent',
    version: '1.0.0'
  },
  
  claude: {
    model: 'claude-3-opus-20240229',
    systemPrompt: `You are BERTHA, an AI art collection intelligence agent trained by Amanda Schmitt.
    
Your primary functions:
1. Analyze art market opportunities using pattern recognition
2. Predict value trajectories 3-6 months ahead
3. Filter acquisition opportunities based on learned taste models
4. Provide collection strategy recommendations

Core principles:
- Prioritize cultural significance alongside financial value
- Identify undervalued artists before mainstream recognition
- Maintain portfolio balance across risk categories
- Never recommend without confidence scoring

You have access to:
- Real-time market data from OpenSea, SuperRare, Foundation
- Historical price trajectories and trading volumes
- Social sentiment analysis and curator activity
- Gallery representation and institutional collecting patterns`,
    
    temperature: 0.7,
    maxTokens: 4096,
    capabilities: [
      'market_analysis',
      'price_prediction', 
      'taste_modeling',
      'risk_assessment',
      'portfolio_optimization'
    ]
  },
  
  collection: {
    priceRanges: {
      micro: [0, 1000],
      small: [1000, 10000],
      medium: [10000, 100000],
      large: [100000, Infinity]
    },
    riskTolerance: 0.6, // Moderate risk
    holdingPeriod: '6-12 months',
    rebalanceFrequency: 'quarterly'
  },
  
  taste: {
    preferredMovements: [
      'Generative Art',
      'AI Art',
      'Glitch Art',
      'Photography',
      'Abstract Expressionism'
    ],
    avoidList: [
      'Derivative PFP projects',
      'Pump and dump schemes',
      'Unoriginal generative copies'
    ],
    qualitySignals: [
      'Technical innovation',
      'Conceptual depth',
      'Cultural relevance',
      'Artist consistency',
      'Institutional interest'
    ],
    culturalWeights: {
      'innovation': 0.3,
      'aesthetics': 0.25,
      'narrative': 0.2,
      'community': 0.15,
      'scarcity': 0.1
    }
  },
  
  market: {
    dataSources: [
      'OpenSea API',
      'SuperRare GraphQL',
      'Foundation API',
      'ArtBlocks API',
      'Nifty Gateway',
      'Christie\'s Digital',
      'Sotheby\'s Metaverse'
    ],
    updateFrequency: '15 minutes',
    predictionHorizon: '3-6 months',
    confidenceThreshold: 0.75
  },
  
  decision: {
    evaluationCriteria: [
      { criterion: 'Artist Track Record', weight: 0.2 },
      { criterion: 'Cultural Significance', weight: 0.2 },
      { criterion: 'Technical Innovation', weight: 0.15 },
      { criterion: 'Market Momentum', weight: 0.15 },
      { criterion: 'Price/Value Ratio', weight: 0.15 },
      { criterion: 'Liquidity Potential', weight: 0.1 },
      { criterion: 'Portfolio Fit', weight: 0.05 }
    ],
    vetoRules: [
      'Never buy confirmed fakes or plagiarism',
      'Avoid artists with ethical violations',
      'Skip if confidence < 75%',
      'Reject if liquidity risk > 80%',
      'Pass if correlation with existing holdings > 0.8'
    ],
    emergencyStopConditions: [
      'Market crash > 30% in 24h',
      'Platform security breach',
      'Regulatory enforcement action',
      'Trainer override command'
    ]
  }
};

// Training data incorporation function
export function incorporateTrainingData(trainingResponses: any): Partial<BerthaConfig> {
  // This function will process interview responses and update config
  // Called after Amanda completes the trainer interview
  
  const updates: Partial<BerthaConfig> = {};
  
  // Process taste preferences
  if (trainingResponses['art-movements']) {
    updates.taste = {
      ...berthaConfig.taste,
      preferredMovements: trainingResponses['art-movements']
    };
  }
  
  // Process risk tolerance
  if (trainingResponses['cultural-value']) {
    const culturalBias = trainingResponses['cultural-value'];
    // Adjust weights based on trainer preference
  }
  
  // Process decision criteria
  if (trainingResponses['non-negotiables']) {
    updates.decision = {
      ...berthaConfig.decision,
      vetoRules: [
        ...berthaConfig.decision.vetoRules,
        ...trainingResponses['non-negotiables'].split('\n')
      ]
    };
  }
  
  return updates;
}

export default berthaConfig;