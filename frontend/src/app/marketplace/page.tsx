'use client';

import type { NextPage } from 'next';
import Link from 'next/link';
import { useActiveAccount } from 'thirdweb/react';
import { NewWalletConnection } from '@/components/NewWalletConnection';
import { MarketplaceGrid } from '@/components/marketplace/MarketplaceGrid';

const Marketplace: NextPage = () => {
  const account = useActiveAccount();
  const isConnected = !!account?.address;

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-blue-100 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0 mb-4 sm:mb-6 px-2 sm:px-4">
            <Link href="/" className="nes-btn is-primary pixel-font text-xs w-full sm:w-auto">
              ← BACK TO GAME
            </Link>
            <div className="w-full sm:w-auto">
              <NewWalletConnection />
            </div>
          </div>

          <h1 className="pixel-font text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 px-2">
            🛒 NFT Marketplace
          </h1>
          <div className="mt-3 sm:mt-4 inline-flex items-center gap-2 bg-green-50 border-2 border-green-300 rounded px-3 sm:px-4 py-2">
            <span className="pixel-font text-xs sm:text-sm text-green-800 font-bold">
              ✅ CELO SEPOLIA
            </span>
          </div>
        </div>

        {/* Marketplace Grid */}
        {isConnected ? (
          <MarketplaceGrid />
        ) : (
          <div className="flex items-center justify-center py-20">
            <div className="nes-container pixel-art bg-white max-w-md">
              <div className="text-center">
                <div className="text-6xl mb-4">🔐</div>
                <h2 className="pixel-font text-xl font-bold text-gray-800 mb-3">
                  NFT Marketplace
                </h2>
                <p className="pixel-font text-sm text-gray-600 mb-4">
                  Please connect your wallet to browse and trade Badge NFTs
                </p>
                <div className="bg-blue-50 border-2 border-blue-300 rounded p-3">
                  <p className="pixel-font text-xs text-blue-700">
                    💡 Complete game stages to earn exclusive Badge NFTs, then list them for sale!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 px-2">
          <div className="nes-container pixel-art bg-white">
            <h3 className="pixel-font text-xs sm:text-sm font-bold text-gray-800 mb-2">🎯 How to Earn NFTs</h3>
            <p className="pixel-font text-[10px] sm:text-xs text-gray-600">
              Complete stages in the Celo Runner game to earn exclusive Badge NFTs for your collection.
            </p>
          </div>

          <div className="nes-container pixel-art bg-white">
            <h3 className="pixel-font text-xs sm:text-sm font-bold text-gray-800 mb-2">💰 List for Sale</h3>
            <p className="pixel-font text-[10px] sm:text-xs text-gray-600">
              Set your own price in CELO and list your Badge NFTs for other players to purchase.
            </p>
          </div>

          <div className="nes-container pixel-art bg-white">
            <h3 className="pixel-font text-xs sm:text-sm font-bold text-gray-800 mb-2">🔒 Secure Trading</h3>
            <p className="pixel-font text-[10px] sm:text-xs text-gray-600">
              Escrowless marketplace - you keep your NFTs until they're sold. Cancel anytime!
            </p>
          </div>
        </div>

        {/* Contract Info */}
        <div className="mt-6 sm:mt-8 text-center px-2">
          <p className="pixel-font text-[10px] sm:text-xs text-gray-500 break-all">
            Contract: 0x7b72...8b84
          </p>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;

