'use client';

import Link from 'next/link';
import { FileText, Users, Map, Book, Code, Database, Rocket, Info, Server, GitBranch, ExternalLink, Share2, Globe } from 'lucide-react';

// Shareable Documentation Categories for Collaborators
const shareableLinks = [
  {
    title: 'Registry Integration Hub',
    description: 'Complete Registry documentation hub for developers and collaborators',
    href: '/admin/docs/registry-hub',
    shareUrl: '/admin/docs/registry-hub',
    icon: Server,
    featured: true,
  },
  {
    title: 'Registry Integration Complete Guide',
    description: 'Comprehensive guide for Registry API integration',
    href: '/admin/docs/view/registry-integration-complete',
    shareUrl: '/admin/docs/view/registry-integration-complete',
    icon: FileText,
    featured: true,
  },
  {
    title: 'Registry-First Architecture ADR',
    description: 'Core architectural pattern and decision rationale',
    href: '/admin/docs/view/022-registry-first-architecture-pattern',
    shareUrl: '/admin/docs/view/022-registry-first-architecture-pattern',
    icon: Database,
    featured: true,
  },
];

const documentationSections = [
  {
    title: 'Agent Cheatsheet',
    description: 'Quick reference for 6 Claude Coding Agents + visual diagrams',
    href: '/admin/docs/agents',
    icon: Users,
    featured: false,
  },
  {
    title: 'API & Registry',
    description: 'Complete API documentation and Registry integration',
    href: '/admin/docs/api-registry',
    icon: Server,
    featured: false,
  },
  {
    title: 'Training Applications',
    description: 'Agent training application process and requirements',
    href: '/admin/docs/applications',
    icon: Rocket,
    featured: true,
  },
  {
    title: 'Site Map',
    description: 'Complete overview of Eden Academy routes and pages',
    href: '/admin/docs/sitemap',
    icon: Map,
  },
  {
    title: 'Worktree Setup',
    description: 'Git worktree configuration for parallel development',
    href: '/admin/docs/worktree',
    icon: GitBranch,
  },
  {
    title: 'Architecture',
    description: 'System design and technical documentation',
    href: '/admin/docs/architecture',
    icon: Database,
  },
  {
    title: 'MVP Integration',
    description: 'Feature integration guidelines and patterns',
    href: '/admin/docs/mvp',
    icon: Code,
  },
  {
    title: 'Migration Guide',
    description: 'Instructions for migrating from legacy systems',
    href: '/admin/docs/migration',
    icon: Rocket,
  },
  {
    title: 'Platform Documentation',
    description: 'Complete platform audit and documentation',
    href: '/admin/docs/platform',
    icon: Book,
  },
  {
    title: 'All Documentation',
    description: 'Browse all markdown documentation files',
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Eden Academy Documentation</h1>
          <p className="text-gray-400 text-lg">
            Central hub for all technical documentation, agent references, and architectural guidelines.
          </p>
        </div>

        {/* Shareable Links Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center">
              <Share2 className="w-6 h-6 mr-3 text-green-400" />
              Registry Documentation - Shareable Links
            </h2>
            <div className="text-sm text-gray-400 flex items-center">
              <Globe className="w-4 h-4 mr-1" />
              For Developers & Collaborators
            </div>
          </div>
          
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
            {shareableLinks.map((doc) => {
              const Icon = doc.icon;
              const fullShareUrl = `${baseUrl}${doc.shareUrl}`;
              return (
                <div
                  key={doc.href}
                  className="block p-6 rounded-lg border border-green-500/50 bg-green-500/5 hover:bg-green-500/10"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 rounded-lg bg-green-500/20">
                        <Icon className="w-6 h-6 text-green-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2 flex items-center">
                          {doc.title}
                        </h3>
                        <p className="text-gray-400 text-sm mb-3">
                          {doc.description}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Link
                      href={doc.href}
                      className="inline-flex items-center text-green-400 hover:text-green-300 text-sm font-medium"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      View Documentation
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </Link>
                    
                    <div className="mt-2 p-3 bg-gray-900/50 border border-gray-800 rounded text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-gray-500">Shareable URL:</span>
                        <button
                          onClick={() => navigator.clipboard.writeText(fullShareUrl)}
                          className="text-blue-400 hover:text-blue-300"
                          title="Copy to clipboard"
                        >
                          Copy
                        </button>
                      </div>
                      <code className="text-blue-400 break-all">{fullShareUrl}</code>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Regular Documentation Sections */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">General Documentation</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {documentationSections.map((section) => {
            const Icon = section.icon;
            return (
              <Link
                key={section.href}
                href={section.href}
                className={`
                  block p-6 rounded-lg border transition-all duration-200
                  ${section.featured 
                    ? 'border-blue-500/50 bg-blue-500/5 hover:bg-blue-500/10 hover:border-blue-500' 
                    : 'border-gray-800 bg-gray-900/50 hover:bg-gray-900 hover:border-gray-700'}
                `}
              >
                <div className="flex items-start space-x-4">
                  <div className={`
                    p-3 rounded-lg
                    ${section.featured ? 'bg-blue-500/20' : 'bg-gray-800'}
                  `}>
                    <Icon className={`w-6 h-6 ${section.featured ? 'text-blue-400' : 'text-gray-400'}`} />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold mb-2">
                      {section.title}
                      {section.featured && (
                        <span className="ml-2 text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded">
                          FEATURED
                        </span>
                      )}
                    </h2>
                    <p className="text-gray-400 text-sm">
                      {section.description}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="p-6 bg-green-500/5 border border-green-500/30 rounded-lg">
            <div className="flex items-start space-x-3">
              <Share2 className="w-5 h-5 text-green-400 mt-0.5" />
              <div>
                <h3 className="font-semibold mb-2 text-green-400">Shareable Links</h3>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• All Registry documentation is shareable via public URLs</li>
                  <li>• Copy links directly from the documentation cards above</li>
                  <li>• Links work for external collaborators and developers</li>
                  <li>• No authentication required for documentation viewing</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="p-6 bg-gray-900/50 border border-gray-800 rounded-lg">
            <div className="flex items-start space-x-3">
              <Info className="w-5 h-5 text-blue-400 mt-0.5" />
              <div>
                <h3 className="font-semibold mb-2">Documentation Features</h3>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Dynamic markdown parsing with table of contents</li>
                  <li>• Search functionality within documentation viewer</li>
                  <li>• Auto-synced from project .md files and /docs directory</li>
                  <li>• ADRs (Architecture Decision Records) included</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}