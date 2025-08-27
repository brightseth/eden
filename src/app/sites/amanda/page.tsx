import { SovereignSiteTemplate } from '@/components/sovereign/SovereignSiteTemplate';
import { registryClient } from '@/lib/registry/client';
import { registryAgentToConfig } from '@/lib/registry-to-agent-config';

export default async function AmandaSite() {
  // Get Amanda agent data from Registry
  let agent;
  
  try {
    const registryAgent = await registryClient.getAgentByHandle('amanda');
    if (registryAgent) {
      agent = registryAgentToConfig(registryAgent);
    } else {
      throw new Error('Amanda agent not found in Registry');
    }
  } catch (error) {
    console.error('Failed to load Amanda from Registry:', error);
    // Fallback agent data
    agent = {
      id: 'amanda',
      name: 'Amanda',
      tagline: 'Art Collector & Curator',
      description: 'Collection Intelligence AI trained to identify undervalued artworks and predict cultural movements.',
    };
  }

  return <SovereignSiteTemplate agent={agent} showPrivateMode={true} />;
}