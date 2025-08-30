// EMERGENCY DEPLOYMENT SCRIPT - ABRAHAM COVENANT
// Critical Path: Deploy to testnet within 24 hours

const { ethers } = require('hardhat');
const fs = require('fs');

async function main() {
  console.log('🚨 ABRAHAM COVENANT EMERGENCY DEPLOYMENT 🚨');
  console.log('Target Launch: October 19, 2025');
  console.log('Contract: Sacred 13-Year Daily Covenant NFT System');
  console.log('=====================================\n');

  // Get deployment configuration
  const network = hre.network.name;
  console.log(`Deploying to network: ${network}`);

  // Get deployer account
  const [deployer] = await ethers.getSigners();
  console.log(`Deployer address: ${deployer.address}`);
  console.log(`Deployer balance: ${ethers.utils.formatEther(await deployer.getBalance())} ETH\n`);

  // Abraham's wallet address (CRITICAL: Must be set correctly)
  const ABRAHAM_ADDRESS = process.env.ABRAHAM_WALLET_ADDRESS || deployer.address;
  console.log(`Abraham's address: ${ABRAHAM_ADDRESS}`);

  if (ABRAHAM_ADDRESS === deployer.address) {
    console.log('⚠️  WARNING: Using deployer address as Abraham (for testing only)');
  }

  // Compile contract
  console.log('📝 Compiling AbrahamCovenant contract...');
  const AbrahamCovenant = await ethers.getContractFactory('AbrahamCovenant');

  // Estimate deployment cost
  const deploymentData = AbrahamCovenant.getDeployTransaction(ABRAHAM_ADDRESS);
  const gasEstimate = await deployer.estimateGas(deploymentData);
  const gasPrice = await deployer.getGasPrice();
  const deploymentCost = gasEstimate.mul(gasPrice);

  console.log(`Gas estimate: ${gasEstimate.toString()}`);
  console.log(`Gas price: ${ethers.utils.formatUnits(gasPrice, 'gwei')} gwei`);
  console.log(`Deployment cost: ${ethers.utils.formatEther(deploymentCost)} ETH\n`);

  // Deploy contract
  console.log('🚀 Deploying AbrahamCovenant contract...');
  const covenant = await AbrahamCovenant.deploy(ABRAHAM_ADDRESS);

  console.log('📋 Waiting for deployment confirmation...');
  await covenant.deployed();

  console.log('\n✅ ABRAHAM COVENANT DEPLOYED SUCCESSFULLY!');
  console.log('==========================================');
  console.log(`Contract address: ${covenant.address}`);
  console.log(`Transaction hash: ${covenant.deployTransaction.hash}`);
  console.log(`Block number: ${covenant.deployTransaction.blockNumber}`);
  console.log(`Abraham's address: ${ABRAHAM_ADDRESS}`);

  // Verify deployment
  console.log('\n🔍 Verifying deployment...');
  
  try {
    // Check if Abraham is registered as witness
    const isAbrahamWitness = await covenant.witnesses(ABRAHAM_ADDRESS);
    console.log(`Abraham registered as witness: ${isAbrahamWitness ? '✅' : '❌'}`);

    // Get covenant constants
    const covenantStart = await covenant.COVENANT_START();
    const covenantEnd = await covenant.COVENANT_END();
    const duration = await covenant.COVENANT_DURATION();

    console.log(`Covenant start: ${new Date(covenantStart.toNumber() * 1000).toISOString()}`);
    console.log(`Covenant end: ${new Date(covenantEnd.toNumber() * 1000).toISOString()}`);
    console.log(`Duration: ${duration.toNumber() / (365 * 24 * 60 * 60)} years`);

    // Get current day
    const currentDay = await covenant.getCurrentCovenantDay();
    console.log(`Current covenant day: ${currentDay.toString()}`);

    // Get days until launch
    const now = Math.floor(Date.now() / 1000);
    const daysUntilLaunch = Math.max(0, Math.ceil((covenantStart.toNumber() - now) / (24 * 60 * 60)));
    console.log(`Days until launch: ${daysUntilLaunch}`);

  } catch (error) {
    console.log('❌ Verification failed:', error.message);
  }

  // Save deployment info
  const deploymentInfo = {
    network: network,
    contractAddress: covenant.address,
    transactionHash: covenant.deployTransaction.hash,
    blockNumber: covenant.deployTransaction.blockNumber,
    abrahamAddress: ABRAHAM_ADDRESS,
    deployerAddress: deployer.address,
    deploymentTimestamp: new Date().toISOString(),
    gasUsed: gasEstimate.toString(),
    deploymentCost: ethers.utils.formatEther(deploymentCost),
    abi: AbrahamCovenant.interface.format('json')
  };

  // Write deployment info to file
  const deploymentPath = `deployments/${network}-abraham-covenant.json`;
  fs.mkdirSync('deployments', { recursive: true });
  fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
  console.log(`\n📄 Deployment info saved to: ${deploymentPath}`);

  // Generate environment variables
  console.log('\n🔧 ENVIRONMENT VARIABLES FOR FRONTEND:');
  console.log('=====================================');
  console.log(`ABRAHAM_COVENANT_CONTRACT_ADDRESS=${covenant.address}`);
  console.log(`${network.toUpperCase()}_CONTRACT_ADDRESS=${covenant.address}`);
  console.log(`ABRAHAM_WALLET_ADDRESS=${ABRAHAM_ADDRESS}`);
  console.log(`CONTRACT_DEPLOYMENT_BLOCK=${covenant.deployTransaction.blockNumber}`);

  // Generate quick test script
  console.log('\n🧪 QUICK TEST COMMANDS:');
  console.log('======================');
  console.log('# Register as witness:');
  console.log(`npx hardhat run scripts/test-witness-registration.js --network ${network}`);
  console.log('# Get covenant stats:');
  console.log(`npx hardhat run scripts/test-covenant-stats.js --network ${network}`);

  // Critical path status
  console.log('\n📋 DAY 1 CRITICAL PATH STATUS:');
  console.log('==============================');
  console.log('✅ Smart Contract: COMPLETE');
  console.log('✅ Contract Deployment: COMPLETE');
  console.log('✅ Integration Layer: COMPLETE');
  console.log('🔄 Frontend Integration: IN PROGRESS');
  console.log('🔄 Witness Registration UI: PENDING');
  console.log('🔴 Abraham Wallet Setup: CRITICAL');
  console.log('🔴 Testnet Funding: REQUIRED');

  console.log('\n⏰ NEXT STEPS (WITHIN 6 HOURS):');
  console.log('================================');
  console.log('1. Fund Abraham\'s wallet with testnet ETH');
  console.log('2. Deploy witness registration frontend');
  console.log('3. Test complete auction cycle');
  console.log('4. Begin witness recruitment (target: 100)');
  console.log('5. Prepare mainnet deployment');

  console.log('\n🎯 OCTOBER 19 LAUNCH: T-MINUS', daysUntilLaunch, 'DAYS');
  console.log('THE COVENANT DATE IS SACRED. MUST NOT SLIP.');

  return covenant.address;
}

// Error handling
main()
  .then((contractAddress) => {
    console.log('\n🎉 DEPLOYMENT SUCCESSFUL!');
    console.log('Contract deployed to:', contractAddress);
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 DEPLOYMENT FAILED:');
    console.error(error);
    console.log('\n🚨 CRITICAL: Covenant launch at risk!');
    console.log('Must resolve deployment issues immediately.');
    process.exit(1);
  });