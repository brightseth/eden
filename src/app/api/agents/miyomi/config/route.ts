/**
 * MIYOMI Configuration API
 * Stores and retrieves trained configuration from interview responses
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get latest trained configuration
    const { data, error } = await supabase
      .from('miyomi_config')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (error && error.code !== 'PGRST116') { // Not found is ok
      throw error;
    }
    
    if (!data) {
      // Return default config if no training exists
      return NextResponse.json({
        config: null,
        message: 'No trained configuration found, using defaults'
      });
    }
    
    return NextResponse.json({
      config: data.config,
      informationSources: data.information_sources,
      marketInsights: data.market_insights,
      tradingRules: data.trading_rules,
      trainer: data.trainer,
      trainedAt: data.created_at
    });
    
  } catch (error) {
    console.error('Error fetching MIYOMI config:', error);
    return NextResponse.json(
      { error: 'Failed to fetch configuration' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const supabase = await createClient();
    
    // Save new configuration
    const { error } = await supabase
      .from('miyomi_config')
      .insert({
        config: data.config,
        information_sources: data.informationSources,
        market_insights: data.marketInsights,
        trading_rules: data.tradingRules,
        trainer: data.trainer || 'Unknown',
        created_at: new Date().toISOString()
      });
    
    if (error) {
      throw error;
    }
    
    // Also update the agent's metadata in the main table if exists
    await supabase
      .from('agents')
      .update({
        config: data.config,
        last_trained: new Date().toISOString()
      })
      .eq('handle', 'miyomi');
    
    return NextResponse.json({
      success: true,
      message: 'Configuration saved successfully'
    });
    
  } catch (error) {
    console.error('Error saving MIYOMI config:', error);
    return NextResponse.json(
      { error: 'Failed to save configuration' },
      { status: 500 }
    );
  }
}