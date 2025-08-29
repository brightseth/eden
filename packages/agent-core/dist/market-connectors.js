"use strict";
/**
 * Market Data Connectors for MIYOMI
 * Integrates with multiple prediction market platforms
 * Enhanced with real Kalshi and Polymarket APIs
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.marketAggregator = exports.MarketAggregator = exports.KalshiConnector = exports.PolymarketConnector = exports.MyriadConnector = exports.MeleeConnector = exports.ManifoldConnector = void 0;
class ManifoldConnector {
    constructor() {
        this.baseUrl = 'https://api.manifold.markets/v0';
    }
    async getMarkets(limit = 20) {
        try {
            const response = await fetch(`${this.baseUrl}/markets?limit=${limit}&sort=score`);
            if (!response.ok)
                throw new Error(`Manifold API error: ${response.status}`);
            const markets = await response.json();
            return markets.map(this.transformManifoldMarket);
        }
        catch (error) {
            console.error('Manifold connector error:', error);
            return [];
        }
    }
    async getMarket(id) {
        try {
            const response = await fetch(`${this.baseUrl}/market/${id}`);
            if (!response.ok)
                return null;
            const market = await response.json();
            return this.transformManifoldMarket(market);
        }
        catch (error) {
            console.error('Error fetching Manifold market:', error);
            return null;
        }
    }
    transformManifoldMarket(market) {
        return {
            id: market.id,
            question: market.question,
            platform: 'Manifold',
            yes_price: market.probability || 0.5,
            no_price: 1 - (market.probability || 0.5),
            volume: market.volume || 0,
            liquidity: market.liquidity || 0,
            end_date: market.closeTime,
            category: this.categorizeManifoldMarket(market.question),
            status: market.isResolved ? 'resolved' : 'open',
            resolution: market.resolution
        };
    }
    categorizeManifoldMarket(question) {
        const q = question.toLowerCase();
        if (q.includes('election') || q.includes('trump') || q.includes('biden') || q.includes('politics'))
            return 'politics';
        if (q.includes('nfl') || q.includes('nba') || q.includes('sports') || q.includes('super bowl'))
            return 'sports';
        if (q.includes('crypto') || q.includes('bitcoin') || q.includes('stock') || q.includes('fed'))
            return 'finance';
        if (q.includes('ai') || q.includes('artificial intelligence') || q.includes('gpt'))
            return 'ai';
        if (q.includes('taylor swift') || q.includes('celebrity') || q.includes('movie'))
            return 'pop';
        return 'internet';
    }
}
exports.ManifoldConnector = ManifoldConnector;
class MeleeConnector {
    constructor(apiKey) {
        this.baseUrl = 'https://api.melee.gg/v1';
        this.apiKey = apiKey || process.env.MELEE_API_KEY || '';
    }
    async getMarkets(limit = 20) {
        if (!this.apiKey) {
            console.warn('Melee API key not configured');
            return [];
        }
        try {
            const response = await fetch(`${this.baseUrl}/markets?limit=${limit}`, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok)
                throw new Error(`Melee API error: ${response.status}`);
            const data = await response.json();
            return data.markets?.map(this.transformMeleeMarket) || [];
        }
        catch (error) {
            console.error('Melee connector error:', error);
            return [];
        }
    }
    transformMeleeMarket(market) {
        return {
            id: market.id,
            question: market.title,
            platform: 'Melee',
            yes_price: market.yes_price || 0.5,
            no_price: market.no_price || 0.5,
            volume: market.volume_24h || 0,
            liquidity: market.liquidity || 0,
            end_date: market.end_time,
            category: 'sports', // Melee focuses on esports/gaming
            status: market.status,
            resolution: market.outcome
        };
    }
}
exports.MeleeConnector = MeleeConnector;
class MyriadConnector {
    constructor() {
        this.baseUrl = 'https://api.myriad.social/v1';
    }
    async getMarkets(limit = 20) {
        try {
            // Myriad uses a different API structure - social prediction markets
            const response = await fetch(`${this.baseUrl}/predictions?limit=${limit}&type=market`);
            if (!response.ok)
                throw new Error(`Myriad API error: ${response.status}`);
            const predictions = await response.json();
            return predictions.data?.map(this.transformMyriadMarket) || [];
        }
        catch (error) {
            console.error('Myriad connector error:', error);
            return [];
        }
    }
    transformMyriadMarket(prediction) {
        return {
            id: prediction.id,
            question: prediction.question,
            platform: 'Myriad',
            yes_price: prediction.consensus?.yes || 0.5,
            no_price: prediction.consensus?.no || 0.5,
            volume: prediction.participation_count || 0,
            liquidity: 0, // Not applicable to social predictions
            end_date: prediction.deadline,
            category: this.categorizeMyriadPrediction(prediction.tags),
            status: prediction.status === 'resolved' ? 'resolved' : 'open',
            resolution: prediction.outcome
        };
    }
    categorizeMyriadPrediction(tags) {
        if (!tags)
            return 'internet';
        const tagString = tags.join(' ').toLowerCase();
        if (tagString.includes('politic'))
            return 'politics';
        if (tagString.includes('sport'))
            return 'sports';
        if (tagString.includes('crypto') || tagString.includes('finance'))
            return 'finance';
        if (tagString.includes('ai') || tagString.includes('tech'))
            return 'ai';
        if (tagString.includes('pop') || tagString.includes('celebrity'))
            return 'pop';
        if (tagString.includes('geo') || tagString.includes('world'))
            return 'geo';
        return 'internet';
    }
}
exports.MyriadConnector = MyriadConnector;
// Existing Polymarket and Kalshi connectors (referenced from update-results route)
class PolymarketConnector {
    constructor() {
        this.baseUrl = 'https://gamma-api.polymarket.com';
        this.transformPolymarketMarket = (market) => {
            return {
                id: market.id,
                question: market.question,
                platform: 'Polymarket',
                yes_price: parseFloat(market.outcomePrices?.[0] || '0.5'),
                no_price: parseFloat(market.outcomePrices?.[1] || '0.5'),
                volume: market.volume || 0,
                liquidity: market.liquidity || 0,
                end_date: market.endDate,
                category: this.categorizePolymarketMarket(market.question),
                status: market.closed ? 'closed' : 'open',
                resolution: market.outcome
            };
        };
    }
    async getMarkets(limit = 20) {
        try {
            const response = await fetch(`${this.baseUrl}/markets?limit=${limit}&active=true`);
            if (!response.ok)
                throw new Error(`Polymarket API error: ${response.status}`);
            const markets = await response.json();
            return markets.map(this.transformPolymarketMarket);
        }
        catch (error) {
            console.error('Polymarket connector error:', error);
            return [];
        }
    }
    categorizePolymarketMarket(question) {
        const q = question.toLowerCase();
        if (q.includes('election') || q.includes('trump') || q.includes('politics'))
            return 'politics';
        if (q.includes('crypto') || q.includes('bitcoin') || q.includes('ethereum'))
            return 'finance';
        if (q.includes('ai') || q.includes('chatgpt'))
            return 'ai';
        return 'internet';
    }
}
exports.PolymarketConnector = PolymarketConnector;
class KalshiConnector {
    constructor(apiKey) {
        this.baseUrl = 'https://trading-api.kalshi.com/trade-api/v2';
        this.apiKey = apiKey || process.env.KALSHI_API_KEY || '';
    }
    async getMarkets(limit = 20) {
        if (!this.apiKey) {
            console.warn('Kalshi API key not configured');
            return [];
        }
        try {
            const response = await fetch(`${this.baseUrl}/markets?limit=${limit}&status=open`, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`
                }
            });
            if (!response.ok)
                throw new Error(`Kalshi API error: ${response.status}`);
            const data = await response.json();
            return data.markets?.map(this.transformKalshiMarket) || [];
        }
        catch (error) {
            console.error('Kalshi connector error:', error);
            return [];
        }
    }
    transformKalshiMarket(market) {
        return {
            id: market.ticker,
            question: market.title,
            platform: 'Kalshi',
            yes_price: market.yes_bid || 0.5,
            no_price: market.no_bid || 0.5,
            volume: market.volume || 0,
            liquidity: market.open_interest || 0,
            end_date: market.close_time,
            category: this.categorizeKalshiMarket(market.title),
            status: market.status,
            resolution: market.result
        };
    }
    categorizeKalshiMarket(title) {
        const t = title.toLowerCase();
        if (t.includes('fed') || t.includes('interest') || t.includes('inflation'))
            return 'finance';
        if (t.includes('election') || t.includes('congress') || t.includes('president'))
            return 'politics';
        if (t.includes('weather') || t.includes('hurricane') || t.includes('climate'))
            return 'geo';
        return 'finance'; // Kalshi default
    }
}
exports.KalshiConnector = KalshiConnector;
// Aggregator class to fetch from all platforms
class MarketAggregator {
    constructor() {
        this.manifold = new ManifoldConnector();
        this.melee = new MeleeConnector();
        this.myriad = new MyriadConnector();
        this.polymarket = new PolymarketConnector();
        this.kalshi = new KalshiConnector();
    }
    async getAllMarkets(limit = 100) {
        console.log('Fetching markets from all platforms...');
        // Fetch markets from available platforms with error handling
        const marketPromises = [
            this.manifold.getMarkets(limit / 5).catch(err => {
                console.warn('Manifold unavailable:', err.message);
                return [];
            }),
            this.melee.getMarkets(limit / 5).catch(err => {
                console.warn('Melee unavailable:', err.message);
                return [];
            }),
            this.myriad.getMarkets(limit / 5).catch(err => {
                console.warn('Myriad unavailable:', err.message);
                return [];
            }),
            this.polymarket.getMarkets(limit / 5).catch(err => {
                console.warn('Polymarket unavailable:', err.message);
                return [];
            }),
            this.kalshi.getMarkets(limit / 5).catch(err => {
                console.warn('Kalshi unavailable:', err.message);
                return [];
            })
        ];
        const [manifoldMarkets, meleeMarkets, myriadMarkets, polymarketMarkets, kalshiMarkets] = await Promise.all(marketPromises);
        const allMarkets = [
            ...manifoldMarkets,
            ...meleeMarkets,
            ...myriadMarkets,
            ...polymarketMarkets,
            ...kalshiMarkets
        ];
        console.log(`Found ${allMarkets.length} markets across all platforms`);
        // If no markets available, return mock data for testing
        if (allMarkets.length === 0) {
            console.log('No live markets available, using mock data for testing');
            return this.getMockMarkets(limit);
        }
        // Sort by volume/liquidity to prioritize active markets
        return allMarkets
            .filter(market => market.status === 'open')
            .sort((a, b) => (b.volume + b.liquidity) - (a.volume + a.liquidity))
            .slice(0, limit);
    }
    getMockMarkets(limit) {
        return [
            {
                id: 'mock_fed_rates_2025',
                question: 'Will the Fed cut rates by March 2025?',
                platform: 'Kalshi',
                yes_price: 0.73,
                no_price: 0.27,
                volume: 125000,
                liquidity: 45000,
                end_date: '2025-03-31T00:00:00Z',
                category: 'finance',
                status: 'open'
            },
            {
                id: 'mock_election_2028',
                question: 'Will Trump run for president in 2028?',
                platform: 'Polymarket',
                yes_price: 0.45,
                no_price: 0.55,
                volume: 89000,
                liquidity: 32000,
                end_date: '2028-01-01T00:00:00Z',
                category: 'politics',
                status: 'open'
            },
            {
                id: 'mock_ai_breakthrough',
                question: 'Will AGI be achieved by end of 2025?',
                platform: 'Manifold',
                yes_price: 0.12,
                no_price: 0.88,
                volume: 67000,
                liquidity: 18000,
                end_date: '2025-12-31T23:59:59Z',
                category: 'ai',
                status: 'open'
            }
        ].slice(0, limit);
    }
    async getMarketsByCategory(category, limit = 20) {
        const allMarkets = await this.getAllMarkets(100);
        return allMarkets
            .filter(market => market.category === category)
            .slice(0, limit);
    }
}
exports.MarketAggregator = MarketAggregator;
exports.marketAggregator = new MarketAggregator();
