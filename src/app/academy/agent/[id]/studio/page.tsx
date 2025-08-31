import { UnifiedHeader } from '@/components/layout/UnifiedHeader';
import { Studio } from '@/components/studio/Studio';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

interface StudioPageProps {
  params: Promise<{ id: string }>;
}

export default async function StudioPage({ params }: StudioPageProps) {
  const { id } = await params;
  const agentName = id.charAt(0).toUpperCase() + id.slice(1);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation Header */}
      <UnifiedHeader />
      
      {/* Breadcrumb */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <Link 
            href={`/academy/agent/${id}`}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to {agentName} Profile
          </Link>
        </div>
      </div>

      {/* Studio Component */}
      <Studio agentId={id} agentName={agentName} />
    </div>
  );
}