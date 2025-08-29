/**
 * Discord Platform Connector for CITIZEN
 * Handles Discord bot interactions and community management
 */
export interface DiscordConfig {
    botToken: string;
    guildId: string;
    governanceChannelId?: string;
    announcementsChannelId?: string;
    clientId?: string;
}
export interface DiscordMessage {
    content: string;
    embeds?: {
        title?: string;
        description?: string;
        color?: number;
        url?: string;
        fields?: {
            name: string;
            value: string;
            inline?: boolean;
        }[];
        timestamp?: string;
    }[];
    components?: any[];
}
export interface DiscordUser {
    id: string;
    username: string;
    discriminator: string;
    displayName?: string;
    roles: string[];
    joinedAt?: Date;
}
export declare class DiscordConnector {
    private config;
    private baseUrl;
    constructor(config: DiscordConfig);
    analyzeCommunityActivity(channelId?: string): Promise<{
        recentMessages: any[];
        activeUsers: DiscordUser[];
        sentiment: number;
        engagementRate: number;
    }>;
    sendMessage(channelId: string, message: DiscordMessage): Promise<{
        id: string;
        success: boolean;
    }>;
    sendGovernanceAnnouncement(proposal: {
        title: string;
        description: string;
        type: string;
        votingEnd: Date;
        snapshotUrl?: string;
    }): Promise<{
        success: boolean;
    }>;
    reactToMessage(channelId: string, messageId: string, emoji: string): Promise<{
        success: boolean;
    }>;
    replyToMessage(channelId: string, messageId: string, replyContent: string): Promise<{
        success: boolean;
    }>;
    private getChannelMessages;
    private getActiveGuildUsers;
    private analyzeSentiment;
    private calculateEngagementRate;
    testConnection(): Promise<boolean>;
    getGuildInfo(): Promise<{
        name: string;
        memberCount: number;
        channels: {
            id: string;
            name: string;
            type: number;
        }[];
    }>;
    formatDailyInsight(insight: string, topic: string): DiscordMessage;
}
