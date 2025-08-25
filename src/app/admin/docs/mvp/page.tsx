import { parseMarkdownFile, parseMarkdownWithTOC } from '@/lib/docs/markdown-parser';
import DocumentationViewer from '@/components/admin/docs/DocumentationViewer';

export default async function MvpPage() {
  const mvpDoc = await parseMarkdownFile('MVP_INTEGRATION.md');
  
  if (!mvpDoc) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">MVP Integration Documentation Not Found</h1>
          <p className="text-gray-400">Could not load the MVP integration documentation.</p>
        </div>
      </div>
    );
  }

  const { content, sections } = parseMarkdownWithTOC(mvpDoc.content);

  return (
    <DocumentationViewer
      content={content}
      title="MVP Integration Guide"
      sections={sections}
      showTOC={true}
      showBreadcrumb={true}
    />
  );
}