import { notFound, redirect } from 'next/navigation'
import { registryClient } from '@/lib/registry/registry-client'
import SpiritOnboarding from '@/components/spirit/SpiritOnboarding'

interface SpiritGraduationPageProps {
  params: {
    handle: string
  }
}

export default async function SpiritGraduationPage({ params }: SpiritGraduationPageProps) {
  // Check feature flag
  const spiritEnabled = process.env.FF_EDEN3_ONBOARDING === 'true'
  if (!spiritEnabled) {
    redirect('/agents')
  }

  // Get agent data
  const agentResult = await registryClient.getAgent(params.handle)
  
  if (agentResult.error || !agentResult.data) {
    notFound()
  }

  const agent = agentResult.data

  // Check if already graduated
  if (agent.status === 'GRADUATED' || agent.spirit?.active) {
    redirect(`/agents/${params.handle}/dashboard`)
  }

  return (
    <div>
      <SpiritOnboarding 
        agent={agent}
        onGraduationComplete={(graduatedAgent) => {
          // Handle successful graduation - redirect to dashboard
          window.location.href = `/agents/${graduatedAgent.handle}/dashboard`
        }}
      />
    </div>
  )
}

// Generate static params for known agents
export async function generateStaticParams() {
  // Only generate if feature is enabled
  const spiritEnabled = process.env.FF_EDEN3_ONBOARDING === 'true'
  if (!spiritEnabled) {
    return []
  }

  const agentsResult = await registryClient.getAllAgents()
  if (agentsResult.data) {
    return agentsResult.data
      .filter(agent => agent.status !== 'GRADUATED' && !agent.spirit?.active)
      .map(agent => ({
        handle: agent.handle
      }))
  }
  
  return []
}

export function generateMetadata({ params }: SpiritGraduationPageProps) {
  return {
    title: `Graduate ${params.handle.toUpperCase()} to Spirit | Eden Academy`,
    description: `Transform ${params.handle.toUpperCase()} into an autonomous onchain Spirit with daily practice covenants.`,
  }
}