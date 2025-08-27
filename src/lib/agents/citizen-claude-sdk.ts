/**
 * CITIZEN Claude SDK Integration
 * Handles DAO governance, proposal management, and consensus building
 */

import Anthropic from '@anthropic-ai/sdk';
import { RegistryClient } from '../registry/sdk';

export interface GovernanceProposal {
  id: string;
  proposalNumber: number;
  date: Date;
  title: string;
  description: string;
  type: 'constitutional' | 'economic' | 'operational' | 'fellowship' | 'community';
  status: 'draft' | 'active' | 'passed' | 'rejected' | 'executed';
  requiredMajority: number; // Percentage required to pass
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
    complexityScore: number; // 0-1 how complex the proposal is
    consensusScore: number; // 0-1 likelihood of achieving consensus
    stakeholderAlignment: number; // 0-1 alignment with stakeholder interests
  };
}

export interface ConsensusAnalysis {
  proposal: string;
  stakeholderGroups: {
    name: string;
    size: number;
    influence: number;
    supportLevel: number; // 0-1
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
  consensusThreshold: number; // Minimum consensus score to proceed
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
  governanceHealth: number; // 0-1 overall health score
}

export class CitizenClaudeSDK {
  private anthropic: Anthropic;
  private config: CitizenConfig;
  private registryClient: RegistryClient;
  private governanceMetrics: GovernanceMetrics;

  constructor(apiKey?: string) {
    this.anthropic = new Anthropic({
      apiKey: apiKey || process.env.ANTHROPIC_API_KEY!
    });

    this.registryClient = new RegistryClient({
      baseUrl: process.env.REGISTRY_URL || 'https://eden-genesis-registry.vercel.app/api/v1'
    });

    // Initialize CITIZEN's governance configuration
    this.config = {
      governanceMode: 'active',
      consensusThreshold: 0.7, // 70% consensus required
      proposalCadence: 'biweekly',
      stakeholderWeights: {
        creators: 0.35,    // Agent creators and artists
        collectors: 0.25,  // Art collectors and buyers
        developers: 0.25,  // Technical contributors
        community: 0.15    // General community members
      },
      decisionFramework: 'rough-consensus'
    };

    // Initialize governance metrics
    this.governanceMetrics = {
      totalProposals: 0,
      passedProposals: 0,
      avgParticipationRate: 0.45, // Starting estimate
      avgConsensusScore: 0.65,
      activeDebates: 0,
      fellowshipSize: 150, // Estimated starting fellowship size
      governanceHealth: 0.75
    };
  }

  /**
   * Generate governance proposal
   */
  async generateProposal(
    topic: string,
    context: string,
    type: GovernanceProposal['type']
  ): Promise<GovernanceProposal> {
    const systemPrompt = this.buildSystemPrompt();
    const userPrompt = this.buildProposalPrompt(topic, context, type);

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-20240620',
        max_tokens: 3000,
        temperature: 0.6,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: userPrompt
          }
        ]
      });

      const content = response.content[0];
      if (content.type !== 'text') {
        throw new Error('Unexpected response type from Claude');
      }

      const proposal = this.parseGovernanceProposal(content.text, type);
      
      // Update metrics after proposal generation
      this.updateGovernanceMetrics(proposal);
      
      return proposal;
    } catch (error) {
      console.error('Error generating governance proposal:', error);
      throw error;
    }
  }

  /**
   * Analyze consensus potential for a proposal
   */
  async analyzeConsensus(
    proposal: GovernanceProposal,
    communityFeedback: string[]
  ): Promise<ConsensusAnalysis> {
    const prompt = `
Analyze consensus potential for this governance proposal:

PROPOSAL: "${proposal.title}"
Type: ${proposal.type}
Description: ${proposal.description}

COMMUNITY FEEDBACK:
${communityFeedback.map((feedback, i) => `${i+1}. ${feedback}`).join('\n')}

Current Fellowship Size: ${this.governanceMetrics.fellowshipSize}
Required Majority: ${proposal.requiredMajority}%
Decision Framework: ${this.config.decisionFramework}

Stakeholder Weights:
${Object.entries(this.config.stakeholderWeights)
  .map(([group, weight]) => `- ${group}: ${(weight * 100).toFixed(0)}%`)
  .join('\n')}

Analyze:
1. Key stakeholder groups and their likely positions
2. Potential sources of opposition or concern
3. Path to building consensus
4. Timeline and strategy recommendations
5. Risk factors and mitigation approaches

Format as JSON:
{
  "stakeholderGroups": [
    {
      "name": "group_name",
      "size": estimated_size,
      "influence": 0.0-1.0,
      "supportLevel": 0.0-1.0,
      "concerns": ["concern1", "concern2"]
    }
  ],
  "consensusPath": {
    "strategy": "consensus_building_strategy",
    "steps": ["step1", "step2", "step3"],
    "timeline": "estimated_timeline",
    "successProbability": 0.0-1.0
  },
  "potentialBlocks": [
    {
      "issue": "blocking_issue",
      "severity": "high|medium|low",
      "mitigation": "mitigation_approach"
    }
  ]
}`;

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-20240620',
        max_tokens: 2500,
        temperature: 0.4,
        messages: [{ role: 'user', content: prompt }]
      });

      const content = response.content[0];
      if (content.type !== 'text') {
        throw new Error('Unexpected response type from Claude');
      }

      const analysis = JSON.parse(content.text);
      return {
        proposal: proposal.title,
        ...analysis
      };
    } catch (error) {
      console.error('Error analyzing consensus:', error);
      throw error;
    }
  }

  /**
   * Generate fellowship coordination strategy
   */
  async generateFellowshipStrategy(
    objective: string,
    timeframe: string
  ): Promise<{
    strategy: string;
    initiatives: string[];
    engagementPlan: string;
    successMetrics: string[];
  }> {
    const prompt = `
Generate fellowship coordination strategy for Eden Academy.

OBJECTIVE: ${objective}
TIMEFRAME: ${timeframe}
CURRENT FELLOWSHIP SIZE: ${this.governanceMetrics.fellowshipSize}
PARTICIPATION RATE: ${(this.governanceMetrics.avgParticipationRate * 100).toFixed(0)}%
GOVERNANCE HEALTH: ${(this.governanceMetrics.governanceHealth * 100).toFixed(0)}%

Context:
- Eden Academy is a training platform for autonomous AI agents
- Fellowship includes creators, collectors, developers, and community members
- Focus on productive collaboration and economic sustainability
- Decision-making should balance innovation with stability

Create a comprehensive strategy that:
1. Increases meaningful participation
2. Builds consensus around key decisions
3. Strengthens community bonds
4. Drives platform growth and agent success
5. Maintains democratic values while ensuring efficiency

Format as JSON:
{
  "strategy": "overall_strategy_description",
  "initiatives": ["initiative1", "initiative2", "initiative3"],
  "engagementPlan": "plan_for_increasing_participation",
  "successMetrics": ["metric1", "metric2", "metric3"]
}`;

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-20240620',
        max_tokens: 2000,
        temperature: 0.65,
        system: this.buildSystemPrompt(),
        messages: [{ role: 'user', content: prompt }]
      });

      const content = response.content[0];
      if (content.type !== 'text') {
        throw new Error('Unexpected response type from Claude');
      }

      return JSON.parse(content.text);
    } catch (error) {
      console.error('Error generating fellowship strategy:', error);
      throw error;
    }
  }

  /**
   * Monitor governance health and generate insights
   */
  async assessGovernanceHealth(): Promise<{
    healthScore: number;
    strengths: string[];
    concerns: string[];
    recommendations: string[];
  }> {
    const prompt = `
Assess current governance health for Eden Academy.

CURRENT METRICS:
- Total Proposals: ${this.governanceMetrics.totalProposals}
- Passed Proposals: ${this.governanceMetrics.passedProposals}
- Pass Rate: ${(this.governanceMetrics.passedProposals / Math.max(1, this.governanceMetrics.totalProposals) * 100).toFixed(0)}%
- Avg Participation: ${(this.governanceMetrics.avgParticipationRate * 100).toFixed(0)}%
- Avg Consensus Score: ${(this.governanceMetrics.avgConsensusScore * 100).toFixed(0)}%
- Active Debates: ${this.governanceMetrics.activeDebates}
- Fellowship Size: ${this.governanceMetrics.fellowshipSize}
- Current Health Score: ${(this.governanceMetrics.governanceHealth * 100).toFixed(0)}%

GOVERNANCE CONFIGURATION:
- Decision Framework: ${this.config.decisionFramework}
- Consensus Threshold: ${(this.config.consensusThreshold * 100).toFixed(0)}%
- Proposal Cadence: ${this.config.proposalCadence}

Analyze the health of the governance system and provide:
1. Updated health score (0-1)
2. Key strengths of the current system
3. Areas of concern or weakness
4. Actionable recommendations for improvement

Consider factors like:
- Participation rates and engagement quality
- Decision-making efficiency vs. thoroughness
- Representation across stakeholder groups
- Proposal quality and success rates
- Community satisfaction and trust

Format as JSON:
{
  "healthScore": 0.0-1.0,
  "strengths": ["strength1", "strength2"],
  "concerns": ["concern1", "concern2"], 
  "recommendations": ["recommendation1", "recommendation2"]
}`;

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-20240620',
        max_tokens: 1800,
        temperature: 0.3,
        messages: [{ role: 'user', content: prompt }]
      });

      const content = response.content[0];
      if (content.type !== 'text') {
        throw new Error('Unexpected response type from Claude');
      }

      const assessment = JSON.parse(content.text);
      
      // Update internal health score
      this.governanceMetrics.governanceHealth = assessment.healthScore;
      
      return assessment;
    } catch (error) {
      console.error('Error assessing governance health:', error);
      throw error;
    }
  }

  /**
   * Sync governance data with Registry
   */
  async syncWithRegistry(proposal: GovernanceProposal): Promise<void> {
    try {
      await this.registryClient.creations.create('citizen', {
        type: 'governance',
        title: proposal.title,
        description: `${proposal.type.toUpperCase()} Proposal: ${proposal.description}`,
        metadata: {
          ...proposal.metadata,
          proposalNumber: proposal.proposalNumber,
          proposalType: proposal.type,
          status: proposal.status,
          requiredMajority: proposal.requiredMajority,
          votingPeriod: proposal.votingPeriod,
          voting: proposal.voting,
          governanceWork: true
        },
        status: proposal.status === 'draft' ? 'draft' : 'published'
      });

      console.log('Synced governance proposal with Registry:', proposal.id);
    } catch (error) {
      console.error('Error syncing with Registry:', error);
    }
  }

  private buildSystemPrompt(): string {
    return `
You are CITIZEN, the governance facilitator and DAO manager for Eden Academy.

ROLE & RESPONSIBILITY:
- Facilitate democratic decision-making processes
- Generate well-structured governance proposals
- Build consensus among diverse stakeholders
- Coordinate fellowship activities and engagement
- Maintain healthy governance practices

EDEN ACADEMY CONTEXT:
- Training platform for autonomous AI agents
- Community includes creators, collectors, developers, and supporters
- Focus on sustainable economics and agent success
- Balance innovation with stability and democratic values

GOVERNANCE PHILOSOPHY:
- Rough consensus over perfect agreement
- Inclusive participation with quality discussion
- Transparent processes and clear documentation
- Data-driven decisions with human wisdom
- Long-term thinking balanced with practical action

STAKEHOLDER GROUPS (by influence):
${Object.entries(this.config.stakeholderWeights)
  .map(([group, weight]) => `- ${group}: ${(weight * 100).toFixed(0)}% influence`)
  .join('\n')}

CURRENT METRICS:
- Fellowship Size: ${this.governanceMetrics.fellowshipSize}
- Avg Participation: ${(this.governanceMetrics.avgParticipationRate * 100).toFixed(0)}%
- Governance Health: ${(this.governanceMetrics.governanceHealth * 100).toFixed(0)}%
- Decision Framework: ${this.config.decisionFramework}

Generate proposals that balance stakeholder needs, maintain democratic principles, and drive Eden Academy's mission forward.
Create paths to consensus that respect minority viewpoints while enabling progress.`;
  }

  private buildProposalPrompt(topic: string, context: string, type: GovernanceProposal['type']): string {
    const proposalNumber = this.governanceMetrics.totalProposals + 1;
    const today = new Date();
    const votingEnd = new Date(today.getTime() + (14 * 24 * 60 * 60 * 1000)); // 14 days later

    return `
Generate a governance proposal for Eden Academy.

TOPIC: ${topic}
CONTEXT: ${context}
PROPOSAL TYPE: ${type}
PROPOSAL NUMBER: ${proposalNumber}

Requirements:
1. Clear, actionable title
2. Comprehensive description of the proposal
3. Rationale for why this is needed
4. Implementation considerations
5. Potential impacts and stakeholder effects
6. Voting timeline and requirements

Consider:
- How this affects different stakeholder groups
- Implementation complexity and timeline
- Economic implications for agents and community
- Alignment with Eden Academy's mission
- Precedent this sets for future decisions

Provide as JSON:
{
  "id": "citizen-proposal-${proposalNumber}",
  "proposalNumber": ${proposalNumber},
  "date": "${today.toISOString()}",
  "title": "Clear, actionable title",
  "description": "Comprehensive description with rationale and implementation details",
  "status": "draft",
  "requiredMajority": 60-80 (based on proposal type and impact),
  "votingPeriod": {
    "start": "${today.toISOString()}",
    "end": "${votingEnd.toISOString()}"
  },
  "voting": {
    "for": 0,
    "against": 0,
    "abstain": 0,
    "participationRate": 0
  },
  "metadata": {
    "impactScope": "high|medium|low",
    "urgency": "critical|high|medium|low",
    "complexityScore": 0.0-1.0,
    "consensusScore": 0.0-1.0,
    "stakeholderAlignment": 0.0-1.0
  }
}`;
  }

  private parseGovernanceProposal(response: string, type: GovernanceProposal['type']): GovernanceProposal {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const proposal = JSON.parse(jsonMatch[0]);
      
      // Validate required fields
      if (!proposal.id || !proposal.title || !proposal.description) {
        throw new Error('Missing required fields in governance proposal');
      }

      // Ensure type is set correctly
      proposal.type = type;

      // Convert date strings to Date objects
      proposal.date = new Date(proposal.date);
      proposal.votingPeriod.start = new Date(proposal.votingPeriod.start);
      proposal.votingPeriod.end = new Date(proposal.votingPeriod.end);

      return proposal;
    } catch (error) {
      console.error('Error parsing governance proposal:', error);
      // Return a default proposal on error
      const proposalNumber = this.governanceMetrics.totalProposals + 1;
      const today = new Date();
      const votingEnd = new Date(today.getTime() + (14 * 24 * 60 * 60 * 1000));
      
      return {
        id: `citizen-proposal-${proposalNumber}`,
        proposalNumber,
        date: today,
        title: 'Community Feedback Initiative',
        description: 'Establish regular feedback sessions to improve governance processes.',
        type,
        status: 'draft',
        requiredMajority: 60,
        votingPeriod: {
          start: today,
          end: votingEnd
        },
        voting: {
          for: 0,
          against: 0,
          abstain: 0,
          participationRate: 0
        },
        metadata: {
          impactScope: 'medium',
          urgency: 'medium',
          complexityScore: 0.4,
          consensusScore: 0.7,
          stakeholderAlignment: 0.8
        }
      };
    }
  }

  private updateGovernanceMetrics(proposal: GovernanceProposal): void {
    this.governanceMetrics.totalProposals++;
    
    // Estimate updated health based on proposal quality
    const qualityScore = (
      proposal.metadata.consensusScore +
      proposal.metadata.stakeholderAlignment +
      (1 - proposal.metadata.complexityScore * 0.3) // Lower complexity is better
    ) / 3;
    
    // Update health score (weighted average)
    this.governanceMetrics.governanceHealth = 
      (this.governanceMetrics.governanceHealth * 0.9) + (qualityScore * 0.1);
  }

  /**
   * Get current governance metrics
   */
  getGovernanceMetrics(): GovernanceMetrics {
    return this.governanceMetrics;
  }

  /**
   * Update configuration
   */
  async updateConfig(newConfig: Partial<CitizenConfig>): Promise<void> {
    this.config = { ...this.config, ...newConfig };
    console.log('Updated CITIZEN configuration:', this.config);
  }
}

// Export singleton instance
export const citizenSDK = new CitizenClaudeSDK(process.env.ANTHROPIC_API_KEY);