/**
 * MIYOMI Eden Prompt Generator
 * Creates sophisticated video prompts using the Dynamic Narrative Video Framework
 * Transforms market concepts into artistic, cinematic Eden-ready prompts
 */

import { DynamicVideoConcept } from './miyomi-dynamic-concepts';
import { MarketPick } from './miyomi-claude-sdk';

export interface EdenVideoProject {
  title: string;
  coreConcept: string;
  visualDNA: string;
  emotionalFrequency: {
    primary: 'cinematic' | 'intimate' | 'experimental' | 'dreamlike' | 'visceral';
    secondary: 'melancholic' | 'euphoric' | 'unsettling' | 'contemplative' | 'playful';
  };
  duration: number; // 60-90 seconds
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

export class MiyomiEdenPromptGenerator {
  
  /**
   * Generate complete Eden video project from market concept
   */
  async generateEdenProject(concept: DynamicVideoConcept): Promise<EdenVideoProject> {
    console.log('🎬 Generating Eden project for concept:', concept.title);
    
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
  generateEdenPrompt(project: EdenVideoProject): string {
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
${project.keyframes.map((kf, i) => 
  `### Frame ${i + 1} (${Math.round(kf.timePercent * 100)}%)
  Visual: ${kf.description}
  Camera Emotion: ${kf.cameraEmotion}
  Motion: ${kf.motionVocabulary}
  Transition: ${kf.transitionType}`
).join('\n\n')}

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
  generateQuickPrompt(concept: DynamicVideoConcept): string {
    const visualStyle = this.getVisualStyleFromConcept(concept);
    const emotionalTone = this.getEmotionalToneFromConcept(concept);
    
    return `MIYOMI Market Analysis: ${concept.title}

Visual Style: ${visualStyle}
Emotional Tone: ${emotionalTone}

Core Message: ${concept.contrarian_angle}

Data Visualization: ${concept.dataPoints.primary}

Create a ${concept.urgencyScore > 80 ? 'urgent' : 'contemplative'} market analysis video that reveals why consensus is wrong about ${concept.title.split(':')[0]}. 

Style: Professional financial content with artistic cinematography, data overlays, NYC energy, contrarian perspective.

Duration: 60 seconds, 16:9 format, high production value.`;
  }

  // Phase 1: Initial Configuration
  private createInitialConfiguration(concept: DynamicVideoConcept): EdenVideoProject {
    return {
      title: this.generateEvocativeTitle(concept),
      coreConcept: this.generatePhilosophicalPremise(concept),
      visualDNA: this.generateVisualDNA(concept),
      emotionalFrequency: this.determineEmotionalFrequency(concept),
      duration: this.calculateOptimalDuration(concept),
      narrative: {} as any, // Will be filled in Phase 2
      visualMath: {} as any, // Will be filled in Phase 3
      styleSynthesis: {} as any, // Will be filled in Phase 4
      keyframes: [], // Will be filled in Phase 5
      sonicArchitecture: {} as any, // Will be filled in Phase 6
      artistStatement: {} as any // Will be filled in Phase 7
    };
  }

  private generateEvocativeTitle(concept: DynamicVideoConcept): string {
    const templates = [
      `The ${concept.targetAudience.replace('_', ' ')} Paradox`,
      `Market Memory: ${concept.title.split(':')[0]}`,
      `Contrarian Frequencies: ${concept.urgencyScore}%`,
      `The Consensus Delusion`,
      `Edge of Certainty: ${concept.dataPoints.primary.split(':')[0]}`,
      `Probability Dreams`,
      `The Crowd's Blindness`,
      `Mathematical Dissent`
    ];
    
    return templates[Math.floor(Math.random() * templates.length)];
  }

  private generatePhilosophicalPremise(concept: DynamicVideoConcept): string {
    return `Market psychology reveals human nature through the lens of ${concept.title.split(':')[0].toLowerCase()}—where consensus reality breaks down at the edges of uncertainty, creating pockets of alpha for those who see beyond the crowd's emotional gravitational field.`;
  }

  private generateVisualDNA(concept: DynamicVideoConcept): string {
    const sectorDNA = {
      politics: 'Liminal government spaces dissolving into data streams, brutalist architecture softened by probability clouds, shadow corridors where power and uncertainty intersect',
      finance: 'Hyperreal trading floors as digital cathedrals, flowing market data crystallizing into geometric forms, numbers cascading like sacred rain through NYSE-lit chambers',
      ai: 'Neural networks visualized as living organisms, liquid light patterns flowing through silicon dreams, consciousness emerging from mathematical poetry',
      sports: 'Stadium energy frozen in temporal amber, crowd emotions rendered as color field paintings, victory/defeat symmetry expressed through architectural forms',
      pop: 'Social media infinite scroll made physical, viral moments crystallizing into gallery installations, attention economy as visible light structures',
      geo: 'Satellite views dissolving into human-scale intimacy, national borders as gossamer light lines, geopolitical tensions as weather patterns',
      internet: 'Data packet flows as river systems, server farms as brutalist monasteries, human connection threading through fiber optic prayers'
    };

    const baseDNA = sectorDNA[concept.title.toLowerCase().includes('btc') || concept.title.toLowerCase().includes('crypto') ? 'finance' : 'finance'] || sectorDNA.finance;
    
    return `${baseDNA}. Contrarian energy manifests as geometric disruption—probability distributions colliding with consensus reality, creating visual turbulence where mathematical truth emerges from market psychology's failures.`;
  }

  private determineEmotionalFrequency(concept: DynamicVideoConcept): EdenVideoProject['emotionalFrequency'] {
    // Map concept characteristics to emotional frequencies
    if (concept.urgencyScore > 85) {
      return { primary: 'visceral', secondary: 'unsettling' };
    } else if (concept.trendingPotential === 'viral') {
      return { primary: 'cinematic', secondary: 'euphoric' };
    } else if (concept.targetAudience === 'contrarians') {
      return { primary: 'experimental', secondary: 'contemplative' };
    } else if (concept.dataPoints.primary.includes('crypto') || concept.dataPoints.primary.includes('BTC')) {
      return { primary: 'dreamlike', secondary: 'playful' };
    } else {
      return { primary: 'intimate', secondary: 'melancholic' };
    }
  }

  private calculateOptimalDuration(concept: DynamicVideoConcept): number {
    // Base duration on urgency and complexity
    if (concept.urgencyScore > 80) return 60; // Urgent concepts need quick delivery
    if (concept.trendingPotential === 'viral') return 75; // Viral content sweet spot
    return 90; // Default contemplative length
  }

  // Phase 2: Narrative Architecture
  private generateNarrativeArchitecture(concept: DynamicVideoConcept, project: EdenVideoProject): EdenVideoProject['narrative'] {
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

  private generateOpeningHook(concept: DynamicVideoConcept): string {
    const hooks = [
      `What if everything the market believes about ${concept.title.split(':')[0]} is backwards?`,
      `${concept.urgencyScore}% urgency. ${concept.estimatedViews.toLocaleString()} potential views. Here's why everyone's wrong.`,
      `The crowd sees ${concept.dataPoints.primary.split(':')[0]}. I see something else entirely.`,
      `Market psychology just revealed its deepest bias. Most traders will never notice.`,
      `Between what we know and what we pretend to know lies all the alpha in ${concept.title.split(':')[0]}.`
    ];
    
    return hooks[Math.floor(Math.random() * hooks.length)];
  }

  private generateMiddleDevelopment(concept: DynamicVideoConcept): string {
    return `${concept.contrarian_angle} The data tells a different story: ${concept.dataPoints.primary}. While consensus builds around comfortable narratives, mathematical reality operates by different rules. ${concept.scriptOutline.development}`;
  }

  private generateClimaticRevelation(concept: DynamicVideoConcept): string {
    return `This isn't about being right or wrong—it's about seeing patterns that haven't become consensus yet. ${concept.scriptOutline.revelation} When ${concept.urgencyScore}% urgency meets ${concept.trendingPotential} potential, the market's emotional biases become visible architecture.`;
  }

  private generateClosingResonance(concept: DynamicVideoConcept): string {
    const resonances = [
      'Markets are mirrors reflecting not truth, but what we need to believe.',
      'The most profitable insights live in the space where logic meets intuition.',
      'Every crowd has an expiration date. The question: are you inside or outside when it hits?',
      'Alpha doesn\'t last forever. But understanding why it exists does.',
      'The market prices human nature itself—and human nature is beautifully predictable.'
    ];
    
    return resonances[Math.floor(Math.random() * resonances.length)];
  }

  private generateVoiceDirection(emotionalFreq: EdenVideoProject['emotionalFrequency']): string {
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
  private calculateVisualMathematics(wordCount: number, duration: number): EdenVideoProject['visualMath'] {
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
  private generateStyleSynthesis(concept: DynamicVideoConcept, project: EdenVideoProject): EdenVideoProject['styleSynthesis'] {
    return {
      atmosphericLogic: this.getAtmosphericLogic(project.emotionalFrequency),
      colorPhilosophy: this.getColorPhilosophy(concept, project.emotionalFrequency),
      texturalLanguage: this.getTexturalLanguage(project.emotionalFrequency),
      compositionalRules: this.getCompositionRules(concept),
      secondaryElements: this.getSecondaryElements(concept)
    };
  }

  private getAtmosphericLogic(emotionalFreq: EdenVideoProject['emotionalFrequency']): string {
    const atmospheres = {
      visceral: 'Hyperreal financial landscapes—trading floors as battlegrounds where data becomes physical force',
      cinematic: 'Liminal market spaces where probability waves intersect with human ambition',
      experimental: 'Abstract geometries born from mathematical chaos—market inefficiencies as architectural forms',
      dreamlike: 'Market consciousness floating between dimensions of certainty and doubt',
      intimate: 'Human-scale spaces where individual decisions ripple into systemic change'
    };
    
    return atmospheres[emotionalFreq.primary];
  }

  private getColorPhilosophy(concept: DynamicVideoConcept, emotionalFreq: EdenVideoProject['emotionalFrequency']): string {
    if (concept.urgencyScore > 80) {
      return 'Bleeding saturation—reds that pulse with market urgency, whites that burn with certainty';
    } else if (emotionalFreq.secondary === 'melancholic') {
      return 'Muted poetry—grays and blues that suggest depth without despair';
    } else if (concept.trendingPotential === 'viral') {
      return 'Neon dreams—electric blues and warning oranges that grab attention without losing sophistication';
    } else {
      return 'Monochromatic discipline—black, white, and strategic red accents for emphasis';
    }
  }

  private getTexturalLanguage(emotionalFreq: EdenVideoProject['emotionalFrequency']): string {
    const textures = {
      visceral: 'Digital artifacts as battle scars—compression glitches that reveal truth',
      cinematic: 'Film grain that breathes—organic imperfection in digital perfection',
      experimental: 'Liquid glass surfaces reflecting mathematical poetry',
      dreamlike: 'Painted light bleeding through probability fields',
      intimate: 'Soft focus edges with crystalline detail centers'
    };
    
    return textures[emotionalFreq.primary];
  }

  private getCompositionRules(concept: DynamicVideoConcept): string {
    if (concept.urgencyScore > 75) {
      return 'Brutal asymmetry—off-center power that demands attention';
    } else if (concept.targetAudience === 'contrarians') {
      return 'Fractal recursion—patterns within patterns revealing deeper truths';
    } else {
      return 'Golden ratio discipline—mathematical harmony serving emotional impact';
    }
  }

  private getSecondaryElements(concept: DynamicVideoConcept): string[] {
    return [
      'Recurring data stream totems that pulse with market rhythm',
      'Geometric probability clouds that shift with narrative tension',
      'Abstract manifestations of crowd psychology as visual weather',
      'Subtle NYC architectural references grounding the analysis'
    ];
  }

  // Phase 5: Keyframe Choreography
  private generateKeyframeChoreography(project: EdenVideoProject): EdenVideoProject['keyframes'] {
    const keyframes: EdenVideoProject['keyframes'] = [];
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

  private generateKeyframeDescription(timePercent: number, project: EdenVideoProject): string {
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

  private getCameraEmotion(timePercent: number): string {
    const emotions = [
      'curious observation', 'analytical investigation', 'urgent discovery', 
      'triumphant recognition', 'contemplative distance'
    ];
    
    const index = Math.floor(timePercent * (emotions.length - 1));
    return emotions[index];
  }

  private getVisualProgression(timePercent: number): 'mystery' | 'complexity' | 'revelation' | 'afterimage' {
    if (timePercent <= 0.3) return 'mystery';
    if (timePercent <= 0.7) return 'complexity';
    if (timePercent <= 0.9) return 'revelation';
    return 'afterimage';
  }

  private getTransitionType(index: number, total: number, emotionalFreq: EdenVideoProject['emotionalFrequency']): 'hard_cut' | 'dissolve' | 'match_cut' {
    if (index === 0 || index === total - 1) return 'dissolve';
    if (emotionalFreq.primary === 'visceral') return 'hard_cut';
    if (emotionalFreq.secondary === 'unsettling') return 'hard_cut';
    return Math.random() > 0.6 ? 'match_cut' : 'dissolve';
  }

  private getMotionVocabulary(timePercent: number): string {
    const zoomPercent = 2 + Math.random() * 3; // 2-5% breathing zoom
    const driftDirection = timePercent < 0.33 ? 'lateral' : timePercent < 0.66 ? 'depth' : 'vertical';
    const morphing = timePercent > 0.3 && timePercent < 0.8 ? ', subtle reality morphs' : '';
    const particles = timePercent > 0.7 ? ', particle dissolution effects' : '';
    
    return `${zoomPercent.toFixed(1)}% breathing zoom, ${driftDirection} drift${morphing}${particles}`;
  }

  // Phase 6: Sonic Architecture
  private generateSonicArchitecture(project: EdenVideoProject): EdenVideoProject['sonicArchitecture'] {
    return {
      baseGenreFusion: this.getGenreFusion(project.emotionalFrequency),
      emotionalArc: 'Gentle opening establishing contemplation, building tension through middle sections, climactic revelation with full harmonic complexity, resolution into contemplative wisdom',
      frequencyDesign: 'Leave 800-2kHz space for narration clarity (-3db cut), low-end foundation for gravitas, high-end sparkle for data visualization elements'
    };
  }

  private getGenreFusion(emotionalFreq: EdenVideoProject['emotionalFrequency']): string {
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
  private generateArtistStatement(concept: DynamicVideoConcept, project: EdenVideoProject): EdenVideoProject['artistStatement'] {
    return {
      conceptualGenesis: `This piece emerges from the recognition that ${concept.title.toLowerCase()} represents more than market mechanics—it's a window into collective psychology at the moment of breakdown. When consensus reality meets mathematical truth, the friction generates both profit and poetry.`,
      
      technicalPoetry: `The visual architecture mirrors the emotional journey of contrarian thinking: ${project.styleSynthesis.atmosphericLogic.toLowerCase()}. Each frame breathes with market volatility, camera movements echo crowd psychology, and the ${project.sonicArchitecture.baseGenreFusion.toLowerCase()} maps the tension between logic and intuition.`,
      
      culturalResonance: `In an era where algorithms predict behavior while humans remain beautifully unpredictable, this work questions not just market efficiency but the nature of collective intelligence itself. The lasting question: when everyone's looking in the same direction, where should your eyes be?`
    };
  }

  // Utility methods
  private getVisualStyleFromConcept(concept: DynamicVideoConcept): string {
    if (concept.urgencyScore > 80) {
      return 'Hyperreal market visualization with urgent energy, data streams as physical force, NYC street wisdom meets Wall Street precision';
    } else {
      return 'Contemplative financial landscapes, probability waves intersecting with human psychology, cinematic market analysis';
    }
  }

  private getEmotionalToneFromConcept(concept: DynamicVideoConcept): string {
    if (concept.trendingPotential === 'viral') {
      return 'Confident contrarian energy with underlying excitement about seeing what others miss';
    } else {
      return 'Thoughtful analytical wisdom with moments of revelation, like a mentor sharing hard-earned insights';
    }
  }
}

// Export singleton
export const miyomiEdenPromptGenerator = new MiyomiEdenPromptGenerator();