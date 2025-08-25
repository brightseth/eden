import fs from 'fs';
import path from 'path';
import { parseMarkdownFile } from './markdown-parser';

export interface SitemapEntry {
  title: string;
  path: string;
  type: 'route' | 'api' | 'doc';
  description?: string;
  children?: SitemapEntry[];
}

export async function generateSitemap(): Promise<SitemapEntry[]> {
  const sitemap: SitemapEntry[] = [];
  
  // Parse existing SITEMAP.md for routes
  const sitemapPath = path.join(process.cwd(), 'SITEMAP.md');
  if (fs.existsSync(sitemapPath)) {
    const sitemapContent = fs.readFileSync(sitemapPath, 'utf-8');
    const routeEntries = parseRoutesFromSitemap(sitemapContent);
    sitemap.push(...routeEntries);
  }
  
  // Scan for all .md documentation files
  const docEntries = await scanDocumentationFiles();
  sitemap.push({
    title: 'Documentation',
    path: '/admin/docs',
    type: 'doc',
    description: 'All project documentation',
    children: docEntries,
  });
  
  // Scan app directory for actual routes
  const appRoutes = await scanAppDirectory();
  sitemap.push({
    title: 'Application Routes',
    path: '/',
    type: 'route',
    description: 'All application routes',
    children: appRoutes,
  });
  
  return sitemap;
}

function parseRoutesFromSitemap(content: string): SitemapEntry[] {
  const entries: SitemapEntry[] = [];
  const lines = content.split('\n');
  
  let currentSection: SitemapEntry | null = null;
  
  for (const line of lines) {
    // Match section headers
    const sectionMatch = line.match(/^##\s+[🏠🎓👥🌐🎨📝🛠️📊🔗]\s+(.+)$/);
    if (sectionMatch) {
      if (currentSection) {
        entries.push(currentSection);
      }
      currentSection = {
        title: sectionMatch[1],
        path: '',
        type: 'route',
        children: [],
      };
      continue;
    }
    
    // Match route entries
    const routeMatch = line.match(/^-\s+`([^`]+)`\s+-\s+(.+)$/);
    if (routeMatch && currentSection) {
      currentSection.children?.push({
        title: routeMatch[2],
        path: routeMatch[1],
        type: routeMatch[1].startsWith('/api') ? 'api' : 'route',
      });
    }
  }
  
  if (currentSection) {
    entries.push(currentSection);
  }
  
  return entries;
}

async function scanDocumentationFiles(): Promise<SitemapEntry[]> {
  const entries: SitemapEntry[] = [];
  const projectRoot = process.cwd();
  
  const mdFiles = fs.readdirSync(projectRoot)
    .filter(file => file.endsWith('.md'))
    .filter(file => !file.toLowerCase().includes('license'));
  
  for (const file of mdFiles) {
    const doc = await parseMarkdownFile(file);
    if (doc) {
      const slug = file.replace('.md', '').toLowerCase().replace(/_/g, '-');
      entries.push({
        title: doc.title,
        path: `/admin/docs/${slug}`,
        type: 'doc',
        description: `View ${doc.title}`,
      });
    }
  }
  
  return entries;
}

async function scanAppDirectory(): Promise<SitemapEntry[]> {
  const entries: SitemapEntry[] = [];
  const appDir = path.join(process.cwd(), 'src/app');
  
  function scanDir(dir: string, basePath: string = ''): void {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const item of items) {
      if (item.isDirectory()) {
        const itemPath = path.join(dir, item.name);
        const routePath = path.join(basePath, item.name);
        
        // Skip special Next.js directories
        if (item.name.startsWith('_') || item.name === 'api') {
          continue;
        }
        
        // Check if it's a route (has page.tsx)
        const pagePath = path.join(itemPath, 'page.tsx');
        if (fs.existsSync(pagePath)) {
          const route = routePath.replace(/\\/g, '/');
          entries.push({
            title: item.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            path: `/${route}`,
            type: 'route',
          });
        }
        
        // Recursively scan subdirectories
        scanDir(itemPath, routePath);
      }
    }
  }
  
  scanDir(appDir);
  return entries;
}

export async function getDocumentationMap(): Promise<Record<string, string>> {
  const docMap: Record<string, string> = {
    'agent-cheatsheet': 'AGENT_CHEATSHEET.md',
    'sitemap': 'SITEMAP.md',
    'migration': 'MIGRATION_INSTRUCTIONS.md',
    'mvp': 'MVP_INTEGRATION.md',
    'platform': 'PLATFORM_AUDIT.md',
    'architecture': 'AGENT_SOVEREIGNTY_ARCHITECTURE.md',
    'sites': 'SITE_DOCUMENTATION.md',
    'works-storage': 'WORKS_STORAGE_MAP.md',
    'session': 'SESSION_SUMMARY.md',
  };
  
  // Verify files exist
  const validMap: Record<string, string> = {};
  for (const [key, file] of Object.entries(docMap)) {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      validMap[key] = file;
    }
  }
  
  return validMap;
}