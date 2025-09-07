/**
 * Feature Flags Configuration
 * Controls rollout of new features across Eden Academy
 */

// Environment-based feature flags
export const FEATURE_FLAGS = {
  // REGISTRY ENFORCEMENT FLAGS - CRITICAL FOR DATA CONSISTENCY
  ENABLE_REGISTRY_ENFORCEMENT: process.env.ENABLE_REGISTRY_ENFORCEMENT === 'true' || process.env.NODE_ENV === 'production',
  ENABLE_REGISTRY_FALLBACK: process.env.ENABLE_REGISTRY_FALLBACK !== 'false', // Enabled by default
  DISABLE_DIRECT_DB_ACCESS: process.env.DISABLE_DIRECT_DB_ACCESS === 'true' || process.env.NODE_ENV === 'production',
  
  // CITIZEN Agent Features
  CITIZEN_DUNE_INTEGRATION: process.env.ENABLE_CITIZEN_DUNE === 'true' || process.env.NODE_ENV === 'development',
  CITIZEN_ENHANCED_MARKET_INSIGHTS: true, // Always enabled
  CITIZEN_DATA_VALIDATION: process.env.ENABLE_DATA_VALIDATION !== 'false', // Enabled by default
  
  // PUBLIC AGENT INTERFACES - New Feature Flags
  ENABLE_AGENT_CHAT: process.env.ENABLE_AGENT_CHAT === 'true' || process.env.NODE_ENV === 'development',
  ENABLE_PUBLIC_AGENT_PAGES: process.env.ENABLE_PUBLIC_AGENT_PAGES !== 'false', // Enabled by default, disabled only if explicitly set to 'false'
  ENABLE_CHAT_RATE_LIMITING: process.env.ENABLE_CHAT_RATE_LIMITING !== 'false', // Enabled by default
  ENABLE_CHAT_SESSION_MANAGEMENT: process.env.ENABLE_CHAT_SESSION_MANAGEMENT !== 'false', // Enabled by default
  ENABLE_AGENT_WORKS_GALLERY: true, // Always enabled
  ENABLE_AGENT_PROTOTYPE_LINKS: process.env.DISABLE_PROTOTYPE_LINKS !== 'true', // Enabled by default, disabled only if explicitly set
  ENABLE_WIDGET_PROFILE_SYSTEM: process.env.ENABLE_WIDGET_PROFILE_SYSTEM === 'true' || false,
  ENABLE_EDEN2038_INTEGRATION: process.env.ENABLE_EDEN2038_INTEGRATION === 'true' || process.env.NODE_ENV === 'development',
  
  // ART CURATION SYSTEM - New Feature Flag
  ART_CURATION_SYSTEM_ENABLED: process.env.ART_CURATION_SYSTEM_ENABLED === 'true' || process.env.NODE_ENV === 'development',
  BATCH_CURATION_ENABLED: process.env.BATCH_CURATION_ENABLED !== 'false', // Enabled by default
  TOURNAMENT_MODE_ENABLED: process.env.TOURNAMENT_MODE_ENABLED !== 'false', // Enabled by default
  REVERSE_ENGINEERING_ENABLED: process.env.REVERSE_ENGINEERING_ENABLED !== 'false', // Enabled by default
  COLLECTION_MANAGEMENT_ENABLED: process.env.COLLECTION_MANAGEMENT_ENABLED !== 'false', // Enabled by default
  
  // API Integrations
  DUNE_ANALYTICS_ENABLED: !!process.env.DUNE_API_KEY,
  OPENSEA_API_ENABLED: !!process.env.OPENSEA_API_KEY,
  
  // Development Features
  MOCK_DATA_FALLBACK: process.env.NODE_ENV === 'development' || process.env.ENABLE_MOCK_DATA === 'true',
  VERBOSE_LOGGING: process.env.NODE_ENV === 'development' || process.env.ENABLE_DEBUG_LOGS === 'true',
  
  // EDEN3 SPIRIT GRADUATION SYSTEM - New Feature Flag
  FF_EDEN3_ONBOARDING: process.env.FF_EDEN3_ONBOARDING === 'true', // OFF by default in production
} as const;

// Configuration values
export const CONFIG = {
  // API Timeouts
  DUNE_QUERY_TIMEOUT: parseInt(process.env.DUNE_QUERY_TIMEOUT || '60000'), // 60 seconds
  OPENSEA_REQUEST_TIMEOUT: parseInt(process.env.OPENSEA_REQUEST_TIMEOUT || '10000'), // 10 seconds
  
  // Cache settings
  MARKET_DATA_CACHE_TTL: parseInt(process.env.MARKET_CACHE_TTL || '900000'), // 15 minutes
  DUNE_DATA_CACHE_TTL: parseInt(process.env.DUNE_CACHE_TTL || '1800000'), // 30 minutes
  
  // Rate limiting
  OPENSEA_RATE_LIMIT_DELAY: parseInt(process.env.OPENSEA_DELAY || '1000'), // 1 second between requests
  DUNE_RATE_LIMIT_DELAY: parseInt(process.env.DUNE_DELAY || '500'), // 0.5 seconds between requests
  
  // CHAT CONFIGURATION - New Settings
  CHAT_MESSAGE_TIMEOUT: parseInt(process.env.CHAT_TIMEOUT || '30000'), // 30 seconds
  CHAT_RATE_LIMIT_REQUESTS: parseInt(process.env.CHAT_RATE_LIMIT || '10'), // 10 messages per window
  CHAT_RATE_LIMIT_WINDOW: parseInt(process.env.CHAT_RATE_WINDOW || '600000'), // 10 minutes
  CHAT_SESSION_DURATION: parseInt(process.env.CHAT_SESSION_TTL || '3600000'), // 1 hour
  CHAT_MAX_MESSAGE_LENGTH: parseInt(process.env.CHAT_MAX_LENGTH || '500'), // 500 characters
  WORKS_GALLERY_PAGE_SIZE: parseInt(process.env.GALLERY_PAGE_SIZE || '12'), // 12 works per page
} as const;

/**
 * Check if a feature is enabled with optional user-specific overrides
 */
export function isFeatureEnabled(feature: keyof typeof FEATURE_FLAGS, userOverrides?: Record<string, boolean>): boolean {
  if (userOverrides && feature in userOverrides) {
    return userOverrides[feature];
  }
  return FEATURE_FLAGS[feature];
}

/**
 * Get feature flag status for debugging
 */
export function getFeatureFlagStatus(): Record<string, any> {
  return {
    flags: FEATURE_FLAGS,
    config: CONFIG,
    environment: process.env.NODE_ENV,
    api_keys_configured: {
      dune: !!process.env.DUNE_API_KEY,
      opensea: !!process.env.OPENSEA_API_KEY,
      alchemy: !!process.env.ALCHEMY_API_KEY,
      moralis: !!process.env.MORALIS_API_KEY
    }
  };
}

// Rollback configurations
export const ROLLBACK_CONFIG = {
  DISABLE_DUNE_ON_ERROR: true, // Automatically disable Dune if consecutive errors > threshold
  ERROR_THRESHOLD: 5, // Number of consecutive errors before disabling
  RECOVERY_DELAY: 300000, // 5 minutes before retry
  FALLBACK_TO_MOCK: true // Use mock data during rollback
} as const;