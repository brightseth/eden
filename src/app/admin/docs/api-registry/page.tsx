import { parseMarkdownFile, parseMarkdownWithTOC } from '@/lib/docs/markdown-parser';
import DocumentationViewer from '@/components/admin/docs/DocumentationViewer';

export default async function ApiRegistryPage() {
  const apiDoc = await parseMarkdownFile('API_REGISTRY_DOCS.md');
  
  if (!apiDoc) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">API & Registry Documentation Not Found</h1>
          <p className="text-gray-400">Could not load the API documentation.</p>
        </div>
      </div>
    );
  }

  const { content, sections } = parseMarkdownWithTOC(apiDoc.content);

  return (
    <DocumentationViewer
      content={content}
      title="Eden Academy API & Registry Documentation"
      sections={sections}
      showTOC={true}
      showBreadcrumb={true}
    />
  );
}