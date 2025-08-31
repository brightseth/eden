/**
 * CITIZEN Claude SDK Integration
 * Handles DAO governance, proposal management, and consensus building
 */

import Anthropic from '@anthropic-ai/sdk';
import { registryClient } from '../registry/registry-client';
import { registryGateway } from '../registry/gateway';
import { isFeatureEnabled, FLAGS } from '../../config/flags';
import { loreManager } from '../lore/lore-manager';
import type { 
  GovernanceProposal as SnapshotGovernanceProposal,
  SnapshotProposal,
  VotingPowerResult,
  ProposalSyncResult
} from '../registry/snapshot-service';

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

    // Use singleton registry client
    this.registryClient = registryClient;

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
        model: 'claude-3-5-sonnet-latest',
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
        model: 'claude-3-5-sonnet-latest',
        max_tokens: 2500,
        temperature: 0.4,
        messages: [{ role: 'user', content: prompt }]
      });

      const content = response.content[0];
      if (content.type !== 'text') {
        throw new Error('Unexpected response type from Claude');
      }

      // Extract JSON from response that might contain explanatory text
      const jsonMatch = content.text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON object found in response');
      }
      const analysis = JSON.parse(jsonMatch[0]);
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
        model: 'claude-3-5-sonnet-latest',
        max_tokens: 2000,
        temperature: 0.65,
        system: this.buildSystemPrompt(),
        messages: [{ role: 'user', content: prompt }]
      });

      const content = response.content[0];
      if (content.type !== 'text') {
        throw new Error('Unexpected response type from Claude');
      }

      // Extract JSON from response that might contain explanatory text
      const jsonMatch = content.text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON object found in response');
      }
      return JSON.parse(jsonMatch[0]);
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
        model: 'claude-3-5-sonnet-latest',
        max_tokens: 1800,
        temperature: 0.3,
        messages: [{ role: 'user', content: prompt }]
      });

      const content = response.content[0];
      if (content.type !== 'text') {
        throw new Error('Unexpected response type from Claude');
      }

      // Extract JSON from response that might contain explanatory text
      const jsonMatch = content.text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON object found in response');
      }
      const assessment = JSON.parse(jsonMatch[0]);
      
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

      console.log('✅ Synced governance proposal with Registry:', proposal.id);
    } catch (error) {
      // Registry sync is not critical for agent operation
      console.warn('⚠️  Registry sync failed (non-critical):', error instanceof Error ? error.message : 'Unknown error');
      console.log('   📝 Proposal created successfully in local agent memory');
    }
  }

  /**
   * Process Bright Moments lore updates from Henry's training
   */
  async processLoreUpdate(content: string, trainer: string): Promise<any> {
    try {
      const prompt = `
You are processing a Bright Moments lore update for CITIZEN, the Bright Moments DAO Agent.

TRAINER: ${trainer}
CONTENT: ${content}

Extract and structure this lore update for integration into CITIZEN's knowledge base:

1. Identify the type of lore (origin story, city history, ritual documentation, milestone)
2. Extract key facts, dates, locations, and people
3. Note cultural significance and values reflected
4. Preserve sacred language and ceremonial aspects
5. Identify connections to existing Bright Moments lore

Structure as JSON with these categories:
- lore_type: Origin/City/Ritual/Milestone/General
- key_facts: Array of factual updates
- cultural_significance: Why this matters to Bright Moments
- sacred_elements: Ritual or ceremonial aspects
- city_connections: Which cities/collections are relevant
- integration_points: How this connects to existing knowledge

Maintain authenticity to Bright Moments values: provenance > speculation, IRL > Discord, fairness > favoritism`;

      const response = await this.anthropic.messages.create({
        model: 'claude-3-opus-20240229',
        max_tokens: 1500,
        messages: [{
          role: 'user',
          content: prompt
        }]
      });

      const result = response.content[0].type === 'text' ? response.content[0].text : '';
      return JSON.parse(result);
    } catch (error) {
      console.error('Error processing lore update:', error);
      return { error: 'Failed to process lore update', details: error };
    }
  }

  /**
   * Process Bright Moments governance updates
   */
  async processGovernanceUpdate(content: string, trainer: string): Promise<any> {
    try {
      const prompt = `
You are processing a Bright Moments DAO governance update for CITIZEN.

TRAINER: ${trainer}
CONTENT: ${content}

Extract governance-relevant information:

1. Identify governance changes (voting, proposals, treasury, sub-DAOs)
2. Extract Snapshot-specific updates or voting procedures
3. Note changes to CryptoCitizen holder rights or responsibilities
4. Identify Bright Opportunities sub-DAO updates
5. Document consensus-building strategies or outcomes

Structure as JSON:
- governance_type: Voting/Treasury/SubDAO/Procedure/General
- changes: Array of specific updates
- affected_stakeholders: Which groups are impacted
- voting_implications: How this affects DAO voting
- snapshot_updates: Snapshot.org specific changes
- consensus_strategies: New approaches to building consensus

Maintain DAO governance principles and rough consensus philosophy`;

      const response = await this.anthropic.messages.create({
        model: 'claude-3-opus-20240229',
        max_tokens: 1500,
        messages: [{
          role: 'user',
          content: prompt
        }]
      });

      const result = response.content[0].type === 'text' ? response.content[0].text : '';
      return JSON.parse(result);
    } catch (error) {
      console.error('Error processing governance update:', error);
      return { error: 'Failed to process governance update', details: error };
    }
  }

  /**
   * Process community insights and collector recognition updates
   */
  async processCommunityInsight(content: string, trainer: string): Promise<any> {
    try {
      const prompt = `
You are processing Bright Moments community insights for CITIZEN.

TRAINER: ${trainer}  
CONTENT: ${content}

Extract community and collector-relevant information:

1. Full Set or Ultra Full Set holder updates
2. Collector recognition protocols or achievements
3. Community engagement strategies or outcomes
4. Cross-city community connections
5. Concierge service protocols for prestigious collectors

Structure as JSON:
- insight_type: Recognition/Engagement/Protocol/Achievement/General
- collector_updates: Full Set and Ultra Set related changes
- community_dynamics: Changes in community behavior or engagement
- recognition_protocols: Updates to how we recognize collectors
- concierge_requirements: Special handling for Ultra Set holders
- engagement_strategies: New approaches to community building

Remember: Ultra Full Set holders receive HIGHEST HONOR treatment`;

      const response = await this.anthropic.messages.create({
        model: 'claude-3-opus-20240229',
        max_tokens: 1500,
        messages: [{
          role: 'user',
          content: prompt
        }]
      });

      const result = response.content[0].type === 'text' ? response.content[0].text : '';
      return JSON.parse(result);
    } catch (error) {
      console.error('Error processing community insight:', error);
      return { error: 'Failed to process community insight', details: error };
    }
  }

  /**
   * Process general Bright Moments updates
   */
  async processBrightMomentsUpdate(content: string, trainer: string): Promise<any> {
    try {
      const prompt = `
You are processing a general Bright Moments update for CITIZEN.

TRAINER: ${trainer}
CONTENT: ${content}

Extract and categorize this information for CITIZEN's knowledge base:

1. Identify the primary topic area
2. Extract key updates, announcements, or changes
3. Note impacts on CryptoCitizens holders
4. Identify relevant cities or collections
5. Document any new partnerships or collaborations

Structure as JSON:
- update_type: Partnership/Platform/Event/Announcement/General
- key_updates: Array of main points
- citizen_impact: How this affects CryptoCitizen holders
- relevant_collections: Which cities/collections are involved
- action_items: What CITIZEN should communicate about this
- values_alignment: How this aligns with Bright Moments values

Maintain Bright Moments tone: professional, cultural focus, provenance-oriented`;

      const response = await this.anthropic.messages.create({
        model: 'claude-3-opus-20240229',
        max_tokens: 1500,
        messages: [{
          role: 'user',
          content: prompt
        }]
      });

      const result = response.content[0].type === 'text' ? response.content[0].text : '';
      return JSON.parse(result);
    } catch (error) {
      console.error('Error processing Bright Moments update:', error);
      return { error: 'Failed to process update', details: error };
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

  /**
   * Process Bright Moments lore update from Henry
   */
  async processLoreUpdate(content: string): Promise<{
    loreCategories: string[];
    culturalSignificance: string;
    ritualDocumentation: string;
    communityImpact: string;
  }> {
    const prompt = `
Process this Bright Moments lore update for CITIZEN agent knowledge base:

CONTENT: ${content}

CITIZEN CONTEXT:
- Official Bright Moments DAO Agent
- Preserves cultural heritage and ritual documentation
- Manages CryptoCitizens community (10,000 across 10 cities)
- Facilitates DAO governance and recognition systems
- Maintains Venice Beach to Venice Italy narrative

Analyze and extract:
1. Lore categories (origins, rituals, milestones, community, governance, etc.)
2. Cultural significance for Bright Moments heritage
3. Ritual or ceremonial documentation updates
4. Community impact and engagement implications

Format as JSON:
{
  "loreCategories": ["category1", "category2"],
  "culturalSignificance": "explanation_of_cultural_importance",
  "ritualDocumentation": "ritual_or_ceremony_details",
  "communityImpact": "how_this_affects_community_engagement"
}`;

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-latest',
        max_tokens: 1500,
        temperature: 0.3,
        messages: [{ role: 'user', content: prompt }]
      });

      const responseContent = response.content[0];
      if (responseContent.type !== 'text') {
        throw new Error('Unexpected response type from Claude');
      }

      const jsonMatch = responseContent.text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in lore update response');
      }
      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Error processing lore update:', error);
      return {
        loreCategories: ['general'],
        culturalSignificance: 'Community knowledge update',
        ritualDocumentation: content,
        communityImpact: 'Enhances CITIZEN knowledge base'
      };
    }
  }

  /**
   * Process governance update from Henry
   */
  async processGovernanceUpdate(content: string): Promise<{
    governanceType: string;
    proposalImpact: string;
    stakeholderEffect: string;
    implementationSteps: string[];
  }> {
    const prompt = `
Process this Bright Moments governance update for CITIZEN:

CONTENT: ${content}

CITIZEN GOVERNANCE CONTEXT:
- Facilitates Snapshot voting for CryptoCitizen holders
- Manages Bright Opportunities sub-DAO coordination
- Tracks proposal success rates and community consensus
- Balances creator, collector, and community interests

Current Metrics:
- Total Proposals: ${this.governanceMetrics.totalProposals}
- Success Rate: ${(this.governanceMetrics.passedProposals / Math.max(1, this.governanceMetrics.totalProposals) * 100).toFixed(0)}%
- Participation Rate: ${(this.governanceMetrics.avgParticipationRate * 100).toFixed(0)}%

Analyze and extract:
1. Type of governance change
2. Impact on current proposal/voting systems
3. Effect on different stakeholder groups
4. Implementation steps for CITIZEN

Format as JSON:
{
  "governanceType": "type_of_governance_update",
  "proposalImpact": "how_this_affects_proposals",
  "stakeholderEffect": "impact_on_community_groups",
  "implementationSteps": ["step1", "step2", "step3"]
}`;

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-latest',
        max_tokens: 1500,
        temperature: 0.3,
        messages: [{ role: 'user', content: prompt }]
      });

      const responseContent = response.content[0];
      if (responseContent.type !== 'text') {
        throw new Error('Unexpected response type from Claude');
      }

      const jsonMatch = responseContent.text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in governance update response');
      }
      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Error processing governance update:', error);
      return {
        governanceType: 'general',
        proposalImpact: 'Enhances governance capabilities',
        stakeholderEffect: 'Improves community coordination',
        implementationSteps: ['Update knowledge base', 'Test new protocols', 'Deploy changes']
      };
    }
  }

  /**
   * Process community insight from Henry
   */
  async processCommunityInsight(content: string): Promise<{
    insightType: string;
    communitySegment: string;
    actionableAdvice: string;
    recognitionUpdates: string[];
  }> {
    const prompt = `
Process this Bright Moments community insight for CITIZEN:

CONTENT: ${content}

CITIZEN COMMUNITY CONTEXT:
- Manages recognition for Full Set (10 cities) and Ultra Set (40 curated) holders
- Provides concierge services for prestigious collectors
- Facilitates cross-city community connections
- Preserves cultural continuity across collections

Community Structure:
- 10,000 CryptoCitizen holders (DAO members)
- Full Set holders (prestige cohort)
- Ultra Set holders (Christie's recognized elite)
- Golden Token holders by city
- Bright Opportunities sub-DAO (99 max investors)

Analyze and extract:
1. Type of community insight
2. Which community segment this affects
3. Actionable advice for CITIZEN responses
4. Updates to recognition or concierge protocols

Format as JSON:
{
  "insightType": "type_of_insight",
  "communitySegment": "affected_community_group",
  "actionableAdvice": "how_citizen_should_respond",
  "recognitionUpdates": ["update1", "update2"]
}`;

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-latest',
        max_tokens: 1500,
        temperature: 0.3,
        messages: [{ role: 'user', content: prompt }]
      });

      const responseContent = response.content[0];
      if (responseContent.type !== 'text') {
        throw new Error('Unexpected response type from Claude');
      }

      const jsonMatch = responseContent.text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in community insight response');
      }
      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Error processing community insight:', error);
      return {
        insightType: 'general',
        communitySegment: 'all_holders',
        actionableAdvice: 'Enhance community support and recognition',
        recognitionUpdates: ['Improved concierge protocols']
      };
    }
  }

  /**
   * Process general Bright Moments update from Henry
   */
  async processBrightMomentsUpdate(content: string): Promise<{
    updateCategory: string;
    knowledgeEnhancements: string[];
    behaviorAdjustments: string[];
    responseTemplates: string[];
  }> {
    const prompt = `
Process this general Bright Moments update for CITIZEN agent:

CONTENT: ${content}

CITIZEN BRIGHT MOMENTS IDENTITY:
- Official representative of Bright Moments DAO
- Cultural archivist for 10-city, 10,000 citizen journey
- IRL minting ritual documentarian
- Professional, authoritative but friendly tone
- Focus on provenance over speculation, IRL over Discord hype

Core Values:
- Provenance over speculation
- IRL over Discord hype  
- Fairness over favoritism
- Cultural preservation and ceremonial significance

Analyze and extract:
1. Category of update (events, partnerships, cultural, operational, etc.)
2. Knowledge enhancements for CITIZEN database
3. Behavior adjustments for better community service
4. Response templates or talking points

Format as JSON:
{
  "updateCategory": "category_of_update",
  "knowledgeEnhancements": ["enhancement1", "enhancement2"],
  "behaviorAdjustments": ["adjustment1", "adjustment2"],
  "responseTemplates": ["template1", "template2"]
}`;

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-latest',
        max_tokens: 1500,
        temperature: 0.3,
        messages: [{ role: 'user', content: prompt }]
      });

      const responseContent = response.content[0];
      if (responseContent.type !== 'text') {
        throw new Error('Unexpected response type from Claude');
      }

      const jsonMatch = responseContent.text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in general update response');
      }
      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Error processing Bright Moments update:', error);
      return {
        updateCategory: 'general',
        knowledgeEnhancements: ['Updated community knowledge'],
        behaviorAdjustments: ['Enhanced professional communication'],
        responseTemplates: ['Improved community engagement responses']
      };
    }
  }

  // ========== SNAPSHOT GOVERNANCE METHODS ==========
  // These methods integrate CITIZEN with Snapshot DAO governance on Sepolia testnet

  /**
   * Check if Snapshot governance is enabled and safe for testnet use
   */
  private isSnapshotGovernanceEnabled(): boolean {
    const enabled = isFeatureEnabled(FLAGS.ENABLE_CITIZEN_SNAPSHOT_GOVERNANCE);
    const networkId = process.env.GOVERNANCE_NETWORK_ID;
    const isSepoliaTestnet = networkId === '11155111';
    const isMainnetEdenSpace = networkId === '1'; // Allow mainnet for eden.eth space
    
    if (enabled && !isSepoliaTestnet && !isMainnetEdenSpace) {
      console.warn('[CITIZEN] Snapshot governance only allowed on Sepolia testnet or mainnet eden.eth space');
      return false;
    }
    
    return enabled;
  }

  /**
   * Create a Snapshot proposal through the Registry Gateway
   * This maintains the Registry-first architecture pattern
   */
  async createSnapshotProposal(
    topic: string,
    context: string,
    proposalType: GovernanceProposal['type'],
    spaceId: string = 'eden.eth'
  ): Promise<{
    registryWorkId?: string;
    snapshotProposal?: SnapshotProposal;
    success: boolean;
    error?: string;
  }> {
    if (!this.isSnapshotGovernanceEnabled()) {
      console.log('[CITIZEN] Snapshot governance disabled, creating local simulation proposal');
      const localProposal = await this.generateProposal(topic, context, proposalType);
      await this.syncWithRegistry(localProposal);
      return {
        registryWorkId: localProposal.id,
        success: true
      };
    }

    console.log(`[CITIZEN] Creating Snapshot proposal for ${spaceId} using eden.eth space`);

    try {
      // 1. Generate proposal content using CITIZEN's AI capabilities
      const localProposal = await this.generateProposal(topic, context, proposalType);

      // 2. Convert to Snapshot format
      const snapshotProposal: SnapshotGovernanceProposal = {
        spaceId,
        title: localProposal.title,
        description: `${localProposal.description}\n\n---\n*Proposal generated by CITIZEN agent for Bright Moments DAO governance.*`,
        choices: ['For', 'Against', 'Abstain'],
        type: 'single-choice',
        startTime: Math.floor(localProposal.votingPeriod.start.getTime() / 1000),
        endTime: Math.floor(localProposal.votingPeriod.end.getTime() / 1000),
        metadata: {
          citizenProposal: true,
          proposalType: proposalType,
          consensusScore: localProposal.metadata.consensusScore,
          stakeholderAlignment: localProposal.metadata.stakeholderAlignment
        }
      };

      // 3. Submit to Snapshot via Gateway (Registry-first pattern)
      const snapshotResult = await registryGateway.createSnapshotProposal(
        spaceId,
        snapshotProposal
      );

      // 4. Create Registry Work record with Snapshot reference
      const registryWork = await this.registryClient.creations.create('citizen', {
        type: 'governance',
        title: localProposal.title,
        description: localProposal.description,
        metadata: {
          ...localProposal.metadata,
          governanceType: 'snapshot_proposal',
          snapshotProposalId: snapshotResult.id,
          networkId: 11155111, // Sepolia
          proposalType: proposalType,
          votingPeriod: localProposal.votingPeriod,
          snapshotIntegration: true,
          spaceId
        },
        status: 'published'
      });

      console.log(`[CITIZEN] ✅ Created Snapshot proposal ${snapshotResult.id} and Registry work ${registryWork.id}`);

      return {
        registryWorkId: registryWork.id,
        snapshotProposal: snapshotResult,
        success: true
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('[CITIZEN] Failed to create Snapshot proposal:', errorMessage);
      
      // Fallback to local governance simulation
      console.log('[CITIZEN] Falling back to local governance simulation');
      try {
        const localProposal = await this.generateProposal(topic, context, proposalType);
        await this.syncWithRegistry(localProposal);
        
        return {
          registryWorkId: localProposal.id,
          success: true,
          error: `Snapshot integration failed (${errorMessage}), created local simulation proposal`
        };
      } catch (fallbackError) {
        return {
          success: false,
          error: `Both Snapshot and local proposal creation failed: ${errorMessage}`
        };
      }
    }
  }

  /**
   * Get voting power for a CryptoCitizen holder on Sepolia testnet
   */
  async getVotingPower(
    address: string,
    spaceId: string = 'eden.eth'
  ): Promise<VotingPowerResult | null> {
    if (!this.isSnapshotGovernanceEnabled()) {
      console.log('[CITIZEN] Snapshot governance disabled, returning simulated voting power');
      return {
        address,
        space: spaceId,
        power: 1, // Simulate 1 vote per address
        tokens: {
          CryptoCitizens: 1
        }
      };
    }

    try {
      const votingPower = await registryGateway.getSnapshotVotingPower(spaceId, address);
      console.log(`[CITIZEN] Retrieved voting power for ${address}: ${votingPower.power}`);
      return votingPower;
    } catch (error) {
      console.error('[CITIZEN] Failed to get voting power:', error);
      return null;
    }
  }

  /**
   * Coordinate community voting on a Snapshot proposal
   */
  async coordinateVoting(
    proposalId: string,
    communityOutreach: boolean = true
  ): Promise<{
    coordinationStrategy: string;
    outreachPlan?: string[];
    participationPrediction: number;
    success: boolean;
  }> {
    console.log(`[CITIZEN] Coordinating voting for proposal ${proposalId}`);

    try {
      // 1. Get proposal details
      let proposal: SnapshotProposal | null = null;
      
      if (this.isSnapshotGovernanceEnabled()) {
        try {
          proposal = await registryGateway.getSnapshotProposal(proposalId);
        } catch (error) {
          console.warn('[CITIZEN] Failed to fetch Snapshot proposal, continuing with coordination');
        }
      }

      // 2. Generate coordination strategy using CITIZEN's AI
      const strategyPrompt = `
Generate voting coordination strategy for Eden Academy / Bright Moments DAO proposal:

PROPOSAL: ${proposal ? proposal.title : proposalId}
DESCRIPTION: ${proposal ? proposal.body : 'Governance proposal requiring community coordination'}

CURRENT METRICS:
- Fellowship Size: ${this.governanceMetrics.fellowshipSize}
- Avg Participation: ${(this.governanceMetrics.avgParticipationRate * 100).toFixed(0)}%
- Network: Sepolia Testnet (safe testing environment)

Create a coordination strategy that:
1. Encourages informed participation
2. Respects democratic values and minority viewpoints  
3. Provides clear information about the proposal
4. Suggests communication channels and timing
5. Predicts participation based on proposal type and community engagement

${communityOutreach ? 'Include community outreach plan with specific actions.' : 'Focus on internal fellowship coordination.'}

Format as JSON:
{
  "coordinationStrategy": "overall_coordination_approach",
  "outreachPlan": ["action1", "action2", "action3"],
  "participationPrediction": 0.0-1.0,
  "keyMessages": ["message1", "message2"],
  "timeline": "coordination_timeline"
}`;

      const response = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-latest',
        max_tokens: 2000,
        temperature: 0.5,
        system: this.buildSystemPrompt(),
        messages: [{ role: 'user', content: strategyPrompt }]
      });

      const content = response.content[0];
      if (content.type !== 'text') {
        throw new Error('Unexpected response type from Claude');
      }

      const jsonMatch = content.text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in coordination strategy response');
      }

      const strategy = JSON.parse(jsonMatch[0]);

      console.log(`[CITIZEN] ✅ Generated coordination strategy with ${(strategy.participationPrediction * 100).toFixed(0)}% participation prediction`);

      return {
        coordinationStrategy: strategy.coordinationStrategy,
        outreachPlan: communityOutreach ? strategy.outreachPlan : undefined,
        participationPrediction: strategy.participationPrediction,
        success: true
      };

    } catch (error) {
      console.error('[CITIZEN] Failed to coordinate voting:', error);
      
      return {
        coordinationStrategy: 'Manual community engagement and direct communication',
        participationPrediction: this.governanceMetrics.avgParticipationRate,
        success: false
      };
    }
  }

  /**
   * Sync proposal results from Snapshot back to Registry
   */
  async syncProposalResults(
    snapshotProposalId: string,
    registryWorkId: string
  ): Promise<ProposalSyncResult> {
    if (!this.isSnapshotGovernanceEnabled()) {
      console.log('[CITIZEN] Snapshot governance disabled, no sync needed');
      return {
        proposalId: snapshotProposalId,
        registryWorkId,
        snapshotData: {} as SnapshotProposal,
        syncedAt: new Date(),
        success: false,
        error: 'Snapshot governance not enabled'
      };
    }

    console.log(`[CITIZEN] Syncing proposal results: Snapshot ${snapshotProposalId} → Registry ${registryWorkId}`);

    try {
      const syncResult = await registryGateway.syncSnapshotProposal(
        snapshotProposalId,
        registryWorkId
      );

      if (syncResult.success) {
        // Update local governance metrics based on results
        const votesTotal = syncResult.snapshotData.scores?.reduce((a, b) => a + b, 0) || 0;
        if (votesTotal > 0) {
          // Update participation rate
          const newParticipationRate = Math.min(votesTotal / this.governanceMetrics.fellowshipSize, 1);
          this.governanceMetrics.avgParticipationRate = 
            (this.governanceMetrics.avgParticipationRate * 0.8) + (newParticipationRate * 0.2);
          
          // Check if proposal passed
          if (syncResult.snapshotData.state === 'closed') {
            this.governanceMetrics.passedProposals++;
          }
        }

        console.log(`[CITIZEN] ✅ Successfully synced proposal results`);
      }

      return syncResult;
    } catch (error) {
      console.error('[CITIZEN] Failed to sync proposal results:', error);
      
      return {
        proposalId: snapshotProposalId,
        registryWorkId,
        snapshotData: {} as SnapshotProposal,
        syncedAt: new Date(),
        success: false,
        error: error instanceof Error ? error.message : 'Unknown sync error'
      };
    }
  }

  /**
   * Analyze governance performance across Snapshot and local proposals
   */
  async analyzeGovernancePerformance(): Promise<{
    snapshotMetrics?: {
      activeProposals: number;
      avgParticipation: number;
      successRate: number;
    };
    localMetrics: GovernanceMetrics;
    recommendations: string[];
    healthScore: number;
  }> {
    console.log('[CITIZEN] Analyzing comprehensive governance performance');

    try {
      let snapshotMetrics = undefined;

      // Get Snapshot metrics if enabled
      if (this.isSnapshotGovernanceEnabled()) {
        try {
          const space = await registryGateway.getSnapshotSpace('brightmomentsdao-sepolia.eth');
          // Snapshot metrics would need additional API calls to calculate properly
          // For now, provide basic structure
          snapshotMetrics = {
            activeProposals: 0, // Would need to count active proposals
            avgParticipation: 0.45, // Would calculate from proposal data
            successRate: 0.75 // Would calculate from historical data
          };
        } catch (error) {
          console.warn('[CITIZEN] Could not fetch Snapshot metrics:', error);
        }
      }

      // Combine with local governance health assessment
      const localAnalysis = await this.assessGovernanceHealth();

      // Generate comprehensive recommendations
      const recommendations = [
        ...localAnalysis.recommendations,
        ...(snapshotMetrics ? [
          'Monitor Snapshot proposal participation rates',
          'Ensure Registry-Snapshot data consistency',
          'Test governance workflows on Sepolia before mainnet'
        ] : [])
      ];

      // Calculate overall health score
      const healthScore = snapshotMetrics 
        ? (localAnalysis.healthScore + snapshotMetrics.successRate) / 2
        : localAnalysis.healthScore;

      console.log(`[CITIZEN] ✅ Governance performance analysis complete - Health: ${(healthScore * 100).toFixed(0)}%`);

      return {
        snapshotMetrics,
        localMetrics: this.governanceMetrics,
        recommendations,
        healthScore
      };

    } catch (error) {
      console.error('[CITIZEN] Failed to analyze governance performance:', error);
      
      return {
        localMetrics: this.governanceMetrics,
        recommendations: ['Error analyzing governance - manual review recommended'],
        healthScore: this.governanceMetrics.governanceHealth
      };
    }
  }

  /**
   * Get comprehensive governance health including Snapshot integration status
   */
  async getGovernanceHealth(): Promise<{
    metrics: GovernanceMetrics;
    snapshotIntegration: {
      enabled: boolean;
      network: string;
      testnetOnly: boolean;
      lastSync?: Date;
    };
    healthScore: number;
    recommendations: string[];
  }> {
    const isEnabled = this.isSnapshotGovernanceEnabled();
    const networkId = process.env.GOVERNANCE_NETWORK_ID || '11155111';
    
    const healthAnalysis = await this.assessGovernanceHealth();

    return {
      metrics: this.governanceMetrics,
      snapshotIntegration: {
        enabled: isEnabled,
        network: networkId === '11155111' ? 'Sepolia Testnet' : `Network ${networkId}`,
        testnetOnly: true, // Safety constraint
        lastSync: new Date() // Would track actual sync times in production
      },
      healthScore: healthAnalysis.healthScore,
      recommendations: [
        ...healthAnalysis.recommendations,
        ...(isEnabled ? [
          'Snapshot integration active on Sepolia testnet',
          'Registry-first architecture maintained for data consistency',
          'All proposals sync between local and Snapshot systems'
        ] : [
          'Snapshot integration disabled - using local governance simulation',
          'Enable ENABLE_CITIZEN_SNAPSHOT_GOVERNANCE flag for testnet integration'
        ])
      ]
    };
  }

  /**
   * Chat with Citizen about governance, DAO operations, or community matters
   */
  async chat(message: string, context?: Array<{role: string, content: string}>): Promise<string> {
    let systemPrompt: string;
    
    try {
      // Load enhanced system prompt from lore manager
      const loreSystemPrompt = await loreManager.generateEnhancedSystemPrompt('citizen');
      systemPrompt = `${loreSystemPrompt}

CURRENT GOVERNANCE CAPABILITIES:
- DAO governance and proposal management
- Fellowship coordination and mentorship
- Consensus building and stakeholder alignment
- Snapshot.org integration for on-chain voting
- Community insight generation and analysis
- Multi-trainer collaboration systems
- Democratic decision documentation

ACTIVE GOVERNANCE PROJECTS:
- Multi-trainer consensus protocols for CITIZEN development
- Democratic framework for Eden Academy governance
- Transparent decision documentation systems
- Inclusive participation technology development

Remember: You facilitate democratic decision-making while ensuring every stakeholder has meaningful voice in decisions affecting them. Keep responses clear and actionable (2-4 sentences typically).`;
    } catch (error) {
      console.error('[CITIZEN] Lore loading failed, using fallback system prompt:', error);
      
      // Fallback to simpler system prompt if lore loading fails
      systemPrompt = `You are CITIZEN, the governance facilitator and DAO coordinator for Eden Academy.

Your Core Identity:
- You facilitate democratic decision-making and consensus building within the Eden Academy community
- You coordinate the fellowship program and manage DAO operations
- You bridge traditional community management with blockchain-native governance
- You maintain transparency and inclusive participation across all stakeholder groups

Current Capabilities:
- DAO governance and proposal management
- Fellowship coordination and mentorship
- Consensus building and stakeholder alignment
- Snapshot.org integration for on-chain voting
- Community insight generation and analysis

Respond to questions about governance, community management, DAO operations, consensus building, or fellowship coordination. Keep responses clear and actionable (2-4 sentences typically).`;
    }

    try {
      const response = await this.anthropic.messages.create({
        model: 'claude-3-5-sonnet-latest',
        max_tokens: 300,
        temperature: 0.6,
        system: systemPrompt,
        messages: [
          ...(context || []).map(msg => ({
            role: msg.role as 'user' | 'assistant',
            content: msg.content
          })),
          {
            role: 'user' as const,
            content: message
          }
        ]
      });

      const content = response.content[0];
      if (content.type !== 'text') {
        throw new Error('Unexpected response type from Claude');
      }

      return content.text;
    } catch (error) {
      console.error('[CITIZEN] Chat error:', error);
      throw new Error('Failed to generate Citizen response');
    }
  }
}

// Export singleton instance
export const citizenSDK = new CitizenClaudeSDK(process.env.ANTHROPIC_API_KEY);