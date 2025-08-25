import Link from 'next/link';
import { getAllMarkdownFiles } from '@/lib/docs/markdown-parser';
import { FileText, Calendar, ArrowRight } from 'lucide-react';

export default async function AllDocsPage() {
  const documents = await getAllMarkdownFiles();
  
  // Sort documents alphabetically
  const sortedDocs = documents.sort((a, b) => a.title.localeCompare(b.title));

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <nav className="flex items-center space-x-2 text-sm mb-6">
            <Link href="/admin/docs" className="text-gray-400 hover:text-white">
              Documentation
            </Link>
            <span className="text-gray-600">/</span>
            <span className="text-white">All Files</span>
          </nav>
          
          <h1 className="text-4xl font-bold mb-4">All Documentation Files</h1>
          <p className="text-gray-400 text-lg">
            Browse all markdown documentation files in the project root directory.
          </p>
        </div>

        {/* Documentation Grid */}
        <div className="grid gap-4">
          {sortedDocs.map((doc) => {
            const slug = doc.filename.replace('.md', '').toLowerCase().replace(/_/g, '-');
            const isCheatsheet = doc.filename === 'AGENT_CHEATSHEET.md';
            const isSitemap = doc.filename === 'SITEMAP.md';
            
            // Use special routes for specific files
            const href = isCheatsheet ? '/admin/docs/agents' : 
                        isSitemap ? '/admin/docs/sitemap' :
                        `/admin/docs/view/${slug}`;
            
            return (
              <Link
                key={doc.filename}
                href={href}
                className="group block p-6 bg-gray-900/50 border border-gray-800 rounded-lg hover:bg-gray-900 hover:border-gray-700 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-gray-800 rounded-lg">
                      <FileText className="w-6 h-6 text-gray-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold mb-2 group-hover:text-blue-400 transition-colors">
                        {doc.title}
                        {isCheatsheet && (
                          <span className="ml-2 text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded">
                            FEATURED
                          </span>
                        )}
                      </h2>
                      <p className="text-sm text-gray-500 mb-2">
                        {doc.filename}
                      </p>
                      <div className="flex items-center text-xs text-gray-600">
                        <Calendar className="w-3 h-3 mr-1" />
                        Last modified: {new Date(doc.lastModified).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-blue-400 transition-colors" />
                </div>
              </Link>
            );
          })}
        </div>

        {documents.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-700 mx-auto mb-4" />
            <p className="text-gray-500">No documentation files found in the project root.</p>
          </div>
        )}
      </div>
    </div>
  );
}