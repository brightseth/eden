import { parseMarkdownFile, parseMarkdownWithTOC, getAllMarkdownFiles } from '@/lib/docs/markdown-parser';
import DocumentationViewer from '@/components/admin/docs/DocumentationViewer';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const docs = await getAllMarkdownFiles();
  return docs.map(doc => ({
    slug: doc.filename.replace('.md', '').toLowerCase().replace(/_/g, '-'),
  }));
}

export default async function ViewDocumentPage({ params }: { params: { slug: string } }) {
  // Convert slug back to filename
  const possibleFilenames = [
    `${params.slug.toUpperCase().replace(/-/g, '_')}.md`,
    `${params.slug.replace(/-/g, '_')}.md`,
    `${params.slug}.md`,
  ];
  
  let doc = null;
  for (const filename of possibleFilenames) {
    doc = await parseMarkdownFile(filename);
    if (doc) break;
  }
  
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