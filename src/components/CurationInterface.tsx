'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { 
  Search, 
  Filter, 
  Star, 
  Heart,
  Download,
  Share2,
  Grid3x3,
  List,
  Calendar,
  Tag,
  Eye,
  Archive,
  ArrowLeft
} from 'lucide-react';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';

interface ArchiveItem {
  id: string;
  title: string;
  image_url: string;
  thumbnail_url?: string;
  created_date: string;
  archive_number?: number;
  metadata?: {
    tags?: string[];
    analysis_date?: string;
    [key: string]: any;
  };
}

interface CurationInterfaceProps {
  agentId: string;
  title: string;
}

export function CurationInterface({ agentId, title }: CurationInterfaceProps) {
  const [works, setWorks] = useState<ArchiveItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'date' | 'number' | 'title'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedWorks, setSelectedWorks] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  
  const itemsPerPage = 24;
  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchWorks();
    fetchAvailableTags();
  }, [page, searchTerm, selectedTags, sortBy, sortOrder]);

  async function fetchWorks() {
    setLoading(true);
    
    let query = supabase
      .from('agent_archives')
      .select('*', { count: 'exact' })
      .eq('agent_id', agentId);

    // Apply search filter
    if (searchTerm) {
      query = query.or(`title.ilike.%${searchTerm}%`);
    }

    // Apply tag filters
    if (selectedTags.length > 0) {
      query = query.contains('metadata->tags', selectedTags);
    }

    // Apply sorting
    const orderColumn = sortBy === 'number' ? 'archive_number' : 
                        sortBy === 'date' ? 'created_date' : 'title';
    query = query.order(orderColumn, { ascending: sortOrder === 'asc' });

    // Pagination
    const start = (page - 1) * itemsPerPage;
    query = query.range(start, start + itemsPerPage - 1);

    const { data, count, error } = await query;

    if (error) {
      console.error('Error fetching works:', error);
    } else {
      console.log('Fetched works:', data?.length, 'Total:', count);
      if (data && data.length > 0) {
        console.log('Sample work:', data[0]);
      }
      setWorks(data || []);
      setTotalCount(count || 0);
    }

    setLoading(false);
  }

  async function fetchAvailableTags() {
    const { data } = await supabase
      .from('agent_archives')
      .select('metadata')
      .eq('agent_id', agentId)
      .not('metadata->tags', 'is', null);

    const tagSet = new Set<string>();
    data?.forEach(item => {
      item.metadata?.tags?.forEach((tag: string) => tagSet.add(tag));
    });

    setAvailableTags(Array.from(tagSet).sort());
  }

  const toggleWorkSelection = (workId: string) => {
    const newSelected = new Set(selectedWorks);
    if (newSelected.has(workId)) {
      newSelected.delete(workId);
    } else {
      newSelected.add(workId);
    }
    setSelectedWorks(newSelected);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
    setPage(1);
  };

  const exportSelection = () => {
    const selectedWorksList = works.filter(work => selectedWorks.has(work.id));
    const exportData = {
      collection_name: `${title} - Curated Selection`,
      selected_works: selectedWorksList.length,
      works: selectedWorksList.map(work => ({
        id: work.id,
        title: work.title,
        image_url: work.image_url,
        created_date: work.created_date,
        tags: work.metadata?.tags || []
      })),
      exported_at: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${agentId}-curated-selection-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return (
    <div className="min-h-screen bg-black text-white">
      <UnifiedHeader />
      
      {/* Back Navigation */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <Link 
            href="/academy"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Academy
          </Link>
        </div>
      </div>

      {/* Header */}
      <div className="border-b border-gray-900 bg-gray-950">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold">{title} - Curation Interface</h1>
              <p className="text-sm text-gray-500 mt-1">
                {totalCount} works • {selectedWorks.size} selected
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {selectedWorks.size > 0 && (
                <button
                  onClick={exportSelection}
                  className="px-4 py-2 bg-purple-600 text-white rounded flex items-center gap-2 hover:bg-purple-700"
                >
                  <Download className="w-4 h-4" />
                  Export Selection ({selectedWorks.size})
                </button>
              )}
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}
                >
                  <Grid3x3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Controls */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search titles..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-800 rounded focus:border-gray-600 focus:outline-none"
                />
              </div>
            </div>
            
            {/* Sort Controls */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 bg-gray-900 border border-gray-800 rounded text-sm focus:border-gray-600 focus:outline-none"
              >
                <option value="date">Date</option>
                <option value="number">Number</option>
                <option value="title">Title</option>
              </select>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as any)}
                className="px-3 py-2 bg-gray-900 border border-gray-800 rounded text-sm focus:border-gray-600 focus:outline-none"
              >
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
              </select>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-2 border rounded flex items-center gap-2 ${
                  showFilters ? 'bg-white text-black border-white' : 'bg-gray-900 border-gray-800 hover:border-gray-600'
                }`}
              >
                <Filter className="w-4 h-4" />
                Tags ({selectedTags.length})
              </button>
            </div>
          </div>
          
          {/* Tag Filters */}
          {showFilters && (
            <div className="mt-6 p-4 bg-gray-900 border border-gray-800 rounded">
              <div className="mb-3">
                <h3 className="text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Filter by Tags
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {availableTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1.5 text-sm rounded-full transition-all ${
                      selectedTags.includes(tag)
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
              {selectedTags.length > 0 && (
                <button
                  onClick={() => {
                    setSelectedTags([]);
                    setPage(1);
                  }}
                  className="mt-3 text-xs text-gray-500 hover:text-white"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Works Grid/List */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        ) : works.length === 0 ? (
          <div className="text-center py-12">
            <Archive className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500">No works found matching your criteria</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {works.map((work) => (
              <div key={work.id} className="group relative">
                <div 
                  className={`border overflow-hidden hover:border-gray-600 transition-all cursor-pointer ${
                    selectedWorks.has(work.id) ? 'border-purple-500 ring-2 ring-purple-500' : 'border-gray-900'
                  }`}
                  onClick={() => toggleWorkSelection(work.id)}
                >
                  <div className="aspect-square relative bg-gray-900">
                    {work.thumbnail_url || work.image_url ? (
                      <Image
                        src={work.thumbnail_url || work.image_url}
                        alt={work.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 16vw"
                        unoptimized
                        priority={false}
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                        <span className="text-gray-600">No image</span>
                      </div>
                    )}
                    {work.archive_number && (
                      <div className="absolute top-2 left-2 px-2 py-1 bg-black/80 text-xs">
                        #{work.archive_number}
                      </div>
                    )}
                    {selectedWorks.has(work.id) && (
                      <div className="absolute top-2 right-2 p-1 bg-purple-600 rounded-full">
                        <Star className="w-4 h-4 fill-white" />
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-gray-400 line-clamp-2">{work.title}</p>
                    {work.metadata?.tags && work.metadata.tags.length > 0 && (
                      <div className="flex gap-1 mt-2">
                        {work.metadata.tags.slice(0, 2).map(tag => (
                          <span key={tag} className="text-xs px-2 py-0.5 bg-gray-800 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {works.map((work) => (
              <div 
                key={work.id} 
                className={`flex gap-4 p-4 border hover:border-gray-700 transition-all cursor-pointer ${
                  selectedWorks.has(work.id) ? 'border-purple-500 bg-purple-900/10' : 'border-gray-900'
                }`}
                onClick={() => toggleWorkSelection(work.id)}
              >
                <div className="w-24 h-24 relative bg-gray-900 flex-shrink-0">
                  {work.thumbnail_url || work.image_url ? (
                    <Image
                      src={work.thumbnail_url || work.image_url}
                      alt={work.title}
                      fill
                      className="object-cover"
                      unoptimized
                      priority={false}
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                      <span className="text-gray-600 text-xs">No image</span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium line-clamp-1">{work.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{work.created_date}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {work.archive_number && (
                        <span className="text-sm text-gray-600">#{work.archive_number}</span>
                      )}
                      {selectedWorks.has(work.id) && (
                        <Star className="w-5 h-5 text-purple-400 fill-current" />
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-600">
                    {work.metadata?.tags && work.metadata.tags.length > 0 && (
                      <div className="flex gap-1">
                        {work.metadata.tags.map(tag => (
                          <span key={tag} className="px-2 py-0.5 bg-gray-800 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="max-w-7xl mx-auto px-6 py-8 border-t border-gray-900">
          <div className="flex justify-center items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-900 border border-gray-800 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-600"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-sm text-gray-500">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-gray-900 border border-gray-800 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-600"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}