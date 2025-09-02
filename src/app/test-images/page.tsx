'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function TestImagesPage() {
  const [works, setWorks] = useState<any[]>([]);
  const [error, setError] = useState<string>('');
  const [supabase, setSupabase] = useState<any>(null);

  // Initialize Supabase client dynamically
  useEffect(() => {
    const initSupabase = async () => {
      try {
        const { getBrowserSupabase } = await import('@/lib/supabase/client');
        const client = await getBrowserSupabase();
        setSupabase(client);
      } catch (error) {
        console.error('Failed to initialize Supabase:', error);
        setError('Failed to connect to database');
      }
    };
    initSupabase();
  }, []);

  useEffect(() => {
    if (!supabase) return;
    
    async function fetchWorks() {
      console.log('Fetching Solienne works...');
      
      const { data, error: fetchError } = await supabase
        .from('agent_archives')
        .select('*')
        .eq('agent_id', 'solienne')
        .limit(6);

      if (fetchError) {
        setError(fetchError.message);
        console.error('Database error:', fetchError);
      } else {
        console.log('Fetched works:', data);
        setWorks(data || []);
      }
    }

    fetchWorks();
  }, [supabase]);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Image Test Page</h1>
      
      {error && (
        <div className="bg-red-900 p-4 rounded mb-8">
          <p className="text-red-200">Error: {error}</p>
        </div>
      )}
      
      <div className="grid grid-cols-3 gap-4">
        {works.map((work, index) => (
          <div key={work.id} className="border border-gray-700 p-4">
            <h3 className="text-sm mb-2">Work {index + 1}</h3>
            <p className="text-xs text-gray-400 mb-2 truncate">{work.title}</p>
            <p className="text-xs text-gray-500 mb-4 break-all">
              URL: {work.image_url?.substring(0, 50)}...
            </p>
            
            <div className="aspect-square relative bg-gray-900">
              {work.image_url ? (
                <>
                  <Image
                    src={work.image_url}
                    alt={work.title}
                    fill
                    className="object-cover"
                    unoptimized
                    onLoad={() => console.log(`Image ${index + 1} loaded successfully`)}
                    onError={(e) => console.error(`Image ${index + 1} failed:`, e)}
                  />
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-600">No image URL</p>
                </div>
              )}
            </div>
            
            <div className="mt-2">
              <a 
                href={work.image_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-blue-400 hover:underline"
              >
                Open image directly →
              </a>
            </div>
          </div>
        ))}
      </div>
      
      {works.length === 0 && !error && (
        <p className="text-gray-500">Loading...</p>
      )}
    </div>
  );
}