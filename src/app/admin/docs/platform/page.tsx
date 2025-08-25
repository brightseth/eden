import { parseMarkdownFile, parseMarkdownWithTOC } from '@/lib/docs/markdown-parser';
import DocumentationViewer from '@/components/admin/docs/DocumentationViewer';

export default async function PlatformPage() {
  const platformDoc = await parseMarkdownFile('PLATFORM_AUDIT.md');
  
  if (!platformDoc) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">Platform Documentation Not Found</h1>
          <p className="text-gray-400">Could not load the platform audit documentation.</p>
        </div>
      </div>
    );
  }

  const { content, sections } = parseMarkdownWithTOC(platformDoc.content);

  return (
    <DocumentationViewer
      content={content}
      title="Platform Audit & Documentation"
      sections={sections}
      showTOC={true}
      showBreadcrumb={true}
    />
  );
}