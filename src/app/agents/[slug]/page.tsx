import { notFound } from 'next/navigation';
import UnifiedAgentProfile from '@/components/agent/UnifiedAgentProfile';
import { getAgentBySlug, EDEN_AGENTS } from '@/data/eden-agents-manifest';

// Force dynamic rendering to avoid build issues
export const dynamic = 'force-dynamic';

interface AgentProfilePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return EDEN_AGENTS.map((agent) => ({
    slug: agent.slug,
  }));
}

export default async function AgentProfilePage({ params }: AgentProfilePageProps) {
  const { slug } = await params;
  const agent = getAgentBySlug(slug);
  
  if (!agent) {
    notFound();
  }

  return <UnifiedAgentProfile agentSlug={slug} />;
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