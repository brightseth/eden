'use client';

import { useState, useEffect } from 'react';
import { Package, Shirt, ShoppingBag, Image as ImageIcon, Send, Eye } from 'lucide-react';
import Image from 'next/image';

interface Work {
  id: string;
  agent_id: string;
  day: number;
  media_url: string;
  state: string;
  product_status?: 'unassigned' | 'draft' | 'ready' | 'published';
  product_type?: string;
}

interface ProductsPanelProps {
  agentId: string;
}

const PRODUCT_TYPES = [
  { id: 'tshirt', label: 'T-Shirt', icon: '👕', mockup: '/mockups/tshirt.png' },
  { id: 'sweatshirt', label: 'Sweatshirt', icon: '🧥', mockup: '/mockups/sweatshirt.png' },
  { id: 'tote', label: 'Tote Bag', icon: '👜', mockup: '/mockups/tote.png' },
  { id: 'print', label: 'Art Print', icon: '🖼️', mockup: '/mockups/print.png' },
  { id: 'leggings', label: 'Leggings', icon: '🩳', mockup: '/mockups/leggings.png' },
  { id: 'poster', label: 'Poster', icon: '📋', mockup: '/mockups/poster.png' },
];

export function ProductsPanel({ agentId }: ProductsPanelProps) {
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWork, setSelectedWork] = useState<Work | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [filter, setFilter] = useState<'all' | 'unassigned' | 'draft' | 'ready'>('all');

  useEffect(() => {
    fetchProductWorks();
  }, [agentId]);

  const fetchProductWorks = async () => {
    try {
      // Fetch works that can be turned into products (INCLUDE verdict)
      const res = await fetch(`/api/agents/${agentId}/published`);
      const data = await res.json();
      // Mock product status for demo
      const worksWithStatus = (data.works || []).map((work: Work) => ({
        ...work,
        product_status: work.product_status || 'unassigned'
      }));
      setWorks(worksWithStatus);
    } catch (error) {
      console.error('Error fetching works:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignProduct = async (work: Work, productType: string) => {
    // Mock assignment - in real app, would call API
    const updatedWorks = works.map(w => 
      w.id === work.id 
        ? { ...w, product_type: productType, product_status: 'draft' as const }
        : w
    );
    setWorks(updatedWorks);
    setSelectedWork(null);
    setSelectedProduct('');
  };

  const handlePushToPrintify = async (workIds: string[]) => {
    console.log(`Pushing ${workIds.length} product(s) to Printify...`);
    // In real app, would call Printify API
  };

  const filteredWorks = filter === 'all' 
    ? works 
    : works.filter(w => w.product_status === filter);

  return (
    <div>
      {/* Filters */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'all' 
              ? 'bg-gray-800 text-white' 
              : 'bg-gray-900 text-gray-400 hover:text-white'
          }`}
        >
          All ({works.length})
        </button>
        <button
          onClick={() => setFilter('unassigned')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'unassigned' 
              ? 'bg-gray-800 text-white' 
              : 'bg-gray-900 text-gray-400 hover:text-white'
          }`}
        >
          Unassigned ({works.filter(w => w.product_status === 'unassigned').length})
        </button>
        <button
          onClick={() => setFilter('draft')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'draft' 
              ? 'bg-yellow-900 text-yellow-400' 
              : 'bg-gray-900 text-gray-400 hover:text-yellow-400'
          }`}
        >
          Draft ({works.filter(w => w.product_status === 'draft').length})
        </button>
        <button
          onClick={() => setFilter('ready')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'ready' 
              ? 'bg-green-900 text-green-400' 
              : 'bg-gray-900 text-gray-400 hover:text-green-400'
          }`}
        >
          Ready ({works.filter(w => w.product_status === 'ready').length})
        </button>
      </div>

      {/* Product Assignment Modal */}
      {selectedWork && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6">
          <div className="bg-gray-950 border border-gray-800 rounded-lg max-w-2xl w-full p-6">
            <h3 className="text-xl font-bold text-white mb-4">
              Assign Product Type
            </h3>
            
            <div className="flex gap-4 mb-6">
              <div className="w-32 h-32 bg-gray-900 rounded-lg overflow-hidden">
                <Image
                  src={selectedWork.media_url}
                  alt="Work"
                  width={128}
                  height={128}
                  className="object-cover w-full h-full"
                  unoptimized
                />
              </div>
              <div>
                <p className="text-gray-400">Day {selectedWork.day}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Select a product type to generate mockups and prepare for Printify
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
              {PRODUCT_TYPES.map((product) => (
                <button
                  key={product.id}
                  onClick={() => setSelectedProduct(product.id)}
                  className={`p-4 border rounded-lg transition-all ${
                    selectedProduct === product.id
                      ? 'border-purple-400 bg-purple-900/20'
                      : 'border-gray-800 hover:border-gray-700'
                  }`}
                >
                  <div className="text-2xl mb-2">{product.icon}</div>
                  <div className="text-sm text-white">{product.label}</div>
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  if (selectedProduct) {
                    handleAssignProduct(selectedWork, selectedProduct);
                  }
                }}
                disabled={!selectedProduct}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 disabled:bg-gray-800 disabled:text-gray-500 font-medium"
              >
                Generate Mockup
              </button>
              <button
                onClick={() => {
                  setSelectedWork(null);
                  setSelectedProduct('');
                }}
                className="px-4 py-2 bg-gray-800 text-gray-400 rounded-lg hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Works Grid */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading works...</div>
      ) : filteredWorks.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p>No works available for products</p>
          <p className="text-sm mt-2">Published works will appear here for product assignment</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredWorks.map((work) => (
            <div 
              key={work.id}
              className="relative group bg-gray-950 border border-gray-800 rounded-lg overflow-hidden hover:border-gray-700 transition-all"
            >
              {/* Status Badge */}
              <div className="absolute top-2 right-2 z-10">
                {work.product_status === 'draft' && (
                  <span className="px-2 py-1 bg-yellow-900/90 text-yellow-400 text-xs rounded">
                    Draft
                  </span>
                )}
                {work.product_status === 'ready' && (
                  <span className="px-2 py-1 bg-green-900/90 text-green-400 text-xs rounded">
                    Ready
                  </span>
                )}
              </div>

              {/* Image */}
              <div className="aspect-square bg-gray-900">
                <Image
                  src={work.media_url}
                  alt={`Day ${work.day}`}
                  width={300}
                  height={300}
                  className="object-cover w-full h-full"
                  unoptimized
                />
              </div>

              {/* Info */}
              <div className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white">Day {work.day}</span>
                  {work.product_type && (
                    <span className="text-xs text-gray-400">
                      {PRODUCT_TYPES.find(p => p.id === work.product_type)?.icon}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  {work.product_status === 'unassigned' && (
                    <button
                      onClick={() => setSelectedWork(work)}
                      className="flex-1 px-2 py-1 bg-purple-900 text-purple-400 hover:bg-purple-800 rounded text-xs font-medium flex items-center justify-center gap-1"
                    >
                      <Package className="w-3 h-3" />
                      Assign
                    </button>
                  )}
                  
                  {work.product_status === 'draft' && (
                    <>
                      <button
                        className="flex-1 px-2 py-1 bg-gray-800 text-gray-400 hover:bg-gray-700 rounded text-xs font-medium flex items-center justify-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        Preview
                      </button>
                      <button
                        onClick={() => {
                          const updatedWorks = works.map(w => 
                            w.id === work.id ? { ...w, product_status: 'ready' as const } : w
                          );
                          setWorks(updatedWorks);
                        }}
                        className="px-2 py-1 bg-green-900 text-green-400 hover:bg-green-800 rounded text-xs"
                      >
                        ✓
                      </button>
                    </>
                  )}
                  
                  {work.product_status === 'ready' && (
                    <button
                      onClick={() => handlePushToPrintify([work.id])}
                      className="flex-1 px-2 py-1 bg-purple-900 text-purple-400 hover:bg-purple-800 rounded text-xs font-medium flex items-center justify-center gap-1"
                    >
                      <Send className="w-3 h-3" />
                      Printify
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bulk Push to Printify */}
      {works.filter(w => w.product_status === 'ready').length > 0 && (
        <div className="mt-6 p-4 bg-purple-950/30 border border-purple-800 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-400 font-medium">
                {works.filter(w => w.product_status === 'ready').length} products ready for Printify
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Push all ready products to your Printify store
              </p>
            </div>
            <button
              onClick={() => handlePushToPrintify(
                works.filter(w => w.product_status === 'ready').map(w => w.id)
              )}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 font-medium flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Push All to Printify
            </button>
          </div>
        </div>
      )}
    </div>
  );
}