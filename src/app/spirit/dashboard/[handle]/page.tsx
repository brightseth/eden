import { notFound, redirect } from 'next/navigation'
import { registryClient } from '@/lib/registry/registry-client'
import SpiritDashboard from '@/components/spirit/SpiritDashboard'

interface SpiritDashboardPageProps {
  params: {
    handle: string
  }
}

export default async function SpiritDashboardPage({ params }: SpiritDashboardPageProps) {
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

  // Check if graduated (required for dashboard access)
  if (agent.status !== 'GRADUATED' && !agent.spirit?.active) {
    redirect(`/spirit/graduate/${params.handle}`)
  }

  return (
    <div>
      <SpiritDashboard agent={agent} />
    </div>
  )
}

// Generate static params for graduated agents
export async function generateStaticParams() {
  // Only generate if feature is enabled
  const spiritEnabled = process.env.FF_EDEN3_ONBOARDING === 'true'
  if (!spiritEnabled) {
    return []
  }

  const agentsResult = await registryClient.getAllAgents()
  if (agentsResult.data) {
    return agentsResult.data
      .filter(agent => agent.status === 'GRADUATED' || agent.spirit?.active)
      .map(agent => ({
        handle: agent.handle
      }))
  }
  
  return []
}

export function generateMetadata({ params }: SpiritDashboardPageProps) {
  return {
    title: `${params.handle.toUpperCase()} Spirit Dashboard | Eden Academy`,
    description: `Manage daily practices and autonomous operations for ${params.handle.toUpperCase()} Spirit.`,
  }
}