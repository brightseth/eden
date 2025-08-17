import { useQuery } from '@tanstack/react-query';
import { getAgentMetrics } from '@/lib/db/metrics';

export function useAgentMetrics(agentId: string, days: number = 30) {
  return useQuery({
    queryKey: ['agent-metrics', agentId, days],
    queryFn: () => getAgentMetrics(agentId, days),
    enabled: !!agentId,
    staleTime: 5 * 60 * 1000,
  });
}