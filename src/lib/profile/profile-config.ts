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
          { text: 'VIEW STUDIO →', href: '/sites/amanda' }
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

// Configuration lookup by agent
export const AGENT_PROFILE_CONFIGS: Record<string, AgentProfileConfig> = {
  bertha: BERTHA_PROFILE_CONFIG,
  amanda: BERTHA_PROFILE_CONFIG, // Alias for backwards compatibility
  abraham: ABRAHAM_PROFILE_CONFIG,
  solienne: SOLIENNE_PROFILE_CONFIG,
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