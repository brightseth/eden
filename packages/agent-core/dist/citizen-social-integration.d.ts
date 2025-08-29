/**
 * CITIZEN Social Platform Integration
 * Community-First Engagement Strategy
 *
 * Core Principles:
 * 1. Listen First - Understand community sentiment before engaging
 * 2. Authentic Reconnection - Acknowledge absence, show genuine interest
 * 3. Value-Driven Content - Share meaningful updates, not spam
 * 4. Community-Led - Amplify existing conversations, don't dominate
 * 5. Progressive Engagement - Start small, build trust, then expand
 */
export interface SocialPlatformConfig {
    platform: 'farcaster' | 'discord' | 'twitter' | 'instagram' | 'telegram';
    credentials: {
        apiKey?: string;
        accessToken?: string;
        refreshToken?: string;
        webhookUrl?: string;
        botToken?: string;
    };
    community: {
        name: string;
        primaryChannels: string[];
        keyMembers: string[];
        lastActiveDate?: Date;
        avgEngagementRate?: number;
    };
    engagement: {
        maxPostsPerDay: number;
        maxDirectMessages: number;
        respectQuietHours: boolean;
        requireHumanApproval: boolean;
    };
}
export interface CommunityReEngagementPlan {
    phase: 'listening' | 'acknowledgment' | 'value_sharing' | 'governance_intro';
    duration: number;
    activities: {
        type: 'listen' | 'respond' | 'post' | 'dm' | 'governance';
        content: string;
        frequency: 'daily' | 'weekly' | 'on_trigger';
        requiresApproval: boolean;
    }[];
    successMetrics: {
        sentimentScore: number;
        engagementRate: number;
        communityFeedback: string[];
    };
}
export interface DailyPracticeProgram {
    name: string;
    description: string;
    cadence: 'daily' | 'weekly' | 'monthly';
    contentTypes: ('governance_insight' | 'market_analysis' | 'community_spotlight' | 'dao_education' | 'proposal_discussion')[];
    platforms: SocialPlatformConfig['platform'][];
    tone: 'educational' | 'conversational' | 'analytical' | 'inspirational';
}
export declare class CitizenSocialCoordinator {
    private platforms;
    private reEngagementPlans;
    private dailyPractices;
    constructor();
    private initializeReEngagementStrategy;
    private setupDailyPracticePrograms;
    analyzeCommunityHealth(platform: string): Promise<{
        sentiment: number;
        engagement: number;
        topTopics: string[];
        keyMembers: string[];
        lastActivity: Date;
        readinessForGovernance: number;
    }>;
    generateReEngagementContent(phase: CommunityReEngagementPlan['phase'], platform: string, context: {
        communityName: string;
        recentActivity: string[];
        sentiment: number;
    }): Promise<{
        content: string;
        tone: string;
        requiresApproval: boolean;
        scheduledTime?: Date;
    }>;
    generateDailyPracticeContent(practice: DailyPracticeProgram, platform: string): Promise<{
        content: string;
        mediaType?: 'text' | 'image' | 'video';
        scheduledTime: Date;
    }>;
    connectPlatform(config: SocialPlatformConfig): Promise<boolean>;
    broadcastGovernanceProposal(proposal: {
        title: string;
        description: string;
        type: string;
        votingPeriod: {
            start: Date;
            end: Date;
        };
        snapshotUrl?: string;
    }, platforms: string[]): Promise<{
        platform: string;
        success: boolean;
        messageId?: string;
    }[]>;
    private getToneForPhase;
    private requiresApprovalForPhase;
    private getOptimalPostingTime;
    private getOptimalMediaType;
    private validateCredentials;
    private testPlatformConnection;
    private generateGovernanceContent;
    private postToPlatform;
}
export declare const citizenSocialCoordinator: CitizenSocialCoordinator;
