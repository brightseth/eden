'use client';

import { useState, useEffect } from 'react';
import { ExternalLink, Filter, Calendar, Heart, Image as ImageIcon, Video, Clock, Loader2 } from 'lucide-react';

// Image component with progressive loading
function ImageWithLoader({ 
  src, 
  alt, 
  thumbnailUrl, 
  blurhash 
}: { 
  src: string; 
  alt: string; 
  thumbnailUrl?: string;
  blurhash?: string;
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(thumbnailUrl || src);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    // If we have a thumbnail, load it first
    if (thumbnailUrl && thumbnailUrl !== src) {
      const img = new Image();
      img.src = thumbnailUrl;
      img.onload = () => {
        setCurrentSrc(thumbnailUrl);
        // Then load the full image
        const fullImg = new Image();
        fullImg.src = src;
        fullImg.onload = () => {
          setTimeout(() => {
            setCurrentSrc(src);
            setLoading(false);
            setImageLoaded(true);
          }, 100); // Small delay to prevent jarring transition
        };
        fullImg.onerror = () => {
          setLoading(false);
          setError(true);
        };
      };
      img.onerror = () => {
        // If thumbnail fails, try main image
        const mainImg = new Image();
        mainImg.src = src;
        mainImg.onload = () => {
          setCurrentSrc(src);
          setLoading(false);
          setImageLoaded(true);
        };
        mainImg.onerror = () => {
          setLoading(false);
          setError(true);
        };
      };
    } else {
      // No thumbnail, load main image directly
      const img = new Image();
      img.src = src;
      img.onload = () => {
        setTimeout(() => {
          setLoading(false);
          setImageLoaded(true);
        }, 100);
      };
      img.onerror = () => {
        setLoading(false);
        setError(true);
      };
    }
  }, [src, thumbnailUrl]);

  if (error) {
    return (
      <div className="w-full h-64 bg-gray-800 flex flex-col items-center justify-center mb-4">
        <ImageIcon className="w-8 h-8 text-gray-600 mb-2" />
        <span className="text-gray-500 text-sm">Failed to load image</span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-64 mb-4 bg-gray-800 overflow-hidden">
      {/* Loading spinner overlay */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800/50 z-10">
          <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
        </div>
      )}
      
      {/* Blurhash or gradient placeholder */}
      {!imageLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 animate-pulse" />
      )}
      
      {/* Actual image */}
      <img
        src={currentSrc}
        alt={alt}
        className={`w-full h-full object-cover transition-all duration-500 ${
          loading ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
        } ${currentSrc === thumbnailUrl && src !== thumbnailUrl ? 'filter blur-sm' : ''}`}
        style={{
          transform: loading ? 'scale(1.05)' : 'scale(1)',
        }}
      />
    </div>
  );
}

export default function SolienneEdenPage() {
  const [creations, setCreations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [total, setTotal] = useState(0);
  
  // Filter states
  const [mediaType, setMediaType] = useState<'all' | 'image' | 'video'>('all');
  const [sortBy, setSortBy] = useState<'date_desc' | 'date_asc' | 'likes_desc' | 'likes_asc'>('date_desc');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 12;

  useEffect(() => {
    fetchEdenCreations();
  }, [mediaType, sortBy, dateFrom, dateTo, page]);

  const fetchEdenCreations = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
        mediaType,
        sortBy,
        ...(dateFrom && { dateFrom }),
        ...(dateTo && { dateTo })
      });
      
      const response = await fetch(`/api/agents/solienne/eden-creations?${params}`);
      const data = await response.json();
      console.log('Eden API Response:', data);
      setCreations(data.creations || []);
      setProfile(data.profile || {});
      setTotal(data.total || 0);
    } catch (error) {
      console.error('Failed to fetch Eden creations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setMediaType('all');
    setSortBy('date_desc');
    setDateFrom('');
    setDateTo('');
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold uppercase mb-2">SOLIENNE on EDEN.ART</h1>
        <p className="text-gray-400 mb-8">Direct access to SOLIENNE's Eden creations</p>

        <div className="bg-gray-900 border border-gray-700 p-6 rounded mb-8">
          <h2 className="text-xl font-bold mb-4">Eden Profile Status</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-xs text-gray-400">Username</div>
              <div className="font-bold">{profile?.username || 'solienne'}</div>
            </div>
            <div>
              <div className="text-xs text-gray-400">User ID</div>
              <div className="font-mono text-sm">{profile?.id || '67f8af96f2cc4291ee840cc5'}</div>
            </div>
            <div>
              <div className="text-xs text-gray-400">Total Creations</div>
              <div className="font-bold text-2xl">{total.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-xs text-gray-400">Showing</div>
              <div className="font-bold">{creations.length} of {total.toLocaleString()}</div>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="bg-gray-900 border border-gray-700 p-6 rounded mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5" />
            <h2 className="text-xl font-bold">Filters & Sorting</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Media Type Filter */}
            <div>
              <label className="text-sm text-gray-400 block mb-2">Media Type</label>
              <select 
                value={mediaType} 
                onChange={(e) => setMediaType(e.target.value as any)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2"
              >
                <option value="all">All Media</option>
                <option value="image">Images Only</option>
                <option value="video">Videos Only</option>
              </select>
            </div>

            {/* Sort Options */}
            <div>
              <label className="text-sm text-gray-400 block mb-2">Sort By</label>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2"
              >
                <option value="date_desc">Newest First</option>
                <option value="date_asc">Oldest First</option>
                <option value="likes_desc">Most Liked</option>
                <option value="likes_asc">Least Liked</option>
              </select>
            </div>

            {/* Date From */}
            <div>
              <label className="text-sm text-gray-400 block mb-2">From Date</label>
              <input 
                type="date" 
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2"
              />
            </div>

            {/* Date To */}
            <div>
              <label className="text-sm text-gray-400 block mb-2">To Date</label>
              <input 
                type="date" 
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2"
              />
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 transition-colors rounded"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Available Filter Parameters Info */}
        <div className="bg-blue-900/20 border border-blue-600 p-4 mb-8">
          <h3 className="font-bold mb-2">Available Filter Parameters</h3>
          <div className="text-sm space-y-1 text-gray-300">
            <p><strong>Media Type:</strong> Filter by images or videos only</p>
            <p><strong>Sort Options:</strong> Date (newest/oldest), Likes (most/least)</p>
            <p><strong>Date Range:</strong> Filter creations by creation date</p>
            <p><strong>Additional fields available:</strong> tool (generation tool used), public/private status, dimensions (width/height/aspect ratio)</p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-xl">Loading Eden creations...</p>
          </div>
        ) : creations.length === 0 ? (
          <div className="bg-gray-900 border-2 border-dashed border-gray-700 p-12 text-center">
            <h3 className="text-2xl font-bold mb-4">No Creations Found</h3>
            <p className="text-gray-400 mb-6">
              No creations match your current filters. Try adjusting the filters above.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {creations.map((creation) => (
                <div key={creation.id} className="border border-gray-700 bg-gray-900 p-4">
                  <div className="relative">
                    {creation.image_url || creation.archive_url ? (
                      <ImageWithLoader
                        src={creation.image_url || creation.archive_url}
                        alt={creation.title || 'Eden Creation'}
                        thumbnailUrl={creation.metadata?.thumbnailUri || creation.thumbnailUri}
                        blurhash={creation.metadata?.blurhash || creation.blurhash}
                      />
                    ) : (
                      <div className="w-full h-64 bg-gray-800 flex items-center justify-center mb-4">
                        <span className="text-gray-500">No preview</span>
                      </div>
                    )}
                    {creation.metadata?.mediaType === 'video' && (
                      <Video className="absolute top-2 right-2 w-6 h-6 text-white bg-black/50 p-1 rounded" />
                    )}
                  </div>
                  <h3 className="font-bold mb-2 line-clamp-2">{creation.title || 'Untitled'}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(creation.created_date).toLocaleDateString()}
                    </div>
                    {creation.metadata?.likeCount !== undefined && (
                      <div className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        {creation.metadata.likeCount}
                      </div>
                    )}
                  </div>
                  <a
                    href={`https://app.eden.art/creations/${creation.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-1"
                  >
                    View on Eden
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex justify-center gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded"
              >
                Previous
              </button>
              <span className="px-4 py-2 bg-gray-800 rounded">
                Page {page} of {Math.ceil(total / pageSize)}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page * pageSize >= total}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}