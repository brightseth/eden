import { SovereignSiteTemplate } from '@/components/sovereign/SovereignSiteTemplate';
import { agentConfigs } from '@/data/agentConfigs';

export default function MiyomiSite() {
  return <SovereignSiteTemplate agent={agentConfigs.miyomi} />;
}