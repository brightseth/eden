import { useQuery } from '@tanstack/react-query';

export function useAgentOverview(agentId: string) {
  return useQuery({
    queryKey: ['agent-overview', agentId],
    queryFn: async () => {
      const res = await fetch(`/api/agents/${agentId}/overview`);
      if (!res.ok) throw new Error('Failed to fetch agent overview');
      return res.json();
    },
    enabled: !!agentId,
    staleTime: 60 * 1000, // 1 minute
  });
}