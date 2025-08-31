'use client';

import Link from 'next/link';
import { getAgentProfileUrl, getAgentDisplayName } from '@/lib/agents/navigation';

interface AgentLinkProps {
  agentName: string;
  className?: string;
  showHoverEffect?: boolean;
  children?: React.ReactNode;
}

/**
 * Reusable component for consistent agent profile linking
 * Ensures all agent names are clickable and navigate to their profiles
 */
export function AgentLink({ 
  agentName, 
  className = '', 
  showHoverEffect = true,
  children 
}: AgentLinkProps) {
  const displayName = getAgentDisplayName(agentName);
  const profileUrl = getAgentProfileUrl(agentName);
  
  // Validate agent name
  if (!agentName?.trim()) {
    console.warn('AgentLink: agentName is required');
    return <span className={className}>Unknown Agent</span>;
  }
  
  // Default hover and focus effect classes for accessibility
  const interactionClasses = showHoverEffect 
    ? 'hover:text-blue-400 transition-colors cursor-pointer hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-black' 
    : 'focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-black';
  
  return (
    <Link 
      href={profileUrl}
      className={`${className} ${interactionClasses}`.trim()}
      title={`View ${displayName}'s profile`}
      aria-label={`Navigate to ${displayName}'s agent profile page`}
    >
      {children || displayName}
    </Link>
  );
}