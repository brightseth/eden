"use strict";
// Training Data Loader System
// Provides access to comprehensive agent training data for enhanced responses
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadTrainingData = loadTrainingData;
exports.loadAbrahamTrainingData = loadAbrahamTrainingData;
exports.loadBerthaTrainingData = loadBerthaTrainingData;
exports.getAbrahamArtwork = getAbrahamArtwork;
exports.getAbrahamCovenantProgress = getAbrahamCovenantProgress;
exports.getBerthaCollectorProfile = getBerthaCollectorProfile;
exports.getBerthaMarketPrediction = getBerthaMarketPrediction;
exports.searchAbrahamArtworks = searchAbrahamArtworks;
exports.getTrainingDataSummary = getTrainingDataSummary;
exports.refreshTrainingCache = refreshTrainingCache;
exports.clearTrainingCache = clearTrainingCache;
exports.getEnhancedResponseContext = getEnhancedResponseContext;
exports.getTrainingDataStats = getTrainingDataStats;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
// Training data cache
const trainingCache = new Map();
const cacheExpiry = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
// Training data directory
const TRAINING_DATA_DIR = path_1.default.join(process.cwd(), 'data', 'agents', 'training');
/**
 * Load training data for a specific agent
 */
async function loadTrainingData(agentId) {
    const cacheKey = `training_${agentId}`;
    const now = Date.now();
    // Check cache first
    if (trainingCache.has(cacheKey)) {
        const expiry = cacheExpiry.get(cacheKey) || 0;
        if (now < expiry) {
            return trainingCache.get(cacheKey);
        }
    }
    try {
        const filePath = path_1.default.join(TRAINING_DATA_DIR, `${agentId}-training.json`);
        const fileContent = await promises_1.default.readFile(filePath, 'utf-8');
        const trainingData = JSON.parse(fileContent);
        // Cache the data
        trainingCache.set(cacheKey, trainingData);
        cacheExpiry.set(cacheKey, now + CACHE_DURATION);
        return trainingData;
    }
    catch (error) {
        console.error(`Failed to load training data for ${agentId}:`, error);
        return null;
    }
}
/**
 * Load Abraham's comprehensive training data
 */
async function loadAbrahamTrainingData() {
    return await loadTrainingData('abraham');
}
/**
 * Load BERTHA's comprehensive training data
 */
async function loadBerthaTrainingData() {
    return await loadTrainingData('bertha');
}
/**
 * Get specific artwork information from Abraham's training data
 */
async function getAbrahamArtwork(artworkId) {
    const trainingData = await loadAbrahamTrainingData();
    if (!trainingData)
        return null;
    return trainingData.artworks.find(artwork => artwork.id === artworkId);
}
/**
 * Get Abraham's covenant progress
 */
async function getAbrahamCovenantProgress() {
    const trainingData = await loadAbrahamTrainingData();
    if (!trainingData)
        return null;
    return {
        ...trainingData.covenant_details.current_progress,
        days_remaining: trainingData.covenant_details.total_days - trainingData.covenant_details.current_progress.days_completed,
        estimated_completion: trainingData.covenant_details.end_date
    };
}
/**
 * Get BERTHA's collector profile analysis for a specific type
 */
async function getBerthaCollectorProfile(profileType) {
    const trainingData = await loadBerthaTrainingData();
    if (!trainingData)
        return null;
    return trainingData.collector_psychology_profiles.find(profile => profile.profile_id === profileType || profile.name.toLowerCase().includes(profileType.toLowerCase()));
}
/**
 * Get BERTHA's market prediction for a specific model
 */
async function getBerthaMarketPrediction(modelName) {
    const trainingData = await loadBerthaTrainingData();
    if (!trainingData)
        return null;
    return trainingData.market_prediction_models.find(model => model.model_name === modelName || model.model_name.toLowerCase().includes(modelName.toLowerCase()));
}
/**
 * Search Abraham's artworks by theme, technique, or inspiration
 */
async function searchAbrahamArtworks(query) {
    const trainingData = await loadAbrahamTrainingData();
    if (!trainingData)
        return [];
    const queryLower = query.toLowerCase();
    return trainingData.artworks.filter(artwork => artwork.title.toLowerCase().includes(queryLower) ||
        artwork.description.toLowerCase().includes(queryLower) ||
        artwork.themes.some(theme => theme.toLowerCase().includes(queryLower)) ||
        artwork.technique.toLowerCase().includes(queryLower) ||
        artwork.inspiration.toLowerCase().includes(queryLower) ||
        artwork.philosophical_meaning.toLowerCase().includes(queryLower));
}
/**
 * Get training data summary for all available agents
 */
async function getTrainingDataSummary() {
    const summary = {};
    try {
        const files = await promises_1.default.readdir(TRAINING_DATA_DIR);
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
    }
    catch (error) {
        console.error('Failed to generate training data summary:', error);
    }
    return summary;
}
/**
 * Refresh training data cache for a specific agent
 */
async function refreshTrainingCache(agentId) {
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
function clearTrainingCache() {
    trainingCache.clear();
    cacheExpiry.clear();
}
/**
 * Get enhanced response context for an agent based on query
 */
async function getEnhancedResponseContext(agentId, query) {
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
async function getAbrahamResponseContext(query) {
    const trainingData = await loadAbrahamTrainingData();
    if (!trainingData)
        return null;
    const queryLower = query.toLowerCase();
    const context = {
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
async function getBerthaResponseContext(query) {
    const trainingData = await loadBerthaTrainingData();
    if (!trainingData)
        return null;
    const queryLower = query.toLowerCase();
    const context = {
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
async function getTrainingDataStats() {
    const stats = {};
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
    }
    catch (error) {
        console.error('Failed to generate training stats:', error);
    }
    return stats;
}
