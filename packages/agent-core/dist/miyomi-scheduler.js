"use strict";
/**
 * MIYOMI Automated Workflow Scheduler
 * Manages the full lifecycle from pick generation to deployment
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.miyomiScheduler = exports.MiyomiScheduler = void 0;
const miyomi_claude_sdk_1 = require("./miyomi-claude-sdk");
const node_cron_1 = __importDefault(require("node-cron"));
class MiyomiScheduler {
    constructor() {
        this.scheduledDrops = new Map();
        this.isRunning = false;
    }
    /**
     * Start the automated scheduler
     * MIYOMI drops at 11:00, 15:00, 21:00 ET daily
     */
    start() {
        if (this.isRunning) {
            console.log('MIYOMI scheduler already running');
            return;
        }
        this.isRunning = true;
        console.log('🚀 Starting MIYOMI automated scheduler...');
        // Schedule the three daily drops
        const dropTimes = [
            { time: '0 11 * * *', label: '11:00 AM ET' },
            { time: '0 15 * * *', label: '3:00 PM ET' },
            { time: '0 21 * * *', label: '9:00 PM ET' }
        ];
        dropTimes.forEach(({ time, label }) => {
            node_cron_1.default.schedule(time, async () => {
                console.log(`⏰ Scheduled drop triggered at ${label}`);
                await this.executeDailyWorkflow();
            }, {
                timezone: 'America/New_York'
            });
        });
        // Status check every 15 minutes
        node_cron_1.default.schedule('*/15 * * * *', async () => {
            await this.checkPendingDrops();
        });
        console.log('✓ MIYOMI scheduler started with 3 daily drops');
    }
    stop() {
        this.isRunning = false;
        console.log('🛑 MIYOMI scheduler stopped');
    }
    /**
     * Execute the full workflow for a daily drop
     */
    async executeDailyWorkflow() {
        const dropId = `drop_${Date.now()}`;
        try {
            console.log(`\n🎯 Starting daily workflow: ${dropId}`);
            // Initialize drop record
            const scheduledDrop = {
                id: dropId,
                scheduledFor: new Date().toISOString(),
                status: 'generating',
                picks: []
            };
            this.scheduledDrops.set(dropId, scheduledDrop);
            // Step 1: Generate picks with Claude
            console.log('📊 Step 1: Generating market picks...');
            const picks = await miyomi_claude_sdk_1.miyomiSDK.generatePicks(3);
            if (!picks || picks.length === 0) {
                throw new Error('No picks generated');
            }
            scheduledDrop.picks = picks;
            scheduledDrop.status = 'curating';
            console.log(`✓ Generated ${picks.length} picks`);
            // Step 2: Auto-curation based on confidence
            console.log('🔍 Step 2: Auto-curating picks...');
            const bestPick = await this.autoSelectBestPick(picks);
            if (!bestPick) {
                throw new Error('No picks passed curation');
            }
            console.log(`✓ Selected pick: ${bestPick.market}`);
            // Step 3: Generate video script
            console.log('📝 Step 3: Generating video script...');
            const script = await miyomi_claude_sdk_1.miyomiSDK.generateVideoScript(bestPick);
            scheduledDrop.status = 'producing';
            console.log('✓ Script generated');
            // Step 4: Send to Eden for video production
            console.log('🎬 Step 4: Requesting video production...');
            const videoUrl = await this.requestVideoProduction(bestPick, script);
            scheduledDrop.videoUrl = videoUrl;
            scheduledDrop.status = 'ready';
            console.log(`✓ Video ready: ${videoUrl}`);
            // Step 5: Deploy to site
            console.log('🚀 Step 5: Deploying to site...');
            await this.deployToSite(dropId, bestPick, videoUrl);
            scheduledDrop.status = 'deployed';
            console.log(`✅ Drop ${dropId} deployed successfully`);
            return dropId;
        }
        catch (error) {
            console.error(`❌ Workflow failed for ${dropId}:`, error);
            const drop = this.scheduledDrops.get(dropId);
            if (drop) {
                drop.status = 'failed';
                drop.error = error instanceof Error ? error.message : 'Unknown error';
            }
            // Try fallback workflow
            await this.executeFallbackWorkflow(dropId);
            throw error;
        }
    }
    /**
     * Auto-select the best pick based on confidence, edge, and risk
     */
    async autoSelectBestPick(picks) {
        // Filter picks by minimum thresholds
        const qualifyingPicks = picks.filter(pick => pick.confidence >= 0.7 &&
            pick.edge >= 0.15 &&
            pick.risk_level !== 'high');
        if (qualifyingPicks.length === 0) {
            console.warn('No picks met auto-approval criteria');
            return null;
        }
        // Score picks (confidence * edge * sector_weight)
        const config = await this.getTrainerConfig();
        const scoredPicks = qualifyingPicks.map(pick => ({
            ...pick,
            score: pick.confidence * pick.edge * (config.sectorWeights[pick.sector] || 0.1)
        }));
        // Return highest scoring pick
        scoredPicks.sort((a, b) => b.score - a.score);
        return scoredPicks[0];
    }
    /**
     * Request video production from Eden
     */
    async requestVideoProduction(pick, script) {
        try {
            // Call Eden's video generation API
            const response = await fetch(`${process.env.EDEN_BASE_URL}/api/agents/miyomi/generate-video`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.EDEN_API_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    agent: 'miyomi',
                    pick: {
                        market: pick.market,
                        position: pick.position,
                        confidence: pick.confidence,
                        sector: pick.sector
                    },
                    script: {
                        title: script.title,
                        content: script.script,
                        hook: script.hook
                    },
                    style: {
                        format: 'vertical-short',
                        duration: '45-60s',
                        mood: this.getSectorMood(pick.sector),
                        variant: 'lower-third-v2'
                    }
                })
            });
            if (!response.ok) {
                throw new Error(`Eden API error: ${response.status}`);
            }
            const result = await response.json();
            return result.video_url;
        }
        catch (error) {
            console.error('Video production failed:', error);
            // Return placeholder for now
            return `https://placeholder.miyomi.xyz/video/${pick.id}.mp4`;
        }
    }
    /**
     * Deploy the completed drop to the site
     */
    async deployToSite(dropId, pick, videoUrl) {
        try {
            // Submit to Eden Registry
            const response = await fetch(`${process.env.EDEN_BASE_URL}/api/eden/miyomi/works`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.INTERNAL_API_TOKEN}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type: 'pick',
                    title: pick.market,
                    sector: pick.sector,
                    confidence: pick.confidence,
                    marketRef: {
                        platform: pick.platform,
                        id: pick.market_id || pick.market,
                        side: pick.position,
                        odds: pick.odds
                    },
                    script: pick.reasoning,
                    videoUrl: videoUrl,
                    frameUrl: `${videoUrl}?frame=1`,
                    scheduledAt: new Date().toISOString(),
                    postedAt: new Date().toISOString()
                })
            });
            if (!response.ok) {
                throw new Error(`Registry submission failed: ${response.status}`);
            }
            const result = await response.json();
            console.log(`✅ Submitted to registry: ${result.work_id}`);
        }
        catch (error) {
            console.error('Deployment failed:', error);
            throw error;
        }
    }
    /**
     * Execute fallback workflow when main workflow fails
     */
    async executeFallbackWorkflow(dropId) {
        console.log(`🚨 Executing fallback workflow for ${dropId}`);
        try {
            // Create a simple text-based pick without video
            const fallbackPick = {
                market: 'Fallback Pick - Market Analysis Pending',
                position: 'NO',
                confidence: 0.5,
                reasoning: 'Automated fallback due to generation failure',
                sector: 'finance',
                platform: 'Kalshi'
            };
            await this.deployToSite(dropId, fallbackPick, '');
            console.log('✓ Fallback deployed');
        }
        catch (error) {
            console.error('Fallback workflow also failed:', error);
        }
    }
    /**
     * Check status of pending drops and retry if needed
     */
    async checkPendingDrops() {
        const now = Date.now();
        for (const [dropId, drop] of this.scheduledDrops.entries()) {
            const ageMinutes = (now - new Date(drop.scheduledFor).getTime()) / (1000 * 60);
            // Retry failed drops that are less than 4 hours old
            if (drop.status === 'failed' && ageMinutes < 240) {
                console.log(`🔄 Retrying failed drop: ${dropId}`);
                try {
                    await this.executeDailyWorkflow();
                }
                catch (error) {
                    console.error(`Retry failed for ${dropId}:`, error);
                }
            }
            // Clean up old completed drops
            if (ageMinutes > 1440) { // 24 hours
                this.scheduledDrops.delete(dropId);
            }
        }
    }
    getSectorMood(sector) {
        const moodMap = {
            politics: 'analytical',
            sports: 'celebratory',
            finance: 'analytical',
            ai: 'spicy',
            pop: 'contrarian',
            geo: 'analytical',
            internet: 'spicy'
        };
        return moodMap[sector] || 'analytical';
    }
    async getTrainerConfig() {
        // In production, this would fetch from API
        return {
            sectorWeights: {
                politics: 0.25,
                sports: 0.20,
                finance: 0.15,
                ai: 0.15,
                pop: 0.15,
                geo: 0.05,
                internet: 0.05
            }
        };
    }
    getStatus() {
        const recentDrops = Array.from(this.scheduledDrops.values())
            .sort((a, b) => new Date(b.scheduledFor).getTime() - new Date(a.scheduledFor).getTime())
            .slice(0, 10);
        return {
            running: this.isRunning,
            scheduledDrops: this.scheduledDrops.size,
            recentDrops
        };
    }
}
exports.MiyomiScheduler = MiyomiScheduler;
// Export singleton
exports.miyomiScheduler = new MiyomiScheduler();
