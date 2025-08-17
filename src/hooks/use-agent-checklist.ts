import { useQuery } from '@tanstack/react-query';
import { getAgentChecklist } from '@/lib/db/checklist';

export function useAgentChecklist(agentId: string) {
  return useQuery({
    queryKey: ['agent-checklist', agentId],
    queryFn: () => getAgentChecklist(agentId),
    enabled: !!agentId,
    staleTime: 60 * 1000, // 1 minute
  });
}