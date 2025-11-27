export interface QuizItem {
    id: string;
    question: string;
    options: string[];
    correctAnswer: number; // 0-based index into options
  }
  
  export const questions: QuizItem[] = [
    // Celo & Web3 (1–25)
    { id: '1', question: 'What consensus mechanism powers the Celo network?', options: ['Proof of Stake (PoS)', 'Proof of Work', 'Hashgraph', 'Byzantine Fault'], correctAnswer: 0 },
    { id: '2', question: 'What is the native token of Celo?', options: ['CEL', 'CELO', 'CGLD', 'CLO'], correctAnswer: 1 },
    { id: '3', question: 'Celo is designed to be...', options: ['Mobile-first', 'Desktop-only', 'Server-based', 'Offline-only'], correctAnswer: 0 },
    { id: '4', question: 'Celo is compatible with the Ethereum Virtual Machine (EVM).', options: ['True', 'False'], correctAnswer: 0 },
    { id: '5', question: 'What stablecoin is native to the Celo platform?', options: ['USDT', 'USDC', 'cUSD', 'DAI'], correctAnswer: 2 },
    { id: '6', question: 'Which of these is a key feature of Celo?', options: ['Ultra-light client', 'Mining', 'Gas-free only', 'Centralized'], correctAnswer: 0 },
    { id: '7', question: 'What can be used as a public key on Celo?', options: ['Phone number', 'Email only', 'IP address', 'MAC address'], correctAnswer: 0 },
    { id: '8', question: 'Celo aims to empower...', options: ['Smartphone users', 'Miners', 'Banks', 'Governments'], correctAnswer: 0 },
    { id: '9', question: 'What language is primarily used for Celo smart contracts?', options: ['Rust', 'Solidity', 'Python', 'C++'], correctAnswer: 1 },
    { id: '10', question: 'What does Valora App allow you to do?', options: ['Mine Bitcoin', 'Send crypto to phone numbers', 'Hack servers', 'Create NFTs only'], correctAnswer: 1 },
    { id: '11', question: 'What is the average block time on Celo?', options: ['5 seconds', '1 minute', '10 minutes', '1 hour'], correctAnswer: 0 },
    { id: '12', question: 'What is the name of Celo’s network explorer?', options: ['Etherscan', 'Celo Explorer', 'BscScan', 'PolygonScan'], correctAnswer: 1 },
    { id: '13', question: 'When did Celo mainnet launch?', options: ['2020', '2018', '2022', '2015'], correctAnswer: 0 },
    { id: '14', question: 'What is CELO mainly used for?', options: ['Governance & Fees', 'Buying groceries', 'Mining', 'Nothing'], correctAnswer: 0 },
    { id: '15', question: 'How does Celo help financial inclusion?', options: ['By requiring expensive hardware', 'By being mobile-accessible', 'By banning cash', 'By increasing fees'], correctAnswer: 1 },
    { id: '16', question: 'Which wallet is optimized for Celo?', options: ['Valora', 'Phantom', 'Keplr', 'Yoroi'], correctAnswer: 0 },
    { id: '17', question: 'What is staking in Celo?', options: ['Locking CELO to secure network', 'Selling CELO', 'Burning CELO', 'Mining CELO'], correctAnswer: 0 },
    { id: '18', question: 'Celo is a carbon-negative blockchain.', options: ['True', 'False'], correctAnswer: 0 },
    { id: '19', question: 'How can you pay for gas on Celo?', options: ['Only CELO', 'CELO or cUSD', 'Bitcoin', 'Fiat cash'], correctAnswer: 1 },
    { id: '20', question: 'What is the mission of Celo?', options: ['To build a financial system that creates conditions of prosperity for everyone', 'To replace Bitcoin', 'To make banks rich', 'To stop crypto'], correctAnswer: 0 },
    { id: '21', question: 'Which organization supports Celo development?', options: ['Celo Foundation', 'Ethereum Foundation', 'Bitcoin Foundation', 'Ripple Labs'], correctAnswer: 0 },
    { id: '22', question: 'What is "Refi" in the context of Celo?', options: ['Regenerative Finance', 'Real Finance', 'Red Finance', 'Rapid Finance'], correctAnswer: 0 },
    { id: '23', question: 'Celo uses a decentralized phone verification protocol.', options: ['True', 'False'], correctAnswer: 0 },
    { id: '24', question: 'Which stablecoin is pegged to the Euro on Celo?', options: ['cEUR', 'EURS', 'EURT', 'AgEUR'], correctAnswer: 0 },
    { id: '25', question: 'What is a real-world use of Celo?', options: ['Universal Basic Income (UBI) distribution', 'High frequency trading', 'Dark web payments', 'None'], correctAnswer: 0 },
  
  // MiniPay & Advanced Celo (26–50)
  { id: '26', question: 'What is MiniPay?', options: ['A mobile wallet built on Celo', 'A crypto exchange', 'A mining app', 'A blockchain game'], correctAnswer: 0 },
  { id: '27', question: 'MiniPay is integrated into which messaging app?', options: ['WhatsApp', 'Telegram', 'Opera Mini', 'Signal'], correctAnswer: 2 },
  { id: '28', question: 'What makes MiniPay unique?', options: ['It only supports Bitcoin', 'It requires KYC', 'It works on feature phones', 'It requires expensive smartphones'], correctAnswer: 2 },
  { id: '29', question: 'Which stablecoins can you use in MiniPay?', options: ['USDT only', 'Bitcoin', 'Ethereum', 'cUSD, cEUR, cREAL'], correctAnswer: 3 },
  { id: '30', question: 'MiniPay allows peer-to-peer payments without internet.', options: ['True', 'False'], correctAnswer: 1 },
  { id: '31', question: 'What is the purpose of Celo\'s stability mechanism?', options: ['To ban users', 'To increase gas fees', 'To mine CELO', 'To maintain stablecoin pegs'], correctAnswer: 3 },
  { id: '32', question: 'What is the Celo Reserve?', options: ['A mining pool', 'A basket of crypto assets backing stablecoins', 'A government fund', 'A bank account'], correctAnswer: 1 },
  { id: '33', question: 'How does Celo achieve ultra-light clients?', options: ['BLS signature aggregation', 'Proof of Work', 'Mining', 'Centralization'], correctAnswer: 0 },
  { id: '34', question: 'What is the role of validators on Celo?', options: ['Delete transactions', 'Create NFTs', 'Mine new blocks', 'Propose and validate blocks'], correctAnswer: 3 },
  { id: '35', question: 'What programming framework is popular for Celo dApps?', options: ['Unity', 'Django', 'React Native with Celo SDK', 'WordPress'], correctAnswer: 2 },
  { id: '36', question: 'What does cREAL represent?', options: ['Mining reward', 'Real estate token', 'NFT collection', 'Brazilian Real stablecoin on Celo'], correctAnswer: 3 },
  { id: '37', question: 'Which DeFi protocol is native to Celo?', options: ['Ubeswap', 'Uniswap', 'PancakeSwap', 'SushiSwap'], correctAnswer: 0 },
  { id: '38', question: 'What is the purpose of the Celo CLI?', options: ['To hack wallets', 'To interact with Celo blockchain from command line', 'To play games', 'To mine CELO'], correctAnswer: 1 },
  { id: '39', question: 'MiniPay users can send money using which identifier?', options: ['Email only', 'Social security numbers', 'Phone numbers or wallet addresses', 'Only wallet addresses'], correctAnswer: 2 },
  { id: '40', question: 'What is the gas token on Celo?', options: ['Fiat currency', 'Bitcoin', 'Only ETH', 'CELO or stable tokens like cUSD'], correctAnswer: 3 },
  { id: '41', question: 'What is Celo Composer?', options: ['A tool to quickly build Celo dApps', 'A wallet', 'A mining software', 'A music app'], correctAnswer: 0 },
  { id: '42', question: 'Which bridge connects Celo to other blockchains?', options: ['Brooklyn Bridge', 'Celo Bridge (Optics/Hyperlane)', 'Bitcoin Bridge', 'No bridge exists'], correctAnswer: 1 },
  { id: '43', question: 'What is SocialConnect on Celo?', options: ['A mining pool', 'A dating app', 'A protocol to map phone numbers to wallet addresses', 'A social media app'], correctAnswer: 2 },
  { id: '44', question: 'How many validators secure the Celo network?', options: ['1', '1 million', '10', 'Around 100-150'], correctAnswer: 3 },
  { id: '45', question: 'What is Plumo?', options: ['A ultra-light client protocol for Celo', 'A fruit', 'A token', 'A mining algorithm'], correctAnswer: 0 },
  { id: '46', question: 'MiniPay is available in which regions?', options: ['Only Europe', 'Africa and other emerging markets', 'Only USA', 'Only Asia'], correctAnswer: 1 },
  { id: '47', question: 'What is the transaction finality time on Celo?', options: ['1 day', '10 minutes', 'Around 5 seconds', '1 hour'], correctAnswer: 2 },
  { id: '48', question: 'Which library helps developers integrate Celo into React apps?', options: ['react-paypal', 'react-bank', 'react-bitcoin', 'react-celo'], correctAnswer: 3 },
  { id: '49', question: 'What is Kolektivo?', options: ['A community currency project on Celo', 'A government agency', 'A mining company', 'A music band'], correctAnswer: 0 },
  { id: '50', question: 'MiniPay requires users to download a separate wallet app.', options: ['False - it\'s built into Opera Mini', 'True'], correctAnswer: 0 },
  ];
