// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./QuestToken.sol";
import "./RunnerBadge.sol";

/**
 * @title CeloRunner
 * @dev Main game contract for Celo Runner - adapted from MindoraRunnerFinal
 * Manages player registration, game sessions, stage progression, and rewards
 */
contract CeloRunner {

    // ============ CONTRACTS ============
    
    QuestToken public questToken;
    RunnerBadge public runnerBadge;
    
    // ============ BASIC STATE ============

    address public owner;
    uint256 public totalPlayers;
    uint256 public totalGamesPlayed;

    // Game settings
    uint256 public constant REGISTRATION_BONUS = 100;
    uint256 public constant COMPLETION_MULTIPLIER = 2;
    uint256 public constant TOKEN_DECIMALS = 10**18; // ERC20 tokens have 18 decimals

    // ============ SIMPLE STRUCTS ============

    struct Player {
        string username;
        bool isRegistered;
        uint256 currentStage;
        uint256 totalScore;
        uint256 inGameCoins;           // Only coins for in-game purchases
        uint256 questTokensEarned;     // Track tokens earned
        uint256 totalGamesPlayed;
        uint256 registrationTime;
    }

    struct GameSession {
        address player;
        uint256 stage;
        uint256 score;
        uint256 coinsCollected;
        bool stageCompleted;
        uint256 timestamp;
    }

    // ============ STORAGE ============

    mapping(address => Player) public players;
    mapping(uint256 => GameSession[]) public stageLeaderboards;  // stage => sessions
    mapping(address => mapping(uint256 => bool)) public stageCompleted;
    mapping(address => mapping(uint256 => bool)) public tokensClaimed;  // Track if player claimed tokens for stage
    mapping(address => mapping(uint256 => bool)) public nftClaimed;     // Track if player claimed NFT badge for stage

    // ============ EVENTS ============

    event PlayerRegistered(address indexed player, string username);
    event GameSessionSaved(address indexed player, uint256 stage, uint256 score, uint256 coinsCollected, bool completed);
    event StageCompleted(address indexed player, uint256 stage, uint256 questTokensEarned);
    event ItemPurchased(address indexed player, string itemType, uint256 cost);
    event TokensClaimed(address indexed player, uint256 stage, uint256 tokenAmount);
    event NFTClaimed(address indexed player, uint256 stage, uint256 tokenId, string badgeName);

    // ============ BASIC MODIFIERS ============

    modifier onlyRegistered() {
        require(players[msg.sender].isRegistered, "Not registered");
        _;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    // ============ CORE FUNCTIONS ============

    constructor(address _questToken, address _runnerBadge) {
        owner = msg.sender;
        questToken = QuestToken(_questToken);
        runnerBadge = RunnerBadge(_runnerBadge);
    }

    /**
     * @dev Register a new player with a username
     * @param _username Player's chosen username (1-20 characters)
     */
    function registerPlayer(string memory _username) external {
        require(!players[msg.sender].isRegistered, "Already registered");
        require(bytes(_username).length > 0 && bytes(_username).length <= 20, "Invalid username");

        players[msg.sender] = Player({
            username: _username,
            isRegistered: true,
            currentStage: 1,
            totalScore: 0,
            inGameCoins: REGISTRATION_BONUS,  // Start with 100 coins
            questTokensEarned: 0,
            totalGamesPlayed: 0,
            registrationTime: block.timestamp
        });

        totalPlayers++;
        emit PlayerRegistered(msg.sender, _username);
    }

    /**
     * @dev Save a game session with score, coins, and completion status
     * @param _stage Stage number (1-3)
     * @param _finalScore Final score achieved
     * @param _coinsCollected Coins collected during session
     * @param _questionsCorrect Number of questions answered correctly
     * @param _stageCompleted Whether the stage was completed
     */
    function saveGameSession(
        uint256 _stage,
        uint256 _finalScore,
        uint256 _coinsCollected,
        uint256 _questionsCorrect,
        bool _stageCompleted
    ) external onlyRegistered {

        Player storage player = players[msg.sender];
        
        // Allow saving if:
        // 1. Stage is <= currentStage (normal sequential progression), OR
        // 2. Stage is currentStage + 1 AND this is a completion (allows catching up if player completed locally)
        require(
            _stage <= player.currentStage || 
            (_stage == player.currentStage + 1 && _stageCompleted && stageCompleted[msg.sender][_stage - 1]),
            "Stage locked"
        );

        // Always save coins and update stats
        player.inGameCoins += _coinsCollected;
        player.totalScore += _finalScore;
        player.totalGamesPlayed++;
        totalGamesPlayed++;

        // Add to leaderboard
        stageLeaderboards[_stage].push(GameSession({
            player: msg.sender,
            stage: _stage,
            score: _finalScore,
            coinsCollected: _coinsCollected,
            stageCompleted: _stageCompleted,
            timestamp: block.timestamp
        }));

        // Stage completion bonuses
        if (_stageCompleted && !stageCompleted[msg.sender][_stage]) {
            require(_questionsCorrect > 0, "Must answer questions");

            // Mark completed
            stageCompleted[msg.sender][_stage] = true;

            // Double coins bonus
            player.inGameCoins += _coinsCollected * COMPLETION_MULTIPLIER;

            // Track tokens earned
            uint256 tokensToEarn = _getStageTokenReward(_stage);
            player.questTokensEarned += tokensToEarn;

            // Unlock next stage when completing any stage that matches or exceeds current stage
            if (_stage >= player.currentStage && _stage < 3) {
                player.currentStage = _stage + 1;
            }

            emit StageCompleted(msg.sender, _stage, tokensToEarn);
        }
        
        emit GameSessionSaved(msg.sender, _stage, _finalScore, _coinsCollected, _stageCompleted);
    }

    /**
     * @dev Purchase an in-game item with coins
     * @param _itemType Type of item being purchased
     * @param _cost Cost in coins
     */
    function purchaseItem(string memory _itemType, uint256 _cost) external onlyRegistered {
        Player storage player = players[msg.sender];
        require(player.inGameCoins >= _cost, "Insufficient coins");

        player.inGameCoins -= _cost;

        emit ItemPurchased(msg.sender, _itemType, _cost);
        // Item logic handled in frontend
    }

    /**
     * @dev Claim ERC20 quest tokens for completing a stage
     * @param _stage Stage number to claim tokens for
     */
    function claimTokens(uint256 _stage) external onlyRegistered {
        require(stageCompleted[msg.sender][_stage], "Stage not completed");
        require(!tokensClaimed[msg.sender][_stage], "Tokens already claimed");

        // Mark tokens as claimed
        tokensClaimed[msg.sender][_stage] = true;

        uint256 tokenAmount = _getStageTokenReward(_stage);
        uint256 tokenAmountWithDecimals = tokenAmount * TOKEN_DECIMALS;
        
        // Mint ERC20 tokens to player
        questToken.mint(msg.sender, tokenAmountWithDecimals);
        
        emit TokensClaimed(msg.sender, _stage, tokenAmountWithDecimals);
    }

    /**
     * @dev Claim NFT badge for completing a stage
     * @param _stage Stage number to claim NFT for
     */
    function claimNFT(uint256 _stage) external onlyRegistered {
        require(stageCompleted[msg.sender][_stage], "Stage not completed");
        require(!nftClaimed[msg.sender][_stage], "NFT already claimed");

        // Mark NFT as claimed
        nftClaimed[msg.sender][_stage] = true;

        string memory badgeName = _getStageBadgeName(_stage);
        
        // Mint ERC721 NFT to player
        uint256 tokenId = runnerBadge.mint(msg.sender, _stage, badgeName);
        
        emit NFTClaimed(msg.sender, _stage, tokenId, badgeName);
    }

    // ============ VIEW FUNCTIONS ============

    /**
     * @dev Get player information
     * @param _player Address of the player
     */
    function getPlayer(address _player) external view returns (Player memory) {
        return players[_player];
    }

    /**
     * @dev Get leaderboard for a specific stage
     * @param _stage Stage number
     * @param _limit Maximum number of entries to return
     */
    function getStageLeaderboard(uint256 _stage, uint256 _limit)
        external view returns (GameSession[] memory) {
        uint256 length = stageLeaderboards[_stage].length;
        uint256 returnLength = length > _limit ? _limit : length;

        GameSession[] memory result = new GameSession[](returnLength);

        // Return most recent entries
        uint256 startIndex = length > returnLength ? length - returnLength : 0;
        for (uint256 i = 0; i < returnLength; i++) {
            result[i] = stageLeaderboards[_stage][startIndex + i];
        }

        return result;
    }

    /**
     * @dev Check if a player has completed a stage
     * @param _player Address of the player
     * @param _stage Stage number
     */
    function isStageCompleted(address _player, uint256 _stage) external view returns (bool) {
        return stageCompleted[_player][_stage];
    }

    /**
     * @dev Check if tokens have been claimed for a stage
     * @param _player Address of the player
     * @param _stage Stage number
     */
    function areTokensClaimed(address _player, uint256 _stage) external view returns (bool) {
        return tokensClaimed[_player][_stage];
    }

    /**
     * @dev Check if NFT has been claimed for a stage
     * @param _player Address of the player
     * @param _stage Stage number
     */
    function isNFTClaimed(address _player, uint256 _stage) external view returns (bool) {
        return nftClaimed[_player][_stage];
    }

    /**
     * @dev Get general leaderboard across all stages
     * @param _limit Maximum number of entries to return
     */
    function getGeneralLeaderboard(uint256 _limit) external view returns (GameSession[] memory) {
        // Collect all game sessions from all stages
        uint256 totalSessions = 0;
        for (uint256 stage = 1; stage <= 3; stage++) {
            totalSessions += stageLeaderboards[stage].length;
        }

        // Create array to hold all sessions
        GameSession[] memory allSessions = new GameSession[](totalSessions);
        uint256 index = 0;

        // Combine all sessions from all stages
        for (uint256 stage = 1; stage <= 3; stage++) {
            for (uint256 i = 0; i < stageLeaderboards[stage].length; i++) {
                allSessions[index] = stageLeaderboards[stage][i];
                index++;
            }
        }

        // Simple bubble sort to get top scores
        for (uint256 i = 0; i < allSessions.length && i < _limit * 2; i++) {
            for (uint256 j = i + 1; j < allSessions.length; j++) {
                if (allSessions[j].score > allSessions[i].score) {
                    GameSession memory temp = allSessions[i];
                    allSessions[i] = allSessions[j];
                    allSessions[j] = temp;
                }
            }
        }

        // Return only the top _limit entries
        uint256 returnLength = allSessions.length > _limit ? _limit : allSessions.length;
        GameSession[] memory result = new GameSession[](returnLength);
        for (uint256 i = 0; i < returnLength; i++) {
            result[i] = allSessions[i];
        }

        return result;
    }

    /**
     * @dev Get overall game statistics
     */
    function getGameStats() external view returns (uint256, uint256) {
        return (totalPlayers, totalGamesPlayed);
    }

    // ============ HELPER FUNCTIONS ============

    /**
     * @dev Get token reward amount for a stage
     * @param _stage Stage number
     */
    function _getStageTokenReward(uint256 _stage) internal pure returns (uint256) {
        if (_stage == 1) return 20;
        if (_stage == 2) return 50;
        if (_stage == 3) return 100;
        return 0;
    }

    /**
     * @dev Get badge name for a stage
     * @param _stage Stage number
     */
    function _getStageBadgeName(uint256 _stage) internal pure returns (string memory) {
        if (_stage == 1) return "Explorer Badge";
        if (_stage == 2) return "Adventurer Badge";
        if (_stage == 3) return "Master Badge";
        return "Unknown Badge";
    }
    
    /**
     * @dev Update contract addresses (only owner)
     * @param _questToken New QuestToken address
     * @param _runnerBadge New RunnerBadge address
     */
    function updateContracts(address _questToken, address _runnerBadge) external onlyOwner {
        require(_questToken != address(0) && _runnerBadge != address(0), "Invalid addresses");
        questToken = QuestToken(_questToken);
        runnerBadge = RunnerBadge(_runnerBadge);
    }
}
