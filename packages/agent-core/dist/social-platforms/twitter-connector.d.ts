/**
 * Twitter/X Platform Connector for CITIZEN
 * Handles Twitter API v2 interactions for community engagement
 */
export interface TwitterConfig {
    bearerToken: string;
    apiKey: string;
    apiSecretKey: string;
    accessToken: string;
    accessTokenSecret: string;
    userId?: string;
}
export interface TwitterTweet {
    text: string;
    media?: {
        media_ids: string[];
    };
    reply?: {
        in_reply_to_tweet_id: string;
    };
    quote_tweet_id?: string;
    poll?: {
        options: string[];
        duration_minutes: number;
    };
}
export interface TwitterUser {
    id: string;
    username: string;
    name: string;
    description?: string;
    public_metrics: {
        followers_count: number;
        following_count: number;
        tweet_count: number;
        listed_count: number;
    };
    verified?: boolean;
}
export declare class TwitterConnector {
    private config;
    private baseUrl;
    constructor(config: TwitterConfig);
    analyzeCommunityActivity(hashtags?: string[]): Promise<{
        recentTweets: any[];
        influencers: TwitterUser[];
        sentiment: number;
        engagementRate: number;
        trendingTopics: string[];
    }>;
    publishTweet(tweet: TwitterTweet): Promise<{
        id: string;
        success: boolean;
    }>;
    publishGovernanceThread(proposal: {
        title: string;
        description: string;
        type: string;
        votingEnd: Date;
        snapshotUrl?: string;
    }): Promise<{
        threadIds: string[];
        success: boolean;
    }>;
    likeTweet(tweetId: string): Promise<{
        success: boolean;
    }>;
    retweet(tweetId: string): Promise<{
        success: boolean;
    }>;
    replyToTweet(tweetId: string, replyText: string): Promise<{
        success: boolean;
    }>;
    private searchTweets;
    private identifyInfluencers;
    private analyzeSentiment;
    private calculateEngagementRate;
    private extractTrendingTopics;
    private formatGovernanceThread;
    formatDailyInsight(insight: string, topic: string): TwitterTweet;
    private splitTextIntoChunks;
    testConnection(): Promise<boolean>;
}
