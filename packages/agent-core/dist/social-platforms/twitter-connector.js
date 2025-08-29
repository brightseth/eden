"use strict";
/**
 * Twitter/X Platform Connector for CITIZEN
 * Handles Twitter API v2 interactions for community engagement
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwitterConnector = void 0;
class TwitterConnector {
    constructor(config) {
        this.baseUrl = 'https://api.twitter.com/2';
        this.config = config;
    }
    // Community Analysis
    async analyzeCommunityActivity(hashtags = ['BrightMoments', 'CryptoCitizens']) {
        try {
            // Search for recent tweets with community hashtags
            const searchQuery = hashtags.map(tag => `#${tag}`).join(' OR ');
            const recentTweets = await this.searchTweets(searchQuery, 100);
            // Identify active users and influencers
            const influencers = await this.identifyInfluencers(recentTweets);
            // Calculate sentiment and engagement
            const sentiment = this.analyzeSentiment(recentTweets);
            const engagementRate = this.calculateEngagementRate(recentTweets);
            const trendingTopics = this.extractTrendingTopics(recentTweets);
            return {
                recentTweets,
                influencers,
                sentiment,
                engagementRate,
                trendingTopics
            };
        }
        catch (error) {
            console.error('[Twitter] Community analysis failed:', error);
            throw error;
        }
    }
    // Posting
    async publishTweet(tweet) {
        try {
            const response = await fetch(`${this.baseUrl}/tweets`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.config.bearerToken}`,
                    // Note: For posting, you typically need OAuth 1.0a, not just Bearer token
                    // This is a simplified example
                },
                body: JSON.stringify(tweet)
            });
            if (!response.ok) {
                const error = await response.text();
                throw new Error(`Twitter API error: ${response.status} ${error}`);
            }
            const result = await response.json();
            console.log('[Twitter] Tweet published successfully:', result.data.id);
            return {
                id: result.data.id,
                success: true
            };
        }
        catch (error) {
            console.error('[Twitter] Tweet publishing failed:', error);
            return { id: '', success: false };
        }
    }
    async publishGovernanceThread(proposal) {
        const tweets = this.formatGovernanceThread(proposal);
        const threadIds = [];
        let previousTweetId;
        try {
            for (let i = 0; i < tweets.length; i++) {
                const tweet = {
                    text: tweets[i],
                    reply: previousTweetId ? { in_reply_to_tweet_id: previousTweetId } : undefined
                };
                const result = await this.publishTweet(tweet);
                if (!result.success) {
                    throw new Error(`Failed to publish tweet ${i + 1} in thread`);
                }
                threadIds.push(result.id);
                previousTweetId = result.id;
                // Rate limiting: wait between tweets
                if (i < tweets.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }
            return { threadIds, success: true };
        }
        catch (error) {
            console.error('[Twitter] Thread publishing failed:', error);
            return { threadIds, success: false };
        }
    }
    // Engagement
    async likeTweet(tweetId) {
        try {
            const response = await fetch(`${this.baseUrl}/users/${this.config.userId}/likes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.config.bearerToken}`
                },
                body: JSON.stringify({ tweet_id: tweetId })
            });
            return { success: response.ok };
        }
        catch (error) {
            console.error('[Twitter] Like failed:', error);
            return { success: false };
        }
    }
    async retweet(tweetId) {
        try {
            const response = await fetch(`${this.baseUrl}/users/${this.config.userId}/retweets`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.config.bearerToken}`
                },
                body: JSON.stringify({ tweet_id: tweetId })
            });
            return { success: response.ok };
        }
        catch (error) {
            console.error('[Twitter] Retweet failed:', error);
            return { success: false };
        }
    }
    async replyToTweet(tweetId, replyText) {
        const tweet = {
            text: replyText,
            reply: { in_reply_to_tweet_id: tweetId }
        };
        const result = await this.publishTweet(tweet);
        return { success: result.success };
    }
    // Data Retrieval
    async searchTweets(query, maxResults = 50) {
        try {
            const params = new URLSearchParams({
                query: query,
                'max_results': maxResults.toString(),
                'tweet.fields': 'public_metrics,created_at,context_annotations,entities',
                'user.fields': 'public_metrics,verified',
                'expansions': 'author_id'
            });
            const response = await fetch(`${this.baseUrl}/tweets/search/recent?${params}`, {
                headers: {
                    'Authorization': `Bearer ${this.config.bearerToken}`
                }
            });
            if (!response.ok) {
                throw new Error(`Search error: ${response.statusText}`);
            }
            const data = await response.json();
            return data.data || [];
        }
        catch (error) {
            console.error('[Twitter] Search failed:', error);
            return [];
        }
    }
    async identifyInfluencers(tweets) {
        // Extract unique user IDs and get their profiles
        const userIds = [...new Set(tweets.map(tweet => tweet.author_id))];
        if (userIds.length === 0)
            return [];
        try {
            const response = await fetch(`${this.baseUrl}/users?ids=${userIds.join(',')}&user.fields=public_metrics,verified,description`, {
                headers: {
                    'Authorization': `Bearer ${this.config.bearerToken}`
                }
            });
            if (!response.ok) {
                throw new Error(`Users lookup error: ${response.statusText}`);
            }
            const data = await response.json();
            // Sort by follower count and return top influencers
            return (data.data || [])
                .sort((a, b) => b.public_metrics.followers_count - a.public_metrics.followers_count)
                .slice(0, 10);
        }
        catch (error) {
            console.error('[Twitter] Influencer identification failed:', error);
            return [];
        }
    }
    analyzeSentiment(tweets) {
        // Simple sentiment analysis based on engagement and keywords
        const positiveWords = ['amazing', 'love', 'great', 'awesome', 'beautiful', 'brilliant', 'excited'];
        const negativeWords = ['bad', 'hate', 'awful', 'terrible', 'disappointed', 'boring'];
        let totalScore = 0;
        let totalTweets = tweets.length;
        for (const tweet of tweets) {
            const text = tweet.text?.toLowerCase() || '';
            let tweetScore = 0;
            // Keyword sentiment
            positiveWords.forEach(word => {
                if (text.includes(word))
                    tweetScore += 1;
            });
            negativeWords.forEach(word => {
                if (text.includes(word))
                    tweetScore -= 1;
            });
            // Engagement boost for positive sentiment
            const metrics = tweet.public_metrics || {};
            const engagementRatio = (metrics.like_count + metrics.retweet_count) / Math.max(1, metrics.impression_count || 1);
            if (engagementRatio > 0.05)
                tweetScore += 0.5; // High engagement suggests positive reception
            totalScore += tweetScore;
        }
        return totalTweets > 0 ? Math.max(-1, Math.min(1, totalScore / totalTweets)) : 0;
    }
    calculateEngagementRate(tweets) {
        if (tweets.length === 0)
            return 0;
        const totalEngagements = tweets.reduce((sum, tweet) => {
            const metrics = tweet.public_metrics || {};
            return sum + (metrics.like_count || 0) + (metrics.retweet_count || 0) + (metrics.reply_count || 0);
        }, 0);
        const totalImpressions = tweets.reduce((sum, tweet) => {
            return sum + (tweet.public_metrics?.impression_count || 100); // Assume 100 if no data
        }, 0);
        return totalImpressions > 0 ? totalEngagements / totalImpressions : 0;
    }
    extractTrendingTopics(tweets) {
        const topicCount = {};
        for (const tweet of tweets) {
            // Extract hashtags
            const entities = tweet.entities || {};
            const hashtags = entities.hashtags || [];
            for (const hashtag of hashtags) {
                const tag = hashtag.tag?.toLowerCase();
                if (tag) {
                    topicCount[tag] = (topicCount[tag] || 0) + 1;
                }
            }
            // Extract context annotations (topics identified by Twitter)
            const contexts = tweet.context_annotations || [];
            for (const context of contexts) {
                const topic = context.entity?.name;
                if (topic) {
                    topicCount[topic] = (topicCount[topic] || 0) + 1;
                }
            }
        }
        // Return top 10 trending topics
        return Object.entries(topicCount)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 10)
            .map(([topic]) => topic);
    }
    // Format helpers
    formatGovernanceThread(proposal) {
        const tweets = [];
        // Tweet 1: Announcement
        tweets.push(`🗳️ New ${proposal.type} governance proposal is live!\n\n` +
            `"${proposal.title}"\n\n` +
            `Thread below 👇\n\n` +
            `#DAO #Governance #BrightMoments #Web3`);
        // Tweet 2: Description (may need to split)
        const description = proposal.description;
        if (description.length <= 240) {
            tweets.push(`📋 ${description}\n\n2/`);
        }
        else {
            // Split long descriptions
            const chunks = this.splitTextIntoChunks(description, 240);
            chunks.forEach((chunk, index) => {
                tweets.push(`📋 ${chunk}\n\n${tweets.length + 1}/`);
            });
        }
        // Final tweet: Call to action
        const ctaTweet = `⏰ Voting ends: ${proposal.votingEnd.toLocaleDateString()}\n\n` +
            `Your voice matters in our community governance!\n\n` +
            (proposal.snapshotUrl ? `Vote here: ${proposal.snapshotUrl}\n\n` : '') +
            `${tweets.length + 1}/${tweets.length + 1}`;
        tweets.push(ctaTweet);
        return tweets;
    }
    formatDailyInsight(insight, topic) {
        const text = `💡 Daily ${topic} Insight:\n\n${insight.substring(0, 200)}${insight.length > 200 ? '...' : ''}\n\n#DAO #Governance #Web3`;
        return {
            text: text.substring(0, 280) // Twitter character limit
        };
    }
    splitTextIntoChunks(text, maxLength) {
        const chunks = [];
        const sentences = text.split('. ');
        let currentChunk = '';
        for (const sentence of sentences) {
            if ((currentChunk + sentence + '. ').length <= maxLength) {
                currentChunk += sentence + '. ';
            }
            else {
                if (currentChunk) {
                    chunks.push(currentChunk.trim());
                    currentChunk = sentence + '. ';
                }
                else {
                    // Single sentence too long, force split
                    chunks.push(sentence.substring(0, maxLength - 3) + '...');
                }
            }
        }
        if (currentChunk.trim()) {
            chunks.push(currentChunk.trim());
        }
        return chunks;
    }
    // Connection Testing
    async testConnection() {
        try {
            const response = await fetch(`${this.baseUrl}/users/me`, {
                headers: {
                    'Authorization': `Bearer ${this.config.bearerToken}`
                }
            });
            return response.ok;
        }
        catch (error) {
            console.error('[Twitter] Connection test failed:', error);
            return false;
        }
    }
}
exports.TwitterConnector = TwitterConnector;
