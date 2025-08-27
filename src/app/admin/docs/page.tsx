'use client';

import Link from 'next/link';
import { FileText, Users, Map, Book, Code, Database, Rocket, Info, Server, GitBranch, ExternalLink, Share2, Globe } from 'lucide-react';

// Core Documentation Sections
const coreDocumentation = [
  {
    title: 'Registry Integration Hub',
    description: 'Complete Registry API documentation and integration guides',
    href: '/admin/docs/registry-hub',
    icon: Server,
    featured: true,
    shareable: true,
  },
  {
    title: 'Training Applications',
    description: 'Agent training application process and requirements',
    href: '/admin/docs/applications',
    icon: Rocket,
    featured: true,
  },
  {
    title: 'Agent Cheatsheet',
    description: 'Quick reference for Claude Coding Agents',
    href: '/admin/docs/agents',
    icon: Users,
  },
  {
    title: 'API Registry Documentation',
    description: 'Complete API and Registry technical documentation',
    href: '/admin/docs/api-registry',
    icon: Code,
  },
  {
    title: 'Architecture & ADRs',
    description: 'System design and architectural decisions',
    href: '/admin/docs/architecture',
    icon: Database,
  },
  {
    title: 'Site Map',
    description: 'Complete overview of Eden Academy routes',
    href: '/admin/docs/sitemap',
    icon: Map,
  },
  {
    title: 'All Documentation',
    description: 'Browse all markdown files',
    href: '/admin/docs/all',
    icon: FileText,
  },
];

export default function AdminDocsPage() {
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://eden-academy-flame.vercel.app' 
    : 'http://localhost:3000';

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Eden Academy Documentation</h1>
          <p className="text-gray-400 text-lg">
            Central hub for technical documentation, agent references, and architectural guidelines.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {coreDocumentation.map((doc) => {
            const Icon = doc.icon;
            const isShareable = doc.shareable;
            const fullShareUrl = isShareable ? `${baseUrl}${doc.href}` : null;
            
            return (
              <div
                key={doc.href}
                className={`
                  p-6 rounded-lg border transition-all duration-200
                  ${doc.featured 
                    ? 'border-blue-500/50 bg-blue-500/5 hover:bg-blue-500/10 hover:border-blue-500' 
                    : 'border-gray-800 bg-gray-900/50 hover:bg-gray-900 hover:border-gray-700'}
                `}
              >
                <div className="flex items-start space-x-4 mb-4">
                  <div className={`
                    p-3 rounded-lg
                    ${doc.featured ? 'bg-blue-500/20' : 'bg-gray-800'}
                  `}>
                    <Icon className={`w-6 h-6 ${doc.featured ? 'text-blue-400' : 'text-gray-400'}`} />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold mb-2 flex items-center">
                      {doc.title}
                      {doc.featured && (
                        <span className="ml-2 text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded">
                          FEATURED
                        </span>
                      )}
                      {isShareable && (
                        <span className="ml-2 text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded">
                          SHAREABLE
                        </span>
                      )}
                    </h2>
                    <p className="text-gray-400 text-sm mb-4">
                      {doc.description}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Link
                    href={doc.href}
                    className={`inline-flex items-center text-sm font-medium ${
                      doc.featured ? 'text-blue-400 hover:text-blue-300' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    View Documentation
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </Link>
                  
                  {isShareable && fullShareUrl && (
                    <div className="mt-2 p-2 bg-gray-900/50 border border-gray-800 rounded text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-gray-500">Share:</span>
                        <button
                          onClick={() => navigator.clipboard.writeText(fullShareUrl)}
                          className="text-green-400 hover:text-green-300"
                          title="Copy link"
                        >
                          Copy
                        </button>
                      </div>
                      <code className="text-green-400 break-all text-xs">{fullShareUrl}</code>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}