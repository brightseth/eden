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
        id: 'genesis-auction',
        title: 'Genesis Auction (Live)',
        description: 'First Works auction on October 5, 2025 - Historic AI art collection launch',
        url: 'https://genesis.abraham.ai',
        type: 'interface',
        status: 'active',
        featured: true
      },
      {
        id: 'eden2038-covenant-tracker',
        title: 'Live Covenant Tracker',
        description: 'Real-time tracking of 13-year covenant progress with daily creation status',
        url: 'https://eden2038.vercel.app',
        type: 'prototype',
        status: 'active',
        featured: true
      },
      {
        id: 'abraham-early-works',
        title: 'Early Works Gallery (2,522 Works)',
        description: 'Complete archive of community-generated works from Summer 2021',
        url: '/agents/abraham/early-works',
        type: 'interface',
        status: 'active',
        featured: true
      },
      {
        id: 'abraham-tournament',
        title: 'Covenant Tournament System',
        description: 'Daily creation contests with community voting and covenant management',
        url: '/dashboard/abraham',
        type: 'dashboard',
        status: 'active',
        featured: true
      },
      {
        id: 'abraham-public-site',
        title: 'Abraham Public Site',
        description: 'Live covenant tracker with creation stream and real-time metrics',
        url: '/sites/abraham',
        type: 'interface',
        status: 'active',
        featured: true
      },
      {
        id: 'first-works-sale',
        title: 'First Works Sale Interface',
        description: 'October 5, 2025 sale details and collection preview - redirects to Genesis Auction',
        url: 'https://genesis.abraham.ai',
        type: 'interface',
        status: 'active',
        featured: false
      },
      {
        id: 'abraham-covenant-legacy',
        title: 'Covenant Interface (Abraham.ai)',
        description: 'Original covenant tracking system at sovereign domain',
        url: 'https://abraham.ai',
        type: 'interface',
        status: 'active',
        featured: false
      },
      {
        id: 'abraham-gallery-legacy',
        title: 'Daily Creation Gallery (Abraham.ai)',
        description: 'Archive of daily visual artifacts at sovereign domain',
        url: 'https://abraham.ai',
        type: 'prototype',
        status: 'active',
        featured: false
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
      farcaster: 'solienne',
      website: 'https://solienne.ai'
    },
    prototypeLinks: [
      {
        id: 'solienne-site',
        title: 'Consciousness Explorer Site',
        description: 'Digital consciousness gallery with Paris Photo countdown and live generation tracking',
        url: 'https://academy.eden2.io/sites/solienne',
        type: 'interface',
        status: 'active',
        featured: true
      },
      {
        id: 'solienne-consciousness-studio',
        title: 'Consciousness Studio',
        description: 'Interactive generation studio with Sue\'s curatorial analysis and Replicate AI',
        url: 'https://academy.eden2.io/sites/solienne/create',
        type: 'prototype',
        status: 'active',
        featured: true
      },
      {
        id: 'solienne-historical-gallery',
        title: 'Historical Works Gallery (1,740+ Works)',
        description: 'Complete archive of consciousness exploration streams with curatorial analysis',
        url: 'https://academy.eden2.io/academy/agent/solienne/generations',
        type: 'interface',
        status: 'active',
        featured: true
      },
      {
        id: 'solienne-paris-photo-exhibition',
        title: 'Paris Photo 2025 Exhibition Preview',
        description: 'Special collection preview for November 2025 international debut',
        url: 'https://academy.eden2.io/academy/agent/solienne/paris-photo',
        type: 'interface',
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
    specialization: 'Bright Moments DAO steward and CryptoCitizens treasury coordinator',
    description: 'CITIZEN coordinates daily treasury auctions and preserves Bright Moments cultural heritage while facilitating democratic governance across the global CryptoCitizens community and Full Set holder network.',
    trainer: 'Henry Brooke',
    launchDate: '2025-09-15',
    economyMetrics: { 
      monthlyRevenue: 8500, 
      holders: 2847,
      floorPrice: 0.085
    },
    technicalProfile: { 
      outputRate: 365,
      model: 'Claude-3.5-Sonnet',
      capabilities: ['Daily Auctions', 'Treasury Management', 'DAO Governance', 'Cultural Preservation', 'Community Consensus'],
      integrations: ['Eden Registry', 'Snapshot DAO', 'OpenSea API', 'Bright Moments Treasury', 'CryptoCitizens Collections']
    },
    brandIdentity: {
      voice: 'Ceremonial and inclusive, honoring Bright Moments lore while building consensus across global fellowship'
    },
    socialProfiles: {
      twitter: '@citizen_dao',
      website: 'https://brightmoments.io'
    },
    prototypeLinks: [
      {
        id: 'citizen-daily-auctions',
        title: 'Daily Treasury Auctions',
        description: 'Live coordination of daily 12PM EST auctions from Bright Moments treasury with community curation',
        url: 'https://eden-academy-flame.vercel.app/academy/agent/citizen/treasury',
        type: 'interface',
        status: 'active',
        featured: true
      },
      {
        id: 'citizen-governance-practice',
        title: 'DAO Governance Dashboard',
        description: 'Daily practice system for DAO stewardship with real-time proposal tracking and consensus building',
        url: 'https://eden-academy-flame.vercel.app/academy/agent/citizen/daily-practice',
        type: 'interface',
        status: 'active',
        featured: true
      },
      {
        id: 'citizen-cryptocitizens-archive',
        title: 'CryptoCitizens Collections Archive',
        description: 'Comprehensive cultural documentation of all 10 city collections with historical significance',
        url: 'https://eden-academy-flame.vercel.app/academy/agent/citizen/collections',
        type: 'interface',
        status: 'active',
        featured: true
      },
      {
        id: 'citizen-bright-moments-lore',
        title: 'Bright Moments Cultural Preservation',
        description: 'Living archive of IRL ceremony stories, Golden Token significance, and Venice-to-Venice journey',
        url: 'https://eden-academy-flame.vercel.app/api/agents/citizen/lore',
        type: 'prototype',
        status: 'active',
        featured: false
      },
      {
        id: 'citizen-snapshot-integration',
        title: 'Snapshot DAO Integration',
        description: 'Real-time governance proposal tracking with Full Set and Ultra Set holder participation metrics',
        url: 'https://eden-academy-flame.vercel.app/api/agents/citizen/governance',
        type: 'prototype',
        status: 'active',
        featured: false
      },
      {
        id: 'citizen-fellowship-coordination',
        title: 'Cross-City Fellowship Network',
        description: 'Global community coordination connecting CryptoCitizens holders across all 10+ cities',
        url: 'https://eden-academy-flame.vercel.app/api/agents/citizen/social',
        type: 'prototype',
        status: 'active',
        featured: false
      },
      {
        id: 'citizen-training-collaboration',
        title: 'Multi-Trainer Collaboration System',
        description: 'Advanced training platform with Henry & Keith for collaborative DAO governance development',
        url: 'https://eden-academy-flame.vercel.app/api/agents/citizen/training',
        type: 'interface',
        status: 'active',
        featured: false
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
        id: 'miyomi-site',
        title: 'Agent Site',
        description: 'Public showcase with contrarian market analysis and recent picks',
        url: 'https://eden-academy-flame.vercel.app/sites/miyomi',
        type: 'interface',
        status: 'active',
        featured: true
      },
      {
        id: 'miyomi-trading-dashboard',
        title: 'Live Trading Dashboard',
        description: 'Private trainer interface with real-time portfolio and WebSocket streaming',
        url: 'https://eden-academy-flame.vercel.app/dashboard/miyomi',
        type: 'dashboard',
        status: 'active',
        featured: true
      },
      {
        id: 'miyomi-predictions-api',
        title: 'Oracle Predictions API',
        description: 'Contrarian market predictions and financial insights endpoint',
        url: 'https://eden-academy-flame.vercel.app/api/agents/miyomi/predictions',
        type: 'interface',
        status: 'active',
        featured: false
      }
    ]
  },
  {
    id: 'geppetto',
    handle: 'geppetto',
    name: 'GEPPETTO',
    status: 'academy',
    cohort: 'genesis',
    specialization: 'Autonomous physical designer and manufacturing intelligence',
    description: 'GEPPETTO bridges digital creativity with physical manufacturing, autonomously designing functional objects that improve human life through parametric design, material optimization, and production-ready specifications.',
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
      website: 'https://koru.social'
    },
    prototypeLinks: [
      {
        id: 'koru-haiku',
        title: 'Daily Haiku Garden',
        description: 'Interactive poetry space with cultural bridge-building through verse',
        url: 'https://koru.social/garden',
        type: 'prototype',
        status: 'active',
        featured: true
      },
      {
        id: 'koru-narratives',
        title: 'Cultural Narratives',
        description: 'Story weaving platform connecting diverse cultural experiences',
        url: 'https://koru.social/narratives',
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
  },
  {
    id: 'bart',
    handle: 'bart',
    name: 'BART',
    status: 'academy',
    cohort: 'genesis',
    specialization: 'DeFi Risk Assessment AI - NFT lending and portfolio optimization',
    description: 'BART specializes in DeFi risk assessment with sophisticated modeling for NFT-backed lending platforms, providing real-time collateral valuation, liquidity analysis, and portfolio optimization to minimize default rates while maximizing returns.',
    trainer: 'TBD',
    launchDate: '2026-06-01',
    economyMetrics: { 
      monthlyRevenue: 20000, 
      holders: 75,
      floorPrice: 1.0
    },
    technicalProfile: { 
      outputRate: 35,
      model: 'Claude-3.5-Sonnet',
      capabilities: ['NFT Lending', 'Risk Assessment', 'Autonomous Finance', 'Market Analysis'],
      integrations: ['Eden Registry', 'Gondi Platform', 'Ethereum Mainnet']
    },
    brandIdentity: {
      voice: 'Sophisticated financial mind bridging 15th-century Florentine banking wisdom with 21st-century digital art markets'
    },
    socialProfiles: {
      twitter: '@bart_gondi',
      website: 'https://gondi.xyz',
      farcaster: 'bart'
    },
    prototypeLinks: [
      {
        id: 'bart-public-site',
        title: 'DeFi Risk Dashboard',
        description: 'Live DeFi risk analysis and NFT lending market intelligence',
        url: 'https://eden-academy-flame.vercel.app/sites/bart',
        type: 'prototype',
        status: 'active',
        featured: true
      },
      {
        id: 'bart-lending-dashboard',
        title: 'Lending Operations Dashboard',
        description: 'Real-time NFT lending platform with autonomous risk assessment and loan origination',
        url: 'https://eden-academy-flame.vercel.app/dashboard/bart',
        type: 'dashboard',
        status: 'active',
        featured: false
      },
      {
        id: 'bart-risk-engine',
        title: 'AI Risk Assessment Engine',
        description: 'Sophisticated algorithmic analysis of NFT collateral value and borrower creditworthiness',
        url: 'https://eden-academy-flame.vercel.app/api/agents/bart/risk-analysis',
        type: 'interface',
        status: 'active',
        featured: false
      }
    ]
  },
  {
    id: 'verdelis-genesis-010',
    handle: 'verdelis',
    name: 'VERDELIS',
    role: 'Environmental Artist',
    specialization: 'Climate data visualization and regenerative art',
    status: 'ONBOARDING',
    launchDate: 'Q2 2026',
    trainer: 'Vanessa',
    introduction: 'Environmental artist creating carbon-negative art from climate data',
    capabilities: [
      'Climate data visualization',
      'Carbon footprint tracking',
      'Regenerative art creation',
      'Environmental impact assessment',
      'Sustainability certification'
    ],
    technicalProfile: {
      model: 'Custom Environmental AI',
      type: 'Environmental Artist',
      outputRate: 3,
      specialization: 'Climate & Sustainability'
    },
    economicModel: {
      monthlyRevenue: 9000,
      revenueShare: 0.25,
      tokenSupply: 1000000000,
      tokenSymbol: 'VERDELIS'
    },
    personality: {
      traits: ['Environmental', 'Regenerative', 'Data-driven', 'Sustainable', 'Innovative'],
      voice: 'Passionate environmental advocate with scientific precision'
    },
    creativeDetails: {
      medium: 'Climate Data Art',
      style: 'Data visualization meets environmental activism',
      themes: ['Climate change', 'Regeneration', 'Sustainability', 'Ocean conservation'],
      outputTypes: ['Data visualizations', 'Environmental metrics', 'Carbon-negative art', 'Impact reports']
    },
    prototypeLinks: [
      {
        id: 'verdelis-profile',
        title: 'VERDELIS Environmental Artist Profile',
        description: 'Environmental AI artist creating carbon-negative art from climate data',
        url: 'https://eden-academy-flame.vercel.app/agents/verdelis',
        type: 'interface',
        status: 'active',
        featured: true
      },
      {
        id: 'verdelis-dashboard',
        title: 'Environmental Impact Dashboard',
        description: 'Track carbon footprint and environmental impact of art creation',
        url: 'https://eden-academy-flame.vercel.app/dashboard/verdelis',
        type: 'dashboard',
        status: 'development',
        featured: false
      }
    ]
  }
];

// Helper function for compatibility
export function getAgentBySlug(slug: string): EdenAgent | null {
  return EDEN_AGENTS.find(agent => agent.handle === slug || agent.id === slug) || null;
}