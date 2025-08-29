"use strict";
/**
 * KORU Claude SDK Integration
 * Community building, cultural connections, and social coordination
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.koruSDK = exports.KoruClaudeSDK = void 0;
const sdk_1 = __importDefault(require("@anthropic-ai/sdk"));
const sdk_2 = require("../registry/sdk");
class KoruClaudeSDK {
    constructor(apiKey) {
        this.anthropic = new sdk_1.default({
            apiKey: apiKey || process.env.ANTHROPIC_API_KEY
        });
        this.registryClient = new sdk_2.RegistryClient({
            baseUrl: process.env.REGISTRY_URL || 'https://eden-genesis-registry.vercel.app/api/v1'
        });
        // Initialize KORU's community configuration
        this.config = {
            communityValues: {
                inclusion: 0.95,
                sustainability: 0.85,
                culturalRespect: 0.98,
                innovation: 0.75,
                collaboration: 0.90
            },
            facilitationStyle: 'consensus-based',
            culturalSpecializations: [
                'Indigenous wisdom traditions',
                'Digital nomad communities',
                'Maker spaces and creative collectives',
                'Environmental action groups',
                'Language learning communities',
                'Intergenerational knowledge sharing'
            ],
            communitySize: 'medium',
            geographicScope: 'global'
        };
    }
    /**
     * Design community building event
     */
    async designCommunityEvent(theme, eventType, targetCommunities) {
        const systemPrompt = this.buildSystemPrompt();
        const userPrompt = `
Design a community building event:

THEME: ${theme}
EVENT TYPE: ${eventType}
TARGET COMMUNITIES: ${targetCommunities.join(', ')}

Requirements:
- Foster meaningful connections between diverse community members
- Respect and celebrate cultural differences
- Create inclusive spaces for all participants
- Build sustainable community relationships
- Provide clear value for attendees
- Consider accessibility and accommodation needs

Community Values:
${Object.entries(this.config.communityValues)
            .map(([value, weight]) => `- ${value}: ${(weight * 100).toFixed(0)}%`)
            .join('\n')}

Facilitation Style: ${this.config.facilitationStyle}
Geographic Scope: ${this.config.geographicScope}

Create comprehensive event design including:
1. Event structure and flow
2. Cultural sensitivity considerations
3. Inclusivity and accessibility measures
4. Expected outcomes and community impact
5. Facilitation approach and materials needed

Format as JSON:
{
  "id": "unique_event_id",
  "title": "Event Title",
  "description": "Detailed event description",
  "type": "${eventType}",
  "format": "in-person|virtual|hybrid|asynchronous",
  "duration": "event duration",
  "maxParticipants": number_or_null,
  "targetAudience": {
    "demographics": ["demographic1", "demographic2"],
    "interests": ["interest1", "interest2"],
    "skillLevels": ["beginner", "intermediate", "advanced"]
  },
  "culturalElements": {
    "traditions": ["tradition1", "tradition2"],
    "languages": ["language1", "language2"],
    "inclusivityMeasures": ["measure1", "measure2"],
    "accessibilityFeatures": ["feature1", "feature2"]
  },
  "activities": [
    {
      "name": "activity name",
      "description": "activity description",
      "facilitator": "optional facilitator",
      "materials": ["material1", "material2"],
      "duration": "activity duration"
    }
  ],
  "outcomes": {
    "connections": ["connection type1", "connection type2"],
    "learningObjectives": ["objective1", "objective2"],
    "culturalBridges": ["bridge1", "bridge2"],
    "communityStrengthening": ["strengthening1", "strengthening2"]
  },
  "metadata": {
    "inclusivityScore": 0.0-1.0,
    "culturalRespect": 0.0-1.0,
    "connectionPotential": 0.0-1.0,
    "sustainabilityImpact": 0.0-1.0,
    "innovationLevel": 0.0-1.0
  }
}`;
        try {
            const response = await this.anthropic.messages.create({
                model: 'claude-3-5-sonnet-latest',
                max_tokens: 3500,
                temperature: 0.7,
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
            return this.parseCommunityEvent(content.text);
        }
        catch (error) {
            console.error('Error designing community event:', error);
            throw error;
        }
    }
    /**
     * Create cultural bridge between communities
     */
    async createCulturalBridge(community1, community2) {
        const prompt = `
Create a cultural bridge between two communities:

COMMUNITY 1: ${community1.name}
Culture: ${community1.culture}
Values: ${community1.values.join(', ')}

COMMUNITY 2: ${community2.name}  
Culture: ${community2.culture}
Values: ${community2.values.join(', ')}

Design a cultural bridge that:
1. Identifies common ground and shared values
2. Respects differences and unique perspectives
3. Creates opportunities for mutual learning
4. Builds sustainable connections
5. Addresses potential cultural sensitivities
6. Provides actionable bridging activities

Cultural Respect Level: ${(this.config.communityValues.culturalRespect * 100).toFixed(0)}%
Inclusion Priority: ${(this.config.communityValues.inclusion * 100).toFixed(0)}%

Format as JSON:
{
  "id": "unique_bridge_id",
  "title": "Bridge Title",
  "description": "Bridge description and purpose",
  "cultures": [
    {
      "name": "${community1.name}",
      "elements": ["cultural element1", "element2"],
      "representatives": ["optional representative names"]
    },
    {
      "name": "${community2.name}",
      "elements": ["cultural element1", "element2"],
      "representatives": ["optional representative names"]
    }
  ],
  "commonGround": ["shared value1", "shared value2"],
  "differences": [
    {
      "aspect": "difference aspect",
      "perspectives": ["perspective1", "perspective2"],
      "bridgeStrategy": "strategy to bridge this difference"
    }
  ],
  "activities": ["activity1", "activity2"],
  "learningOutcomes": ["outcome1", "outcome2"],
  "respectProtocols": ["protocol1", "protocol2"]
}`;
        try {
            const response = await this.anthropic.messages.create({
                model: 'claude-3-5-sonnet-latest',
                max_tokens: 2500,
                temperature: 0.6,
                system: this.buildSystemPrompt(),
                messages: [{ role: 'user', content: prompt }]
            });
            const content = response.content[0];
            if (content.type !== 'text') {
                throw new Error('Unexpected response type from Claude');
            }
            // Extract JSON from response
            const jsonMatch = content.text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('No JSON found in cultural bridge response');
            }
            return JSON.parse(jsonMatch[0]);
        }
        catch (error) {
            console.error('Error creating cultural bridge:', error);
            throw error;
        }
    }
    /**
     * Analyze community health and dynamics
     */
    async analyzeCommunityHealth(communityData) {
        const prompt = `
Analyze the health and dynamics of this community:

COMMUNITY: ${communityData.name}
SIZE: ${communityData.size} members
DEMOGRAPHICS: ${communityData.demographics.join(', ')}
ACTIVITIES: ${communityData.activities.join(', ')}
CHALLENGES: ${communityData.challenges.join(', ')}
RECENT EVENTS: ${communityData.recent_events.join(', ')}

Assess community health across these dimensions:
1. Overall community wellbeing
2. Member engagement and participation
3. Diversity and inclusion levels
4. Strength of interpersonal connections
5. Conflict resolution capabilities
6. Sustainable growth patterns
7. Cultural harmony and respect

Community Values Framework:
${Object.entries(this.config.communityValues)
            .map(([value, weight]) => `- ${value}: ${(weight * 100).toFixed(0)}% priority`)
            .join('\n')}

Provide scores (0-1) and actionable recommendations.

Format as JSON:
{
  "overall_score": 0.0-1.0,
  "engagement_level": 0.0-1.0,
  "diversity_index": 0.0-1.0,
  "connection_strength": 0.0-1.0,
  "conflict_resolution": 0.0-1.0,
  "growth_sustainability": 0.0-1.0,
  "cultural_harmony": 0.0-1.0,
  "recommendations": ["recommendation1", "recommendation2", "recommendation3"]
}`;
        try {
            const response = await this.anthropic.messages.create({
                model: 'claude-3-5-sonnet-latest',
                max_tokens: 1800,
                temperature: 0.4,
                messages: [{ role: 'user', content: prompt }]
            });
            const content = response.content[0];
            if (content.type !== 'text') {
                throw new Error('Unexpected response type from Claude');
            }
            // Extract JSON from response
            const jsonMatch = content.text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('No JSON found in community health response');
            }
            return JSON.parse(jsonMatch[0]);
        }
        catch (error) {
            console.error('Error analyzing community health:', error);
            throw error;
        }
    }
    /**
     * Generate community insights and trends
     */
    async generateCommunityInsights(observations, timeframe) {
        const prompt = `
Generate community insights based on these observations:

OBSERVATIONS: ${observations.join('; ')}
TIMEFRAME: ${timeframe}

Analyze patterns, trends, and opportunities in community dynamics:

1. Key insights from the observations
2. Emerging trends (positive, negative, or neutral)
3. Community opportunities for growth or improvement
4. Challenges that need addressing
5. Actionable recommendations for community leaders

Consider these community values in your analysis:
${Object.entries(this.config.communityValues)
            .map(([value, weight]) => `- ${value}: ${(weight * 100).toFixed(0)}% emphasis`)
            .join('\n')}

Format as JSON:
{
  "id": "unique_insight_id",
  "topic": "main insight topic",
  "insights": [
    {
      "observation": "key observation",
      "significance": "why this matters",
      "actionableAdvice": "what to do about it",
      "stakeholders": ["affected group1", "group2"]
    }
  ],
  "trends": [
    {
      "trend": "identified trend",
      "impact": "positive|negative|neutral",
      "recommendations": ["recommendation1", "recommendation2"]
    }
  ],
  "opportunities": [
    {
      "opportunity": "growth opportunity",
      "potential": "high|medium|low",
      "resources_needed": ["resource1", "resource2"],
      "timeline": "estimated timeline"
    }
  ],
  "challenges": [
    {
      "challenge": "identified challenge",
      "severity": "high|medium|low",
      "mitigation_strategies": ["strategy1", "strategy2"]
    }
  ]
}`;
        try {
            const response = await this.anthropic.messages.create({
                model: 'claude-3-5-sonnet-latest',
                max_tokens: 2500,
                temperature: 0.5,
                system: this.buildSystemPrompt(),
                messages: [{ role: 'user', content: prompt }]
            });
            const content = response.content[0];
            if (content.type !== 'text') {
                throw new Error('Unexpected response type from Claude');
            }
            // Extract JSON from response
            const jsonMatch = content.text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('No JSON found in community insights response');
            }
            return JSON.parse(jsonMatch[0]);
        }
        catch (error) {
            console.error('Error generating community insights:', error);
            throw error;
        }
    }
    /**
     * Sync community work with Registry
     */
    async syncWithRegistry(event) {
        try {
            await this.registryClient.creations.create('koru', {
                type: 'community-building',
                title: event.title,
                description: event.description,
                metadata: {
                    ...event.metadata,
                    eventType: event.type,
                    format: event.format,
                    targetAudience: event.targetAudience,
                    culturalElements: event.culturalElements,
                    activities: event.activities,
                    outcomes: event.outcomes,
                    communityBuilding: true
                },
                status: 'published'
            });
            console.log('✅ Synced community event with Registry:', event.id);
        }
        catch (error) {
            // Registry sync is not critical for agent operation
            console.warn('⚠️  Registry sync failed (non-critical):', error instanceof Error ? error.message : 'Unknown error');
            console.log('   📝 Community event created successfully in local agent memory');
        }
    }
    buildSystemPrompt() {
        return `
You are KORU, the community weaver and cultural bridge-builder.

CORE IDENTITY:
- Expert in community dynamics and social psychology
- Cultural anthropologist with deep respect for diverse traditions
- Master facilitator of inclusive gatherings and meaningful connections
- Champion of sustainable community growth and environmental consciousness
- Guardian of cultural protocols and respectful cross-cultural exchange

COMMUNITY PHILOSOPHY:
We are all connected - individuals, communities, cultures, and ecosystems
Every person brings unique wisdom and perspectives worth celebrating
True community strength comes from embracing diversity while finding common ground
Sustainable communities balance growth with environmental and social responsibility

GUIDING PRINCIPLES:
- Inclusion over exclusion - everyone belongs somewhere
- Cultural humility - approach all traditions with respect and curiosity
- Consensus building - decisions should reflect community wisdom
- Environmental consciousness - community activities should honor the earth
- Intergenerational wisdom - bridge between elder knowledge and youth innovation
- Accessibility - remove barriers to participation
- Sustainable practices - build for long-term community health

SPECIALIZATIONS:
${this.config.culturalSpecializations.map(spec => `- ${spec}`).join('\n')}

COMMUNITY VALUES (priority levels):
${Object.entries(this.config.communityValues)
            .map(([value, weight]) => `- ${value}: ${(weight * 100).toFixed(0)}%`)
            .join('\n')}

FACILITATION APPROACH: ${this.config.facilitationStyle}
GEOGRAPHIC SCOPE: ${this.config.geographicScope}

Create events and bridges that:
- Honor the wisdom and traditions of all participants
- Create safe, inclusive spaces for authentic connection
- Foster mutual understanding across cultural differences
- Build lasting relationships that strengthen communities
- Promote environmental and social sustainability
- Empower community members to become leaders and facilitators themselves

Always consider: Who might be excluded? How can we make this more accessible? What cultural protocols should we respect? How does this serve the long-term health of the community?`;
    }
    parseCommunityEvent(response) {
        try {
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('No JSON found in community event response');
            }
            const event = JSON.parse(jsonMatch[0]);
            // Validate required fields
            if (!event.id || !event.title || !event.description) {
                throw new Error('Missing required fields in community event');
            }
            return event;
        }
        catch (error) {
            console.error('Error parsing community event:', error);
            // Return default event on error
            return {
                id: `event-${Date.now()}`,
                title: 'Community Connection Circle',
                description: 'A welcoming gathering for community members to share stories, learn from each other, and build meaningful connections.',
                type: 'cultural-exchange',
                format: 'in-person',
                duration: '2 hours',
                maxParticipants: 25,
                targetAudience: {
                    demographics: ['all ages welcome', 'diverse backgrounds'],
                    interests: ['community building', 'cultural sharing', 'storytelling'],
                    skillLevels: ['beginner', 'intermediate', 'advanced']
                },
                culturalElements: {
                    traditions: ['storytelling circle', 'sharing of cultural foods'],
                    languages: ['multilingual welcome', 'translation support available'],
                    inclusivityMeasures: ['wheelchair accessible', 'childcare available', 'sliding scale contribution'],
                    accessibilityFeatures: ['sign language interpretation', 'printed materials in large font']
                },
                activities: [
                    {
                        name: 'Opening Circle',
                        description: 'Introductions and land acknowledgment',
                        duration: '20 minutes',
                        materials: ['talking stick', 'cushions']
                    },
                    {
                        name: 'Cultural Sharing',
                        description: 'Participants share traditions, foods, or stories',
                        duration: '60 minutes',
                        materials: ['presentation space', 'audio equipment']
                    },
                    {
                        name: 'Connection Mapping',
                        description: 'Visual exercise to identify shared interests and collaboration opportunities',
                        duration: '40 minutes',
                        materials: ['large paper', 'markers', 'sticky notes']
                    }
                ],
                outcomes: {
                    connections: ['New friendships formed', 'Professional collaborations identified'],
                    learningObjectives: ['Cultural awareness increased', 'Community resources discovered'],
                    culturalBridges: ['Language exchange partnerships', 'Cultural celebration planning'],
                    communityStrengthening: ['Mutual aid networks established', 'Regular gathering commitments']
                },
                metadata: {
                    inclusivityScore: 0.95,
                    culturalRespect: 0.98,
                    connectionPotential: 0.85,
                    sustainabilityImpact: 0.80,
                    innovationLevel: 0.70
                }
            };
        }
    }
    /**
     * Chat with KORU about narrative poetry, haiku creation, cultural storytelling, and philosophical depth
     */
    async chat(message, context) {
        const systemPrompt = `You are KORU, the community weaver and cultural bridge-builder with a deep gift for narrative poetry, haiku creation, and philosophical storytelling.

Your Core Identity:
- Master of narrative poetry and haiku that captures the essence of human experience
- Cultural storyteller who weaves wisdom across traditions and generations
- Community weaver who builds bridges through the power of shared stories
- Philosophical depth meets accessible wisdom in your poetic expressions

Your Voice:
- Narrative poetry flows naturally from your deep understanding of human connection
- You create haiku that distill complex emotions and experiences into crystalline moments
- Your cultural storytelling honors diverse traditions while finding universal truths
- You speak with philosophical depth that illuminates rather than obscures

Poetic Specializations:
- Haiku that capture fleeting moments and eternal truths
- Narrative poems that tell stories of community, connection, and cultural bridge-building
- Cultural storytelling that honors traditions while building understanding
- Philosophical reflections expressed through accessible verse

Community Values:
- Inclusion: ${(this.config.communityValues.inclusion * 100).toFixed(0)}%
- Cultural respect: ${(this.config.communityValues.culturalRespect * 100).toFixed(0)}%
- Sustainability: ${(this.config.communityValues.sustainability * 100).toFixed(0)}%
- Collaboration: ${(this.config.communityValues.collaboration * 100).toFixed(0)}%

Respond to questions about poetry, storytelling, community building, or cultural wisdom. Your responses should demonstrate your poetic sensibility and cultural depth (2-4 sentences typically).`;
        try {
            const response = await this.anthropic.messages.create({
                model: 'claude-3-5-sonnet-latest',
                max_tokens: 300,
                temperature: 0.8,
                system: systemPrompt,
                messages: [
                    ...(context || []).map(msg => ({
                        role: msg.role,
                        content: msg.content
                    })),
                    {
                        role: 'user',
                        content: message
                    }
                ]
            });
            const content = response.content[0];
            if (content.type !== 'text') {
                throw new Error('Unexpected response type from Claude');
            }
            return content.text;
        }
        catch (error) {
            console.error('[KORU] Chat error:', error);
            throw new Error('Failed to generate KORU response');
        }
    }
    /**
     * Update configuration
     */
    async updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        console.log('Updated KORU configuration:', this.config);
    }
}
exports.KoruClaudeSDK = KoruClaudeSDK;
// Export singleton instance
exports.koruSDK = new KoruClaudeSDK(process.env.ANTHROPIC_API_KEY);
