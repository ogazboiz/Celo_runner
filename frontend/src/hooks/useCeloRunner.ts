import { useState, useEffect } from 'react';
import { useActiveAccount } from 'thirdweb/react';
import { getContract, readContract, prepareContractCall, sendTransaction, waitForReceipt } from 'thirdweb';
import { defineChain } from 'thirdweb';
import { client } from '@/client';
import { CONTRACTS } from '@/config/contracts';
import { CELO_RUNNER_ABI } from '@/config/abis';

// Define Celo Sepolia chain
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

// Get contract instance with ABI
const getCeloRunnerContract = () => {
  return getContract({
    client,
    chain: celoSepolia,
    address: CONTRACTS.CELO_RUNNER,
    abi: CELO_RUNNER_ABI,
  });
};

// Types based on our contract
export interface Player {
  username: string;
  isRegistered: boolean;
  currentStage: bigint;
  totalScore: bigint;
  inGameCoins: bigint;
  questTokensEarned: bigint;
  totalGamesPlayed: bigint;
  registrationTime: bigint;
}

export interface GameSession {
  player: string;
  stage: bigint;
  score: bigint;
  coinsCollected: bigint;
  stageCompleted: boolean;
  timestamp: bigint;
}

// Main hook for Celo Runner contract interactions
export const useCeloRunner = () => {
  const account = useActiveAccount();
  const [isPending, setIsPending] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [hash, setHash] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  // Write Functions
  const registerPlayer = async (username: string) => {
    if (!account) throw new Error('No account connected');
    
    try {
      setIsPending(true);
      setError(null);
      console.log('📝 Registering player:', username);
      
      const contract = getCeloRunnerContract();
      const transaction = prepareContractCall({
        contract,
        method: "registerPlayer",
        params: [username],
      });

      const { transactionHash } = await sendTransaction({
        account,
        transaction,
      });
      
      setHash(transactionHash);
      setIsPending(false);
      setIsConfirming(true);

      await waitForReceipt({
        client,
        chain: celoSepolia,
        transactionHash,
      });

      setIsConfirming(false);
      setIsSuccess(true);
      console.log('✅ Registration transaction confirmed');
      return transactionHash;
    } catch (err: any) {
      console.error('❌ Failed to register player:', err);
      
      // Check if error is "Already registered" - this is actually fine
      const errorMessage = err?.message || err?.toString() || '';
      if (errorMessage.includes('Already registered') || 
          errorMessage.includes('already registered') ||
          errorMessage.includes('Player already registered')) {
        console.log('ℹ️ Player already registered - this is fine, just reload data');
        // Don't throw error, just return a success indicator
        setIsPending(false);
        setIsConfirming(false);
        setIsSuccess(true);
        return 'already_registered'; // Return a special value to indicate already registered
      }
      
      setError(err);
      setIsPending(false);
      setIsConfirming(false);
      throw err;
    }
  };

  const saveGameSession = async (
    stage: number,
    finalScore: number,
    coinsCollected: number,
    questionsCorrect: number,
    stageCompleted: boolean
  ) => {
    if (!account) throw new Error('No account connected');
    
    try {
      setIsPending(true);
      setError(null);
      console.log('💾 Saving game session:', { stage, finalScore, coinsCollected, questionsCorrect, stageCompleted });

      const validStage = stage || 1;
      const validScore = finalScore || 0;
      const validCoins = coinsCollected || 0;
      const validQuestions = questionsCorrect || 0;

      console.log('💾 Validated parameters:', { validStage, validScore, validCoins, validQuestions, stageCompleted });

      const contract = getCeloRunnerContract();
      const transaction = prepareContractCall({
        contract,
        method: "saveGameSession",
        params: [
          BigInt(validStage),
          BigInt(validScore),
          BigInt(validCoins),
          BigInt(validQuestions),
          stageCompleted
        ],
      });

      const { transactionHash } = await sendTransaction({
        account,
        transaction,
      });
      
      setHash(transactionHash);
      setIsPending(false);
      setIsConfirming(true);
      console.log('✅ Game session save transaction submitted, hash:', transactionHash);

      await waitForReceipt({
        client,
        chain: celoSepolia,
        transactionHash,
      });

      setIsConfirming(false);
      setIsSuccess(true);
      console.log('⏳ Transaction confirmed');
      return transactionHash;
    } catch (err: any) {
      console.error('❌ Failed to save game session:', err);
      setError(err);
      setIsPending(false);
      setIsConfirming(false);
      throw err;
    }
  };

  const purchaseItem = async (itemType: string, cost: number) => {
    if (!account) throw new Error('No account connected');
    
    try {
      setIsPending(true);
      setError(null);
      console.log('🛒 Purchasing item:', { itemType, cost });
      
      const contract = getCeloRunnerContract();
      const transaction = prepareContractCall({
        contract,
        method: "purchaseItem",
        params: [itemType, BigInt(cost)],
      });

      const { transactionHash } = await sendTransaction({
        account,
        transaction,
      });
      
      setHash(transactionHash);
      setIsPending(false);
      setIsConfirming(true);

      await waitForReceipt({
        client,
        chain: celoSepolia,
        transactionHash,
      });

      setIsConfirming(false);
      setIsSuccess(true);
      console.log('✅ Item purchase transaction confirmed');
      return transactionHash;
    } catch (err: any) {
      console.error('❌ Failed to purchase item:', err);
      setError(err);
      setIsPending(false);
      setIsConfirming(false);
      throw err;
    }
  };

  const claimTokens = async (stage: number) => {
    if (!account) throw new Error('No account connected');
    
    try {
      setIsPending(true);
      setError(null);
      console.log('💰 Claiming tokens for stage:', stage);
      console.log('📤 Submitting transaction to blockchain...');

      const contract = getCeloRunnerContract();
      const transaction = prepareContractCall({
        contract,
        method: "claimTokens",
        params: [BigInt(stage)],
      });

      const { transactionHash } = await sendTransaction({
        account,
        transaction,
      });
      
      setHash(transactionHash);
      setIsPending(false);
      setIsConfirming(true);
      console.log('✅ Claim tokens transaction submitted, hash:', transactionHash);

      await waitForReceipt({
        client,
        chain: celoSepolia,
        transactionHash,
      });

      setIsConfirming(false);
      setIsSuccess(true);
      console.log('⏳ Transaction confirmed');
      return transactionHash;
    } catch (err: any) {
      console.error('❌ Failed to claim tokens:', err);
      setError(err);
      setIsPending(false);
      setIsConfirming(false);
      throw err;
    }
  };

  const claimNFT = async (stage: number) => {
    if (!account) throw new Error('No account connected');
    
    try {
      setIsPending(true);
      setError(null);
      console.log('🎖️ Claiming NFT for stage:', stage);
      console.log('📤 Submitting transaction to blockchain...');

      const contract = getCeloRunnerContract();
      const transaction = prepareContractCall({
        contract,
        method: "claimNFT",
        params: [BigInt(stage)],
      });

      const { transactionHash } = await sendTransaction({
        account,
        transaction,
      });
      
      setHash(transactionHash);
      setIsPending(false);
      setIsConfirming(true);
      console.log('✅ Claim NFT transaction submitted, hash:', transactionHash);

      await waitForReceipt({
        client,
        chain: celoSepolia,
        transactionHash,
      });

      setIsConfirming(false);
      setIsSuccess(true);
      console.log('⏳ Transaction confirmed');
      return transactionHash;
    } catch (err: any) {
      console.error('❌ Failed to claim NFT:', err);
      setError(err);
      setIsPending(false);
      setIsConfirming(false);
      throw err;
    }
  };

  // Reset success state after a delay
  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        setIsSuccess(false);
        setHash(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess]);

  return {
    // Write functions
    registerPlayer,
    saveGameSession,
    purchaseItem,
    claimTokens,
    claimNFT,

    // Transaction state
    isPending,
    isConfirming,
    isSuccess,
    error,
    hash,
  };
};

// Hook for reading player data
export const usePlayerData = (playerAddress?: string) => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const refetch = async () => {
    if (!playerAddress) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const contract = getCeloRunnerContract();
      // Use ABI method name instead of signature string for better struct parsing
      const result = await readContract({
        contract,
        method: "getPlayer",
        params: [playerAddress as `0x${string}`],
      });
      
      setData(result);
      console.log('🔍 usePlayerData - Raw contract response:', result);
      
      // Helper to safely serialize BigInt values for logging
      const safeStringify = (obj: any): string => {
        return JSON.stringify(obj, (key, value) =>
          typeof value === 'bigint' ? value.toString() : value
        , 2);
      };
      
      console.log('🔍 usePlayerData - Detailed check:', {
        hasData: !!result,
        username: result?.username,
        usernameType: typeof result?.username,
        usernameLength: result?.username ? String(result.username).length : 0,
        isRegistered: result?.isRegistered,
        isRegisteredType: typeof result?.isRegistered,
        currentStage: result?.currentStage,
        inGameCoins: result?.inGameCoins,
        fullResult: safeStringify(result)
      });
    } catch (err: any) {
      console.error('Error fetching player data:', err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (playerAddress) {
      refetch();
    } else {
      setData(null);
    }
  }, [playerAddress]);

  // Transform the data - handle both array and object formats
  // thirdweb may return structs as arrays [username, isRegistered, currentStage, ...]
  // or as objects {username, isRegistered, currentStage, ...}
  const player = data ? (() => {
    // Check if it's an array format
    if (Array.isArray(data)) {
      return {
        username: (data[0] || '').trim(),
        isRegistered: Boolean(data[1]),
        currentStage: Number(data[2] || 0),
        totalScore: Number(data[3] || 0),
        inGameCoins: Number(data[4] || 0),
        questTokensEarned: Number(data[5] || 0),
        totalGamesPlayed: Number(data[6] || 0),
        registrationTime: Number(data[7] || 0),
      };
    }
    // Object format
    return {
      username: (data.username || '').trim(),
      isRegistered: Boolean(data.isRegistered),
      currentStage: Number(data.currentStage || 0),
      totalScore: Number(data.totalScore || 0),
      inGameCoins: Number(data.inGameCoins || 0),
      questTokensEarned: Number(data.questTokensEarned || 0),
      totalGamesPlayed: Number(data.totalGamesPlayed || 0),
      registrationTime: Number(data.registrationTime || 0),
    };
  })() : null;

  console.log('🔍 usePlayerData - Transformed player:', {
    player,
    rawIsRegistered: data?.isRegistered,
    finalIsRegistered: player?.isRegistered
  });

  return {
    player,
    isLoading,
    error,
    refetch,
    raw: data,
  };
};

// Hook for reading leaderboard data
export const useLeaderboard = (stage: number, limit: number = 10) => {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const refetch = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const contract = getCeloRunnerContract();
      // Use ABI method name instead of signature string for better struct parsing
      const result = await readContract({
        contract,
        method: "getStageLeaderboard",
        params: [BigInt(stage), BigInt(limit)],
      });
      
      setData(result as any[]);
      console.log('🔍 useLeaderboard - Raw data:', result);
    } catch (err: any) {
      console.error('Error fetching leaderboard:', err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, [stage, limit]);

  // Handle both array and object formats for structs
  const leaderboard = (data || []).map((session: any, index: number) => {
    // Check if it's an array format [player, stage, score, coinsCollected, stageCompleted, timestamp]
    if (Array.isArray(session)) {
      return {
        rank: index + 1,
        player: session[0] || 'Unknown',
        stage: Number(session[1] || 0),
        score: Number(session[2] || 0),
        coinsCollected: Number(session[3] || 0),
        stageCompleted: Boolean(session[4]),
        timestamp: Number(session[5] || 0),
      };
    }
    // Object format
    return {
      rank: index + 1,
      player: session?.player || 'Unknown',
      stage: Number(session?.stage || 0),
      score: Number(session?.score || 0),
      coinsCollected: Number(session?.coinsCollected || 0),
      stageCompleted: Boolean(session?.stageCompleted),
      timestamp: Number(session?.timestamp || 0),
    };
  });

  return {
    leaderboard,
    isLoading,
    error,
    refetch,
    raw: data,
  };
};

// Hook for checking stage completion
export const useStageCompletion = (playerAddress?: string, stage?: number) => {
  const [data, setData] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!playerAddress || stage === undefined) {
      setData(false);
      return;
    }

    const fetch = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
      const contract = getCeloRunnerContract();
      // Use ABI method name instead of signature string
      const result = await readContract({
        contract,
        method: "isStageCompleted",
        params: [playerAddress as `0x${string}`, BigInt(stage)],
      });
        
        setData(result as boolean);
        console.log(`🔍 useStageCompletion - Stage ${stage} for ${playerAddress?.slice(-4)}:`, result);
      } catch (err: any) {
        console.error('Error checking stage completion:', err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetch();
  }, [playerAddress, stage]);

  return {
    isCompleted: data,
    isLoading,
    error,
  };
};

// Hook for checking if tokens are claimed
export const useTokensClaimed = (playerAddress?: string, stage?: number) => {
  const [data, setData] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const refetch = async () => {
    if (!playerAddress || stage === undefined) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const contract = getCeloRunnerContract();
      // Use ABI method name instead of signature string
      const result = await readContract({
        contract,
        method: "areTokensClaimed",
        params: [playerAddress as `0x${string}`, BigInt(stage)],
      });
      
      setData(result as boolean);
      console.log(`🔍 useTokensClaimed - Stage ${stage} for ${playerAddress?.slice(-4)}:`, result);
    } catch (err: any) {
      console.error('Error checking tokens claimed:', err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (playerAddress && stage !== undefined) {
      refetch();
    } else {
      setData(false);
    }
  }, [playerAddress, stage]);

  return {
    isClaimed: data,
    isLoading,
    error,
    refetch,
  };
};

// Hook for checking if NFT is claimed
export const useNFTClaimed = (playerAddress?: string, stage?: number) => {
  const [data, setData] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const refetch = async () => {
    if (!playerAddress || stage === undefined) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const contract = getCeloRunnerContract();
      // Use ABI method name instead of signature string
      const result = await readContract({
        contract,
        method: "isNFTClaimed",
        params: [playerAddress as `0x${string}`, BigInt(stage)],
      });
      
      setData(result as boolean);
      console.log(`🔍 useNFTClaimed - Stage ${stage} for ${playerAddress?.slice(-4)}:`, result);
    } catch (err: any) {
      console.error('Error checking NFT claimed:', err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (playerAddress && stage !== undefined) {
      refetch();
    } else {
      setData(false);
    }
  }, [playerAddress, stage]);

  return {
    isClaimed: data,
    isLoading,
    error,
    refetch,
  };
};

// Hook for general leaderboard (all stages combined)
export const useGeneralLeaderboard = (limit: number = 10) => {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const refetch = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const contract = getCeloRunnerContract();
      // Use ABI method name instead of signature string for better struct parsing
      const result = await readContract({
        contract,
        method: "getGeneralLeaderboard",
        params: [BigInt(limit)],
      });
      
      setData(result as any[]);
      console.log('🔍 useGeneralLeaderboard - Raw data:', result);
    } catch (err: any) {
      console.error('Error fetching general leaderboard:', err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, [limit]);

  // Handle both array and object formats for structs
  const leaderboard = (data || []).map((session: any, index: number) => {
    // Check if it's an array format [player, stage, score, coinsCollected, stageCompleted, timestamp]
    if (Array.isArray(session)) {
      return {
        rank: index + 1,
        player: session[0] || 'Unknown',
        stage: Number(session[1] || 0),
        score: Number(session[2] || 0),
        coinsCollected: Number(session[3] || 0),
        stageCompleted: Boolean(session[4]),
        timestamp: Number(session[5] || 0),
      };
    }
    // Object format
    return {
      rank: index + 1,
      player: session?.player || 'Unknown',
      stage: Number(session?.stage || 0),
      score: Number(session?.score || 0),
      coinsCollected: Number(session?.coinsCollected || 0),
      stageCompleted: Boolean(session?.stageCompleted),
      timestamp: Number(session?.timestamp || 0),
    };
  });

  return {
    leaderboard,
    isLoading,
    error,
    refetch,
    raw: data,
  };
};

// Hook for game statistics
export const useGameStats = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const refetch = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const contract = getCeloRunnerContract();
      // Use ABI method name instead of signature string
      const result = await readContract({
        contract,
        method: "getGameStats",
        params: [],
      });
      
      setData(result);
    } catch (err: any) {
      console.error('Error fetching game stats:', err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, []);

  const stats = data ? {
    totalPlayers: Number(data[0] || 0),
    totalGamesPlayed: Number(data[1] || 0),
  } : null;

  return {
    stats,
    isLoading,
    error,
    refetch,
  };
};
