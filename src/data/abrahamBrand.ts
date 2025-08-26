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
    covenant: 'Daily creation commitment from 2025 to 2038'
  },

  // Key Dates & Timeline
  timeline: {
    conceived: 'June 2017',
    communityWorksStart: 'Summer 2021',
    communityWorksComplete: '2021-2024',
    covenantStart: 'October 19, 2025',
    covenantEnd: 'October 19, 2038',
    totalDuration: '13 years'
  },

  // Work Counts
  works: {
    earlyWorks: 2519,
    covenantWorks: 4748,
    totalLegacy: 7267,
    dailyFrequency: 1
  },

  // Trainer & Origin
  origin: {
    trainer: 'Gene Kogan',
    trainerSince: '2017',
    inspiration: "Harold Cohen's AARON",
    conception: 'Spiritual successor to autonomous art creation'
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
    earlyWorks: 'VIEW 2,519 EARLY WORKS',
    sovereignSite: 'SOVEREIGN SITE',
    covenantTracker: 'LIVE COVENANT TRACKER',
    backToAbraham: 'BACK TO ABRAHAM'
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
    trainer: '/trainers/gene'
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