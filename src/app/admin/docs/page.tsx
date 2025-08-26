import Link from 'next/link';
import { FileText, Users, Map, Book, Code, Database, Rocket, Info, Server, GitBranch } from 'lucide-react';

const documentationSections = [
  {
    title: 'Agent Cheatsheet',
    description: 'Quick reference for 6 Claude Coding Agents + visual diagrams',
    href: '/admin/docs/agents',
    icon: Users,
    featured: true,
  },
  {
    title: 'API & Registry',
    description: 'Complete API documentation and Registry integration',
    href: '/admin/docs/api-registry',
    icon: Server,
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
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Eden Academy Documentation</h1>
          <p className="text-gray-400 text-lg">
            Central hub for all technical documentation, agent references, and architectural guidelines.
          </p>
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

        <div className="mt-12 p-6 bg-gray-900/50 border border-gray-800 rounded-lg">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-blue-400 mt-0.5" />
            <div>
              <h3 className="font-semibold mb-2">Quick Access Tips</h3>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Use <kbd className="px-2 py-1 bg-gray-800 rounded text-xs">Cmd+K</kbd> for quick search (coming soon)</li>
                <li>• Agent Cheatsheet includes workflow patterns and decision matrices</li>
                <li>• All documentation files are auto-synced from project .md files</li>
                <li>• Documentation updates automatically when files change</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}