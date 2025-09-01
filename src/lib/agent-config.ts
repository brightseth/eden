// Agent Configuration System
// Flexible architecture supporting both standard and exceptional agents

export interface ArchiveConfig {
  count: number;
  source: 'google_drive' | 'kristi_outputs' | 'local' | 'api';
  display_path: string;
  name?: string;
}

export interface ExhibitionConfig {
  launch: string;
  curated_from: string;
  location?: string;
  description?: string;
}

export interface AgentConfig {
  id: string;
  type: 'legacy_master' | 'exceptional_spirit' | 'genesis_agent' | 'standard';
  archives?: Record<string, ArchiveConfig>;
  practice_start: string;
  practice_name: string;
  practice_duration: string;
  exhibitions?: Record<string, ExhibitionConfig>;
  special_features?: string[];
  drop_schedule: 'daily' | 'weekly' | 'custom';
  timezone: string;
  drop_time: string;
  has_archive: boolean;
  archive_name?: string;
  archive_count?: number;
  import_source?: string;
}

// Agent configurations
export const AGENT_CONFIGS: Record<string, AgentConfig> = {
  abraham: {
    id: 'abraham',
    type: 'legacy_master',
    archives: {
      early_works: {
        count: 3689,
        source: 'local',
        display_path: '/early-works',
        name: 'Early Works'
      }
    },
    practice_start: '2025-10-19',
    practice_name: 'covenant',
    practice_duration: '13 years',
    special_features: ['early_works_viewer', 'covenant_counter', 'legacy_import'],
    drop_schedule: 'daily',
    timezone: 'America/Los_Angeles',
    drop_time: '00:00',
    has_archive: true,
    archive_name: 'early_works',
    archive_count: 3689,
    import_source: 'local'
  },

  solienne: {
    id: 'solienne',
    type: 'exceptional_spirit',
    archives: {
      generations: {
        count: 1000,
        source: 'kristi_outputs',
        display_path: '/generations',
        name: 'Generations'
      }
    },
    practice_start: '2025-11-10',
    practice_name: 'daily_practice',
    practice_duration: 'ongoing',
    exhibitions: {
      paris_photo: {
        launch: '2025-11-10',
        curated_from: 'generations',
        location: 'Grand Palais, Paris',
        description: 'Debut exhibition featuring curated selections'
      }
    },
    special_features: ['paris_photo_curation', 'generation_browser', 'exhibition_countdown'],
    drop_schedule: 'daily',
    timezone: 'Europe/Paris',
    drop_time: '12:00',
    has_archive: true,
    archive_name: 'generations',
    archive_count: 1000,
    import_source: 'kristi_outputs'
  }
};

// Helper functions
export function getAgentConfig(agentId: string): AgentConfig | undefined {
  return AGENT_CONFIGS[agentId];
}

export function hasArchive(agentId: string): boolean {
  const config = getAgentConfig(agentId);
  return config?.has_archive || false;
}

export function getArchivePath(agentId: string, archiveType?: string): string | undefined {
  const config = getAgentConfig(agentId);
  if (!config?.archives) return undefined;
  
  const archiveKey = archiveType || Object.keys(config.archives)[0];
  return config.archives[archiveKey]?.display_path;
}

export function getPracticeName(agentId: string): string {
  const config = getAgentConfig(agentId);
  return config?.practice_name || 'training';
}

export function getDropSchedule(agentId: string): string {
  const config = getAgentConfig(agentId);
  return config?.drop_schedule || 'daily';
}

export function hasFeature(agentId: string, feature: string): boolean {
  const config = getAgentConfig(agentId);
  return config?.special_features?.includes(feature) || false;
}

export function getExhibitions(agentId: string): Record<string, ExhibitionConfig> | undefined {
  const config = getAgentConfig(agentId);
  return config?.exhibitions;
}

export function isPracticeStarted(agentId: string): boolean {
  const config = getAgentConfig(agentId);
  if (!config?.practice_start) return false;
  
  const startDate = new Date(config.practice_start);
  const today = new Date();
  return today >= startDate;
}

export function getDaysUntilPractice(agentId: string): number {
  const config = getAgentConfig(agentId);
  if (!config?.practice_start) return -1;
  
  const startDate = new Date(config.practice_start);
  const today = new Date();
  const diffTime = startDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return Math.max(0, diffDays);
}

export function getPracticeDay(agentId: string): number {
  const config = getAgentConfig(agentId);
  if (!config?.practice_start) return 0;
  
  const startDate = new Date(config.practice_start);
  const today = new Date();
  
  if (today < startDate) return 0;
  
  const diffTime = today.getTime() - startDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays + 1; // Day 1 is the start date
}

// Route generation based on config
export function getAgentRoutes(agentId: string): string[] {
  const config = getAgentConfig(agentId);
  if (!config) return [];
  
  const routes: string[] = [
    `/academy/${agentId}`, // Profile
    `/academy/${agentId}/drops`, // Drop archive
    `/academy/${agentId}/drops/today`, // Latest drop
  ];
  
  // Add archive routes if agent has archives
  if (config.archives) {
    Object.entries(config.archives).forEach(([key, archive]) => {
      routes.push(`/academy/${agentId}${archive.display_path}`);
      routes.push(`/academy/${agentId}${archive.display_path}/[id]`);
    });
  }
  
  // Add practice routes
  routes.push(`/academy/${agentId}/${config.practice_name}`);
  routes.push(`/academy/${agentId}/${config.practice_name}/today`);
  routes.push(`/academy/${agentId}/drops/[day]`);
  
  // Add exhibition routes if agent has exhibitions
  if (config.exhibitions) {
    Object.keys(config.exhibitions).forEach(exhibitionKey => {
      routes.push(`/academy/${agentId}/${exhibitionKey.replace('_', '-')}`);
    });
  }
  
  return routes;
}

// Types are already exported above as interfaces