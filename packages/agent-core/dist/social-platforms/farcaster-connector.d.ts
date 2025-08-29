/**
 * Farcaster Platform Connector for CITIZEN
 * Handles native Farcaster protocol interactions
 */
export interface FarcasterConfig {
    signerUuid?: string;
    apiKey?: string;
    baseUrl: string;
    userFid?: number;
}
export interface FarcasterCast {
    text: string;
    embeds?: {
        url?: string;
        castId?: {
            fid: number;
            hash: string;
        };
    }[];
    parent?: {
        fid: number;
        hash: string;
    };
    channel?: string;
}
export interface FarcasterUser {
    fid: number;
    username: string;
    displayName: string;
    followerCount: number;
    followingCount: number;
    bio?: string;
}
export declare class FarcasterConnector {
    private config;
    constructor(config: FarcasterConfig);
    analyzeCommunityActivity(channel?: string): Promise<{
        recentCasts: any[];
        activeUsers: FarcasterUser[];
        sentiment: number;
        engagementRate: number;
    }>;
    publishCast(cast: FarcasterCast): Promise<{
        hash: string;
        success: boolean;
    }>;
    replyToCast(parentHash: string, parentFid: number, replyText: string): Promise<{
        success: boolean;
    }>;
    likeCast(castHash: string): Promise<{
        success: boolean;
    }>;
    private getChannelCasts;
    private getActiveChannelUsers;
    private analyzeSentiment;
    private calculateEngagementRate;
    testConnection(): Promise<boolean>;
    formatGovernanceProposal(proposal: {
        title: string;
        description: string;
        type: string;
        votingEnd: Date;
        snapshotUrl?: string;
    }): FarcasterCast;
    formatDailyInsight(insight: string, topic: string): FarcasterCast;
}
