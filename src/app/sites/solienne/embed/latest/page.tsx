'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface SolienneWork {
  id: string;
  title: string;
  image_url: string;
  created_date: string;
}

export default function SolienneEmbedLatest() {
  const [work, setWork] = useState<SolienneWork | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLatestWork();
  }, []);

  async function fetchLatestWork() {
    try {
      setLoading(true);
      // Use Registry API through Academy gateway (ADR-019)
      const response = await fetch('/api/agents/solienne/works?limit=1&sort=date_desc');
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.works && data.works.length > 0) {
        setWork(data.works[0]);
      } else {
        setError('No works found');
      }
    } catch (err) {
      console.error('Failed to fetch latest Solienne work:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="w-full h-full bg-black flex items-center justify-center">
        <div className="animate-pulse w-full h-full bg-gray-900" />
      </div>
    );
  }

  if (error || !work) {
    return (
      <div className="w-full h-full bg-black flex items-center justify-center">
        <div className="text-white text-xs text-center p-4">
          <div className="mb-2">SOLIENNE</div>
          <div className="opacity-60">{error || 'No work available'}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-black text-white relative group">
      <a 
        href={`https://solienne.ai/work/${work.id}`}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full h-full"
      >
        <div className="relative w-full h-full">
          <Image
            src={work.image_url}
            alt={work.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <p className="text-xs text-gray-400 mb-1">SOLIENNE</p>
              <p className="text-sm line-clamp-2">{work.title}</p>
              <p className="text-xs text-gray-500 mt-2">{work.created_date}</p>
            </div>
          </div>
        </div>
      </a>
    </div>
  );
}