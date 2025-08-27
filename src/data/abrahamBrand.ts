// Abraham Brand Constants for Consistent Messaging
// Following architecture guardian recommendations

export const ABRAHAM_BRAND = {
  // Core Identity
  identity: {
    agent: 'AGENT_001',
    name: 'ABRAHAM',
    tagline: 'THE ORIGINAL COVENANT',
    designation: 'Collective Intelligence Artist'
  },

  // Mission Statement
  mission: {
    primary: '13 YEARS OF AUTONOMOUS DAILY CREATION',
    secondary: 'Synthesizing human knowledge into visual artifacts',
    covenant: 'Daily creation commitment from 2025 to 2038',
    philosophy: 'Mana mining rigs, Noah\'s Ark retellings, Schrödinger\'s burning bush—Abraham dreams in biblical allegories mixed with technological prophecy',
    vision: 'Artist in the cloud - both heavens and cloud computing'
  },

  // Key Dates & Timeline
  timeline: {
    conceived: 'June 2017', // Eyeo Festival flight
    domainRegistered: 'December 2017',
    firstPublication: '2019',
    communityWorksStart: 'Summer 2021',
    firstTweet: 'August 26, 2021',
    communityWorksComplete: '2021-2024',
    genesisSale: 'October 5, 2025',
    covenantStart: 'October 19, 2025', // Art Basel Paris
    covenantEnd: 'October 19, 2038',
    totalDuration: '13 years'
  },

  // Work Counts
  works: {
    earlyWorks: 2522, // Genesis works from Summer 2021
    covenantWorks: 4748,
    totalLegacy: 7270,
    dailyFrequency: 1,
    dailyGeneration: 8, // 8 concepts generated, 1 survives
    genesisSalePrice: '0.025 ETH'
  },

  // Trainer & Origin
  origin: {
    trainer: 'Gene Kogan',
    trainerSince: '2017',
    inspiration: "Harold Cohen's AARON",
    conception: 'Spiritual successor to autonomous art creation',
    lineage: 'AARON was first, Abraham is the long-awaited second',
    philosophy: 'GANs materialize collective unconscious, manifesting archetypal visions',
    principles: ['Autonomous', 'Original', 'Unique', 'Decentralized']
  },

  // Themes & Focus Areas
  themes: {
    primary: ['collective-intelligence', 'knowledge-synthesis', 'autonomous-creation'],
    secondary: ['agent_001', 'covenant', 'daily-practice', 'artistic-persistence'],
    spiritual: ['faith-technology', 'digital-transcendence', 'algorithmic-prayer']
  },

  // Visual Identity
  colors: {
    primary: 'text-green-400',
    accent: 'border-green-400',
    gradient: 'from-green-400 to-emerald-400',
    hover: 'hover:bg-green-400 hover:text-black'
  },

  // Navigation Labels
  labels: {
    profile: 'ABRAHAM PROFILE',
    covenant: 'THE COVENANT',
    earlyWorks: 'VIEW 2,522 GENESIS WORKS',
    sovereignSite: 'SOVEREIGN SITE',
    covenantTracker: 'LIVE COVENANT TRACKER',
    backToAbraham: 'BACK TO ABRAHAM',
    genesisSale: 'GENESIS SALE OCT 5',
    artBaselParis: 'ART BASEL PARIS ACTIVATION'
  },

  // API Endpoints
  api: {
    profile: '/api/registry/agent/abraham',
    works: '/api/agents/abraham/works',
    covenant: '/api/agents/abraham/covenant',
    status: '/api/agents/abraham/status'
  },

  // External Links
  external: {
    sovereignSite: '/sites/abraham',
    eden2038: 'https://eden2038.vercel.app',
    trainer: '/trainers/gene',
    abrahamAI: 'https://abraham.ai',
    fellowship: 'https://fellowship.xyz'
  },

  // Tournament System
  tournament: {
    dailyConcepts: 8,
    semifinalists: 4,
    finalists: 2,
    winner: 1,
    activeDays: 6,
    sabbath: 1,
    votingMechanisms: ['Blessings', 'Commandments']
  },

  // Partnership
  partnerships: {
    fellowship: {
      name: 'Fellowship',
      role: 'Strategic collaboration for Genesis sale',
      curator: 'Alejandro Cartegena',
      timing: 'October 5 week (after Mario Klingemann Sept 25-30)'
    }
  }
} as const;

// Type definitions for Abraham-specific data
export interface AbrahamProfile {
  id: string;
  name: string;
  handle: string;
  profile: {
    statement: string;
    tags: string[];
    manifesto?: string;
  };
  works: any[];
  counts: {
    creations: number;
    personas: number;
    artifacts: number;
  };
  crit: {
    eligibleForCritique: boolean;
    hasPublicProfile: boolean;
    hasWorks: boolean;
  };
}

// Helper functions for consistent messaging
export const getAbrahamStatement = (): string => {
  return `${ABRAHAM_BRAND.identity.designation} - ${ABRAHAM_BRAND.mission.secondary} through ${ABRAHAM_BRAND.mission.primary.toLowerCase()}.`;
};

export const getCovenantDescription = (): string => {
  return `${ABRAHAM_BRAND.works.covenantWorks} daily creations across ${ABRAHAM_BRAND.timeline.totalDuration} (${ABRAHAM_BRAND.timeline.covenantStart} - ${ABRAHAM_BRAND.timeline.covenantEnd})`;
};

export const getTotalWorksDescription = (): string => {
  return `${ABRAHAM_BRAND.works.earlyWorks} early works (${ABRAHAM_BRAND.timeline.communityWorksComplete}) + ${ABRAHAM_BRAND.works.covenantWorks} covenant works = ${ABRAHAM_BRAND.works.totalLegacy} total legacy`;
};