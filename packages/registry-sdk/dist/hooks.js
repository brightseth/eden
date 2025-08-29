"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAgent = useAgent;
exports.useAgentWorks = useAgentWorks;
exports.useAllAgents = useAllAgents;
exports.useAgentSubscription = useAgentSubscription;
exports.useRegistryHealth = useRegistryHealth;
// React hooks for Registry integration
// Implements ADR-025 with React patterns
const react_1 = require("react");
const registry_client_1 = require("./registry-client");
function useAgent(handle) {
    const [agent, setAgent] = (0, react_1.useState)(null);
    const [config, setConfig] = (0, react_1.useState)(null);
    const [isLoading, setIsLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    const [source, setSource] = (0, react_1.useState)(null);
    const fetchData = (0, react_1.useCallback)(async () => {
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
                registry_client_1.registryClient.getAgent(handle).catch((err) => {
                    console.warn(`[useAgent] Registry unavailable for agent ${handle}:`, err);
                    return { error: 'Registry unavailable', source: 'fallback' };
                }),
                registry_client_1.registryClient.getAgentConfig(handle).catch((err) => {
                    console.warn(`[useAgent] Registry unavailable for config ${handle}:`, err);
                    return { error: 'Registry unavailable', source: 'fallback' };
                })
            ]);
            // Handle agent response - always set data if available, even from fallback
            if (agentResponse.data) {
                setAgent(agentResponse.data);
                setSource(agentResponse.source);
            }
            else if (agentResponse.error) {
                // Only set error if it's a legitimate not found, not a connection issue
                if (!agentResponse.error.includes('Registry unavailable')) {
                    setError(agentResponse.error);
                }
            }
            // Handle config response - warn but don't fail
            if (configResponse.data) {
                setConfig(configResponse.data);
            }
            else if (configResponse.error) {
                console.warn(`[useAgent] Config error for ${handle}:`, configResponse.error);
            }
        }
        catch (err) {
            console.error(`[useAgent] Unexpected error fetching ${handle}:`, err);
            // Don't set error here, let fallback data be used instead
        }
        finally {
            setIsLoading(false);
        }
    }, [handle]);
    (0, react_1.useEffect)(() => {
        fetchData();
    }, [fetchData]);
    const refresh = (0, react_1.useCallback)(async () => {
        await registry_client_1.registryClient.refreshAgent(handle);
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
function useAgentWorks(handle, limit = 10) {
    const [works, setWorks] = (0, react_1.useState)([]);
    const [isLoading, setIsLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    const [source, setSource] = (0, react_1.useState)(null);
    const fetchWorks = (0, react_1.useCallback)(async () => {
        if (!handle) {
            setError('No handle provided');
            setIsLoading(false);
            return;
        }
        try {
            setIsLoading(true);
            setError(null);
            const response = await registry_client_1.registryClient.getAgentWorks(handle, limit);
            if (response.error) {
                setError(response.error);
            }
            else if (response.data) {
                setWorks(response.data);
                setSource(response.source);
            }
        }
        catch (err) {
            console.error(`[useAgentWorks] Error fetching works for ${handle}:`, err);
            setError(err instanceof Error ? err.message : 'Failed to fetch works');
        }
        finally {
            setIsLoading(false);
        }
    }, [handle, limit]);
    (0, react_1.useEffect)(() => {
        fetchWorks();
    }, [fetchWorks]);
    const refresh = (0, react_1.useCallback)(async () => {
        registry_client_1.registryClient.clearCache(); // Clear cache for fresh data
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
function useAllAgents() {
    const [agents, setAgents] = (0, react_1.useState)([]);
    const [isLoading, setIsLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    const [source, setSource] = (0, react_1.useState)(null);
    const fetchAgents = (0, react_1.useCallback)(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await registry_client_1.registryClient.getAllAgents();
            if (response.error) {
                setError(response.error);
            }
            else if (response.data) {
                setAgents(response.data);
                setSource(response.source);
            }
        }
        catch (err) {
            console.error('[useAllAgents] Error fetching agents:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch agents');
        }
        finally {
            setIsLoading(false);
        }
    }, []);
    (0, react_1.useEffect)(() => {
        fetchAgents();
    }, [fetchAgents]);
    const refresh = (0, react_1.useCallback)(async () => {
        registry_client_1.registryClient.clearCache();
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
function useAgentSubscription(handle, onUpdate) {
    const [isSubscribed, setIsSubscribed] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        if (!handle)
            return;
        // Subscribe to real-time updates
        const unsubscribe = registry_client_1.registryClient.subscribeToAgent(handle, (agent) => {
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
    const unsubscribe = (0, react_1.useCallback)(() => {
        // Manual unsubscribe if needed
        setIsSubscribed(false);
    }, []);
    return {
        isSubscribed,
        unsubscribe
    };
}
// Hook for monitoring Registry health
function useRegistryHealth() {
    const [isHealthy, setIsHealthy] = (0, react_1.useState)(true);
    const [lastCheck, setLastCheck] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        const checkHealth = async () => {
            try {
                // Check if we can fetch agents successfully
                const response = await registry_client_1.registryClient.getAllAgents();
                setIsHealthy(response.source !== 'fallback');
                setLastCheck(new Date());
            }
            catch {
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
