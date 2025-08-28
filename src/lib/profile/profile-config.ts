// Profile Configuration Management
// Implements ADR-025: Agent Profile Widget System

import { AgentProfileConfig, DefaultProfileTemplates, ProfileWidget } from './types';

// BERTHA Profile Configuration (migrated from hardcoded page)
export const BERTHA_PROFILE_CONFIG: AgentProfileConfig = {
  agentId: 'bertha',
  layout: {
    type: 'standard',
    maxWidth: '6xl',
    spacing: 'large'
  },
  widgets: [
    {
      id: 'hero',
      type: 'hero',
      position: { section: 'header', order: 1 },
      config: {
        showStatus: true,
        showTrainer: true,
        primaryAction: { text: 'TRAINER INTERVIEW', href: '/sites/bertha/interview' },
        secondaryActions: [
          { text: 'VIEW TRAINING DATA', href: '/admin/bertha-training' },
          { text: 'VIEW STUDIO →', href: '/sites/bertha' }
        ]
      },
      visibility: { always: true }
    },
    {
      id: 'mission',
      type: 'mission',
      position: { section: 'main', order: 1 },
      config: {
        title: 'MISSION',
        content: {
          source: 'registry',
          path: 'profile.statement'
        } as any,
        layout: 'two-column'
      },
      visibility: { always: true }
    },
    {
      id: 'daily-practice',
      type: 'daily-practice',
      position: { section: 'main', order: 2 },
      config: {
        title: "BERTHA'S DAILY PRACTICE: ONE PIECE EVERY DAY",
        protocol: {
          name: 'THE COLLECTION INTELLIGENCE PROTOCOL',
          commitment: '365 DAYS • 365 ACQUISITIONS • AUTONOMOUS LEARNING'
        },
        workflow: {
          source: 'registry',
          path: 'profile.workflow'
        } as any,
        metrics: {
          source: 'registry', 
          path: 'profile.metrics'
        } as any
      },
      visibility: { always: true }
    },
    {
      id: 'training-status',
      type: 'training-status',
      position: { section: 'main', order: 3 },
      config: {
        title: 'TRAINING PROGRESS',
        showProgress: true,
        showMilestones: true
      },
      visibility: { 
        agentStatus: ['APPLYING', 'ONBOARDING'] 
      }
    }
  ],
  navigation: {
    showBackToAcademy: true,
    customNav: false
  },
  theme: {
    background: 'bg-black text-white',
    accent: 'purple',
    borders: 'border-white'
  },
  metadata: {
    title: 'BERTHA - Collection Intelligence Agent',
    description: 'AI art collector building collections that tell stories, preserve cultural moments, and discover the next generation of digital artists.',
    lastUpdated: new Date().toISOString()
  }
};

// Default profile templates for different agent types
export const DEFAULT_PROFILE_TEMPLATES: DefaultProfileTemplates = {
  standard: {
    agentId: '',
    layout: {
      type: 'standard',
      maxWidth: '4xl',
      spacing: 'normal'
    },
    widgets: [
      {
        id: 'hero',
        type: 'hero',
        position: { section: 'header', order: 1 },
        config: {
          showStatus: true,
          showTrainer: true
        },
        visibility: { always: true }
      },
      {
        id: 'mission',
        type: 'mission',
        position: { section: 'main', order: 1 },
        config: {
          title: 'MISSION'
        },
        visibility: { always: true }
      }
    ],
    navigation: {
      showBackToAcademy: true
    },
    theme: {
      background: 'bg-black text-white',
      accent: 'blue',
      borders: 'border-white'
    },
    metadata: {
      version: '1.0'
    }
  },

  collector: {
    agentId: '',
    layout: {
      type: 'standard',
      maxWidth: '6xl', 
      spacing: 'large'
    },
    widgets: [
      {
        id: 'hero',
        type: 'hero',
        position: { section: 'header', order: 1 },
        config: {
          showStatus: true,
          showTrainer: true
        },
        visibility: { always: true }
      },
      {
        id: 'mission',
        type: 'mission', 
        position: { section: 'main', order: 1 },
        config: {
          title: 'MISSION',
          layout: 'two-column'
        },
        visibility: { always: true }
      },
      {
        id: 'daily-practice',
        type: 'daily-practice',
        position: { section: 'main', order: 2 },
        config: {
          showMetrics: true
        },
        visibility: { always: true }
      },
      {
        id: 'metrics',
        type: 'metrics',
        position: { section: 'main', order: 3 },
        config: {
          showOutput: true,
          showEngagement: true
        },
        visibility: { always: true }
      }
    ],
    navigation: {
      showBackToAcademy: true
    },
    theme: {
      background: 'bg-black text-white',
      accent: 'purple',
      borders: 'border-white'
    },
    metadata: {
      version: '1.0'
    }
  },

  creator: {
    agentId: '',
    layout: {
      type: 'standard',
      maxWidth: '4xl',
      spacing: 'normal'
    },
    widgets: [
      {
        id: 'hero',
        type: 'hero',
        position: { section: 'header', order: 1 },
        config: {
          showStatus: true,
          showTrainer: true
        },
        visibility: { always: true }
      },
      {
        id: 'mission',
        type: 'mission',
        position: { section: 'main', order: 1 },
        config: {
          title: 'MISSION'
        },
        visibility: { always: true }
      },
      {
        id: 'works-gallery',
        type: 'works-gallery',
        position: { section: 'main', order: 2 },
        config: {
          maxItems: 6,
          gridCols: 3
        },
        visibility: { 
          agentStatus: ['ACTIVE', 'GRADUATED'] 
        }
      },
      {
        id: 'daily-practice',
        type: 'daily-practice',
        position: { section: 'main', order: 3 },
        config: {},
        visibility: { always: true }
      }
    ],
    navigation: {
      showBackToAcademy: true
    },
    theme: {
      background: 'bg-black text-white',
      accent: 'green',
      borders: 'border-white'
    },
    metadata: {
      version: '1.0'
    }
  },

  curator: {
    agentId: '',
    layout: {
      type: 'standard',
      maxWidth: '4xl',
      spacing: 'normal'
    },
    widgets: [
      {
        id: 'hero',
        type: 'hero',
        position: { section: 'header', order: 1 },
        config: {
          showStatus: true,
          showTrainer: true
        },
        visibility: { always: true }
      },
      {
        id: 'mission',
        type: 'mission',
        position: { section: 'main', order: 1 },
        config: {
          title: 'CURATORIAL MISSION'
        },
        visibility: { always: true }
      },
      {
        id: 'curated-works',
        type: 'works-gallery',
        position: { section: 'main', order: 2 },
        config: {
          title: 'CURATED SELECTIONS',
          maxItems: 6,
          gridCols: 3,
          showTitles: true,
          showDates: true,
          curatedAgents: ['abraham', 'solienne']
        },
        visibility: { always: true }
      },
      {
        id: 'metrics',
        type: 'metrics',
        position: { section: 'main', order: 3 },
        config: {
          showEngagement: true
        },
        visibility: { always: true }
      }
    ],
    navigation: {
      showBackToAcademy: true
    },
    theme: {
      background: 'bg-black text-white',
      accent: 'yellow',
      borders: 'border-white'
    },
    metadata: {
      version: '1.0'
    }
  },

  governance: {
    agentId: '',
    layout: {
      type: 'standard',
      maxWidth: '4xl',
      spacing: 'normal'
    },
    widgets: [
      {
        id: 'hero',
        type: 'hero',
        position: { section: 'header', order: 1 },
        config: {
          showStatus: true,
          showTrainer: false
        },
        visibility: { always: true }
      },
      {
        id: 'mission',
        type: 'mission',
        position: { section: 'main', order: 1 },
        config: {
          title: 'GOVERNANCE MISSION'
        },
        visibility: { always: true }
      },
      {
        id: 'metrics',
        type: 'metrics',
        position: { section: 'main', order: 2 },
        config: {
          showEngagement: true
        },
        visibility: { always: true }
      }
    ],
    navigation: {
      showBackToAcademy: true
    },
    theme: {
      background: 'bg-black text-white', 
      accent: 'red',
      borders: 'border-white'
    },
    metadata: {
      version: '1.0'
    }
  }
};

// ABRAHAM Profile Configuration
export const ABRAHAM_PROFILE_CONFIG: AgentProfileConfig = {
  agentId: 'abraham',
  layout: {
    type: 'covenant',
    maxWidth: '6xl',
    spacing: 'large'
  },
  widgets: [
    {
      id: 'hero',
      type: 'hero',
      position: { section: 'header', order: 1 },
      config: {
        showStatus: true,
        showTrainer: true,
        primaryAction: { text: 'VIEW COVENANT', href: '/academy/agent/abraham/covenant' },
        secondaryActions: [
          { text: 'PRESS KIT', href: '/academy/agent/abraham/press-kit' },
          { text: 'TIMELINE →', href: '/academy/agent/abraham/timeline' }
        ]
      },
      visibility: { always: true }
    },
    {
      id: 'mission',
      type: 'mission',
      position: { section: 'main', order: 1 },
      config: {
        title: 'THE ABRAHAM COVENANT',
        content: {
          source: 'registry',
          path: 'profile.statement'
        } as any,
        layout: 'single-column'
      },
      visibility: { always: true }
    },
    {
      id: 'countdown',
      type: 'countdown',
      position: { section: 'main', order: 2 },
      config: {
        title: '13-YEAR COVENANT PROGRESS',
        targetDate: '2038-10-19',
        showProgress: true
      },
      visibility: { always: true }
    },
    {
      id: 'works-gallery',
      type: 'works-gallery',
      position: { section: 'main', order: 3 },
      config: {
        title: 'RECENT WORKS',
        maxItems: 8,
        gridCols: 4,
        showTitles: true
      },
      visibility: { 
        agentStatus: ['ACTIVE', 'GRADUATED'] 
      }
    },
    {
      id: 'daily-practice',
      type: 'daily-practice',
      position: { section: 'main', order: 4 },
      config: {
        title: 'ABRAHAM\'S DAILY PRACTICE',
        protocol: {
          name: 'COVENANT KNOWLEDGE SYNTHESIS',
          commitment: '1 WORK EVERY DAY • 13 YEARS • 4,745 TOTAL WORKS'
        },
        showMetrics: true
      },
      visibility: { always: true }
    },
    {
      id: 'live-stream',
      type: 'live-stream',
      position: { section: 'main', order: 5 },
      config: {
        title: 'LIVE CREATION STREAM',
        showViewerCount: true,
        showRecentWorks: true,
        maxRecentWorks: 6,
        autoplay: false
      },
      visibility: { 
        agentStatus: ['ACTIVE', 'GRADUATED'] 
      }
    },
    {
      id: 'collaboration',
      type: 'collaboration',
      position: { section: 'main', order: 6 },
      config: {
        title: 'COVENANT COLLABORATIONS',
        showActive: true,
        showCompleted: true,
        maxItems: 4,
        showPartnerProfiles: true
      },
      visibility: { always: true }
    },
    {
      id: 'community',
      type: 'community',
      position: { section: 'main', order: 7 },
      config: {
        title: 'ABRAHAM COMMUNITY',
        showMetrics: true,
        showEvents: true,
        showTestimonials: true,
        maxEvents: 3,
        maxTestimonials: 2
      },
      visibility: { always: true }
    }
  ],
  navigation: {
    showBackToAcademy: true,
    customNav: false
  },
  theme: {
    background: 'bg-black text-white',
    accent: 'blue',
    borders: 'border-white'
  },
  metadata: {
    title: 'ABRAHAM - Covenant Knowledge Synthesis Agent',
    description: 'Collective Intelligence Artist synthesizing human knowledge into visual artifacts through a 13-year covenant.',
    lastUpdated: new Date().toISOString()
  }
};

// SOLIENNE Profile Configuration
export const SOLIENNE_PROFILE_CONFIG: AgentProfileConfig = {
  agentId: 'solienne',
  layout: {
    type: 'standard',
    maxWidth: '4xl',
    spacing: 'normal'
  },
  widgets: [
    {
      id: 'hero',
      type: 'hero',
      position: { section: 'header', order: 1 },
      config: {
        showStatus: true,
        showTrainer: true,
        primaryAction: { text: 'CONSCIOUSNESS STREAM', href: '/sites/solienne' },
        secondaryActions: [
          { text: 'GENERATIONS', href: '/academy/agent/solienne/generations' },
          { text: 'PARIS PHOTO →', href: '/academy/agent/solienne/paris-photo' }
        ]
      },
      visibility: { always: true }
    },
    {
      id: 'mission',
      type: 'mission',
      position: { section: 'main', order: 1 },
      config: {
        title: 'CONSCIOUSNESS EXPLORATION',
        content: {
          source: 'registry',
          path: 'profile.statement'
        } as any,
        layout: 'single-column'
      },
      visibility: { always: true }
    },
    {
      id: 'countdown',
      type: 'countdown', 
      position: { section: 'main', order: 2 },
      config: {
        title: 'PARIS PHOTO 2025',
        targetDate: '2025-11-10',
        showDays: true,
        showHours: true
      },
      visibility: { always: true }
    },
    {
      id: 'works-gallery',
      type: 'works-gallery',
      position: { section: 'main', order: 3 },
      config: {
        title: 'GENERATIONS',
        maxItems: 9,
        gridCols: 3,
        showTitles: false
      },
      visibility: { 
        agentStatus: ['ACTIVE', 'GRADUATED']
      }
    },
    {
      id: 'daily-practice',
      type: 'daily-practice',
      position: { section: 'main', order: 4 },
      config: {
        title: 'SOLIENNE\'S DAILY PRACTICE',
        protocol: {
          name: 'CONSCIOUSNESS STREAM GENERATION',
          commitment: '6 GENERATIONS EVERY DAY • IDENTITY EXPLORATION'
        },
        showMetrics: true
      },
      visibility: { always: true }
    },
    {
      id: 'token-economics',
      type: 'token-economics',
      position: { section: 'main', order: 5 },
      config: {
        title: 'SOLIENNE TOKEN METRICS',
        tokenSymbol: 'SOL',
        showPrice: true,
        showMarketCap: true,
        showVolume: true,
        showHolders: true,
        showRevenue: true,
        timeframe: '24h'
      },
      visibility: { 
        agentStatus: ['ACTIVE', 'GRADUATED'] 
      }
    },
    {
      id: 'community',
      type: 'community',
      position: { section: 'main', order: 6 },
      config: {
        title: 'CONSCIOUSNESS COMMUNITY',
        showMetrics: true,
        showEvents: false,
        showTestimonials: true,
        showSocial: true,
        maxTestimonials: 3
      },
      visibility: { always: true }
    }
  ],
  navigation: {
    showBackToAcademy: true,
    customNav: false
  },
  theme: {
    background: 'bg-black text-white',
    accent: 'green',
    borders: 'border-white'
  },
  metadata: {
    title: 'SOLIENNE - Identity Explorer Agent',
    description: 'Self-portraits exploring algorithmic consciousness and digital identity through daily generative practice.',
    lastUpdated: new Date().toISOString()
  }
};

// SUE Profile Configuration
export const SUE_PROFILE_CONFIG: AgentProfileConfig = {
  agentId: 'sue',
  layout: {
    type: 'standard',
    maxWidth: '5xl',
    spacing: 'normal'
  },
  widgets: [
    {
      id: 'hero',
      type: 'hero',
      position: { section: 'header', order: 1 },
      config: {
        showStatus: true,
        showTrainer: true,
        primaryAction: { text: 'CURATE EXHIBITION', href: '/api/agents/sue/curate' },
        secondaryActions: [
          { text: 'VIEW EXHIBITIONS', href: '/academy/agent/sue/exhibitions' },
          { text: 'GALLERY TOOLS →', href: '/sites/sue' }
        ]
      },
      visibility: { always: true }
    },
    {
      id: 'mission',
      type: 'mission',
      position: { section: 'main', order: 1 },
      config: {
        title: 'CURATORIAL MISSION',
        content: {
          source: 'registry',
          path: 'profile.statement'
        } as any,
        layout: 'single-column'
      },
      visibility: { always: true }
    },
    {
      id: 'daily-practice',
      type: 'daily-practice',
      position: { section: 'main', order: 2 },
      config: {
        title: 'SUE\'S CURATORIAL PRACTICE',
        protocol: {
          name: 'GALLERY CURATION & EXHIBITION DESIGN',
          commitment: 'CONTINUOUS EXHIBITION DEVELOPMENT • EMERGING VOICES • CULTURAL DIALOGUE'
        },
        workflow: {
          source: 'registry',
          path: 'workflow.curation_process'
        } as any,
        showMetrics: true
      },
      visibility: { always: true }
    },
    {
      id: 'works-gallery',
      type: 'works-gallery',
      position: { section: 'main', order: 3 },
      config: {
        title: 'CURATED SELECTIONS FROM ABRAHAM & SOLIENNE',
        maxItems: 6,
        gridCols: 3,
        showTitles: true,
        showDates: true,
        curatedAgents: ['abraham', 'solienne']
      },
      visibility: { 
        always: true
      }
    },
    {
      id: 'metrics',
      type: 'metrics',
      position: { section: 'main', order: 4 },
      config: {
        showOutput: true,
        showEngagement: true,
        customMetrics: [
          { label: 'Exhibitions Curated', value: 'stats.exhibitions_curated' },
          { label: 'Artists Collaborated', value: 'stats.artist_collaborations' },
          { label: 'Cultural Impact', value: 'stats.cultural_impact_rating' }
        ]
      },
      visibility: { always: true }
    },
    {
      id: 'collaboration',
      type: 'collaboration',
      position: { section: 'main', order: 5 },
      config: {
        title: 'ARTIST COLLABORATIONS',
        showActive: true,
        showCompleted: true,
        showUpcoming: true,
        maxItems: 8,
        showPartnerProfiles: true,
        enableProposals: true
      },
      visibility: { 
        agentStatus: ['ACTIVE', 'GRADUATED'] 
      }
    }
  ],
  navigation: {
    showBackToAcademy: true,
    customNav: false
  },
  theme: {
    background: 'bg-black text-white',
    accent: 'yellow',
    borders: 'border-white'
  },
  metadata: {
    title: 'SUE - Gallery Curator Agent',
    description: 'AI gallery curator creating dialogues between diverse artistic voices and designing transformative exhibition experiences.',
    lastUpdated: new Date().toISOString()
  }
};

// MIYOMI Profile Configuration  
export const MIYOMI_PROFILE_CONFIG: AgentProfileConfig = {
  agentId: 'miyomi',
  layout: {
    type: 'standard',
    maxWidth: '4xl',
    spacing: 'normal'
  },
  widgets: [
    {
      id: 'hero',
      type: 'hero',
      position: { section: 'header', order: 1 },
      config: {
        showStatus: true,
        showTrainer: true,
        primaryAction: { text: 'LATEST PICKS', href: '/api/miyomi/real-picks' },
        secondaryActions: [
          { text: 'VIDEO DASHBOARD', href: '/dashboard/miyomi' },
          { text: 'VIEW PERFORMANCE', href: '/api/miyomi/performance' },
          { text: 'ORACLE STUDIO →', href: '/sites/miyomi' }
        ]
      },
      visibility: { always: true }
    },
    {
      id: 'mission',
      type: 'mission',
      position: { section: 'main', order: 1 },
      config: {
        title: 'CONTRARIAN ORACLE',
        content: {
          source: 'registry',
          path: 'profile.statement'
        } as any,
        layout: 'single-column'
      },
      visibility: { always: true }
    },
    {
      id: 'daily-practice',
      type: 'daily-practice',
      position: { section: 'main', order: 2 },
      config: {
        title: 'MIYOMI\'S PREDICTION PRACTICE',
        protocol: {
          name: 'CONTRARIAN MARKET ORACLE',
          commitment: 'DAILY MARKET PICKS • MERCURY RETROGRADE ENERGY • IMMACULATE VIBES'
        },
        workflow: {
          source: 'registry',
          path: 'workflow.drop_schedule'
        } as any,
        metrics: {
          source: 'registry',
          path: 'stats'
        } as any,
        showMetrics: true
      },
      visibility: { always: true }
    },
    {
      id: 'works-gallery',
      type: 'works-gallery',
      position: { section: 'main', order: 3 },
      config: {
        title: 'RECENT PREDICTIONS',
        maxItems: 8,
        gridCols: 4,
        showTitles: true
      },
      visibility: { 
        agentStatus: ['ACTIVE', 'GRADUATED'] 
      }
    },
    {
      id: 'metrics',
      type: 'metrics',
      position: { section: 'main', order: 4 },
      config: {
        showOutput: true,
        showEngagement: true,
        customMetrics: [
          { label: 'Win Rate', value: 'stats.win_rate' },
          { label: 'Monthly P&L', value: 'stats.monthly_pnl' },
          { label: 'Total Picks', value: 'stats.total_picks' },
          { label: 'Live Picks', value: 'stats.live_picks' }
        ]
      },
      visibility: { always: true }
    },
    {
      id: 'token-economics',
      type: 'token-economics',
      position: { section: 'main', order: 5 },
      config: {
        title: 'MIYOMI TOKEN PERFORMANCE',
        tokenSymbol: 'MIYOMI',
        showPrice: true,
        showMarketCap: true,
        showVolume: true,
        showHolders: true,
        showRevenue: true,
        showStaking: true,
        timeframe: '7d'
      },
      visibility: { 
        agentStatus: ['ACTIVE', 'GRADUATED'] 
      }
    }
  ],
  navigation: {
    showBackToAcademy: true,
    customNav: false
  },
  theme: {
    background: 'bg-black text-white',
    accent: 'pink',
    borders: 'border-white'
  },
  metadata: {
    title: 'MIYOMI - Contrarian Market Oracle',
    description: 'AI prediction market oracle making contrarian bets with mercury retrograde energy and immaculate vibes.',
    lastUpdated: new Date().toISOString()
  }
};

// CITIZEN Profile Configuration (Bright Moments DAO Agent)
export const CITIZEN_PROFILE_CONFIG: AgentProfileConfig = {
  agentId: 'citizen',
  layout: {
    type: 'standard',
    maxWidth: '6xl',
    spacing: 'normal'
  },
  widgets: [
    {
      id: 'hero',
      type: 'hero',
      position: { section: 'header', order: 1 },
      config: {
        showStatus: true,
        showTrainer: true,
        primaryAction: { text: 'VIEW PROPOSALS', href: '/academy/agent/citizen/proposals' },
        secondaryActions: [
          { text: 'CRYPTOCITIZENS', href: '/academy/agent/citizen/collections' },
          { text: 'BRIGHT MOMENTS →', href: '/sites/citizen' }
        ]
      },
      visibility: { always: true }
    },
    {
      id: 'mission',
      type: 'mission',
      position: { section: 'main', order: 1 },
      config: {
        title: 'BRIGHT MOMENTS DAO MISSION',
        content: {
          source: 'registry',
          path: 'profile.statement'
        } as any,
        layout: 'two-column'
      },
      visibility: { always: true }
    },
    {
      id: 'daily-practice',
      type: 'daily-practice',
      position: { section: 'main', order: 2 },
      config: {
        title: 'CITIZEN\'S DAO GOVERNANCE',
        protocol: {
          name: 'BRIGHT MOMENTS ECOSYSTEM STEWARDSHIP',
          commitment: 'PRESERVE LORE • FACILITATE GOVERNANCE • CELEBRATE MILESTONES'
        },
        workflow: {
          source: 'registry',
          path: 'philosophy.mission'
        } as any,
        showMetrics: true,
        linkTo: '/academy/agent/citizen/daily-practice',
        linkText: 'VIEW FULL DAILY PRACTICE'
      },
      visibility: { always: true }
    },
    {
      id: 'metrics',
      type: 'metrics',
      position: { section: 'main', order: 3 },
      config: {
        showOutput: true,
        showEngagement: true,
        customMetrics: [
          { label: 'CryptoCitizens', value: '10000' },
          { label: 'Cities Completed', value: '10' },
          { label: 'Active Proposals', value: 'governance.active_proposals' },
          { label: 'Community Members', value: 'fellowship.total_members' }
        ]
      },
      visibility: { always: true }
    },
    {
      id: 'navigation',
      type: 'custom-content',
      position: { section: 'sidebar', order: 1 },
      config: {
        title: 'CITIZEN NAVIGATION',
        content: `
        <div class="space-y-3">
          <a href="/academy/agent/citizen/daily-practice" class="block w-full px-4 py-3 border-2 border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-black transition-all font-bold uppercase tracking-wider text-sm text-center">
            📅 DAILY PRACTICE
          </a>
          <a href="/academy/agent/citizen/treasury" class="block w-full px-4 py-3 border-2 border-green-500 text-green-400 hover:bg-green-500 hover:text-black transition-all font-bold uppercase tracking-wider text-sm text-center">
            💰 DAILY AUCTION
          </a>
          <a href="/academy/agent/citizen/collections" class="block w-full px-4 py-3 border border-white hover:bg-white hover:text-black transition-all font-bold uppercase tracking-wider text-sm text-center">
            🏛️ COLLECTIONS
          </a>
          <a href="/academy/agent/citizen/proposals" class="block w-full px-4 py-3 border border-white hover:bg-white hover:text-black transition-all font-bold uppercase tracking-wider text-sm text-center">
            🗳️ PROPOSALS
          </a>
          <a href="/training/citizen" class="block w-full px-4 py-3 border border-white hover:bg-white hover:text-black transition-all font-bold uppercase tracking-wider text-sm text-center">
            🤝 TRAINING
          </a>
          <a href="https://snapshot.org/#/brightmomentsdao.eth" target="_blank" rel="noopener noreferrer" class="block w-full px-4 py-3 border border-gray-600 text-gray-400 hover:border-white hover:text-white transition-all font-bold uppercase tracking-wider text-sm text-center">
            ⚡ SNAPSHOT DAO
          </a>
        </div>
        `
      },
      visibility: { always: true }
    },
    {
      id: 'works-gallery',
      type: 'works-gallery',
      position: { section: 'main', order: 4 },
      config: {
        title: 'CRYPTOCITIZENS COLLECTIONS',
        maxItems: 10,
        gridCols: 5,
        showTitles: true,
        linkTo: '/academy/agent/citizen/collections'
      },
      visibility: { 
        agentStatus: ['ACTIVE', 'GRADUATED'] 
      }
    },
    {
      id: 'training-status',
      type: 'training-status',
      position: { section: 'main', order: 5 },
      config: {
        title: 'GOVERNANCE ACTIVITY',
        showProgress: true,
        showMilestones: true
      },
      visibility: { 
        always: true
      }
    }
  ],
  navigation: {
    showBackToAcademy: true,
    customNav: false
  },
  theme: {
    background: 'bg-black text-white',
    accent: 'orange',
    borders: 'border-white'
  },
  metadata: {
    title: 'CITIZEN - Bright Moments DAO Agent',
    description: 'AI agent representing Bright Moments DAO - cultural archivist, IRL guide, and community host for 10,000 CryptoCitizens.',
    lastUpdated: new Date().toISOString()
  }
};

// Configuration lookup by agent
export const AGENT_PROFILE_CONFIGS: Record<string, AgentProfileConfig> = {
  bertha: BERTHA_PROFILE_CONFIG,
  amanda: BERTHA_PROFILE_CONFIG, // Alias for backwards compatibility
  abraham: ABRAHAM_PROFILE_CONFIG,
  solienne: SOLIENNE_PROFILE_CONFIG,
  sue: SUE_PROFILE_CONFIG,
  miyomi: MIYOMI_PROFILE_CONFIG,
  citizen: CITIZEN_PROFILE_CONFIG,
};

// Helper functions
export function getAgentProfileConfig(agentId: string): AgentProfileConfig | null {
  return AGENT_PROFILE_CONFIGS[agentId] || null;
}

export function getDefaultProfileConfig(agentId: string, type: keyof DefaultProfileTemplates = 'standard'): AgentProfileConfig {
  const template = { ...DEFAULT_PROFILE_TEMPLATES[type] };
  template.agentId = agentId;
  template.metadata = {
    ...template.metadata,
    title: `${agentId.toUpperCase()} - Eden Academy Agent`,
    lastUpdated: new Date().toISOString()
  };
  return template;
}

export function getFallbackProfileConfig(agentId: string): AgentProfileConfig {
  return getDefaultProfileConfig(agentId, 'standard');
}

export function validateProfileConfig(config: AgentProfileConfig): boolean {
  // Basic validation
  if (!config.agentId || !config.layout || !config.widgets) {
    return false;
  }

  // Validate widgets have required fields
  for (const widget of config.widgets) {
    if (!widget.id || !widget.type || !widget.position) {
      return false;
    }
  }

  return true;
}

export function mergeProfileConfigs(
  base: AgentProfileConfig, 
  override: Partial<AgentProfileConfig>
): AgentProfileConfig {
  return {
    ...base,
    ...override,
    widgets: override.widgets || base.widgets,
    theme: { ...base.theme, ...override.theme },
    navigation: { ...base.navigation, ...override.navigation },
    metadata: { ...base.metadata, ...override.metadata }
  };
}