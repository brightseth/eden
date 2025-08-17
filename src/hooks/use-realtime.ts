import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';

export function useRealtimeSubscription() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channels: RealtimeChannel[] = [];

    // Subscribe to daily_metrics changes
    const metricsChannel = supabase
      .channel('daily_metrics_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'daily_metrics',
        },
        (payload: RealtimePostgresChangesPayload<any>) => {
          console.log('[Realtime] Daily metrics update:', payload);
          
          // Invalidate relevant queries
          queryClient.invalidateQueries({ queryKey: ['metrics'] });
          queryClient.invalidateQueries({ queryKey: ['agent-overview'] });
        }
      )
      .subscribe();
    
    channels.push(metricsChannel);

    // Subscribe to economy_events changes
    const economyChannel = supabase
      .channel('economy_events_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'economy_events',
        },
        (payload: RealtimePostgresChangesPayload<any>) => {
          console.log('[Realtime] New economy event:', payload);
          
          // Invalidate relevant queries
          queryClient.invalidateQueries({ queryKey: ['economy-events'] });
          queryClient.invalidateQueries({ queryKey: ['agent-overview'] });
        }
      )
      .subscribe();
    
    channels.push(economyChannel);

    // Subscribe to agent_milestones changes
    const milestonesChannel = supabase
      .channel('agent_milestones_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'agent_milestones',
        },
        (payload: RealtimePostgresChangesPayload<any>) => {
          console.log('[Realtime] Milestone update:', payload);
          
          // Invalidate relevant queries
          queryClient.invalidateQueries({ queryKey: ['milestones'] });
          queryClient.invalidateQueries({ queryKey: ['agent-checklist'] });
        }
      )
      .subscribe();
    
    channels.push(milestonesChannel);

    // Subscribe to agents changes
    const agentsChannel = supabase
      .channel('agents_changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'agents',
        },
        (payload: RealtimePostgresChangesPayload<any>) => {
          console.log('[Realtime] Agent update:', payload);
          
          // Invalidate agent queries
          queryClient.invalidateQueries({ queryKey: ['agents'] });
          queryClient.invalidateQueries({ queryKey: ['agent', payload.new?.id] });
        }
      )
      .subscribe();
    
    channels.push(agentsChannel);

    // Cleanup on unmount
    return () => {
      channels.forEach(channel => {
        supabase.removeChannel(channel);
      });
    };
  }, [queryClient]);
}

// Hook to use in the main layout or app wrapper
export function useRealtimeUpdates() {
  useRealtimeSubscription();
}