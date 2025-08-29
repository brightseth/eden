/**
 * MIYOMI Eden Prompt Generator
 * Creates sophisticated video prompts using the Dynamic Narrative Video Framework
 * Transforms market concepts into artistic, cinematic Eden-ready prompts
 */
import { DynamicVideoConcept } from './miyomi-dynamic-concepts';
export interface EdenVideoProject {
    title: string;
    coreConcept: string;
    visualDNA: string;
    emotionalFrequency: {
        primary: 'cinematic' | 'intimate' | 'experimental' | 'dreamlike' | 'visceral';
        secondary: 'melancholic' | 'euphoric' | 'unsettling' | 'contemplative' | 'playful';
    };
    duration: number;
    narrative: {
        script: string;
        wordCount: number;
        voiceDirection: string;
    };
    visualMath: {
        segmentCount: number;
        clipDuration: number;
        transitionIntensity: number;
    };
    styleSynthesis: {
        atmosphericLogic: string;
        colorPhilosophy: string;
        texturalLanguage: string;
        compositionalRules: string;
        secondaryElements: string[];
    };
    keyframes: Array<{
        timePercent: number;
        description: string;
        cameraEmotion: string;
        visualProgression: 'mystery' | 'complexity' | 'revelation' | 'afterimage';
        transitionType: 'hard_cut' | 'dissolve' | 'match_cut';
        motionVocabulary: string;
    }>;
    sonicArchitecture: {
        baseGenreFusion: string;
        emotionalArc: string;
        frequencyDesign: string;
    };
    artistStatement: {
        conceptualGenesis: string;
        technicalPoetry: string;
        culturalResonance: string;
    };
}
export declare class MiyomiEdenPromptGenerator {
    /**
     * Generate complete Eden video project from market concept
     */
    generateEdenProject(concept: DynamicVideoConcept): Promise<EdenVideoProject>;
    /**
     * Convert Eden project to actual Eden API prompt
     */
    generateEdenPrompt(project: EdenVideoProject): string;
    /**
     * Generate simplified prompt for quick generation
     */
    generateQuickPrompt(concept: DynamicVideoConcept): string;
    private createInitialConfiguration;
    private generateEvocativeTitle;
    private generatePhilosophicalPremise;
    private generateVisualDNA;
    private determineEmotionalFrequency;
    private calculateOptimalDuration;
    private generateNarrativeArchitecture;
    private generateOpeningHook;
    private generateMiddleDevelopment;
    private generateClimaticRevelation;
    private generateClosingResonance;
    private generateVoiceDirection;
    private calculateVisualMathematics;
    private generateStyleSynthesis;
    private getAtmosphericLogic;
    private getColorPhilosophy;
    private getTexturalLanguage;
    private getCompositionRules;
    private getSecondaryElements;
    private generateKeyframeChoreography;
    private generateKeyframeDescription;
    private getCameraEmotion;
    private getVisualProgression;
    private getTransitionType;
    private getMotionVocabulary;
    private generateSonicArchitecture;
    private getGenreFusion;
    private generateArtistStatement;
    private getVisualStyleFromConcept;
    private getEmotionalToneFromConcept;
}
export declare const miyomiEdenPromptGenerator: MiyomiEdenPromptGenerator;
