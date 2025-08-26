// Registry Health Dashboard Page
// Internal monitoring page for Registry Guardian

import RegistryHealthDashboard from '@/components/registry/RegistryHealthDashboard'

export const metadata = {
  title: 'Registry Health Dashboard',
  description: 'Monitor Registry Gateway health and performance'
}

export default function RegistryHealthPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <RegistryHealthDashboard />
    </div>
  )
}

export const revalidate = 0 // Disable caching for real-time data