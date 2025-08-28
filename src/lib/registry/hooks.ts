// React hooks for Registry integration
// Implements ADR-025 with React patterns

import { useState, useEffect, useCallback } from 'react';
import { Agent, AgentProfileConfig } from '@/lib/profile/types';
import { registryClient, RegistryResponse } from './registry-client';

export interface UseAgentResult {
  agent: Agent | null;
  config: AgentProfileConfig | null;
  isLoading: boolean;
  error: string | null;
  source: 'registry' | 'cache' | 'fallback' | null;
  refresh: () => Promise<void>;
}

export function useAgent(handle: string): UseAgentResult {
  const [agent, setAgent] = useState<Agent | null>(null);
  const [config, setConfig] = useState<AgentProfileConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<'registry' | 'cache' | 'fallback' | null>(null);

  const fetchData = useCallback(async () => {
    if (!handle) {
      setError('No handle provided');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Fetch agent and config in parallel, with graceful fallback
      const [agentResponse, configResponse] = await Promise.all([
        registryClient.getAgent(handle).catch((err) => {
          console.warn(`[useAgent] Registry unavailable for agent ${handle}:`, err);
          return { error: 'Registry unavailable', source: 'fallback' as const };
        }),
        registryClient.getAgentConfig(handle).catch((err) => {
          console.warn(`[useAgent] Registry unavailable for config ${handle}:`, err);
          return { error: 'Registry unavailable', source: 'fallback' as const };
        })
      ]);

      // Handle agent response - always set data if available, even from fallback
      if (agentResponse.data) {
        setAgent(agentResponse.data);
        setSource(agentResponse.source);
      } else if (agentResponse.error) {
        // Only set error if it's a legitimate not found, not a connection issue
        if (!agentResponse.error.includes('Registry unavailable')) {
          setError(agentResponse.error);
        }
      }

      // Handle config response - warn but don't fail
      if (configResponse.data) {
        setConfig(configResponse.data);
      } else if (configResponse.error) {
        console.warn(`[useAgent] Config error for ${handle}:`, configResponse.error);
      }
    } catch (err) {
      console.error(`[useAgent] Unexpected error fetching ${handle}:`, err);
      // Don't set error here, let fallback data be used instead
    } finally {
      setIsLoading(false);
    }
  }, [handle]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refresh = useCallback(async () => {
    await registryClient.refreshAgent(handle);
    await fetchData();
  }, [handle, fetchData]);

  return {
    agent,
    config,
    isLoading,
    error,
    source,
    refresh
  };
}

export interface UseAgentWorksResult {
  works: any[];
  isLoading: boolean;
  error: string | null;
  source: 'registry' | 'cache' | 'fallback' | null;
  refresh: () => Promise<void>;
}

export function useAgentWorks(handle: string, limit: number = 10): UseAgentWorksResult {
  const [works, setWorks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<'registry' | 'cache' | 'fallback' | null>(null);

  const fetchWorks = useCallback(async () => {
    if (!handle) {
      setError('No handle provided');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await registryClient.getAgentWorks(handle, limit);

      if (response.error) {
        setError(response.error);
      } else if (response.data) {
        setWorks(response.data);
        setSource(response.source);
      }
    } catch (err) {
      console.error(`[useAgentWorks] Error fetching works for ${handle}:`, err);
      setError(err instanceof Error ? err.message : 'Failed to fetch works');
    } finally {
      setIsLoading(false);
    }
  }, [handle, limit]);

  useEffect(() => {
    fetchWorks();
  }, [fetchWorks]);

  const refresh = useCallback(async () => {
    registryClient.clearCache(); // Clear cache for fresh data
    await fetchWorks();
  }, [fetchWorks]);

  return {
    works,
    isLoading,
    error,
    source,
    refresh
  };
}

export interface UseAllAgentsResult {
  agents: Agent[];
  isLoading: boolean;
  error: string | null;
  source: 'registry' | 'cache' | 'fallback' | null;
  refresh: () => Promise<void>;
}

export function useAllAgents(): UseAllAgentsResult {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<'registry' | 'cache' | 'fallback' | null>(null);

  const fetchAgents = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await registryClient.getAllAgents();

      if (response.error) {
        setError(response.error);
      } else if (response.data) {
        setAgents(response.data);
        setSource(response.source);
      }
    } catch (err) {
      console.error('[useAllAgents] Error fetching agents:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch agents');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  const refresh = useCallback(async () => {
    registryClient.clearCache();
    await fetchAgents();
  }, [fetchAgents]);

  return {
    agents,
    isLoading,
    error,
    source,
    refresh
  };
}

// Real-time subscription hook (for future implementation)
export function useAgentSubscription(
  handle: string,
  onUpdate?: (agent: Agent) => void
): {
  isSubscribed: boolean;
  unsubscribe: () => void;
} {
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    if (!handle) return;

    // Subscribe to real-time updates
    const unsubscribe = registryClient.subscribeToAgent(handle, (agent) => {
      if (onUpdate) {
        onUpdate(agent);
      }
    });

    setIsSubscribed(true);

    // Cleanup on unmount or handle change
    return () => {
      unsubscribe();
      setIsSubscribed(false);
    };
  }, [handle, onUpdate]);

  const unsubscribe = useCallback(() => {
    // Manual unsubscribe if needed
    setIsSubscribed(false);
  }, []);

  return {
    isSubscribed,
    unsubscribe
  };
}

// Hook for monitoring Registry health
export function useRegistryHealth(): {
  isHealthy: boolean;
  lastCheck: Date | null;
} {
  const [isHealthy, setIsHealthy] = useState(true);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        // Check if we can fetch agents successfully
        const response = await registryClient.getAllAgents();
        setIsHealthy(response.source !== 'fallback');
        setLastCheck(new Date());
      } catch {
        setIsHealthy(false);
        setLastCheck(new Date());
      }
    };

    // Initial check
    checkHealth();

    // Set up interval for periodic checks
    const interval = setInterval(checkHealth, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  return {
    isHealthy,
    lastCheck
  };
}