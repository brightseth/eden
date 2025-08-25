import { parseMarkdownFile, parseMarkdownWithTOC } from '@/lib/docs/markdown-parser';
import DocumentationViewer from '@/components/admin/docs/DocumentationViewer';

export default async function SitemapPage() {
  const sitemapDoc = await parseMarkdownFile('SITEMAP.md');
  
  if (!sitemapDoc) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">Sitemap Not Found</h1>
          <p className="text-gray-400">Could not load the sitemap documentation.</p>
        </div>
      </div>
    );
  }

  const { content, sections } = parseMarkdownWithTOC(sitemapDoc.content);

  return (
    <DocumentationViewer
      content={content}
      title="Eden Academy Site Map"
      sections={sections}
      showTOC={true}
      showBreadcrumb={true}
    />
  );
}