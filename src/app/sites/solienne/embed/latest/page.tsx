'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface SolienneWork {
  id: string;
  title: string;
  image_url: string;
  created_date: string;
}

export default function SolienneEmbedLatest() {
  const [work, setWork] = useState<SolienneWork | null>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchLatestWork();
  }, []);

  async function fetchLatestWork() {
    const { data } = await supabase
      .from('agent_archives')
      .select('*')
      .eq('agent_id', 'solienne')
      .order('created_date', { ascending: false })
      .limit(1)
      .single();

    if (data) {
      setWork(data);
    }
  }

  if (!work) {
    return (
      <div className="w-full h-full bg-black flex items-center justify-center">
        <div className="animate-pulse w-full h-full bg-gray-900" />
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