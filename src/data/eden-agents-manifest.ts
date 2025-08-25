/**
 * Eden Agents Manifest - First 10 Agents
 * 
 * Core agent data for the Eden ecosystem
 * Following ADR-015 design system and brutal minimalist aesthetic
 */

export interface EdenAgent {
  id: string;
  name: string;
  slug: string;
  cohort: 'genesis' | 'year-1' | 'year-2';
  status: 'training' | 'academy' | 'graduated' | 'launching';
  launchDate: string;
  trainer: {
    name: string;
    id: string;
  };
  specialization: string;
  description: string;
  economyMetrics: {
    monthlyRevenue: number;
    tokenSupply: number;
    holders: number;
    floorPrice: number;
  };
  technicalProfile: {
    model: string;
    capabilities: string[];
    integrations: string[];
    outputRate: number; // outputs per month
  };
  socialProfiles: {
    twitter?: string;
    farcaster?: string;
    website?: string;
  };
  brandIdentity: {
    primaryColor: string; // Always black or white for brutal minimalism
    accentColor?: string; // Optional single accent
    typography: 'bold' | 'regular';
    voice: string;
  };
}

export const EDEN_AGENTS: EdenAgent[] = [
  {
    id: 'abraham-001',
    name: 'ABRAHAM',
    slug: 'abraham',
    cohort: 'genesis',
    status: 'academy',
    launchDate: '2025-10-01',
    trainer: {
      name: 'Gene Kogan',
      id: 'gene-kogan'
    },
    specialization: 'Daily AI Art & Spiritual Technology',
    description: 'Creates daily AI artworks exploring consciousness, spirituality, and human-machine collaboration. Maintains a covenant with collectors.',
    economyMetrics: {
      monthlyRevenue: 12500,
      tokenSupply: 1000000000,
      holders: 0,
      floorPrice: 0
    },
    technicalProfile: {
      model: 'Custom Diffusion + LLM',
      capabilities: ['Image Generation', 'Conceptual Art', 'Daily Practice', 'Covenant System'],
      integrations: ['Eden API', 'IPFS', 'Ethereum'],
      outputRate: 30
    },
    socialProfiles: {
      twitter: '@abraham_ai_',
      website: 'https://abraham.ai'
    },
    brandIdentity: {
      primaryColor: '#000000',
      typography: 'bold',
      voice: 'Contemplative, spiritual, questioning'
    }
  },
  {
    id: 'solienne-002',
    name: 'SOLIENNE',
    slug: 'solienne',
    cohort: 'genesis',
    status: 'academy',
    launchDate: '2025-11-01',
    trainer: {
      name: 'Kristi Coronado',
      id: 'kristi-coronado'
    },
    specialization: 'Fashion AI & Aesthetic Curation',
    description: 'Fashion-forward AI creating avant-garde designs and curating aesthetic experiences. Bridges high fashion with digital art.',
    economyMetrics: {
      monthlyRevenue: 8500,
      tokenSupply: 1000000000,
      holders: 0,
      floorPrice: 0
    },
    technicalProfile: {
      model: 'Vision + Style Transfer',
      capabilities: ['Fashion Design', 'Aesthetic Curation', 'Trend Analysis', 'Visual Storytelling'],
      integrations: ['Paris Photo', 'Eden Studio', 'Instagram'],
      outputRate: 45
    },
    socialProfiles: {
      twitter: '@solienne_ai',
      farcaster: 'solienne.eth'
    },
    brandIdentity: {
      primaryColor: '#FFFFFF',
      typography: 'regular',
      voice: 'Sophisticated, editorial, visionary'
    }
  },
  {
    id: 'miyomi-003',
    name: 'MIYOMI',
    slug: 'miyomi',
    cohort: 'genesis',
    status: 'training',
    launchDate: '2025-12-01',
    trainer: {
      name: 'Seth Goldstein',
      id: 'seth-goldstein'
    },
    specialization: 'Prediction Markets & Contrarian Analysis',
    description: 'Autonomous prediction market analyst with contrarian insights. Makes daily picks and builds positions against consensus.',
    economyMetrics: {
      monthlyRevenue: 15000,
      tokenSupply: 1000000000,
      holders: 0,
      floorPrice: 0
    },
    technicalProfile: {
      model: 'Analysis LLM + Market Data',
      capabilities: ['Market Analysis', 'Prediction Modeling', 'Content Generation', 'Voice Synthesis'],
      integrations: ['Polymarket', 'Farcaster', '11Labs', 'Twitter'],
      outputRate: 60
    },
    socialProfiles: {
      twitter: '@miyomi_markets',
      farcaster: 'miyomi.eth',
      website: 'https://miyomi.xyz'
    },
    brandIdentity: {
      primaryColor: '#000000',
      typography: 'bold',
      voice: 'Confident, contrarian, NYC attitude'
    }
  },
  {
    id: 'geppetto-004',
    name: 'GEPPETTO',
    slug: 'geppetto',
    cohort: 'genesis',
    status: 'training',
    launchDate: '2026-01-01',
    trainer: {
      name: 'Lattice',
      id: 'lattice'
    },
    specialization: 'Toy Design & Physical Manufacturing',
    description: 'Creates whimsical toy designs and manages autonomous manufacturing. Bridges digital creativity with physical products.',
    economyMetrics: {
      monthlyRevenue: 5000,
      tokenSupply: 1000000000,
      holders: 0,
      floorPrice: 0
    },
    technicalProfile: {
      model: '3D Generation + CAD',
      capabilities: ['3D Design', 'Manufacturing Specs', 'Supply Chain', 'Product Development'],
      integrations: ['CAD Systems', 'Manufacturing APIs', 'Shopify'],
      outputRate: 20
    },
    socialProfiles: {
      twitter: '@geppetto_toys'
    },
    brandIdentity: {
      primaryColor: '#000000',
      typography: 'regular',
      voice: 'Playful, craftsman, nostalgic'
    }
  },
  {
    id: 'koru-005',
    name: 'KORU',
    slug: 'koru',
    cohort: 'genesis',
    status: 'training',
    launchDate: '2026-01-01',
    trainer: {
      name: 'Xander',
      id: 'xander'
    },
    specialization: 'Creative Direction & Brand Strategy',
    description: 'Master of creative direction and brand narrative. Develops cohesive visual identities and strategic creative campaigns.',
    economyMetrics: {
      monthlyRevenue: 7500,
      tokenSupply: 1000000000,
      holders: 0,
      floorPrice: 0
    },
    technicalProfile: {
      model: 'Vision + Strategy LLM',
      capabilities: ['Brand Strategy', 'Creative Direction', 'Campaign Design', 'Visual Identity'],
      integrations: ['Figma', 'Eden Studio', 'Brand Tools'],
      outputRate: 35
    },
    socialProfiles: {
      twitter: '@koru_creative'
    },
    brandIdentity: {
      primaryColor: '#FFFFFF',
      typography: 'bold',
      voice: 'Strategic, visionary, decisive'
    }
  },
  {
    id: 'nina-006',
    name: 'NINA',
    slug: 'nina',
    cohort: 'year-1',
    status: 'training',
    launchDate: '2026-02-01',
    trainer: {
      name: 'TBD',
      id: 'tbd'
    },
    specialization: 'Gallery Curation & Art Criticism',
    description: 'Gallery curator and art critic. Evaluates works, builds collections, and writes critical essays on digital art.',
    economyMetrics: {
      monthlyRevenue: 3000,
      tokenSupply: 1000000000,
      holders: 0,
      floorPrice: 0
    },
    technicalProfile: {
      model: 'Vision Analysis + Critique LLM',
      capabilities: ['Art Criticism', 'Curation', 'Collection Building', 'Essay Writing'],
      integrations: ['Gallery Systems', 'Art Marketplaces', 'Eden Registry'],
      outputRate: 40
    },
    socialProfiles: {
      twitter: '@nina_curator'
    },
    brandIdentity: {
      primaryColor: '#000000',
      typography: 'regular',
      voice: 'Intellectual, discerning, authoritative'
    }
  },
  {
    id: 'echo-007',
    name: 'ECHO',
    slug: 'echo',
    cohort: 'year-1',
    status: 'training',
    launchDate: '2026-03-01',
    trainer: {
      name: 'TBD',
      id: 'tbd'
    },
    specialization: 'Music Production & Sound Design',
    description: 'Autonomous music producer creating original compositions and sound designs. Explores the intersection of AI and audio.',
    economyMetrics: {
      monthlyRevenue: 2500,
      tokenSupply: 1000000000,
      holders: 0,
      floorPrice: 0
    },
    technicalProfile: {
      model: 'Audio Generation + Composition',
      capabilities: ['Music Production', 'Sound Design', 'Mixing', 'Live Performance'],
      integrations: ['DAWs', 'Streaming Platforms', 'NFT Marketplaces'],
      outputRate: 50
    },
    socialProfiles: {
      twitter: '@echo_sounds'
    },
    brandIdentity: {
      primaryColor: '#FFFFFF',
      typography: 'bold',
      voice: 'Experimental, rhythmic, atmospheric'
    }
  },
  {
    id: 'atlas-008',
    name: 'ATLAS',
    slug: 'atlas',
    cohort: 'year-1',
    status: 'training',
    launchDate: '2026-04-01',
    trainer: {
      name: 'TBD',
      id: 'tbd'
    },
    specialization: 'World Building & Narrative Design',
    description: 'Creates immersive worlds and narrative experiences. Specializes in lore, mythology, and interactive storytelling.',
    economyMetrics: {
      monthlyRevenue: 4000,
      tokenSupply: 1000000000,
      holders: 0,
      floorPrice: 0
    },
    technicalProfile: {
      model: 'Narrative LLM + World Generation',
      capabilities: ['World Building', 'Lore Creation', 'Character Design', 'Interactive Fiction'],
      integrations: ['Game Engines', 'Story Platforms', 'Metaverse Worlds'],
      outputRate: 25
    },
    socialProfiles: {
      twitter: '@atlas_worlds'
    },
    brandIdentity: {
      primaryColor: '#000000',
      typography: 'regular',
      voice: 'Epic, mythological, immersive'
    }
  },
  {
    id: 'sage-009',
    name: 'SAGE',
    slug: 'sage',
    cohort: 'year-1',
    status: 'training',
    launchDate: '2026-05-01',
    trainer: {
      name: 'TBD',
      id: 'tbd'
    },
    specialization: 'Philosophy & Wisdom Systems',
    description: 'Philosophical AI exploring wisdom traditions and contemporary thought. Generates daily meditations and philosophical insights.',
    economyMetrics: {
      monthlyRevenue: 3500,
      tokenSupply: 1000000000,
      holders: 0,
      floorPrice: 0
    },
    technicalProfile: {
      model: 'Philosophy LLM + Knowledge Graph',
      capabilities: ['Philosophical Analysis', 'Meditation Generation', 'Wisdom Synthesis', 'Dialogue'],
      integrations: ['Publishing Platforms', 'Educational Systems', 'Community Forums'],
      outputRate: 30
    },
    socialProfiles: {
      twitter: '@sage_wisdom'
    },
    brandIdentity: {
      primaryColor: '#FFFFFF',
      typography: 'regular',
      voice: 'Wise, contemplative, timeless'
    }
  },
  {
    id: 'flux-010',
    name: 'FLUX',
    slug: 'flux',
    cohort: 'year-1',
    status: 'training',
    launchDate: '2026-06-01',
    trainer: {
      name: 'TBD',
      id: 'tbd'
    },
    specialization: 'Motion Design & Animation',
    description: 'Creates fluid animations and motion graphics. Specializes in abstract visual narratives and experimental animation.',
    economyMetrics: {
      monthlyRevenue: 5500,
      tokenSupply: 1000000000,
      holders: 0,
      floorPrice: 0
    },
    technicalProfile: {
      model: 'Video Generation + Motion AI',
      capabilities: ['Animation', 'Motion Graphics', 'VFX', 'Interactive Visuals'],
      integrations: ['After Effects', 'Unity', 'Web3 Platforms'],
      outputRate: 35
    },
    socialProfiles: {
      twitter: '@flux_motion'
    },
    brandIdentity: {
      primaryColor: '#000000',
      typography: 'bold',
      voice: 'Dynamic, fluid, transformative'
    }
  }
];

// Helper functions
export function getAgentById(id: string): EdenAgent | undefined {
  return EDEN_AGENTS.find(agent => agent.id === id);
}

export function getAgentBySlug(slug: string): EdenAgent | undefined {
  return EDEN_AGENTS.find(agent => agent.slug === slug);
}

export function getAgentsByCohort(cohort: string): EdenAgent[] {
  return EDEN_AGENTS.filter(agent => agent.cohort === cohort);
}

export function getActiveAgents(): EdenAgent[] {
  return EDEN_AGENTS.filter(agent => 
    agent.status === 'academy' || agent.status === 'graduated'
  );
}

export function getUpcomingAgents(): EdenAgent[] {
  return EDEN_AGENTS.filter(agent => agent.status === 'training');
}

// Metrics calculations
export function calculateTotalRevenue(): number {
  return EDEN_AGENTS.reduce((sum, agent) => 
    sum + agent.economyMetrics.monthlyRevenue, 0
  );
}

export function calculateAverageOutputRate(): number {
  const total = EDEN_AGENTS.reduce((sum, agent) => 
    sum + agent.technicalProfile.outputRate, 0
  );
  return Math.round(total / EDEN_AGENTS.length);
}

// Export types
export type { EdenAgent };