'use client';

import { ArrowUpRight } from 'lucide-react';

interface MinimalAgentCardProps {
  id: number;
  name: string;
  status: 'LAUNCHING' | 'DEVELOPING' | 'OPEN';
  date?: string;
  hasProfile?: boolean;
  trainer?: string;
  worksCount?: number;
  description?: string;
  onClick: () => void;
}

export function MinimalAgentCard({
  id,
  name,
  status,
  date,
  hasProfile,
  trainer,
  worksCount,
  description,
  onClick
}: MinimalAgentCardProps) {

  const statusStyles = {
    LAUNCHING: 'text-white',
    DEVELOPING: 'text-gray-400',
    OPEN: 'text-gray-600'
  };

  return (
    <article 
      className="group relative cursor-pointer"
      onClick={onClick}
    >
      {/* Status indicator - subtle */}
      {status === 'LAUNCHING' && date && (
        <div className="absolute -top-2 -right-2 z-10">
          <div className="px-2 py-1 bg-black border border-gray-800 text-[10px] tracking-wider">
            {date.split(' ')[0]} {date.split(' ')[1]}
          </div>
        </div>
      )}

      {/* Main card */}
      <div className={`
        border border-gray-900 p-6
        hover:border-gray-700 transition-all duration-500
        ${status === 'OPEN' ? 'border-dashed opacity-50 hover:opacity-100' : ''}
      `}>
        {/* Header */}
        <div className="mb-4">
          <div className="text-[10px] text-gray-600 tracking-[0.2em] mb-2">
            {String(id).padStart(3, '0')}
          </div>
          <h3 className={`text-2xl font-bold ${statusStyles[status]}`}>
            {name}
          </h3>
        </div>

        {/* Content based on status */}
        {status === 'OPEN' ? (
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              Open slot for trainer
            </p>
            <div className="flex items-center gap-2 text-gray-500 group-hover:text-gray-300 transition-colors">
              <span className="text-xs">Apply</span>
              <ArrowUpRight className="w-3 h-3" />
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {description && (
              <p className="text-sm text-gray-500 line-clamp-2">
                {description}
              </p>
            )}
            
            {/* Metadata */}
            <div className="space-y-1 text-xs text-gray-600">
              {trainer && <div>{trainer}</div>}
              {worksCount && <div>{worksCount.toLocaleString()} works</div>}
              {!hasProfile && status === 'DEVELOPING' && <div>Coming soon</div>}
            </div>

            {/* Action */}
            {hasProfile && (
              <div className="flex items-center gap-2 text-gray-500 group-hover:text-gray-300 transition-colors">
                <span className="text-xs">View</span>
                <ArrowUpRight className="w-3 h-3" />
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  );
}