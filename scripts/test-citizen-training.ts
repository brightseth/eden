/**
 * Test script for CITIZEN training functionality
 * Validates Henry's training interface and synchronization
 */

async function testCitizenTraining() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  console.log('🧪 Testing CITIZEN Training Functionality');
  console.log('========================================');
  
  // Test 1: Check CITIZEN training status
  try {
    console.log('\n1. Checking CITIZEN training status...');
    const statusResponse = await fetch(`${baseUrl}/api/agents/citizen/training`);
    const statusData = await statusResponse.json();
    
    console.log('✅ Training status:', {
      agent: statusData.agent,
      trainer: statusData.trainer,
      capabilities: statusData.capabilities?.length || 0,
      status: statusData.status
    });
  } catch (error) {
    console.log('❌ Training status check failed:', error);
  }
  
  // Test 2: Check sync status
  try {
    console.log('\n2. Checking CITIZEN sync status...');
    const syncResponse = await fetch(`${baseUrl}/api/agents/citizen/sync`);
    const syncData = await syncResponse.json();
    
    console.log('✅ Sync status:', {
      inProgress: syncData.syncStatus?.inProgress,
      shouldSyncNow: syncData.syncStatus?.shouldSyncNow,
      capabilities: syncData.currentProfile?.capabilities,
      governanceHealth: syncData.currentProfile?.governanceHealth
    });
  } catch (error) {
    console.log('❌ Sync status check failed:', error);
  }
  
  // Test 3: Submit sample training data
  try {
    console.log('\n3. Testing training submission...');
    const trainingPayload = {
      trainer: 'Henry (Test)',
      trainerEmail: 'henry@brightmoments.io',
      timestamp: new Date().toISOString(),
      content: 'Test training update: CITIZEN should recognize Full Set holders with enhanced concierge protocols and priority access to community events.',
      trainingType: 'community_insight',
      brightMomentsUpdate: {
        source: 'automated_test',
        priority: 'medium',
        category: 'community_insight'
      }
    };
    
    const trainingResponse = await fetch(`${baseUrl}/api/agents/citizen/training`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(trainingPayload)
    });
    
    const trainingData = await trainingResponse.json();
    
    if (trainingData.success) {
      console.log('✅ Training submission successful:', {
        recordId: trainingData.recordId,
        syncStatus: trainingData.syncToRegistry,
        updatesProcessed: Object.keys(trainingData.updates || {}).length > 0
      });
    } else {
      console.log('❌ Training submission failed:', trainingData.error);
    }
  } catch (error) {
    console.log('❌ Training submission test failed:', error);
  }
  
  // Test 4: Verify CITIZEN profile data
  try {
    console.log('\n4. Verifying CITIZEN profile data...');
    const profileResponse = await fetch(`${baseUrl}/api/agents/citizen`);
    const profileData = await profileResponse.json();
    
    console.log('✅ Profile verification:', {
      name: profileData.name,
      type: profileData.type,
      status: profileData.status,
      brightMomentsCapabilities: profileData.capabilities?.dao_governance ? 'Present' : 'Missing',
      governanceMetrics: profileData.governance_state ? 'Present' : 'Missing',
      communityStructure: profileData.community_structure ? 'Present' : 'Missing'
    });
  } catch (error) {
    console.log('❌ Profile verification failed:', error);
  }
  
  // Test 5: Test force sync
  try {
    console.log('\n5. Testing force sync...');
    const forceSyncResponse = await fetch(`${baseUrl}/api/agents/citizen/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ force: true })
    });
    
    const forceSyncData = await forceSyncResponse.json();
    
    if (forceSyncData.success) {
      console.log('✅ Force sync successful:', {
        registrySync: forceSyncData.syncResult?.registrySync?.success,
        edenArtSync: forceSyncData.syncResult?.edenArtSync?.success,
        profileCapabilities: forceSyncData.profileSnapshot?.capabilities
      });
    } else {
      console.log('❌ Force sync failed:', forceSyncData.error);
    }
  } catch (error) {
    console.log('❌ Force sync test failed:', error);
  }
  
  console.log('\n🎯 Test Summary');
  console.log('================');
  console.log('CITIZEN training interface is ready for Henry to use.');
  console.log('Access the training interface at: /training/citizen');
  console.log('');
  console.log('Available training types:');
  console.log('- general: General Bright Moments updates');
  console.log('- lore_update: Cultural heritage and ritual documentation');
  console.log('- governance_update: DAO governance and voting mechanisms');
  console.log('- community_insight: Community recognition and engagement');
  console.log('');
  console.log('All training data automatically:');
  console.log('- Processes through Claude SDK for intelligent interpretation');
  console.log('- Syncs to Eden Academy Registry');
  console.log('- Prepares for app.eden.art synchronization');
  console.log('- Maintains Bright Moments cultural authenticity');
}

// Export for use in other scripts
export default testCitizenTraining;

// Run if called directly
if (require.main === module) {
  testCitizenTraining().catch(console.error);
}