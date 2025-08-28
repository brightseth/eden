import { notFound } from 'next/navigation';
import EnhancedAgentProfile from '@/components/agent/EnhancedAgentProfile';
import { FEATURE_FLAGS } from '@/config/flags';
import { getAgentBySlug } from '@/data/eden-agents-manifest';

// Force dynamic rendering to avoid build issues
export const dynamic = 'force-dynamic';

interface AgentProfilePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  // Generate static params for known agents
  const agents = [
    'abraham', 'solienne', 'citizen', 'bertha', 
    'miyomi', 'geppetto', 'koru', 'sue', 'bart'
  ];
  
  return agents.map((slug) => ({
    slug,
  }));
}

export default async function AgentProfilePage({ params }: AgentProfilePageProps) {
  const { slug } = await params;
  
  // Check if public agent pages are enabled
  if (!FEATURE_FLAGS.ENABLE_PUBLIC_AGENT_PAGES) {
    notFound();
  }
  
  const agent = getAgentBySlug(slug);
  
  if (!agent) {
    notFound();
  }

  return <EnhancedAgentProfile agentSlug={slug} />;
}

export async function generateMetadata({ params }: AgentProfilePageProps) {
  const { slug } = await params;
  const agent = getAgentBySlug(slug);
  
  if (!agent) {
    return {
      title: 'Agent Not Found',
    };
  }

  return {
    title: `${agent.name} - ${agent.specialization} | Eden Academy`,
    description: agent.description,
  };
}