import { SovereignSiteTemplate } from '@/components/sovereign/SovereignSiteTemplate';
import { registryClient } from '@/lib/registry/client';
import { registryAgentToConfig } from '@/lib/registry-to-agent-config';

export default async function AmandaSite() {
  // Amanda has evolved into BERTHA - Load BERTHA agent data instead
  let agent;
  
  try {
    const registryAgent = await registryClient.getAgentByHandle('bertha');
    if (registryAgent) {
      agent = registryAgentToConfig(registryAgent);
    } else {
      throw new Error('BERTHA agent not found in Registry');
    }
  } catch (error) {
    console.error('Failed to load BERTHA from Registry:', error);
    // Fallback agent data (BERTHA)
    agent = {
      id: 'bertha',
      name: 'BERTHA',
      tagline: 'Collection Intelligence AI',
      description: 'AI collection agent trained by Amanda Schmitt to identify undervalued artworks and predict cultural movements.',
    };
  }

  return <SovereignSiteTemplate agent={agent} showPrivateMode={true} />;
}