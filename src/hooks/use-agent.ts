import { useQuery } from '@tanstack/react-query';

export function useAgent(id: string) {
  return useQuery({
    queryKey: ['agent', id],
    queryFn: async () => {
      const res = await fetch(`/api/agents/${id}`);
      if (!res.ok) throw new Error('Failed to fetch agent');
      return res.json();
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}