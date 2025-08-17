import { useQuery } from '@tanstack/react-query';
import { getAgentOverview } from '@/lib/db/agents';

export function useAgentOverview(agentId: string) {
  return useQuery({
    queryKey: ['agent-overview', agentId],
    queryFn: () => getAgentOverview(agentId),
    enabled: !!agentId,
    staleTime: 60 * 1000, // 1 minute
  });
}