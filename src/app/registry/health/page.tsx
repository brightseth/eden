// Registry Health Dashboard Page
// Internal monitoring page for Registry Guardian

// import RegistryHealthDashboard from '@/components/registry/RegistryHealthDashboard'

export const metadata = {
  title: 'Registry Health Dashboard',
  description: 'Monitor Registry Gateway health and performance'
}

export default function RegistryHealthPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Registry Health Dashboard</h1>
        <p className="text-gray-600">Health dashboard temporarily disabled during debugging.</p>
      </div>
    </div>
  )
}

export const revalidate = 0 // Disable caching for real-time data