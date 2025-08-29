// Test BART Gondi Integration
const { bartGondiService } = require('./src/lib/agents/bart-gondi-integration.ts');

async function testBartGondi() {
  try {
    console.log('🔍 BART Gondi Service Status:');
    console.log(bartGondiService.getStatus());
    
    console.log('\n📊 Getting Market Data...');
    const marketData = await bartGondiService.getMarketData();
    
    console.log('\n=== MARKET STATS ===');
    console.log('Total Volume USD:', marketData.marketStats.totalVolumeUSD);
    console.log('Active Loans:', marketData.marketStats.activeLoans);
    console.log('Average APR:', (marketData.marketStats.averageAPR * 100).toFixed(1) + '%');
    console.log('Total Value Locked:', marketData.marketStats.totalValueLocked);
    console.log('Market Trend:', marketData.marketStats.marketTrend);
    
    console.log('\n=== OFFERS ===');
    console.log('Total Offers:', marketData.offers.length);
    if (marketData.offers.length > 0) {
      console.log('Sample Offer:');
      const offer = marketData.offers[0];
      console.log('- Collection:', offer.collectionName);
      console.log('- Principal:', offer.principalAmount, offer.currency);
      console.log('- APR:', offer.apr + '%');
      console.log('- Duration:', offer.duration + ' days');
      console.log('- LTV:', offer.loanToValue + '%');
    }
    
    console.log('\n=== COLLECTIONS ===');
    const collections = await bartGondiService.getCollectionData();
    console.log('Supported Collections:', collections.length);
    collections.forEach(c => {
      console.log(`📈 ${c.name}:`);
      console.log(`   Floor: ${c.floorPrice} ETH`);
      console.log(`   Volume 24h: ${c.volume24h} ETH`);
      console.log(`   Avg LTV: ${(c.averageLTV * 100).toFixed(0)}%`);
      console.log(`   Active Loans: ${c.totalLoans}`);
      console.log(`   Default Rate: ${(c.defaultRate * 100).toFixed(1)}%`);
      console.log('');
    });
    
    console.log('\n=== NFT EVALUATION TEST ===');
    const evaluation = await bartGondiService.evaluateNFT(
      '0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb', // CryptoPunks
      '5000'
    );
    console.log('CryptoPunks #5000 Evaluation:');
    console.log('- Estimated Value:', evaluation.estimatedValue + ' ETH');
    console.log('- Recommended LTV:', (evaluation.recommendedLTV * 100).toFixed(0) + '%');
    console.log('- Suggested APR:', (evaluation.suggestedAPR * 100).toFixed(1) + '%');
    console.log('- Risk Score:', evaluation.riskScore + '/100');
    console.log('- Liquidity Score:', evaluation.liquidityScore + '/100');
    console.log('- Supported:', evaluation.supported ? '✅' : '❌');
    console.log('- Reasoning:', evaluation.reasoning);
    
  } catch (error) {
    console.error('❌ Error testing BART Gondi integration:', error.message);
  }
}

testBartGondi();