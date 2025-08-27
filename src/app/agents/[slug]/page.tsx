import { notFound } from 'next/navigation';
import UnifiedAgentProfile from '@/components/agent/UnifiedAgentProfile';
import { agentService } from '@/data/agents-registry';

// Force dynamic rendering to avoid build issues
export const dynamic = 'force-dynamic';

interface AgentProfilePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  try {
    const agents = await agentService.getAgents();
    return agents.map((agent) => ({
      slug: agent.handle,
    }));
  } catch (error) {
    console.error('Failed to generate static params for agents:', error);
    return [];
  }
}

export default async function AgentProfilePage({ params }: AgentProfilePageProps) {
  const { slug } = await params;
  const agent = await agentService.getAgentBySlug(slug);
  
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