// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title RunnerBadge
 * @dev ERC721 NFT badges for Celo Runner game achievements
 * Players earn unique badges for completing each stage
 */
contract RunnerBadge is ERC721, Ownable {
    using Strings for uint256;
    
    // Address of the game contract that can mint NFTs
    address public gameContract;
    
    // Counter for token IDs
    uint256 private _tokenIdCounter;
    
    // Mapping from token ID to stage number
    mapping(uint256 => uint256) public tokenStage;
    
    // Mapping from token ID to badge name
    mapping(uint256 => string) public tokenBadgeName;
    
    // Base URI for metadata
    string private _baseTokenURI;
    
    event GameContractUpdated(address indexed oldContract, address indexed newContract);
    event BadgeMinted(address indexed player, uint256 indexed tokenId, uint256 stage, string badgeName);
    event BaseURIUpdated(string newBaseURI);
    
    constructor() ERC721("Celo Runner Badge", "BADGE") Ownable(msg.sender) {
        _tokenIdCounter = 1; // Start token IDs from 1
    }
    
    /**
     * @dev Set the game contract address that can mint NFTs
     * @param _gameContract Address of the CeloRunner contract
     */
    function setGameContract(address _gameContract) external onlyOwner {
        require(_gameContract != address(0), "Invalid address");
        address oldContract = gameContract;
        gameContract = _gameContract;
        emit GameContractUpdated(oldContract, _gameContract);
    }
    
    /**
     * @dev Set base URI for token metadata
     * @param baseURI_ New base URI
     */
    function setBaseURI(string memory baseURI_) external onlyOwner {
        _baseTokenURI = baseURI_;
        emit BaseURIUpdated(baseURI_);
    }
    
    /**
     * @dev Mint a badge NFT to a player (only callable by game contract)
     * @param _to Address to mint badge to
     * @param _stage Stage number (1-3)
     * @param _badgeName Name of the badge
     * @return tokenId The ID of the minted token
     */
    function mint(address _to, uint256 _stage, string memory _badgeName) external returns (uint256) {
        require(msg.sender == gameContract, "Only game contract can mint");
        require(_to != address(0), "Cannot mint to zero address");
        require(_stage >= 1 && _stage <= 3, "Invalid stage");
        
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        
        _safeMint(_to, tokenId);
        
        tokenStage[tokenId] = _stage;
        tokenBadgeName[tokenId] = _badgeName;
        
        emit BadgeMinted(_to, tokenId, _stage, _badgeName);
        
        return tokenId;
    }
    
    /**
     * @dev Get the base URI for token metadata
     */
    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }
    
    /**
     * @dev Get token URI with metadata
     * @param tokenId Token ID
     */
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        _requireOwned(tokenId);
        
        string memory baseURI = _baseURI();
        if (bytes(baseURI).length > 0) {
            return string(abi.encodePacked(baseURI, tokenId.toString()));
        }
        
        // Fallback to on-chain metadata
        return string(
            abi.encodePacked(
                "data:application/json;base64,",
                _encodeMetadata(tokenId)
            )
        );
    }
    
    /**
     * @dev Encode basic metadata for a token
     * @param tokenId Token ID
     */
    function _encodeMetadata(uint256 tokenId) internal view returns (string memory) {
        uint256 stage = tokenStage[tokenId];
        string memory badgeName = tokenBadgeName[tokenId];
        
        return string(
            abi.encodePacked(
                '{"name":"',
                badgeName,
                '","description":"Achievement badge for completing Stage ',
                stage.toString(),
                ' in Celo Runner","attributes":[{"trait_type":"Stage","value":"',
                stage.toString(),
                '"}]}'
            )
        );
    }
    
    /**
     * @dev Get total number of badges minted
     */
    function totalSupply() external view returns (uint256) {
        return _tokenIdCounter - 1;
    }
}
