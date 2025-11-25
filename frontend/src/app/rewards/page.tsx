'use client';

import { useActiveAccount } from 'thirdweb/react';
import { usePlayerData, useTokensClaimed, useNFTClaimed, useCeloRunner } from '@/hooks/useCeloRunner';
import { GAME_CONSTANTS } from '@/config/contracts';
import { useState } from 'react';
import Link from 'next/link';

export default function RewardsPage() {
  const account = useActiveAccount();
  const address = account?.address;
  const { player, refetch: refetchPlayer } = usePlayerData(address);
  const { claimTokens, claimNFT, isPending } = useCeloRunner();
  const [claimingStage, setClaimingStage] = useState<number | null>(null);
  const [claimType, setClaimType] = useState<'token' | 'nft' | null>(null);

  const handleClaimTokens = async (stage: number) => {
    try {
      setClaimingStage(stage);
      setClaimType('token');
      await claimTokens(stage);
      setTimeout(() => {
        refetchPlayer();
        setClaimingStage(null);
        setClaimType(null);
      }, 3000);
    } catch (error) {
      console.error('Failed to claim tokens:', error);
      setClaimingStage(null);
      setClaimType(null);
    }
  };

  const handleClaimNFT = async (stage: number) => {
    try {
      setClaimingStage(stage);
      setClaimType('nft');
      await claimNFT(stage);
      setTimeout(() => {
        refetchPlayer();
        setClaimingStage(null);
        setClaimType(null);
      }, 3000);
    } catch (error) {
      console.error('Failed to claim NFT:', error);
      setClaimingStage(null);
      setClaimType(null);
    }
  };

  if (!player) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-purple-900 via-blue-900 to-black">
        <div className="nes-container with-title is-centered pixel-art max-w-md" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
          <p className="title pixel-font text-primary">LOADING...</p>
          <p className="text-center text-gray-700">Please wait...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 bg-gradient-to-b from-purple-900 via-blue-900 to-black">
      <div className="max-w-4xl mx-auto">
        <div className="nes-container with-title is-centered pixel-art mb-6" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
          <p className="title pixel-font text-primary">REWARDS</p>
          
          <div className="text-center mb-6">
            <p className="text-sm text-gray-700">
              Claim your QUEST tokens and NFT badges for completed stages!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((stage) => {
              const { isClaimed: tokensClaimed } = useTokensClaimed(address, stage);
              const { isClaimed: nftClaimed } = useNFTClaimed(address, stage);
              const isCompleted = player.currentStage > stage;
              const tokenReward = GAME_CONSTANTS.STAGE_REWARDS[stage as keyof typeof GAME_CONSTANTS.STAGE_REWARDS];
              const badgeName = GAME_CONSTANTS.STAGE_BADGES[stage as keyof typeof GAME_CONSTANTS.STAGE_BADGES];

              return (
                <div key={stage} className="nes-container is-rounded">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Stage {stage}</h3>
                  <p className="text-xs text-gray-600 mb-3">{badgeName}</p>

                  {!isCompleted ? (
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-2">🔒 Complete stage to unlock</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {/* Token Claim */}
                      <div className="nes-container is-dark p-2">
                        <p className="text-xs mb-1">💰 {tokenReward} QUEST Tokens</p>
                        {tokensClaimed ? (
                          <p className="text-xs text-green-400">✅ Claimed</p>
                        ) : (
                          <button
                            onClick={() => handleClaimTokens(stage)}
                            disabled={isPending && claimingStage === stage && claimType === 'token'}
                            className="nes-btn is-success is-small w-full"
                          >
                            {isPending && claimingStage === stage && claimType === 'token' ? 'Claiming...' : 'Claim'}
                          </button>
                        )}
                      </div>

                      {/* NFT Claim */}
                      <div className="nes-container is-dark p-2">
                        <p className="text-xs mb-1">🎖️ {badgeName}</p>
                        {nftClaimed ? (
                          <p className="text-xs text-green-400">✅ Claimed</p>
                        ) : (
                          <button
                            onClick={() => handleClaimNFT(stage)}
                            disabled={isPending && claimingStage === stage && claimType === 'nft'}
                            className="nes-btn is-warning is-small w-full"
                          >
                            {isPending && claimingStage === stage && claimType === 'nft' ? 'Claiming...' : 'Claim'}
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-6 text-center">
            <Link href="/">
              <button className="nes-btn is-primary">
                ← Back to Home
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
