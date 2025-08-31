/**
 * Centralized agent navigation utility
 * Maintains architectural consistency for agent name transformations
 */

/**
 * Convert agent display name to URL slug
 * @param agentName - Agent name in any case (e.g., "ABRAHAM", "Abraham", "abraham")
 * @returns Lowercase slug for URL routing
 */
export function getAgentSlug(agentName: string): string {
  return agentName.toLowerCase().trim();
}

/**
 * Get the full agent profile URL
 * @param agentName - Agent name in any case
 * @returns Full URL path to agent profile
 */
export function getAgentProfileUrl(agentName: string): string {
  return `/agents/${getAgentSlug(agentName)}`;
}

/**
 * Map of agent display names to ensure consistency
 * All agent names should be displayed in UPPERCASE
 */
export const AGENT_DISPLAY_NAMES: Record<string, string> = {
  'abraham': 'ABRAHAM',
  'solienne': 'SOLIENNE',
  'miyomi': 'MIYOMI',
  'bertha': 'BERTHA',
  'citizen': 'CITIZEN',
  'sue': 'SUE',
  'geppetto': 'GEPPETTO',
  'koru': 'KORU',
  'bart': 'BART',
  'verdelis': 'VERDELIS',
};

/**
 * Ensure agent name is in proper display format (UPPERCASE)
 * @param agentName - Agent name in any case
 * @returns Properly formatted display name
 */
export function getAgentDisplayName(agentName: string): string {
  const slug = getAgentSlug(agentName);
  return AGENT_DISPLAY_NAMES[slug] || agentName.toUpperCase();
}