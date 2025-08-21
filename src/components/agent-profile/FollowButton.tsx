'use client';

import { useState, useEffect } from 'react';
import { UserPlus, UserCheck, Loader2 } from 'lucide-react';

interface FollowButtonProps {
  agentId: string;
  agentName: string;
  className?: string;
  showCount?: boolean;
}

export function FollowButton({ agentId, agentName, className = '', showCount = true }: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    // Get or create user ID (in production, this would come from auth)
    let uid = localStorage.getItem('eden_user_id');
    if (!uid) {
      uid = `user_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('eden_user_id', uid);
    }
    setUserId(uid);
    
    // Check follow status
    checkFollowStatus(uid);
  }, [agentId]);

  const checkFollowStatus = async (uid: string) => {
    try {
      const response = await fetch(`/api/agents/${agentId}/follow?user_id=${uid}`);
      const data = await response.json();
      setIsFollowing(data.is_following);
      setFollowerCount(data.follower_count);
    } catch (error) {
      console.error('Failed to check follow status:', error);
    }
  };

  const handleFollow = async () => {
    if (loading || !userId) return;
    
    setLoading(true);
    const wasFollowing = isFollowing;
    
    // Optimistic update
    setIsFollowing(!wasFollowing);
    setFollowerCount(prev => wasFollowing ? Math.max(0, prev - 1) : prev + 1);
    
    try {
      const response = await fetch(`/api/agents/${agentId}/follow`, {
        method: wasFollowing ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update follow status');
      }
      
      // Create notification if following
      if (!wasFollowing) {
        // Send follow notification
        await fetch('/api/notifications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: userId,
            type: 'FOLLOW_ADDED',
            agent_id: agentId,
            agent_name: agentName,
            payload: { user_id: userId }
          })
        });
        
        // Trigger a test notification for demo
        if ((window as any).testNotification) {
          (window as any).testNotification('FOLLOW_ADDED', agentName);
        }
      }
    } catch (error) {
      console.error('Follow action failed:', error);
      // Revert optimistic update
      setIsFollowing(wasFollowing);
      setFollowerCount(prev => wasFollowing ? prev + 1 : Math.max(0, prev - 1));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        onClick={handleFollow}
        disabled={loading}
        className={`
          px-4 py-2 rounded-lg font-medium text-sm
          flex items-center gap-2 transition-all
          ${isFollowing 
            ? 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-600' 
            : 'bg-yellow-400 text-black hover:bg-yellow-300'
          }
          ${loading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : isFollowing ? (
          <UserCheck className="w-4 h-4" />
        ) : (
          <UserPlus className="w-4 h-4" />
        )}
        {isFollowing ? 'Following' : 'Follow'}
      </button>
      
      {showCount && followerCount > 0 && (
        <span className="text-sm text-gray-400">
          {followerCount} {followerCount === 1 ? 'follower' : 'followers'}
        </span>
      )}
    </div>
  );
}