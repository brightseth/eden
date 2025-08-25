import { parseMarkdownFile, parseMarkdownWithTOC } from '@/lib/docs/markdown-parser';
import DocumentationViewer from '@/components/admin/docs/DocumentationViewer';

export default async function AgentCheatsheetPage() {
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
    <DocumentationViewer
      content={content}
      title="Eden Academy Agent Cheatsheet"
      sections={sections}
      showTOC={true}
      showBreadcrumb={true}
    />
  );
}