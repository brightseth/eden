import fs from 'fs';
import path from 'path';

export interface MarkdownDocument {
  filename: string;
  title: string;
  content: string;
  path: string;
  lastModified: Date;
  sections?: MarkdownSection[];
}

export interface MarkdownSection {
  id: string;
  title: string;
  level: number;
  content?: string;
}

export async function parseMarkdownFile(filePath: string): Promise<MarkdownDocument | null> {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    
    // Check if file exists first
    if (!fs.existsSync(fullPath)) {
      // Try alternative paths for ADRs and docs
      const alternatives = [
        path.join(process.cwd(), 'docs', path.basename(filePath)),
        path.join(process.cwd(), 'docs', 'adr', path.basename(filePath)),
      ];
      
      let foundPath = null;
      for (const altPath of alternatives) {
        if (fs.existsSync(altPath)) {
          foundPath = altPath;
          break;
        }
      }
      
      if (!foundPath) {
        return null;
      }
      
      const content = fs.readFileSync(foundPath, 'utf-8');
      const stats = fs.statSync(foundPath);
      const filename = path.basename(foundPath);
      const title = extractTitle(content) || filename.replace('.md', '').replace(/_/g, ' ');
      const sections = extractSections(content);

      return {
        filename,
        title,
        content,
        path: path.relative(process.cwd(), foundPath),
        lastModified: stats.mtime,
        sections,
      };
    }
    
    const content = fs.readFileSync(fullPath, 'utf-8');
    const stats = fs.statSync(fullPath);
    
    const filename = path.basename(filePath);
    const title = extractTitle(content) || filename.replace('.md', '').replace(/_/g, ' ');
    const sections = extractSections(content);

    return {
      filename,
      title,
      content,
      path: filePath,
      lastModified: stats.mtime,
      sections,
    };
  } catch (error) {
    console.error(`Error parsing markdown file ${filePath}:`, error);
    return null;
  }
}

export async function getAllMarkdownFiles(): Promise<MarkdownDocument[]> {
  const projectRoot = process.cwd();
  const documents: MarkdownDocument[] = [];
  
  // Get root level markdown files
  const rootMdFiles = fs.readdirSync(projectRoot)
    .filter(file => file.endsWith('.md'))
    .filter(file => !file.toLowerCase().includes('readme'))
    .filter(file => !file.toLowerCase().includes('license'));

  const rootDocuments = await Promise.all(
    rootMdFiles.map(file => parseMarkdownFile(file))
  );
  documents.push(...rootDocuments.filter((doc): doc is MarkdownDocument => doc !== null));

  // Get docs directory files
  const docsDir = path.join(projectRoot, 'docs');
  if (fs.existsSync(docsDir)) {
    const docFiles = fs.readdirSync(docsDir)
      .filter(file => file.endsWith('.md'));
      
    const docsDocuments = await Promise.all(
      docFiles.map(file => parseMarkdownFile(path.join('docs', file)))
    );
    documents.push(...docsDocuments.filter((doc): doc is MarkdownDocument => doc !== null));
    
    // Get ADR files
    const adrDir = path.join(docsDir, 'adr');
    if (fs.existsSync(adrDir)) {
      const adrFiles = fs.readdirSync(adrDir)
        .filter(file => file.endsWith('.md'));
        
      const adrDocuments = await Promise.all(
        adrFiles.map(file => parseMarkdownFile(path.join('docs', 'adr', file)))
      );
      documents.push(...adrDocuments.filter((doc): doc is MarkdownDocument => doc !== null));
    }
  }

  return documents;
}

export function extractTitle(content: string): string | null {
  const titleMatch = content.match(/^#\s+(.+)$/m);
  return titleMatch ? titleMatch[1].trim() : null;
}

export function extractSections(content: string): MarkdownSection[] {
  const sections: MarkdownSection[] = [];
  const lines = content.split('\n');
  
  let currentSection: MarkdownSection | null = null;
  let currentContent: string[] = [];

  for (const line of lines) {
    const headerMatch = line.match(/^(#{1,6})\s+(.+)$/);
    
    if (headerMatch) {
      if (currentSection) {
        currentSection.content = currentContent.join('\n').trim();
        sections.push(currentSection);
        currentContent = [];
      }
      
      const level = headerMatch[1].length;
      const title = headerMatch[2].trim();
      const id = title.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
      
      currentSection = { id, title, level };
    } else if (currentSection) {
      currentContent.push(line);
    }
  }
  
  if (currentSection) {
    currentSection.content = currentContent.join('\n').trim();
    sections.push(currentSection);
  }

  return sections;
}

export function searchInMarkdown(content: string, query: string): boolean {
  return content.toLowerCase().includes(query.toLowerCase());
}

export function generateTableOfContents(sections: MarkdownSection[]): string {
  return sections
    .filter(section => section.level <= 3)
    .map(section => {
      const indent = '  '.repeat(section.level - 1);
      return `${indent}- [${section.title}](#${section.id})`;
    })
    .join('\n');
}

export interface ParsedMarkdown {
  content: string;
  toc: string;
  sections: MarkdownSection[];
}

export function parseMarkdownWithTOC(content: string): ParsedMarkdown {
  const sections = extractSections(content);
  const toc = generateTableOfContents(sections);
  
  return {
    content,
    toc,
    sections,
  };
}

// Helper function to find documentation by various naming patterns
export async function findDocumentationFile(slug: string): Promise<MarkdownDocument | null> {
  const possibleFilenames = [
    // ADR patterns
    `${slug}.md`,
    `docs/adr/${slug}.md`,
    // Upper case patterns
    `${slug.toUpperCase().replace(/-/g, '_')}.md`,
    `docs/${slug.toUpperCase().replace(/-/g, '_')}.md`,
    // Standard patterns
    `${slug.replace(/-/g, '_')}.md`,
    `docs/${slug.replace(/-/g, '_')}.md`,
    `${slug.replace(/-/g, '-')}.md`,
    `docs/${slug.replace(/-/g, '-')}.md`,
  ];
  
  for (const filename of possibleFilenames) {
    const doc = await parseMarkdownFile(filename);
    if (doc) {
      return doc;
    }
  }
  
  return null;
}