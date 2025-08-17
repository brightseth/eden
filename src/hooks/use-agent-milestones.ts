import { useQuery } from '@tanstack/react-query';
import { getAgentMilestones } from '@/lib/db/milestones';

export function useAgentMilestones(agentId: string) {
  return useQuery({
    queryKey: ['agent-milestones', agentId],
    queryFn: () => getAgentMilestones(agentId),
    enabled: !!agentId,
    staleTime: 60 * 1000, // 1 minute
  });
}