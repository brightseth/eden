// Quick test script to verify live market data is working
import { MarketAggregator } from './src/lib/agents/market-connectors.ts';

const marketAggregator = new MarketAggregator();

console.log('Testing live market data...');

marketAggregator.getAllMarkets(10).then(markets => {
  console.log(`\n✅ Found ${markets.length} live markets:`);
  
  markets.forEach((market, i) => {
    console.log(`\n${i + 1}. ${market.platform}: ${market.question}`);
    console.log(`   Volume: $${market.volume.toLocaleString()}`);
    console.log(`   Liquidity: $${market.liquidity.toLocaleString()}`);
    console.log(`   Yes/No: ${market.yes_price}/${market.no_price}`);
    console.log(`   Category: ${market.category}`);
    console.log(`   Status: ${market.status}`);
  });
}).catch(error => {
  console.error('❌ Error fetching live markets:', error);
});