# MiniPay Integration in Celo Runner

## What is MiniPay?

MiniPay is a **stablecoin wallet** built into Opera Mini browser and available as a standalone app. It's designed for:

- **Mobile-first users** - Especially popular in emerging markets
- **Low-cost transactions** - Sub-cent fees for stablecoin transfers
- **Phone number mapping** - Uses phone numbers as wallet addresses (easier than long hex addresses)
- **Lightweight** - Only 2MB, works with limited data
- **Built-in app discovery** - Users can access dApps directly from the wallet

**Key Stats:**
- 10+ million activated addresses
- 25% of new USDT addresses in Q4 2024
- Fastest growing non-custodial wallet in Global South

## Integration Features

### ✅ **Wallet Detection**
- Automatically detects MiniPay wallet via `window.ethereum.isMiniPay`
- Shows appropriate UI based on wallet type
- Works seamlessly with other wallets too

### ✅ **Visual Indicators**
- Green badge showing "MiniPay Detected!" when MiniPay is available
- Message explaining MiniPay benefits
- "Add Cash to MiniPay" button for easy funding

### ✅ **cUSD Balance Checking** (Available)
- Utility function to check cUSD (Celo Dollar) balance
- Uses Celo's stable token contract
- Supports both testnet and mainnet

### ✅ **Transaction Support**
- MiniPay users can make transactions through thirdweb
- Low-cost stablecoin transfers
- Works with existing transaction flow

### ✅ **Add Cash Deeplink**
- Quick access to MiniPay's add cash screen
- One-click button to add funds
- Opens MiniPay's native add cash interface

## Implementation Details

### Files Created/Modified:

1. **`src/utils/minipay.ts`** - Core MiniPay utilities
   - `isMiniPayAvailable()` - Detects MiniPay wallet
   - `getMiniPayAddress()` - Gets connected address from MiniPay
   - `checkCUSDBalance()` - Checks cUSD balance
   - `openMiniPayAddCash()` - Opens add cash screen
   - `checkTransactionStatus()` - Checks transaction status

2. **`src/components/NewWalletConnection.tsx`** - MiniPay detection UI
   - Detects MiniPay on component mount
   - Shows MiniPay badge when detected
   - Displays "Add Cash" button for MiniPay users

### How It Works:

```
User Opens App in MiniPay Browser
    ↓
MiniPay Detection (isMiniPayAvailable)
    ↓
Shows MiniPay Badge & "Add Cash" Button
    ↓
User Connects Wallet via thirdweb
    ↓
User Can:
- Play games
- Make transactions
- Earn rewards
- Use low-cost stablecoin transfers
```

## Benefits

1. **Lower Transaction Costs** - MiniPay users pay sub-cent fees
2. **Easier Onboarding** - Phone number-based addresses (easier than hex)
3. **Mobile Gaming Focus** - Perfect for mobile-first design
4. **Global Reach** - Access to users in emerging markets
5. **Hackathon Requirement** - Completes Celo hackathon integration step

## Usage

The integration is automatic - no additional configuration needed. When a user opens the app in MiniPay browser:

1. The app automatically detects MiniPay
2. Shows a green badge indicating MiniPay is detected
3. Displays an "Add Cash" button for easy funding
4. All wallet connections work seamlessly through thirdweb

## Future Enhancements (Optional)

- Phone number resolution (using @celo/identity)
- Direct cUSD payments for rewards
- MiniPay-specific transaction optimizations
- cUSD balance display in game UI
- Social features using phone numbers

## Testing

To test MiniPay integration:

1. Open Opera Mini browser on mobile device
2. Navigate to the Celo Runner app
3. You should see the "MiniPay Detected!" badge
4. Connect wallet and verify transactions work
5. Use "Add Cash" button to test funding flow

## Summary

**What MiniPay is:**
- Stablecoin wallet in Opera Mini browser
- Mobile-first, low-cost transactions
- 10+ million users globally

**How we integrated it:**
- Automatic detection
- Visual indicators
- Add cash deeplink
- Transaction support

**Why it's useful:**
- Lower transaction costs
- Easier onboarding
- Mobile gaming focus
- Global reach
- Hackathon requirement

**Result:**
- Complete MiniPay integration
- Better UX for MiniPay users
- Production-ready implementation

