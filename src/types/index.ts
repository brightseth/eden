// Type definitions for Eden Academy
export interface PublicAgent {
  id: string;
  name: string;
  tagline: string;
  trainer: string;
  status: 'active' | 'training' | 'developing';
  day_count: number;
  avatar_url: string;
  hero_image_url: string;
  latest_work: any;
  sample_works: any[];
  created_at: string;
}

// Type guard to validate agent data at runtime
export function isValidAgent(agent: any): agent is PublicAgent {
  return (
    agent &&
    typeof agent.id === 'string' &&
    typeof agent.name === 'string' &&
    typeof agent.status === 'string' &&
    ['active', 'training', 'developing'].includes(agent.status)
  );
}