'use client';

import { useState } from 'react';
import Image from 'next/image';

interface DebugImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function DebugImage({ src, alt, className }: DebugImageProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  return (
    <div className="relative w-full h-full">
      {loading && (
        <div className="absolute inset-0 bg-gray-900 animate-pulse flex items-center justify-center">
          <span className="text-xs text-gray-500">Loading...</span>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 bg-red-900/20 flex flex-col items-center justify-center p-2">
          <span className="text-xs text-red-500 mb-1">Failed to load</span>
          <span className="text-xs text-gray-600 break-all">{src.substring(0, 50)}...</span>
        </div>
      )}
      <Image
        src={src}
        alt={alt}
        fill
        className={className}
        unoptimized
        onLoad={() => setLoading(false)}
        onError={(e) => {
          console.error('Image failed to load:', src);
          setError(src);
          setLoading(false);
        }}
      />
    </div>
  );
}