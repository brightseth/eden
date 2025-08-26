import { SovereignSiteTemplate } from '@/components/sovereign/SovereignSiteTemplate';
import { agentConfigs } from '@/data/agentConfigs';

export default function GeppettoSite() {
  return <SovereignSiteTemplate agent={agentConfigs.geppetto} showPrivateMode={true} />;
}