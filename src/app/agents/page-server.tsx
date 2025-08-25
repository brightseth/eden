import { Suspense } from 'react';
import AgentsDiscoveryClient from './AgentsDiscoveryClient';
import { agentService } from '@/data/agents-registry';

async function AgentsData() {
  const [agents, totalRevenue, avgOutput] = await Promise.all([
    agentService.getAgents(),
    agentService.calculateTotalRevenue(),
    agentService.calculateAverageOutputRate()
  ]);

  return (
    <AgentsDiscoveryClient 
      agents={agents}
      totalRevenue={totalRevenue}
      avgOutput={avgOutput}
    />
  );
}

function LoadingAgents() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-2 border-white border-t-transparent animate-spin mx-auto mb-4"></div>
        <p className="text-xs uppercase tracking-wider text-gray-400">
          LOADING EDEN AGENTS...
        </p>
      </div>
    </div>
  );
}

export default function AgentsDiscoveryPage() {
  return (
    <Suspense fallback={<LoadingAgents />}>
      <AgentsData />
    </Suspense>
  );
}