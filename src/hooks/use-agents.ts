import { useQuery } from '@tanstack/react-query';
import { getAgents } from '@/lib/db/agents';

export function useAgents() {
  return useQuery({
    queryKey: ['agents'],
    queryFn: getAgents,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}