import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  type FinancialModel,
  type CreateFinancialModel,
  type DailyPracticeEntry,
  type CreateDailyPractice,
  type AgentMetricsResponse
} from '@/lib/validation/schemas';

// ============================================
// Financial Model Hooks
// ============================================

export function useFinancialModel(agentId: string) {
  return useQuery({
    queryKey: ['financial-model', agentId],
    queryFn: async () => {
      const res = await fetch(`/api/agents/${agentId}/financial-model`);
      if (!res.ok) throw new Error('Failed to fetch financial model');
      return res.json();
    },
    enabled: !!agentId
  });
}

export function useSaveFinancialModel(agentId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateFinancialModel) => {
      const res = await fetch(`/api/agents/${agentId}/financial-model`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to save financial model');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financial-model', agentId] });
    }
  });
}

// ============================================
// Daily Practice Hooks
// ============================================

export function useDailyPractice(agentId: string, days: number = 7) {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0];
  
  return useQuery({
    queryKey: ['daily-practice', agentId, since],
    queryFn: async () => {
      const res = await fetch(
        `/api/agents/${agentId}/daily-practice?since=${since}&limit=${days}`
      );
      if (!res.ok) throw new Error('Failed to fetch daily practice');
      return res.json();
    },
    enabled: !!agentId
  });
}

export function useSaveDailyPractice(agentId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateDailyPractice) => {
      const res = await fetch(`/api/agents/${agentId}/daily-practice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to save daily practice');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['daily-practice', agentId] });
      queryClient.invalidateQueries({ queryKey: ['agent-metrics', agentId] });
    }
  });
}

export function useIncrementPublished(agentId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/agents/${agentId}/daily-practice`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          operation: 'increment_published',
          date: new Date().toISOString().split('T')[0]
        })
      });
      if (!res.ok) throw new Error('Failed to increment published count');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['daily-practice', agentId] });
    }
  });
}

export function useReportBlocker(agentId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (blocker: string) => {
      const res = await fetch(`/api/agents/${agentId}/daily-practice`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          operation: 'add_blocker',
          blocker,
          date: new Date().toISOString().split('T')[0]
        })
      });
      if (!res.ok) throw new Error('Failed to report blocker');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['daily-practice', agentId] });
      queryClient.invalidateQueries({ queryKey: ['agent-metrics', agentId] });
    }
  });
}

// ============================================
// Metrics Hooks
// ============================================

export function useAgentMetrics(agentId: string) {
  return useQuery({
    queryKey: ['agent-metrics', agentId],
    queryFn: async (): Promise<AgentMetricsResponse> => {
      const res = await fetch(`/api/agents/${agentId}/metrics`);
      if (!res.ok) throw new Error('Failed to fetch metrics');
      return res.json();
    },
    enabled: !!agentId,
    refetchInterval: 60000 // Refresh every minute
  });
}

// ============================================
// Daily Tasks Hooks (if needed)
// ============================================

export function useDailyTasks(agentId: string) {
  return useQuery({
    queryKey: ['daily-tasks', agentId, new Date().toDateString()],
    queryFn: async () => {
      const res = await fetch(`/api/agents/${agentId}/daily-tasks`);
      if (!res.ok) throw new Error('Failed to fetch daily tasks');
      return res.json();
    },
    enabled: !!agentId
  });
}

export function useToggleTask(agentId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ taskId, completed }: { taskId: string; completed: boolean }) => {
      const res = await fetch(`/api/agents/${agentId}/daily-tasks`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task_id: taskId, completed })
      });
      if (!res.ok) throw new Error('Failed to update task');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['daily-tasks', agentId, new Date().toDateString()] 
      });
    }
  });
}