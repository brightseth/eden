'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';
import { ProfileCard, type ProfileCardData } from '@/components/profile/ProfileCard';
import { ArchiveBrowser } from '@/components/archive-browser';
import { getTrainerProfile } from '@/lib/hooks/useProfile';
import { ChevronRight, Archive } from 'lucide-react';

export default function TrainerProfilePage() {
  const params = useParams();
  const trainerId = params.id as string;
  const [profile, setProfile] = useState<ProfileCardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'works'>('overview');
  
  useEffect(() => {
    if (trainerId) {
      getTrainerProfile(trainerId).then(data => {
        setProfile(data);
        setLoading(false);
      });
    }
  }, [trainerId]);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!profile) {
    return (
      <div className="min-h-screen bg-black text-white">
        <UnifiedHeader />
        <div className="max-w-6xl mx-auto px-6 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Trainer Not Found</h1>
          <Link href="/trainers" className="text-primary hover:underline">
            Back to Trainers
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-black text-white">
      <UnifiedHeader />
      
      {/* Breadcrumbs */}
      <div className="border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/trainers" className="hover:text-white transition-colors">
              Trainers
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">{profile.displayName}</span>
          </div>
        </div>
      </div>
      
      {/* Profile Hero */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <ProfileCard
          data={profile}
          variant="site"
          context="public"
        />
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 text-sm font-bold tracking-wider uppercase border-b-2 transition-colors ${
                activeTab === 'overview'
                  ? 'text-white border-white'
                  : 'text-gray-500 border-transparent hover:text-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('works')}
              className={`py-4 text-sm font-bold tracking-wider uppercase border-b-2 transition-colors ${
                activeTab === 'works'
                  ? 'text-white border-white'
                  : 'text-gray-500 border-transparent hover:text-gray-300'
              }`}
            >
              Works
            </button>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {activeTab === 'overview' ? (
          <div className="space-y-8">
            {/* Agents Section */}
            {profile.kind === 'trainer' && profile.agents && profile.agents.length > 0 && (
              <div>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Archive className="w-5 h-5" />
                  Training Agents
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {profile.agents.map(agent => (
                    <Link
                      key={agent.id}
                      href={agent.link}
                      className="p-4 bg-gradient-to-br from-gray-950/50 to-black border border-gray-800 rounded-xl hover:border-gray-700 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{agent.displayName}</h3>
                          {agent.status && (
                            <span className="text-xs text-gray-400">{agent.status}</span>
                          )}
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            
            {/* Bio Section */}
            {profile.bio && (
              <div>
                <h2 className="text-xl font-bold mb-4">About</h2>
                <p className="text-gray-300 leading-relaxed">{profile.bio}</p>
              </div>
            )}
            
            {/* Specializations */}
            {profile.kind === 'trainer' && profile.tags && profile.tags.length > 0 && (
              <div>
                <h2 className="text-xl font-bold mb-4">Specializations</h2>
                <div className="flex flex-wrap gap-2">
                  {profile.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-white/5 rounded-full border border-white/10 text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-bold mb-4">Works by {profile.displayName}</h2>
            <p className="text-gray-400 mb-6">
              All generations and creations by this trainer across different agents
            </p>
            {/* TODO: Add filtered archive browser for trainer's works */}
            <div className="text-center py-12 border border-gray-800 rounded-xl">
              <p className="text-gray-500">Archive browser coming soon</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}