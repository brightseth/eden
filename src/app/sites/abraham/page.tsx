import { SovereignSiteTemplate } from '@/components/sovereign/SovereignSiteTemplate';
import { agentConfigs } from '@/data/agentConfigs';

export default function AbrahamSite() {
  return <SovereignSiteTemplate agent={agentConfigs.abraham} />;
}