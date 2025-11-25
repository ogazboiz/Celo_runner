'use client';

import { useState } from 'react';
import { useWallet } from '@/context/WalletContext';
import { useCeloRunner } from '@/hooks/useCeloRunner';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ConnectButton } from 'thirdweb/react';
import { client } from '@/client';
import { celoSepolia } from '@/context/WalletContext';

export default function RegisterPage() {
  const { account, isConnected } = useWallet();
  const { registerPlayer, isPending, isSuccess } = useCeloRunner();
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || username.length < 3 || username.length > 20) {
      setError('Username must be between 3 and 20 characters');
      return;
    }

    try {
      await registerPlayer(username);
      // Wait a bit for transaction to be mined
      setTimeout(() => {
        router.push('/');
      }, 3000);
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Failed to register. Please try again.');
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 pixel-bg">
        <div className="nes-container with-title is-centered pixel-art max-w-md bg-white">
          <p className="title pixel-font">CONNECT WALLET</p>
          <p className="text-sm mb-4 text-center">
            Please connect your wallet to register
          </p>
          <div className="text-center">
            <ConnectButton
              client={client}
              chain={celoSepolia}
              theme="light"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 pixel-bg">
      <div className="nes-container with-title is-centered pixel-art max-w-md w-full bg-white">
        <p className="title pixel-font">REGISTER PLAYER</p>
        
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">🎮</div>
          <p className="text-sm">
            Choose your runner name and start your adventure!
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="nes-field">
            <label htmlFor="username" className="text-sm">Username</label>
            <input
              type="text"
              id="username"
              className="nes-input"
              placeholder="Enter username (3-20 chars)"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              maxLength={20}
              disabled={isPending || isSuccess}
            />
          </div>

          {error && (
            <div className="nes-container is-error">
              <p className="text-sm">{error}</p>
            </div>
          )}

          {isSuccess && (
            <div className="nes-container is-success">
              <p className="text-sm">✅ Registration successful! Redirecting...</p>
            </div>
          )}

          <div className="flex gap-2">
            <button
              type="submit"
              className="nes-btn is-primary flex-1"
              disabled={isPending || isSuccess || !username}
            >
              {isPending ? 'Registering...' : isSuccess ? 'Success!' : 'Register'}
            </button>
            <Link href="/">
              <button type="button" className="nes-btn">
                Cancel
              </button>
            </Link>
          </div>
        </form>

        <div className="mt-6 nes-container is-rounded">
          <p className="text-xs">
            <strong>Registration Bonus:</strong> 100 coins to start!
          </p>
        </div>
      </div>
    </div>
  );
}
