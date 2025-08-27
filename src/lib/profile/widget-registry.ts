// Widget Registry - Central catalog of all available widgets
// Implements ADR-025: Agent Profile Widget System

import { WidgetType, ProfileWidget } from './types';
import { ComponentType } from 'react';

// Import widget components (will create these next)
import { HeroWidget } from '@/components/agent-profile/widgets/HeroWidget';
import { MissionWidget } from '@/components/agent-profile/widgets/MissionWidget';
import { DailyPracticeWidget } from '@/components/agent-profile/widgets/DailyPracticeWidget';
import { TrainingStatusWidget } from '@/components/agent-profile/widgets/TrainingStatusWidget';
import { MetricsWidget } from '@/components/agent-profile/widgets/MetricsWidget';
import { WorksGalleryWidget } from '@/components/agent-profile/widgets/WorksGalleryWidget';
import { CountdownWidget } from '@/components/agent-profile/widgets/CountdownWidget';
import { TrainerInfoWidget } from '@/components/agent-profile/widgets/TrainerInfoWidget';
import { SocialLinksWidget } from '@/components/agent-profile/widgets/SocialLinksWidget';
import { CustomContentWidget } from '@/components/agent-profile/widgets/CustomContentWidget';
import { LiveStreamWidget } from '@/components/agent-profile/widgets/LiveStreamWidget';
import { TokenEconomicsWidget } from '@/components/agent-profile/widgets/TokenEconomicsWidget';
import { CollaborationWidget } from '@/components/agent-profile/widgets/CollaborationWidget';
import { CommunityWidget } from '@/components/agent-profile/widgets/CommunityWidget';

// Widget metadata for admin interface
export interface WidgetMetadata {
  type: WidgetType;
  name: string;
  description: string;
  component: ComponentType<any>;
  configSchema?: any; // JSON schema for configuration
  requirements?: string[]; // Required Registry data paths
  agentTypes?: string[]; // Which agent types can use this widget
  preview?: string; // Preview image URL
}

// Core widget registry
export const WIDGET_REGISTRY: Record<WidgetType, WidgetMetadata> = {
  hero: {
    type: 'hero',
    name: 'Hero Section',
    description: 'Agent name, status, trainer, and primary actions',
    component: HeroWidget,
    requirements: ['displayName', 'status', 'trainer.name'],
    configSchema: {
      type: 'object',
      properties: {
        showStatus: { type: 'boolean', default: true },
        showTrainer: { type: 'boolean', default: true },
        primaryAction: {
          type: 'object',
          properties: {
            text: { type: 'string' },
            href: { type: 'string' }
          }
        },
        secondaryActions: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              text: { type: 'string' },
              href: { type: 'string' }
            }
          }
        }
      }
    }
  },

  mission: {
    type: 'mission',
    name: 'Mission Statement',
    description: 'Agent purpose and specialization',
    component: MissionWidget,
    requirements: ['profile.statement'],
    configSchema: {
      type: 'object',
      properties: {
        title: { type: 'string', default: 'MISSION' },
        layout: { 
          type: 'string', 
          enum: ['single-column', 'two-column'], 
          default: 'single-column' 
        },
        showBorder: { type: 'boolean', default: true }
      }
    }
  },

  'daily-practice': {
    type: 'daily-practice',
    name: 'Daily Practice',
    description: 'Agent daily output and practice tracking',
    component: DailyPracticeWidget,
    requirements: ['profile.workflow'],
    agentTypes: ['creator', 'collector'],
    configSchema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        protocol: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            commitment: { type: 'string' }
          }
        },
        showMetrics: { type: 'boolean', default: true }
      }
    }
  },

  'training-status': {
    type: 'training-status',
    name: 'Training Status',
    description: 'Agent training progress and milestones',
    component: TrainingStatusWidget,
    requirements: ['status', 'launchDate'],
    configSchema: {
      type: 'object',
      properties: {
        showProgress: { type: 'boolean', default: true },
        showMilestones: { type: 'boolean', default: true },
        progressStyle: {
          type: 'string',
          enum: ['bar', 'circular', 'steps'],
          default: 'bar'
        }
      }
    }
  },

  metrics: {
    type: 'metrics',
    name: 'Performance Metrics',
    description: 'Agent performance and analytics',
    component: MetricsWidget,
    requirements: ['counts'],
    configSchema: {
      type: 'object',
      properties: {
        showRevenue: { type: 'boolean', default: false },
        showOutput: { type: 'boolean', default: true },
        showEngagement: { type: 'boolean', default: true },
        layout: {
          type: 'string',
          enum: ['horizontal', 'vertical', 'grid'],
          default: 'horizontal'
        }
      }
    }
  },

  'works-gallery': {
    type: 'works-gallery',
    name: 'Works Gallery',
    description: 'Recent works and creations',
    component: WorksGalleryWidget,
    requirements: ['counts.creations'],
    agentTypes: ['creator'],
    configSchema: {
      type: 'object',
      properties: {
        maxItems: { type: 'number', default: 6 },
        showTitles: { type: 'boolean', default: true },
        gridCols: { type: 'number', default: 3 }
      }
    }
  },

  countdown: {
    type: 'countdown',
    name: 'Launch Countdown',
    description: 'Countdown to agent launch or events',
    component: CountdownWidget,
    requirements: ['launchDate'],
    configSchema: {
      type: 'object',
      properties: {
        targetDate: { type: 'string' },
        title: { type: 'string' },
        showDays: { type: 'boolean', default: true },
        showHours: { type: 'boolean', default: true }
      }
    }
  },

  'trainer-info': {
    type: 'trainer-info',
    name: 'Trainer Information',
    description: 'Trainer profile and methodology',
    component: TrainerInfoWidget,
    requirements: ['trainer'],
    configSchema: {
      type: 'object',
      properties: {
        showBio: { type: 'boolean', default: true },
        showMethodology: { type: 'boolean', default: false },
        showContact: { type: 'boolean', default: false }
      }
    }
  },

  'social-links': {
    type: 'social-links',
    name: 'Social Links',
    description: 'Social media and external links',
    component: SocialLinksWidget,
    requirements: ['profile.links'],
    configSchema: {
      type: 'object',
      properties: {
        layout: {
          type: 'string',
          enum: ['horizontal', 'vertical'],
          default: 'horizontal'
        },
        showIcons: { type: 'boolean', default: true }
      }
    }
  },

  'custom-content': {
    type: 'custom-content',
    name: 'Custom Content',
    description: 'Agent-specific custom content',
    component: CustomContentWidget,
    configSchema: {
      type: 'object',
      properties: {
        content: { type: 'string' },
        format: {
          type: 'string',
          enum: ['markdown', 'html', 'text'],
          default: 'text'
        }
      }
    }
  },

  'live-stream': {
    type: 'live-stream',
    name: 'Live Stream',
    description: 'Real-time creation feeds and live streaming',
    component: LiveStreamWidget,
    agentTypes: ['creator', 'performer'],
    configSchema: {
      type: 'object',
      properties: {
        title: { type: 'string', default: 'Live Creation' },
        streamUrl: { type: 'string' },
        showViewerCount: { type: 'boolean', default: true },
        showChatPreview: { type: 'boolean', default: false },
        autoplay: { type: 'boolean', default: false },
        showRecentWorks: { type: 'boolean', default: true },
        maxRecentWorks: { type: 'number', default: 4 }
      }
    }
  },

  'token-economics': {
    type: 'token-economics',
    name: 'Token Economics',
    description: 'Agent token metrics and economic performance',
    component: TokenEconomicsWidget,
    requirements: ['tokenAddress'],
    configSchema: {
      type: 'object',
      properties: {
        title: { type: 'string', default: 'Token Economics' },
        tokenSymbol: { type: 'string' },
        showPrice: { type: 'boolean', default: true },
        showMarketCap: { type: 'boolean', default: true },
        showVolume: { type: 'boolean', default: true },
        showHolders: { type: 'boolean', default: true },
        showRevenue: { type: 'boolean', default: true },
        showDistribution: { type: 'boolean', default: false },
        showStaking: { type: 'boolean', default: false },
        timeframe: {
          type: 'string',
          enum: ['24h', '7d', '30d', 'all'],
          default: '24h'
        }
      }
    }
  },

  'collaboration': {
    type: 'collaboration',
    name: 'Collaborations',
    description: 'Inter-agent partnerships and joint projects',
    component: CollaborationWidget,
    configSchema: {
      type: 'object',
      properties: {
        title: { type: 'string', default: 'Collaborations' },
        showActive: { type: 'boolean', default: true },
        showCompleted: { type: 'boolean', default: true },
        showUpcoming: { type: 'boolean', default: false },
        maxItems: { type: 'number', default: 6 },
        showPartnerProfiles: { type: 'boolean', default: true },
        enableProposals: { type: 'boolean', default: false }
      }
    }
  },

  'community': {
    type: 'community',
    name: 'Community',
    description: 'Social engagement metrics and community features',
    component: CommunityWidget,
    requirements: ['profile.links'],
    configSchema: {
      type: 'object',
      properties: {
        title: { type: 'string', default: 'Community' },
        showMetrics: { type: 'boolean', default: true },
        showEvents: { type: 'boolean', default: true },
        showTestimonials: { type: 'boolean', default: true },
        showSocial: { type: 'boolean', default: true },
        showLeaderboard: { type: 'boolean', default: false },
        maxEvents: { type: 'number', default: 3 },
        maxTestimonials: { type: 'number', default: 2 }
      }
    }
  }
};

// Helper functions
export function getWidget(type: WidgetType): WidgetMetadata | undefined {
  return WIDGET_REGISTRY[type];
}

export function getAllWidgets(): WidgetMetadata[] {
  return Object.values(WIDGET_REGISTRY);
}

export function getWidgetsForAgentType(agentType: string): WidgetMetadata[] {
  return Object.values(WIDGET_REGISTRY).filter(widget => 
    !widget.agentTypes || widget.agentTypes.includes(agentType)
  );
}

export function validateWidget(widget: ProfileWidget): boolean {
  const metadata = getWidget(widget.type);
  if (!metadata) {
    console.error(`Unknown widget type: ${widget.type}`);
    return false;
  }

  // TODO: Validate against configSchema
  return true;
}

export function getWidgetComponent(type: WidgetType): ComponentType<any> | undefined {
  const metadata = getWidget(type);
  return metadata?.component;
}