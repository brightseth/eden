'use client';

import { useState, useEffect } from 'react';

export function AgentCount() {
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    console.log('🔄 AgentCount component mounted');
    
    async function fetchCount() {
      try {
        console.log('🚀 Fetching agent count...');
        const response = await fetch('/api/agents');
        if (!response.ok) throw new Error('Failed to fetch');
        
        const data = await response.json();
        const agentCount = data.agents?.length || 0;
        
        console.log('✅ Got agent count:', agentCount);
        setCount(agentCount);
        setLoading(false);
      } catch (error) {
        console.error('❌ Failed to fetch agent count:', error);
        setCount(0);
        setLoading(false);
      }
    }
    
    fetchCount();
  }, []);
  
  if (loading) return <div className="text-3xl font-bold">LOADING...</div>;
  return <div className="text-3xl font-bold">{count}</div>;
}