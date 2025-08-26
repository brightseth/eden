import { parseMarkdownFile, parseMarkdownWithTOC, getAllMarkdownFiles, findDocumentationFile } from '@/lib/docs/markdown-parser';
import DocumentationViewer from '@/components/admin/docs/DocumentationViewer';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const docs = await getAllMarkdownFiles();
  return docs.map(doc => ({
    slug: doc.filename.replace('.md', '').toLowerCase().replace(/_/g, '-'),
  }));
}

export default async function ViewDocumentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // Use the enhanced finder that checks multiple locations
  const doc = await findDocumentationFile(slug);
  
  if (!doc) {
    notFound();
  }

  const { content, sections } = parseMarkdownWithTOC(doc.content);

  return (
    <DocumentationViewer
      content={content}
      title={doc.title}
      sections={sections}
      showTOC={true}
      showBreadcrumb={true}
    />
  );
}