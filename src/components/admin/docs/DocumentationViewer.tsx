'use client';

import React, { useState, useEffect } from 'react';
import { ChevronRight, Menu, X, Search, Home, FileText } from 'lucide-react';
import Link from 'next/link';

interface DocumentationViewerProps {
  content: string;
  title?: string;
  sections?: Section[];
  showTOC?: boolean;
  showBreadcrumb?: boolean;
}

interface Section {
  id: string;
  title: string;
  level: number;
}

export default function DocumentationViewer({
  content,
  title,
  sections = [],
  showTOC = true,
  showBreadcrumb = true,
}: DocumentationViewerProps) {
  const [activeSection, setActiveSection] = useState<string>('');
  const [isTOCOpen, setIsTOCOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(section.id);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const renderMarkdown = (text: string) => {
    let html = text;
    
    // Helper function to create valid HTML IDs
    const createId = (title: string) => {
      return title.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
    };
    
    // Convert headers with proper IDs
    html = html.replace(/^### (.+)$/gm, (match, title) => {
      const id = createId(title);
      return `<h3 id="${id}" class="text-xl font-semibold mt-8 mb-4">${title}</h3>`;
    });
    html = html.replace(/^## (.+)$/gm, (match, title) => {
      const id = createId(title);
      return `<h2 id="${id}" class="text-2xl font-bold mt-10 mb-4 pb-2 border-b border-gray-800">${title}</h2>`;
    });
    html = html.replace(/^# (.+)$/gm, (match, title) => {
      const id = createId(title);
      return `<h1 id="${id}" class="text-3xl font-bold mb-6">${title}</h1>`;
    });
    
    // Convert bold and italic
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-white">$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
    
    // Convert inline code
    html = html.replace(/`([^`]+)`/g, '<code class="px-2 py-1 bg-gray-800 rounded text-sm text-blue-400">$1</code>');
    
    // Convert code blocks
    html = html.replace(/```(\w+)?\n([\s\S]+?)```/g, (match, lang, code) => {
      return `<pre class="bg-gray-900 border border-gray-800 rounded-lg p-4 overflow-x-auto my-4"><code class="text-sm text-gray-300">${code.trim()}</code></pre>`;
    });
    
    // Convert links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-400 hover:text-blue-300 underline">$1</a>');
    
    // Convert lists
    html = html.replace(/^\* (.+)$/gm, '<li class="ml-4 mb-1">• $1</li>');
    html = html.replace(/^\- (.+)$/gm, '<li class="ml-4 mb-1">• $1</li>');
    html = html.replace(/^\d+\. (.+)$/gm, '<li class="ml-4 mb-1">$1</li>');
    
    // Convert tables
    html = html.replace(/\|(.+)\|/g, (match) => {
      if (match.includes('---')) return '';
      const cells = match.split('|').filter(cell => cell.trim());
      const isHeader = match.trim().startsWith('| Scenario');
      const cellTag = isHeader ? 'th' : 'td';
      const cellClass = isHeader ? 'font-semibold text-left p-3 border-b border-gray-700' : 'p-3 border-b border-gray-800';
      return `<tr>${cells.map(cell => `<${cellTag} class="${cellClass}">${cell.trim()}</${cellTag}>`).join('')}</tr>`;
    });
    
    // Wrap tables
    html = html.replace(/(<tr>[\s\S]+?<\/tr>)/g, '<table class="w-full my-4 border border-gray-800 rounded-lg overflow-hidden">$1</table>');
    
    // Convert horizontal rules
    html = html.replace(/^---$/gm, '<hr class="my-8 border-gray-800">');
    
    // Convert paragraphs
    html = html.split('\n\n').map(para => {
      if (para.trim() && !para.includes('<') && !para.startsWith('#')) {
        return `<p class="mb-4 text-gray-300 leading-relaxed">${para}</p>`;
      }
      return para;
    }).join('\n');
    
    return html;
  };

  const filteredSections = sections.filter(section =>
    section.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white">
      {showBreadcrumb && (
        <div className="border-b border-gray-800 bg-gray-900/50">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center space-x-2 text-sm">
              <Link href="/admin/docs" className="text-gray-400 hover:text-white flex items-center">
                <Home className="w-4 h-4 mr-1" />
                Docs
              </Link>
              <ChevronRight className="w-4 h-4 text-gray-600" />
              <span className="text-white font-medium">{title || 'Documentation'}</span>
            </div>
          </div>
        </div>
      )}

      <div className="flex">
        {/* Table of Contents Sidebar */}
        {showTOC && sections.length > 0 && (
          <>
            <button
              onClick={() => setIsTOCOpen(!isTOCOpen)}
              className="lg:hidden fixed top-20 left-4 z-50 p-2 bg-gray-900 border border-gray-800 rounded-lg"
            >
              {isTOCOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <aside
              className={`
                ${isTOCOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                fixed lg:sticky top-0 left-0 h-screen w-72 bg-gray-900/95 border-r border-gray-800
                transition-transform duration-300 z-40 overflow-y-auto
              `}
            >
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Table of Contents
                </h3>
                
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      placeholder="Search sections..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <nav className="space-y-1">
                  {filteredSections.map((section) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className={`
                        block py-2 px-3 rounded-lg text-sm transition-colors
                        ${section.level === 2 ? 'ml-0 font-medium' : ''}
                        ${section.level === 3 ? 'ml-4' : ''}
                        ${section.level === 4 ? 'ml-8 text-xs' : ''}
                        ${activeSection === section.id
                          ? 'bg-blue-500/20 text-blue-400 border-l-2 border-blue-500'
                          : 'text-gray-400 hover:text-white hover:bg-gray-800'}
                      `}
                      onClick={(e) => {
                        e.preventDefault();
                        const element = document.getElementById(section.id);
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                    >
                      {section.title}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>
          </>
        )}

        {/* Main Content */}
        <main className={`flex-1 ${showTOC ? 'lg:ml-0' : ''}`}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {title && (
              <h1 className="text-4xl font-bold mb-8 pb-4 border-b border-gray-800">
                {title}
              </h1>
            )}
            
            <div 
              className="prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
            />
          </div>
        </main>
      </div>
    </div>
  );
}