# Celo Runner Smart Contracts

Smart contracts for the Celo Runner game, built with Solidity and Foundry. This project includes ERC20 quest tokens, ERC721 achievement badges, and a comprehensive game management system.

## 📋 Contracts Overview

### 1. QuestToken.sol
- **Type**: ERC20 Token
- **Symbol**: QUEST
- **Purpose**: Fungible tokens earned by completing game stages
- **Rewards**: 
  - Stage 1: 20 QUEST
  - Stage 2: 50 QUEST
  - Stage 3: 100 QUEST

### 2. RunnerBadge.sol
- **Type**: ERC721 NFT
- **Symbol**: BADGE
- **Purpose**: Achievement badges for stage completion
- **Badges**:
  - Stage 1: Explorer Badge
  - Stage 2: Adventurer Badge
  - Stage 3: Master Badge

### 3. CeloRunner.sol
- **Type**: Main Game Contract
- **Features**:
  - Player registration with username
  - Game session tracking and leaderboards
  - Stage progression system (3 stages)
  - In-game coin economy
  - Token and NFT reward claiming
  - Per-stage and general leaderboards

## 🚀 Getting Started

### Prerequisites
- [Foundry](https://book.getfoundry.sh/getting-started/installation)
- Node.js and npm (for frontend integration)
- Celo wallet with testnet funds

### Installation

1. Install dependencies:
```bash
forge install
```

2. Compile contracts:
```bash
forge build
```

3. Run tests (if available):
```bash
forge test
```

## 📦 Deployment

### Deploy to Celo Alfajores Testnet

1. Create a `.env` file:
```bash
PRIVATE_KEY=your_private_key_here
ALFAJORES_RPC_URL=https://alfajores-forno.celo-testnet.org
```

2. Deploy contracts:
```bash
source .env
forge script script/DeployCeloRunner.s.sol:DeployCeloRunner \
  --rpc-url $ALFAJORES_RPC_URL \
  --private-key $PRIVATE_KEY \
  --broadcast \
  --verify
```

### Deploy to Celo Mainnet

```bash
forge script script/DeployCeloRunner.s.sol:DeployCeloRunner \
  --rpc-url https://forno.celo.org \
  --private-key $PRIVATE_KEY \
  --broadcast \
  --verify
```

## 🎮 Game Mechanics

### Player Registration
- Players register with a unique username (1-20 characters)
- Receive 100 in-game coins as a registration bonus
- Start at Stage 1

### Stage Progression
- 3 sequential stages that unlock upon completion
- Players must complete questions to finish a stage
- Completing a stage:
  - Doubles the coins collected during that session
  - Unlocks the next stage
  - Makes tokens and NFT claimable

### Rewards System
- **In-Game Coins**: Collected during gameplay, used for item purchases
- **Quest Tokens (ERC20)**: Claimed after stage completion
- **Achievement Badges (ERC721)**: Unique NFTs for each completed stage

### Leaderboards
- Per-stage leaderboards track all game sessions
- General leaderboard aggregates scores across all stages
- Sorted by highest scores

## 🔧 Contract Interactions

### For Players

```solidity
// Register as a player
celoRunner.registerPlayer("YourUsername");

// Save a game session
celoRunner.saveGameSession(
    1,              // stage
    1000,           // finalScore
    50,             // coinsCollected
    5,              // questionsCorrect
    true            // stageCompleted
);

// Claim ERC20 tokens for completed stage
celoRunner.claimTokens(1);

// Claim NFT badge for completed stage
celoRunner.claimNFT(1);

// Purchase in-game item
celoRunner.purchaseItem("PowerUp", 25);
```

### For Frontend Integration

```javascript
// Get player data
const player = await celoRunner.getPlayer(playerAddress);

// Check stage completion
const isCompleted = await celoRunner.isStageCompleted(playerAddress, 1);

// Get leaderboard
const leaderboard = await celoRunner.getStageLeaderboard(1, 10);

// Get game statistics
const [totalPlayers, totalGames] = await celoRunner.getGameStats();
```

## 📊 Contract Addresses

After deployment, update these addresses:

### Alfajores Testnet
- QuestToken: `TBD`
- RunnerBadge: `TBD`
- CeloRunner: `TBD`

### Mainnet
- QuestToken: `TBD`
- RunnerBadge: `TBD`
- CeloRunner: `TBD`

## 🔐 Security Features

- Owner-controlled contract address updates
- Minting restricted to game contract only
- Stage progression validation
- Duplicate claim prevention
- Username validation (1-20 characters)

## 🛠️ Development

### Project Structure
```
smartcontract/
├── src/
│   ├── QuestToken.sol      # ERC20 token contract
│   ├── RunnerBadge.sol     # ERC721 NFT contract
│   └── CeloRunner.sol      # Main game contract
├── script/
│   └── DeployCeloRunner.s.sol  # Deployment script
├── test/                   # Test files (to be added)
└── foundry.toml           # Foundry configuration
```

### Adding Tests

Create test files in the `test/` directory:

```solidity
// test/CeloRunner.t.sol
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../src/CeloRunner.sol";

contract CeloRunnerTest is Test {
    // Your tests here
}
```

Run tests:
```bash
forge test -vvv
```

## 📝 Key Differences from Hedera Version

1. **Token Standard**: Uses ERC20 instead of Hedera Token Service (HTS)
2. **NFT Standard**: Uses ERC721 instead of HTS NFTs
3. **Direct Minting**: Tokens and NFTs are minted directly on-chain
4. **OpenZeppelin**: Built on battle-tested OpenZeppelin contracts
5. **Gas Optimization**: Optimized for Celo's gas model

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🔗 Resources

- [Celo Documentation](https://docs.celo.org/)
- [Foundry Book](https://book.getfoundry.sh/)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
- [Solidity Documentation](https://docs.soliditylang.org/)

## 💡 Support

For issues and questions:
- Open an issue on GitHub
- Check existing documentation
- Review the contract comments

---

Built with ❤️ for the Celo ecosystem
