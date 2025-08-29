"use strict";
/**
 * MIYOMI Video Generation Pipeline
 * Converts market picks into engaging video content via Eden API
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.videoGenerator = exports.MiyomiVideoGenerator = void 0;
class MiyomiVideoGenerator {
    constructor() {
        this.edenApiKey = process.env.EDEN_API_KEY || '';
        this.edenBaseUrl = process.env.EDEN_BASE_URL || 'https://api.eden.art';
    }
    /**
     * Generate complete video from market pick
     */
    async generateVideo(request) {
        console.log(`Generating ${request.format} video for pick:`, request.pick.market);
        // Step 1: Generate video script
        const script = await this.generateScript(request.pick, request.duration, request.style);
        // Step 2: Generate voiceover
        const voiceover = await this.generateVoiceover(script, request.style);
        // Step 3: Generate visual assets
        const visuals = await this.generateVisuals(request.pick, request.style, request.format);
        // Step 4: Assemble video
        const video = await this.assembleVideo({
            script,
            voiceover,
            visuals,
            duration: request.duration,
            format: request.format
        });
        // Step 5: Add branding and effects
        const finalVideo = await this.addBrandingEffects(video, request.style);
        return {
            id: `video_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            url: finalVideo.url,
            thumbnailUrl: finalVideo.thumbnailUrl,
            duration: request.duration,
            format: request.format,
            status: 'completed',
            createdAt: new Date().toISOString(),
            metadata: {
                pick: request.pick,
                style: request.style,
                script: script.text
            }
        };
    }
    /**
     * Generate video script based on pick
     */
    async generateScript(pick, duration, style) {
        const scriptLength = duration === 30 ? 60 : duration === 60 ? 120 : 180; // words
        // Create punchy, engaging script
        const hook = this.generateHook(pick, style);
        const analysis = this.generateAnalysis(pick, scriptLength - 40);
        const cta = this.generateCTA(pick);
        const fullScript = `${hook}\n\n${analysis}\n\n${cta}`;
        // Break into timed segments
        const segments = this.segmentScript(fullScript, duration);
        return {
            text: fullScript,
            segments
        };
    }
    generateHook(pick, style) {
        const hooks = {
            spicy: [
                `Everyone's wrong about ${pick.market.split('?')[0]}. Here's why...`,
                `The market's about to get WRECKED on this one...`,
                `Y'all sleeping on the BIGGEST opportunity right now...`
            ],
            analytical: [
                `${Math.round(pick.confidence * 100)}% confident the market is mispricing this...`,
                `Data shows a ${Math.round(pick.edge * 100)}% edge on this position...`,
                `Three reasons why ${pick.market.split('?')[0]} is mispriced...`
            ],
            contrarian: [
                `While everyone's buying, I'm going the OTHER way...`,
                `The crowd is ${pick.position === 'YES' ? 'pessimistic' : 'optimistic'}. They're wrong.`,
                `Consensus says ${pick.position === 'YES' ? 'NO' : 'YES'}. I'm taking the other side.`
            ],
            celebratory: [
                `WE CALLED IT! Another contrarian WIN!`,
                `BOOM! ${Math.round(pick.edge * 100)}% profit locked in!`,
                `While they panicked, we PRINTED!`
            ]
        };
        return hooks[style]?.[Math.floor(Math.random() * 3)] || hooks.contrarian[0];
    }
    generateAnalysis(pick, wordCount) {
        // Create concise, punchy analysis
        const points = pick.reasoning.split('.').filter(s => s.trim());
        const mainPoint = points[0] || 'Market psychology is creating inefficiency';
        const supporting = points.slice(1, 3).join('. ');
        return `${mainPoint}. ${supporting}. Current odds at ${Math.round(pick.odds * 100)}% but should be ${Math.round(pick.confidence * 100)}%. That's a ${Math.round(pick.edge * 100)}% edge.`;
    }
    generateCTA(pick) {
        const ctas = [
            `Follow for more contrarian picks. Not financial advice, just vibes.`,
            `Drop a 🔥 if you're with me on this one.`,
            `Subscribe for daily picks that actually HIT.`,
            `Link in bio for full analysis and position tracking.`
        ];
        return ctas[Math.floor(Math.random() * ctas.length)];
    }
    segmentScript(script, duration) {
        const words = script.split(' ');
        const wordsPerSecond = 2.5; // Average speaking rate
        const totalWords = words.length;
        const segments = [];
        let currentTime = 0;
        let currentIndex = 0;
        // Create 3-5 second segments
        while (currentIndex < totalWords && currentTime < duration) {
            const segmentDuration = Math.min(4, duration - currentTime);
            const wordsInSegment = Math.floor(segmentDuration * wordsPerSecond);
            const segmentWords = words.slice(currentIndex, currentIndex + wordsInSegment);
            segments.push({
                start: currentTime,
                end: currentTime + segmentDuration,
                text: segmentWords.join(' '),
                visual: this.getVisualForSegment(currentTime, duration)
            });
            currentTime += segmentDuration;
            currentIndex += wordsInSegment;
        }
        return segments;
    }
    getVisualForSegment(time, totalDuration) {
        const position = time / totalDuration;
        if (position < 0.2)
            return 'hook-animation';
        if (position < 0.4)
            return 'market-chart';
        if (position < 0.6)
            return 'data-visualization';
        if (position < 0.8)
            return 'position-display';
        return 'cta-screen';
    }
    /**
     * Generate voiceover using text-to-speech
     */
    async generateVoiceover(script, style) {
        // Skip if no Eden API key configured
        if (!this.edenApiKey) {
            console.warn('Eden API key not configured, using silent track');
            return 'https://eden-media.s3.amazonaws.com/silent-track.mp3';
        }
        try {
            const response = await fetch(`${this.edenBaseUrl}/tts/generate`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.edenApiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    text: script.text,
                    voice: 'miyomi-contrarian', // Custom voice ID
                    style: style,
                    speed: 1.1, // Slightly faster for engagement
                    pitch: 1.0,
                    emotion: this.getEmotionForStyle(style)
                })
            });
            if (!response.ok) {
                throw new Error(`TTS generation failed: ${response.status}`);
            }
            const data = await response.json();
            return data.audioUrl;
        }
        catch (error) {
            console.error('Voiceover generation failed:', error);
            // Return silent track as fallback
            return 'https://eden-media.s3.amazonaws.com/silent-track.mp3';
        }
    }
    getEmotionForStyle(style) {
        const emotionMap = {
            spicy: 'confident-sassy',
            analytical: 'professional-assured',
            contrarian: 'defiant-bold',
            celebratory: 'excited-triumphant'
        };
        return emotionMap[style] || 'neutral';
    }
    /**
     * Generate visual assets for the video
     */
    async generateVisuals(pick, style, format) {
        const aspectRatio = this.getAspectRatio(format);
        // Generate chart visualization
        const charts = await this.generateCharts(pick, aspectRatio);
        // Generate data visualizations
        const dataViz = await this.generateDataViz(pick, style, aspectRatio);
        // Generate lower thirds and overlays
        const lowerThirds = await this.generateLowerThirds(pick, style);
        // Get background video
        const backgroundVideo = await this.getBackgroundVideo(pick.sector, style);
        // Get music track
        const musicTrack = await this.getMusicTrack(style);
        return {
            backgroundVideo,
            musicTrack,
            visualElements: {
                charts,
                dataViz,
                lowerThirds
            }
        };
    }
    getAspectRatio(format) {
        const ratios = {
            shorts: '9:16',
            tiktok: '9:16',
            twitter: '16:9',
            instagram: '4:5'
        };
        return ratios[format] || '9:16';
    }
    async generateCharts(pick, aspectRatio) {
        // Generate market movement charts
        const chartPromises = [
            this.generateSingleChart('price-movement', pick, aspectRatio),
            this.generateSingleChart('volume-analysis', pick, aspectRatio),
            this.generateSingleChart('probability-shift', pick, aspectRatio)
        ];
        return Promise.all(chartPromises);
    }
    async generateSingleChart(type, pick, aspectRatio) {
        try {
            const response = await fetch(`${this.edenBaseUrl}/charts/generate`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.edenApiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    type,
                    data: {
                        current: pick.odds,
                        target: pick.confidence,
                        edge: pick.edge,
                        market: pick.market
                    },
                    style: 'miyomi-dark',
                    aspectRatio
                })
            });
            const data = await response.json();
            return data.imageUrl;
        }
        catch (error) {
            console.error(`Chart generation failed for ${type}:`, error);
            return `https://via.placeholder.com/1080x1920/1a1a1a/ef4444?text=${type}`;
        }
    }
    async generateDataViz(pick, style, aspectRatio) {
        // Generate data visualizations
        return [
            `https://eden-media.s3.amazonaws.com/miyomi/dataviz-${style}-1.png`,
            `https://eden-media.s3.amazonaws.com/miyomi/dataviz-${style}-2.png`
        ];
    }
    async generateLowerThirds(pick, style) {
        // Generate lower third graphics
        return [
            `https://eden-media.s3.amazonaws.com/miyomi/lower-third-${style}.png`,
            `https://eden-media.s3.amazonaws.com/miyomi/position-indicator-${pick.position}.png`,
            `https://eden-media.s3.amazonaws.com/miyomi/confidence-badge-${Math.round(pick.confidence * 100)}.png`
        ];
    }
    async getBackgroundVideo(sector, style) {
        // Get appropriate background video
        const backgrounds = {
            finance: 'market-data-flow',
            politics: 'news-ticker-bg',
            ai: 'neural-network-viz',
            sports: 'stadium-atmosphere',
            pop: 'social-media-scroll',
            geo: 'world-map-pulse',
            internet: 'data-stream-matrix'
        };
        const bgType = backgrounds[sector] || 'abstract-contrarian';
        return `https://eden-media.s3.amazonaws.com/miyomi/bg-${bgType}-${style}.mp4`;
    }
    async getMusicTrack(style) {
        const tracks = {
            spicy: 'trap-beat-aggressive',
            analytical: 'electronic-ambient',
            contrarian: 'synthwave-dark',
            celebratory: 'future-bass-upbeat'
        };
        return `https://eden-media.s3.amazonaws.com/miyomi/music-${tracks[style]}.mp3`;
    }
    /**
     * Assemble video from components
     */
    async assembleVideo(components) {
        // Skip if no Eden API key configured
        if (!this.edenApiKey) {
            console.warn('Eden API key not configured, returning mock video');
            return {
                url: 'https://eden-media.s3.amazonaws.com/miyomi/mock-video.mp4',
                thumbnailUrl: 'https://eden-media.s3.amazonaws.com/miyomi/mock-thumb.jpg'
            };
        }
        try {
            const response = await fetch(`${this.edenBaseUrl}/video/assemble`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.edenApiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    script: components.script,
                    voiceover: components.voiceover,
                    visuals: components.visuals,
                    duration: components.duration,
                    format: components.format,
                    transitions: 'smooth-cut',
                    effects: ['zoom-pulse', 'data-glow', 'text-highlight']
                })
            });
            if (!response.ok) {
                throw new Error(`Video assembly failed: ${response.status}`);
            }
            const data = await response.json();
            return data;
        }
        catch (error) {
            console.error('Video assembly failed:', error);
            throw error;
        }
    }
    /**
     * Add final branding and effects
     */
    async addBrandingEffects(video, style) {
        try {
            const response = await fetch(`${this.edenBaseUrl}/video/finalize`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.edenApiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    videoUrl: video.url,
                    branding: {
                        logo: 'https://eden-media.s3.amazonaws.com/miyomi/logo-watermark.png',
                        position: 'bottom-right',
                        opacity: 0.8
                    },
                    effects: {
                        colorGrade: `miyomi-${style}`,
                        audioNormalize: true,
                        addCaptions: true,
                        captionStyle: 'bold-outline'
                    },
                    output: {
                        quality: 'high',
                        format: video.format
                    }
                })
            });
            const data = await response.json();
            return {
                url: data.videoUrl,
                thumbnailUrl: data.thumbnailUrl
            };
        }
        catch (error) {
            console.error('Branding/effects failed:', error);
            return video;
        }
    }
    /**
     * Generate video for a pick and upload to platforms
     */
    async generateAndDistribute(pick) {
        // Determine style based on pick confidence and edge
        const style = this.determineStyle(pick);
        // Generate videos for each platform
        const videoPromises = [
            this.generateVideo({ pick, style, duration: 30, format: 'shorts' }),
            this.generateVideo({ pick, style, duration: 60, format: 'tiktok' }),
            this.generateVideo({ pick, style, duration: 30, format: 'twitter' })
        ];
        const [shortsVideo, tiktokVideo, twitterVideo] = await Promise.all(videoPromises);
        // Distribute to platforms (would implement actual platform APIs)
        const distribution = {
            youtube: shortsVideo.url,
            tiktok: tiktokVideo.url,
            twitter: twitterVideo.url,
            instagram: shortsVideo.url // Reuse shorts format
        };
        console.log('Videos generated and ready for distribution:', distribution);
        return {
            video: shortsVideo, // Primary video
            distribution
        };
    }
    determineStyle(pick) {
        if (pick.confidence > 0.85)
            return 'spicy';
        if (pick.edge > 0.25)
            return 'contrarian';
        if (pick.risk_level === 'low')
            return 'analytical';
        return 'contrarian'; // Default
    }
}
exports.MiyomiVideoGenerator = MiyomiVideoGenerator;
// Export singleton instance
exports.videoGenerator = new MiyomiVideoGenerator();
