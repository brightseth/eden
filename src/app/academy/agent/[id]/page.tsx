'use client';

import { useState, useEffect } from 'react';
import { useAgent } from '@/hooks/use-agent';
import { useAgentOverview } from '@/hooks/use-agent-overview';
import { AgentDetailLayout } from '@/components/agent/agent-detail-layout';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { LiveTicker } from '@/components/live-ticker/LiveTicker';

export default function AgentPage({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState<string | null>(null);
  
  useEffect(() => {
    params.then(p => setId(p.id));
  }, [params]);
  
  const { data: agent, isLoading: agentLoading, error: agentError } = useAgent(id || '');
  const { data: overview, isLoading: overviewLoading } = useAgentOverview(id || '');

  if (agentError) {
    return (
      <div className="container-academy">
        <Alert className="max-w-md mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Agent not found or failed to load.
          </AlertDescription>
        </Alert>
            
      {/* Live Ticker */}
      <LiveTicker />
    </div>
    );
  }

  if (agentLoading || overviewLoading || !agent || !overview || !id) {
    return (
      <div className="container-academy">
        <div className="space-y-8">
          <Skeleton className="h-32 w-full bg-eden-white/20" />
          <Skeleton className="h-16 w-full bg-eden-white/20" />
          <div className="grid grid-cols-3 gap-4">
            <Skeleton className="h-64 bg-eden-white/20" />
            <Skeleton className="h-64 bg-eden-white/20" />
            <Skeleton className="h-64 bg-eden-white/20" />
                
      {/* Live Ticker */}
      <LiveTicker />
    </div>
              
      {/* Live Ticker */}
      <LiveTicker />
    </div>
            
      {/* Live Ticker */}
      <LiveTicker />
    </div>
    );
  }

  return (
    <div className="container-academy">
      <AgentDetailLayout agent={agent} overview={overview} />
          
      {/* Live Ticker */}
      <LiveTicker />
    </div>
  );
}