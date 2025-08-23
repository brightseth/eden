'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { 
  Search, 
  Filter, 
  SortAsc, 
  SortDesc, 
  Grid3x3, 
  List,
  Calendar,
  Hash,
  Image as ImageIcon,
  Tag,
  ArrowLeft
} from 'lucide-react';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';

interface ArchiveItem {
  id: string;
  agent_id: string;
  archive_type: string;
  title: string;
  description?: string;
  image_url: string;
  thumbnail_url?: string;
  created_date: string;
  archive_number?: number;
  tags?: string[];
  metadata?: any;
  trainer_id?: string;
}

interface EnhancedArchiveBrowserProps {
  agentId: string;
  archiveType: string;
  archiveName: string;
}

// Common tags for Solienne's work
const SOLIENNE_TAGS = [
  'portrait',
  'landscape',
  'abstract',
  'architectural',
  'figure',
  'nature',
  'geometric',
  'light',
  'shadow',
  'motion',
  'stillness',
  'minimal',
  'complex',
  'monochrome',
  'colorful'
];

export function EnhancedArchiveBrowser({ 
  agentId, 
  archiveType, 
  archiveName
}: EnhancedArchiveBrowserProps) {
  const [archives, setArchives] = useState<ArchiveItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'number' | 'date' | 'title'>('number');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  
  const itemsPerPage = 24;
  const supabase = createClientComponentClient();
  
  useEffect(() => {
    fetchArchives();
    if (agentId === 'solienne') {
      fetchAvailableTags();
    }
  }, [page, searchTerm, sortBy, sortOrder]); // Removed selectedTags until column is added
  
  async function fetchAvailableTags() {
    // Get unique tags from metadata
    const { data } = await supabase
      .from('agent_archives')
      .select('metadata')
      .eq('agent_id', agentId)
      .not('metadata->tags', 'is', null);
      
    const tagSet = new Set<string>();
    data?.forEach(item => {
      if (item.metadata?.tags && Array.isArray(item.metadata.tags)) {
        item.metadata.tags.forEach((tag: string) => {
          if (typeof tag === 'string') {
            tagSet.add(tag);
          }
        });
      }
    });
    
    const sortedTags = Array.from(tagSet).sort();
    // Use predefined tags if no tags found in metadata
    setAvailableTags(sortedTags.length > 0 ? sortedTags : SOLIENNE_TAGS);
  }
  
  async function fetchArchives() {
    setLoading(true);
    
    let query = supabase
      .from('agent_archives')
      .select('*', { count: 'exact' })
      .eq('agent_id', agentId)
      .eq('archive_type', archiveType);
    
    // Apply search filter
    if (searchTerm) {
      query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
    }
    
    // Apply tag filters using metadata->tags
    if (selectedTags.length > 0) {
      // Filter by tags in metadata
      selectedTags.forEach(tag => {
        query = query.contains('metadata->>tags', [tag]);
      });
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
      console.error('Error fetching archives:', error);
    } else {
      setArchives(data || []);
      setTotalCount(count || 0);
    }
    
    setLoading(false);
  }
  
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  
  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <UnifiedHeader />
      
      {/* Back Navigation */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <Link 
            href={`/academy/agent/${agentId}`}
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to {agentId.charAt(0).toUpperCase() + agentId.slice(1)} Profile
          </Link>
        </div>
      </div>

      {/* Header */}
      <div className="border-b border-gray-900">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold">{archiveName}</h1>
              <p className="text-sm text-gray-500 mt-1">{totalCount} works</p>
            </div>
            
            {/* View Toggle */}
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
          
          {/* Search and Controls */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search by title..."
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
              <span className="text-xs text-gray-500">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 bg-gray-900 border border-gray-800 rounded text-sm focus:border-gray-600 focus:outline-none"
              >
                <option value="number">Number</option>
                <option value="date">Date</option>
                <option value="title">Title</option>
              </select>
              <button
                onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                className="p-2 bg-gray-900 border border-gray-800 rounded hover:border-gray-600"
              >
                {sortOrder === 'asc' ? <SortAsc className="w-5 h-5" /> : <SortDesc className="w-5 h-5" />}
              </button>
              
              {/* Filter Toggle (for Solienne) */}
              {agentId === 'solienne' && (
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`px-4 py-2 border rounded flex items-center gap-2 ${
                    showFilters ? 'bg-white text-black border-white' : 'bg-gray-900 border-gray-800 hover:border-gray-600'
                  }`}
                >
                  <Filter className="w-4 h-4" />
                  Filters
                  {selectedTags.length > 0 && (
                    <span className="px-2 py-0.5 bg-purple-600 text-white text-xs rounded-full">
                      {selectedTags.length}
                    </span>
                  )}
                </button>
              )}
            </div>
          </div>
          
          {/* Tag Filters (Solienne only) */}
          {agentId === 'solienne' && showFilters && (
            <div className="mt-6 p-4 bg-gray-900 border border-gray-800 rounded">
              <div className="mb-3">
                <h3 className="text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Filter by Subject
                </h3>
                <p className="text-xs text-gray-600 mb-4">
                  Select tags to filter the collection. Works must match all selected tags.
                </p>
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
      
      {/* Archive Grid/List */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        ) : archives.length === 0 ? (
          <div className="text-center py-12">
            <ImageIcon className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500">No works found matching your criteria</p>
            {(searchTerm || selectedTags.length > 0) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedTags([]);
                  setPage(1);
                }}
                className="mt-4 text-sm text-purple-400 hover:text-purple-300"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {archives.map((item) => (
              <Link
                key={item.id}
                href={`/academy/agent/${agentId}/${archiveType}s/${item.archive_number || item.id}`}
                className="group"
              >
                <div className="border border-gray-900 overflow-hidden hover:border-gray-700 transition-all">
                  <div className="aspect-square relative bg-gray-900">
                    <Image
                      src={item.thumbnail_url || item.image_url}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 16vw"
                      unoptimized
                      priority={false}
                      loading="lazy"
                    />
                    {item.archive_number && (
                      <div className="absolute top-2 left-2 px-2 py-1 bg-black/80 text-xs">
                        #{item.archive_number}
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-gray-400 line-clamp-2">{item.title}</p>
                    {item.metadata?.tags && item.metadata.tags.length > 0 && (
                      <div className="flex gap-1 mt-2">
                        {item.metadata.tags.slice(0, 2).map(tag => (
                          <span key={tag} className="text-xs px-2 py-0.5 bg-gray-800 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {archives.map((item) => (
              <Link
                key={item.id}
                href={`/academy/agent/${agentId}/${archiveType}s/${item.archive_number || item.id}`}
              >
                <div className="flex gap-4 p-4 border border-gray-900 hover:border-gray-700 transition-all">
                  <div className="w-24 h-24 relative bg-gray-900 flex-shrink-0">
                    <Image
                      src={item.thumbnail_url || item.image_url}
                      alt={item.title}
                      fill
                      className="object-cover"
                      unoptimized
                      priority={false}
                      loading="lazy"
                      onError={(e) => {
                        // Fallback to direct image URL if thumbnail fails
                        if (item.thumbnail_url && e.currentTarget.src === item.thumbnail_url) {
                          e.currentTarget.src = item.image_url;
                        }
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium line-clamp-1">{item.title}</h3>
                        {item.description && (
                          <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                            {item.description}
                          </p>
                        )}
                      </div>
                      {item.archive_number && (
                        <span className="text-sm text-gray-600">#{item.archive_number}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {item.created_date}
                      </span>
                      {item.metadata?.tags && item.metadata.tags.length > 0 && (
                        <div className="flex gap-1">
                          {item.metadata.tags.map(tag => (
                            <span key={tag} className="px-2 py-0.5 bg-gray-800 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
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
            <div className="flex items-center gap-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = page <= 3 ? i + 1 : page + i - 2;
                if (pageNum > totalPages) return null;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`w-10 h-10 rounded ${
                      page === pageNum 
                        ? 'bg-white text-black' 
                        : 'bg-gray-900 border border-gray-800 hover:border-gray-600'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-gray-900 border border-gray-800 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-600"
            >
              Next
            </button>
          </div>
          <div className="text-center mt-4 text-sm text-gray-500">
            Page {page} of {totalPages} • {totalCount} total works
          </div>
        </div>
      )}
    </div>
  );
}