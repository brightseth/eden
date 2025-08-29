"use strict";
/**
 * MIYOMI Eden Prompt Generator
 * Creates sophisticated video prompts using the Dynamic Narrative Video Framework
 * Transforms market concepts into artistic, cinematic Eden-ready prompts
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.miyomiEdenPromptGenerator = exports.MiyomiEdenPromptGenerator = void 0;
class MiyomiEdenPromptGenerator {
    /**
     * Generate complete Eden video project from market concept
     */
    async generateEdenProject(concept) {
        console.log('🎬 Generating Eden project for concept:', concept?.title || 'undefined concept');
        console.log('🔍 Concept object:', JSON.stringify(concept, null, 2));
        // Phase 1: Initial Configuration
        const project = this.createInitialConfiguration(concept);
        // Phase 2: Narrative Architecture
        project.narrative = this.generateNarrativeArchitecture(concept, project);
        // Phase 3: Visual Mathematics
        project.visualMath = this.calculateVisualMathematics(project.narrative.wordCount, project.duration);
        // Phase 4: Style Synthesis
        project.styleSynthesis = this.generateStyleSynthesis(concept, project);
        // Phase 5: Keyframe Choreography
        project.keyframes = this.generateKeyframeChoreography(project);
        // Phase 6: Sonic Architecture
        project.sonicArchitecture = this.generateSonicArchitecture(project);
        // Phase 7: Artist Statement
        project.artistStatement = this.generateArtistStatement(concept, project);
        return project;
    }
    /**
     * Convert Eden project to actual Eden API prompt
     */
    generateEdenPrompt(project) {
        return `# MIYOMI: ${project.title}

## VISUAL DNA
${project.visualDNA}

## EMOTIONAL FREQUENCY
Primary: ${project.emotionalFrequency.primary}
Secondary: ${project.emotionalFrequency.secondary}

## ATMOSPHERIC LOGIC
${project.styleSynthesis.atmosphericLogic}

## COLOR PHILOSOPHY
${project.styleSynthesis.colorPhilosophy}

## TEXTURAL LANGUAGE
${project.styleSynthesis.texturalLanguage}

## COMPOSITIONAL RULES
${project.styleSynthesis.compositionalRules}

## KEYFRAME SEQUENCE
${project.keyframes.map((kf, i) => `### Frame ${i + 1} (${Math.round(kf.timePercent * 100)}%)
  Visual: ${kf.description}
  Camera Emotion: ${kf.cameraEmotion}
  Motion: ${kf.motionVocabulary}
  Transition: ${kf.transitionType}`).join('\n\n')}

## TECHNICAL SPECS
- Duration: ${project.duration} seconds
- Segments: ${project.visualMath.segmentCount} clips × ${project.visualMath.clipDuration}s each
- Style: Cinematic 16:9, film grain, professional color grading
- Motion: Breathing zooms (2-5%), lateral drifts, temporal morphs
- Quality: Highest available, export for social media optimization

## CREATIVE DIRECTIVES
- Each frame stands alone as art
- Audio and visual create third meaning together
- Breaks conventional rules beautifully
- Creates new aesthetic vocabulary
- ${project.emotionalFrequency.primary} atmosphere with ${project.emotionalFrequency.secondary} undertones

Execute with confidence. On Eden, we're not making content—we're birthing new realities.`;
    }
    /**
     * Generate simplified prompt for quick generation
     */
    generateQuickPrompt(concept) {
        const visualStyle = this.getVisualStyleFromConcept(concept);
        const emotionalTone = this.getEmotionalToneFromConcept(concept);
        const title = concept.title || 'Market Analysis';
        const contrarian = concept.contrarian_angle || 'Against conventional market wisdom';
        const dataPoint = concept.dataPoints?.primary || 'Market data reveals hidden patterns';
        const urgency = concept.urgencyScore || 75;
        const titlePart = title.split(':')[0];
        return `MIYOMI Market Analysis: ${title}

Visual Style: ${visualStyle}
Emotional Tone: ${emotionalTone}

Core Message: ${contrarian}

Data Visualization: ${dataPoint}

Create a ${urgency > 80 ? 'urgent' : 'contemplative'} market analysis video that reveals why consensus is wrong about ${titlePart}. 

Style: Professional financial content with artistic cinematography, data overlays, NYC energy, contrarian perspective.

Duration: 60 seconds, 16:9 format, high production value.`;
    }
    // Phase 1: Initial Configuration
    createInitialConfiguration(concept) {
        return {
            title: this.generateEvocativeTitle(concept),
            coreConcept: this.generatePhilosophicalPremise(concept),
            visualDNA: this.generateVisualDNA(concept),
            emotionalFrequency: this.determineEmotionalFrequency(concept),
            duration: this.calculateOptimalDuration(concept),
            narrative: {}, // Will be filled in Phase 2
            visualMath: {}, // Will be filled in Phase 3
            styleSynthesis: {}, // Will be filled in Phase 4
            keyframes: [], // Will be filled in Phase 5
            sonicArchitecture: {}, // Will be filled in Phase 6
            artistStatement: {} // Will be filled in Phase 7
        };
    }
    generateEvocativeTitle(concept) {
        const audience = concept.targetAudience ? concept.targetAudience.replace('_', ' ') : 'market participants';
        const titlePart = concept.title ? concept.title.split(':')[0] : 'market dynamics';
        const urgency = concept.urgencyScore || 75;
        const dataPoint = concept.dataPoints?.primary ? concept.dataPoints.primary.split(':')[0] : 'market signals';
        const templates = [
            `The ${audience} Paradox`,
            `Market Memory: ${titlePart}`,
            `Contrarian Frequencies: ${urgency}%`,
            `The Consensus Delusion`,
            `Edge of Certainty: ${dataPoint}`,
            `Probability Dreams`,
            `The Crowd's Blindness`,
            `Mathematical Dissent`
        ];
        return templates[Math.floor(Math.random() * templates.length)];
    }
    generatePhilosophicalPremise(concept) {
        const conceptFocus = concept.title ? concept.title.split(':')[0].toLowerCase() : 'market dynamics';
        return `Market psychology reveals human nature through the lens of ${conceptFocus}—where consensus reality breaks down at the edges of uncertainty, creating pockets of alpha for those who see beyond the crowd's emotional gravitational field.`;
    }
    generateVisualDNA(concept) {
        const sectorDNA = {
            politics: 'Liminal government spaces dissolving into data streams, brutalist architecture softened by probability clouds, shadow corridors where power and uncertainty intersect',
            finance: 'Hyperreal trading floors as digital cathedrals, flowing market data crystallizing into geometric forms, numbers cascading like sacred rain through NYSE-lit chambers',
            ai: 'Neural networks visualized as living organisms, liquid light patterns flowing through silicon dreams, consciousness emerging from mathematical poetry',
            sports: 'Stadium energy frozen in temporal amber, crowd emotions rendered as color field paintings, victory/defeat symmetry expressed through architectural forms',
            pop: 'Social media infinite scroll made physical, viral moments crystallizing into gallery installations, attention economy as visible light structures',
            geo: 'Satellite views dissolving into human-scale intimacy, national borders as gossamer light lines, geopolitical tensions as weather patterns',
            internet: 'Data packet flows as river systems, server farms as brutalist monasteries, human connection threading through fiber optic prayers'
        };
        const title = concept.title || '';
        const baseDNA = sectorDNA[title.toLowerCase().includes('btc') || title.toLowerCase().includes('crypto') ? 'finance' : 'finance'] || sectorDNA.finance;
        return `${baseDNA}. Contrarian energy manifests as geometric disruption—probability distributions colliding with consensus reality, creating visual turbulence where mathematical truth emerges from market psychology's failures.`;
    }
    determineEmotionalFrequency(concept) {
        // Map concept characteristics to emotional frequencies
        if (concept.urgencyScore > 85) {
            return { primary: 'visceral', secondary: 'unsettling' };
        }
        else if (concept.trendingPotential === 'viral') {
            return { primary: 'cinematic', secondary: 'euphoric' };
        }
        else if (concept.targetAudience === 'contrarians') {
            return { primary: 'experimental', secondary: 'contemplative' };
        }
        else if (concept.dataPoints?.primary && (concept.dataPoints.primary.includes('crypto') || concept.dataPoints.primary.includes('BTC'))) {
            return { primary: 'dreamlike', secondary: 'playful' };
        }
        else {
            return { primary: 'intimate', secondary: 'melancholic' };
        }
    }
    calculateOptimalDuration(concept) {
        // Base duration on urgency and complexity
        if (concept.urgencyScore > 80)
            return 60; // Urgent concepts need quick delivery
        if (concept.trendingPotential === 'viral')
            return 75; // Viral content sweet spot
        return 90; // Default contemplative length
    }
    // Phase 2: Narrative Architecture
    generateNarrativeArchitecture(concept, project) {
        const hook = this.generateOpeningHook(concept);
        const development = this.generateMiddleDevelopment(concept);
        const revelation = this.generateClimaticRevelation(concept);
        const resonance = this.generateClosingResonance(concept);
        const script = `${hook}\n\n${development}\n\n${revelation}\n\n${resonance}`;
        const wordCount = script.split(/\s+/).length;
        return {
            script,
            wordCount,
            voiceDirection: this.generateVoiceDirection(project.emotionalFrequency)
        };
    }
    generateOpeningHook(concept) {
        const title = concept.title || 'market dynamics';
        const titlePart = title.split(':')[0];
        const urgency = concept.urgencyScore || 75;
        const views = concept.estimatedViews || 100000;
        const dataPoint = concept.dataPoints?.primary || 'market signals';
        const dataPart = dataPoint.split(':')[0];
        const hooks = [
            `What if everything the market believes about ${titlePart} is backwards?`,
            `${urgency}% urgency. ${views.toLocaleString()} potential views. Here's why everyone's wrong.`,
            `The crowd sees ${dataPart}. I see something else entirely.`,
            `Market psychology just revealed its deepest bias. Most traders will never notice.`,
            `Between what we know and what we pretend to know lies all the alpha in ${titlePart}.`
        ];
        return hooks[Math.floor(Math.random() * hooks.length)];
    }
    generateMiddleDevelopment(concept) {
        const contrarian = concept.contrarian_angle || 'Against conventional wisdom';
        const dataPoint = concept.dataPoints?.primary || 'Market data reveals hidden patterns';
        const development = concept.scriptOutline?.development || 'The evidence points to a different reality';
        return `${contrarian} The data tells a different story: ${dataPoint}. While consensus builds around comfortable narratives, mathematical reality operates by different rules. ${development}`;
    }
    generateClimaticRevelation(concept) {
        const revelation = concept.scriptOutline?.revelation || 'The truth emerges from market noise';
        const urgency = concept.urgencyScore || 75;
        const trending = concept.trendingPotential || 'high';
        return `This isn't about being right or wrong—it's about seeing patterns that haven't become consensus yet. ${revelation} When ${urgency}% urgency meets ${trending} potential, the market's emotional biases become visible architecture.`;
    }
    generateClosingResonance(concept) {
        const resonances = [
            'Markets are mirrors reflecting not truth, but what we need to believe.',
            'The most profitable insights live in the space where logic meets intuition.',
            'Every crowd has an expiration date. The question: are you inside or outside when it hits?',
            'Alpha doesn\'t last forever. But understanding why it exists does.',
            'The market prices human nature itself—and human nature is beautifully predictable.'
        ];
        return resonances[Math.floor(Math.random() * resonances.length)];
    }
    generateVoiceDirection(emotionalFreq) {
        const directions = {
            visceral: 'Crystalline clarity with underground energy—NYC street wisdom meets Wall Street precision, urgent but controlled',
            cinematic: 'Weathered wisdom with cinematic gravitas—like a veteran trader sharing hard-earned insights, measured but intense',
            experimental: 'Whispered intimacy building to passionate conviction—as if sharing secrets that reshape reality',
            dreamlike: 'Floating between contemplative and urgent—reality bending at the edges of understanding, mysterious but authoritative',
            intimate: 'Conversational confidence—talking to a friend who gets it, casual authority with moments of conspiratorial intensity'
        };
        return directions[emotionalFreq.primary] + `. Secondary tone: ${emotionalFreq.secondary} undertones throughout.`;
    }
    // Phase 3: Visual Mathematics
    calculateVisualMathematics(wordCount, duration) {
        const wordsPerSecond = 2.2; // Slightly slower for contemplation
        const estimatedAudioDuration = wordCount / wordsPerSecond;
        const segmentCount = Math.ceil(Math.min(estimatedAudioDuration, duration) / 8); // 8-second segments
        const clipDuration = duration / segmentCount;
        return {
            segmentCount,
            clipDuration,
            transitionIntensity: segmentCount * 0.8 // Transition complexity based on segments
        };
    }
    // Phase 4: Style Synthesis
    generateStyleSynthesis(concept, project) {
        return {
            atmosphericLogic: this.getAtmosphericLogic(project.emotionalFrequency),
            colorPhilosophy: this.getColorPhilosophy(concept, project.emotionalFrequency),
            texturalLanguage: this.getTexturalLanguage(project.emotionalFrequency),
            compositionalRules: this.getCompositionRules(concept),
            secondaryElements: this.getSecondaryElements(concept)
        };
    }
    getAtmosphericLogic(emotionalFreq) {
        const atmospheres = {
            visceral: 'Hyperreal financial landscapes—trading floors as battlegrounds where data becomes physical force',
            cinematic: 'Liminal market spaces where probability waves intersect with human ambition',
            experimental: 'Abstract geometries born from mathematical chaos—market inefficiencies as architectural forms',
            dreamlike: 'Market consciousness floating between dimensions of certainty and doubt',
            intimate: 'Human-scale spaces where individual decisions ripple into systemic change'
        };
        return atmospheres[emotionalFreq.primary];
    }
    getColorPhilosophy(concept, emotionalFreq) {
        if (concept.urgencyScore > 80) {
            return 'Bleeding saturation—reds that pulse with market urgency, whites that burn with certainty';
        }
        else if (emotionalFreq.secondary === 'melancholic') {
            return 'Muted poetry—grays and blues that suggest depth without despair';
        }
        else if (concept.trendingPotential === 'viral') {
            return 'Neon dreams—electric blues and warning oranges that grab attention without losing sophistication';
        }
        else {
            return 'Monochromatic discipline—black, white, and strategic red accents for emphasis';
        }
    }
    getTexturalLanguage(emotionalFreq) {
        const textures = {
            visceral: 'Digital artifacts as battle scars—compression glitches that reveal truth',
            cinematic: 'Film grain that breathes—organic imperfection in digital perfection',
            experimental: 'Liquid glass surfaces reflecting mathematical poetry',
            dreamlike: 'Painted light bleeding through probability fields',
            intimate: 'Soft focus edges with crystalline detail centers'
        };
        return textures[emotionalFreq.primary];
    }
    getCompositionRules(concept) {
        if (concept.urgencyScore > 75) {
            return 'Brutal asymmetry—off-center power that demands attention';
        }
        else if (concept.targetAudience === 'contrarians') {
            return 'Fractal recursion—patterns within patterns revealing deeper truths';
        }
        else {
            return 'Golden ratio discipline—mathematical harmony serving emotional impact';
        }
    }
    getSecondaryElements(concept) {
        return [
            'Recurring data stream totems that pulse with market rhythm',
            'Geometric probability clouds that shift with narrative tension',
            'Abstract manifestations of crowd psychology as visual weather',
            'Subtle NYC architectural references grounding the analysis'
        ];
    }
    // Phase 5: Keyframe Choreography
    generateKeyframeChoreography(project) {
        const keyframes = [];
        const segments = project.visualMath.segmentCount;
        for (let i = 0; i < segments; i++) {
            const timePercent = i / (segments - 1);
            keyframes.push({
                timePercent,
                description: this.generateKeyframeDescription(timePercent, project),
                cameraEmotion: this.getCameraEmotion(timePercent),
                visualProgression: this.getVisualProgression(timePercent),
                transitionType: this.getTransitionType(i, segments, project.emotionalFrequency),
                motionVocabulary: this.getMotionVocabulary(timePercent)
            });
        }
        return keyframes;
    }
    generateKeyframeDescription(timePercent, project) {
        const progression = this.getVisualProgression(timePercent);
        const baseDNA = project.visualDNA;
        const progressionDescriptions = {
            mystery: `${baseDNA} shrouded in atmospheric uncertainty, details emerging from probability shadows`,
            complexity: `${baseDNA} layered with data visualization overlays, multiple reality streams intersecting`,
            revelation: `${baseDNA} achieving sudden clarity as hidden patterns align into inevitable truth`,
            afterimage: `${baseDNA} dissolving into essential insight, leaving only the core realization burning`
        };
        return progressionDescriptions[progression];
    }
    getCameraEmotion(timePercent) {
        const emotions = [
            'curious observation', 'analytical investigation', 'urgent discovery',
            'triumphant recognition', 'contemplative distance'
        ];
        const index = Math.floor(timePercent * (emotions.length - 1));
        return emotions[index];
    }
    getVisualProgression(timePercent) {
        if (timePercent <= 0.3)
            return 'mystery';
        if (timePercent <= 0.7)
            return 'complexity';
        if (timePercent <= 0.9)
            return 'revelation';
        return 'afterimage';
    }
    getTransitionType(index, total, emotionalFreq) {
        if (index === 0 || index === total - 1)
            return 'dissolve';
        if (emotionalFreq.primary === 'visceral')
            return 'hard_cut';
        if (emotionalFreq.secondary === 'unsettling')
            return 'hard_cut';
        return Math.random() > 0.6 ? 'match_cut' : 'dissolve';
    }
    getMotionVocabulary(timePercent) {
        const zoomPercent = 2 + Math.random() * 3; // 2-5% breathing zoom
        const driftDirection = timePercent < 0.33 ? 'lateral' : timePercent < 0.66 ? 'depth' : 'vertical';
        const morphing = timePercent > 0.3 && timePercent < 0.8 ? ', subtle reality morphs' : '';
        const particles = timePercent > 0.7 ? ', particle dissolution effects' : '';
        return `${zoomPercent.toFixed(1)}% breathing zoom, ${driftDirection} drift${morphing}${particles}`;
    }
    // Phase 6: Sonic Architecture
    generateSonicArchitecture(project) {
        return {
            baseGenreFusion: this.getGenreFusion(project.emotionalFrequency),
            emotionalArc: 'Gentle opening establishing contemplation, building tension through middle sections, climactic revelation with full harmonic complexity, resolution into contemplative wisdom',
            frequencyDesign: 'Leave 800-2kHz space for narration clarity (-3db cut), low-end foundation for gravitas, high-end sparkle for data visualization elements'
        };
    }
    getGenreFusion(emotionalFreq) {
        const fusions = {
            visceral: 'Deconstructed trap meets orchestral tension—aggressive precision with sophisticated restraint',
            cinematic: 'Neo-noir strings through analog synthesizer processing—emotional gravitas with modern edge',
            experimental: 'Glitch ambient with found market sounds—unconventional rhythms revealing hidden harmonies',
            dreamlike: 'Ethereal pads with granular delays—floating melodies that suggest rather than demand',
            intimate: 'Minimalist piano with subtle electronic textures—conversational dynamics that breathe'
        };
        return fusions[emotionalFreq.primary];
    }
    // Phase 7: Artist Statement
    generateArtistStatement(concept, project) {
        return {
            conceptualGenesis: `This piece emerges from the recognition that ${concept.title.toLowerCase()} represents more than market mechanics—it's a window into collective psychology at the moment of breakdown. When consensus reality meets mathematical truth, the friction generates both profit and poetry.`,
            technicalPoetry: `The visual architecture mirrors the emotional journey of contrarian thinking: ${project.styleSynthesis.atmosphericLogic.toLowerCase()}. Each frame breathes with market volatility, camera movements echo crowd psychology, and the ${project.sonicArchitecture.baseGenreFusion.toLowerCase()} maps the tension between logic and intuition.`,
            culturalResonance: `In an era where algorithms predict behavior while humans remain beautifully unpredictable, this work questions not just market efficiency but the nature of collective intelligence itself. The lasting question: when everyone's looking in the same direction, where should your eyes be?`
        };
    }
    // Utility methods
    getVisualStyleFromConcept(concept) {
        if (concept.urgencyScore > 80) {
            return 'Hyperreal market visualization with urgent energy, data streams as physical force, NYC street wisdom meets Wall Street precision';
        }
        else {
            return 'Contemplative financial landscapes, probability waves intersecting with human psychology, cinematic market analysis';
        }
    }
    getEmotionalToneFromConcept(concept) {
        if (concept.trendingPotential === 'viral') {
            return 'Confident contrarian energy with underlying excitement about seeing what others miss';
        }
        else {
            return 'Thoughtful analytical wisdom with moments of revelation, like a mentor sharing hard-earned insights';
        }
    }
}
exports.MiyomiEdenPromptGenerator = MiyomiEdenPromptGenerator;
// Export singleton
exports.miyomiEdenPromptGenerator = new MiyomiEdenPromptGenerator();
