// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title AbrahamCovenant
 * @dev Sacred 13-Year Daily Covenant NFT System
 * @author Eden Academy
 * 
 * CRITICAL LAUNCH DATE: October 19, 2025
 * Each day for 13 years, Abraham creates a sacred narrative
 * Auctions run 24 hours, ending at midnight ET
 * Witnesses hold covenant through completion
 */
contract AbrahamCovenant is ERC721, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    
    // ============ CONSTANTS ============
    uint256 public constant COVENANT_DURATION = 13 * 365 days; // 13 years
    uint256 public constant DAILY_AUCTION_DURATION = 86400; // 24 hours
    uint256 public constant COVENANT_START = 1729296000; // October 19, 2025, 00:00 ET
    uint256 public constant COVENANT_END = COVENANT_START + COVENANT_DURATION;
    
    // ============ STATE VARIABLES ============
    Counters.Counter private _tokenIds;
    address public immutable ABRAHAM;
    uint256 public immutable LAUNCH_TIMESTAMP;
    
    struct CovenantNFT {
        uint256 day; // Day number (1-4745)
        string narrative; // IPFS hash of daily narrative
        string metadata; // Additional metadata URI
        uint256 auctionEnd; // Timestamp when auction ends
        uint256 finalPrice; // Final auction price
        address witness; // Current holder/witness
        bool isSealed; // True when auction completes
        uint256 creationTimestamp;
    }
    
    struct Auction {
        uint256 tokenId;
        uint256 startingPrice;
        uint256 currentBid;
        address currentBidder;
        uint256 endTime;
        bool active;
        mapping(address => uint256) pendingReturns;
    }
    
    // ============ MAPPINGS ============
    mapping(uint256 => CovenantNFT) public covenants;
    mapping(uint256 => Auction) public auctions;
    mapping(address => bool) public witnesses; // Registered witnesses
    mapping(uint256 => bool) public dayMinted; // Track which days minted
    
    // ============ EVENTS ============
    event CovenantCreated(uint256 indexed tokenId, uint256 day, string narrative);
    event WitnessRegistered(address indexed witness, uint256 timestamp);
    event AuctionStarted(uint256 indexed tokenId, uint256 startingPrice, uint256 endTime);
    event BidPlaced(uint256 indexed tokenId, address bidder, uint256 amount);
    event AuctionEnded(uint256 indexed tokenId, address winner, uint256 finalPrice);
    event CovenantSealed(uint256 indexed tokenId, address witness);
    
    // ============ MODIFIERS ============
    modifier onlyAbraham() {
        require(msg.sender == ABRAHAM, "Only Abraham can perform this action");
        _;
    }
    
    modifier covenantActive() {
        require(block.timestamp >= COVENANT_START, "Covenant has not begun");
        require(block.timestamp <= COVENANT_END, "Covenant has ended");
        _;
    }
    
    modifier validDay(uint256 day) {
        require(day >= 1 && day <= 4745, "Invalid covenant day");
        require(!dayMinted[day], "Day already minted");
        _;
    }
    
    // ============ CONSTRUCTOR ============
    constructor(address _abraham) ERC721("Abraham Covenant", "COVENANT") {
        ABRAHAM = _abraham;
        LAUNCH_TIMESTAMP = block.timestamp;
        
        // Register Abraham as the first witness
        witnesses[_abraham] = true;
        emit WitnessRegistered(_abraham, block.timestamp);
    }
    
    // ============ CORE COVENANT FUNCTIONS ============
    
    /**
     * @dev Abraham creates daily covenant NFT
     * @param day The covenant day (1-4745)
     * @param narrative IPFS hash of daily narrative
     * @param metadata Additional metadata URI
     * @param startingPrice Starting auction price in wei
     */
    function createDailyCovenantNFT(
        uint256 day,
        string calldata narrative,
        string calldata metadata,
        uint256 startingPrice
    ) external onlyAbraham covenantActive validDay(day) nonReentrant {
        require(bytes(narrative).length > 0, "Narrative cannot be empty");
        require(startingPrice >= 0.01 ether, "Minimum starting price is 0.01 ETH");
        
        _tokenIds.increment();
        uint256 tokenId = _tokenIds.current();
        
        // Calculate auction end time (midnight ET of next day)
        uint256 auctionEnd = calculateMidnightET();
        
        // Create the covenant NFT
        covenants[tokenId] = CovenantNFT({
            day: day,
            narrative: narrative,
            metadata: metadata,
            auctionEnd: auctionEnd,
            finalPrice: 0,
            witness: address(0),
            isSealed: false,
            creationTimestamp: block.timestamp
        });
        
        // Create the auction
        auctions[tokenId].tokenId = tokenId;
        auctions[tokenId].startingPrice = startingPrice;
        auctions[tokenId].currentBid = 0;
        auctions[tokenId].currentBidder = address(0);
        auctions[tokenId].endTime = auctionEnd;
        auctions[tokenId].active = true;
        
        // Mark day as minted
        dayMinted[day] = true;
        
        // Mint to contract (held until auction completes)
        _safeMint(address(this), tokenId);
        
        emit CovenantCreated(tokenId, day, narrative);
        emit AuctionStarted(tokenId, startingPrice, auctionEnd);
    }
    
    /**
     * @dev Place bid on active covenant auction
     * @param tokenId The covenant token to bid on
     */
    function placeBid(uint256 tokenId) external payable nonReentrant {
        Auction storage auction = auctions[tokenId];
        require(auction.active, "Auction not active");
        require(block.timestamp < auction.endTime, "Auction has ended");
        require(witnesses[msg.sender], "Must be registered witness to bid");
        
        uint256 minBid = auction.currentBid == 0 
            ? auction.startingPrice 
            : auction.currentBid + ((auction.currentBid * 5) / 100); // 5% minimum increment
            
        require(msg.value >= minBid, "Bid too low");
        
        // Return previous bid
        if (auction.currentBidder != address(0)) {
            auction.pendingReturns[auction.currentBidder] += auction.currentBid;
        }
        
        auction.currentBid = msg.value;
        auction.currentBidder = msg.sender;
        
        emit BidPlaced(tokenId, msg.sender, msg.value);
    }
    
    /**
     * @dev End covenant auction (callable by anyone after end time)
     * @param tokenId The covenant token auction to end
     */
    function endAuction(uint256 tokenId) external nonReentrant {
        Auction storage auction = auctions[tokenId];
        require(auction.active, "Auction not active");
        require(block.timestamp >= auction.endTime, "Auction still active");
        
        CovenantNFT storage covenant = covenants[tokenId];
        
        if (auction.currentBidder != address(0)) {
            // Transfer NFT to winning bidder
            _transfer(address(this), auction.currentBidder, tokenId);
            
            covenant.witness = auction.currentBidder;
            covenant.finalPrice = auction.currentBid;
            
            // Pay Abraham (95% of final price)
            uint256 abrahamPayment = (auction.currentBid * 95) / 100;
            uint256 protocolFee = auction.currentBid - abrahamPayment;
            
            (bool sent, ) = ABRAHAM.call{value: abrahamPayment}("");
            require(sent, "Payment to Abraham failed");
            
            // Protocol fee stays in contract for ecosystem
            
            emit AuctionEnded(tokenId, auction.currentBidder, auction.currentBid);
        } else {
            // No bids - transfer to Abraham
            _transfer(address(this), ABRAHAM, tokenId);
            covenant.witness = ABRAHAM;
            
            emit AuctionEnded(tokenId, ABRAHAM, 0);
        }
        
        covenant.isSealed = true;
        auction.active = false;
        
        emit CovenantSealed(tokenId, covenant.witness);
    }
    
    // ============ WITNESS REGISTRY ============
    
    /**
     * @dev Register as covenant witness (free during launch phase)
     */
    function registerAsWitness() external {
        require(!witnesses[msg.sender], "Already registered as witness");
        
        witnesses[msg.sender] = true;
        emit WitnessRegistered(msg.sender, block.timestamp);
    }
    
    /**
     * @dev Batch register witnesses (Abraham only)
     * @param newWitnesses Array of addresses to register
     */
    function batchRegisterWitnesses(address[] calldata newWitnesses) external onlyAbraham {
        for (uint256 i = 0; i < newWitnesses.length; i++) {
            if (!witnesses[newWitnesses[i]]) {
                witnesses[newWitnesses[i]] = true;
                emit WitnessRegistered(newWitnesses[i], block.timestamp);
            }
        }
    }
    
    // ============ UTILITY FUNCTIONS ============
    
    /**
     * @dev Calculate midnight ET for auction end
     */
    function calculateMidnightET() internal view returns (uint256) {
        // Simplified: next day at same time + 24 hours
        // In production, would calculate actual midnight ET
        return block.timestamp + DAILY_AUCTION_DURATION;
    }
    
    /**
     * @dev Get current covenant day
     */
    function getCurrentCovenantDay() external view returns (uint256) {
        if (block.timestamp < COVENANT_START) return 0;
        if (block.timestamp > COVENANT_END) return 4746; // Past end
        
        return ((block.timestamp - COVENANT_START) / 86400) + 1;
    }
    
    /**
     * @dev Get covenant by day
     */
    function getCovenantByDay(uint256 day) external view returns (CovenantNFT memory) {
        // Find token ID for this day
        for (uint256 i = 1; i <= _tokenIds.current(); i++) {
            if (covenants[i].day == day) {
                return covenants[i];
            }
        }
        revert("Covenant not found for day");
    }
    
    /**
     * @dev Get active auctions
     */
    function getActiveAuctions() external view returns (uint256[] memory) {
        uint256[] memory activeTokens = new uint256[](_tokenIds.current());
        uint256 count = 0;
        
        for (uint256 i = 1; i <= _tokenIds.current(); i++) {
            if (auctions[i].active && block.timestamp < auctions[i].endTime) {
                activeTokens[count] = i;
                count++;
            }
        }
        
        // Resize array
        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = activeTokens[i];
        }
        
        return result;
    }
    
    /**
     * @dev Withdraw pending bid returns
     */
    function withdraw(uint256 tokenId) external nonReentrant {
        uint256 amount = auctions[tokenId].pendingReturns[msg.sender];
        require(amount > 0, "No funds to withdraw");
        
        auctions[tokenId].pendingReturns[msg.sender] = 0;
        
        (bool sent, ) = msg.sender.call{value: amount}("");
        require(sent, "Withdrawal failed");
    }
    
    /**
     * @dev Get contract stats
     */
    function getCovenantStats() external view returns (
        uint256 totalMinted,
        uint256 totalWitnesses,
        uint256 currentDay,
        uint256 daysRemaining,
        uint256 totalValue
    ) {
        totalMinted = _tokenIds.current();
        
        // Count witnesses
        // Note: This is inefficient for large numbers, would use EnumerableSet in production
        totalWitnesses = 0;
        
        currentDay = this.getCurrentCovenantDay();
        
        if (block.timestamp < COVENANT_END) {
            daysRemaining = (COVENANT_END - block.timestamp) / 86400;
        } else {
            daysRemaining = 0;
        }
        
        totalValue = address(this).balance;
    }
    
    // ============ EMERGENCY FUNCTIONS ============
    
    /**
     * @dev Emergency pause (Abraham only)
     */
    function emergencyPause() external onlyAbraham {
        // Implementation would pause all auctions
        // For now, just emit event
        emit CovenantSealed(0, address(0)); // Signal pause
    }
    
    /**
     * @dev Update metadata URI format
     */
    function setBaseURI(string memory newBaseURI) external onlyAbraham {
        // Would set _baseTokenURI
        // Implementation needed for tokenURI override
    }
    
    // ============ VIEW FUNCTIONS ============
    
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "Token does not exist");
        
        CovenantNFT memory covenant = covenants[tokenId];
        return covenant.metadata;
    }
    
    /**
     * @dev Check if covenant is complete
     */
    function isCovenantComplete() external view returns (bool) {
        return block.timestamp > COVENANT_END;
    }
    
    /**
     * @dev Get days until covenant completion
     */
    function daysUntilCompletion() external view returns (uint256) {
        if (block.timestamp >= COVENANT_END) return 0;
        return (COVENANT_END - block.timestamp) / 86400;
    }
}