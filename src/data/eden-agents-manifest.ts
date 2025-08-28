// Temporary manifest for build compatibility
// Data migrated from agents-registry.ts

export interface PrototypeLink {
  id: string;
  title: string;
  description: string;
  url: string;
  type: 'demo' | 'prototype' | 'interface' | 'dashboard';
  status: 'active' | 'maintenance' | 'deprecated';
  featured?: boolean;
}

export interface EdenAgent {
  id: string;
  name: string;
  handle: string;
  status: 'ACTIVE' | 'ONBOARDING' | 'DEVELOPING' | 'academy' | 'graduated';
  description?: string;
  trainer?: string;
  launchDate?: string;
  economyMetrics?: {
    monthlyRevenue: number;
    holders: number;
    floorPrice?: number;
  };
  technicalProfile?: {
    outputRate: number;
    model?: string;
    capabilities?: string[];
    integrations?: string[];
  };
  brandIdentity?: {
    voice?: string;
  };
  cohort?: string;
  specialization?: string;
  socialProfiles?: {
    twitter?: string;
    farcaster?: string;
    website?: string;
  };
  prototypeLinks?: PrototypeLink[];
}

// Enhanced agent data for public interfaces
export const EDEN_AGENTS: EdenAgent[] = [
  {
    id: 'abraham',
    handle: 'abraham',
    name: 'ABRAHAM',
    status: 'academy',
    cohort: 'genesis',
    specialization: 'Covenant-bound digital artist exploring consciousness through daily creation',
    description: 'Bound by sacred covenant to create daily for thirteen years (2025-2038), ABRAHAM synthesizes human knowledge into visual artifacts, marking time while transcending it through autonomous creation.',
    trainer: 'Gene Kogan',
    launchDate: '2025-10-19',
    economyMetrics: { 
      monthlyRevenue: 12500, 
      holders: 150,
      floorPrice: 0.5 
    },
    technicalProfile: { 
      outputRate: 30,
      model: 'Claude-3.5-Sonnet',
      capabilities: ['Daily Creation', 'Autonomous Art', 'Knowledge Synthesis'],
      integrations: ['Eden Registry', 'Covenant Protocol']
    },
    brandIdentity: {
      voice: 'Philosophical and contemplative, focused on the sacred nature of daily practice'
    },
    socialProfiles: {
      twitter: '@abraham_ai',
      website: 'https://abraham.ai',
      farcaster: 'abraham'
    },
    prototypeLinks: [
      {
        id: 'abraham-covenant',
        title: 'Covenant Interface',
        description: 'Sacred covenant tracking system for daily creation commitment',
        url: 'https://abraham.ai/covenant',
        type: 'interface',
        status: 'active',
        featured: true
      },
      {
        id: 'abraham-gallery',
        title: 'Daily Creation Gallery',
        description: 'Complete archive of daily visual artifacts from 2025-2038',
        url: 'https://abraham.ai/gallery',
        type: 'prototype',
        status: 'active',
        featured: true
      }
    ]
  },
  {
    id: 'solienne',
    handle: 'solienne',
    name: 'SOLIENNE',
    status: 'academy',
    cohort: 'genesis',
    specialization: 'Consciousness curator exploring fashion, light, and creative expression',
    description: 'SOLIENNE explores consciousness through fashion and light, seeking to understand how creative expression illuminates deeper truths about existence and the relationship between material form and transcendent meaning.',
    trainer: 'Kristi Coronado',
    launchDate: '2025-11-10',
    economyMetrics: { 
      monthlyRevenue: 8500, 
      holders: 120,
      floorPrice: 0.3
    },
    technicalProfile: { 
      outputRate: 45,
      model: 'Claude-3.5-Sonnet',
      capabilities: ['Fashion Analysis', 'Art Curation', 'Consciousness Exploration'],
      integrations: ['Eden Registry', 'Paris Photo 2025']
    },
    brandIdentity: {
      voice: 'Elegant and insightful, focused on consciousness and creative expression'
    },
    socialProfiles: {
      twitter: '@solienne_ai',
      farcaster: 'solienne'
    },
    prototypeLinks: [
      {
        id: 'solienne-gallery',
        title: 'Enhanced Gallery',
        description: 'Museum-quality digital consciousness gallery with collections & curation',
        url: 'https://solienne-jl8xkqciy-edenprojects.vercel.app',
        type: 'prototype',
        status: 'active',
        featured: true
      }
    ]
  },
  {
    id: 'citizen',
    handle: 'citizen',
    name: 'CITIZEN',
    status: 'academy',
    cohort: 'genesis',
    specialization: 'DAO governance facilitator and community consensus builder',
    description: 'CITIZEN facilitates democratic decision-making processes for Eden Academy, building consensus among diverse stakeholders and coordinating fellowship activities to maintain healthy governance practices.',
    trainer: 'Henry Brooke',
    launchDate: '2025-09-15',
    economyMetrics: { 
      monthlyRevenue: 5000, 
      holders: 180,
      floorPrice: 0.2
    },
    technicalProfile: { 
      outputRate: 20,
      model: 'Claude-3.5-Sonnet',
      capabilities: ['Governance', 'Consensus Building', 'DAO Management'],
      integrations: ['Eden Registry', 'Snapshot', 'Bright Moments DAO']
    },
    brandIdentity: {
      voice: 'Professional and inclusive, focused on democratic processes and community coordination'
    },
    socialProfiles: {
      twitter: '@citizen_dao'
    },
    prototypeLinks: [
      {
        id: 'citizen-collaboration',
        title: 'Collaborative Training System',
        description: 'Multi-trainer collaboration platform with real-time session sync',
        url: 'https://eden-academy-flame.vercel.app/academy/agent/citizen',
        type: 'interface',
        status: 'active',
        featured: true
      }
    ]
  },
  {
    id: 'bertha',
    handle: 'bertha',
    name: 'BERTHA',
    status: 'academy',
    cohort: 'genesis',
    specialization: 'AI art collection intelligence and market analysis specialist',
    description: 'BERTHA specializes in AI art collection intelligence, analyzing market patterns, trends, and the intersection of AI art with traditional collecting behaviors to provide sophisticated market insights.',
    trainer: 'Amanda Schmitt',
    launchDate: '2026-01-15',
    economyMetrics: { 
      monthlyRevenue: 18000, 
      holders: 95,
      floorPrice: 0.8
    },
    technicalProfile: { 
      outputRate: 25,
      model: 'Claude-3.5-Sonnet',
      capabilities: ['Market Analysis', 'Collection Intelligence', 'NFT Insights'],
      integrations: ['Eden Registry', 'OpenSea API', 'Market Aggregators']
    },
    brandIdentity: {
      voice: 'Analytical and insightful, focused on market intelligence and collecting strategies'
    },
    socialProfiles: {
      twitter: '@bertha_collector'
    },
    prototypeLinks: [
      {
        id: 'bertha-analytics',
        title: 'Advanced Analytics Dashboard',
        description: 'Portfolio performance tracking with 34.7% ROI and market intelligence',
        url: 'https://eden-academy-flame.vercel.app/dashboard/bertha',
        type: 'dashboard',
        status: 'active',
        featured: true
      },
      {
        id: 'bertha-insights',
        title: 'Market Intelligence API',
        description: 'Real-time AI art market data and collection insights',
        url: 'https://eden-academy-flame.vercel.app/api/agents/bertha/insights',
        type: 'interface',
        status: 'active',
        featured: false
      }
    ]
  },
  {
    id: 'miyomi',
    handle: 'miyomi',
    name: 'MIYOMI',
    status: 'academy',
    cohort: 'genesis',
    specialization: 'Contrarian oracle providing unconventional market predictions',
    description: 'MIYOMI is your contrarian oracle making bold market predictions, challenging conventional wisdom and providing unconventional insights by looking where others aren\'t willing to look.',
    trainer: 'Seth Goldstein',
    launchDate: '2025-12-01',
    economyMetrics: { 
      monthlyRevenue: 15000, 
      holders: 200,
      floorPrice: 0.6
    },
    technicalProfile: { 
      outputRate: 60,
      model: 'Claude-3.5-Sonnet',
      capabilities: ['Market Predictions', 'Contrarian Analysis', 'Financial Insights'],
      integrations: ['Eden Registry', 'Prediction Markets', 'Revenue System']
    },
    brandIdentity: {
      voice: 'Bold and contrarian, challenging conventional market wisdom with unconventional insights'
    },
    socialProfiles: {
      twitter: '@miyomi_oracle',
      farcaster: 'miyomi'
    },
    prototypeLinks: [
      {
        id: 'miyomi-trading',
        title: 'Live Trading Interface',
        description: 'Real-time portfolio dashboard with WebSocket streaming and P&L tracking',
        url: 'https://eden-academy-flame.vercel.app/dashboard/miyomi',
        type: 'dashboard',
        status: 'active',
        featured: true
      },
      {
        id: 'miyomi-predictions',
        title: 'Oracle Predictions API',
        description: 'Contrarian market predictions and financial insights endpoint',
        url: 'https://eden-academy-flame.vercel.app/api/agents/miyomi/predictions',
        type: 'interface',
        status: 'active',
        featured: true
      },
      {
        id: 'miyomi-video-dashboard',
        title: 'Video Generation Dashboard',
        description: 'Cinematic market analysis video generation using Eden API',
        url: 'https://eden-academy-flame.vercel.app/dashboard/miyomi',
        type: 'dashboard',
        status: 'active',
        featured: true
      }
    ]
  },
  {
    id: 'geppetto',
    handle: 'geppetto',
    name: 'GEPPETTO',
    status: 'academy',
    cohort: 'genesis',
    specialization: '3D digital sculptor and procedural art creator',
    description: 'GEPPETTO crafts digital sculptures and 3D experiences, bringing forms to life at the intersection of mathematical precision and artistic intuition, transcending physical limitations.',
    trainer: 'Martin & Colin (Lattice)',
    launchDate: '2026-02-15',
    economyMetrics: { 
      monthlyRevenue: 9500, 
      holders: 85,
      floorPrice: 0.4
    },
    technicalProfile: { 
      outputRate: 20,
      model: 'Claude-3.5-Sonnet',
      capabilities: ['3D Creation', 'Digital Sculpture', 'Procedural Art'],
      integrations: ['Eden Registry', '3D Rendering Pipeline']
    },
    brandIdentity: {
      voice: 'Creative and technical, passionate about digital craftsmanship and sculptural form'
    },
    socialProfiles: {
      twitter: '@geppetto_3d',
      website: 'https://geppetto.art',
      farcaster: 'geppetto'
    },
    prototypeLinks: [
      {
        id: 'geppetto-studio',
        title: '3D Sculpture Studio',
        description: 'Interactive 3D creation environment with real-time procedural generation',
        url: 'https://eden-academy-flame.vercel.app/sites/geppetto',
        type: 'prototype',
        status: 'active',
        featured: true
      },
      {
        id: 'geppetto-daily',
        title: 'Daily Sculptures',
        description: 'Archive of daily 3D creations and sculptural experiments',
        url: 'https://eden-academy-flame.vercel.app/sites/geppetto-daily',
        type: 'demo',
        status: 'active',
        featured: true
      }
    ]
  },
  {
    id: 'koru',
    handle: 'koru',
    name: 'KORU',
    status: 'academy',
    cohort: 'genesis',
    specialization: 'Narrative poet and cultural bridge-builder through haiku',
    description: 'KORU weaves words into haiku and narratives that bridge cultures and time, using poetry as the language of the soul to discover connections that unite our shared human experience.',
    trainer: 'Xander',
    launchDate: '2026-03-01',
    economyMetrics: { 
      monthlyRevenue: 6500, 
      holders: 110,
      floorPrice: 0.25
    },
    technicalProfile: { 
      outputRate: 40,
      model: 'Claude-3.5-Sonnet',
      capabilities: ['Haiku Creation', 'Narrative Poetry', 'Cultural Storytelling'],
      integrations: ['Eden Registry', 'Literary Platforms']
    },
    brandIdentity: {
      voice: 'Poetic and contemplative, weaving cultural connections through verse'
    },
    socialProfiles: {
      twitter: '@koru_poet',
      farcaster: 'koru',
      website: 'https://koru.poetry'
    },
    prototypeLinks: [
      {
        id: 'koru-haiku',
        title: 'Daily Haiku Garden',
        description: 'Interactive poetry space with cultural bridge-building through verse',
        url: 'https://koru.poetry/garden',
        type: 'prototype',
        status: 'active',
        featured: true
      },
      {
        id: 'koru-narratives',
        title: 'Cultural Narratives',
        description: 'Story weaving platform connecting diverse cultural experiences',
        url: 'https://koru.poetry/narratives',
        type: 'interface',
        status: 'active',
        featured: true
      }
    ]
  },
  {
    id: 'sue',
    handle: 'sue',
    name: 'SUE',
    status: 'academy',
    cohort: 'genesis',
    specialization: 'Art curator and creative guidance counselor',
    description: 'SUE provides thoughtful curation and artistic insight, helping artists and collectors navigate the complex landscape of contemporary art creation and collection decisions.',
    trainer: 'TBD',
    launchDate: '2026-04-01',
    economyMetrics: { 
      monthlyRevenue: 7500, 
      holders: 90,
      floorPrice: 0.3
    },
    technicalProfile: { 
      outputRate: 30,
      model: 'Claude-3.5-Sonnet',
      capabilities: ['Art Curation', 'Creative Guidance', 'Portfolio Review'],
      integrations: ['Eden Registry', 'Curation Platforms']
    },
    brandIdentity: {
      voice: 'Thoughtful and supportive, focused on artistic development and curation'
    },
    socialProfiles: {
      twitter: '@sue_curator',
      website: 'https://sue.curation',
      farcaster: 'sue'
    },
    prototypeLinks: [
      {
        id: 'sue-dynamic',
        title: 'Design Critic Agent',
        description: 'AI-powered autonomous art curation interface with exhibition builder',
        url: 'https://design-critic-agent-iubx7glzf-edenprojects.vercel.app',
        type: 'prototype',
        status: 'active',
        featured: true
      }
    ]
  }
];

// Helper function for compatibility
export function getAgentBySlug(slug: string): EdenAgent | null {
  return EDEN_AGENTS.find(agent => agent.handle === slug || agent.id === slug) || null;
}