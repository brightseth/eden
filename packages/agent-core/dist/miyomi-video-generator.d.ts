/**
 * MIYOMI Video Generation Pipeline
 * Converts market picks into engaging video content via Eden API
 */
import { MarketPick } from './miyomi-claude-sdk';
export interface VideoGenerationRequest {
    pick: MarketPick;
    style: 'spicy' | 'analytical' | 'contrarian' | 'celebratory';
    duration: 30 | 60 | 90;
    format: 'shorts' | 'tiktok' | 'twitter' | 'instagram';
}
export interface VideoAssets {
    backgroundVideo?: string;
    voiceover?: string;
    musicTrack?: string;
    visualElements: {
        charts?: string[];
        dataViz?: string[];
        lowerThirds?: string[];
    };
}
export interface GeneratedVideo {
    id: string;
    url: string;
    thumbnailUrl: string;
    duration: number;
    format: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    createdAt: string;
    metadata: {
        pick: MarketPick;
        style: string;
        script: string;
    };
}
export declare class MiyomiVideoGenerator {
    private edenApiKey;
    private edenBaseUrl;
    constructor();
    /**
     * Generate complete video from market pick
     */
    generateVideo(request: VideoGenerationRequest): Promise<GeneratedVideo>;
    /**
     * Generate video script based on pick
     */
    private generateScript;
    private generateHook;
    private generateAnalysis;
    private generateCTA;
    private segmentScript;
    private getVisualForSegment;
    /**
     * Generate voiceover using text-to-speech
     */
    private generateVoiceover;
    private getEmotionForStyle;
    /**
     * Generate visual assets for the video
     */
    private generateVisuals;
    private getAspectRatio;
    private generateCharts;
    private generateSingleChart;
    private generateDataViz;
    private generateLowerThirds;
    private getBackgroundVideo;
    private getMusicTrack;
    /**
     * Assemble video from components
     */
    private assembleVideo;
    /**
     * Add final branding and effects
     */
    private addBrandingEffects;
    /**
     * Generate video for a pick and upload to platforms
     */
    generateAndDistribute(pick: MarketPick): Promise<{
        video: GeneratedVideo;
        distribution: {
            twitter?: string;
            tiktok?: string;
            youtube?: string;
            instagram?: string;
        };
    }>;
    private determineStyle;
}
export declare const videoGenerator: MiyomiVideoGenerator;
