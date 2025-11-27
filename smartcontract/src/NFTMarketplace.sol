// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title NFTMarketplace
 * @notice Simple escrowless NFT marketplace for RunnerBadge contract
 * @dev Sellers keep NFTs until sold, marketplace only needs approval
 * @dev Supports both CELO (native) and cUSD (ERC20) payments
 */
contract NFTMarketplace is ReentrancyGuard {
    using SafeERC20 for IERC20;

    // Struct to store listing information
    struct Listing {
        address seller;
        uint256 price;
        bool isActive;
    }

    // RunnerBadge contract address
    IERC721 public nftContract;
    
    // cUSD token contract address
    IERC20 public cUSDToken;

    // Mapping from token ID to listing
    mapping(uint256 => Listing) public listings;

    // Events
    event ItemListed(uint256 indexed tokenId, address indexed seller, uint256 price);
    event ItemSold(uint256 indexed tokenId, address indexed buyer, address indexed seller, uint256 price);
    event ItemSoldWithCUSD(uint256 indexed tokenId, address indexed buyer, address indexed seller, uint256 price);
    event ItemCanceled(uint256 indexed tokenId, address indexed seller);

    /**
     * @notice Constructor sets the NFT contract address and cUSD token address
     * @param _nftContract Address of the RunnerBadge contract
     * @param _cusdToken Address of the cUSD token contract (0xdE9e4C3ce781b4bA68120d6261cbad65ce0aB00b for Celo Sepolia)
     */
    constructor(address _nftContract, address _cusdToken) {
        require(_nftContract != address(0), "Invalid NFT contract address");
        require(_cusdToken != address(0), "Invalid cUSD token address");
        nftContract = IERC721(_nftContract);
        cUSDToken = IERC20(_cusdToken);
    }

    /**
     * @notice List an NFT for sale
     * @param tokenId The ID of the NFT to list
     * @param price The price in wei (CELO)
     */
    function listItem(uint256 tokenId, uint256 price) external {
        require(price > 0, "Price must be greater than 0");
        require(nftContract.ownerOf(tokenId) == msg.sender, "Not the owner");
        require(
            nftContract.getApproved(tokenId) == address(this) ||
            nftContract.isApprovedForAll(msg.sender, address(this)),
            "Marketplace not approved"
        );
        require(!listings[tokenId].isActive, "Already listed");

        listings[tokenId] = Listing({
            seller: msg.sender,
            price: price,
            isActive: true
        });

        emit ItemListed(tokenId, msg.sender, price);
    }

    /**
     * @notice Buy a listed NFT
     * @param tokenId The ID of the NFT to buy
     */
    function buyItem(uint256 tokenId) external payable nonReentrant {
        Listing memory listing = listings[tokenId];

        require(listing.isActive, "Item not listed");
        require(msg.value >= listing.price, "Insufficient payment");
        require(nftContract.ownerOf(tokenId) == listing.seller, "Seller no longer owns NFT");

        // Mark as sold before transfer (reentrancy protection)
        listings[tokenId].isActive = false;

        // Transfer NFT from seller to buyer
        nftContract.safeTransferFrom(listing.seller, msg.sender, tokenId);

        // Transfer CELO to seller
        (bool success, ) = payable(listing.seller).call{value: listing.price}("");
        require(success, "Transfer failed");

        // Refund excess payment
        if (msg.value > listing.price) {
            (bool refundSuccess, ) = payable(msg.sender).call{value: msg.value - listing.price}("");
            require(refundSuccess, "Refund failed");
        }

        emit ItemSold(tokenId, msg.sender, listing.seller, listing.price);
    }

    /**
     * @notice Buy a listed NFT with cUSD
     * @param tokenId The ID of the NFT to buy
     * @param cusdAmount The amount of cUSD to pay (must match listing price)
     */
    function buyItemWithCUSD(uint256 tokenId, uint256 cusdAmount) external nonReentrant {
        Listing memory listing = listings[tokenId];

        require(listing.isActive, "Item not listed");
        require(cusdAmount >= listing.price, "Insufficient payment");
        require(nftContract.ownerOf(tokenId) == listing.seller, "Seller no longer owns NFT");

        // Mark as sold before transfer (reentrancy protection)
        listings[tokenId].isActive = false;

        // Transfer NFT from seller to buyer
        nftContract.safeTransferFrom(listing.seller, msg.sender, tokenId);

        // Transfer cUSD from buyer to seller (exact amount)
        cUSDToken.safeTransferFrom(msg.sender, listing.seller, listing.price);

        // Refund excess payment if any (transfer back to buyer)
        if (cusdAmount > listing.price) {
            cUSDToken.safeTransfer(msg.sender, cusdAmount - listing.price);
        }

        emit ItemSoldWithCUSD(tokenId, msg.sender, listing.seller, listing.price);
    }

    /**
     * @notice Cancel a listing
     * @param tokenId The ID of the NFT to cancel
     */
    function cancelListing(uint256 tokenId) external {
        Listing memory listing = listings[tokenId];

        require(listing.isActive, "Item not listed");
        require(listing.seller == msg.sender, "Not the seller");

        listings[tokenId].isActive = false;

        emit ItemCanceled(tokenId, msg.sender);
    }

    /**
     * @notice Get listing information
     * @param tokenId The ID of the NFT
     * @return listing The listing struct
     */
    function getListing(uint256 tokenId) external view returns (Listing memory) {
        return listings[tokenId];
    }

    /**
     * @notice Check if an NFT is listed
     * @param tokenId The ID of the NFT
     * @return bool True if listed and active
     */
    function isListed(uint256 tokenId) external view returns (bool) {
        return listings[tokenId].isActive;
    }
}

