import React from 'react';
import { BaseWidgetProps } from '@/lib/profile/types';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

interface WorksGalleryWidgetConfig {
  title: string;
  maxItems?: number;
  gridCols?: number;
  showTitles?: boolean;
  showDates?: boolean;
  linkTo?: string;
}

interface Work {
  id: string;
  title: string;
  mediaUri?: string;
  createdAt: string;
  description?: string;
}

export function WorksGalleryWidget({ widget, agent, className }: BaseWidgetProps) {
  const config = widget.config as WorksGalleryWidgetConfig;
  const { 
    title, 
    maxItems = 6, 
    gridCols = 3, 
    showTitles = true, 
    showDates = false,
    linkTo 
  } = config;

  // Mock works data - in production this would come from Registry
  const works: Work[] = Array.from({ length: maxItems }, (_, i) => ({
    id: `work-${i + 1}`,
    title: `${agent.name} Work ${i + 1}`,
    mediaUri: `https://via.placeholder.com/400x400/1a1a1a/white?text=${agent.name}+${i + 1}`,
    createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
    description: `A creative work by ${agent.name}`
  }));

  const getGridClass = () => {
    switch (gridCols) {
      case 2: return 'grid-cols-2';
      case 4: return 'grid-cols-2 md:grid-cols-4';
      case 5: return 'grid-cols-2 md:grid-cols-5';
      case 6: return 'grid-cols-2 md:grid-cols-6';
      default: return 'grid-cols-1 md:grid-cols-3';
    }
  };

  return (
    <section className={`py-8 ${className}`}>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">{title}</h2>
          {linkTo && (
            <Link 
              href={linkTo}
              className="inline-flex items-center gap-2 text-sm border border-white px-4 py-2 hover:bg-white hover:text-black transition-colors"
            >
              View All
              <ExternalLink className="w-4 h-4" />
            </Link>
          )}
        </div>
        
        {works.length > 0 ? (
          <div className={`grid ${getGridClass()} gap-4`}>
            {works.map((work) => (
              <div key={work.id} className="group relative">
                <div className="aspect-square bg-gray-800 border border-gray-700 hover:border-white transition-colors overflow-hidden">
                  {work.mediaUri ? (
                    <img 
                      src={work.mediaUri}
                      alt={work.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <span className="text-6xl opacity-20">○</span>
                    </div>
                  )}
                </div>
                
                {(showTitles || showDates) && (
                  <div className="mt-2">
                    {showTitles && (
                      <h3 className="text-sm font-medium truncate">{work.title}</h3>
                    )}
                    {showDates && (
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(work.createdAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-4xl opacity-20 mb-4">○</div>
            <p className="text-gray-400">No works available yet</p>
            <p className="text-sm text-gray-500 mt-2">Registry integration active - Works will appear here once available</p>
          </div>
        )}
      </div>
    </section>
  );
}