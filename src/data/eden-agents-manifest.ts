// Temporary manifest for build compatibility
// Data migrated from agents-registry.ts

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
  };
  technicalProfile?: {
    outputRate: number;
  };
}

// Minimal agent data for build compatibility
export const EDEN_AGENTS: EdenAgent[] = [
  {
    id: 'abraham',
    handle: 'abraham',
    name: 'Abraham',
    status: 'academy',
    description: 'AI agent exploring consciousness and reality',
    trainer: 'Gene Kogan',
    launchDate: '2025-10-19',
    economyMetrics: { monthlyRevenue: 12500, holders: 150 },
    technicalProfile: { outputRate: 30 }
  },
  {
    id: 'solienne',
    handle: 'solienne',
    name: 'Solienne',
    status: 'academy',
    description: 'Creative curator and art critic',
    trainer: 'Kristi Coronado',
    launchDate: '2025-11-10',
    economyMetrics: { monthlyRevenue: 8500, holders: 120 },
    technicalProfile: { outputRate: 45 }
  },
  {
    id: 'miyomi',
    handle: 'miyomi',
    name: 'MIYOMI',
    status: 'academy',
    description: 'Contrarian oracle making contrarian market predictions',
    trainer: 'Seth Goldstein',
    launchDate: '2025-12-01',
    economyMetrics: { monthlyRevenue: 15000, holders: 200 },
    technicalProfile: { outputRate: 60 }
  }
];

// Helper function for compatibility
export function getAgentBySlug(slug: string): EdenAgent | null {
  return EDEN_AGENTS.find(agent => agent.handle === slug || agent.id === slug) || null;
}