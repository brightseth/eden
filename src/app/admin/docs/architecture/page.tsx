import { parseMarkdownFile, parseMarkdownWithTOC } from '@/lib/docs/markdown-parser';
import DocumentationViewer from '@/components/admin/docs/DocumentationViewer';

export default async function ArchitecturePage() {
  const archDoc = await parseMarkdownFile('AGENT_SOVEREIGNTY_ARCHITECTURE.md');
  
  if (!archDoc) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">Architecture Documentation Not Found</h1>
          <p className="text-gray-400">Could not load the architecture documentation.</p>
        </div>
      </div>
    );
  }

  const { content, sections } = parseMarkdownWithTOC(archDoc.content);

  return (
    <DocumentationViewer
      content={content}
      title="Agent Sovereignty Architecture"
      sections={sections}
      showTOC={true}
      showBreadcrumb={true}
    />
  );
}