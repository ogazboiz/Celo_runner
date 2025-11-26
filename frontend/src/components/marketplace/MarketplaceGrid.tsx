'use client';

import { useState, useEffect } from 'react';
import { useActiveAccount } from 'thirdweb/react';
import { getContract, readContract } from 'thirdweb';
import { defineChain } from 'thirdweb';
import { client } from '@/client';
import { CONTRACTS } from '@/config/contracts';
import { RUNNER_BADGE_ABI } from '@/config/abis';
import { getBadgeImage, getBadgeNameByStage } from '@/config/badgeMetadata';
import { NFTCard } from './NFTCard';

const celoSepolia = defineChain({
  id: 11142220,
  name: "Celo Sepolia",
  rpc: "https://forno.celo-sepolia.celo-testnet.org/",
  nativeCurrency: {
    name: "CELO",
    symbol: "CELO",
    decimals: 18
  }
});

interface NFTData {
  tokenId: number;
  name: string;
  image: string;
  ownerAddress: string;
  isOwnedByUser: boolean;
}

export function MarketplaceGrid() {
  const account = useActiveAccount();
  const connectedAddress = account?.address;
  const [refreshKey, setRefreshKey] = useState(0);
  const [allNFTs, setAllNFTs] = useState<NFTData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleListingChange = () => {
    setRefreshKey(prev => prev + 1);
    fetchAllNFTs();
  };

  // Get badge contract instance
  const getBadgeContract = () => {
    return getContract({
      client,
      chain: celoSepolia,
      address: CONTRACTS.RUNNER_BADGE,
      abi: RUNNER_BADGE_ABI,
    });
  };

  // Fetch all NFTs by querying totalSupply and then ownerOf for each token
  const fetchAllNFTs = async () => {
    try {
      setIsLoading(true);
      console.log('🔍 Fetching ALL Badge NFTs from Celo...');

      const contract = getBadgeContract();
      const allNFTData: NFTData[] = [];

      // Get total supply
      let totalSupply = 0;
      try {
        const supply = await readContract({
          contract,
          method: "totalSupply",
          params: [],
        });
        totalSupply = Number(supply || 0);
        console.log('📊 Total NFTs minted:', totalSupply);
      } catch (error) {
        console.error('Error fetching total supply:', error);
        // If totalSupply doesn't exist or fails, try to query up to a reasonable limit
        totalSupply = 100; // Fallback limit - query first 100 tokens
      }

      // Query each token ID to get owner
      for (let tokenId = 1; tokenId <= totalSupply; tokenId++) {
        try {
          // Get owner of this token
          const owner = await readContract({
            contract,
            method: "ownerOf",
            params: [BigInt(tokenId)],
          }) as string;

          if (owner && owner !== '0x0000000000000000000000000000000000000000') {
            const isOwnedByUser = connectedAddress?.toLowerCase() === owner.toLowerCase();
            
            // Get token URI to determine badge type
            let tokenURI = '';
            try {
              tokenURI = await readContract({
                contract,
                method: "tokenURI",
                params: [BigInt(tokenId)],
              });
            } catch (error) {
              console.warn(`Could not fetch tokenURI for token ${tokenId}`);
            }

            // Determine badge name and image from tokenId or tokenURI
            // Token IDs 1-3 are typically stage badges, but we'll use metadata if available
            let badgeName = getBadgeNameByStage((tokenId % 3) || 3);
            let badgeImage = getBadgeImage(badgeName);

            // If tokenURI exists and points to metadata, fetch it
            if (tokenURI) {
              try {
                // Handle IPFS URIs
                let metadataUrl = tokenURI;
                if (tokenURI.startsWith('ipfs://')) {
                  const ipfsHash = tokenURI.replace('ipfs://', '');
                  metadataUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;
                }

                const response = await fetch(metadataUrl);
                if (response.ok) {
                  const metadata = await response.json();
                  badgeName = metadata.name || badgeName;
                  badgeImage = metadata.image || badgeImage;
                }
              } catch (error) {
                console.warn(`Could not fetch metadata for token ${tokenId}:`, error);
              }
            }

            allNFTData.push({
              tokenId,
              name: badgeName,
              image: badgeImage,
              ownerAddress: owner as string,
              isOwnedByUser,
            });

            console.log(`✅ NFT #${tokenId} - Owner: ${owner} - Badge: ${badgeName}`);
          }
        } catch (error) {
          // Token doesn't exist or error querying, skip it
          console.warn(`Token ${tokenId} not found or error:`, error);
          break; // If we hit an error, likely reached the end
        }
      }

      console.log('📋 Total NFTs found:', allNFTData.length);
      setAllNFTs(allNFTData);
    } catch (error) {
      console.error('❌ Error fetching NFTs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllNFTs();
  }, [connectedAddress]);

  if (!connectedAddress) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔌</div>
        <p className="pixel-font text-lg text-gray-600">Connect your wallet to interact with the marketplace</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4 animate-pulse">⏳</div>
        <p className="pixel-font text-lg text-gray-600">Loading marketplace...</p>
      </div>
    );
  }

  return (
    <div>
      {allNFTs.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="pixel-font text-2xl text-gray-800 mb-3 font-bold">No NFTs Minted Yet</h3>
          <p className="pixel-font text-lg text-gray-600 mb-2">No Badge NFTs have been minted yet</p>
          <p className="pixel-font text-sm text-gray-500 mb-6">
            Be the first! Complete game stages to earn and mint Badge NFTs!
          </p>
          <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4 max-w-md mx-auto">
            <p className="pixel-font text-sm text-blue-800 mb-2">
              <strong>How to mint NFTs:</strong>
            </p>
            <ul className="pixel-font text-xs text-blue-700 text-left space-y-1">
              <li>1. Play Celo Runner game</li>
              <li>2. Complete Stage 1, 2, or 3</li>
              <li>3. Claim your Badge NFT reward</li>
              <li>4. Your NFT will appear here!</li>
            </ul>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-6 bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-300 rounded-lg p-4">
            <p className="pixel-font text-sm text-purple-900 font-bold mb-2">
              🏪 Badge NFT Collection Marketplace
            </p>
            <p className="pixel-font text-xs text-purple-700">
              📊 <strong>{allNFTs.length}</strong> Badge NFT{allNFTs.length > 1 ? 's' : ''} minted
            </p>
            <p className="pixel-font text-xs text-purple-600 mt-2">
              💡 Browse all NFTs - List yours for sale or buy from others!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" key={refreshKey}>
            {allNFTs.map((nft) => (
              <NFTCard
                key={nft.tokenId}
                tokenId={nft.tokenId}
                badgeName={nft.name}
                badgeImage={nft.image}
                ownerAddress={nft.ownerAddress}
                isOwnedByUser={nft.isOwnedByUser}
                onListingChange={handleListingChange}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

