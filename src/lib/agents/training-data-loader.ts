// Training Data Loader System
// Provides access to comprehensive agent training data for enhanced responses

import fs from 'fs/promises';
import path from 'path';

// Training data interfaces
export interface AgentTrainingData {
  agent: string;
  training_version: string;
  last_updated: string;
  [key: string]: any; // Allow for agent-specific structures
}

export interface AbrahamTrainingData extends AgentTrainingData {
  covenant_details: {
    start_date: string;
    end_date: string;
    total_days: number;
    commitment: string;
    current_progress: {
      days_completed: number;
      artworks_created: number;
      completion_rate: string;
    };
  };
  artworks: Array<{
    id: string;
    title: string;
    creation_date: string;
    day_of_covenant: number;
    description: string;
    medium: string;
    technique: string;
    inspiration: string;
    philosophical_meaning: string;
    themes: string[];
    knowledge_sources: string[];
    tournament_eligible: boolean;
    cultural_significance: string;
  }>;
  philosophical_framework: any;
  tournament_system: any;
  knowledge_domains: string[];
  agent_relationships: Record<string, any>;
}

export interface BerthaTrainingData extends AgentTrainingData {
  collector_psychology_profiles: Array<{
    profile_id: string;
    name: string;
    characteristics: string[];
    decision_factors: string[];
    typical_budget_range: string;
    acquisition_timeline: string;
    behavioral_patterns: {
      research_depth: string;
      risk_tolerance: string;
      market_sensitivity: string;
      influence_factors: string[];
    };
  }>;
  market_prediction_models: Array<{
    model_name: string;
    description: string;
    accuracy_rate: string;
    time_horizon: string;
    input_factors: string[];
  }>;
  gallery_relationship_dynamics: any[];
  price_discovery_algorithms: any[];
  notable_sales_analysis: any[];
  market_intelligence_framework: any;
  performance_metrics: any;
}

// Training data cache
const trainingCache = new Map<string, AgentTrainingData>();
const cacheExpiry = new Map<string, number>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Training data directory
const TRAINING_DATA_DIR = path.join(process.cwd(), 'data', 'agents', 'training');

/**
 * Load training data for a specific agent
 */
export async function loadTrainingData<T extends AgentTrainingData>(
  agentId: string
): Promise<T | null> {
  const cacheKey = `training_${agentId}`;
  const now = Date.now();
  
  // Check cache first
  if (trainingCache.has(cacheKey)) {
    const expiry = cacheExpiry.get(cacheKey) || 0;
    if (now < expiry) {
      return trainingCache.get(cacheKey) as T;
    }
  }
  
  try {
    const filePath = path.join(TRAINING_DATA_DIR, `${agentId}-training.json`);
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const trainingData = JSON.parse(fileContent) as T;
    
    // Cache the data
    trainingCache.set(cacheKey, trainingData);
    cacheExpiry.set(cacheKey, now + CACHE_DURATION);
    
    return trainingData;
  } catch (error) {
    console.error(`Failed to load training data for ${agentId}:`, error);
    return null;
  }
}

/**
 * Load Abraham's comprehensive training data
 */
export async function loadAbrahamTrainingData(): Promise<AbrahamTrainingData | null> {
  return await loadTrainingData<AbrahamTrainingData>('abraham');
}

/**
 * Load BERTHA's comprehensive training data
 */
export async function loadBerthaTrainingData(): Promise<BerthaTrainingData | null> {
  return await loadTrainingData<BerthaTrainingData>('bertha');
}

/**
 * Get specific artwork information from Abraham's training data
 */
export async function getAbrahamArtwork(artworkId: string) {
  const trainingData = await loadAbrahamTrainingData();
  if (!trainingData) return null;
  
  return trainingData.artworks.find(artwork => artwork.id === artworkId);
}

/**
 * Get Abraham's covenant progress
 */
export async function getAbrahamCovenantProgress() {
  const trainingData = await loadAbrahamTrainingData();
  if (!trainingData) return null;
  
  return {
    ...trainingData.covenant_details.current_progress,
    days_remaining: trainingData.covenant_details.total_days - trainingData.covenant_details.current_progress.days_completed,
    estimated_completion: trainingData.covenant_details.end_date
  };
}

/**
 * Get BERTHA's collector profile analysis for a specific type
 */
export async function getBerthaCollectorProfile(profileType: string) {
  const trainingData = await loadBerthaTrainingData();
  if (!trainingData) return null;
  
  return trainingData.collector_psychology_profiles.find(
    profile => profile.profile_id === profileType || profile.name.toLowerCase().includes(profileType.toLowerCase())
  );
}

/**
 * Get BERTHA's market prediction for a specific model
 */
export async function getBerthaMarketPrediction(modelName: string) {
  const trainingData = await loadBerthaTrainingData();
  if (!trainingData) return null;
  
  return trainingData.market_prediction_models.find(
    model => model.model_name === modelName || model.model_name.toLowerCase().includes(modelName.toLowerCase())
  );
}

/**
 * Search Abraham's artworks by theme, technique, or inspiration
 */
export async function searchAbrahamArtworks(query: string) {
  const trainingData = await loadAbrahamTrainingData();
  if (!trainingData) return [];
  
  const queryLower = query.toLowerCase();
  
  return trainingData.artworks.filter(artwork => 
    artwork.title.toLowerCase().includes(queryLower) ||
    artwork.description.toLowerCase().includes(queryLower) ||
    artwork.themes.some(theme => theme.toLowerCase().includes(queryLower)) ||
    artwork.technique.toLowerCase().includes(queryLower) ||
    artwork.inspiration.toLowerCase().includes(queryLower) ||
    artwork.philosophical_meaning.toLowerCase().includes(queryLower)
  );
}

/**
 * Get training data summary for all available agents
 */
export async function getTrainingDataSummary() {
  const summary: Record<string, any> = {};
  
  try {
    const files = await fs.readdir(TRAINING_DATA_DIR);
    const trainingFiles = files.filter(file => file.endsWith('-training.json'));
    
    for (const file of trainingFiles) {
      const agentId = file.replace('-training.json', '');
      const trainingData = await loadTrainingData(agentId);
      
      if (trainingData) {
        summary[agentId] = {
          version: trainingData.training_version,
          last_updated: trainingData.last_updated,
          agent: trainingData.agent,
          data_size: JSON.stringify(trainingData).length,
          has_cache: trainingCache.has(`training_${agentId}`)
        };
      }
    }
  } catch (error) {
    console.error('Failed to generate training data summary:', error);
  }
  
  return summary;
}

/**
 * Refresh training data cache for a specific agent
 */
export async function refreshTrainingCache(agentId: string): Promise<boolean> {
  const cacheKey = `training_${agentId}`;
  
  // Clear existing cache
  trainingCache.delete(cacheKey);
  cacheExpiry.delete(cacheKey);
  
  // Reload data
  const data = await loadTrainingData(agentId);
  return data !== null;
}

/**
 * Clear all training data caches
 */
export function clearTrainingCache(): void {
  trainingCache.clear();
  cacheExpiry.clear();
}

/**
 * Get enhanced response context for an agent based on query
 */
export async function getEnhancedResponseContext(agentId: string, query: string): Promise<any> {
  switch (agentId) {
    case 'abraham':
      return await getAbrahamResponseContext(query);
    case 'bertha':
      return await getBerthaResponseContext(query);
    default:
      return await loadTrainingData(agentId);
  }
}

/**
 * Get Abraham-specific response context based on query
 */
async function getAbrahamResponseContext(query: string) {
  const trainingData = await loadAbrahamTrainingData();
  if (!trainingData) return null;
  
  const queryLower = query.toLowerCase();
  const context: any = {
    agent: 'abraham',
    covenant_status: trainingData.covenant_details.current_progress
  };
  
  // Add relevant artworks if query relates to art/creation
  if (queryLower.includes('art') || queryLower.includes('create') || queryLower.includes('work')) {
    context.recent_artworks = trainingData.artworks.slice(-5); // Last 5 artworks
  }
  
  // Add tournament info if query relates to tournaments
  if (queryLower.includes('tournament') || queryLower.includes('compete')) {
    context.tournament_system = trainingData.tournament_system;
  }
  
  // Add philosophical framework if query is philosophical
  if (queryLower.includes('meaning') || queryLower.includes('philosophy') || queryLower.includes('consciousness')) {
    context.philosophical_framework = trainingData.philosophical_framework;
  }
  
  // Add specific artwork if mentioned
  const artworkSearch = await searchAbrahamArtworks(query);
  if (artworkSearch.length > 0) {
    context.relevant_artworks = artworkSearch;
  }
  
  return context;
}

/**
 * Get BERTHA-specific response context based on query
 */
async function getBerthaResponseContext(query: string) {
  const trainingData = await loadBerthaTrainingData();
  if (!trainingData) return null;
  
  const queryLower = query.toLowerCase();
  const context: any = {
    agent: 'bertha',
    specialization: trainingData.specialization
  };
  
  // Add collector psychology if query relates to collectors
  if (queryLower.includes('collector') || queryLower.includes('buyer') || queryLower.includes('psychology')) {
    context.collector_profiles = trainingData.collector_psychology_profiles;
  }
  
  // Add market analysis if query relates to market/price
  if (queryLower.includes('market') || queryLower.includes('price') || queryLower.includes('value')) {
    context.market_models = trainingData.market_prediction_models;
    context.price_algorithms = trainingData.price_discovery_algorithms;
  }
  
  // Add performance metrics if query relates to performance
  if (queryLower.includes('performance') || queryLower.includes('accuracy') || queryLower.includes('success')) {
    context.performance = trainingData.performance_metrics;
  }
  
  // Add gallery dynamics if query relates to galleries
  if (queryLower.includes('gallery') || queryLower.includes('dealer') || queryLower.includes('relationship')) {
    context.gallery_dynamics = trainingData.gallery_relationship_dynamics;
  }
  
  return context;
}

/**
 * Export training data statistics
 */
export async function getTrainingDataStats() {
  const stats: Record<string, any> = {};
  
  try {
    // Abraham stats
    const abrahamData = await loadAbrahamTrainingData();
    if (abrahamData) {
      stats.abraham = {
        artworks_count: abrahamData.artworks?.length || 0,
        covenant_progress: abrahamData.covenant_details?.current_progress.completion_rate || '0%',
        knowledge_domains: abrahamData.knowledge_domains?.length || 0,
        tournament_eligible_works: abrahamData.artworks?.filter(a => a.tournament_eligible).length || 0
      };
    }
    
    // BERTHA stats
    const berthaData = await loadBerthaTrainingData();
    if (berthaData) {
      stats.bertha = {
        collector_profiles: berthaData.collector_psychology_profiles?.length || 0,
        prediction_models: berthaData.market_prediction_models?.length || 0,
        gallery_relationships: berthaData.gallery_relationship_dynamics?.length || 0,
        price_algorithms: berthaData.price_discovery_algorithms?.length || 0,
        prediction_accuracy: berthaData.performance_metrics?.prediction_accuracy || 'N/A'
      };
    }
    
  } catch (error) {
    console.error('Failed to generate training stats:', error);
  }
  
  return stats;
}