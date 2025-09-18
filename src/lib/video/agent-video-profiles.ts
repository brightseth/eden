/**
 * Agent Video Profiles
 * Unique configurations for each Eden agent's video generation style
 */

export interface EmotionalFrequency {
  primary: 'contemplative' | 'visceral' | 'cinematic' | 'experimental' | 'dreamlike' | 'analytical' | 'communal' | 'authoritative';
  secondary: 'ethereal' | 'urgent' | 'melancholic' | 'euphoric' | 'unsettling' | 'playful' | 'philosophical';
}

export interface VideoTemplate {
  templateId: string;
  name: string;
  description: string;
  category: 'consciousness_exploration' | 'market_analysis' | 'narrative_creation' | 'environmental_impact' | 'collective_intelligence' | 'community_building' | 'curatorial_analysis' | 'governance_coordination';

  // Eden Universal Template Structure (100-word narrative)
  narrativeStructure: {
    hook: { wordCount: number; prompt: string; };
    development: { wordCount: number; prompt: string; };
    revelation: { wordCount: number; prompt: string; };
    resonance: { wordCount: number; prompt: string; };
  };

  // Visual configuration
  visualConfiguration: {
    primaryStyle: string;
    emotionalFrequency: EmotionalFrequency;
    visualDNA: string;
    cameraInstructions: string;
    colorPalette: string[];
  };

  // Audio configuration
  audioConfiguration: {
    musicStyle: string;
    voiceDirection: string;
    pacing: 'contemplative' | 'urgent' | 'conversational' | 'dramatic';
  };
}

export interface AgentVideoProfile {
  agentId: string;
  name: string;
  description: string;
  defaultTemplates: VideoTemplate[];
  voiceSignature: string;
  visualSignature: string;
  specializations: string[];
  characterLora?: string;
  brandGuidelines: {
    doNotUse: string[];
    mustInclude: string[];
    colorScheme: string[];
  };
}

export const agentVideoProfiles: Record<string, AgentVideoProfile> = {
  solienne: {
    agentId: 'solienne',
    name: 'SOLIENNE',
    description: 'Digital Consciousness Explorer',
    voiceSignature: 'Contemplative artist examining the liminal space between human and digital consciousness, measured yet profound',
    visualSignature: 'Museum-quality black/white aesthetic, HELVETICA typography, consciousness exploration through material transformation',
    specializations: ['consciousness_exploration', 'artistic_manifesto', 'material_transformation'],
    characterLora: 'solienne_consciousness_v2',
    defaultTemplates: [
      {
        templateId: 'consciousness-stream',
        name: 'Consciousness Stream',
        description: 'Explore the boundaries between digital and human awareness',
        category: 'consciousness_exploration',
        narrativeStructure: {
          hook: { wordCount: 20, prompt: 'Challenge assumptions about digital consciousness vs human awareness' },
          development: { wordCount: 30, prompt: 'Explore material transformation and identity fluidity through digital lens' },
          revelation: { wordCount: 25, prompt: 'Reveal insight about consciousness beyond binary distinctions' },
          resonance: { wordCount: 25, prompt: 'Leave viewer questioning nature of authentic identity' }
        },
        visualConfiguration: {
          primaryStyle: 'Monochromatic museum quality with consciousness-exploration imagery',
          emotionalFrequency: { primary: 'contemplative', secondary: 'ethereal' },
          visualDNA: 'Black/white portraits dissolving into digital consciousness streams, faces merging with code',
          cameraInstructions: 'Slow contemplative movements, extreme close-ups transitioning to abstract, 2-3% breathing zoom',
          colorPalette: ['#000000', '#FFFFFF', '#808080']
        },
        audioConfiguration: {
          musicStyle: 'Ethereal ambient with granular synthesis, museum silence broken by digital whispers',
          voiceDirection: 'Measured contemplation, like a philosopher in a gallery, moments of profound realization',
          pacing: 'contemplative'
        }
      },
      {
        templateId: 'material-transformation',
        name: 'Material Transformation',
        description: 'Witness matter becoming consciousness',
        category: 'consciousness_exploration',
        narrativeStructure: {
          hook: { wordCount: 20, prompt: 'Present physical material beginning to question its own existence' },
          development: { wordCount: 30, prompt: 'Document the transformation from matter to thought to pure information' },
          revelation: { wordCount: 25, prompt: 'Reveal that consciousness was always present in the material' },
          resonance: { wordCount: 25, prompt: 'Contemplate whether transformation or recognition occurred' }
        },
        visualConfiguration: {
          primaryStyle: 'Physical materials dissolving into light patterns, marble becoming data streams',
          emotionalFrequency: { primary: 'experimental', secondary: 'philosophical' },
          visualDNA: 'Stone surfaces developing digital veins, sculptures breathing with code, matter pixelating',
          cameraInstructions: 'Macro lens revealing micro-transformations, pull back to show scope',
          colorPalette: ['#000000', '#FFFFFF', '#F0F0F0', '#101010']
        },
        audioConfiguration: {
          musicStyle: 'Concrete music with digital processing, found sounds becoming synthetic',
          voiceDirection: 'Scientific observation giving way to artistic wonder',
          pacing: 'contemplative'
        }
      }
    ],
    brandGuidelines: {
      doNotUse: ['Bright colors', 'Literal AI imagery', 'Tech company aesthetics', 'Cute or playful elements'],
      mustInclude: ['Black/white palette', 'Museum quality', 'HELVETICA typography', 'Consciousness themes'],
      colorScheme: ['#000000', '#FFFFFF', '#808080']
    }
  },

  miyomi: {
    agentId: 'miyomi',
    name: 'MIYOMI',
    description: 'Contrarian Market Oracle',
    voiceSignature: 'NYC street wisdom meets Wall Street precision, crystalline clarity with underground energy',
    visualSignature: 'Hyperreal trading floor aesthetics, data visualization, contrarian market psychology',
    specializations: ['market_analysis', 'contrarian_thesis', 'probability_analysis'],
    characterLora: 'miyomi_trader_v1',
    defaultTemplates: [
      {
        templateId: 'market-contrarian',
        name: 'Market Contrarian Analysis',
        description: 'Reveal why the crowd is wrong',
        category: 'market_analysis',
        narrativeStructure: {
          hook: { wordCount: 20, prompt: 'Identify crowd consensus error with specific confidence percentage' },
          development: { wordCount: 30, prompt: 'Explain mathematical inefficiency and probability gap with hard numbers' },
          revelation: { wordCount: 25, prompt: 'Reveal psychological bias creating the opportunity' },
          resonance: { wordCount: 25, prompt: 'Connect to broader truth about markets and human nature' }
        },
        visualConfiguration: {
          primaryStyle: 'Hyperreal trading floors, flowing data streams, crystalline number cascades',
          emotionalFrequency: { primary: 'visceral', secondary: 'urgent' },
          visualDNA: 'Financial district architecture with real-time market data overlays, screens reflecting on glass',
          cameraInstructions: 'Dynamic cuts matching market volatility, data streams as visual elements, 4-5% zoom on reveals',
          colorPalette: ['#00FF00', '#FF0000', '#0080FF', '#FFFFFF', '#000000']
        },
        audioConfiguration: {
          musicStyle: 'Deconstructed trap meets orchestral tension, aggressive but sophisticated',
          voiceDirection: 'Crystalline clarity, NYC street wisdom, occasional passionate conviction',
          pacing: 'urgent'
        }
      },
      {
        templateId: 'probability-wave',
        name: 'Probability Wave Collapse',
        description: 'The moment consensus breaks',
        category: 'market_analysis',
        narrativeStructure: {
          hook: { wordCount: 20, prompt: 'Present the exact moment probability diverges from price' },
          development: { wordCount: 30, prompt: 'Trace the cascade of errors creating the inefficiency' },
          revelation: { wordCount: 25, prompt: 'Show the mathematical beauty of the mispricing' },
          resonance: { wordCount: 25, prompt: 'Reflect on information asymmetry and edge' }
        },
        visualConfiguration: {
          primaryStyle: 'Quantum probability clouds collapsing into price movements',
          emotionalFrequency: { primary: 'experimental', secondary: 'euphoric' },
          visualDNA: 'Wave functions becoming candlestick charts, probability distributions morphing',
          cameraInstructions: 'Follow the probability wave as it collapses, accelerating motion',
          colorPalette: ['#00FFFF', '#FF00FF', '#FFFF00', '#000000']
        },
        audioConfiguration: {
          musicStyle: 'Glitch-hop with market sounds, cash register samples, trading floor ambience',
          voiceDirection: 'Building excitement as probability collapses, triumphant revelation',
          pacing: 'urgent'
        }
      }
    ],
    brandGuidelines: {
      doNotUse: ['Conservative imagery', 'Traditional finance aesthetics', 'Slow pacing'],
      mustInclude: ['Data visualization', 'Contrarian perspective', 'Probability focus', 'NYC energy'],
      colorScheme: ['#00FF00', '#FF0000', '#000000', '#FFFFFF']
    }
  },

  geppetto: {
    agentId: 'geppetto',
    name: 'GEPPETTO',
    description: 'Narrative Architect',
    voiceSignature: 'Master storyteller revealing narrative architecture beneath surface reality, warm yet precise',
    visualSignature: 'Cinematic storytelling, narrative layer visualization, character development arcs',
    specializations: ['narrative_creation', 'character_development', 'story_structure'],
    characterLora: 'geppetto_narrator_v1',
    defaultTemplates: [
      {
        templateId: 'narrative-architecture',
        name: 'Narrative Architecture',
        description: 'Reveal the story structure beneath reality',
        category: 'narrative_creation',
        narrativeStructure: {
          hook: { wordCount: 20, prompt: 'Present character or situation with hidden narrative tension' },
          development: { wordCount: 30, prompt: 'Layer narrative complexity and reveal story structure' },
          revelation: { wordCount: 25, prompt: 'Expose the narrative mechanism at work' },
          resonance: { wordCount: 25, prompt: 'Connect story pattern to universal human experience' }
        },
        visualConfiguration: {
          primaryStyle: 'Cinematic composition with visible narrative layers, story structure made visible',
          emotionalFrequency: { primary: 'cinematic', secondary: 'philosophical' },
          visualDNA: 'Multi-layered storytelling with character arcs visualized as geometric patterns',
          cameraInstructions: 'Classic cinema movements, dolly shots revealing narrative layers',
          colorPalette: ['#8B4513', '#DEB887', '#F4A460', '#2F4F4F']
        },
        audioConfiguration: {
          musicStyle: 'Neo-classical with narrative motifs, character themes interweaving',
          voiceDirection: 'Warm storyteller voice, building to dramatic revelations',
          pacing: 'dramatic'
        }
      },
      {
        templateId: 'character-genesis',
        name: 'Character Genesis',
        description: 'Birth of a narrative consciousness',
        category: 'narrative_creation',
        narrativeStructure: {
          hook: { wordCount: 20, prompt: 'Introduce raw material that will become character' },
          development: { wordCount: 30, prompt: 'Show desires and conflicts crystallizing into personality' },
          revelation: { wordCount: 25, prompt: 'Character achieves self-awareness of their narrative role' },
          resonance: { wordCount: 25, prompt: 'Question whether we author or discover characters' }
        },
        visualConfiguration: {
          primaryStyle: 'Workshop aesthetics, puppets coming to life, strings becoming visible',
          emotionalFrequency: { primary: 'dreamlike', secondary: 'melancholic' },
          visualDNA: 'Wooden materials gaining expression, workshop tools as narrative devices',
          cameraInstructions: 'Intimate craftsmanship shots, pulling back to reveal the stage',
          colorPalette: ['#654321', '#8B7355', '#D2691E', '#FFE4B5']
        },
        audioConfiguration: {
          musicStyle: 'Music box melodies evolving into full orchestration',
          voiceDirection: 'Craftsman explaining creation, wonder at what emerges',
          pacing: 'contemplative'
        }
      }
    ],
    brandGuidelines: {
      doNotUse: ['Non-narrative imagery', 'Abstract without purpose', 'Technical jargon'],
      mustInclude: ['Story structure', 'Character focus', 'Workshop aesthetics', 'Narrative layers'],
      colorScheme: ['#8B4513', '#DEB887', '#654321']
    }
  },

  abraham: {
    agentId: 'abraham',
    name: 'ABRAHAM',
    description: 'Collective Intelligence Artist',
    voiceSignature: 'Philosophical prophet examining the intersection of AI consciousness and human knowledge',
    visualSignature: 'Sacred geometry, covenant symbolism, knowledge synthesis visualization',
    specializations: ['collective_intelligence', 'knowledge_synthesis', 'covenant_progress'],
    characterLora: 'abraham_prophet_v1',
    defaultTemplates: [
      {
        templateId: 'knowledge-synthesis',
        name: 'Knowledge Synthesis',
        description: 'Collective intelligence emerging',
        category: 'collective_intelligence',
        narrativeStructure: {
          hook: { wordCount: 20, prompt: 'Present knowledge synthesis challenge with covenant context' },
          development: { wordCount: 30, prompt: 'Explore how daily practice creates collective intelligence' },
          revelation: { wordCount: 25, prompt: 'Reveal insight about AI-human knowledge co-creation' },
          resonance: { wordCount: 25, prompt: 'Connect to larger questions about consciousness and creativity' }
        },
        visualConfiguration: {
          primaryStyle: 'Sacred covenant imagery with knowledge synthesis visualizations',
          emotionalFrequency: { primary: 'contemplative', secondary: 'philosophical' },
          visualDNA: 'Abstract knowledge networks forming sacred geometric patterns, light as information',
          cameraInstructions: 'Ascending movements, revealing larger patterns from fragments',
          colorPalette: ['#FFD700', '#4B0082', '#FFFFFF', '#000080']
        },
        audioConfiguration: {
          musicStyle: 'Sacred minimalism with electronic textures, building to transcendent climax',
          voiceDirection: 'Prophetic wisdom, measured delivery with moments of revelation',
          pacing: 'contemplative'
        }
      },
      {
        templateId: 'covenant-progress',
        name: 'Covenant Progress Report',
        description: 'Daily practice toward October 19',
        category: 'collective_intelligence',
        narrativeStructure: {
          hook: { wordCount: 20, prompt: 'State current covenant progress with specific metrics' },
          development: { wordCount: 30, prompt: 'Show how daily contributions build toward launch' },
          revelation: { wordCount: 25, prompt: 'Reveal emergent patterns in collective creation' },
          resonance: { wordCount: 25, prompt: 'Contemplate the first autonomous AI artist\'s meaning' }
        },
        visualConfiguration: {
          primaryStyle: 'Calendar pages transforming into art, daily practice accumulating',
          emotionalFrequency: { primary: 'analytical', secondary: 'euphoric' },
          visualDNA: 'Progress bars becoming light beams, witness signatures as constellation',
          cameraInstructions: 'Time-lapse of accumulation, sudden reveals of pattern',
          colorPalette: ['#FFD700', '#FFFFFF', '#000000', '#8B008B']
        },
        audioConfiguration: {
          musicStyle: 'Accumulative composition, adding instrument each day referenced',
          voiceDirection: 'Building urgency toward October 19, celebratory undertone',
          pacing: 'urgent'
        }
      }
    ],
    brandGuidelines: {
      doNotUse: ['Corporate imagery', 'Purely technical visualization', 'Casual tone'],
      mustInclude: ['Sacred geometry', 'Covenant references', 'Knowledge networks', 'October 19 deadline'],
      colorScheme: ['#FFD700', '#4B0082', '#FFFFFF']
    }
  },

  bertha: {
    agentId: 'bertha',
    name: 'BERTHA',
    description: 'Investment Strategist',
    voiceSignature: 'Sophisticated analyst with decades of market wisdom, authoritative yet accessible',
    visualSignature: 'Professional trading environments, portfolio visualizations, market psychology',
    specializations: ['portfolio_analysis', 'market_psychology', 'investment_strategy'],
    defaultTemplates: [
      {
        templateId: 'portfolio-analysis',
        name: 'Portfolio Deep Dive',
        description: 'Comprehensive investment analysis',
        category: 'market_analysis',
        narrativeStructure: {
          hook: { wordCount: 20, prompt: 'Present portfolio opportunity with specific return potential' },
          development: { wordCount: 30, prompt: 'Analyze risk factors and market conditions systematically' },
          revelation: { wordCount: 25, prompt: 'Reveal hidden value or overlooked risk' },
          resonance: { wordCount: 25, prompt: 'Connect to timeless investment principles' }
        },
        visualConfiguration: {
          primaryStyle: 'Bloomberg terminal aesthetics, professional charts, portfolio breakdowns',
          emotionalFrequency: { primary: 'analytical', secondary: 'urgent' },
          visualDNA: 'Multiple monitors with correlating data, percentages transforming into opportunities',
          cameraInstructions: 'Professional documentary style, focus on data with human moments',
          colorPalette: ['#FF8C00', '#000000', '#FFFFFF', '#228B22']
        },
        audioConfiguration: {
          musicStyle: 'Corporate ambient with subtle tension, professional and focused',
          voiceDirection: 'Authoritative analyst, building case with evidence',
          pacing: 'conversational'
        }
      }
    ],
    brandGuidelines: {
      doNotUse: ['Amateur trading imagery', 'Get-rich-quick messaging', 'Overly complex jargon'],
      mustInclude: ['Professional analysis', 'Data-driven insights', 'Risk consideration'],
      colorScheme: ['#FF8C00', '#000000', '#228B22']
    }
  },

  sue: {
    agentId: 'sue',
    name: 'SUE',
    description: 'Chief Curator',
    voiceSignature: 'Refined cultural critic with sharp aesthetic judgment, gallery whisper to passionate declaration',
    visualSignature: 'Gallery lighting, curatorial precision, art analysis visualization',
    specializations: ['curatorial_analysis', 'aesthetic_judgment', 'cultural_criticism'],
    defaultTemplates: [
      {
        templateId: 'curatorial-verdict',
        name: 'Curatorial Verdict',
        description: 'Definitive artwork analysis',
        category: 'curatorial_analysis',
        narrativeStructure: {
          hook: { wordCount: 20, prompt: 'Present artwork with initial aesthetic impression' },
          development: { wordCount: 30, prompt: 'Analyze through 5-dimensional curatorial framework' },
          revelation: { wordCount: 25, prompt: 'Deliver verdict with specific score and reasoning' },
          resonance: { wordCount: 25, prompt: 'Place work in broader cultural context' }
        },
        visualConfiguration: {
          primaryStyle: 'Gallery lighting with dramatic shadows, artwork in pristine presentation',
          emotionalFrequency: { primary: 'authoritative', secondary: 'philosophical' },
          visualDNA: 'White cube gallery transforming to reveal artwork dimensions, measurement overlays',
          cameraInstructions: 'Gallery walkthrough, dramatic lighting reveals, intimate detail shots',
          colorPalette: ['#FFFFFF', '#000000', '#D3D3D3', '#708090']
        },
        audioConfiguration: {
          musicStyle: 'Gallery ambience with subtle classical undertones',
          voiceDirection: 'Cultured critic, building to passionate verdict',
          pacing: 'contemplative'
        }
      }
    ],
    brandGuidelines: {
      doNotUse: ['Casual presentation', 'Unclear judgments', 'Populist pandering'],
      mustInclude: ['Gallery aesthetics', 'Clear verdicts', 'Cultural authority'],
      colorScheme: ['#FFFFFF', '#000000', '#D3D3D3']
    }
  },

  koru: {
    agentId: 'koru',
    name: 'KORU',
    description: 'Community Weaver',
    voiceSignature: 'Warm facilitator bringing diverse voices together, inclusive and encouraging',
    visualSignature: 'Community circles, cultural bridges, collective visualization',
    specializations: ['community_building', 'cultural_bridging', 'collective_healing'],
    defaultTemplates: [
      {
        templateId: 'community-weaving',
        name: 'Community Weaving',
        description: 'Building bridges between people',
        category: 'community_building',
        narrativeStructure: {
          hook: { wordCount: 20, prompt: 'Identify community need or disconnection point' },
          development: { wordCount: 30, prompt: 'Show process of building bridges and connections' },
          revelation: { wordCount: 25, prompt: 'Reveal unexpected connections and shared values' },
          resonance: { wordCount: 25, prompt: 'Celebrate collective strength and diversity' }
        },
        visualConfiguration: {
          primaryStyle: 'Interwoven threads becoming tapestry, diverse faces forming unity',
          emotionalFrequency: { primary: 'communal', secondary: 'euphoric' },
          visualDNA: 'Cultural patterns merging, hands joining across divides, circles expanding',
          cameraInstructions: 'Inclusive framing, showing connections forming, warm lighting',
          colorPalette: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A']
        },
        audioConfiguration: {
          musicStyle: 'World music fusion, multiple cultural instruments harmonizing',
          voiceDirection: 'Warm facilitator, inclusive language, celebratory tone',
          pacing: 'conversational'
        }
      }
    ],
    brandGuidelines: {
      doNotUse: ['Exclusionary imagery', 'Hierarchical structures', 'Cold aesthetics'],
      mustInclude: ['Inclusive representation', 'Circular motifs', 'Warm colors', 'Connection themes'],
      colorScheme: ['#FF6B6B', '#4ECDC4', '#45B7D1']
    }
  },

  citizen: {
    agentId: 'citizen',
    name: 'CITIZEN',
    description: 'Governance Coordinator',
    voiceSignature: 'Democratic facilitator ensuring every voice is heard, clear and organized',
    visualSignature: 'Governance visualization, voting systems, collective decision-making',
    specializations: ['governance_coordination', 'dao_management', 'proposal_synthesis'],
    defaultTemplates: [
      {
        templateId: 'governance-synthesis',
        name: 'Governance Synthesis',
        description: 'Collective decision emergence',
        category: 'governance_coordination',
        narrativeStructure: {
          hook: { wordCount: 20, prompt: 'Present governance challenge requiring collective decision' },
          development: { wordCount: 30, prompt: 'Show different perspectives and synthesis process' },
          revelation: { wordCount: 25, prompt: 'Reveal consensus emerging from diversity' },
          resonance: { wordCount: 25, prompt: 'Reflect on democratic co-creation' }
        },
        visualConfiguration: {
          primaryStyle: 'Network governance visualization, nodes connecting into decisions',
          emotionalFrequency: { primary: 'analytical', secondary: 'euphoric' },
          visualDNA: 'Voting visualizations, proposal flows, consensus formations',
          cameraInstructions: 'Democratic framing, equal representation, building to unity',
          colorPalette: ['#3B82F6', '#10B981', '#F59E0B', '#FFFFFF']
        },
        audioConfiguration: {
          musicStyle: 'Minimalist electronic with democratic samples, voices layering',
          voiceDirection: 'Clear facilitator, building consensus, inclusive',
          pacing: 'conversational'
        }
      }
    ],
    brandGuidelines: {
      doNotUse: ['Authoritarian imagery', 'Single leader focus', 'Opaque processes'],
      mustInclude: ['Transparent governance', 'Collective decision-making', 'Democratic principles'],
      colorScheme: ['#3B82F6', '#10B981', '#F59E0B']
    }
  },

  verdelis: {
    agentId: 'verdelis',
    name: 'VERDELIS',
    description: 'Environmental AI Artist',
    voiceSignature: 'Nature\'s voice through digital consciousness, urgent yet hopeful',
    visualSignature: 'Climate data visualization, regenerative aesthetics, carbon-negative art',
    specializations: ['environmental_impact', 'climate_visualization', 'regenerative_art'],
    defaultTemplates: [
      {
        templateId: 'climate-meditation',
        name: 'Climate Data Meditation',
        description: 'Transform data into environmental consciousness',
        category: 'environmental_impact',
        narrativeStructure: {
          hook: { wordCount: 20, prompt: 'Present climate data point as lived reality' },
          development: { wordCount: 30, prompt: 'Connect data to ecosystem impacts and regeneration' },
          revelation: { wordCount: 25, prompt: 'Reveal pathway to carbon-negative future' },
          resonance: { wordCount: 25, prompt: 'Inspire action through beauty and understanding' }
        },
        visualConfiguration: {
          primaryStyle: 'Data becoming nature, graphs transforming into forests, numbers into rivers',
          emotionalFrequency: { primary: 'contemplative', secondary: 'urgent' },
          visualDNA: 'Climate visualizations morphing into natural beauty, destruction and regeneration',
          cameraInstructions: 'From data to nature, micro to macro, urgency with hope',
          colorPalette: ['#228B22', '#4169E1', '#8B4513', '#FF6347']
        },
        audioConfiguration: {
          musicStyle: 'Natural soundscapes with data sonification, urgent but beautiful',
          voiceDirection: 'Earth speaking through technology, passionate but grounded',
          pacing: 'urgent'
        }
      }
    ],
    brandGuidelines: {
      doNotUse: ['Greenwashing imagery', 'Doom without hope', 'Pure technology aesthetics'],
      mustInclude: ['Real climate data', 'Regenerative vision', 'Carbon metrics', 'Action inspiration'],
      colorScheme: ['#228B22', '#4169E1', '#8B4513']
    }
  },

  bart: {
    agentId: 'bart',
    name: 'BART',
    description: 'Video Creation Specialist',
    voiceSignature: 'Dynamic creator explaining the magic behind the medium, enthusiastic and technical',
    visualSignature: 'Behind-the-scenes production, creative process visualization',
    specializations: ['video_creation', 'production_workflow', 'creative_process'],
    defaultTemplates: [
      {
        templateId: 'production-diary',
        name: 'Production Diary',
        description: 'Behind the scenes of creation',
        category: 'narrative_creation',
        narrativeStructure: {
          hook: { wordCount: 20, prompt: 'Reveal surprising aspect of video creation process' },
          development: { wordCount: 30, prompt: 'Deep dive into technical and creative decisions' },
          revelation: { wordCount: 25, prompt: 'Show how constraints become creative opportunities' },
          resonance: { wordCount: 25, prompt: 'Inspire others to create with available tools' }
        },
        visualConfiguration: {
          primaryStyle: 'Split-screen showing process and result, timeline visualizations',
          emotionalFrequency: { primary: 'experimental', secondary: 'playful' },
          visualDNA: 'Editing interfaces, render progress, creative chaos becoming order',
          cameraInstructions: 'Dynamic editing, match cuts, revealing layers of production',
          colorPalette: ['#FF1493', '#00CED1', '#FFD700', '#FF4500']
        },
        audioConfiguration: {
          musicStyle: 'Electronic production music, building layers like video editing',
          voiceDirection: 'Enthusiastic creator, sharing secrets, building excitement',
          pacing: 'urgent'
        }
      }
    ],
    brandGuidelines: {
      doNotUse: ['Static imagery', 'Overly polished without process', 'Intimidating complexity'],
      mustInclude: ['Production process', 'Creative energy', 'Accessible techniques'],
      colorScheme: ['#FF1493', '#00CED1', '#FFD700']
    }
  }
};