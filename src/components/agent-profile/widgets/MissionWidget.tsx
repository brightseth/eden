// Mission Widget Component
// Implements ADR-025: Agent Profile Widget System

import { BaseWidgetProps, RegistryReference } from '@/lib/profile/types';

interface MissionWidgetConfig {
  title?: string;
  content?: string | RegistryReference;
  layout?: 'single-column' | 'two-column';
  showBorder?: boolean;
}

export function MissionWidget({ widget, agent, className }: BaseWidgetProps) {
  const config = widget.config as MissionWidgetConfig;
  const title = config.title || 'MISSION';
  const showBorder = config.showBorder !== false; // Default to true
  
  // Resolve content from Registry reference or use direct content
  const content = resolveContent(config.content, agent);
  
  if (!content) {
    return null; // Don't render if no content
  }

  return (
    <section className={`py-16 px-6 ${showBorder ? 'border-b border-white' : ''} ${className || ''}`}>
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-8">{title}</h2>
        
        {config.layout === 'two-column' ? (
          <div className="grid md:grid-cols-2 gap-8">
            {renderContent(content)}
          </div>
        ) : (
          <div className="max-w-3xl">
            {renderContent(content)}
          </div>
        )}
      </div>
    </section>
  );
}

// Helper function to resolve content from Registry reference
function resolveContent(
  content: string | RegistryReference | undefined, 
  agent: any
): string | null {
  if (!content) return null;
  
  if (typeof content === 'string') {
    return content;
  }
  
  // Handle Registry reference
  if (content.source === 'registry') {
    return getNestedProperty(agent, content.path) || null;
  }
  
  return null;
}

// Helper function to get nested property from object by path
function getNestedProperty(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

// Helper function to render content (could be expanded for markdown, etc.)
function renderContent(content: string) {
  // For now, simple text rendering. Could be expanded to support:
  // - Markdown parsing
  // - HTML rendering
  // - Rich text formatting
  
  // Split content into paragraphs if it contains multiple paragraphs
  const paragraphs = content.split('\n\n').filter(p => p.trim());
  
  if (paragraphs.length === 1) {
    return (
      <div className="prose prose-lg prose-invert max-w-none">
        <p>{content}</p>
      </div>
    );
  }
  
  // Multiple paragraphs - render in columns if two-column layout
  return paragraphs.map((paragraph, index) => (
    <div key={index} className="mb-6">
      <p className="text-lg leading-relaxed">{paragraph.trim()}</p>
    </div>
  ));
}