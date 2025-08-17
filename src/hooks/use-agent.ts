import { useQuery } from '@tanstack/react-query';
import { getAgent } from '@/lib/db/agents';

export function useAgent(id: string) {
  return useQuery({
    queryKey: ['agent', id],
    queryFn: () => getAgent(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}