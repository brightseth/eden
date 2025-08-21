'use client';

import { useState, useEffect, useCallback } from 'react';
import { Upload, X, Filter, Grid, List, Plus, Check, AlertCircle, Clock } from 'lucide-react';
import Image from 'next/image';
import { Asset, AssetState, CurationVerdict } from '@/types/content';

interface PortfolioTabProps {
  agentId: string;
  agentName: string;
}

export function PortfolioTab({ agentId, agentName }: PortfolioTabProps) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [filterState, setFilterState] = useState<AssetState | 'ALL'>('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedAssets, setSelectedAssets] = useState<Set<string>>(new Set());

  // Fetch assets on mount
  useEffect(() => {
    fetchAssets();
    // Poll for curation updates
    const interval = setInterval(fetchAssets, 5000);
    return () => clearInterval(interval);
  }, [agentId, filterState]);

  const fetchAssets = async () => {
    try {
      const params = new URLSearchParams();
      if (filterState !== 'ALL') params.set('state', filterState);
      
      const response = await fetch(`/api/agents/${agentId.toLowerCase()}/assets?${params}`);
      const data = await response.json();
      setAssets(data.assets || []);
    } catch (error) {
      console.error('Failed to fetch assets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(f => 
      f.type.startsWith('image/') || f.type.startsWith('video/')
    );
    setSelectedFiles(prev => [...prev, ...files]);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...files]);
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;
    
    setUploading(true);
    try {
      // Convert files to base64 URLs for mock implementation
      const urls = await Promise.all(selectedFiles.map(file => {
        return new Promise<{ url: string; type: string }>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve({ 
              url: reader.result as string,
              type: file.type
            });
          };
          reader.readAsDataURL(file);
        });
      }));

      const response = await fetch(`/api/agents/${agentId.toLowerCase()}/assets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          urls,
          tags: [`uploaded_${new Date().toISOString().split('T')[0]}`]
        })
      });

      if (response.ok) {
        setUploadModalOpen(false);
        setSelectedFiles([]);
        fetchAssets();
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const getVerdictBadge = (verdict?: CurationVerdict) => {
    if (!verdict) return null;
    
    const badges = {
      INCLUDE: { icon: Check, color: 'text-green-400 border-green-400', label: 'INCLUDE' },
      MAYBE: { icon: AlertCircle, color: 'text-yellow-400 border-yellow-400', label: 'MAYBE' },
      EXCLUDE: { icon: X, color: 'text-red-400 border-red-400', label: 'EXCLUDE' }
    };
    
    const badge = badges[verdict];
    const Icon = badge.icon;
    
    return (
      <div className={`inline-flex items-center gap-1 px-2 py-1 border rounded text-xs font-bold ${badge.color}`}>
        <Icon className="w-3 h-3" />
        {badge.label}
      </div>
    );
  };

  const getStateBadge = (state: AssetState) => {
    const colors = {
      DRAFT: 'bg-gray-600',
      CREATED: 'bg-blue-600',
      CURATED: 'bg-purple-600',
      PUBLISHED: 'bg-green-600',
      ARCHIVED: 'bg-gray-700'
    };
    
    return (
      <span className={`px-2 py-1 rounded text-xs font-bold text-white ${colors[state]}`}>
        {state}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold">Portfolio</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">{assets.length} items</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Filter by State */}
          <select
            value={filterState}
            onChange={(e) => setFilterState(e.target.value as AssetState | 'ALL')}
            className="px-3 py-1.5 bg-gray-900 border border-gray-700 rounded text-sm"
          >
            <option value="ALL">All States</option>
            <option value="CREATED">Created</option>
            <option value="CURATED">Curated</option>
            <option value="PUBLISHED">Published</option>
            <option value="ARCHIVED">Archived</option>
          </select>
          
          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-gray-900 rounded p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-gray-700' : ''}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-gray-700' : ''}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
          
          {/* Upload Button */}
          <button
            onClick={() => setUploadModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded hover:from-purple-700 hover:to-pink-700 transition-all"
          >
            <Upload className="w-4 h-4" />
            Upload
          </button>
        </div>
      </div>

      {/* Assets Grid/List */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading portfolio...</div>
      ) : assets.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-700 rounded-lg">
          <Upload className="w-12 h-12 mx-auto mb-4 text-gray-600" />
          <p className="text-gray-400 mb-4">No assets uploaded yet</p>
          <button
            onClick={() => setUploadModalOpen(true)}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded transition-colors"
          >
            Upload First Asset
          </button>
        </div>
      ) : (
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4' 
          : 'space-y-4'
        }>
          {assets.map((asset) => (
            <div 
              key={asset.id}
              className={`border border-gray-800 bg-gray-950 overflow-hidden rounded-lg hover:border-gray-600 transition-all ${
                selectedAssets.has(asset.id) ? 'ring-2 ring-purple-500' : ''
              }`}
            >
              {/* Thumbnail */}
              <div className="relative aspect-square bg-gray-900">
                {asset.kind === 'image' && asset.media.url ? (
                  <img
                    src={asset.media.url}
                    alt={asset.title || 'Untitled'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <span className="text-4xl text-gray-700">
                      {asset.kind === 'video' ? '🎬' : '🖼️'}
                    </span>
                  </div>
                )}
                
                {/* Overlay Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-2">
                  {getStateBadge(asset.state)}
                  {asset.state === 'CURATED' && (
                    asset.curation?.verdict ? (
                      getVerdictBadge(asset.curation.verdict)
                    ) : (
                      <div className="inline-flex items-center gap-1 px-2 py-1 bg-gray-800 rounded text-xs">
                        <Clock className="w-3 h-3" />
                        Curating...
                      </div>
                    )
                  )}
                </div>
                
                {/* Selection Checkbox */}
                <div className="absolute top-2 right-2">
                  <input
                    type="checkbox"
                    checked={selectedAssets.has(asset.id)}
                    onChange={(e) => {
                      const newSelected = new Set(selectedAssets);
                      if (e.target.checked) {
                        newSelected.add(asset.id);
                      } else {
                        newSelected.delete(asset.id);
                      }
                      setSelectedAssets(newSelected);
                    }}
                    className="w-4 h-4 rounded border-gray-600 bg-gray-800"
                  />
                </div>
              </div>
              
              {/* Details */}
              <div className="p-3">
                <h3 className="font-bold text-sm mb-1 truncate">
                  {asset.title || 'Untitled'}
                </h3>
                <p className="text-xs text-gray-400 truncate">
                  {new Date(asset.created_at).toLocaleDateString()}
                </p>
                {asset.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {asset.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="text-xs px-2 py-0.5 bg-gray-800 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-700 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-6 flex items-center justify-between">
              <h2 className="text-xl font-bold">Upload Assets</h2>
              <button
                onClick={() => {
                  setUploadModalOpen(false);
                  setSelectedFiles([]);
                }}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Drop Zone */}
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-gray-500 transition-colors"
              >
                <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-300 mb-2">Drag & drop files here</p>
                <p className="text-sm text-gray-500 mb-4">or</p>
                <label className="cursor-pointer">
                  <span className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded transition-colors inline-block">
                    Browse Files
                  </span>
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-gray-500 mt-4">
                  Supports: JPG, PNG, GIF, MP4, MOV (Max 50 files)
                </p>
              </div>

              {/* Selected Files Preview */}
              {selectedFiles.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-bold mb-3">
                    Selected Files ({selectedFiles.length})
                  </h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {selectedFiles.map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-gray-800 rounded">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">
                            {file.type.startsWith('video') ? '🎬' : '🖼️'}
                          </span>
                          <div>
                            <p className="text-sm font-medium truncate max-w-xs">
                              {file.name}
                            </p>
                            <p className="text-xs text-gray-400">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedFiles(prev => prev.filter((_, i) => i !== idx));
                          }}
                          className="p-1 hover:bg-gray-700 rounded"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload Button */}
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => {
                    setUploadModalOpen(false);
                    setSelectedFiles([]);
                  }}
                  className="px-4 py-2 border border-gray-600 hover:border-gray-500 rounded transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  disabled={selectedFiles.length === 0 || uploading}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? 'Uploading...' : `Upload ${selectedFiles.length} File${selectedFiles.length !== 1 ? 's' : ''}`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Actions Bar */}
      {selectedAssets.size > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-gray-900 border border-gray-700 rounded-lg p-4 flex items-center gap-4 shadow-xl">
          <span className="text-sm text-gray-400">
            {selectedAssets.size} selected
          </span>
          <button className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded text-sm transition-colors">
            Add to Collection
          </button>
          <button className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded text-sm transition-colors">
            Publish
          </button>
          <button className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded text-sm transition-colors">
            Archive
          </button>
          <button
            onClick={() => setSelectedAssets(new Set())}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}