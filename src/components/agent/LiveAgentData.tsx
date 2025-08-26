'use client';

import { useState, useEffect } from 'react';
// NO STATIC DATA - Registry is the single source of truth

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
  const [agents, setAgents] = useState<LiveAgent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [source, setSource] = useState<'live' | 'static'>('live');

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
        console.error('[LiveAgentData] Registry unavailable - NO FALLBACK:', error);
        
        if (isMounted) {
          // NO STATIC FALLBACK - Registry is required
          setAgents([]);
          setSource('live'); // Still mark as live since static is forbidden
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