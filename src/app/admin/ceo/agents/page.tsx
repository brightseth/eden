import { parseMarkdownFile, parseMarkdownWithTOC } from '@/lib/docs/markdown-parser';
import DocumentationViewer from '@/components/admin/docs/DocumentationViewer';
import Link from 'next/link';
import { Crown, ArrowLeft } from 'lucide-react';

export default async function CEOAgentCheatsheetPage() {
  const cheatsheetDoc = await parseMarkdownFile('AGENT_CHEATSHEET.md');
  
  if (!cheatsheetDoc) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">Agent Cheatsheet Not Found</h1>
          <p className="text-gray-400">Could not load the agent cheatsheet documentation.</p>
        </div>
      </div>
    );
  }

  const { content, sections } = parseMarkdownWithTOC(cheatsheetDoc.content);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* CEO Header */}
      <div className="border-b border-gray-800 bg-gray-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/admin/ceo"
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                CEO Dashboard
              </Link>
              <span className="text-gray-600">/</span>
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-yellow-500" />
                <span className="text-white font-medium">Claude Coding Agents</span>
              </div>
            </div>
            <div className="text-xs px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-lg border border-yellow-500/30">
              CEO ONLY
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
        <Link href="/admin/ceo" className="hover:text-white transition-colors">
          <Crown className="w-4 h-4" />
        </Link>
        <span>/</span>
        <span className="text-white">Agent Cheatsheet</span>
      </nav>
      <DocumentationViewer
        content={content}
        title="Claude Coding Agents - CEO Reference"
        sections={sections}
        showTOC={true}
        showBreadcrumb={false}
      />
    </div>
  );
}