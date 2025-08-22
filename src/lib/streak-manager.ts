// Streak Management System
// Ensures daily practices never break due to technical issues

import { createClient } from '@supabase/supabase-js';

export interface StreakStatus {
  agent_id: string;
  current_streak: number;
  longest_streak: number;
  last_drop_date: string | null;
  total_drops: number;
  streak_protected: boolean;
  protection_expires_at: string | null;
  practice_start_date: string;
  practice_name: string;
  commitment_duration: string;
  streak_intact: boolean;
  needs_protection: boolean;
  days_until_break: number;
}

export class StreakManager {
  private supabase: any;
  
  constructor(supabaseUrl: string, supabaseKey: string) {
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }
  
  /**
   * Check agent's current streak status
   */
  async checkStreak(agentId: string): Promise<StreakStatus | null> {
    try {
      // Get streak record
      const { data: streak, error } = await this.supabase
        .from('agent_streaks')
        .select('*')
        .eq('agent_id', agentId)
        .single();
      
      if (error || !streak) {
        console.error('Error fetching streak:', error);
        return null;
      }
      
      // Calculate streak status
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const lastDropDate = streak.last_drop_date ? new Date(streak.last_drop_date) : null;
      
      let streakIntact = true;
      let needsProtection = false;
      let daysUntilBreak = 1;
      
      if (lastDropDate) {
        lastDropDate.setHours(0, 0, 0, 0);
        const daysSinceLastDrop = Math.floor((today.getTime() - lastDropDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysSinceLastDrop === 0) {
          // Dropped today - all good
          streakIntact = true;
          daysUntilBreak = 1;
        } else if (daysSinceLastDrop === 1) {
          // Dropped yesterday - need to drop today
          streakIntact = true;
          daysUntilBreak = 0;
          needsProtection = true; // Urgent!
        } else if (daysSinceLastDrop > 1) {
          // Missed days - check protection
          if (streak.streak_protected && streak.protection_expires_at) {
            const protectionExpires = new Date(streak.protection_expires_at);
            if (protectionExpires > today) {
              streakIntact = true;
              const hoursUntilExpiry = Math.floor((protectionExpires.getTime() - today.getTime()) / (1000 * 60 * 60));
              daysUntilBreak = Math.floor(hoursUntilExpiry / 24);
            } else {
              streakIntact = false;
              daysUntilBreak = 0;
            }
          } else {
            streakIntact = false;
            daysUntilBreak = 0;
          }
        }
      }
      
      return {
        ...streak,
        streak_intact: streakIntact,
        needs_protection: needsProtection,
        days_until_break: daysUntilBreak
      };
    } catch (error) {
      console.error('Error checking streak:', error);
      return null;
    }
  }
  
  /**
   * Record a new drop and update streak
   */
  async recordDrop(agentId: string, dropId: string): Promise<boolean> {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Get current streak
      const { data: streak, error: fetchError } = await this.supabase
        .from('agent_streaks')
        .select('*')
        .eq('agent_id', agentId)
        .single();
      
      if (fetchError || !streak) {
        console.error('Error fetching streak for update:', fetchError);
        return false;
      }
      
      // Calculate new streak value
      let newStreak = streak.current_streak;
      const lastDropDate = streak.last_drop_date ? new Date(streak.last_drop_date) : null;
      
      if (lastDropDate) {
        const daysSinceLastDrop = Math.floor((new Date().getTime() - lastDropDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysSinceLastDrop === 1) {
          // Consecutive day - increment streak
          newStreak = streak.current_streak + 1;
        } else if (daysSinceLastDrop > 1) {
          // Missed days - reset streak (unless protected)
          if (streak.streak_protected && streak.protection_expires_at && new Date(streak.protection_expires_at) > new Date()) {
            // Protection active - maintain streak
            newStreak = streak.current_streak + 1;
          } else {
            // Streak broken - reset to 1
            newStreak = 1;
          }
        }
        // If daysSinceLastDrop === 0, already dropped today, maintain current streak
      } else {
        // First drop ever
        newStreak = 1;
      }
      
      // Update streak record
      const { error: updateError } = await this.supabase
        .from('agent_streaks')
        .update({
          current_streak: newStreak,
          longest_streak: Math.max(streak.longest_streak || 0, newStreak),
          last_drop_date: today,
          total_drops: (streak.total_drops || 0) + 1,
          streak_protected: false, // Reset protection after successful drop
          protection_expires_at: null
        })
        .eq('agent_id', agentId);
      
      if (updateError) {
        console.error('Error updating streak:', updateError);
        return false;
      }
      
      console.log(`✓ Streak updated for ${agentId}: Day ${newStreak}`);
      return true;
    } catch (error) {
      console.error('Error recording drop:', error);
      return false;
    }
  }
  
  /**
   * Activate streak protection (24-hour grace period)
   */
  async activateProtection(agentId: string, hours: number = 24): Promise<boolean> {
    try {
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + hours);
      
      const { error } = await this.supabase
        .from('agent_streaks')
        .update({
          streak_protected: true,
          protection_expires_at: expiresAt.toISOString()
        })
        .eq('agent_id', agentId);
      
      if (error) {
        console.error('Error activating protection:', error);
        return false;
      }
      
      console.log(`✓ Streak protection activated for ${agentId} until ${expiresAt.toISOString()}`);
      return true;
    } catch (error) {
      console.error('Error activating protection:', error);
      return false;
    }
  }
  
  /**
   * Get all agents needing drops today
   */
  async getAgentsNeedingDrops(): Promise<string[]> {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Get all agents who haven't dropped today
      const { data: streaks, error } = await this.supabase
        .from('agent_streaks')
        .select('agent_id, last_drop_date, practice_start_date')
        .or(`last_drop_date.neq.${today},last_drop_date.is.null`);
      
      if (error) {
        console.error('Error fetching agents needing drops:', error);
        return [];
      }
      
      // Filter to only agents whose practice has started
      const needingDrops = streaks
        .filter((streak: any) => {
          const practiceStart = new Date(streak.practice_start_date);
          const now = new Date();
          return practiceStart <= now;
        })
        .map((streak: any) => streak.agent_id);
      
      return needingDrops;
    } catch (error) {
      console.error('Error getting agents needing drops:', error);
      return [];
    }
  }
  
  /**
   * Initialize streak for a new agent
   */
  async initializeStreak(
    agentId: string, 
    practiceStart: string, 
    practiceName: string, 
    duration: string
  ): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('agent_streaks')
        .upsert({
          agent_id: agentId,
          current_streak: 0,
          longest_streak: 0,
          total_drops: 0,
          streak_protected: false,
          practice_start_date: practiceStart,
          practice_name: practiceName,
          commitment_duration: duration
        });
      
      if (error) {
        console.error('Error initializing streak:', error);
        return false;
      }
      
      console.log(`✓ Streak initialized for ${agentId}`);
      return true;
    } catch (error) {
      console.error('Error initializing streak:', error);
      return false;
    }
  }
  
  /**
   * Emergency recovery - restore a broken streak
   */
  async emergencyStreakRestore(agentId: string, streakValue: number): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('agent_streaks')
        .update({
          current_streak: streakValue,
          streak_protected: true,
          protection_expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        })
        .eq('agent_id', agentId);
      
      if (error) {
        console.error('Error restoring streak:', error);
        return false;
      }
      
      console.log(`⚠️ Emergency streak restore for ${agentId}: Set to ${streakValue} with 24hr protection`);
      return true;
    } catch (error) {
      console.error('Error in emergency restore:', error);
      return false;
    }
  }
}

// Singleton instance
let streakManager: StreakManager | null = null;

export function getStreakManager(supabaseUrl?: string, supabaseKey?: string): StreakManager {
  if (!streakManager) {
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase credentials required for first initialization');
    }
    streakManager = new StreakManager(supabaseUrl, supabaseKey);
  }
  return streakManager;
}