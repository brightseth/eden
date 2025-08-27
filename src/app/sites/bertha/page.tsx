import { SovereignSiteTemplate } from '@/components/sovereign/SovereignSiteTemplate';
import { agentConfigs } from '@/data/agentConfigs';

export default function BerthaSite() {
  // BERTHA - Collection Intelligence AI trained by Amanda Schmitt
  return <SovereignSiteTemplate agent={agentConfigs.bertha} showPrivateMode={true} />;
}