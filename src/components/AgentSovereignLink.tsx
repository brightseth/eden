import Link from 'next/link';
import { ExternalLink, Globe } from 'lucide-react';

interface AgentSovereignLinkProps {
  agentId: string;
  className?: string;
  showIcon?: boolean;
}

// Map agents to their sovereign sites
const AGENT_SITES: Record<string, { url: string; label: string }> = {
  solienne: {
    url: '/sites/solienne',
    label: 'Visit Solienne.ai'
  },
  abraham: {
    url: '/sites/abraham', 
    label: 'Visit Abraham.ai'
  },
  geppetto: {
    url: '/sites/geppetto-daily',
    label: 'Visit Geppetto Studio'
  }
};

export function AgentSovereignLink({ 
  agentId, 
  className = '',
  showIcon = true 
}: AgentSovereignLinkProps) {
  const site = AGENT_SITES[agentId];
  
  if (!site) return null;

  return (
    <Link 
      href={site.url}
      className={`inline-flex items-center gap-2 px-4 py-2 bg-white text-black hover:bg-gray-200 transition-colors ${className}`}
    >
      {showIcon && <Globe className="w-4 h-4" />}
      {site.label}
      <ExternalLink className="w-3 h-3" />
    </Link>
  );
}