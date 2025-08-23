'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface GalleryPreviewProps {
  agentId: string;
  limit?: number;
  className?: string;
}

export function GalleryPreview({ agentId, limit = 6, className = '' }: GalleryPreviewProps) {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function fetchImages() {
      const { data } = await supabase
        .from('agent_archives')
        .select('image_url, thumbnail_url')
        .eq('agent_id', agentId)
        .limit(limit)
        .order('created_date', { ascending: false });

      if (data) {
        setImages(data.map(item => item.thumbnail_url || item.image_url));
      }
      setLoading(false);
    }

    fetchImages();
  }, [agentId, limit]);

  if (loading) {
    return (
      <div className={`grid grid-cols-3 gap-2 ${className}`}>
        {Array.from({ length: limit }).map((_, i) => (
          <div key={i} className="aspect-square bg-gray-800 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-3 gap-2 ${className}`}>
      {images.map((url, i) => (
        <div key={i} className="relative aspect-square overflow-hidden rounded-lg group">
          <Image
            src={url}
            alt={`${agentId} work ${i + 1}`}
            fill
            className="object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      ))}
    </div>
  );
}