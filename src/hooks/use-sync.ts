import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

interface SyncStatus {
  lastSync: Date | null;
  status: 'idle' | 'syncing' | 'success' | 'error';
  error?: string;
}

interface SyncResponse {
  success: boolean;
  message?: string;
  error?: string;
}

interface StatusResponse {
  success: boolean;
  services: Record<string, SyncStatus>;
}

export function useSync() {
  const queryClient = useQueryClient();

  const syncAll = useMutation<SyncResponse, Error>({
    mutationFn: async () => {
      const response = await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      
      if (!response.ok) {
        throw new Error('Sync failed');
      }
      
      return response.json();
    },
    onSuccess: () => {
      // Invalidate all queries to refresh data
      queryClient.invalidateQueries();
    },
  });

  const syncService = useMutation<SyncResponse, Error, string>({
    mutationFn: async (service: string) => {
      const response = await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ service }),
      });
      
      if (!response.ok) {
        throw new Error(`${service} sync failed`);
      }
      
      return response.json();
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['agents'] });
      queryClient.invalidateQueries({ queryKey: ['metrics'] });
    },
  });

  return {
    syncAll,
    syncService,
  };
}

export function useSyncStatus() {
  return useQuery<StatusResponse>({
    queryKey: ['sync-status'],
    queryFn: async () => {
      const response = await fetch('/api/sync');
      
      if (!response.ok) {
        throw new Error('Failed to get sync status');
      }
      
      return response.json();
    },
    refetchInterval: 10000, // Refresh every 10 seconds
  });
}