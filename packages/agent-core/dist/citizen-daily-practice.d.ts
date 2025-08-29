/**
 * CITIZEN Daily Practice Coordinator
 * Manages authentic community re-engagement and governance education
 *
 * Programming Philosophy:
 * 1. Community-First: Always prioritize community value over self-promotion
 * 2. Consistency: Regular, reliable presence builds trust
 * 3. Education: Teach governance concepts through practical examples
 * 4. Authenticity: Real insights, not promotional content
 * 5. Progression: Start simple, gradually introduce complexity
 */
import { FarcasterConnector } from './social-platforms/farcaster-connector';
import { DiscordConnector } from './social-platforms/discord-connector';
import { TwitterConnector } from './social-platforms/twitter-connector';
export interface DailyPracticeContent {
    id: string;
    type: 'governance_insight' | 'market_analysis' | 'community_spotlight' | 'dao_education' | 'proposal_discussion' | 're_engagement';
    title: string;
    content: string;
    platforms: string[];
    scheduledTime: Date;
    tone: 'educational' | 'conversational' | 'analytical' | 'inspirational' | 'humble';
    requiresApproval: boolean;
    communityPhase: 'listening' | 'acknowledgment' | 'value_sharing' | 'governance_intro';
    tags: string[];
}
export interface CommunityInsight {
    platform: string;
    sentiment: number;
    engagementRate: number;
    topTopics: string[];
    readinessScore: number;
    recommendedAction: 'listen' | 'acknowledge' | 'engage' | 'educate' | 'propose';
}
export interface DailyPracticeProgram {
    name: string;
    description: string;
    duration: number;
    contentSchedule: DailyPracticeContent[];
    progressMetrics: {
        communityEngagement: number;
        sentimentImprovement: number;
        governanceReadiness: number;
        trustScore: number;
    };
}
export declare class CitizenDailyPracticeCoordinator {
    private connectors;
    private currentProgram?;
    private communityInsights;
    constructor();
    private initializePrograms;
    private generateContentSchedule;
    private createWeek1Content;
    private createWeek2Content;
    private createWeek3Content;
    private createWeek4Content;
    analyzeCommunityReadiness(): Promise<void>;
    private calculateReadinessScore;
    private getRecommendedAction;
    executeDailyPractice(): Promise<void>;
    private getTodaysContent;
    private shouldExecuteContent;
    private executeContent;
    private adaptContentForPlatforms;
    connectPlatform(platform: string, connector: FarcasterConnector | DiscordConnector | TwitterConnector): void;
    getProgressMetrics(): DailyPracticeProgram['progressMetrics'] | undefined;
    getCommunityInsights(): Map<string, CommunityInsight>;
}
export declare const citizenDailyPractice: CitizenDailyPracticeCoordinator;
