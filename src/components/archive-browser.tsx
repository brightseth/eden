'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Calendar, Search, Grid, List } from 'lucide-react';
import { format } from 'date-fns';

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
  curated_for?: string[];
  metadata?: any;
}

interface ArchiveBrowserProps {
  agentId: string;
  archiveType: string;
  archiveName: string;
  showCuration?: boolean;
  curationTag?: string;
  enableSearch?: boolean;
  enableFilters?: boolean;
}

export function ArchiveBrowser({ 
  agentId, 
  archiveType, 
  archiveName,
  showCuration = false,
  curationTag,
  enableSearch = true,
  enableFilters = false
}: ArchiveBrowserProps) {
  const [archives, setArchives] = useState<ArchiveItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [dateRange, setDateRange] = useState<{ start?: string; end?: string }>({});
  const [models, setModels] = useState<{ name: string; count: number }[]>([]);
  const itemsPerPage = 24;
  
  const supabase = createClientComponentClient();
  
  useEffect(() => {
    fetchArchives();
  }, [page, searchTerm, curationTag]);
  
  async function fetchArchives() {
    setLoading(true);
    
    let query = supabase
      .from('agent_archives')
      .select('*', { count: 'exact' })
      .eq('agent_id', agentId)
      .eq('archive_type', archiveType);
    
    // Apply curation filter if specified
    if (curationTag) {
      query = query.contains('curated_for', [curationTag]);
    }
    
    // Apply search filter
    if (searchTerm) {
      query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
    }
    
    // Pagination
    const start = (page - 1) * itemsPerPage;
    query = query
      .order('created_date', { ascending: false })
      .range(start, start + itemsPerPage - 1);
    
    const { data, error, count } = await query;
    
    if (error) {
      console.error('Error fetching archives:', error);
    } else {
      setArchives(data || []);
      setTotalCount(count || 0);
    }
    
    setLoading(false);
  }
  
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">{archiveName}</h1>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Search and filters */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={`Search ${archiveName.toLowerCase()}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          {showCuration && (
            <Badge variant="secondary" className="px-4 py-2">
              {curationTag ? `Curated: ${curationTag.replace('_', ' ')}` : 'All Items'}
            </Badge>
          )}
        </div>
        
        <p className="text-muted-foreground">
          {totalCount} {archiveType}s • Page {page} of {totalPages}
        </p>
      </div>
      
      {/* Archive Grid/List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : archives.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No {archiveType}s found</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {archives.map((item) => (
            <Link
              key={item.id}
              href={`/academy/${agentId}/${archiveType}s/${item.archive_number || item.id}`}
            >
              <Card className="group cursor-pointer overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-square relative bg-muted">
                  <Image
                    src={item.thumbnail_url || item.image_url}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                  {item.curated_for && item.curated_for.length > 0 && (
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary" className="text-xs">
                        Curated
                      </Badge>
                    </div>
                  )}
                </div>
                <div className="p-3 space-y-1">
                  <p className="font-medium text-sm line-clamp-1">{item.title}</p>
                  {item.archive_number && (
                    <p className="text-xs text-muted-foreground">#{item.archive_number}</p>
                  )}
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(item.created_date), 'MMM d, yyyy')}
                  </p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {archives.map((item) => (
            <Link
              key={item.id}
              href={`/academy/${agentId}/${archiveType}s/${item.archive_number || item.id}`}
            >
              <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex gap-4">
                  <div className="w-24 h-24 relative bg-muted rounded overflow-hidden flex-shrink-0">
                    <Image
                      src={item.thumbnail_url || item.image_url}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium">{item.title}</h3>
                        {item.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                            {item.description}
                          </p>
                        )}
                      </div>
                      {item.archive_number && (
                        <Badge variant="outline">#{item.archive_number}</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(item.created_date), 'MMM d, yyyy')}
                      </span>
                      {item.curated_for && item.curated_for.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag.replace('_', ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <div className="flex items-center gap-2">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = page <= 3 ? i + 1 : page + i - 2;
              if (pageNum > totalPages) return null;
              return (
                <Button
                  key={pageNum}
                  variant={pageNum === page ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPage(pageNum)}
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>
          <Button
            variant="outline"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}