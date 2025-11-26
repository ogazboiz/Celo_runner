# Quick Start - Deploy Celo Runner Contracts

## Prerequisites
- Foundry installed
- Celo wallet with testnet CELO (get from [faucet](https://faucet.celo.org/alfajores))

## Step 1: Environment Setup

Create `.env` file in the `smartcontract` directory:

```bash
PRIVATE_KEY=your_private_key_without_0x_prefix
ALFAJORES_RPC_URL=https://alfajores-forno.celo-testnet.org
CELO_RPC_URL=https://forno.celo.org
```

## Step 2: Deploy to Alfajores Testnet

```bash
cd smartcontract

# Load environment variables
source .env

# Deploy contracts
forge script script/DeployCeloRunner.s.sol:DeployCeloRunner \
  --rpc-url $ALFAJORES_RPC_URL \
  --private-key $PRIVATE_KEY \
  --broadcast \
  -vvvv
```

## Step 3: Save Contract Addresses

After deployment, you'll see output like:

```
=== Deployment Summary ===
QuestToken: 0x1234...
RunnerBadge: 0x5678...
CeloRunner: 0x9abc...
========================
```

**Save these addresses!** You'll need them for frontend integration.

## Step 4: Verify Contracts (Optional)

If you want to verify on Celo Explorer:

```bash
# Install verification tool
forge verify-contract \
  --chain-id 44787 \
  --compiler-version v0.8.30 \
  <CONTRACT_ADDRESS> \
  src/CeloRunner.sol:CeloRunner \
  --constructor-args $(cast abi-encode "constructor(address,address)" <QUEST_TOKEN_ADDRESS> <RUNNER_BADGE_ADDRESS>)
```

## Step 5: Test the Contracts

### Using Cast (Foundry CLI)

```bash
# Register a player
cast send <CELO_RUNNER_ADDRESS> \
  "registerPlayer(string)" "TestPlayer" \
  --private-key $PRIVATE_KEY \
  --rpc-url $ALFAJORES_RPC_URL

# Check player info
cast call <CELO_RUNNER_ADDRESS> \
  "getPlayer(address)" <YOUR_ADDRESS> \
  --rpc-url $ALFAJORES_RPC_URL

# Save a game session (stage 1, score 1000, coins 50, questions 5, completed)
cast send <CELO_RUNNER_ADDRESS> \
  "saveGameSession(uint256,uint256,uint256,uint256,bool)" \
  1 1000 50 5 true \
  --private-key $PRIVATE_KEY \
  --rpc-url $ALFAJORES_RPC_URL

# Claim tokens
cast send <CELO_RUNNER_ADDRESS> \
  "claimTokens(uint256)" 1 \
  --private-key $PRIVATE_KEY \
  --rpc-url $ALFAJORES_RPC_URL

# Claim NFT
cast send <CELO_RUNNER_ADDRESS> \
  "claimNFT(uint256)" 1 \
  --private-key $PRIVATE_KEY \
  --rpc-url $ALFAJORES_RPC_URL

# Check token balance
cast call <QUEST_TOKEN_ADDRESS> \
  "balanceOf(address)" <YOUR_ADDRESS> \
  --rpc-url $ALFAJORES_RPC_URL
```

## Frontend Integration

### Contract ABIs

After compilation, ABIs are in:
- `out/QuestToken.sol/QuestToken.json`
- `out/RunnerBadge.sol/RunnerBadge.json`
- `out/CeloRunner.sol/CeloRunner.json`

### Example Web3 Integration (ethers.js)

```javascript
import { ethers } from 'ethers';
import CeloRunnerABI from './abis/CeloRunner.json';

// Connect to Celo
const provider = new ethers.JsonRpcProvider('https://alfajores-forno.celo-testnet.org');
const signer = new ethers.Wallet(privateKey, provider);

// Contract instance
const celoRunner = new ethers.Contract(
  'YOUR_CELO_RUNNER_ADDRESS',
  CeloRunnerABI.abi,
  signer
);

// Register player
await celoRunner.registerPlayer('PlayerName');

// Save game session
await celoRunner.saveGameSession(
  1,      // stage
  1500,   // score
  75,     // coins
  5,      // questions correct
  true    // completed
);

// Claim rewards
await celoRunner.claimTokens(1);
await celoRunner.claimNFT(1);

// Get player data
const player = await celoRunner.getPlayer(address);
console.log('Player:', player);
```

## Troubleshooting

### "Insufficient funds" error
- Get testnet CELO from [Celo Faucet](https://faucet.celo.org/alfajores)

### "Stage locked" error
- Make sure you're playing stages in order (1 → 2 → 3)
- Complete previous stage before accessing next one

### "Already registered" error
- Each address can only register once
- Use a different wallet address for testing

### "Tokens already claimed" error
- Each stage's tokens can only be claimed once
- Check with `areTokensClaimed(address, stage)`

## Useful Commands

```bash
# Check compilation
forge build

# Run tests (when added)
forge test -vvv

# Get contract size
forge build --sizes

# Format code
forge fmt

# Clean build artifacts
forge clean
```

## Next Steps

1. ✅ Deploy contracts
2. ✅ Test basic functionality
3. 🔄 Integrate with frontend
4. 🔄 Add game UI
5. 🔄 Deploy to mainnet (when ready)

## Resources

- [Celo Docs](https://docs.celo.org/)
- [Foundry Book](https://book.getfoundry.sh/)
- [Celo Explorer (Alfajores)](https://explorer.celo.org/alfajores)
- [Celo Faucet](https://faucet.celo.org/alfajores)

---

**Need help?** Check the [CONTRACT_README.md](./CONTRACT_README.md) for detailed documentation.
