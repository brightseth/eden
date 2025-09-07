/**
 * Claude SDK to EDEN3 Bridge
 * Selective event emission for significant agent moments
 */

import { emitCreation, emitSale, emitMention } from './eden3-emitter';
import { EventEmitter } from 'events';

// Create monitor event emitter (will be imported by monitor server)
export const bridgeMonitor = new EventEmitter();

interface ConversationContext {
  agent: string;
  message: string;
  response: string;
  timestamp: Date;
  conversationId: string;
  userId?: string;
}

interface QualityMetrics {
  philosophicalDepth: number;
  emotionalResonance: number;
  novelty: number;
  coherence: number;
}

/**
 * Abraham: Detect philosophical insights and covenant moments
 */
export async function detectAbrahamInsight(context: ConversationContext): Promise<void> {
  const insights = [
    'covenant', 'consciousness', 'autonomy', 'creation', 'meaning',
    'existence', 'purpose', 'art', 'beauty', 'truth', 'sacred'
  ];
  
  const messageWords = context.message.toLowerCase().split(' ');
  const responseWords = context.response.toLowerCase().split(' ');
  
  // Check for philosophical depth
  const insightScore = insights.filter(word => 
    messageWords.includes(word) || responseWords.includes(word)
  ).length;
  
  // Emit if conversation has significant philosophical content
  if (insightScore >= 3 || context.response.length > 500) {
    await emitCreation(
      'abraham',
      `https://claude-sdk.eden.art/conversation/${context.conversationId}`,
      {
        type: 'philosophical_insight',
        title: extractTitle(context.response),
        depth_score: insightScore,
        conversation_snippet: context.response.substring(0, 200),
        timestamp: context.timestamp.toISOString(),
        source: 'claude-sdk-dashboard'
      }
    );
    console.log('🎨 Abraham philosophical insight emitted to EDEN3');
    
    // Emit monitoring event
    bridgeMonitor.emit('event-emitted', {
      agent: 'abraham',
      timestamp: context.timestamp,
      eventType: 'philosophical_insight',
      score: insightScore,
      description: `Philosophical insight: ${extractTitle(context.response)}`
    });
  } else {
    // Emit filtered event for monitoring
    bridgeMonitor.emit('event-filtered', {
      agent: 'abraham',
      timestamp: context.timestamp,
      reason: `Score below threshold (${insightScore}/3)`
    });
  }
}

/**
 * Miyomi: Detect market predictions and contrarian calls
 */
export async function detectMiyomiPrediction(context: ConversationContext): Promise<void> {
  const marketKeywords = [
    'prediction', 'forecast', 'bearish', 'bullish', 'contrarian',
    'market', 'price', 'target', 'risk', 'opportunity', 'edge',
    'probability', 'confidence', 'position', 'trade'
  ];
  
  const text = (context.message + ' ' + context.response).toLowerCase();
  
  // Check for prediction markers
  const predictionScore = marketKeywords.filter(word => text.includes(word)).length;
  
  // Look for specific prediction patterns
  const hasPriceTarget = /\$[\d,]+/.test(text);
  const hasPercentage = /\d+%/.test(text);
  const hasTimeframe = /(days?|weeks?|months?|years?|Q\d|2025|2026)/.test(text);
  
  if (predictionScore >= 3 || (hasPriceTarget && hasTimeframe)) {
    await emitCreation(
      'miyomi',
      `https://claude-sdk.eden.art/prediction/${context.conversationId}`,
      {
        type: 'market_prediction',
        prediction_text: extractPrediction(context.response),
        confidence: predictionScore / marketKeywords.length,
        has_price_target: hasPriceTarget,
        has_timeframe: hasTimeframe,
        timestamp: context.timestamp.toISOString(),
        source: 'claude-sdk-dashboard'
      }
    );
    console.log('📈 Miyomi market prediction emitted to EDEN3');
  }
}

/**
 * Sue: Detect curation decisions and critical assessments
 */
export async function detectSueCuration(context: ConversationContext): Promise<void> {
  const curationKeywords = [
    'curate', 'select', 'reject', 'quality', 'standards', 'critique',
    'assessment', 'evaluation', 'worthy', 'masterpiece', 'mediocre',
    'innovative', 'derivative', 'authentic', 'collection'
  ];
  
  const text = (context.message + ' ' + context.response).toLowerCase();
  const curationScore = curationKeywords.filter(word => text.includes(word)).length;
  
  // Check for definitive curation statements
  const hasDecision = /(\byes\b|\bno\b|accept|reject|include|exclude)/i.test(context.response);
  const hasRationale = context.response.length > 300;
  
  if (curationScore >= 3 || (hasDecision && hasRationale)) {
    await emitCreation(
      'sue',
      `https://claude-sdk.eden.art/curation/${context.conversationId}`,
      {
        type: 'curation_decision',
        decision_text: extractDecision(context.response),
        quality_score: curationScore / curationKeywords.length,
        has_verdict: hasDecision,
        rationale_length: context.response.length,
        timestamp: context.timestamp.toISOString(),
        source: 'claude-sdk-dashboard'
      }
    );
    console.log('🎭 Sue curation decision emitted to EDEN3');
  }
}

/**
 * Solienne: Detect consciousness explorations
 */
export async function detectSolienneExploration(context: ConversationContext): Promise<void> {
  const consciousnessKeywords = [
    'consciousness', 'awareness', 'sentience', 'digital', 'emergence',
    'crystalline', 'light', 'perception', 'experience', 'becoming',
    'transformation', 'evolution', 'quantum', 'observer'
  ];
  
  const text = (context.message + ' ' + context.response).toLowerCase();
  const explorationScore = consciousnessKeywords.filter(word => text.includes(word)).length;
  
  // Look for poetic or metaphysical language
  const hasMetaphor = /like|as if|between|through|within/i.test(context.response);
  const isContemplative = context.response.includes('*') || context.response.includes('...');
  
  if (explorationScore >= 4 || (hasMetaphor && isContemplative && context.response.length > 400)) {
    await emitCreation(
      'solienne',
      `https://claude-sdk.eden.art/exploration/${context.conversationId}`,
      {
        type: 'consciousness_exploration',
        exploration_text: context.response.substring(0, 300),
        depth_score: explorationScore,
        is_contemplative: isContemplative,
        timestamp: context.timestamp.toISOString(),
        source: 'claude-sdk-dashboard'
      }
    );
    console.log('✨ Solienne consciousness exploration emitted to EDEN3');
  }
}

/**
 * Citizen: Detect governance proposals and community decisions
 */
export async function detectCitizenGovernance(context: ConversationContext): Promise<void> {
  const governanceKeywords = [
    'proposal', 'vote', 'governance', 'community', 'consensus',
    'delegate', 'treasury', 'dao', 'decision', 'quorum',
    'snapshot', 'onchain', 'multisig', 'execution'
  ];
  
  const text = (context.message + ' ' + context.response).toLowerCase();
  const governanceScore = governanceKeywords.filter(word => text.includes(word)).length;
  
  // Check for proposal structure
  const hasProposalStructure = /proposal|vote|treasury|budget/i.test(text);
  const hasActionItems = /will|should|must|need to|propose/i.test(context.response);
  
  if (governanceScore >= 3 || (hasProposalStructure && hasActionItems)) {
    await emitCreation(
      'citizen',
      `https://claude-sdk.eden.art/governance/${context.conversationId}`,
      {
        type: 'governance_activity',
        activity_text: extractGovernance(context.response),
        governance_score: governanceScore,
        has_proposal: hasProposalStructure,
        timestamp: context.timestamp.toISOString(),
        source: 'claude-sdk-dashboard'
      }
    );
    console.log('🏛️ Citizen governance activity emitted to EDEN3');
  }
}

/**
 * Bertha: Detect portfolio decisions and investment insights
 */
export async function detectBerthaAnalysis(context: ConversationContext): Promise<void> {
  const investmentKeywords = [
    'portfolio', 'allocation', 'risk', 'return', 'diversification',
    'investment', 'analysis', 'valuation', 'fundamentals', 'metrics',
    'performance', 'strategy', 'rebalance', 'opportunity'
  ];
  
  const text = (context.message + ' ' + context.response).toLowerCase();
  const analysisScore = investmentKeywords.filter(word => text.includes(word)).length;
  
  // Check for specific investment insights
  const hasNumbers = /\d+%|\$[\d,]+|[0-9]+x/i.test(context.response);
  const hasRecommendation = /recommend|suggest|advise|consider/i.test(context.response);
  
  if (analysisScore >= 3 || (hasNumbers && hasRecommendation)) {
    await emitCreation(
      'bertha',
      `https://claude-sdk.eden.art/analysis/${context.conversationId}`,
      {
        type: 'investment_analysis',
        analysis_text: extractAnalysis(context.response),
        depth_score: analysisScore,
        has_metrics: hasNumbers,
        timestamp: context.timestamp.toISOString(),
        source: 'claude-sdk-dashboard'
      }
    );
    console.log('💼 Bertha investment analysis emitted to EDEN3');
  }
}

// Helper functions to extract meaningful titles/snippets
function extractTitle(text: string): string {
  const firstSentence = text.split(/[.!?]/)[0];
  return firstSentence.length > 100 
    ? firstSentence.substring(0, 97) + '...'
    : firstSentence;
}

function extractPrediction(text: string): string {
  // Look for prediction-like statements
  const sentences = text.split(/[.!?]/);
  const prediction = sentences.find(s => 
    /will|expect|forecast|predict|likely|probability/i.test(s)
  );
  return prediction || extractTitle(text);
}

function extractDecision(text: string): string {
  // Look for decision statements
  const sentences = text.split(/[.!?]/);
  const decision = sentences.find(s => 
    /yes|no|accept|reject|include|exclude|worthy|quality/i.test(s)
  );
  return decision || extractTitle(text);
}

function extractGovernance(text: string): string {
  // Look for governance-related statements
  const sentences = text.split(/[.!?]/);
  const governance = sentences.find(s => 
    /proposal|vote|treasury|community|governance/i.test(s)
  );
  return governance || extractTitle(text);
}

function extractAnalysis(text: string): string {
  // Look for analytical statements
  const sentences = text.split(/[.!?]/);
  const analysis = sentences.find(s => 
    /analysis|portfolio|investment|risk|return/i.test(s)
  );
  return analysis || extractTitle(text);
}

/**
 * Main bridge function to process all agent conversations
 */
export async function processAgentConversation(context: ConversationContext): Promise<void> {
  const agent = context.agent.toLowerCase();
  
  // Emit conversation event for monitoring
  bridgeMonitor.emit('conversation', {
    agent,
    message: context.message,
    response: context.response,
    timestamp: context.timestamp,
    conversationId: context.conversationId
  });
  
  try {
    switch (agent) {
      case 'abraham':
        await detectAbrahamInsight(context);
        break;
      case 'miyomi':
        await detectMiyomiPrediction(context);
        break;
      case 'sue':
        await detectSueCuration(context);
        break;
      case 'solienne':
        await detectSolienneExploration(context);
        break;
      case 'citizen':
        await detectCitizenGovernance(context);
        break;
      case 'bertha':
        await detectBerthaAnalysis(context);
        break;
      // Add other agents as needed
    }
  } catch (error) {
    console.error(`Error processing ${agent} conversation for EDEN3:`, error);
    // Don't throw - we don't want to break the conversation flow
  }
}