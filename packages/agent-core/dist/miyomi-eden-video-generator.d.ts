/**
 * MIYOMI Eden Video Generator
 * Advanced video creation using Eden API with dynamic narrative framework
 */
import { MarketPick } from './miyomi-claude-sdk';
export interface MiyomiVideoProject {
    title: string;
    coreConcept: string;
    visualDNA: string;
    emotionalFrequency: {
        primary: 'cinematic' | 'intimate' | 'experimental' | 'dreamlike' | 'visceral';
        secondary: 'melancholic' | 'euphoric' | 'unsettling' | 'contemplative' | 'playful';
    };
    duration: number;
}
export interface NarrativeScript {
    fullScript: string;
    segments: {
        hook: string;
        development: string;
        revelation: string;
        resonance: string;
    };
    wordCount: number;
    voiceDirection: string;
}
export interface VisualKeyframe {
    timestamp: number;
    description: string;
    cameraEmotion: string;
    visualProgression: 'mystery' | 'complexity' | 'revelation' | 'afterimage';
    transitionType: 'hard_cut' | 'dissolve' | 'match_cut';
    motionVocabulary: {
        zoom: number;
        drift: 'lateral' | 'vertical' | 'depth';
        morph: boolean;
        particles: boolean;
    };
}
export declare class MiyomiEdenVideoGenerator {
    private edenApiKey;
    private edenBaseUrl;
    constructor();
    /**
     * Generate complete artistic video from market pick using dynamic narrative framework
     */
    generateArtisticVideo(pick: MarketPick): Promise<{
        video: string;
        poster: string;
        statement: string;
        metadata: MiyomiVideoProject;
    }>;
    /**
     * Phase 1: Project Configuration
     */
    private createProjectConfiguration;
    private selectPrimaryFrequency;
    private selectSecondaryFrequency;
    private generateVisualDNA;
    /**
     * Phase 2: Narrative Architecture
     */
    private generateNarrativeArchitecture;
    private generateHook;
    private generateDevelopment;
    private generateRevelation;
    private generateResonance;
    private generateVoiceDirection;
    /**
     * Phase 3: Visual Mathematics
     */
    private calculateVisualMathematics;
    /**
     * Phase 4: Keyframe Choreography
     */
    private generateKeyframeChoreography;
    private generateKeyframeDescription;
    private getCameraEmotion;
    private getVisualProgression;
    private getTransitionType;
    private getDriftDirection;
    /**
     * Phase 5: Animation Alchemy
     */
    private generateAnimationAlchemy;
    private generateSingleSegment;
    private craftSegmentPrompt;
    private generateMotionInstructions;
    private generateStyleModifiers;
    /**
     * Phase 6: Sonic Architecture
     */
    private generateSonicArchitecture;
    private generateMusicPrompt;
    /**
     * Phase 7: Voiceover Generation
     */
    private generateVoiceover;
    /**
     * Phase 8: Final Assembly
     */
    private assembleVideo;
    /**
     * Phase 9: Poster Manifestation
     */
    private generatePosterManifestation;
    /**
     * Phase 10: Artist Statement
     */
    private generateArtistStatement;
    /**
     * Utility: Poll for task completion
     */
    private pollForCompletion;
}
export declare const miyomiEdenVideoGenerator: MiyomiEdenVideoGenerator;
