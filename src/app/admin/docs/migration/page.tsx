import { parseMarkdownFile, parseMarkdownWithTOC } from '@/lib/docs/markdown-parser';
import DocumentationViewer from '@/components/admin/docs/DocumentationViewer';

export default async function MigrationPage() {
  const migrationDoc = await parseMarkdownFile('docs/MIGRATION_GUIDE.md');
  
  if (!migrationDoc) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">Migration Documentation Not Found</h1>
          <p className="text-gray-400">Could not load the migration instructions.</p>
        </div>
      </div>
    );
  }

  const { content, sections } = parseMarkdownWithTOC(migrationDoc.content);

  return (
    <DocumentationViewer
      content={content}
      title="Migration Instructions"
      sections={sections}
      showTOC={true}
      showBreadcrumb={true}
    />
  );
}