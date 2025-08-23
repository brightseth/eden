import { SovereignSiteTemplate } from '@/components/sovereign/SovereignSiteTemplate';
import { agentConfigs } from '@/data/agentConfigs';

export default function SolienneSite() {
  return <SovereignSiteTemplate agent={agentConfigs.solienne} />;
}