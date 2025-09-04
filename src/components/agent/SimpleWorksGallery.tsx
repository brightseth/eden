'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Eye, Heart } from 'lucide-react';
import { CONFIG } from '@/config/flags';

// Fallback config values for build time
const WORKS_CONFIG = {
  WORKS_GALLERY_PAGE_SIZE: CONFIG?.WORKS_GALLERY_PAGE_SIZE || 12,
};

interface SimpleWork {
  id: string;
  title: string;
  imageUrl?: string;
  createdAt: Date;
  description?: string;
  tags: string[];
}

interface SimpleWorksGalleryProps {
  agentSlug: string;
  works: SimpleWork[];
  agentName: string;
}

export default function SimpleWorksGallery({ agentSlug, works, agentName }: SimpleWorksGalleryProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedWork, setSelectedWork] = useState<SimpleWork | null>(null);
  
  const worksPerPage = WORKS_CONFIG.WORKS_GALLERY_PAGE_SIZE;
  const totalPages = Math.ceil(works.length / worksPerPage);
  const startIndex = (currentPage - 1) * worksPerPage;
  const endIndex = startIndex + worksPerPage;
  const currentWorks = works.slice(startIndex, endIndex);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="bg-black text-white">
      {/* Gallery Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold uppercase tracking-wider mb-2">
              {agentName} WORKS
            </h2>
            <p className="text-sm uppercase tracking-wide text-gray-400">
              {works.length} TOTAL WORKS
            </p>
          </div>
          
          {/* Pagination Info */}
          <div className="text-right">
            <div className="text-xs uppercase tracking-wider text-gray-400 mb-1">
              PAGE {currentPage} OF {totalPages}
            </div>
            <div className="text-sm text-gray-400">
              Showing {startIndex + 1}-{Math.min(endIndex, works.length)} of {works.length}
            </div>
          </div>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className="flex items-center gap-2 px-4 py-2 border border-white hover:bg-white hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed font-bold uppercase tracking-wider text-sm"
          >
            <ChevronLeft className="w-4 h-4" />
            PREVIOUS
          </button>
          
          <div className="flex items-center gap-2 px-4 py-2 border border-gray-600">
            <span className="text-sm font-bold uppercase tracking-wider">
              PAGE {currentPage} OF {totalPages}
            </span>
          </div>
          
          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className="flex items-center gap-2 px-4 py-2 border border-white hover:bg-white hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed font-bold uppercase tracking-wider text-sm"
          >
            NEXT
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Works Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {currentWorks.map((work) => (
          <div
            key={work.id}
            className="border border-gray-600 hover:border-white transition-all group cursor-pointer"
            onClick={() => setSelectedWork(work)}
          >
            {/* Work Image/Placeholder */}
            <div className="aspect-square bg-gray-900 flex items-center justify-center border-b border-gray-600 group-hover:border-white transition-all relative overflow-hidden">
              {work.imageUrl ? (
                <img
                  src={work.imageUrl}
                  alt={work.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.parentElement?.classList.add('image-error');
                  }}
                />
              ) : (
                <div className="text-center">
                  <div className="text-xs text-gray-400 mb-2">{agentName}</div>
                  <div className="text-xs text-gray-400">
                    WORK #{work.id.split('-')[1] || work.id}
                  </div>
                </div>
              )}
            </div>
            
            {/* Work Info */}
            <div className="p-4">
              <h3 className="text-sm font-bold uppercase mb-2 line-clamp-1">
                {work.title}
              </h3>
              
              <div className="flex items-center gap-2 mb-3 text-xs text-gray-400">
                <Calendar className="w-3 h-3" />
                <span>
                  {work.createdAt.toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>
              
              {work.description && (
                <p className="text-xs text-gray-400 mb-3 line-clamp-2">
                  {work.description}
                </p>
              )}
              
              {/* Tags */}
              {work.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {work.tags.slice(0, 3).map((tag) => (
                    <span 
                      key={tag}
                      className="px-2 py-1 text-xs uppercase tracking-wider border border-gray-700 bg-gray-900"
                    >
                      {tag}
                    </span>
                  ))}
                  {work.tags.length > 3 && (
                    <span className="px-2 py-1 text-xs text-gray-400">
                      +{work.tags.length - 3} more
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {works.length === 0 && (
        <div className="text-center py-16">
          <div className="text-4xl font-bold uppercase tracking-wider mb-4 text-gray-600">
            NO WORKS YET
          </div>
          <p className="text-gray-400 max-w-md mx-auto">
            {agentName} hasn't published any works yet. Check back soon to see their creative outputs!
          </p>
        </div>
      )}

      {/* Work Detail Modal */}
      {selectedWork && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-8 z-50"
          onClick={() => setSelectedWork(null)}
        >
          <div 
            className="bg-black border-2 border-white max-w-4xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="border-b border-white p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold uppercase tracking-wider mb-2">
                    {selectedWork.title}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {selectedWork.createdAt.toLocaleDateString('en-US', { 
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long', 
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => setSelectedWork(null)}
                  className="px-4 py-2 border border-white hover:bg-white hover:text-black transition-all font-bold uppercase tracking-wider text-sm"
                >
                  CLOSE
                </button>
              </div>
            </div>
            
            {/* Modal Content */}
            <div className="p-6">
              {/* Work Display Area */}
              <div className="aspect-video bg-gray-900 border border-gray-600 mb-6 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-lg font-bold mb-2">{selectedWork.title}</div>
                  <div className="text-sm text-gray-400">
                    Full work display would be implemented here
                  </div>
                </div>
              </div>
              
              {/* Work Description */}
              {selectedWork.description && (
                <div className="mb-6">
                  <h4 className="text-sm font-bold uppercase tracking-wider mb-2 text-gray-400">
                    DESCRIPTION
                  </h4>
                  <p className="text-gray-300 leading-relaxed">
                    {selectedWork.description}
                  </p>
                </div>
              )}
              
              {/* Work Tags */}
              {selectedWork.tags.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wider mb-2 text-gray-400">
                    TAGS
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedWork.tags.map((tag) => (
                      <span 
                        key={tag}
                        className="px-3 py-1 text-sm border border-gray-600 bg-gray-900"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}