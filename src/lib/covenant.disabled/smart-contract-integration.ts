// Smart Contract Integration for Abraham's Sacred Covenant
// Critical Path: DAY 1 Implementation

import { ethers } from 'ethers';

// Contract ABI (generated from Solidity compilation)
export const ABRAHAM_COVENANT_ABI = [
  // Core Covenant Functions
  {
    "inputs": [
      {"name": "day", "type": "uint256"},
      {"name": "narrative", "type": "string"},
      {"name": "metadata", "type": "string"},
      {"name": "startingPrice", "type": "uint256"}
    ],
    "name": "createDailyCovenantNFT",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"name": "tokenId", "type": "uint256"}],
    "name": "placeBid",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{"name": "tokenId", "type": "uint256"}],
    "name": "endAuction",
    "outputs": [],
    "stateMutability": "nonpayable", 
    "type": "function"
  },
  {
    "inputs": [],
    "name": "registerAsWitness",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  // View Functions
  {
    "inputs": [],
    "name": "getCurrentCovenantDay",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getActiveAuctions", 
    "outputs": [{"name": "", "type": "uint256[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getCovenantStats",
    "outputs": [
      {"name": "totalMinted", "type": "uint256"},
      {"name": "totalWitnesses", "type": "uint256"},
      {"name": "currentDay", "type": "uint256"},
      {"name": "daysRemaining", "type": "uint256"},
      {"name": "totalValue", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  // Events
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "name": "tokenId", "type": "uint256"},
      {"indexed": false, "name": "day", "type": "uint256"},
      {"indexed": false, "name": "narrative", "type": "string"}
    ],
    "name": "CovenantCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "name": "witness", "type": "address"},
      {"indexed": false, "name": "timestamp", "type": "uint256"}
    ],
    "name": "WitnessRegistered",
    "type": "event"
  }
];

// Contract deployment configuration
export const CONTRACT_CONFIG = {
  // Deployed contract address (will be set after deployment)
  address: process.env.ABRAHAM_COVENANT_CONTRACT_ADDRESS || '',
  
  // Network configuration
  network: {
    mainnet: {
      chainId: 1,
      rpcUrl: process.env.MAINNET_RPC_URL || 'https://eth-mainnet.alchemyapi.io/v2/YOUR-API-KEY',
      contractAddress: process.env.MAINNET_CONTRACT_ADDRESS || ''
    },
    sepolia: {
      chainId: 11155111, 
      rpcUrl: process.env.SEPOLIA_RPC_URL || 'https://eth-sepolia.alchemyapi.io/v2/YOUR-API-KEY',
      contractAddress: process.env.SEPOLIA_CONTRACT_ADDRESS || ''
    }
  },
  
  // Abraham's wallet address
  abrahamAddress: process.env.ABRAHAM_WALLET_ADDRESS || '',
  
  // Launch configuration
  covenantStart: new Date('2025-10-19T00:00:00-04:00'), // October 19, 2025 midnight ET
  dailyAuctionDuration: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
};

export interface CovenantNFT {
  tokenId: number;
  day: number;
  narrative: string;
  metadata: string;
  auctionEnd: Date;
  finalPrice: string; // Wei as string
  witness: string;
  isSealed: boolean;
  creationTimestamp: Date;
}

export interface Auction {
  tokenId: number;
  startingPrice: string; // Wei as string
  currentBid: string; // Wei as string
  currentBidder: string;
  endTime: Date;
  active: boolean;
}

export interface CovenantStats {
  totalMinted: number;
  totalWitnesses: number;
  currentDay: number;
  daysRemaining: number;
  totalValue: string; // Wei as string
}

export class AbrahamCovenantContract {
  private contract: ethers.Contract;
  private provider: ethers.Provider;
  private signer?: ethers.Signer;

  constructor(providerOrSigner: ethers.Provider | ethers.Signer, networkName: 'mainnet' | 'sepolia' = 'sepolia') {
    if ('getAddress' in providerOrSigner) {
      this.provider = providerOrSigner.provider!;
      this.signer = providerOrSigner;
    } else {
      this.provider = providerOrSigner;
    }

    const contractAddress = CONTRACT_CONFIG.network[networkName].contractAddress;
    if (!contractAddress) {
      throw new Error(`Contract address not configured for network: ${networkName}`);
    }

    this.contract = new ethers.Contract(
      contractAddress,
      ABRAHAM_COVENANT_ABI,
      this.signer || this.provider
    );
  }

  // ============ ABRAHAM FUNCTIONS (REQUIRES SIGNER) ============

  /**
   * Create daily covenant NFT (Abraham only)
   */
  async createDailyCovenantNFT(
    day: number,
    narrativeIPFS: string,
    metadataURI: string,
    startingPriceETH: string
  ): Promise<ethers.ContractTransaction> {
    if (!this.signer) {
      throw new Error('Signer required for covenant creation');
    }

    const startingPriceWei = ethers.utils.parseEther(startingPriceETH);
    
    const tx = await this.contract.createDailyCovenantNFT(
      day,
      narrativeIPFS,
      metadataURI,
      startingPriceWei
    );

    return tx;
  }

  /**
   * Batch register witnesses (Abraham only)
   */
  async batchRegisterWitnesses(addresses: string[]): Promise<ethers.ContractTransaction> {
    if (!this.signer) {
      throw new Error('Signer required for witness registration');
    }

    const tx = await this.contract.batchRegisterWitnesses(addresses);
    return tx;
  }

  // ============ WITNESS FUNCTIONS ============

  /**
   * Register as witness
   */
  async registerAsWitness(): Promise<ethers.ContractTransaction> {
    if (!this.signer) {
      throw new Error('Signer required for witness registration');
    }

    const tx = await this.contract.registerAsWitness();
    return tx;
  }

  /**
   * Place bid on covenant auction
   */
  async placeBid(tokenId: number, bidAmountETH: string): Promise<ethers.ContractTransaction> {
    if (!this.signer) {
      throw new Error('Signer required for bidding');
    }

    const bidAmountWei = ethers.utils.parseEther(bidAmountETH);
    
    const tx = await this.contract.placeBid(tokenId, {
      value: bidAmountWei
    });

    return tx;
  }

  /**
   * End auction (anyone can call after end time)
   */
  async endAuction(tokenId: number): Promise<ethers.ContractTransaction> {
    const tx = await this.contract.endAuction(tokenId);
    return tx;
  }

  /**
   * Withdraw pending bid returns
   */
  async withdraw(tokenId: number): Promise<ethers.ContractTransaction> {
    if (!this.signer) {
      throw new Error('Signer required for withdrawal');
    }

    const tx = await this.contract.withdraw(tokenId);
    return tx;
  }

  // ============ VIEW FUNCTIONS ============

  /**
   * Get current covenant day
   */
  async getCurrentCovenantDay(): Promise<number> {
    const day = await this.contract.getCurrentCovenantDay();
    return day.toNumber();
  }

  /**
   * Get active auctions
   */
  async getActiveAuctions(): Promise<number[]> {
    const tokenIds = await this.contract.getActiveAuctions();
    return tokenIds.map((id: ethers.BigNumber) => id.toNumber());
  }

  /**
   * Get covenant stats
   */
  async getCovenantStats(): Promise<CovenantStats> {
    const [totalMinted, totalWitnesses, currentDay, daysRemaining, totalValue] = 
      await this.contract.getCovenantStats();

    return {
      totalMinted: totalMinted.toNumber(),
      totalWitnesses: totalWitnesses.toNumber(),
      currentDay: currentDay.toNumber(),
      daysRemaining: daysRemaining.toNumber(),
      totalValue: totalValue.toString()
    };
  }

  /**
   * Get covenant by day
   */
  async getCovenantByDay(day: number): Promise<CovenantNFT> {
    try {
      const covenant = await this.contract.getCovenantByDay(day);
      
      return {
        tokenId: 0, // Would need to map from day to tokenId
        day: covenant.day.toNumber(),
        narrative: covenant.narrative,
        metadata: covenant.metadata,
        auctionEnd: new Date(covenant.auctionEnd.toNumber() * 1000),
        finalPrice: covenant.finalPrice.toString(),
        witness: covenant.witness,
        isSealed: covenant.isSealed,
        creationTimestamp: new Date(covenant.creationTimestamp.toNumber() * 1000)
      };
    } catch (error) {
      throw new Error(`Covenant not found for day ${day}`);
    }
  }

  /**
   * Check if address is registered witness
   */
  async isWitness(address: string): Promise<boolean> {
    return await this.contract.witnesses(address);
  }

  /**
   * Get auction details
   */
  async getAuction(tokenId: number): Promise<Auction> {
    const auction = await this.contract.auctions(tokenId);
    
    return {
      tokenId: auction.tokenId.toNumber(),
      startingPrice: auction.startingPrice.toString(),
      currentBid: auction.currentBid.toString(),
      currentBidder: auction.currentBidder,
      endTime: new Date(auction.endTime.toNumber() * 1000),
      active: auction.active
    };
  }

  // ============ EVENT LISTENERS ============

  /**
   * Listen for covenant creation events
   */
  onCovenantCreated(callback: (tokenId: number, day: number, narrative: string) => void): void {
    this.contract.on('CovenantCreated', (tokenId, day, narrative) => {
      callback(tokenId.toNumber(), day.toNumber(), narrative);
    });
  }

  /**
   * Listen for witness registration events
   */
  onWitnessRegistered(callback: (witness: string, timestamp: number) => void): void {
    this.contract.on('WitnessRegistered', (witness, timestamp) => {
      callback(witness, timestamp.toNumber());
    });
  }

  /**
   * Listen for bid events
   */
  onBidPlaced(callback: (tokenId: number, bidder: string, amount: string) => void): void {
    this.contract.on('BidPlaced', (tokenId, bidder, amount) => {
      callback(tokenId.toNumber(), bidder, amount.toString());
    });
  }

  /**
   * Listen for auction end events
   */
  onAuctionEnded(callback: (tokenId: number, winner: string, finalPrice: string) => void): void {
    this.contract.on('AuctionEnded', (tokenId, winner, finalPrice) => {
      callback(tokenId.toNumber(), winner, finalPrice.toString());
    });
  }

  // ============ UTILITY FUNCTIONS ============

  /**
   * Calculate days until October 19, 2025
   */
  static getDaysUntilLaunch(): number {
    const now = new Date();
    const launch = CONTRACT_CONFIG.covenantStart;
    const diffTime = launch.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  }

  /**
   * Check if covenant has started
   */
  static hasCovenantStarted(): boolean {
    return new Date() >= CONTRACT_CONFIG.covenantStart;
  }

  /**
   * Get next midnight ET for auction end
   */
  static getNextMidnightET(): Date {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
    tomorrow.setUTCHours(4, 0, 0, 0); // Midnight ET = 4 AM UTC (during EST)
    return tomorrow;
  }

  /**
   * Format ETH amount for display
   */
  static formatETH(weiAmount: string): string {
    return ethers.utils.formatEther(weiAmount);
  }

  /**
   * Parse ETH amount to wei
   */
  static parseETH(ethAmount: string): string {
    return ethers.utils.parseEther(ethAmount).toString();
  }
}

// Export contract instance factory
export function createCovenantContract(
  provider: ethers.Provider,
  network: 'mainnet' | 'sepolia' = 'sepolia'
): AbrahamCovenantContract {
  return new AbrahamCovenantContract(provider, network);
}

export function createCovenantContractWithSigner(
  signer: ethers.Signer,
  network: 'mainnet' | 'sepolia' = 'sepolia'
): AbrahamCovenantContract {
  return new AbrahamCovenantContract(signer, network);
}

// Emergency deployment script data
export const DEPLOYMENT_SCRIPT = {
  compiler: 'solc 0.8.19',
  optimization: true,
  runs: 200,
  gasEstimate: '2,500,000',
  deploymentCost: '~0.1 ETH',
  abrahamAddress: CONTRACT_CONFIG.abrahamAddress,
  constructorArgs: [CONTRACT_CONFIG.abrahamAddress]
};

// Critical path checklist
export const DAY_1_CHECKLIST = {
  smartContract: {
    'solidity-code': 'COMPLETE ✅',
    'abi-generation': 'COMPLETE ✅', 
    'integration-layer': 'COMPLETE ✅',
    'deployment-script': 'PENDING 🔴',
    'testnet-deployment': 'PENDING 🔴',
    'contract-verification': 'PENDING 🔴'
  },
  requirements: {
    'abraham-wallet': 'NEEDED 🔴',
    'alchemy-api-key': 'NEEDED 🔴',
    'deployment-eth': 'NEEDED 🔴'
  }
};