// Eden Academy Registry Guardian
// Central exports for Registry integration with data consistency protection

// Core types
export * from './types';

// Gateway pattern (recommended for production)
export { 
  registryGateway,
  RegistryGateway,
  getAgents as getAgentsViaGateway,
  getAgent as getAgentViaGateway,
  getAgentCreations as getAgentCreationsViaGateway,
  postCreation as postCreationViaGateway
} from './gateway';

// Direct client (for testing/debugging only)
export { 
  registryClient 
} from './client';

// Adapter for legacy compatibility
export {
  dataAdapter,
  getAgents,
  getAgent,
  getAgentCreations,
  postCreation
} from './adapter';

// Monitoring and consistency checking
export {
  registryMonitor,
  checkConsistency,
  getConsistencyReport
} from './monitor';

// Helper to determine which mode is active
export function getRegistryMode(): 'gateway' | 'registry' | 'legacy' {
  const useRegistry = process.env.USE_REGISTRY === 'true';
  const useGateway = process.env.USE_GATEWAY === 'true';
  
  if (useGateway) return 'gateway';
  if (useRegistry) return 'registry';
  return 'legacy';
}

// Log current configuration (useful for debugging)
export function logRegistryConfig(): void {
  const mode = getRegistryMode();
  const config = {
    mode,
    registryUrl: process.env.REGISTRY_BASE_URL || 'default',
    hasApiKey: !!process.env.REGISTRY_API_KEY,
    monitoringEnabled: process.env.ENABLE_REGISTRY_MONITOR === 'true'
  };
  
  console.log('[Registry Guardian] Configuration:', config);
}