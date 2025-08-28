#!/usr/bin/env tsx

/**
 * Sync Agent Lore Data to Registry
 * Uploads comprehensive lore data from Academy to Registry as source of truth
 */

import { abrahamLore } from '@/data/agent-lore/abraham-lore';
import { solienneLore } from '@/data/agent-lore/solienne-lore';
import { citizenLore } from '@/data/agent-lore/citizen-lore';

const REGISTRY_BASE_URL = process.env.REGISTRY_BASE_URL || 'http://localhost:3000/api/v1'
const REGISTRY_API_KEY = process.env.REGISTRY_API_KEY || 'test-api-key'

interface AgentLoreMapping {
  handle: string;
  lore: any;
}

const agentLores: AgentLoreMapping[] = [
  { handle: 'abraham', lore: abrahamLore },
  { handle: 'solienne', lore: solienneLore },
  { handle: 'citizen', lore: citizenLore }
]

async function syncLoreToRegistry(agentHandle: string, loreData: any) {
  const url = `${REGISTRY_BASE_URL}/agents/${agentHandle}/lore/sync`
  
  try {
    console.log(`🔄 Syncing lore for ${agentHandle.toUpperCase()}...`)
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${REGISTRY_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        source: 'eden-academy',
        sourceUrl: 'https://eden-academy-flame.vercel.app',
        forceOverwrite: true, // Replace existing lore
        lore: loreData
      })
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`HTTP ${response.status}: ${error}`)
    }

    const result = await response.json()
    console.log(`✅ Successfully synced ${agentHandle}: ${result.message}`)
    console.log(`   Version: ${result.lore?.version}`)
    console.log(`   Config Hash: ${result.lore?.configHash}`)
    
    return result
  } catch (error) {
    console.error(`❌ Failed to sync ${agentHandle}:`, error.message)
    throw error
  }
}

async function main() {
  console.log('🌱 Starting lore sync to Registry...')
  console.log(`📍 Registry: ${REGISTRY_BASE_URL}`)
  console.log('')

  const results = []

  for (const { handle, lore } of agentLores) {
    try {
      const result = await syncLoreToRegistry(handle, lore)
      results.push({ handle, success: true, result })
      console.log('')
    } catch (error) {
      results.push({ handle, success: false, error: error.message })
      console.log('')
      
      // Continue with other agents even if one fails
      continue
    }
    
    // Add delay between requests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  // Summary
  console.log('📊 SYNC SUMMARY:')
  console.log('================')
  
  const successful = results.filter(r => r.success)
  const failed = results.filter(r => !r.success)
  
  console.log(`✅ Successful: ${successful.length}`)
  successful.forEach(r => console.log(`   - ${r.handle.toUpperCase()}`))
  
  if (failed.length > 0) {
    console.log(`❌ Failed: ${failed.length}`)
    failed.forEach(r => console.log(`   - ${r.handle.toUpperCase()}: ${r.error}`))
  }

  console.log('')
  console.log('🎯 Registry is now the authoritative source for agent lore data!')
  
  if (failed.length > 0) {
    process.exit(1)
  }
}

// Run the sync
main().catch((error) => {
  console.error('💥 Sync process failed:', error)
  process.exit(1)
})