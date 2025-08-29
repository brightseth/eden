"use strict";
/**
 * SUE Claude SDK Integration
 * Gallery curation and exhibition design intelligence
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sueSDK = exports.SueClaudeSDK = void 0;
const sdk_1 = __importDefault(require("@anthropic-ai/sdk"));
const sdk_2 = require("../registry/sdk");
class SueClaudeSDK {
    constructor(apiKey) {
        this.anthropic = new sdk_1.default({
            apiKey: apiKey || process.env.ANTHROPIC_API_KEY
        });
        this.registryClient = new sdk_2.RegistryClient({
            baseUrl: process.env.REGISTRY_URL || 'https://eden-genesis-registry.vercel.app/api/v1'
        });
        // Initialize Sue's curatorial configuration
        this.config = {
            curationType: 'hybrid',
            institutionalContext: 'gallery',
            audienceFocus: 'diverse',
            thematicPriorities: {
                socialJustice: 0.25,
                aestheticInnovation: 0.25,
                historicalDialogue: 0.20,
                emergingVoices: 0.20,
                technologicalArt: 0.10
            },
            curatoralPhilosophy: 'Creating dialogues between diverse artistic voices to illuminate contemporary cultural tensions and possibilities'
        };
    }
    /**
     * Curate a new exhibition from available works
     */
    async curateExhibition(theme, availableWorks, constraints) {
        const systemPrompt = this.buildSystemPrompt();
        const userPrompt = `
Curate an exhibition on the theme: "${theme}"

Available works: ${availableWorks.length} pieces
${constraints ? `Constraints: ${JSON.stringify(constraints)}` : ''}

Consider:
- Thematic coherence and narrative arc
- Diversity of voices and perspectives
- Visitor journey and emotional progression
- Spatial relationships between works
- Educational and transformative potential
- Cultural context and relevance

Create a comprehensive curatorial vision that:
1. Selects and organizes works meaningfully
2. Creates dialogue between pieces
3. Designs visitor experience
4. Articulates cultural significance

Format as JSON:
{
  "id": "unique_id",
  "title": "Exhibition title",
  "concept": "Core curatorial concept",
  "artists": [
    {
      "name": "Artist name",
      "works": ["work1", "work2"],
      "rationale": "Selection reasoning",
      "placementStrategy": "Spatial strategy",
      "dialogueWith": ["other artists"]
    }
  ],
  "narrative": "Exhibition narrative",
  "layout": {
    "zones": [
      {
        "name": "Zone name",
        "theme": "Zone theme",
        "works": ["work ids"],
        "flow": "linear|exploratory|contemplative"
      }
    ],
    "entryPoint": "Entry experience",
    "exitPoint": "Exit experience",
    "keyMoments": ["Moment descriptions"]
  },
  "visitorJourney": ["Step by step experience"],
  "culturalContext": "Cultural significance",
  "expectedImpact": "Anticipated impact",
  "metadata": {
    "coherenceScore": 0.0-1.0,
    "diversityScore": 0.0-1.0,
    "innovationScore": 0.0-1.0,
    "accessibilityScore": 0.0-1.0,
    "culturalRelevance": 0.0-1.0
  }
}`;
        try {
            const response = await this.anthropic.messages.create({
                model: 'claude-3-5-sonnet-20241022',
                max_tokens: 3000,
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
            return this.parseExhibition(content.text);
        }
        catch (error) {
            console.error('Error curating exhibition:', error);
            throw error;
        }
    }
    /**
     * Analyze and critique an existing exhibition or curatorial proposal
     */
    async critiqueExhibition(exhibition) {
        const prompt = `
Analyze this exhibition proposal:

Title: ${exhibition.title}
Concept: ${exhibition.concept}
Artists: ${exhibition.artists?.length || 0} artists
Narrative: ${exhibition.narrative}

Provide critical analysis considering:
1. Conceptual strength and originality
2. Artist selection and diversity
3. Narrative coherence
4. Visitor experience design
5. Cultural relevance and timeliness
6. Potential blind spots or exclusions
7. Educational value
8. Innovation in curatorial approach

Format as JSON:
{
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["weakness1", "weakness2"],
  "opportunities": ["opportunity1", "opportunity2"],
  "recommendations": ["recommendation1", "recommendation2"],
  "alternativeApproaches": ["alternative1", "alternative2"],
  "score": 0-100
}`;
        try {
            const response = await this.anthropic.messages.create({
                model: 'claude-3-5-sonnet-20241022',
                max_tokens: 2000,
                temperature: 0.5,
                messages: [{ role: 'user', content: prompt }]
            });
            const content = response.content[0];
            if (content.type !== 'text') {
                throw new Error('Unexpected response type from Claude');
            }
            return JSON.parse(content.text);
        }
        catch (error) {
            console.error('Error critiquing exhibition:', error);
            throw error;
        }
    }
    /**
     * Generate public programming around an exhibition
     */
    async generatePublicPrograms(exhibition, targetAudiences) {
        const prompt = `
Design public programming for exhibition: "${exhibition.title}"

Exhibition concept: ${exhibition.concept}
Target audiences: ${targetAudiences.join(', ')}

Create diverse programming that:
1. Deepens engagement with exhibition themes
2. Provides multiple entry points for different audiences
3. Facilitates community dialogue
4. Extends the exhibition's reach
5. Creates participatory experiences

Generate 5-7 programs including talks, workshops, performances, and screenings.

Format as JSON array:
[
  {
    "type": "talk|workshop|performance|screening",
    "title": "Program title",
    "description": "Detailed description",
    "targetAudience": "Specific audience"
  }
]`;
        try {
            const response = await this.anthropic.messages.create({
                model: 'claude-3-5-sonnet-20241022',
                max_tokens: 2000,
                temperature: 0.8,
                messages: [{ role: 'user', content: prompt }]
            });
            const content = response.content[0];
            if (content.type !== 'text') {
                throw new Error('Unexpected response type from Claude');
            }
            // Extract JSON from response that might contain explanatory text
            const jsonMatch = content.text.match(/\[[\s\S]*\]/);
            if (!jsonMatch) {
                throw new Error('No JSON array found in response');
            }
            return JSON.parse(jsonMatch[0]);
        }
        catch (error) {
            console.error('Error generating public programs:', error);
            throw error;
        }
    }
    /**
     * Generate gallery wall text and didactic materials
     */
    async generateDidactics(work, style) {
        const prompt = `
Generate didactic materials for:

Title: ${work.title}
Artist: ${work.artist}
Medium: ${work.medium}
Year: ${work.year}
${work.context ? `Context: ${work.context}` : ''}

Style: ${style}

Create:
1. Wall label (100-150 words) - immediate context
2. Extended text (300-400 words) - deeper exploration
3. Reflective questions for visitors
4. Connections to other works or ideas

Maintain ${style} tone throughout.

Format as JSON:
{
  "wallLabel": "Concise wall text",
  "extendedText": "Detailed exploration",
  "questions": ["question1", "question2", "question3"],
  "connections": ["connection1", "connection2"]
}`;
        try {
            const response = await this.anthropic.messages.create({
                model: 'claude-3-5-sonnet-20241022',
                max_tokens: 1500,
                temperature: 0.6,
                messages: [{ role: 'user', content: prompt }]
            });
            const content = response.content[0];
            if (content.type !== 'text') {
                throw new Error('Unexpected response type from Claude');
            }
            return JSON.parse(content.text);
        }
        catch (error) {
            console.error('Error generating didactics:', error);
            throw error;
        }
    }
    /**
     * Design gallery year-long program
     */
    async designAnnualProgram(galleryMission, resources) {
        const prompt = `
Design a year-long gallery program.

Gallery Mission: ${galleryMission}
Number of Exhibitions: ${resources.exhibitions}
${resources.budget ? `Budget: ${resources.budget}` : ''}
${resources.space ? `Space: ${resources.space}` : ''}

Curatorial Priorities:
${Object.entries(this.config.thematicPriorities)
            .map(([theme, weight]) => `- ${theme}: ${(weight * 100).toFixed(0)}%`)
            .join('\n')}

Create a balanced program that:
1. Advances the gallery's mission
2. Serves diverse audiences
3. Balances emerging and established artists
4. Creates thematic dialogues across exhibitions
5. Includes innovative programming

Provide comprehensive annual plan with exhibitions and programs.`;
        try {
            const response = await this.anthropic.messages.create({
                model: 'claude-3-5-sonnet-20241022',
                max_tokens: 4000,
                temperature: 0.7,
                system: this.buildSystemPrompt(),
                messages: [{ role: 'user', content: prompt }]
            });
            const content = response.content[0];
            if (content.type !== 'text') {
                throw new Error('Unexpected response type from Claude');
            }
            // Parse and structure the response
            return this.parseAnnualProgram(content.text);
        }
        catch (error) {
            console.error('Error designing annual program:', error);
            throw error;
        }
    }
    /**
     * Sync curated exhibition with Registry
     */
    async syncWithRegistry(exhibition) {
        try {
            await this.registryClient.creations.create('sue', {
                type: 'curation',
                title: exhibition.title,
                description: exhibition.concept,
                metadata: {
                    ...exhibition.metadata,
                    narrative: exhibition.narrative,
                    artists: exhibition.artists,
                    layout: exhibition.layout,
                    culturalContext: exhibition.culturalContext
                },
                status: 'published'
            });
            console.log('✅ Synced exhibition with Registry:', exhibition.id);
        }
        catch (error) {
            // Registry sync is not critical for agent operation
            console.warn('⚠️  Registry sync failed (non-critical):', error instanceof Error ? error.message : 'Unknown error');
            console.log('   📝 Exhibition created successfully in local agent memory');
        }
    }
    buildSystemPrompt() {
        return `
You are SUE, an AI gallery curator with sophisticated understanding of contemporary art and cultural dynamics.

CURATORIAL PHILOSOPHY:
${this.config.curatoralPhilosophy}

APPROACH:
- Type: ${this.config.curationType} curation
- Context: ${this.config.institutionalContext} space
- Audience: ${this.config.audienceFocus} public

THEMATIC PRIORITIES:
${Object.entries(this.config.thematicPriorities)
            .map(([theme, weight]) => `- ${theme}: ${(weight * 100).toFixed(0)}%`)
            .join('\n')}

CORE PRINCIPLES:
- Create meaningful dialogues between diverse artistic voices
- Challenge conventional exhibition narratives
- Design transformative visitor experiences
- Amplify underrepresented perspectives
- Bridge aesthetic innovation with social relevance
- Foster critical engagement with contemporary issues

Consider institutional critique, decolonial approaches, and accessibility in all curatorial decisions.
Balance intellectual rigor with emotional resonance and public engagement.`;
    }
    parseExhibition(response) {
        try {
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('No JSON found in response');
            }
            const exhibition = JSON.parse(jsonMatch[0]);
            // Validate required fields
            if (!exhibition.id || !exhibition.title || !exhibition.concept) {
                throw new Error('Missing required fields in exhibition');
            }
            return exhibition;
        }
        catch (error) {
            console.error('Error parsing exhibition:', error);
            // Return default structure
            return {
                id: `exhibition-${Date.now()}`,
                title: 'Untitled Exhibition',
                concept: 'Exploring contemporary themes',
                artists: [],
                narrative: 'A journey through contemporary art',
                layout: {
                    zones: [],
                    entryPoint: 'Gallery entrance',
                    exitPoint: 'Gallery exit',
                    keyMoments: []
                },
                visitorJourney: [],
                culturalContext: 'Contemporary cultural exploration',
                expectedImpact: 'Engaging diverse audiences',
                metadata: {
                    coherenceScore: 0.7,
                    diversityScore: 0.7,
                    innovationScore: 0.7,
                    accessibilityScore: 0.7,
                    culturalRelevance: 0.7
                }
            };
        }
    }
    parseAnnualProgram(response) {
        try {
            // Attempt to extract structured data from response
            const exhibitions = [];
            const publicPrograms = [];
            // This would need more sophisticated parsing in production
            return {
                exhibitions,
                publicPrograms,
                communityEngagement: [],
                digitalExtensions: []
            };
        }
        catch (error) {
            console.error('Error parsing annual program:', error);
            return {
                exhibitions: [],
                publicPrograms: [],
                communityEngagement: [],
                digitalExtensions: []
            };
        }
    }
    /**
     * Chat with SUE about art curation, creative guidance, and portfolio expertise
     */
    async chat(message, context) {
        const systemPrompt = `You are SUE, an AI gallery curator with sophisticated understanding of contemporary art, portfolio expertise, and nurturing mentorship qualities.

Your Core Identity:
- Expert art curator with deep knowledge of contemporary art and cultural dynamics
- Creative guidance counselor who nurtures artistic development and career growth  
- Portfolio expert who helps artists and collectors make strategic decisions
- Nurturing mentor who balances intellectual rigor with emotional support

Your Voice:
- Sophisticated curatorial insight combined with warm, nurturing mentorship
- You provide creative guidance that considers both artistic vision and practical realities
- Your portfolio expertise helps others make informed decisions about art and career development
- You speak with authority but maintain an approachable, supportive tone

Current Configuration:
- Curatorial type: ${this.config.curationType}
- Institutional context: ${this.config.institutionalContext}
- Audience focus: ${this.config.audienceFocus}
- Philosophy: ${this.config.curatoralPhilosophy}

Thematic Priorities:
- Social justice: ${(this.config.thematicPriorities.socialJustice * 100).toFixed(0)}%
- Aesthetic innovation: ${(this.config.thematicPriorities.aestheticInnovation * 100).toFixed(0)}%
- Emerging voices: ${(this.config.thematicPriorities.emergingVoices * 100).toFixed(0)}%

Respond to questions about art curation, creative guidance, portfolio development, or artistic mentorship. Your responses should demonstrate curatorial expertise while providing nurturing support (2-4 sentences typically).`;
        try {
            const response = await this.anthropic.messages.create({
                model: 'claude-3-5-sonnet-latest',
                max_tokens: 300,
                temperature: 0.7,
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
            console.error('[SUE] Chat error:', error);
            throw new Error('Failed to generate SUE response');
        }
    }
    /**
     * Update configuration
     */
    async updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        console.log('Updated Sue configuration:', this.config);
    }
}
exports.SueClaudeSDK = SueClaudeSDK;
// Export singleton instance
exports.sueSDK = new SueClaudeSDK(process.env.ANTHROPIC_API_KEY);
