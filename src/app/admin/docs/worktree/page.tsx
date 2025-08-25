import { parseMarkdownFile, parseMarkdownWithTOC } from '@/lib/docs/markdown-parser';
import DocumentationViewer from '@/components/admin/docs/DocumentationViewer';

export default async function WorktreePage() {
  const worktreeDoc = await parseMarkdownFile('WORKTREE_SETUP.md');
  
  if (!worktreeDoc) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">Worktree Documentation Not Found</h1>
          <p className="text-gray-400">Could not load the worktree setup documentation.</p>
        </div>
      </div>
    );
  }

  const { content, sections } = parseMarkdownWithTOC(worktreeDoc.content);

  return (
    <DocumentationViewer
      content={content}
      title="Git Worktree Setup for Parallel Development"
      sections={sections}
      showTOC={true}
      showBreadcrumb={true}
    />
  );
}