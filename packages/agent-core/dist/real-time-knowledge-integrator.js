"use strict";
/**
 * Real-Time Knowledge Integrator
 * Feeds live data to agents for enhanced, current responses
 * Integrates with existing real-time systems and training data
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.realTimeKnowledge = exports.RealTimeKnowledgeIntegrator = void 0;
const miyomi_realtime_data_1 = require("./miyomi-realtime-data");
const citizen_market_data_1 = require("./citizen-market-data");
const training_data_loader_1 = require("./training-data-loader");
class RealTimeKnowledgeIntegrator {
    constructor() {
        this.activeStreams = new Map();
        this.knowledgeCache = new Map();
        this.updateIntervals = new Map();
        // Real-time data sources
        this.dataSources = {
            market: miyomi_realtime_data_1.miyomiRealTimeData,
            citizen: new citizen_market_data_1.CitizenMarketData()
        };
        this.citizenMarketData = new citizen_market_data_1.CitizenMarketData();
        this.initializeDefaultStreams();
    }
    /**
     * Initialize default knowledge streams for each agent
     */
    initializeDefaultStreams() {
        const agentStreamConfigs = [
            {
                agentId: 'abraham',
                streams: [
                    { type: 'creative', frequency: 300 }, // 5 min - art world news
                    { type: 'social', frequency: 600 } // 10 min - cultural trends
                ]
            },
            {
                agentId: 'bertha',
                streams: [
                    { type: 'market', frequency: 60 }, // 1 min - market data
                    { type: 'social', frequency: 300 } // 5 min - collector sentiment
                ]
            },
            {
                agentId: 'miyomi',
                streams: [
                    { type: 'market', frequency: 30 }, // 30 sec - live market
                    { type: 'social', frequency: 120 } // 2 min - trending topics
                ]
            },
            {
                agentId: 'citizen',
                streams: [
                    { type: 'governance', frequency: 180 }, // 3 min - governance data
                    { type: 'market', frequency: 120 } // 2 min - NFT market data
                ]
            }
        ];
        agentStreamConfigs.forEach(config => {
            config.streams.forEach(stream => {
                this.createKnowledgeStream(config.agentId, stream.type, stream.frequency);
            });
        });
    }
    /**
     * Create and start a knowledge stream for an agent
     */
    createKnowledgeStream(agentId, streamType, updateFrequency) {
        const streamKey = `${agentId}_${streamType}`;
        const stream = {
            agentId,
            streamType,
            isActive: false,
            updateFrequency,
            lastFetch: new Date().toISOString(),
            errorCount: 0,
            dataPoints: []
        };
        this.activeStreams.set(streamKey, stream);
        this.startStream(streamKey);
        return stream;
    }
    /**
     * Start a knowledge stream
     */
    startStream(streamKey) {
        const stream = this.activeStreams.get(streamKey);
        if (!stream)
            return;
        // Clear existing interval
        const existingInterval = this.updateIntervals.get(streamKey);
        if (existingInterval) {
            clearInterval(existingInterval);
        }
        // Start new interval
        const interval = setInterval(async () => {
            try {
                await this.fetchStreamUpdate(streamKey);
                stream.errorCount = 0; // Reset on success
            }
            catch (error) {
                stream.errorCount++;
                console.error(`Error updating stream ${streamKey}:`, error);
                // Stop stream if too many errors
                if (stream.errorCount > 5) {
                    this.stopStream(streamKey);
                }
            }
        }, stream.updateFrequency * 1000);
        this.updateIntervals.set(streamKey, interval);
        stream.isActive = true;
        console.log(`Started knowledge stream: ${streamKey} (${stream.updateFrequency}s frequency)`);
    }
    /**
     * Fetch update for a specific stream
     */
    async fetchStreamUpdate(streamKey) {
        const stream = this.activeStreams.get(streamKey);
        if (!stream)
            return;
        let updates = [];
        switch (stream.streamType) {
            case 'market':
                updates = await this.fetchMarketUpdates(stream.agentId);
                break;
            case 'social':
                updates = await this.fetchSocialUpdates(stream.agentId);
                break;
            case 'creative':
                updates = await this.fetchCreativeUpdates(stream.agentId);
                break;
            case 'governance':
                updates = await this.fetchGovernanceUpdates(stream.agentId);
                break;
        }
        // Add updates to stream
        updates.forEach(update => {
            stream.dataPoints.push(update);
            // Keep only recent updates (last 100)
            if (stream.dataPoints.length > 100) {
                stream.dataPoints = stream.dataPoints.slice(-100);
            }
        });
        stream.lastFetch = new Date().toISOString();
        // Update agent knowledge context
        await this.updateAgentKnowledge(stream.agentId, updates);
    }
    /**
     * Fetch market-related updates
     */
    async fetchMarketUpdates(agentId) {
        const updates = [];
        try {
            // Get real-time market context
            const marketContext = await this.dataSources.market.getRealTimeContext();
            // Convert to knowledge updates
            marketContext.marketData.forEach(data => {
                updates.push({
                    agent: agentId,
                    domain: 'market',
                    updateType: 'price',
                    data: {
                        symbol: data.symbol,
                        price: data.price,
                        change: data.change,
                        changePercent: data.changePercent,
                        sentiment: data.sentiment,
                        volatility: data.volatility
                    },
                    timestamp: data.timestamp,
                    confidence: 0.9,
                    source: 'yahoo_finance'
                });
            });
            // Add news updates
            marketContext.news.slice(0, 3).forEach(news => {
                updates.push({
                    agent: agentId,
                    domain: 'market',
                    updateType: 'news',
                    data: {
                        title: news.title,
                        summary: news.summary,
                        sentiment: news.sentiment,
                        impact: news.impact,
                        categories: news.categories
                    },
                    timestamp: news.publishedAt,
                    confidence: news.relevance,
                    source: news.source
                });
            });
            // Add trending topics for market-relevant agents
            if (['bertha', 'miyomi', 'citizen'].includes(agentId)) {
                marketContext.trending.slice(0, 2).forEach(trend => {
                    updates.push({
                        agent: agentId,
                        domain: 'social',
                        updateType: 'trend',
                        data: {
                            topic: trend.topic,
                            sector: trend.sector,
                            momentum: trend.momentum,
                            sentiment: trend.sentiment,
                            keywords: trend.keywords
                        },
                        timestamp: new Date().toISOString(),
                        confidence: trend.momentum / 100,
                        source: 'social_trends'
                    });
                });
            }
        }
        catch (error) {
            console.error('Error fetching market updates:', error);
        }
        return updates;
    }
    /**
     * Fetch social sentiment updates
     */
    async fetchSocialUpdates(agentId) {
        const updates = [];
        try {
            // Get market context for social sentiment
            const context = await this.dataSources.market.getRealTimeContext();
            updates.push({
                agent: agentId,
                domain: 'social',
                updateType: 'sentiment',
                data: {
                    marketSentiment: context.marketSentiment,
                    socialSentiment: context.socialSentiment,
                    fearGreedIndex: context.marketSentiment.cryptoFearGreedIndex
                },
                timestamp: new Date().toISOString(),
                confidence: 0.8,
                source: 'social_aggregation'
            });
        }
        catch (error) {
            console.error('Error fetching social updates:', error);
        }
        return updates;
    }
    /**
     * Fetch creative domain updates (for Abraham)
     */
    async fetchCreativeUpdates(agentId) {
        const updates = [];
        if (agentId === 'abraham') {
            try {
                // Art world news and creative trends
                updates.push({
                    agent: agentId,
                    domain: 'art',
                    updateType: 'trend',
                    data: {
                        trend: 'AI art gaining institutional recognition',
                        context: 'Major museums incorporating generative art',
                        relevance: 'High for covenant work',
                        inspiration: 'Continue exploring consciousness themes'
                    },
                    timestamp: new Date().toISOString(),
                    confidence: 0.85,
                    source: 'art_world_monitor'
                });
            }
            catch (error) {
                console.error('Error fetching creative updates:', error);
            }
        }
        return updates;
    }
    /**
     * Fetch governance updates (for Citizen)
     */
    async fetchGovernanceUpdates(agentId) {
        const updates = [];
        if (agentId === 'citizen') {
            try {
                // Governance and DAO activity
                const marketStats = await this.dataSources.citizen.getMarketSummary();
                updates.push({
                    agent: agentId,
                    domain: 'governance',
                    updateType: 'event',
                    data: {
                        marketHealth: marketStats?.marketHealth || { score: 75, trend: 'stable' },
                        totalVolume: marketStats?.totalVolume || 0,
                        recentActivity: marketStats?.recentActivity?.slice(0, 5) || []
                    },
                    timestamp: new Date().toISOString(),
                    confidence: 0.9,
                    source: 'citizen_market_monitor'
                });
            }
            catch (error) {
                console.error('Error fetching governance updates:', error);
            }
        }
        return updates;
    }
    /**
     * Update agent knowledge context with new real-time data
     */
    async updateAgentKnowledge(agentId, updates) {
        try {
            // Get or create agent context
            let context = this.knowledgeCache.get(agentId);
            if (!context) {
                const baseTrainingData = await (0, training_data_loader_1.loadTrainingData)(agentId);
                context = {
                    agent: agentId,
                    baseTrainingData,
                    realtimeUpdates: [],
                    synthesizedContext: null,
                    lastUpdate: new Date().toISOString(),
                    knowledgeFreshness: 0
                };
            }
            // Add new updates
            context.realtimeUpdates.push(...updates);
            // Keep only recent updates (last 200)
            if (context.realtimeUpdates.length > 200) {
                context.realtimeUpdates = context.realtimeUpdates.slice(-200);
            }
            // Synthesize knowledge
            context.synthesizedContext = this.synthesizeKnowledge(context);
            context.lastUpdate = new Date().toISOString();
            context.knowledgeFreshness = this.calculateFreshness(context.realtimeUpdates);
            // Update cache
            this.knowledgeCache.set(agentId, context);
        }
        catch (error) {
            console.error(`Error updating knowledge for ${agentId}:`, error);
        }
    }
    /**
     * Synthesize training data with real-time updates
     */
    synthesizeKnowledge(context) {
        const synthesis = {
            agent: context.agent,
            baseKnowledge: context.baseTrainingData ? 'loaded' : 'not_loaded',
            currentMarketConditions: {},
            recentTrends: [],
            sentimentAnalysis: {},
            relevantEvents: [],
            lastUpdate: context.lastUpdate
        };
        // Group updates by type
        const updatesByType = context.realtimeUpdates.reduce((groups, update) => {
            if (!groups[update.updateType])
                groups[update.updateType] = [];
            groups[update.updateType].push(update);
            return groups;
        }, {});
        // Synthesize market conditions
        if (updatesByType.price) {
            const recentPrices = updatesByType.price.slice(-10);
            synthesis.currentMarketConditions = {
                overview: `${recentPrices.length} assets tracked`,
                sentiment: this.calculateOverallSentiment(recentPrices),
                volatility: this.calculateAverageVolatility(recentPrices),
                lastUpdate: recentPrices[recentPrices.length - 1]?.timestamp
            };
        }
        // Synthesize trends
        if (updatesByType.trend) {
            synthesis.recentTrends = updatesByType.trend.slice(-5).map(update => ({
                topic: update.data.topic,
                momentum: update.data.momentum,
                relevance: update.confidence,
                timestamp: update.timestamp
            }));
        }
        // Synthesize sentiment
        if (updatesByType.sentiment) {
            const latestSentiment = updatesByType.sentiment[updatesByType.sentiment.length - 1];
            synthesis.sentimentAnalysis = latestSentiment?.data || {};
        }
        // Synthesize events
        if (updatesByType.news || updatesByType.event) {
            synthesis.relevantEvents = [
                ...(updatesByType.news || []).slice(-3),
                ...(updatesByType.event || []).slice(-2)
            ].map(update => ({
                type: update.updateType,
                title: update.data.title || update.data.trend || 'Market Event',
                impact: update.data.impact || 'medium',
                confidence: update.confidence,
                timestamp: update.timestamp
            }));
        }
        return synthesis;
    }
    /**
     * Get real-time enhanced context for an agent
     */
    async getRealTimeContext(agentId, query) {
        const context = this.knowledgeCache.get(agentId);
        if (!context) {
            console.warn(`No real-time context available for ${agentId}`);
            return null;
        }
        let enhancedContext = context.synthesizedContext;
        // If query provided, get enhanced context from training data too
        if (query) {
            try {
                const trainingContext = await (0, training_data_loader_1.getEnhancedResponseContext)(agentId, query);
                enhancedContext = {
                    ...enhancedContext,
                    training_context: trainingContext,
                    knowledge_fusion: {
                        base_training: trainingContext ? 'available' : 'not_available',
                        real_time_data: context.realtimeUpdates.length,
                        freshness_score: context.knowledgeFreshness,
                        last_update: context.lastUpdate
                    }
                };
            }
            catch (error) {
                console.error('Error getting training context:', error);
            }
        }
        return enhancedContext;
    }
    /**
     * Stop a knowledge stream
     */
    stopStream(streamKey) {
        const interval = this.updateIntervals.get(streamKey);
        if (interval) {
            clearInterval(interval);
            this.updateIntervals.delete(streamKey);
        }
        const stream = this.activeStreams.get(streamKey);
        if (stream) {
            stream.isActive = false;
            console.log(`Stopped knowledge stream: ${streamKey}`);
        }
    }
    /**
     * Get knowledge stream status
     */
    getStreamStatus(agentId) {
        if (agentId) {
            const agentStreams = Array.from(this.activeStreams.entries())
                .filter(([key]) => key.startsWith(agentId));
            return {
                agent: agentId,
                streams: agentStreams.map(([key, stream]) => ({
                    key,
                    type: stream.streamType,
                    active: stream.isActive,
                    frequency: stream.updateFrequency,
                    lastFetch: stream.lastFetch,
                    dataPoints: stream.dataPoints.length,
                    errors: stream.errorCount
                }))
            };
        }
        return {
            totalStreams: this.activeStreams.size,
            activeStreams: Array.from(this.activeStreams.values()).filter(s => s.isActive).length,
            cachedAgents: this.knowledgeCache.size,
            streams: Array.from(this.activeStreams.entries()).map(([key, stream]) => ({
                key,
                agent: stream.agentId,
                type: stream.streamType,
                active: stream.isActive,
                frequency: stream.updateFrequency,
                dataPoints: stream.dataPoints.length
            }))
        };
    }
    // Helper methods
    calculateOverallSentiment(updates) {
        const sentiments = updates.map(u => u.data.sentiment);
        const bullish = sentiments.filter(s => s === 'bullish' || s === 'positive').length;
        const bearish = sentiments.filter(s => s === 'bearish' || s === 'negative').length;
        if (bullish > bearish)
            return 'bullish';
        if (bearish > bullish)
            return 'bearish';
        return 'neutral';
    }
    calculateAverageVolatility(updates) {
        const volatilities = updates
            .map(u => u.data.volatility)
            .filter(v => typeof v === 'number');
        if (volatilities.length === 0)
            return 0;
        return volatilities.reduce((a, b) => a + b, 0) / volatilities.length;
    }
    calculateFreshness(updates) {
        if (updates.length === 0)
            return 0;
        const now = new Date().getTime();
        const avgAge = updates.reduce((sum, update) => {
            const updateTime = new Date(update.timestamp).getTime();
            return sum + (now - updateTime);
        }, 0) / updates.length;
        // Convert to freshness score (0-1, with 1 being very fresh)
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours in ms
        return Math.max(0, 1 - (avgAge / maxAge));
    }
    /**
     * Cleanup - stop all streams
     */
    shutdown() {
        this.updateIntervals.forEach((interval, key) => {
            clearInterval(interval);
            console.log(`Stopped stream: ${key}`);
        });
        this.updateIntervals.clear();
        this.activeStreams.clear();
        this.knowledgeCache.clear();
        console.log('Real-time knowledge integrator shut down');
    }
}
exports.RealTimeKnowledgeIntegrator = RealTimeKnowledgeIntegrator;
// Export singleton instance
exports.realTimeKnowledge = new RealTimeKnowledgeIntegrator();
