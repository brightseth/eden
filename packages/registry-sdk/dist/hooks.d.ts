import { Agent, AgentProfileConfig } from '@/lib/profile/types';
export interface UseAgentResult {
    agent: Agent | null;
    config: AgentProfileConfig | null;
    isLoading: boolean;
    error: string | null;
    source: 'registry' | 'cache' | 'fallback' | null;
    refresh: () => Promise<void>;
}
export declare function useAgent(handle: string): UseAgentResult;
export interface UseAgentWorksResult {
    works: any[];
    isLoading: boolean;
    error: string | null;
    source: 'registry' | 'cache' | 'fallback' | null;
    refresh: () => Promise<void>;
}
export declare function useAgentWorks(handle: string, limit?: number): UseAgentWorksResult;
export interface UseAllAgentsResult {
    agents: Agent[];
    isLoading: boolean;
    error: string | null;
    source: 'registry' | 'cache' | 'fallback' | null;
    refresh: () => Promise<void>;
}
export declare function useAllAgents(): UseAllAgentsResult;
export declare function useAgentSubscription(handle: string, onUpdate?: (agent: Agent) => void): {
    isSubscribed: boolean;
    unsubscribe: () => void;
};
export declare function useRegistryHealth(): {
    isHealthy: boolean;
    lastCheck: Date | null;
};
