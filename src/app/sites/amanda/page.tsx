import { SovereignSiteTemplate } from '@/components/sovereign/SovereignSiteTemplate';
import { agentConfigs } from '@/data/agentConfigs';

export default function AmandaSite() {
  // Force rebuild - Collection Intelligence should be at top
  return <SovereignSiteTemplate agent={agentConfigs.amanda} showPrivateMode={true} />;
}