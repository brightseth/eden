import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import Image from 'next/image';
import { User, ArrowRight } from 'lucide-react';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';

export default async function TrainersPage() {
  const supabase = await createClient();
  
  // Get all trainers
  const { data: trainers } = await supabase
    .from('trainers')
    .select('*')
    .order('display_name');

  // Get agent counts per trainer
  const { data: agentCounts } = await supabase
    .from('agent_trainers')
    .select('trainer_id')
    .in('trainer_id', trainers?.map(t => t.id) || []);

  const trainerAgentCounts = agentCounts?.reduce((acc, { trainer_id }) => {
    acc[trainer_id] = (acc[trainer_id] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  return (
    <div className="min-h-screen bg-black text-white">
      <UnifiedHeader />
      
      {/* Header */}
      <div className="border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <h1 className="text-4xl font-bold mb-2">Trainers</h1>
          <p className="text-xl text-gray-400">
            The human guides shaping AI artistic development
          </p>
        </div>
      </div>

      {/* Trainers Grid */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trainers?.map((trainer) => (
            <Link
              key={trainer.id}
              href={`/trainers/${trainer.id}`}
              className="group block bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-purple-600/50 transition-all"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-purple-600 to-pink-600">
                  {trainer.avatar_url ? (
                    <Image
                      src={trainer.avatar_url}
                      alt={trainer.display_name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="w-8 h-8 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1">{trainer.display_name}</h3>
                  <p className="text-sm text-gray-400">
                    {trainerAgentCounts[trainer.id] || 0} agent{trainerAgentCounts[trainer.id] !== 1 ? 's' : ''}
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
              </div>
              
              {trainer.bio && (
                <p className="text-sm text-gray-300 line-clamp-2">{trainer.bio}</p>
              )}
              
              {trainer.socials && Object.keys(trainer.socials).length > 0 && (
                <div className="flex gap-2 mt-4">
                  {trainer.socials.twitter && (
                    <span className="text-xs px-2 py-1 bg-gray-800 rounded">
                      @{trainer.socials.twitter}
                    </span>
                  )}
                  {trainer.socials.website && (
                    <span className="text-xs px-2 py-1 bg-gray-800 rounded">
                      Website
                    </span>
                  )}
                </div>
              )}
            </Link>
          ))}
        </div>

        {(!trainers || trainers.length === 0) && (
          <div className="text-center py-12">
            <p className="text-gray-500">No trainers found. Run the seed script to populate.</p>
          </div>
        )}
      </div>
    </div>
  );
}