#!/usr/bin/env tsx

/**
 * Test Script: CITIZEN Dune Analytics Integration
 * Verifies the Dune Analytics integration works properly
 */

import { citizenDune } from '../src/lib/agents/citizen-dune-integration';
import { citizenMarketData } from '../src/lib/agents/citizen-market-data';
import { FEATURE_FLAGS, CONFIG, getFeatureFlagStatus } from '../config/flags';

async function testDuneIntegration() {
  console.log('🔍 Testing CITIZEN Dune Analytics Integration');
  console.log('=' .repeat(50));
  
  // 1. Check feature flags and configuration
  console.log('\n📋 Configuration Status:');
  const flagStatus = getFeatureFlagStatus();
  console.log(JSON.stringify(flagStatus, null, 2));
  
  // 2. Test basic Dune data fetch
  console.log('\n🔗 Testing Dune Analytics Data Fetch:');
  try {
    const startTime = Date.now();
    const duneData = await citizenDune.getBrightMomentsData();
    const fetchTime = Date.now() - startTime;
    
    if (duneData) {
      console.log(`✅ Dune data fetched successfully in ${fetchTime}ms`);
      console.log(`📊 Collections tracked: ${duneData.collections.length}`);
      console.log(`💰 Total ecosystem volume: ${duneData.overall_stats.total_volume.toFixed(2)} ETH`);
      console.log(`👥 Total holders: ${duneData.overall_stats.total_holders}`);
      console.log(`🏆 Full Set holders: ${duneData.holder_analysis.full_set_holders}`);
      
      if (duneData.source?.includes('Mock')) {
        console.log('⚠️  Using mock data - configure DUNE_API_KEY for live data');
      } else {
        console.log('🎉 Live Dune Analytics data confirmed!');
      }
    } else {
      console.log('❌ Failed to fetch Dune data');
    }
  } catch (error) {
    console.error('🚫 Error testing Dune data fetch:', error);
  }
  
  // 3. Test market insights
  console.log('\n🧠 Testing Market Insights:');
  try {
    const insights = await citizenDune.getMarketInsights();
    console.log(`📝 Generated ${insights.length} market insights:`);
    insights.forEach((insight, i) => {
      console.log(`   ${i + 1}. ${insight}`);
    });
  } catch (error) {
    console.error('🚫 Error testing market insights:', error);
  }
  
  // 4. Test holder analysis
  console.log('\n👥 Testing Holder Analysis:');
  try {
    const holderData = await citizenDune.getHolderAnalysis();
    if (holderData) {
      console.log(`🏆 Full Set holders: ${holderData.full_set_holders}`);
      console.log(`📊 Multi-collection holders: ${holderData.multi_collection_holders}`);
      console.log(`🎯 Single collection holders: ${holderData.single_collection_holders}`);
      console.log(`💎 Estimated Ultra Set holders: ${holderData.estimated_ultra_set_holders}`);
    }
  } catch (error) {
    console.error('🚫 Error testing holder analysis:', error);
  }
  
  // 5. Test enhanced market insights integration
  console.log('\n🚀 Testing Enhanced Market Integration:');
  try {
    const enhancedInsights = await citizenMarketData.getEnhancedMarketInsights();
    console.log(`🔐 Dune verified: ${enhancedInsights.dune_verified ? '✅' : '❌'}`);
    console.log(`📊 Data confidence: ${enhancedInsights.data_confidence}`);
    console.log(`🔍 Verification status: ${enhancedInsights.verification_status}`);
    
    if (enhancedInsights.on_chain_metrics) {
      console.log('📈 On-chain metrics available:');
      console.log(`   - Ecosystem volume: ${enhancedInsights.on_chain_metrics.total_ecosystem_volume} ETH`);
      console.log(`   - Verified holders: ${enhancedInsights.on_chain_metrics.verified_holder_count}`);
      console.log(`   - Collections tracked: ${enhancedInsights.on_chain_metrics.collections_tracked}`);
    }
  } catch (error) {
    console.error('🚫 Error testing enhanced insights:', error);
  }
  
  // 6. Test data validation
  if (FEATURE_FLAGS.CITIZEN_DATA_VALIDATION) {
    console.log('\n🔍 Testing Data Validation:');
    try {
      const validation = await citizenMarketData.validateDataConsistency();
      console.log(`📊 Consistency score: ${validation.consistency_score}/100`);
      
      if (validation.discrepancies.length > 0) {
        console.log('⚠️  Discrepancies found:');
        validation.discrepancies.forEach(d => console.log(`   - ${d}`));
      } else {
        console.log('✅ No significant data discrepancies');
      }
      
      console.log('💡 Recommendations:');
      validation.recommendations.forEach(r => console.log(`   - ${r}`));
    } catch (error) {
      console.error('🚫 Error testing data validation:', error);
    }
  }
  
  // 7. Performance summary
  console.log('\n⚡ Performance Summary:');
  console.log(`🚀 Dune integration: ${FEATURE_FLAGS.CITIZEN_DUNE_INTEGRATION ? 'ENABLED' : 'DISABLED'}`);
  console.log(`⏱️  Query timeout: ${CONFIG.DUNE_QUERY_TIMEOUT}ms`);
  console.log(`💾 Cache TTL: ${CONFIG.DUNE_DATA_CACHE_TTL}ms`);
  
  console.log('\n🎉 Dune Analytics integration test completed!');
}

// Run the test
if (require.main === module) {
  testDuneIntegration().catch(console.error);
}

export { testDuneIntegration };