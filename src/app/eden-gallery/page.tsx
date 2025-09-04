'use client';

import { useState, useEffect } from 'react';
import { ExternalLink } from 'lucide-react';

export default function EdenGalleryPage() {
  const [creations, setCreations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const pageSize = 24;

  useEffect(() => {
    fetchCreations();
  }, [page]);

  const fetchCreations = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/agents/solienne/eden-creations?page=${page}&pageSize=${pageSize}`);
      const data = await response.json();
      setCreations(data.creations || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error('Failed to fetch:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">SOLIENNE EDEN GALLERY</h1>
        <p className="text-gray-400 mb-4">
          {total.toLocaleString()} creations from Eden.art
        </p>

        {loading ? (
          <div className="text-center py-12">
            <p>Loading...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {creations.map((creation) => (
                <div key={creation.id} className="border border-gray-700">
                  {creation.image_url ? (
                    <img
                      src={creation.image_url}
                      alt={creation.title || 'Eden creation'}
                      className="w-full h-48 object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-800" />
                  )}
                  <div className="p-2">
                    <p className="text-sm truncate">{creation.title || 'Untitled'}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-center gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 py-2">
                Page {page} of {Math.ceil(total / pageSize)}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page * pageSize >= total}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50"
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