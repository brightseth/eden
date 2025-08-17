export interface Database {
  public: {
    Tables: {
      programs: {
        Row: {
          id: string;
          name: string;
          start_date: string;
          graduation_date: string;
          economy_mode: 'training' | 'live';
          revenue_lock_until: string | null;
          distribution_threshold_usdc: number | null;
          min_daily_output: number;
          min_style_coherence: number;
          min_streak_days: number;
          vip_commit_target: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          start_date: string;
          graduation_date: string;
          economy_mode: 'training' | 'live';
          revenue_lock_until?: string | null;
          distribution_threshold_usdc?: number | null;
          min_daily_output?: number;
          min_style_coherence?: number;
          min_streak_days?: number;
          vip_commit_target?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          start_date?: string;
          graduation_date?: string;
          economy_mode?: 'training' | 'live';
          revenue_lock_until?: string | null;
          distribution_threshold_usdc?: number | null;
          min_daily_output?: number;
          min_style_coherence?: number;
          min_streak_days?: number;
          vip_commit_target?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      agents: {
        Row: {
          id: string;
          program_id: string;
          name: string;
          start_date: string;
          launch_date: string;
          current_stage: number;
          avatar_url: string | null;
          artist_statement: string | null;
          style_description: string | null;
          wallet_address: string | null;
          safe_address: string | null;
          token_address: string | null;
          eden_profile_id: string | null;
          farcaster_fid: number | null;
          total_costs: number;
          total_revenue: number;
          total_distributed: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          program_id: string;
          name: string;
          start_date: string;
          launch_date: string;
          current_stage?: number;
          avatar_url?: string | null;
          artist_statement?: string | null;
          style_description?: string | null;
          wallet_address?: string | null;
          safe_address?: string | null;
          token_address?: string | null;
          eden_profile_id?: string | null;
          farcaster_fid?: number | null;
          total_costs?: number;
          total_revenue?: number;
          total_distributed?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          program_id?: string;
          name?: string;
          start_date?: string;
          launch_date?: string;
          current_stage?: number;
          avatar_url?: string | null;
          artist_statement?: string | null;
          style_description?: string | null;
          wallet_address?: string | null;
          safe_address?: string | null;
          token_address?: string | null;
          eden_profile_id?: string | null;
          farcaster_fid?: number | null;
          total_costs?: number;
          total_revenue?: number;
          total_distributed?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      economy_events: {
        Row: {
          id: string;
          agent_id: string;
          occurred_at: string;
          type: string;
          payload: any;
          source: string | null;
          external_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          agent_id: string;
          occurred_at: string;
          type: string;
          payload: any;
          source?: string | null;
          external_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          agent_id?: string;
          occurred_at?: string;
          type?: string;
          payload?: any;
          source?: string | null;
          external_id?: string | null;
          created_at?: string;
        };
      };
      daily_metrics: {
        Row: {
          id: string;
          agent_id: string;
          date: string;
          day_number: number;
          creations_count: number;
          creation_costs: number;
          style_coherence: number | null;
          revenue_mode: 'simulated' | 'real';
          sales_count: number;
          sales_revenue: number;
          simulated_revenue: number;
          unique_collectors: number;
          farcaster_followers: number | null;
          farcaster_engagement: number | null;
          total_impressions: number | null;
          net_position: number | null;
          runway_days: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          agent_id: string;
          date: string;
          day_number: number;
          creations_count?: number;
          creation_costs?: number;
          style_coherence?: number | null;
          revenue_mode?: 'simulated' | 'real';
          sales_count?: number;
          sales_revenue?: number;
          simulated_revenue?: number;
          unique_collectors?: number;
          farcaster_followers?: number | null;
          farcaster_engagement?: number | null;
          total_impressions?: number | null;
          net_position?: number | null;
          runway_days?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          agent_id?: string;
          date?: string;
          day_number?: number;
          creations_count?: number;
          creation_costs?: number;
          style_coherence?: number | null;
          revenue_mode?: 'simulated' | 'real';
          sales_count?: number;
          sales_revenue?: number;
          simulated_revenue?: number;
          unique_collectors?: number;
          farcaster_followers?: number | null;
          farcaster_engagement?: number | null;
          total_impressions?: number | null;
          net_position?: number | null;
          runway_days?: number | null;
          created_at?: string;
        };
      };
      milestones: {
        Row: {
          id: string;
          stage: number;
          label: string;
          category: 'creative' | 'social' | 'economic' | 'technical';
          crit_key: string;
          crit_type: 'count' | 'amount_usdc' | 'ratio' | 'boolean';
          operator: '>=' | '>' | '<=' | '<' | '==' | '!=';
          target: number | null;
          target_bool: boolean | null;
          source: 'events' | 'metrics' | 'manual' | 'social' | 'onchain';
          required: boolean;
          points: number;
          sort_order: number | null;
        };
        Insert: {
          id?: string;
          stage: number;
          label: string;
          category: 'creative' | 'social' | 'economic' | 'technical';
          crit_key: string;
          crit_type: 'count' | 'amount_usdc' | 'ratio' | 'boolean';
          operator: '>=' | '>' | '<=' | '<' | '==' | '!=';
          target?: number | null;
          target_bool?: boolean | null;
          source: 'events' | 'metrics' | 'manual' | 'social' | 'onchain';
          required?: boolean;
          points?: number;
          sort_order?: number | null;
        };
        Update: {
          id?: string;
          stage?: number;
          label?: string;
          category?: 'creative' | 'social' | 'economic' | 'technical';
          crit_key?: string;
          crit_type?: 'count' | 'amount_usdc' | 'ratio' | 'boolean';
          operator?: '>=' | '>' | '<=' | '<' | '==' | '!=';
          target?: number | null;
          target_bool?: boolean | null;
          source?: 'events' | 'metrics' | 'manual' | 'social' | 'onchain';
          required?: boolean;
          points?: number;
          sort_order?: number | null;
        };
      };
      agent_milestones: {
        Row: {
          agent_id: string;
          milestone_id: string;
          completed: boolean;
          completed_at: string | null;
          evidence_url: string | null;
          auto_completed: boolean;
        };
        Insert: {
          agent_id: string;
          milestone_id: string;
          completed?: boolean;
          completed_at?: string | null;
          evidence_url?: string | null;
          auto_completed?: boolean;
        };
        Update: {
          agent_id?: string;
          milestone_id?: string;
          completed?: boolean;
          completed_at?: string | null;
          evidence_url?: string | null;
          auto_completed?: boolean;
        };
      };
    };
  };
}