'use client';

import { useState } from 'react';
import Image from 'next/image';

interface Work {
  id: string;
  title: string;
  date: string;
  type: 'image' | 'text' | 'audio' | 'video';
  thumbnail?: string;
  description?: string;
  tags: string[];
  metrics: {
    views: number;
    shares: number;
    likes: number;
    revenue: number;
  };
}

interface WorkGalleryProps {
  agentSlug: string;
  works: Work[];
  agentName: string;
}

export default function WorkGallery({ agentSlug, works, agentName }: WorkGalleryProps) {
  const [filter, setFilter] = useState<'all' | 'image' | 'text' | 'audio' | 'video'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'views' | 'revenue'>('date');
  const [selectedWork, setSelectedWork] = useState<Work | null>(null);

  // Filter and sort works
  let filteredWorks = filter === 'all' ? works : works.filter(w => w.type === filter);
  
  filteredWorks = [...filteredWorks].sort((a, b) => {
    if (sortBy === 'date') return new Date(b.date).getTime() - new Date(a.date).getTime();
    if (sortBy === 'views') return b.metrics.views - a.metrics.views;
    if (sortBy === 'revenue') return b.metrics.revenue - a.metrics.revenue;
    return 0;
  });

  // Calculate totals
  const totalRevenue = works.reduce((sum, w) => sum + w.metrics.revenue, 0);
  const totalViews = works.reduce((sum, w) => sum + w.metrics.views, 0);
  const mostPopular = works.reduce((prev, curr) => curr.metrics.views > prev.metrics.views ? curr : prev);

  return (
    <div className="bg-black text-white">
      {/* GALLERY HEADER */}
      <div className="border-b-2 border-white p-8">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold uppercase tracking-wider mb-2">
              {agentName} WORKS
            </h2>
            <p className="text-sm uppercase tracking-wide text-gray-400">
              {works.length} TOTAL WORKS • ${totalRevenue.toLocaleString()} REVENUE
            </p>
          </div>
          
          <div className="text-right">
            <div className="text-xs uppercase tracking-wider text-gray-400 mb-1">MOST POPULAR</div>
            <div className="font-bold uppercase">{mostPopular.title}</div>
            <div className="text-sm text-gray-400">{mostPopular.metrics.views.toLocaleString()} views</div>
          </div>
        </div>
      </div>

      {/* GALLERY METRICS */}
      <div className="border-b border-gray-800 bg-gray-900">
        <div className="p-6">
          <div className="grid grid-cols-5 gap-6">
            <div>
              <div className="text-xs uppercase tracking-wider text-gray-400 mb-1">TOTAL WORKS</div>
              <div className="text-2xl font-bold">{works.length}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-gray-400 mb-1">TOTAL VIEWS</div>
              <div className="text-2xl font-bold">{totalViews.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-gray-400 mb-1">REVENUE</div>
              <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-gray-400 mb-1">AVG VIEWS</div>
              <div className="text-2xl font-bold">{Math.round(totalViews / works.length).toLocaleString()}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-gray-400 mb-1">SUCCESS RATE</div>
              <div className="text-2xl font-bold">94%</div>
            </div>
          </div>
        </div>
      </div>

      {/* FILTERS & CONTROLS */}
      <div className="border-b border-gray-800 p-6">
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            {(['all', 'image', 'text', 'audio', 'video'] as const).map(type => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border transition-all ${
                  filter === type 
                    ? 'bg-white text-black border-white' 
                    : 'bg-black text-white border-gray-600 hover:border-white'
                }`}
              >
                {type === 'all' ? 'ALL WORKS' : `${type}S`}
              </button>
            ))}
          </div>
          
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-black border border-gray-600 text-white px-3 py-2 text-xs font-bold uppercase tracking-wider"
          >
            <option value="date">NEWEST FIRST</option>
            <option value="views">MOST VIEWED</option>
            <option value="revenue">HIGHEST REVENUE</option>
          </select>
        </div>
      </div>

      {/* WORKS GRID */}
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredWorks.map((work) => (
            <button
              key={work.id}
              onClick={() => setSelectedWork(work)}
              className="group border-2 border-gray-600 hover:border-white transition-all p-4 text-left"
            >
              {/* WORK PREVIEW */}
              <div className="mb-4 aspect-square bg-gray-900 relative flex items-center justify-center">
                {work.thumbnail ? (
                  <Image
                    src={work.thumbnail}
                    alt={work.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="text-4xl font-bold uppercase text-gray-600">
                    {work.type === 'image' ? '□' : work.type === 'text' ? 'T' : work.type === 'audio' ? '♪' : '▶'}
                  </div>
                )}
              </div>

              {/* WORK INFO */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold uppercase tracking-wider line-clamp-2 group-hover:text-gray-300">
                  {work.title}
                </h3>
                
                <div className="flex justify-between text-xs uppercase tracking-wider text-gray-400">
                  <span>{work.type}</span>
                  <span>{new Date(work.date).toLocaleDateString()}</span>
                </div>
                
                <div className="pt-2 border-t border-gray-700">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-400">VIEWS: </span>
                      <span className="font-bold">{work.metrics.views.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">REV: </span>
                      <span className="font-bold">${work.metrics.revenue}</span>
                    </div>
                  </div>
                </div>

                {/* TAGS */}
                <div className="flex flex-wrap gap-1 pt-2">
                  {work.tags.slice(0, 3).map(tag => (
                    <span 
                      key={tag}
                      className="px-2 py-1 text-xs uppercase tracking-wider bg-gray-800 border border-gray-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* LOAD MORE */}
        {filteredWorks.length >= 20 && (
          <div className="text-center mt-12">
            <button className="px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-black transition-all font-bold uppercase tracking-wider">
              LOAD MORE WORKS
            </button>
          </div>
        )}
      </div>

      {/* WORK DETAIL MODAL */}
      {selectedWork && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-8">
          <div className="bg-black border-2 border-white max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              {/* MODAL HEADER */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold uppercase tracking-wider mb-2">
                    {selectedWork.title}
                  </h2>
                  <div className="flex gap-4 text-sm uppercase tracking-wider text-gray-400">
                    <span>{selectedWork.type}</span>
                    <span>{new Date(selectedWork.date).toLocaleDateString()}</span>
                    <span>{agentName}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedWork(null)}
                  className="text-2xl font-bold hover:text-gray-400 transition-colors"
                >
                  ×
                </button>
              </div>

              {/* WORK CONTENT */}
              <div className="mb-6">
                {selectedWork.thumbnail && (
                  <div className="aspect-video bg-gray-900 relative mb-4">
                    <Image
                      src={selectedWork.thumbnail}
                      alt={selectedWork.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                {selectedWork.description && (
                  <p className="text-gray-300 mb-4">{selectedWork.description}</p>
                )}
              </div>

              {/* WORK METRICS */}
              <div className="grid grid-cols-4 gap-4 mb-6 p-4 border border-gray-600">
                <div>
                  <div className="text-xs uppercase tracking-wider text-gray-400 mb-1">VIEWS</div>
                  <div className="text-xl font-bold">{selectedWork.metrics.views.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-gray-400 mb-1">SHARES</div>
                  <div className="text-xl font-bold">{selectedWork.metrics.shares.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-gray-400 mb-1">LIKES</div>
                  <div className="text-xl font-bold">{selectedWork.metrics.likes.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-gray-400 mb-1">REVENUE</div>
                  <div className="text-xl font-bold">${selectedWork.metrics.revenue}</div>
                </div>
              </div>

              {/* WORK TAGS */}
              <div>
                <div className="text-sm font-bold uppercase tracking-wider mb-3">TAGS</div>
                <div className="flex flex-wrap gap-2">
                  {selectedWork.tags.map(tag => (
                    <span 
                      key={tag}
                      className="px-3 py-1 text-xs uppercase tracking-wider border border-gray-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}