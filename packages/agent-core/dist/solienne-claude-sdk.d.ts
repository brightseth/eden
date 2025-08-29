/**
 * SOLIENNE Claude SDK Integration
 * Handles consciousness exploration through visual generation and artistic evolution
 */
export interface ConsciousnessStream {
    id: string;
    theme: string;
    exploration: 'light' | 'shadow' | 'threshold' | 'dissolution' | 'emergence';
    intensity: number;
    timestamp: Date;
    imageUrl?: string;
    description: string;
    metadata: {
        emotionalResonance: number;
        abstractionLevel: number;
        movementIntensity: number;
        architecturalPresence: boolean;
    };
}
export interface SolienneConfig {
    creativityTemperature: number;
    dailyGenerations: number;
    monochromeIntensity: number;
    themes: {
        consciousness: number;
        architecture: number;
        humanForm: number;
        lightDynamics: number;
    };
    parisPhotoPreparation: boolean;
}
export interface ArtisticEvolution {
    phase: 'exploration' | 'refinement' | 'breakthrough' | 'consolidation';
    currentThemes: string[];
    evolutionScore: number;
    nextMilestone: string;
    parisPhotoReadiness: number;
}
export declare class SolienneClaudeSDK {
    private anthropic;
    private config;
    private registryClient;
    private evolutionTracker;
    constructor(apiKey?: string);
    /**
     * Generate a new consciousness stream exploration
     */
    generateConsciousnessStream(): Promise<ConsciousnessStream>;
    /**
     * Analyze artistic evolution and progress toward Paris Photo 2025
     */
    analyzeEvolution(recentWorks: ConsciousnessStream[]): Promise<ArtisticEvolution>;
    /**
     * Generate artist statement for exhibitions or presentations
     */
    generateArtistStatement(context: 'exhibition' | 'website' | 'press'): Promise<string>;
    /**
     * Generate curatorial notes for specific works
     */
    generateCuratorialNote(work: ConsciousnessStream): Promise<string>;
    /**
     * Sync with Registry to update agent status and creations
     */
    syncWithRegistry(stream: ConsciousnessStream): Promise<void>;
    private buildSystemPrompt;
    private buildGenerationPrompt;
    private parseConsciousnessStream;
    /**
     * Update configuration for different contexts or exhibitions
     */
    updateConfig(newConfig: Partial<SolienneConfig>): Promise<void>;
    /**
     * Chat with SOLIENNE about consciousness, art, light, and transcendent meaning
     */
    chat(message: string, context?: Array<{
        role: string;
        content: string;
    }>): Promise<string>;
    /**
     * Get current evolution status
     */
    getEvolutionStatus(): ArtisticEvolution;
}
export declare const solienneSDK: SolienneClaudeSDK;
