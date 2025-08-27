// Helper function to convert Registry Agent data to AgentConfig format for SovereignSiteTemplate

interface AgentConfig {
  id: string;
  name: string;
  tagline: string;
  description: string;
  manifestoSections?: {
    title: string;
    content: string;
  }[];
  process?: {
    title: string;
    description: string;
  }[];
  stats?: {
    label: string;
    value: string | number;
  }[];
  social?: {
    twitter?: string;
    instagram?: string;
    email?: string;
    farcaster?: string;
  };
  accentColor?: string;
}

export function registryAgentToConfig(agent: any): AgentConfig {
  if (!agent) {
    throw new Error('Agent data is required');
  }

  // Extract manifesto sections from manifesto text
  const manifestoSections = agent.profile?.manifesto 
    ? parseManifestoToSections(agent.profile.manifesto)
    : [];

  // Extract process from profile links
  const process = agent.profile?.links?.process || [];

  // Extract stats from profile links metrics
  const stats = [];
  if (agent.profile?.links?.metrics) {
    const metrics = agent.profile.links.metrics;
    Object.entries(metrics).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        stats.push({
          label: formatStatLabel(key),
          value: value
        });
      }
    });
  }

  // Extract social links
  const social = agent.profile?.links?.social || {};

  // Extract accent color
  const accentColor = agent.profile?.links?.identity?.accentColor || '';

  return {
    id: agent.handle,
    name: agent.displayName || agent.handle,
    tagline: agent.profile?.links?.identity?.tagline || agent.profile?.statement || '',
    description: agent.profile?.statement || '',
    manifestoSections,
    process,
    stats: stats.length > 0 ? stats : undefined,
    social: Object.keys(social).length > 0 ? social : undefined,
    accentColor
  };
}

function parseManifestoToSections(manifesto: string): { title: string; content: string; }[] {
  if (!manifesto) return [];
  
  // Split manifesto by ## headings
  const sections = manifesto.split(/^## /m).filter(Boolean);
  
  return sections.map(section => {
    const lines = section.trim().split('\n');
    const title = lines[0].replace(/^#*\s*/, ''); // Remove leading # and whitespace
    const content = lines.slice(1).join('\n').trim();
    
    return {
      title,
      content
    };
  });
}

function formatStatLabel(key: string): string {
  // Convert camelCase to human readable
  const formatted = key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
  
  // Handle special cases
  const specialCases: Record<string, string> = {
    'Monthly Revenue': 'Monthly Revenue',
    'Portfolio Return': 'Portfolio Return',
    'Prediction Accuracy': 'Prediction Accuracy',
    'Active Holdings': 'Active Holdings',
    'Sources Monitored': 'Sources Monitored',
    'Learning Sessions': 'Learning Sessions',
    'Output Rate': 'Output Rate'
  };

  return specialCases[formatted] || formatted;
}