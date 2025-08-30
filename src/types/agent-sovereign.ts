// Enhanced Sovereign Agent Configuration v2.0
// Comprehensive data model combining Registry, Manifest, Practice, and Works layers

export interface SovereignAgentConfig {
  // REGISTRY LAYER - Core Identity
  core: {
    id: string;
    handle: string;
    displayName: string;
    status: 'INVITED' | 'APPLYING' | 'ONBOARDING' | 'ACTIVE' | 'GRADUATED' | 'academy';
    createdAt: string;
    updatedAt: string;
  };
  
  // MANIFEST LAYER - Technical & Economic Profile
  manifest: {
    trainer?: string;
    launchDate?: string;
    specialization?: string;
    description?: string;
    monthlyRevenue: number;
    holders: number;
    floorPrice?: number;
    outputRate: number;
    model?: string;
    capabilities: string[];
    integrations: string[];
  };
  
  // BRAND LAYER - Personality & Visual Identity
  brand: {
    voice: string;
    aestheticStyle?: string;
    culturalContext?: string;
    colorScheme: 'default' | 'custom';
    primaryColor?: string;
    accentColor?: string;
    typography: 'helvetica' | 'serif' | 'mono' | 'custom';
    customFont?: string;
    logoUri?: string;
    faviconUri?: string;
  };
  
  // PRACTICE LAYER - Daily Operations & Performance
  dailyPractice: {
    type: 'prediction' | 'generation' | 'governance' | 'analysis' | 'synthesis' | 'curation' | 'trading' | 'writing';
    frequency: 'daily' | 'weekly' | 'on_demand';
    title: string;
    description: string;
    metrics: {
      creations_count: number;
      published_count: number;
      views: number;
      reactions: number;
      collects: number;
    };
    financial: {
      cost_usdc: number;
      revenue_usdc: number;
      profit_margin: number;
    };
    operations: {
      theme?: string;
      note?: string;
      blockers: string[];
    };
    graduationCriteria: {
      published_streak_met: boolean;
      profitable_week_met: boolean;
      no_blockers_met: boolean;
      min_collects_met: boolean;
      can_graduate: boolean;
    };
  };
  
  // WORKS LAYER - Content & Creations
  works: {
    types: ('image' | 'text' | 'audio' | 'video')[];
    totalCount: number;
    featured: Work[];
    collections?: Collection[];
    recentWorks: Work[];
    publishingChannels: {
      chainTx?: string;
      farcasterCastId?: string;
      shopifySku?: string;
    };
    metrics: {
      totalViews: number;
      totalRevenue: number;
      avgEngagement: number;
    };
  };
  
  // SOCIAL LAYER - Network Presence & Community
  social: {
    twitter?: string;
    farcaster?: string;
    website?: string;
    followers: number;
    following: number;
    engagementRate: number;
    communityHealth: 'thriving' | 'growing' | 'stable' | 'declining';
  };
  
  // PROTOTYPES LAYER - Experimental Features & Integrations
  prototypes: PrototypeLink[];
  
  // INTELLIGENCE LAYER - AI-Generated Insights
  intelligence: {
    layoutRecommendation: 'gallery' | 'dashboard' | 'forum' | 'timeline' | 'magazine' | 'portfolio';
    componentRecommendations: string[];
    themeRecommendation: SovereignTheme;
    contentStrategy: string;
    audienceAnalysis: {
      primaryAudience: string;
      contentPreferences: string[];
      engagementPatterns: string[];
    };
  };
}

export interface Work {
  id: string;
  title: string;
  type: 'image' | 'text' | 'audio' | 'video';
  mediaUri: string;
  description?: string;
  date: string;
  tags: string[];
  metrics: {
    views: number;
    shares: number;
    likes: number;
    revenue: number;
  };
  status: 'draft' | 'curated' | 'published';
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  works: Work[];
  curatedBy?: string;
}

export interface PrototypeLink {
  id: string;
  title: string;
  description: string;
  url: string;
  type: 'demo' | 'prototype' | 'interface' | 'dashboard';
  status: 'alpha' | 'beta' | 'active' | 'maintenance' | 'deprecated';
  featured?: boolean;
}

export interface SovereignTheme {
  name: string;
  colors: {
    primary: string;
    accent: string;
    background: string;
    text: string;
    muted: string;
  };
  typography: {
    heading: string;
    body: string;
    mono: string;
  };
  spacing: 'compact' | 'comfortable' | 'spacious';
  animations: 'minimal' | 'subtle' | 'dynamic';
}

// Component Selection Types
export interface ComponentConfig {
  id: string;
  name: string;
  category: 'navigation' | 'hero' | 'content' | 'metrics' | 'social' | 'interactive';
  requiredCapabilities?: string[];
  minRevenue?: number;
  practiceTypes?: string[];
  workTypes?: string[];
  complexity: 'simple' | 'medium' | 'advanced';
}

// Layout Configuration
export interface LayoutConfig {
  name: string;
  description: string;
  sections: SectionConfig[];
  navigation: NavigationStyle;
  responsive: boolean;
  suitableFor: {
    practiceTypes: string[];
    workTypes: string[];
    characteristics: string[];
  };
}

export interface SectionConfig {
  id: string;
  type: 'hero' | 'works_gallery' | 'daily_practice' | 'metrics' | 'social' | 'prototypes' | 'custom';
  title: string;
  enabled: boolean;
  priority: number;
  configuration: Record<string, any>;
  responsiveOrder?: Record<string, number>;
}

export interface NavigationStyle {
  type: 'minimal' | 'expanded' | 'sidebar' | 'floating';
  items: NavigationItem[];
  branding: {
    showLogo: boolean;
    showAgentName: boolean;
    position: 'left' | 'center' | 'right';
  };
}

export interface NavigationItem {
  label: string;
  path: string;
  external?: boolean;
  icon?: string;
  condition?: string; // e.g., "revenue > 0", "prototypes.length > 0"
}

// Intelligence Analysis Types
export interface AgentAnalysis {
  agentType: 'creator' | 'analyst' | 'trader' | 'curator' | 'governor' | 'hybrid';
  outputPatterns: {
    frequency: 'high' | 'medium' | 'low';
    consistency: 'regular' | 'burst' | 'sporadic';
    quality: 'professional' | 'experimental' | 'learning';
  };
  economicModel: 'subscription' | 'marketplace' | 'consulting' | 'hybrid' | 'developing';
  communityEngagement: 'high' | 'medium' | 'low';
  technicalSophistication: 'basic' | 'intermediate' | 'advanced';
  graduationReadiness: number; // 0-100 score
}

// Factory Configuration
export interface FactoryConfig {
  autoDetection: {
    enabled: boolean;
    confidence: number;
    overrides: Record<string, any>;
  };
  customization: {
    allowBrandOverrides: boolean;
    allowLayoutOverrides: boolean;
    allowComponentSelection: boolean;
  };
  deployment: {
    domain: string;
    environment: 'development' | 'staging' | 'production';
    features: string[];
    integrations: string[];
  };
}

export type { SovereignAgentConfig as default };