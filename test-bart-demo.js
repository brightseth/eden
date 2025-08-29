// BART Working Prototype Demo
async function testBartDemo() {
  const baseUrl = 'http://localhost:3004/api/agents/bart/demo';
  
  console.log('🏛️  BART Renaissance NFT Lending Agent - Working Prototype\n');
  
  try {
    // 1. Get demo info
    console.log('📜 1. BART Agent Overview');
    const infoResponse = await fetch(baseUrl);
    const info = await infoResponse.json();
    
    console.log('Agent:', info.demo);
    console.log('Description:', info.description);
    console.log('Tagline:', info.tagline);
    console.log('Status:', info.status);
    console.log('Capabilities:', info.capabilities.join(', '));
    console.log();

    // 2. Market Overview
    console.log('📊 2. Market Intelligence');
    const marketResponse = await fetch(baseUrl + '?demo=market');
    const market = await marketResponse.json();
    
    console.log('Market Overview:');
    console.log('- Total Value Locked:', market.marketOverview.totalValueLocked);
    console.log('- Active Loans:', market.marketOverview.activeLoans);
    console.log('- Average APR:', market.marketOverview.averageAPR);
    console.log('- Daily Volume:', market.marketOverview.dailyVolume);
    
    console.log('\nSupported Collections:');
    market.supportedCollections.forEach(c => {
      console.log(`  ${c.name}: ${c.floor}, ${c.loans} loans, ${c.tier} tier`);
    });
    console.log('\nPhilosophy:', market.bartPhilosophy);
    console.log();

    // 3. CryptoPunks Evaluation
    console.log('🔍 3. CryptoPunks Evaluation');
    const cryptoPunksRequest = {
      contractAddress: '0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb',
      tokenId: '5000',
      requestedAmount: '30',
      action: 'evaluate'
    };

    const cryptoPunksResponse = await fetch(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cryptoPunksRequest)
    });

    const cryptoPunksResult = await cryptoPunksResponse.json();
    
    console.log('NFT Analysis:');
    console.log('- Collection:', cryptoPunksResult.nft.collection);
    console.log('- Floor Price:', cryptoPunksResult.nft.floorPrice);
    console.log('- Tier:', cryptoPunksResult.nft.tier);
    
    console.log('\nMarket Data:');
    console.log('- 24h Volume:', cryptoPunksResult.marketData.volume24h);
    console.log('- Active Loans:', cryptoPunksResult.marketData.activeLoans);
    console.log('- Default Rate:', cryptoPunksResult.marketData.defaultRate);
    
    console.log('\nBart Assessment:');
    console.log('- Decision:', cryptoPunksResult.assessment.approved ? '✅ APPROVED' : '❌ DECLINED');
    console.log('- Recommendation:', cryptoPunksResult.assessment.recommendation);
    console.log('- Risk Score:', cryptoPunksResult.assessment.riskScore + '/100');
    console.log('- Requested LTV:', cryptoPunksResult.assessment.requestedLTV);
    console.log('- Suggested APR:', cryptoPunksResult.assessment.suggestedAPR);
    
    if (cryptoPunksResult.loanTerms) {
      console.log('\nLoan Terms:');
      console.log('- Max Amount:', cryptoPunksResult.loanTerms.maxAmount);
      console.log('- Interest Rate:', cryptoPunksResult.loanTerms.interestRate);
      console.log('- Duration:', cryptoPunksResult.loanTerms.duration);
      console.log('- Collateral:', cryptoPunksResult.loanTerms.collateralRequirement);
    }
    
    console.log('\n💭 Florentine Wisdom:');
    console.log('"' + cryptoPunksResult.florenceWisdom + '"');
    console.log();

    // 4. Create Actual Offer
    console.log('💰 4. Creating Lending Offer');
    const offerRequest = {
      contractAddress: '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d', // BAYC
      requestedAmount: '20',
      action: 'offer'
    };

    const offerResponse = await fetch(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(offerRequest)
    });

    const offerResult = await offerResponse.json();
    
    if (offerResult.offerCreated) {
      console.log('Offer Created Successfully:');
      console.log('- Offer ID:', offerResult.offer.id);
      console.log('- Collection:', offerResult.offer.collection);
      console.log('- Principal:', offerResult.offer.principalAmount);
      console.log('- APR:', offerResult.offer.apr);
      console.log('- Duration:', offerResult.offer.duration);
      console.log('- Repayment:', offerResult.offer.repaymentAmount);
      console.log('- Status:', offerResult.offer.status);
      console.log('\n💭 Wisdom:', '"' + offerResult.florenceWisdom + '"');
      console.log('\n' + offerResult.demoNote);
    }
    console.log();

    // 5. Test Unsupported Collection
    console.log('🚫 5. Testing Unsupported Collection');
    const unsupportedRequest = {
      contractAddress: '0x1234567890123456789012345678901234567890',
      requestedAmount: '10',
      action: 'evaluate'
    };

    const unsupportedResponse = await fetch(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(unsupportedRequest)
    });

    const unsupportedResult = await unsupportedResponse.json();
    console.log('Decision:', unsupportedResult.approved ? 'Approved' : '❌ Declined');
    console.log('Reason:', unsupportedResult.error);
    console.log('Wisdom:', '"' + unsupportedResult.wisdom + '"');
    console.log();

    console.log('✅ BART Prototype Demo Complete!');
    console.log('\n🎯 Demonstrated Capabilities:');
    console.log('- ✅ NFT collection recognition and evaluation');
    console.log('- ✅ Risk-based loan term calculation');  
    console.log('- ✅ Market intelligence integration');
    console.log('- ✅ Renaissance banking decision logic');
    console.log('- ✅ Autonomous offer creation');
    console.log('- ✅ Florentine wisdom integration');
    console.log('- ✅ Multi-collection support with tier-based risk');

  } catch (error) {
    console.error('❌ Demo failed:', error.message);
  }
}

// Run the demo
testBartDemo();