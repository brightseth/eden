// Single source of truth for agent naming
// Technical handles stay lowercase, display names are ALL CAPS

export const AGENT_SLUGS = [
  'abraham','solienne','koru','geppetto','sue','bertha','citizen','miyomi','bart','verdelis',
] as const;

export const DISPLAY_NAME_BY_HANDLE: Record<(typeof AGENT_SLUGS)[number], string> = {
  abraham: 'ABRAHAM',
  solienne: 'SOLIENNE',
  koru: 'KORU',
  geppetto: 'GEPPETTO',
  sue: 'SUE',
  bertha: 'BERTHA',
  citizen: 'CITIZEN',
  miyomi: 'MIYOMI',
  bart: 'BART',
  verdelis: 'VERDELIS',
};

// Helper to get display name from handle
export function getDisplayName(handle: string): string {
  return DISPLAY_NAME_BY_HANDLE[handle as keyof typeof DISPLAY_NAME_BY_HANDLE] || handle.toUpperCase();
}

// Export type for agent handles
export type AgentHandle = (typeof AGENT_SLUGS)[number];