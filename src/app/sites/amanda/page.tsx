import { SovereignSiteTemplate } from '@/components/sovereign/SovereignSiteTemplate';
import { agentConfigs } from '@/data/agentConfigs';

export default function AmandaSite() {
  return <SovereignSiteTemplate agent={agentConfigs.amanda} showPrivateMode={true} />;
}