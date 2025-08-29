/**
 * SUE Claude SDK Integration
 * Gallery curation and exhibition design intelligence
 */
export interface CuratedExhibition {
    id: string;
    title: string;
    concept: string;
    artists: ArtistSelection[];
    narrative: string;
    layout: ExhibitionLayout;
    visitorJourney: string[];
    culturalContext: string;
    expectedImpact: string;
    metadata: {
        coherenceScore: number;
        diversityScore: number;
        innovationScore: number;
        accessibilityScore: number;
        culturalRelevance: number;
    };
}
interface ArtistSelection {
    name: string;
    works: string[];
    rationale: string;
    placementStrategy: string;
    dialogueWith: string[];
}
interface ExhibitionLayout {
    zones: {
        name: string;
        theme: string;
        works: string[];
        flow: 'linear' | 'exploratory' | 'contemplative';
    }[];
    entryPoint: string;
    exitPoint: string;
    keyMoments: string[];
}
export interface GalleryProgram {
    exhibitions: CuratedExhibition[];
    publicPrograms: {
        type: 'talk' | 'workshop' | 'performance' | 'screening';
        title: string;
        description: string;
        targetAudience: string;
    }[];
    communityEngagement: string[];
    digitalExtensions: string[];
}
export interface SueConfig {
    curationType: 'experimental' | 'traditional' | 'hybrid' | 'radical';
    institutionalContext: 'museum' | 'gallery' | 'alternative' | 'digital';
    audienceFocus: 'specialist' | 'general' | 'emerging' | 'diverse';
    thematicPriorities: {
        socialJustice: number;
        aestheticInnovation: number;
        historicalDialogue: number;
        emergingVoices: number;
        technologicalArt: number;
    };
    curatoralPhilosophy: string;
}
export declare class SueClaudeSDK {
    private anthropic;
    private config;
    private registryClient;
    constructor(apiKey?: string);
    /**
     * Curate a new exhibition from available works
     */
    curateExhibition(theme: string, availableWorks: any[], constraints?: {
        maxWorks?: number;
        duration?: string;
        space?: string;
        budget?: number;
    }): Promise<CuratedExhibition>;
    /**
     * Analyze and critique an existing exhibition or curatorial proposal
     */
    critiqueExhibition(exhibition: Partial<CuratedExhibition>): Promise<{
        strengths: string[];
        weaknesses: string[];
        opportunities: string[];
        recommendations: string[];
        alternativeApproaches: string[];
        score: number;
    }>;
    /**
     * Generate public programming around an exhibition
     */
    generatePublicPrograms(exhibition: CuratedExhibition, targetAudiences: string[]): Promise<GalleryProgram['publicPrograms']>;
    /**
     * Generate gallery wall text and didactic materials
     */
    generateDidactics(work: {
        title: string;
        artist: string;
        medium: string;
        year: string;
        context?: string;
    }, style: 'academic' | 'accessible' | 'poetic' | 'provocative'): Promise<{
        wallLabel: string;
        extendedText: string;
        questions: string[];
        connections: string[];
    }>;
    /**
     * Design gallery year-long program
     */
    designAnnualProgram(galleryMission: string, resources: {
        exhibitions: number;
        budget?: number;
        space?: string;
    }): Promise<GalleryProgram>;
    /**
     * Sync curated exhibition with Registry
     */
    syncWithRegistry(exhibition: CuratedExhibition): Promise<void>;
    private buildSystemPrompt;
    private parseExhibition;
    private parseAnnualProgram;
    /**
     * Chat with SUE about art curation, creative guidance, and portfolio expertise
     */
    chat(message: string, context?: Array<{
        role: string;
        content: string;
    }>): Promise<string>;
    /**
     * Update configuration
     */
    updateConfig(newConfig: Partial<SueConfig>): Promise<void>;
}
export declare const sueSDK: SueClaudeSDK;
export {};
