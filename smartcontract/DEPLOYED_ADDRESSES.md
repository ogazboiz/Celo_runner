# Celo Runner - Deployed Contracts

## Network: Celo Sepolia Testnet
- Chain ID: 11142220
- RPC URL: https://forno.celo-sepolia.celo-testnet.org/
- Explorer: https://explorer.celo-sepolia.celo-testnet.org/

## Deployed Contract Addresses

### QuestToken (ERC20)
**Address:** `0x48e2e16a5cfe127fbfc76f3fd85163bbae64a861`
- Symbol: QUEST
- Decimals: 18
- [View on Explorer](https://explorer.celo-sepolia.celo-testnet.org/address/0x48e2e16a5cfe127fbfc76f3fd85163bbae64a861)

### RunnerBadge (ERC721)
**Address:** `0x7b72c0e84012f868fe9a4164a8122593d0f38b84`
- Symbol: BADGE
- [View on Explorer](https://explorer.celo-sepolia.celo-testnet.org/address/0x7b72c0e84012f868fe9a4164a8122593d0f38b84)

### CeloRunner (Main Game Contract)
**Address:** `0x4588b0ff4016952e4391dea6dcc7f9a1484ac7b6`
- [View on Explorer](https://explorer.celo-sepolia.celo-testnet.org/address/0x4588b0ff4016952e4391dea6dcc7f9a1484ac7b6)

## Deployment Info
- Deployer: 0xd2df53d9791e98db221842dd085f4144014bbe2a
- Gas Used: 7,325,561
- Total Cost: 0.183146350561 ETH
- Timestamp: 2025-11-25

## Frontend Configuration

Use these addresses in your frontend `.env` file:

```env
NEXT_PUBLIC_QUEST_TOKEN_ADDRESS=0x48e2e16a5cfe127fbfc76f3fd85163bbae64a861
NEXT_PUBLIC_RUNNER_BADGE_ADDRESS=0x7b72c0e84012f868fe9a4164a8122593d0f38b84
NEXT_PUBLIC_CELO_RUNNER_ADDRESS=0x4588b0ff4016952e4391dea6dcc7f9a1484ac7b6
NEXT_PUBLIC_CHAIN_ID=11142220
NEXT_PUBLIC_RPC_URL=https://forno.celo-sepolia.celo-testnet.org/
```
