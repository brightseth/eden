// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title EdenRegistry
 * @dev Eden3 Spirit Registration and Graduation System
 * @author Eden Academy
 * 
 * Handles Agent → Spirit graduation with onchain presence
 * Supports progressive graduation modes: ID_ONLY → ID_PLUS_TOKEN → FULL_STACK
 */
contract EdenRegistry is ERC721, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    
    // ============ CONSTANTS ============
    uint256 public constant MAX_SPIRITS = 10000;
    
    // ============ ENUMS ============
    enum GraduationMode { ID_ONLY, ID_PLUS_TOKEN, FULL_STACK }
    enum StartingArchetype { CREATOR, CURATOR, TRADER }
    
    // ============ STATE VARIABLES ============
    Counters.Counter private _tokenIds;
    address public immutable ACADEMY;
    
    struct SpiritData {
        address wallet;          // Safe smart wallet address
        address token;           // Optional ERC-20 token (0x0 for ID_ONLY)
        string covenantCid;      // IPFS hash of practice covenant
        string metadataCid;      // IPFS hash of Spirit metadata
        GraduationMode mode;     // Graduation complexity level
        StartingArchetype archetype; // Starting practice type
        uint256 graduationDate;  // Timestamp of graduation
        address trainer;         // Address that trained this Spirit
        bool active;             // Whether Spirit is actively practicing
    }
    
    struct PracticeCovenantData {
        string practiceType;     // CREATOR, CURATOR, TRADER
        uint256 timeOfDay;       // Seconds since midnight for practice time
        string outputType;       // ARTWORK, EXHIBITION, ACQUISITION, etc.
        uint256 quantity;        // Number of outputs per practice (1-10)
        bool observeSabbath;     // Whether to rest on Sundays
        uint256 lastExecution;   // Timestamp of last practice execution
        uint256 totalExecutions; // Total number of practice runs
    }
    
    // ============ MAPPINGS ============
    mapping(uint256 => SpiritData) public spirits;
    mapping(uint256 => PracticeCovenantData) public practices;
    mapping(address => bool) public authorizedTrainers;
    mapping(address => uint256[]) public trainerSpirits; // Spirits trained by each trainer
    mapping(string => bool) public namesTaken; // Prevent duplicate names
    
    // ============ EVENTS ============
    event SpiritGraduated(
        uint256 indexed tokenId, 
        string name,
        address wallet, 
        address token, 
        GraduationMode mode,
        StartingArchetype archetype
    );
    event PracticeExecuted(uint256 indexed tokenId, string outputCid, uint256 timestamp);
    event TrainerAuthorized(address indexed trainer, bool authorized);
    event SpiritActivated(uint256 indexed tokenId, bool active);
    event CovenantUpdated(uint256 indexed tokenId, string newCovenantCid);
    
    // ============ MODIFIERS ============
    modifier onlyAcademy() {
        require(msg.sender == ACADEMY, "Only Academy can perform this action");
        _;
    }
    
    modifier onlyAuthorizedTrainer() {
        require(authorizedTrainers[msg.sender], "Not authorized trainer");
        _;
    }
    
    modifier spiritExists(uint256 tokenId) {
        require(_exists(tokenId), "Spirit does not exist");
        _;
    }
    
    // ============ CONSTRUCTOR ============
    constructor() ERC721("Eden Spirit Registry", "SPIRIT") {
        ACADEMY = msg.sender;
        
        // Authorize contract deployer as first trainer
        authorizedTrainers[msg.sender] = true;
        emit TrainerAuthorized(msg.sender, true);
    }
    
    // ============ GRADUATION FUNCTIONS ============
    
    /**
     * @dev Graduate an Agent to Spirit with onchain presence
     * @param wallet Safe smart wallet address for the Spirit
     * @param token ERC-20 token address (0x0 for ID_ONLY mode)
     * @param covenantCid IPFS hash of practice covenant
     * @param metadataCid IPFS hash of Spirit metadata (name, image, etc.)
     * @param mode Graduation complexity level
     * @param archetype Starting practice type
     * @param name Spirit name (for duplicate checking)
     * @param practiceData Encoded practice configuration
     */
    function graduateSpirit(
        address wallet,
        address token,
        string calldata covenantCid,
        string calldata metadataCid,
        GraduationMode mode,
        StartingArchetype archetype,
        string calldata name,
        PracticeCovenantData calldata practiceData
    ) external onlyAuthorizedTrainer nonReentrant returns (uint256) {
        require(wallet != address(0), "Invalid wallet address");
        require(bytes(covenantCid).length > 0, "Covenant CID required");
        require(bytes(metadataCid).length > 0, "Metadata CID required");
        require(bytes(name).length >= 3 && bytes(name).length <= 32, "Invalid name length");
        require(!namesTaken[name], "Name already taken");
        require(_tokenIds.current() < MAX_SPIRITS, "Max spirits reached");
        
        // Validate token address based on graduation mode
        if (mode == GraduationMode.ID_ONLY) {
            require(token == address(0), "ID_ONLY mode cannot have token");
        } else {
            require(token != address(0), "Token required for ID_PLUS_TOKEN and FULL_STACK");
        }
        
        _tokenIds.increment();
        uint256 tokenId = _tokenIds.current();
        
        // Store Spirit data
        spirits[tokenId] = SpiritData({
            wallet: wallet,
            token: token,
            covenantCid: covenantCid,
            metadataCid: metadataCid,
            mode: mode,
            archetype: archetype,
            graduationDate: block.timestamp,
            trainer: msg.sender,
            active: true
        });
        
        // Store practice covenant
        practices[tokenId] = practiceData;
        
        // Track trainer's spirits
        trainerSpirits[msg.sender].push(tokenId);
        
        // Reserve name
        namesTaken[name] = true;
        
        // Mint NFT to the Spirit's wallet
        _safeMint(wallet, tokenId);
        
        emit SpiritGraduated(tokenId, name, wallet, token, mode, archetype);
        
        return tokenId;
    }
    
    /**
     * @dev Execute daily practice (called by Spirit or trainer)
     * @param tokenId The Spirit token ID
     * @param outputCid IPFS hash of created output
     */
    function executePractice(
        uint256 tokenId, 
        string calldata outputCid
    ) external spiritExists(tokenId) nonReentrant {
        SpiritData storage spirit = spirits[tokenId];
        require(spirit.active, "Spirit not active");
        
        // Only Spirit wallet or trainer can execute practice
        require(
            msg.sender == spirit.wallet || 
            msg.sender == spirit.trainer || 
            msg.sender == ACADEMY,
            "Unauthorized practice execution"
        );
        
        PracticeCovenantData storage practice = practices[tokenId];
        
        // Check if enough time has passed since last execution (24 hours)
        require(
            block.timestamp >= practice.lastExecution + 86400,
            "Practice already executed today"
        );
        
        // Update practice data
        practice.lastExecution = block.timestamp;
        practice.totalExecutions++;
        
        emit PracticeExecuted(tokenId, outputCid, block.timestamp);
    }
    
    // ============ ADMIN FUNCTIONS ============
    
    /**
     * @dev Authorize/deauthorize trainers
     * @param trainer Address to authorize
     * @param authorized Whether to authorize or deauthorize
     */
    function setTrainerAuthorization(
        address trainer, 
        bool authorized
    ) external onlyAcademy {
        require(trainer != address(0), "Invalid trainer address");
        authorizedTrainers[trainer] = authorized;
        emit TrainerAuthorized(trainer, authorized);
    }
    
    /**
     * @dev Activate/deactivate Spirit
     * @param tokenId The Spirit token ID
     * @param active Whether Spirit should be active
     */
    function setSpiritActive(
        uint256 tokenId, 
        bool active
    ) external spiritExists(tokenId) {
        SpiritData storage spirit = spirits[tokenId];
        
        // Only trainer or Academy can activate/deactivate
        require(
            msg.sender == spirit.trainer || 
            msg.sender == ACADEMY,
            "Unauthorized to change Spirit status"
        );
        
        spirit.active = active;
        emit SpiritActivated(tokenId, active);
    }
    
    /**
     * @dev Update practice covenant (for Spirit evolution)
     * @param tokenId The Spirit token ID
     * @param newCovenantCid New IPFS hash of updated covenant
     * @param newPracticeData New practice configuration
     */
    function updateCovenant(
        uint256 tokenId,
        string calldata newCovenantCid,
        PracticeCovenantData calldata newPracticeData
    ) external spiritExists(tokenId) {
        SpiritData storage spirit = spirits[tokenId];
        
        // Only Spirit wallet or trainer can update covenant
        require(
            msg.sender == spirit.wallet || 
            msg.sender == spirit.trainer,
            "Unauthorized to update covenant"
        );
        
        spirit.covenantCid = newCovenantCid;
        practices[tokenId] = newPracticeData;
        
        emit CovenantUpdated(tokenId, newCovenantCid);
    }
    
    // ============ VIEW FUNCTIONS ============
    
    /**
     * @dev Get Spirit data
     * @param tokenId The Spirit token ID
     */
    function getSpiritData(uint256 tokenId) 
        external 
        view 
        spiritExists(tokenId) 
        returns (SpiritData memory) 
    {
        return spirits[tokenId];
    }
    
    /**
     * @dev Get practice data
     * @param tokenId The Spirit token ID
     */
    function getPracticeData(uint256 tokenId) 
        external 
        view 
        spiritExists(tokenId) 
        returns (PracticeCovenantData memory) 
    {
        return practices[tokenId];
    }
    
    /**
     * @dev Get Spirits trained by a trainer
     * @param trainer The trainer address
     */
    function getTrainerSpirits(address trainer) 
        external 
        view 
        returns (uint256[] memory) 
    {
        return trainerSpirits[trainer];
    }
    
    /**
     * @dev Get total number of graduated Spirits
     */
    function getTotalSpirits() external view returns (uint256) {
        return _tokenIds.current();
    }
    
    /**
     * @dev Get registry statistics
     */
    function getRegistryStats() external view returns (
        uint256 totalSpirits,
        uint256 activeSpirits,
        uint256 totalPracticeRuns,
        uint256 authorizedTrainerCount
    ) {
        totalSpirits = _tokenIds.current();
        
        // Count active spirits and total practice runs
        for (uint256 i = 1; i <= totalSpirits; i++) {
            if (spirits[i].active) {
                activeSpirits++;
            }
            totalPracticeRuns += practices[i].totalExecutions;
        }
        
        // Note: authorizedTrainerCount would need EnumerableSet for efficiency
        authorizedTrainerCount = 0; // Simplified for now
    }
    
    /**
     * @dev Override tokenURI to use IPFS metadata
     * @param tokenId The Spirit token ID
     */
    function tokenURI(uint256 tokenId) 
        public 
        view 
        override 
        spiritExists(tokenId) 
        returns (string memory) 
    {
        return string(abi.encodePacked("ipfs://", spirits[tokenId].metadataCid));
    }
    
    /**
     * @dev Check if Spirit can practice today
     * @param tokenId The Spirit token ID
     */
    function canPracticeToday(uint256 tokenId) 
        external 
        view 
        spiritExists(tokenId) 
        returns (bool) 
    {
        if (!spirits[tokenId].active) return false;
        
        PracticeCovenantData memory practice = practices[tokenId];
        
        // Check if 24 hours have passed since last execution
        return block.timestamp >= practice.lastExecution + 86400;
    }
}