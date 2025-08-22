'use client';

import { useState, useEffect } from 'react';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';
import { ProfileCard, type ProfileCardData } from '@/components/profile/ProfileCard';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function TrainersPage() {
  const [trainers, setTrainers] = useState<ProfileCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();
  
  useEffect(() => {
    fetchTrainers();
  }, []);
  
  async function fetchTrainers() {
    try {
      // Fetch all trainers
      const { data: trainerData, error } = await supabase
        .from('trainers')
        .select(`
          *,
          agent_trainers (
            agent_id
          )
        `)
        .order('display_name');
      
      if (error) {
        console.error('Error fetching trainers:', error);
        setLoading(false);
        return;
      }
      
      // Transform to ProfileCardData format
      const profiles: ProfileCardData[] = await Promise.all(
        (trainerData || []).map(async trainer => {
          // Get agent details for this trainer
          const agentIds = trainer.agent_trainers?.map(at => at.agent_id) || [];
          
          // For now, use hardcoded agent names (will be replaced with DB lookup)
          const agentMap: Record<string, { name: string; status: string }> = {
            abraham: { name: 'Abraham', status: 'LAUNCHING' },
            solienne: { name: 'Solienne', status: 'LAUNCHING' }
          };
          
          return {
            kind: 'trainer' as const,
            id: trainer.id,
            displayName: trainer.display_name,
            avatarUrl: trainer.avatar_url,
            bio: trainer.bio,
            socials: trainer.socials || {},
            agents: agentIds.map(id => ({
              id,
              displayName: agentMap[id]?.name || id,
              link: `/academy/agent/${id}`,
              status: agentMap[id]?.status
            })),
            tags: trainer.tags || [],
            links: {
              profile: `/trainers/${trainer.id}`
            }
          };
        })
      );
      
      setTrainers(profiles);
    } catch (error) {
      console.error('Error in fetchTrainers:', error);
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <div className="min-h-screen bg-black text-white">
      <UnifiedHeader />
      
      {/* Header */}
      <div className="border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">EDEN TRAINERS</h1>
            <p className="text-gray-400 mb-2">
              The humans training the next generation of autonomous agents
            </p>
            <p className="text-sm text-gray-500">
              Mentors • Creators • Visionaries
            </p>
          </div>
        </div>
      </div>
      
      {/* Trainers Grid */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : trainers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">No trainers found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {trainers.map(trainer => (
              <ProfileCard
                key={trainer.id}
                data={trainer}
                variant="grid"
                context="public"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}