'use client';

import { useState, useEffect } from 'react';
import { EDEN_AGENTS } from '@/data/eden-agents-manifest';

interface LiveAgent {
  id: string;
  name: string;
  slug: string;
  cohort: string;
  status: string;
  launchDate: string;
  trainer: { name: string; id: string };
  specialization: string;
  description: string;
  economyMetrics: {
    monthlyRevenue: number;
    tokenSupply: number;
    holders: number;
    floorPrice: number;
  };
  technicalProfile: {
    model: string;
    capabilities: string[];
    integrations: string[];
    outputRate: number;
  };
  socialProfiles: any;
  brandIdentity: {
    primaryColor: string;
    typography: string;
    voice: string;
  };
}

interface LiveAgentDataProps {
  children: (agents: LiveAgent[], isLoading: boolean, source: 'live' | 'static') => React.ReactNode;
}

export default function LiveAgentData({ children }: LiveAgentDataProps) {
  const [agents, setAgents] = useState<LiveAgent[]>(EDEN_AGENTS as any);
  const [isLoading, setIsLoading] = useState(true);
  const [source, setSource] = useState<'live' | 'static'>('static');

  useEffect(() => {
    let isMounted = true;

    const fetchLiveData = async () => {
      try {
        setIsLoading(true);
        console.log('[LiveAgentData] Fetching from Registry API...');
        
        const response = await fetch('/api/registry/sync', {
          headers: { 'Accept': 'application/json' }
        });

        if (!response.ok) {
          throw new Error(`API returned ${response.status}`);
        }

        const data = await response.json();
        
        if (isMounted && data.success && data.data.agents.length > 0) {
          console.log(`[LiveAgentData] Loaded ${data.data.agents.length} agents from Registry`);
          setAgents(data.data.agents);
          setSource('live');
        } else {
          throw new Error('Invalid Registry response');
        }

      } catch (error) {
        console.warn('[LiveAgentData] Registry fetch failed, using static data:', error);
        
        if (isMounted) {
          // Fallback to static manifest
          setAgents(EDEN_AGENTS as any);
          setSource('static');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    // Fetch immediately
    fetchLiveData();

    // Cleanup
    return () => {
      isMounted = false;
    };
  }, []);

  return <>{children(agents, isLoading, source)}</>;
}