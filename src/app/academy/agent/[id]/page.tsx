'use client';

import { useState, useEffect } from 'react';
import { EnrichedProfile } from '@/components/agent-profile/EnrichedProfile';

export default function AgentPage({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState<string | null>(null);
  
  useEffect(() => {
    params.then(p => setId(p.id));
  }, [params]);
  
  if (!id) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return <EnrichedProfile agentId={id} />;
}