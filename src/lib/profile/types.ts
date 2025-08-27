// Agent Profile Widget System Types
// Implements ADR-025: Agent Profile Widget System

export interface Agent {
  id: string;
  handle: string;
  name: string;
  tagline?: string;
  description?: string;
  pfpUrl?: string;
  coverUrl?: string;
  status: 'development' | 'ready' | 'deployed' | 'retired';
  trainer?: string;
  model?: string;
  createdAt: string;
  updatedAt: string;
  tokenAddress?: string | null;
  socialLinks?: {
    twitter?: string;
    website?: string;
    github?: string;
    discord?: string;
  };
  metrics?: Record<string, any>;
}

export interface ProfileWidget {
  id: string;
  type: WidgetType;
  position: WidgetPosition;
  config: WidgetConfig;
  visibility: WidgetVisibility;
  featureFlag?: string;
}

export type WidgetType = 
  | 'hero'
  | 'mission'
  | 'daily-practice'
  | 'training-status'
  | 'metrics'
  | 'works-gallery'
  | 'countdown'
  | 'trainer-info'
  | 'social-links'
  | 'custom-content';

export interface WidgetPosition {
  section: 'header' | 'main' | 'sidebar' | 'footer';
  order: number;
}

export interface WidgetConfig {
  [key: string]: any;
  title?: string;
  content?: string | RegistryReference;
  layout?: 'single-column' | 'two-column' | 'grid';
  showBorder?: boolean;
  backgroundColor?: string;
}

export interface WidgetVisibility {
  always?: boolean;
  agentStatus?: Array<'INVITED' | 'APPLYING' | 'ONBOARDING' | 'ACTIVE' | 'GRADUATED'>;
  featureFlag?: string;
  condition?: string; // Registry data condition
}

export interface RegistryReference {
  source: 'registry';
  path: string; // e.g., 'profile.mission', 'metrics.dailyOutput'
}

export interface ProfileLayout {
  type: 'standard' | 'covenant' | 'event';
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '6xl';
  spacing?: 'tight' | 'normal' | 'large';
  sections?: LayoutSection[];
}

export interface LayoutSection {
  id: string;
  className?: string;
  gridCols?: number;
  order: number;
}

export interface NavigationConfig {
  showBackToAcademy: boolean;
  customNav?: boolean;
  navItems?: NavItem[];
}

export interface NavItem {
  label: string;
  href: string;
  external?: boolean;
}

export interface ThemeConfig {
  background: string;
  accent: 'purple' | 'blue' | 'green' | 'red' | 'yellow';
  borders: string;
  textColor?: string;
}

export interface ProfileMetadata {
  title?: string;
  description?: string;
  ogImage?: string;
  lastUpdated?: string;
  version?: string;
}

export interface AgentProfileConfig {
  agentId: string;
  layout: ProfileLayout;
  widgets: ProfileWidget[];
  navigation: NavigationConfig;
  theme: ThemeConfig;
  metadata: ProfileMetadata;
}

// Widget Component Props
export interface BaseWidgetProps {
  widget: ProfileWidget;
  agent: any; // UnifiedAgent type from Registry
  className?: string;
}

export interface WidgetRendererProps {
  widget: ProfileWidget;
  agent: any;
  config: WidgetConfig;
}

export interface ProfileRendererProps {
  agent: any; // UnifiedAgent type
  config: AgentProfileConfig;
}

// Utility types for Registry data
export type RegistryDataPath = 
  | 'profile.mission'
  | 'profile.statement' 
  | 'profile.workflow'
  | 'profile.metrics'
  | 'status'
  | 'launchDate'
  | 'trainer.name'
  | 'trainer.id'
  | 'counts.creations'
  | 'counts.personas'
  | 'counts.artifacts';

// Default configurations by agent type
export interface DefaultProfileTemplates {
  standard: AgentProfileConfig;
  collector: AgentProfileConfig; // For agents like BERTHA
  creator: AgentProfileConfig; // For agents like Abraham, Solienne
  curator: AgentProfileConfig; // For agents like Nina
  governance: AgentProfileConfig; // For agents like Citizen
}