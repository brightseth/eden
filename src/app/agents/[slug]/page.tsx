import { notFound } from 'next/navigation';
import UnifiedAgentProfile from '@/components/agent/UnifiedAgentProfile';
import { getAgentBySlug, EDEN_AGENTS } from '@/data/eden-agents-manifest';

interface AgentProfilePageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return EDEN_AGENTS.map((agent) => ({
    slug: agent.slug,
  }));
}

export default function AgentProfilePage({ params }: AgentProfilePageProps) {
  const agent = getAgentBySlug(params.slug);
  
  if (!agent) {
    notFound();
  }

  return <UnifiedAgentProfile agentSlug={params.slug} />;
}

export async function generateMetadata({ params }: AgentProfilePageProps) {
  const agent = getAgentBySlug(params.slug);
  
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