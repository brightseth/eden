/**
 * CENTRALIZED DOMAIN CONFIGURATION
 * Single source of truth for all Eden Academy domains
 * 
 * IMPORTANT: This file prevents domain reference mistakes.
 * All domain references should use these constants.
 */

// Production domains - THE CANONICAL REFERENCES
export const DOMAINS = {
  // Main Eden Academy site
  EDEN_ACADEMY: process.env.NODE_ENV === 'production' ? 'academy.eden2.io' : 'eden-academy-flame.vercel.app',
  
  // Registry services
  EDEN_GENESIS_REGISTRY: 'eden-genesis-registry.vercel.app',
  
  // Agent-specific sites
  AMANDA_ART_AGENT: 'amanda-art-agent.vercel.app',
  DESIGN_CRITIC_AGENT: 'design-critic-agent.vercel.app',
  
  // Other Eden services
  EDEN2038: 'eden2038.vercel.app',
  SPIRIT_REGISTRY: 'spirit-registry.vercel.app',
} as const;

// Full URLs with protocol
export const URLS = {
  EDEN_ACADEMY: `https://${DOMAINS.EDEN_ACADEMY}`,
  EDEN_GENESIS_REGISTRY: `https://${DOMAINS.EDEN_GENESIS_REGISTRY}`,
  EDEN_GENESIS_REGISTRY_API: `https://${DOMAINS.EDEN_GENESIS_REGISTRY}/api/v1`,
  AMANDA_ART_AGENT: `https://${DOMAINS.AMANDA_ART_AGENT}`,
  DESIGN_CRITIC_AGENT: `https://${DOMAINS.DESIGN_CRITIC_AGENT}`,
  EDEN2038: `https://${DOMAINS.EDEN2038}`,
  SPIRIT_REGISTRY: `https://${DOMAINS.SPIRIT_REGISTRY}`,
} as const;

// Development overrides (if needed)
export const getEdenAcademyUrl = () => {
  if (process.env.NODE_ENV === 'development') {
    return process.env.NEXT_PUBLIC_EDEN_ACADEMY_URL || URLS.EDEN_ACADEMY;
  }
  return URLS.EDEN_ACADEMY;
};

export const getRegistryUrl = () => {
  return process.env.NEXT_PUBLIC_REGISTRY_URL || URLS.EDEN_GENESIS_REGISTRY_API;
};

/**
 * Type-safe domain validation
 */
export type ValidDomain = keyof typeof DOMAINS;
export type ValidUrl = keyof typeof URLS;

/**
 * Runtime validation for domain references
 */
export const validateDomain = (url: string): boolean => {
  const validDomains = Object.values(DOMAINS);
  return validDomains.some(domain => url.includes(domain));
};

/**
 * DEPRECATED DOMAINS - DO NOT USE
 * These are incorrect domain references that should be replaced
 */
export const DEPRECATED_DOMAINS = [
  'eden-academy.vercel.app',
  'eden-academy-ftf22wjgo-edenprojects.vercel.app',
  // Add other incorrect variations as they're discovered
] as const;

/**
 * Check if a URL contains a deprecated domain
 */
export const hasDeprecatedDomain = (url: string): boolean => {
  return DEPRECATED_DOMAINS.some(domain => url.includes(domain));
};