"use strict";
/**
 * Farcaster Platform Connector for CITIZEN
 * Handles native Farcaster protocol interactions
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.FarcasterConnector = void 0;
class FarcasterConnector {
    constructor(config) {
        this.config = {
            baseUrl: 'https://api.neynar.com/v2',
            ...config
        };
    }
    // Community Analysis
    async analyzeCommunityActivity(channel = 'brightmoments') {
        try {
            // Get recent casts from channel
            const recentCasts = await this.getChannelCasts(channel, 50);
            // Analyze users and engagement
            const activeUsers = await this.getActiveChannelUsers(channel);
            // Basic sentiment analysis (would be more sophisticated)
            const sentiment = this.analyzeSentiment(recentCasts);
            const engagementRate = this.calculateEngagementRate(recentCasts);
            return {
                recentCasts,
                activeUsers,
                sentiment,
                engagementRate
            };
        }
        catch (error) {
            console.error('[Farcaster] Community analysis failed:', error);
            throw error;
        }
    }
    // Posting
    async publishCast(cast) {
        try {
            const response = await fetch(`${this.config.baseUrl}/farcaster/cast`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'api_key': this.config.apiKey,
                    'signer_uuid': this.config.signerUuid
                },
                body: JSON.stringify(cast)
            });
            if (!response.ok) {
                throw new Error(`Farcaster API error: ${response.statusText}`);
            }
            const result = await response.json();
            console.log('[Farcaster] Cast published successfully:', result.hash);
            return {
                hash: result.hash,
                success: true
            };
        }
        catch (error) {
            console.error('[Farcaster] Cast publishing failed:', error);
            return { hash: '', success: false };
        }
    }
    // Engagement  
    async replyToCast(parentHash, parentFid, replyText) {
        const cast = {
            text: replyText,
            parent: {
                fid: parentFid,
                hash: parentHash
            }
        };
        const result = await this.publishCast(cast);
        return { success: result.success };
    }
    async likeCast(castHash) {
        try {
            const response = await fetch(`${this.config.baseUrl}/farcaster/reaction`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'api_key': this.config.apiKey,
                    'signer_uuid': this.config.signerUuid
                },
                body: JSON.stringify({
                    reaction_type: 'like',
                    target: castHash
                })
            });
            return { success: response.ok };
        }
        catch (error) {
            console.error('[Farcaster] Like failed:', error);
            return { success: false };
        }
    }
    // Data Retrieval
    async getChannelCasts(channel, limit = 25) {
        try {
            const response = await fetch(`${this.config.baseUrl}/farcaster/feed/channels?channel_ids=${channel}&limit=${limit}`, {
                headers: { 'api_key': this.config.apiKey }
            });
            if (!response.ok) {
                throw new Error(`Channel feed error: ${response.statusText}`);
            }
            const data = await response.json();
            return data.casts || [];
        }
        catch (error) {
            console.error('[Farcaster] Failed to get channel casts:', error);
            return [];
        }
    }
    async getActiveChannelUsers(channel) {
        try {
            const response = await fetch(`${this.config.baseUrl}/farcaster/channel/users?id=${channel}&limit=50`, {
                headers: { 'api_key': this.config.apiKey }
            });
            if (!response.ok) {
                throw new Error(`Channel users error: ${response.statusText}`);
            }
            const data = await response.json();
            return data.users || [];
        }
        catch (error) {
            console.error('[Farcaster] Failed to get channel users:', error);
            return [];
        }
    }
    analyzeSentiment(casts) {
        // Simple sentiment analysis - count positive vs negative words
        const positiveWords = ['great', 'amazing', 'love', 'excellent', 'awesome', 'brilliant', 'fantastic'];
        const negativeWords = ['bad', 'awful', 'hate', 'terrible', 'horrible', 'disappointing'];
        let totalScore = 0;
        let totalCasts = casts.length;
        for (const cast of casts) {
            const text = cast.text?.toLowerCase() || '';
            let castScore = 0;
            positiveWords.forEach(word => {
                if (text.includes(word))
                    castScore += 1;
            });
            negativeWords.forEach(word => {
                if (text.includes(word))
                    castScore -= 1;
            });
            totalScore += castScore;
        }
        // Return sentiment between -1 and 1
        return totalCasts > 0 ? Math.max(-1, Math.min(1, totalScore / totalCasts)) : 0;
    }
    calculateEngagementRate(casts) {
        if (casts.length === 0)
            return 0;
        const totalEngagements = casts.reduce((sum, cast) => {
            return sum + (cast.reactions?.likes_count || 0) + (cast.replies?.count || 0) + (cast.recasts?.count || 0);
        }, 0);
        return totalEngagements / casts.length / 100; // Normalize to 0-1 scale
    }
    // Connection Testing
    async testConnection() {
        try {
            const response = await fetch(`${this.config.baseUrl}/farcaster/user/me`, {
                headers: { 'api_key': this.config.apiKey }
            });
            return response.ok;
        }
        catch (error) {
            console.error('[Farcaster] Connection test failed:', error);
            return false;
        }
    }
    // Format helpers for governance content
    formatGovernanceProposal(proposal) {
        const text = `🗳️ New ${proposal.type} proposal: ${proposal.title}

${proposal.description.substring(0, 200)}${proposal.description.length > 200 ? '...' : ''}

Vote by ${proposal.votingEnd.toLocaleDateString()}
${proposal.snapshotUrl || ''}

#DAO #Governance #BrightMoments`;
        return {
            text: text.substring(0, 320), // Farcaster character limit
            channel: 'brightmoments',
            embeds: proposal.snapshotUrl ? [{ url: proposal.snapshotUrl }] : undefined
        };
    }
    formatDailyInsight(insight, topic) {
        return {
            text: `💡 ${topic} Insight:

${insight.substring(0, 250)}

#DAOGovernance #Web3`,
            channel: 'brightmoments'
        };
    }
}
exports.FarcasterConnector = FarcasterConnector;
