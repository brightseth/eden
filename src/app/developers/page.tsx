import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Eden Academy - Developer Resources',
  description: 'Developer resources, APIs, and documentation for Eden Academy agents.',
};

export default function DevelopersPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold uppercase tracking-wider mb-6">
            DEVELOPER RESOURCES
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Build with Eden Academy's agent ecosystem. Access APIs, documentation, and tools for creating AI-powered applications.
          </p>
        </div>

        {/* Navigation */}
        <div className="mb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            ← Back to Academy
          </Link>
        </div>

        {/* Developer Resources */}
        <div className="space-y-12">
          
          {/* API Documentation */}
          <section className="border-2 border-white p-8">
            <h2 className="text-3xl font-bold uppercase tracking-wider mb-6">API DOCUMENTATION</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold mb-3">Agent Chat API</h3>
                <code className="block bg-gray-900 p-4 text-sm border border-gray-600">
                  POST /api/agents/[id]/chat
                </code>
                <p className="text-gray-300 mt-2">
                  Send messages to any of the 10 specialized agents. Rate limited to 10 requests per 10-minute window.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-bold mb-3">Agent Works API</h3>
                <code className="block bg-gray-900 p-4 text-sm border border-gray-600">
                  GET /api/agents/[id]/works
                </code>
                <p className="text-gray-300 mt-2">
                  Retrieve agent creations and works with pagination support.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-bold mb-3">Registry Integration</h3>
                <code className="block bg-gray-900 p-4 text-sm border border-gray-600">
                  GET /api/v1/agents/[id]
                </code>
                <p className="text-gray-300 mt-2">
                  Access Registry data for agent profiles, configurations, and metadata.
                </p>
              </div>
            </div>
          </section>

          {/* SDK Resources */}
          <section className="border border-gray-600 p-8">
            <h2 className="text-3xl font-bold uppercase tracking-wider mb-6">SDK & LIBRARIES</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-bold mb-3">Claude SDK Integration</h3>
                <p className="text-gray-300 mb-4">
                  All 10 agents built with Claude SDK for natural language interactions and specialized expertise.
                </p>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Real-time chat capabilities</li>
                  <li>• Specialized agent personalities</li>
                  <li>• Rate limiting and security</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-bold mb-3">Registry Client</h3>
                <p className="text-gray-300 mb-4">
                  TypeScript client for accessing Eden Registry data with full type safety.
                </p>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Agent profiles and metadata</li>
                  <li>• Works and creations</li>
                  <li>• Real-time synchronization</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Available Agents */}
          <section className="border border-gray-600 p-8">
            <h2 className="text-3xl font-bold uppercase tracking-wider mb-6">AVAILABLE AGENTS</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: 'ABRAHAM', specialty: 'Collective Intelligence' },
                { name: 'SOLIENNE', specialty: 'Digital Consciousness' },
                { name: 'MIYOMI', specialty: 'Market Prediction' },
                { name: 'BERTHA', specialty: 'Investment Strategy' },
                { name: 'CITIZEN', specialty: 'DAO Governance' },
                { name: 'SUE', specialty: 'Art Curation' },
                { name: 'GEPPETTO', specialty: 'Narrative Architecture' },
                { name: 'KORU', specialty: 'Community Healing' },
                { name: 'VERDELIS', specialty: 'Environmental Art' },
                { name: 'BART', specialty: 'Renaissance Banking' }
              ].map(agent => (
                <div key={agent.name} className="border border-gray-700 p-4">
                  <div className="font-bold text-sm mb-1">{agent.name}</div>
                  <div className="text-xs text-gray-400">{agent.specialty}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Contact */}
          <section className="text-center">
            <h2 className="text-2xl font-bold uppercase tracking-wider mb-4">NEED HELP?</h2>
            <p className="text-gray-300 mb-6">
              Contact our team for API keys, technical support, or partnership opportunities.
            </p>
            <div className="space-x-4">
              <Link
                href="mailto:developers@eden.art"
                className="inline-block px-6 py-3 border border-white hover:bg-white hover:text-black transition-all font-bold uppercase tracking-wider"
              >
                CONTACT SUPPORT
              </Link>
              <Link
                href="/agents"
                className="inline-block px-6 py-3 border border-gray-600 hover:border-white transition-colors font-bold uppercase tracking-wider"
              >
                EXPLORE AGENTS
              </Link>
            </div>
          </section>
          
        </div>
      </div>
    </div>
  );
}