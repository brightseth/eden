'use client';

import React from 'react';

type Slice = { 
  label: string; 
  percentage?: number;
  tooltip?: string; 
  color?: string;
};

interface TokenSplitRibbonProps {
  slices?: Slice[];
  title?: string;
  compact?: boolean;
}

export default function TokenSplitRibbon({
  slices = [
    { label: 'Creator', percentage: 25 },
    { label: 'Agent Treasury', percentage: 25 },
    { label: 'Eden Platform', percentage: 25 },
    { label: '$SPIRIT Holders', percentage: 25 },
  ],
  title = 'Revenue Distribution',
  compact = false
}: TokenSplitRibbonProps) {
  return (
    <div className="w-full">
      {title && !compact && (
        <h3 className="text-sm font-bold tracking-wider text-gray-500 mb-3">{title}</h3>
      )}
      <div className="border border-gray-800 rounded-lg overflow-hidden bg-black">
        <div className={`grid grid-cols-${slices.length} divide-x divide-gray-800`}>
          {slices.map((slice, i) => (
            <div 
              key={i} 
              className={`${compact ? 'p-2' : 'p-4'} text-center hover:bg-gray-950 transition-colors`}
              title={slice.tooltip}
            >
              <div className={`${compact ? 'text-lg' : 'text-2xl'} font-bold text-white mb-1`}>
                {slice.percentage}%
              </div>
              <div className={`${compact ? 'text-xs' : 'text-sm'} text-gray-400`}>
                {slice.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}