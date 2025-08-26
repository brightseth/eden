import Link from 'next/link';
import { Server, Database, GitBranch, ExternalLink, Copy, CheckCircle, Settings, Users, Globe, FileText, Zap } from 'lucide-react';

const registryDocumentation = [
  {
    title: 'Complete Registry Integration Guide',
    description: 'Comprehensive guide for Henry\'s Registry API integration with Abraham & Solienne sites',
    href: '/admin/docs/view/henry-registry-integration-complete',
    shareUrl: '/admin/docs/view/henry-registry-integration-complete',
    icon: FileText,
    status: 'complete',
    priority: 'high',
  },
  {
    title: 'Registry-First Architecture Pattern',
    description: 'Core ADR defining Registry as single source of truth architecture',
    href: '/admin/docs/view/022-registry-first-architecture-pattern',
    shareUrl: '/admin/docs/view/022-registry-first-architecture-pattern',
    icon: Database,
    status: 'complete',
    priority: 'high',
  },
  {
    title: 'Agent Site Architecture Standards',
    description: 'Standards and patterns for agent sites (Abraham, Solienne, future agents)',
    href: '/admin/docs/view/023-agent-site-architecture-standards',
    shareUrl: '/admin/docs/view/023-agent-site-architecture-standards',
    icon: GitBranch,
    status: 'complete',
    priority: 'high',
  },
  {
    title: 'Abraham Registry Integration Pattern',
    description: 'Implementation details for Abraham site Registry integration',
    href: '/admin/docs/view/024-abraham-registry-integration-pattern',
    shareUrl: '/admin/docs/view/024-abraham-registry-integration-pattern',
    icon: Users,
    status: 'complete',
    priority: 'medium',
  },
  {
    title: 'Registry Integration Technical Guide',
    description: 'Technical implementation details, API endpoints, and integration patterns',
    href: '/admin/docs/view/registry-integration-guide',
    shareUrl: '/admin/docs/view/registry-integration-guide',
    icon: Settings,
    status: 'complete',
    priority: 'medium',
  },
  {
    title: 'System Architecture Overview',
    description: 'Complete system architecture with Registry integration points',
    href: '/admin/docs/view/system-architecture',
    shareUrl: '/admin/docs/view/system-architecture',
    icon: Globe,
    status: 'complete',
    priority: 'medium',
  },
  {
    title: 'Architecture Summary 2025-08',
    description: 'Latest architecture summary with Registry integration status',
    href: '/admin/docs/view/architecture-summary-2025-08',
    shareUrl: '/admin/docs/view/architecture-summary-2025-08',
    icon: Zap,
    status: 'complete',
    priority: 'low',
  },
];

const integrationStatus = [
  {
    item: 'Abraham Site Registry Integration',
    status: 'complete',
    description: 'Fully integrated displaying actual works from Registry API',
  },
  {
    item: 'Solienne Site Registry Integration',
    status: 'complete',
    description: 'Fully integrated displaying consciousness streams from Registry API',
  },
  {
    item: 'Application Form API Ready',
    status: 'ready',
    description: 'Form ready for integration with Henry\'s Registry API endpoint',
  },
  {
    item: 'Feature Flag System',
    status: 'complete',
    description: 'All Registry integrations controlled by feature flags with fallbacks',
  },
];

export default function RegistryHubPage() {
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://eden-academy.vercel.app' 
    : 'http://localhost:3000';

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <div className="flex items-center mb-6">
            <Server className="w-8 h-8 mr-4 text-green-400" />
            <div>
              <h1 className="text-4xl font-bold">Registry Documentation Hub</h1>
              <p className="text-gray-400 text-lg mt-2">
                Complete documentation for Eden Academy ↔ Registry integration
              </p>
            </div>
          </div>
          
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
              <span className="text-green-400 font-semibold">Registry Integration Status</span>
            </div>
            <p className="text-gray-300 text-sm">
              All core integrations complete. Abraham & Solienne sites fully connected to Registry API.
              Application form ready for Henry's Registry endpoint integration.
            </p>
          </div>
        </div>

        {/* Integration Status */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Current Integration Status</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {integrationStatus.map((item, index) => (
              <div key={index} className="p-4 bg-gray-900/50 border border-gray-800 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{item.item}</span>
                  <span className={`
                    px-2 py-1 text-xs rounded
                    ${item.status === 'complete' ? 'bg-green-500/20 text-green-400' :
                      item.status === 'ready' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-yellow-500/20 text-yellow-400'}
                  `}>
                    {item.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-gray-400 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Documentation Links */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Complete Documentation</h2>
          <div className="space-y-4">
            {registryDocumentation.map((doc) => {
              const Icon = doc.icon;
              const fullShareUrl = `${baseUrl}${doc.shareUrl}`;
              
              return (
                <div
                  key={doc.href}
                  className="block p-6 rounded-lg border border-gray-800 bg-gray-900/30 hover:bg-gray-900/50 hover:border-gray-700 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="p-3 rounded-lg bg-gray-800">
                        <Icon className="w-6 h-6 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h3 className="text-xl font-semibold mr-3">{doc.title}</h3>
                          <div className="flex items-center space-x-2">
                            <span className={`
                              px-2 py-1 text-xs rounded
                              ${doc.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                                doc.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-gray-500/20 text-gray-400'}
                            `}>
                              {doc.priority.toUpperCase()}
                            </span>
                            <span className="px-2 py-1 text-xs rounded bg-green-500/20 text-green-400">
                              {doc.status.toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <p className="text-gray-400 text-sm mb-4">
                          {doc.description}
                        </p>
                        
                        <div className="flex items-center space-x-4">
                          <Link
                            href={doc.href}
                            className="inline-flex items-center text-blue-400 hover:text-blue-300 text-sm font-medium"
                          >
                            <FileText className="w-4 h-4 mr-2" />
                            View Documentation
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </Link>
                          
                          <button
                            onClick={() => copyToClipboard(fullShareUrl)}
                            className="inline-flex items-center text-gray-400 hover:text-gray-300 text-sm"
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            Copy Share Link
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Shareable URL */}
                  <div className="mt-4 p-3 bg-gray-950/50 border border-gray-800 rounded text-xs">
                    <div className="text-gray-500 mb-1">Shareable URL:</div>
                    <code className="text-blue-400 break-all">{fullShareUrl}</code>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions for Henry</h3>
          <div className="grid gap-4 md:grid-cols-3">
            <Link
              href="/admin/docs/view/henry-registry-integration-complete"
              className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg hover:bg-green-500/20 transition-colors"
            >
              <div className="text-green-400 font-medium mb-1">Start Here</div>
              <div className="text-sm text-gray-400">Complete integration overview</div>
            </Link>
            
            <Link
              href="/admin/docs/view/022-registry-first-architecture-pattern"
              className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg hover:bg-blue-500/20 transition-colors"
            >
              <div className="text-blue-400 font-medium mb-1">Architecture</div>
              <div className="text-sm text-gray-400">Core architectural patterns</div>
            </Link>
            
            <Link
              href="/admin/docs/api-registry"
              className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg hover:bg-purple-500/20 transition-colors"
            >
              <div className="text-purple-400 font-medium mb-1">API Docs</div>
              <div className="text-sm text-gray-400">Complete API documentation</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}