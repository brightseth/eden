/**
 * CITIZEN Claude SDK Integration
 * Handles DAO governance, proposal management, and consensus building
 */
import type { SnapshotProposal, VotingPowerResult, ProposalSyncResult } from '../registry/snapshot-service';
export interface GovernanceProposal {
    id: string;
    proposalNumber: number;
    date: Date;
    title: string;
    description: string;
    type: 'constitutional' | 'economic' | 'operational' | 'fellowship' | 'community';
    status: 'draft' | 'active' | 'passed' | 'rejected' | 'executed';
    requiredMajority: number;
    votingPeriod: {
        start: Date;
        end: Date;
    };
    voting: {
        for: number;
        against: number;
        abstain: number;
        participationRate: number;
    };
    metadata: {
        impactScope: 'high' | 'medium' | 'low';
        urgency: 'critical' | 'high' | 'medium' | 'low';
        complexityScore: number;
        consensusScore: number;
        stakeholderAlignment: number;
    };
}
export interface ConsensusAnalysis {
    proposal: string;
    stakeholderGroups: {
        name: string;
        size: number;
        influence: number;
        supportLevel: number;
        concerns: string[];
    }[];
    consensusPath: {
        strategy: string;
        steps: string[];
        timeline: string;
        successProbability: number;
    };
    potentialBlocks: {
        issue: string;
        severity: 'high' | 'medium' | 'low';
        mitigation: string;
    }[];
}
export interface CitizenConfig {
    governanceMode: 'active' | 'observation' | 'facilitation';
    consensusThreshold: number;
    proposalCadence: 'weekly' | 'biweekly' | 'monthly';
    stakeholderWeights: {
        creators: number;
        collectors: number;
        developers: number;
        community: number;
    };
    decisionFramework: 'rough-consensus' | 'majority-vote' | 'qualified-majority' | 'unanimous';
}
export interface GovernanceMetrics {
    totalProposals: number;
    passedProposals: number;
    avgParticipationRate: number;
    avgConsensusScore: number;
    activeDebates: number;
    fellowshipSize: number;
    governanceHealth: number;
}
export declare class CitizenClaudeSDK {
    private anthropic;
    private config;
    private registryClient;
    private governanceMetrics;
    constructor(apiKey?: string);
    /**
     * Generate governance proposal
     */
    generateProposal(topic: string, context: string, type: GovernanceProposal['type']): Promise<GovernanceProposal>;
    /**
     * Analyze consensus potential for a proposal
     */
    analyzeConsensus(proposal: GovernanceProposal, communityFeedback: string[]): Promise<ConsensusAnalysis>;
    /**
     * Generate fellowship coordination strategy
     */
    generateFellowshipStrategy(objective: string, timeframe: string): Promise<{
        strategy: string;
        initiatives: string[];
        engagementPlan: string;
        successMetrics: string[];
    }>;
    /**
     * Monitor governance health and generate insights
     */
    assessGovernanceHealth(): Promise<{
        healthScore: number;
        strengths: string[];
        concerns: string[];
        recommendations: string[];
    }>;
    /**
     * Sync governance data with Registry
     */
    syncWithRegistry(proposal: GovernanceProposal): Promise<void>;
    private buildSystemPrompt;
    private buildProposalPrompt;
    private parseGovernanceProposal;
    private updateGovernanceMetrics;
    /**
     * Get current governance metrics
     */
    getGovernanceMetrics(): GovernanceMetrics;
    /**
     * Update configuration
     */
    updateConfig(newConfig: Partial<CitizenConfig>): Promise<void>;
    /**
     * Check if Snapshot governance is enabled and safe for testnet use
     */
    private isSnapshotGovernanceEnabled;
    /**
     * Create a Snapshot proposal through the Registry Gateway
     * This maintains the Registry-first architecture pattern
     */
    createSnapshotProposal(topic: string, context: string, proposalType: GovernanceProposal['type'], spaceId?: string): Promise<{
        registryWorkId?: string;
        snapshotProposal?: SnapshotProposal;
        success: boolean;
        error?: string;
    }>;
    /**
     * Get voting power for a CryptoCitizen holder on Sepolia testnet
     */
    getVotingPower(address: string, spaceId?: string): Promise<VotingPowerResult | null>;
    /**
     * Coordinate community voting on a Snapshot proposal
     */
    coordinateVoting(proposalId: string, communityOutreach?: boolean): Promise<{
        coordinationStrategy: string;
        outreachPlan?: string[];
        participationPrediction: number;
        success: boolean;
    }>;
    /**
     * Sync proposal results from Snapshot back to Registry
     */
    syncProposalResults(snapshotProposalId: string, registryWorkId: string): Promise<ProposalSyncResult>;
    /**
     * Analyze governance performance across Snapshot and local proposals
     */
    analyzeGovernancePerformance(): Promise<{
        snapshotMetrics?: {
            activeProposals: number;
            avgParticipation: number;
            successRate: number;
        };
        localMetrics: GovernanceMetrics;
        recommendations: string[];
        healthScore: number;
    }>;
    /**
     * Get comprehensive governance health including Snapshot integration status
     */
    getGovernanceHealth(): Promise<{
        metrics: GovernanceMetrics;
        snapshotIntegration: {
            enabled: boolean;
            network: string;
            testnetOnly: boolean;
            lastSync?: Date;
        };
        healthScore: number;
        recommendations: string[];
    }>;
    /**
     * Chat with Citizen about governance, DAO operations, or community matters
     */
    chat(message: string, context?: Array<{
        role: string;
        content: string;
    }>): Promise<string>;
}
export declare const citizenSDK: CitizenClaudeSDK;
