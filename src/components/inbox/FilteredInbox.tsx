'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  Filter, Calendar, Sparkles, AlertTriangle, 
  CheckCircle, XCircle, Send, ChevronDown,
  Printer, ImageIcon, Tag
} from 'lucide-react';

interface InboxWork {
  id: string;
  agent_id: string;
  day: number;
  media_url: string;
  filename?: string;
  state: string;
  captured_at?: string;
  created_at: string;
  tags?: {
    taxonomy?: {
      type?: string;
      series?: string;
      subject?: string[];
    };
    quality?: {
      print_readiness?: number;
      artifact_risk?: string;
    };
    routing?: {
      send_to_curator?: boolean;
    };
  };
  critiques?: any[];
}

interface FilterOptions {
  types: string[];
  series: string[];
  subjects: string[];
}

export function FilteredInbox() {
  const [works, setWorks] = useState<InboxWork[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    types: [],
    series: [],
    subjects: []
  });
  const [loading, setLoading] = useState(true);
  const [selectedWorks, setSelectedWorks] = useState<Set<string>>(new Set());
  
  // Filters
  const [filters, setFilters] = useState({
    agent_id: '',
    type: '',
    series: '',
    subject: '',
    min_print: 0,
    artifact_risk: '',
    date_from: '',
    date_to: '',
    state: 'created'
  });

  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchInbox();
  }, [filters]);

  const fetchInbox = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value.toString());
      });
      
      const res = await fetch(`/api/inbox?${params}`);
      const data = await res.json();
      
      setWorks(data.works || []);
      setFilterOptions(data.filters || { types: [], series: [], subjects: [] });
    } catch (error) {
      console.error('Error fetching inbox:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkCritique = async () => {
    if (selectedWorks.size === 0) return;
    
    // Send selected works to Nina for critique
    for (const workId of selectedWorks) {
      await fetch('/api/nina-critique', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ work_id: workId })
      });
    }
    
    // Refresh
    setSelectedWorks(new Set());
    fetchInbox();
  };

  const handleBulkPublish = async () => {
    if (selectedWorks.size === 0) return;
    
    // Publish selected works
    for (const workId of selectedWorks) {
      await fetch(`/api/works/${workId}/publish`, {
        method: 'POST'
      });
    }
    
    // Refresh
    setSelectedWorks(new Set());
    fetchInbox();
  };

  const toggleWorkSelection = (workId: string) => {
    const newSelection = new Set(selectedWorks);
    if (newSelection.has(workId)) {
      newSelection.delete(workId);
    } else {
      newSelection.add(workId);
    }
    setSelectedWorks(newSelection);
  };

  const getArtifactColor = (risk?: string) => {
    switch (risk) {
      case 'low': return 'text-green-400 border-green-400';
      case 'medium': return 'text-yellow-400 border-yellow-400';
      case 'high': return 'text-red-400 border-red-400';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-gray-800 sticky top-0 bg-black z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Content Inbox</h1>
              <p className="text-sm text-gray-400">
                {works.length} works ready for review
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {selectedWorks.size > 0 && (
                <>
                  <span className="text-sm text-gray-400">
                    {selectedWorks.size} selected
                  </span>
                  <button
                    onClick={handleBulkCritique}
                    className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                  >
                    Send to Critique
                  </button>
                  <button
                    onClick={handleBulkPublish}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Publish
                  </button>
                </>
              )}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 bg-gray-800 rounded hover:bg-gray-700 flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filters
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="border-b border-gray-800 bg-gray-950">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {/* Type Filter */}
              <div>
                <label className="text-xs text-gray-400 block mb-1">Type</label>
                <select 
                  value={filters.type}
                  onChange={(e) => setFilters({...filters, type: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-sm"
                >
                  <option value="">All Types</option>
                  {filterOptions.types.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Series Filter */}
              <div>
                <label className="text-xs text-gray-400 block mb-1">Series</label>
                <select 
                  value={filters.series}
                  onChange={(e) => setFilters({...filters, series: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-sm"
                >
                  <option value="">All Series</option>
                  {filterOptions.series.map(series => (
                    <option key={series} value={series}>{series}</option>
                  ))}
                </select>
              </div>

              {/* Subject Filter */}
              <div>
                <label className="text-xs text-gray-400 block mb-1">Subject</label>
                <select 
                  value={filters.subject}
                  onChange={(e) => setFilters({...filters, subject: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-sm"
                >
                  <option value="">All Subjects</option>
                  {filterOptions.subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>

              {/* Print Readiness */}
              <div>
                <label className="text-xs text-gray-400 block mb-1">
                  Min Print Ready: {(filters.min_print * 100).toFixed(0)}%
                </label>
                <input 
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={filters.min_print}
                  onChange={(e) => setFilters({...filters, min_print: parseFloat(e.target.value)})}
                  className="w-full"
                />
              </div>

              {/* Artifact Risk */}
              <div>
                <label className="text-xs text-gray-400 block mb-1">Artifact Risk</label>
                <select 
                  value={filters.artifact_risk}
                  onChange={(e) => setFilters({...filters, artifact_risk: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-sm"
                >
                  <option value="">Any Risk</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              {/* Date Range */}
              <div>
                <label className="text-xs text-gray-400 block mb-1">Date From</label>
                <input 
                  type="date"
                  value={filters.date_from}
                  onChange={(e) => setFilters({...filters, date_from: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-sm"
                />
              </div>
            </div>

            {/* Active Filters */}
            {Object.entries(filters).some(([k, v]) => v && k !== 'state') && (
              <div className="mt-4 flex items-center gap-2">
                <span className="text-xs text-gray-400">Active:</span>
                {Object.entries(filters).map(([key, value]) => {
                  if (!value || key === 'state') return null;
                  return (
                    <button
                      key={key}
                      onClick={() => setFilters({...filters, [key]: key === 'min_print' ? 0 : ''})}
                      className="px-2 py-1 bg-gray-800 rounded text-xs hover:bg-gray-700"
                    >
                      {key}: {value} ×
                    </button>
                  );
                })}
                <button
                  onClick={() => setFilters({
                    agent_id: '',
                    type: '',
                    series: '',
                    subject: '',
                    min_print: 0,
                    artifact_risk: '',
                    date_from: '',
                    date_to: '',
                    state: 'created'
                  })}
                  className="px-2 py-1 bg-red-900 text-red-400 rounded text-xs hover:bg-red-800"
                >
                  Clear All
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Works Grid */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="text-center py-12">Loading works...</div>
        ) : works.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            No works match your filters
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {works.map((work) => (
              <div 
                key={work.id}
                className={`relative group cursor-pointer border-2 rounded-lg overflow-hidden transition-all ${
                  selectedWorks.has(work.id) 
                    ? 'border-purple-500 scale-95' 
                    : 'border-gray-800 hover:border-gray-600'
                }`}
                onClick={() => toggleWorkSelection(work.id)}
              >
                {/* Image */}
                <div className="aspect-square relative bg-gray-900">
                  <Image
                    src={work.media_url}
                    alt={`Work ${work.id}`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  
                  {/* Selection Indicator */}
                  {selectedWorks.has(work.id) && (
                    <div className="absolute inset-0 bg-purple-600/20 flex items-center justify-center">
                      <CheckCircle className="w-8 h-8 text-white" />
                    </div>
                  )}

                  {/* Tags Overlay */}
                  <div className="absolute top-2 left-2 right-2 flex flex-wrap gap-1">
                    {work.tags?.taxonomy?.type && (
                      <span className="px-2 py-1 bg-black/80 text-xs rounded">
                        {work.tags.taxonomy.type}
                      </span>
                    )}
                    {work.tags?.taxonomy?.series && (
                      <span className="px-2 py-1 bg-blue-900/80 text-blue-300 text-xs rounded">
                        {work.tags.taxonomy.series}
                      </span>
                    )}
                  </div>

                  {/* Quality Indicators */}
                  <div className="absolute bottom-2 left-2 right-2 flex justify-between items-end">
                    {/* Print Readiness */}
                    {work.tags?.quality?.print_readiness !== undefined && (
                      <div className="flex items-center gap-1 bg-black/80 px-2 py-1 rounded">
                        <Printer className="w-3 h-3" />
                        <span className="text-xs">
                          {(work.tags.quality.print_readiness * 100).toFixed(0)}%
                        </span>
                      </div>
                    )}

                    {/* Artifact Risk */}
                    {work.tags?.quality?.artifact_risk && (
                      <span className={`px-2 py-1 bg-black/80 text-xs rounded border ${
                        getArtifactColor(work.tags.quality.artifact_risk)
                      }`}>
                        {work.tags.quality.artifact_risk}
                      </span>
                    )}
                  </div>
                </div>

                {/* Info */}
                <div className="p-3 bg-gray-950">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-xs font-bold capitalize">{work.agent_id}</p>
                      <p className="text-xs text-gray-400">Day {work.day}</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      {work.captured_at 
                        ? new Date(work.captured_at).toLocaleDateString()
                        : new Date(work.created_at).toLocaleDateString()
                      }
                    </p>
                  </div>

                  {/* Subjects */}
                  {work.tags?.taxonomy?.subject && work.tags.taxonomy.subject.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {work.tags.taxonomy.subject.slice(0, 3).map((subj, i) => (
                        <span key={i} className="text-xs text-gray-500">
                          #{subj}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Send to Curator Flag */}
                  {work.tags?.routing?.send_to_curator && (
                    <div className="mt-2 flex items-center gap-1 text-xs text-purple-400">
                      <Sparkles className="w-3 h-3" />
                      <span>Curator recommended</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}