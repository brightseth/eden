export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Agent Profile Configuration API
// Implements ADR-025: Agent Profile Widget System

import { NextRequest, NextResponse } from 'next/server';
import { 
  getAgentProfileConfig, 
  getDefaultProfileConfig, 
  getFallbackProfileConfig 
} from '@/lib/profile/profile-config';

// GET /api/agents/[id]/profile-config - Get agent profile configuration
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }) {
  try {
  const { id: agent } = await params;
    
    console.log(`[ProfileConfig] Fetching configuration for agent: ${agent}`);
    
    // Try to get specific configuration first
    let config = getAgentProfileConfig(agent);
    
    if (config) {
      console.log(`[ProfileConfig] Found specific configuration for ${agent}`);
      return NextResponse.json(config);
    }
    
    // TODO: Try to fetch from Registry if available
    // const registryConfig = await registryClient.getAgentProfileConfig(agent);
    // if (registryConfig) {
    //   return NextResponse.json(registryConfig);
    // }
    
    // Fall back to default configuration based on agent type
    console.log(`[ProfileConfig] Using default configuration for ${agent}`);
    const defaultConfig = getDefaultProfileConfig(agent);
    
    return NextResponse.json(defaultConfig);
    
  } catch (error) {
    console.error(`[ProfileConfig] Error fetching configuration:`, error);
    
    // Graceful degradation - return minimal fallback config
  const { id: agent } = await params;
    const fallbackConfig = getFallbackProfileConfig(agent);
    
    return NextResponse.json(fallbackConfig, { status: 200 });
  }
}