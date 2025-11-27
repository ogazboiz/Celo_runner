// Contract addresses on Celo Sepolia
export const CONTRACTS = {
  QUEST_TOKEN: '0x48e2e16a5cfe127fbfc76f3fd85163bbae64a861' as `0x${string}`,
  RUNNER_BADGE: '0x7b72c0e84012f868fe9a4164a8122593d0f38b84' as `0x${string}`,
  CELO_RUNNER: '0x4588b0ff4016952e4391dea6dcc7f9a1484ac7b6' as `0x${string}`,
  MARKETPLACE: '0x370f6701cFDECC0A9D744a12b156317AA3CE32D1' as `0x${string}`, // Updated with cUSD support
  CUSD_TOKEN: '0xdE9e4C3ce781b4bA68120d6261cbad65ce0aB00b' as `0x${string}`, // Celo Sepolia cUSD
} as const;

// Helper function to get contract addresses
export function getContractAddresses() {
  return CONTRACTS;
}

// Network configuration
export const CELO_SEPOLIA = {
  id: 11142220,
  name: 'Celo Sepolia Testnet',
  network: 'celo-sepolia',
  nativeCurrency: {
    decimals: 18,
    name: 'CELO',
    symbol: 'CELO',
  },
  rpcUrls: {
    default: {
      http: ['https://forno.celo-sepolia.celo-testnet.org/'],
    },
    public: {
      http: ['https://forno.celo-sepolia.celo-testnet.org/'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Celo Explorer',
      url: 'https://explorer.celo-sepolia.celo-testnet.org',
    },
  },
  testnet: true,
} as const;

// Game constants
export const GAME_CONSTANTS = {
  REGISTRATION_BONUS: 100,
  COMPLETION_MULTIPLIER: 2,
  TOTAL_STAGES: 3,
  STAGE_REWARDS: {
    1: 20,
    2: 50,
    3: 100,
  },
  STAGE_BADGES: {
    1: 'Explorer Badge',
    2: 'Adventurer Badge',
    3: 'Master Badge',
  },
} as const;
