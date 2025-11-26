'use client';

import { ConnectButton } from 'thirdweb/react';
import { client } from '@/client';
import { celoSepolia, useWallet } from '@/context/WalletContext';
import { useEffect, useState } from 'react';
import { useGameStore } from '@/store/gameStore';

export function NewWalletConnection() {
  const { account, isConnected } = useWallet();
  const [showRegistration, setShowRegistration] = useState(false);
  const [username, setUsername] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState<'idle' | 'pending' | 'waiting' | 'success'>('idle');

  const {
    setConnected,
    setWalletAddress,
    setPlayer,
    registerPlayer,
    loadPlayerData,
    contractCallbacks,
    player
  } = useGameStore();

  // Handle wallet connection state changes
  useEffect(() => {
    if (isConnected && account?.address) {
      setConnected(true);
      setWalletAddress(account.address);

      // Load player data when wallet connects - with a small delay to ensure contract callbacks are ready
      // Also retry a few times in case the first load fails
      const loadData = async () => {
        try {
          await loadPlayerData(account.address);
        } catch (error) {
          console.log('⚠️ First load attempt failed, retrying...', error);
          // Retry after a longer delay
          setTimeout(async () => {
            try {
              await loadPlayerData(account.address);
            } catch (retryError) {
              console.error('❌ Failed to load player data after retry:', retryError);
            }
          }, 2000);
        }
      };
      
      setTimeout(loadData, 1000);
    } else {
      setConnected(false);
      setWalletAddress(null);
      setPlayer(null);
      setShowRegistration(false);
    }
  }, [isConnected, account?.address, setConnected, setWalletAddress, setPlayer, loadPlayerData]);

  // Check registration status when player data changes
  useEffect(() => {
    console.log('🔍 Registration check:', {
      isConnected,
      address: account?.address,
      player,
      playerIsRegistered: player?.isRegistered,
      playerUsername: player?.username,
      hasUsername: !!player?.username
    });

    if (!isConnected || !account?.address) {
      setShowRegistration(false);
      return;
    }

    if (player === null || player === undefined) {
      console.log('⏳ Player data still loading - keeping current modal state');
      return;
    }

    // Player data loaded - check if registration needed
    // Check both isRegistered flag AND if username exists (more reliable)
    const isActuallyRegistered = player.isRegistered || (player.username && player.username.trim().length > 0);
    
    if (!isActuallyRegistered) {
      console.log('❌ Player not registered - showing modal');
      setShowRegistration(true);
    } else {
      console.log('✅ Player already registered - hiding modal');
      setShowRegistration(false);
    }
  }, [isConnected, account?.address, player]);

  const handleRegister = async () => {
    if (!username.trim()) return;

    // First, check if player is already registered by loading their data
    if (account?.address && contractCallbacks.loadPlayerData) {
      console.log('🔍 Checking if player is already registered...');
      try {
        const existingPlayer = await contractCallbacks.loadPlayerData(account.address);
        if (existingPlayer && (existingPlayer.isRegistered || (existingPlayer.username && existingPlayer.username.trim().length > 0))) {
          console.log('✅ Player is already registered, skipping registration');
          setRegistrationStatus('success');
          setUsername('');
          setIsRegistering(false);
          // Also load the player data into the store
          await loadPlayerData(account.address);
          return;
        }
      } catch (error) {
        console.log('Could not check existing registration, proceeding with new registration');
      }
    }

    setIsRegistering(true);
    setRegistrationStatus('pending');

    try {
      console.log('🔄 Starting registration for:', username.trim());
      const result = await registerPlayer(username.trim());
      console.log('📝 Registration result:', result);

      if (result) {
        console.log('✅ Registration successful! Waiting for blockchain confirmation...');
        setRegistrationStatus('waiting');
        setUsername('');

        // Wait a bit longer for blockchain confirmation, then reload player data
        setTimeout(async () => {
          console.log('🔄 Reloading player data after registration...');
          setRegistrationStatus('success');
          if (account?.address) {
            await loadPlayerData(account.address);
          }
        }, 4000);
      } else {
        setRegistrationStatus('idle');
      }
    } catch (error: unknown) {
      // Check if error is "Already registered" - treat as success
      const errorMessage = (error instanceof Error ? error.message : String(error)) || '';
      if (errorMessage.includes('Already registered') || 
          errorMessage.includes('already registered') ||
          errorMessage.includes('Player already registered')) {
        console.log('✅ Player already registered (from error), loading data...');
        setRegistrationStatus('waiting');
        setUsername('');
        setTimeout(async () => {
          setRegistrationStatus('success');
          if (account?.address) {
            await loadPlayerData(account.address);
          }
        }, 2000);
      } else {
        console.error('Registration failed:', error);
        setRegistrationStatus('idle');
      }
    }
    setIsRegistering(false);
  };


  return (
    <>

      {/* Wallet Connection UI - changes based on connection status */}
      {isConnected && account?.address ? (
        <div className="flex items-center space-x-3 relative z-20">
          <div className="nes-container is-dark pixel-font text-sm">
            💰 {account.address.slice(0, 6)}...{account.address.slice(-4)}
          </div>
          <button
            onClick={() => {
              // Disconnect handled by wallet context
              window.location.reload();
            }}
            className="nes-btn is-error pixel-font text-xs"
            title="Disconnect Wallet"
          >
            EXIT
          </button>
        </div>
      ) : (
        <ConnectButton
          client={client}
          chain={celoSepolia}
          theme="light"
          connectButton={{
            label: "💼 CONNECT WALLET",
          }}
        />
      )}

      {/* Registration Modal */}
      {showRegistration && (
        <div
          className="fixed inset-0 flex items-center justify-center"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999999
          }}
        >
          <div className="nes-container with-title is-centered pixel-art" style={{ backgroundColor: 'white', maxWidth: '400px' }}>
            <p className="title pixel-font text-primary">WELCOME TO CELO RUNNER!</p>
            <p className="text-gray-800 mb-4 pixel-font text-sm">Choose your username to start playing:</p>

            {registrationStatus === 'waiting' && (
              <div className="mb-4 text-center">
                <p className="text-blue-600 pixel-font text-sm">⏳ Waiting for blockchain confirmation...</p>
              </div>
            )}

            {registrationStatus === 'success' && (
              <div className="mb-4 text-center">
                <p className="text-green-600 pixel-font text-sm">✅ Registration confirmed! Loading game...</p>
              </div>
            )}

            <div className="nes-field mb-4">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="nes-input pixel-font"
                style={{ color: 'black', backgroundColor: 'white' }}
                maxLength={20}
              />
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleRegister}
                disabled={!username.trim() || isRegistering}
                className={`nes-btn ${!username.trim() || isRegistering ? 'is-disabled' : 'is-success'} pixel-font w-full`}
              >
{
                  registrationStatus === 'pending' ? 'PROCESSING...' :
                  registrationStatus === 'waiting' ? 'CONFIRMING...' :
                  registrationStatus === 'success' ? 'SUCCESS!' :
                  'REGISTER & START PLAYING'
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}