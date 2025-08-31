'use client';

import { useState, useEffect } from 'react';
import { Loader2, Search, Filter, Grid, List, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';

interface AbrahamWork {
  id: string;
  agent_id: string;
  archive_type: string;
  title: string;
  image_url: string;
  archive_url: string;
  created_date: string;
  archive_number: number;
  description: string;
  metadata?: any;
}

interface WorksResponse {
  works: AbrahamWork[];
  total: number;
  limit: number;
  offset: number;
  filters: { period: string };
  sort: string;
  source: string;
}

export default function AbrahamEarlyWorksPage() {
  const [works, setWorks] = useState<AbrahamWork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('date_desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  
  const PAGE_SIZE = 24; // Good balance for grid layout

  const fetchWorks = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const offset = (page - 1) * PAGE_SIZE;
      const url = `/api/agents/abraham/works?period=early-works&limit=${PAGE_SIZE}&offset=${offset}&sort=${sortBy}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: WorksResponse = await response.json();
      setWorks(data.works);
      setTotal(data.total);
    } catch (err) {
      console.error('Failed to fetch Abraham works:', err);
      setError(err instanceof Error ? err.message : 'Failed to load works');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorks();
  }, [page, sortBy]);

  const filteredWorks = works.filter(work => 
    work.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    work.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="min-h-screen bg-black text-white">
      <UnifiedHeader />
      
      {/* Back Navigation */}
      <div className="border-b border-white">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <Link 
            href="/agents/abraham" 
            className="inline-flex items-center gap-2 text-sm hover:bg-white hover:text-black px-3 py-2 transition-colors font-bold uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4" />
            BACK TO ABRAHAM
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            ABRAHAM EARLY WORKS
          </h1>
          <p className="text-gray-300 text-lg">
            Complete archive of {total.toLocaleString()} community-generated works from Summer 2021
          </p>
          <p className="text-gray-400 text-sm mt-2">
            These pieces represent the collective intelligence synthesis that preceded Abraham's covenant journey.
          </p>
        </div>

        {/* Controls */}
        <div className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search works..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:border-white focus:outline-none"
            />
          </div>

          {/* Controls row */}
          <div className="flex items-center gap-4">
            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 focus:border-white focus:outline-none"
            >
              <option value="date_desc">Newest First</option>
              <option value="date_asc">Oldest First</option>
              <option value="number_desc">Archive Number (High-Low)</option>
              <option value="number_asc">Archive Number (Low-High)</option>
              <option value="title_asc">Title (A-Z)</option>
            </select>

            {/* View Mode */}
            <div className="flex border border-gray-700 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-white text-black' : 'bg-gray-900 text-white'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-white text-black' : 'bg-gray-900 text-white'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span className="ml-2">Loading early works...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-400 mb-4">Failed to load works: {error}</p>
            <button
              onClick={fetchWorks}
              className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Works Grid */}
        {!loading && !error && (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {filteredWorks.map((work) => (
                  <div key={work.id} className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 hover:border-gray-600 transition-colors">
                    <div className="aspect-square bg-gray-800 relative">
                      {work.image_url ? (
                        <img
                          src={work.image_url}
                          alt={work.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                          <span>No Image</span>
                        </div>
                      )}
                      {work.archive_number && (
                        <div className="absolute top-2 right-2 bg-black bg-opacity-75 px-2 py-1 rounded text-xs">
                          #{work.archive_number}
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-sm mb-2 line-clamp-2">
                        {work.title}
                      </h3>
                      <p className="text-gray-400 text-xs mb-2 line-clamp-2">
                        {work.description}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {new Date(work.created_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4 mb-8">
                {filteredWorks.map((work) => (
                  <div key={work.id} className="bg-gray-900 rounded-lg p-6 border border-gray-800 hover:border-gray-600 transition-colors flex gap-4">
                    <div className="w-20 h-20 bg-gray-800 rounded flex-shrink-0">
                      {work.image_url ? (
                        <img
                          src={work.image_url}
                          alt={work.title}
                          className="w-full h-full object-cover rounded"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">
                          No Image
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold">{work.title}</h3>
                        {work.archive_number && (
                          <span className="text-xs bg-gray-800 px-2 py-1 rounded">
                            #{work.archive_number}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-400 text-sm mb-2">
                        {work.description}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {new Date(work.created_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-500 transition-colors"
                >
                  Previous
                </button>
                
                <div className="flex space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = Math.max(1, Math.min(totalPages - 4, page - 2)) + i;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`px-3 py-2 border rounded-lg transition-colors ${
                          page === pageNum
                            ? 'bg-white text-black border-white'
                            : 'bg-gray-900 text-white border-gray-700 hover:border-gray-500'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                  className="px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-500 transition-colors"
                >
                  Next
                </button>
              </div>
            )}

            {/* Stats */}
            <div className="text-center text-gray-400 text-sm mt-8">
              Showing {filteredWorks.length} of {total.toLocaleString()} early works
              {searchTerm && ` (filtered by "${searchTerm}")`}
            </div>
          </>
        )}
      </div>
    </div>
  );
}