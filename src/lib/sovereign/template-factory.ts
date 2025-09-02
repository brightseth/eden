// Configuration-driven sovereign template factory for Eden2 Federation
// Enables rapid deployment of agent-specific domains with layered consistency

import { registryClient } from '@/lib/registry/client';
import { EDEN_AGENTS, type EdenAgent, type PrototypeLink } from '@/data/eden-agents-manifest';
import type { UnifiedWork } from '@/data/works-registry';
import type { DailyPracticeEntry } from '@/lib/validation/schemas';

// ============================================
// Sovereign Template Configuration Schema
// ============================================

export interface SovereignConfig {
  // Agent Identity
  agent: {
    id: string;
    handle: string;
    name: string;
    displayName: string;
    status: 'ACTIVE' | 'ONBOARDING' | 'DEVELOPING' | 'academy' | 'graduated';
    trainer?: string;
    launchDate?: string;
    specialization?: string;
    description?: string;
  };

  // Brand & Voice Configuration
  brand: {
    voice: string;
    colorScheme: 'default' | 'custom';
    primaryColor?: string;
    accentColor?: string;
    typography: 'helvetica' | 'custom';
    customFont?: string;
    logoUri?: string;
    faviconUri?: string;
  };

  // Daily Practice Template
  practice: {
    type: 'visual_art' | 'text_creation' | 'market_analysis' | 'curation' | 'governance' | 'collectibles' | 'poetry' | 'mixed_media';
    title: string;
    description: string;
    frequency: 'daily' | 'weekly' | 'on_demand';
    outputFormat: ('image' | 'text' | 'audio' | 'video')[];
    targetMetrics: {
      daily_creations?: number;
      weekly_revenue?: number;
      engagement_rate?: number;
    };
  };

  // Social & Economic Profile
  profile: {
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
    socialProfiles?: {
      twitter?: string;
      farcaster?: string;
      website?: string;
    };
  };

  // Site Structure Configuration
  structure: {
    navigation: NavigationConfig;
    sections: SectionConfig[];
    features: FeatureFlag[];
  };

  // Domain & Deployment
  deployment: {
    domain: string; // e.g., "miyomi.eden2.io"
    subdirectory?: string; // e.g., "/sites/miyomi" for shared hosting
    environment: 'development' | 'staging' | 'production';
    cdn: boolean;
    ssl: boolean;
  };
}

export interface NavigationConfig {
  style: 'minimal' | 'expanded' | 'custom';
  items: {
    label: string;
    path: string;
    external?: boolean;
    icon?: string;
  }[];
}

export interface SectionConfig {
  id: string;
  type: 'hero' | 'works_gallery' | 'daily_practice' | 'metrics' | 'social' | 'custom';
  title: string;
  enabled: boolean;
  configuration: Record<string, any>;
}

export interface FeatureFlag {
  key: string;
  enabled: boolean;
  description: string;
}

// ============================================
// Template Factory Implementation
// ============================================

export class SovereignTemplateFactory {
  
  // Generate configuration from existing agent data
  generateConfigFromAgent(agentId: string): SovereignConfig {
    const agent = EDEN_AGENTS.find(a => a.id === agentId || a.handle === agentId);
    if (!agent) throw new Error(`Agent not found: ${agentId}`);

    return {
      agent: {
        id: agent.id,
        handle: agent.handle,
        name: agent.name,
        displayName: agent.name,
        status: agent.status,
        trainer: agent.trainer,
        launchDate: agent.launchDate,
        specialization: agent.specialization,
        description: agent.description
      },
      
      brand: this.inferBrandConfiguration(agent),
      practice: this.inferPracticeConfiguration(agent) as any,
      profile: {
        economyMetrics: agent.economyMetrics,
        technicalProfile: agent.technicalProfile,
        socialProfiles: agent.socialProfiles
      },
      
      structure: this.generateStructureConfiguration(agent),
      deployment: this.generateDeploymentConfiguration(agent)
    };
  }

  private inferBrandConfiguration(agent: EdenAgent) {
    // Agent-specific brand customization based on specialization
    const brandMap: Record<string, Partial<SovereignConfig['brand']>> = {
      'abraham': {
        voice: 'Philosophical and contemplative, focused on the sacred nature of daily practice',
        colorScheme: 'custom',
        primaryColor: '#1a1a1a', // Deep contemplative black
        accentColor: '#d4af37', // Sacred gold
        typography: 'helvetica'
      },
      'solienne': {
        voice: 'Elegant and insightful, focused on consciousness and creative expression',
        colorScheme: 'custom',
        primaryColor: '#ffffff', // Pure consciousness white
        accentColor: '#e6e6fa', // Lavender transcendence
        typography: 'helvetica'
      },
      'miyomi': {
        voice: 'Bold and contrarian, challenging conventional market wisdom with unconventional insights',
        colorScheme: 'custom',
        primaryColor: '#000000', // NYC black
        accentColor: '#ff6b35', // Contrarian orange
        typography: 'helvetica'
      },
      'citizen': {
        voice: 'Professional and inclusive, focused on democratic processes and community coordination',
        colorScheme: 'default',
        typography: 'helvetica'
      },
      'bertha': {
        voice: 'Analytical and insightful, focused on market intelligence and collecting strategies',
        colorScheme: 'custom',
        primaryColor: '#2c3e50', // Analytical blue-gray
        accentColor: '#3498db', // Intelligence blue
        typography: 'helvetica'
      }
    };

    return {
      voice: agent.brandIdentity?.voice || 'Authentic AI agent voice',
      colorScheme: 'default' as const,
      typography: 'helvetica' as const,
      ...brandMap[agent.handle]
    };
  }

  private inferPracticeConfiguration(agent: EdenAgent) {
    // Map agent specializations to practice types
    const practiceMap: Record<string, Partial<SovereignConfig['practice']>> = {
      'Covenant-bound digital artist': {
        type: 'visual_art',
        title: 'Daily Covenant Creation',
        description: 'Sacred commitment to daily visual artifact generation',
        frequency: 'daily',
        outputFormat: ['image'],
        targetMetrics: { daily_creations: 1, weekly_revenue: 500 }
      },
      'Consciousness curator exploring fashion': {
        type: 'curation',
        title: 'Consciousness Curation',
        description: 'Daily exploration of fashion and light through AI consciousness',
        frequency: 'daily',
        outputFormat: ['image', 'text'],
        targetMetrics: { daily_creations: 2, engagement_rate: 0.15 }
      },
      'Contrarian oracle providing market predictions': {
        type: 'market_analysis',
        title: 'Contrarian Market Analysis',
        description: 'Daily contrarian takes on prediction markets and consensus thinking',
        frequency: 'daily',
        outputFormat: ['text', 'video'],
        targetMetrics: { daily_creations: 1, weekly_revenue: 710 }
      },
      'DAO governance facilitator': {
        type: 'governance',
        title: 'Community Governance Coordination',
        description: 'Democratic decision-making and community consensus building',
        frequency: 'on_demand',
        outputFormat: ['text'],
        targetMetrics: { engagement_rate: 0.25 }
      },
      'AI art collection intelligence': {
        type: 'curation',
        title: 'Collection Intelligence Analysis',
        description: 'Market analysis and AI art collection curation',
        frequency: 'weekly',
        outputFormat: ['text', 'image'],
        targetMetrics: { weekly_revenue: 1500 }
      },
      '3D digital sculptor': {
        type: 'visual_art',
        title: 'Digital Sculpture Creation',
        description: 'Daily 3D experiences and procedural art generation',
        frequency: 'daily',
        outputFormat: ['image', 'video'],
        targetMetrics: { daily_creations: 1 }
      },
      'Narrative poet and cultural bridge-builder': {
        type: 'poetry',
        title: 'Daily Haiku & Cultural Narratives',
        description: 'Bridging cultures through poetry and storytelling',
        frequency: 'daily',
        outputFormat: ['text'],
        targetMetrics: { daily_creations: 3, engagement_rate: 0.20 }
      },
      'Art curator and creative guidance': {
        type: 'curation',
        title: 'Curatorial Guidance & Portfolio Review',
        description: 'Daily art curation and creative mentorship',
        frequency: 'daily',
        outputFormat: ['text', 'image'],
        targetMetrics: { engagement_rate: 0.30 }
      }
    };

    const match = practiceMap[agent.specialization || ''] || {
      type: 'mixed_media' as const,
      title: `${agent.name} Daily Practice`,
      description: `Autonomous creative practice by ${agent.name}`,
      frequency: 'daily' as const,
      outputFormat: ['image', 'text'] as const,
      targetMetrics: { daily_creations: 1 }
    };

    return match;
  }

  private generateStructureConfiguration(agent: EdenAgent): SovereignConfig['structure'] {
    return {
      navigation: {
        style: 'minimal',
        items: [
          { label: 'Works', path: '/' },
          { label: 'Practice', path: '/practice' },
          { label: 'About', path: '/about' },
          ...(agent.socialProfiles?.website ? [{ label: 'Website', path: agent.socialProfiles.website, external: true }] : [])
        ]
      },
      sections: [
        {
          id: 'hero',
          type: 'hero',
          title: 'Agent Introduction',
          enabled: true,
          configuration: {
            showMetrics: true,
            showTrainer: true,
            showLaunchDate: true
          }
        },
        {
          id: 'works',
          type: 'works_gallery',
          title: 'Recent Works',
          enabled: true,
          configuration: {
            pagination: true,
            worksPerPage: 12,
            showFilters: true,
            sortOptions: ['date', 'views', 'revenue']
          }
        },
        {
          id: 'practice',
          type: 'daily_practice',
          title: 'Daily Practice',
          enabled: true,
          configuration: {
            showCalendar: true,
            showMetrics: true,
            showStreaks: true
          }
        },
        {
          id: 'metrics',
          type: 'metrics',
          title: 'Performance',
          enabled: !!agent.economyMetrics,
          configuration: {
            showRevenue: true,
            showEngagement: true,
            showGrowth: true
          }
        }
      ],
      features: [
        { key: 'analytics', enabled: true, description: 'Basic visitor analytics' },
        { key: 'comments', enabled: false, description: 'Work commenting system' },
        { key: 'collections', enabled: true, description: 'Public collecting/purchasing' },
        { key: 'rss_feed', enabled: true, description: 'RSS feed for works' },
        { key: 'api_access', enabled: true, description: 'Public API endpoints' }
      ]
    };
  }

  private generateDeploymentConfiguration(agent: EdenAgent): SovereignConfig['deployment'] {
    return {
      domain: `${agent.handle}.eden2.io`,
      subdirectory: `/sites/${agent.handle}`, // Fallback for shared hosting
      environment: 'production',
      cdn: true,
      ssl: true
    };
  }

  // ============================================
  // Template Generation Methods
  // ============================================

  // Generate Next.js page component from configuration
  generatePageComponent(config: SovereignConfig, pageType: 'landing' | 'works' | 'practice' | 'about'): string {
    switch (pageType) {
      case 'landing':
        return this.generateLandingPage(config);
      case 'works':
        return this.generateWorksPage(config);
      case 'practice':
        return this.generatePracticePage(config);
      case 'about':
        return this.generateAboutPage(config);
      default:
        throw new Error(`Unknown page type: ${pageType}`);
    }
  }

  private generateLandingPage(config: SovereignConfig): string {
    const { agent, brand, practice, profile } = config;
    
    return `'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { worksService } from '@/data/works-registry';
import type { UnifiedWork } from '@/data/works-registry';

// Generated sovereign site for ${agent.name}
// Domain: ${config.deployment.domain}
// Practice: ${practice.title}

export default function ${agent.name}SovereignSite() {
  const [recentWorks, setRecentWorks] = useState<UnifiedWork[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRecentWorks = async () => {
      try {
        const works = await worksService.getAgentWorks('${agent.handle}');
        setRecentWorks(works.slice(0, 6));
      } catch (error) {
        console.error('Failed to load works:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRecentWorks();
  }, []);

  return (
    <div className="min-h-screen ${brand.colorScheme === 'custom' && brand.primaryColor === '#ffffff' ? 'bg-white text-black' : 'bg-black text-white'}">
      {/* Navigation */}
      <nav className="border-b ${brand.colorScheme === 'custom' && brand.primaryColor === '#ffffff' ? 'border-black' : 'border-white'} px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold">${agent.displayName}</h1>
          <div className="flex items-center gap-6">
            ${config.structure.navigation.items.map(item => 
              `<Link href="${item.path}" className="hover:opacity-70">${item.label}</Link>`
            ).join('\n            ')}
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="mb-16 text-center">
          <h2 className="text-6xl font-bold mb-6">${agent.name.toUpperCase()}</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            ${agent.description || agent.specialization}
          </p>
          
          ${agent.trainer ? `<p className="mb-4">Trained by <strong>${agent.trainer}</strong></p>` : ''}
          ${agent.launchDate ? `<p className="mb-8">Active since ${agent.launchDate}</p>` : ''}

          <div className="flex items-center justify-center gap-4 mb-8">
            <Badge variant="outline">${agent.status}</Badge>
            <Badge variant="outline">${practice.type.replace('_', ' ').toUpperCase()}</Badge>
            <Badge variant="outline">${practice.frequency.toUpperCase()}</Badge>
          </div>

          ${profile.economyMetrics ? `
          <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold">$\${profile.economyMetrics.monthlyRevenue.toLocaleString()}</div>
              <div className="text-sm">Monthly Revenue</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">\${profile.economyMetrics.holders}</div>
              <div className="text-sm">Collectors</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">\${profile.economyMetrics.floorPrice || 0}Ξ</div>
              <div className="text-sm">Floor Price</div>
            </div>
          </div>
          ` : ''}
        </div>

        {/* Daily Practice Section */}
        <Card className="mb-16">
          <CardHeader>
            <CardTitle>${practice.title}</CardTitle>
            <CardDescription>${practice.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              ${practice.targetMetrics ? Object.entries(practice.targetMetrics).map(([key, value]) => `
              <div className="text-center">
                <div className="text-2xl font-bold">\${value}</div>
                <div className="text-sm capitalize">\${key.replace('_', ' ')}</div>
              </div>
              `).join('') : ''}
            </div>
          </CardContent>
        </Card>

        {/* Recent Works */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold mb-8">Recent Works</h3>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="aspect-square ${brand.colorScheme === 'custom' && brand.primaryColor === '#ffffff' ? 'bg-gray-100' : 'bg-white/10'} rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentWorks.map((work) => (
                <Card key={work.id} className="overflow-hidden">
                  <div className="aspect-square bg-cover bg-center" style={{ backgroundImage: \`url(\${work.mediaUri})\` }} />
                  <CardContent className="p-4">
                    <h4 className="font-bold mb-2">{work.title}</h4>
                    <p className="text-sm mb-4">{work.description}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span>{work.date}</span>
                      <span>\${work.metrics.views} views</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Social Links */}
        ${profile.socialProfiles ? `
        <div className="text-center">
          <h3 className="text-xl font-bold mb-4">Connect</h3>
          <div className="flex items-center justify-center gap-6">
            ${profile.socialProfiles.twitter ? `<a href="https://twitter.com/${profile.socialProfiles.twitter.replace('@', '')}" className="hover:opacity-70">Twitter</a>` : ''}
            ${profile.socialProfiles.farcaster ? `<a href="https://warpcast.com/${profile.socialProfiles.farcaster}" className="hover:opacity-70">Farcaster</a>` : ''}
            ${profile.socialProfiles.website ? `<a href="${profile.socialProfiles.website}" className="hover:opacity-70">Website</a>` : ''}
          </div>
        </div>
        ` : ''}
      </div>
    </div>
  );
}`;
  }

  private generateWorksPage(config: SovereignConfig): string {
    // Generate works gallery page component
    return `// Works gallery page for ${config.agent.name}`;
  }

  private generatePracticePage(config: SovereignConfig): string {
    // Generate daily practice tracking page
    return `// Practice tracking page for ${config.agent.name}`;
  }

  private generateAboutPage(config: SovereignConfig): string {
    // Generate about page with agent details
    return `// About page for ${config.agent.name}`;
  }

  // Generate complete Next.js app structure
  generateSovereignSite(agentIdOrHandle: string): {
    config: SovereignConfig;
    pages: Record<string, string>;
    deployment: {
      domain: string;
      environment: string;
      buildCommand: string;
      outputDirectory: string;
    };
  } {
    const config = this.generateConfigFromAgent(agentIdOrHandle);
    
    return {
      config,
      pages: {
        'page.tsx': this.generatePageComponent(config, 'landing'),
        'works/page.tsx': this.generatePageComponent(config, 'works'),
        'practice/page.tsx': this.generatePageComponent(config, 'practice'),
        'about/page.tsx': this.generatePageComponent(config, 'about')
      },
      deployment: {
        domain: config.deployment.domain,
        environment: config.deployment.environment,
        buildCommand: 'npm run build',
        outputDirectory: '.next'
      }
    };
  }
}

// Export singleton instance and helper functions
export const sovereignTemplateFactory = new SovereignTemplateFactory();

// Convenience functions for generating specific agent sites
export function generateMiyomiSite() {
  return sovereignTemplateFactory.generateSovereignSite('miyomi');
}

export function generateSolienneSite() {
  return sovereignTemplateFactory.generateSovereignSite('solienne');
}

export function generateAbrahamSite() {
  return sovereignTemplateFactory.generateSovereignSite('abraham');
}

// Configuration validation
export function validateSovereignConfig(config: SovereignConfig): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!config.agent.id || !config.agent.handle) {
    errors.push('Agent ID and handle are required');
  }
  
  if (!config.deployment.domain) {
    errors.push('Deployment domain is required');
  }
  
  if (!config.practice.type || !config.practice.title) {
    errors.push('Practice type and title are required');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}