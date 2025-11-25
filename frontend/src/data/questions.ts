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
  
    // Africa: History, Innovation & Culture (26–50)
    { id: '26', question: 'What is the largest country in Africa by land area?', options: ['Sudan', 'Egypt', 'Algeria', 'Nigeria'], correctAnswer: 2 },
    { id: '27', question: 'Which African country was never colonized?', options: ['Ghana', 'Ethiopia', 'Uganda', 'Kenya'], correctAnswer: 1 },
    { id: '28', question: 'Who was the first President of Ghana?', options: ['Kwame Nkrumah', 'Jomo Kenyatta', 'Jerry Rawlings', 'Nelson Mandela'], correctAnswer: 0 },
    { id: '29', question: 'What is the most populous country in Africa?', options: ['South Africa', 'Egypt', 'Ethiopia', 'Nigeria'], correctAnswer: 3 },
    { id: '30', question: 'What is Africa’s largest economy by GDP?', options: ['Nigeria', 'Egypt', 'South Africa', 'Kenya'], correctAnswer: 0 },
    { id: '31', question: 'What African leader was known as the “Lion of Judah”?', options: ['Haile Selassie', 'Julius Nyerere', 'Patrice Lumumba', 'Sam Nujoma'], correctAnswer: 0 },
    { id: '32', question: 'What is the traditional cloth from Ghana called?', options: ['Kente', 'Ankara', 'Shweshwe', 'Dashiki'], correctAnswer: 0 },
    { id: '33', question: 'What is the main staple food in East Africa?', options: ['Jollof Rice', 'Fufu', 'Couscous', 'Ugali'], correctAnswer: 3 },
    { id: '34', question: 'What is the official currency of South Africa?', options: ['Cedi', 'Shilling', 'Naira', 'Rand'], correctAnswer: 3 },
    { id: '35', question: 'What African nation is famous for M-Pesa mobile money?', options: ['Ghana', 'Kenya', 'Nigeria', 'Rwanda'], correctAnswer: 1 },
    { id: '36', question: 'Who was the first female president in Africa?', options: ['Joyce Banda', 'Ellen Johnson Sirleaf', 'Amina Mohammed', 'Ngozi Okonjo-Iweala'], correctAnswer: 1 },
    { id: '37', question: 'Which African country produces the most cocoa?', options: ['Ghana', 'Côte d’Ivoire', 'Cameroon', 'Nigeria'], correctAnswer: 1 },
    { id: '38', question: 'What desert is the largest in Africa?', options: ['Sahara', 'Kalahari', 'Namib', 'Danakil'], correctAnswer: 0 },
    { id: '39', question: 'Which African musician is known as the “King of Afrobeat”?', options: ['Youssou N\'Dour', 'Fela Kuti', 'Burna Boy', 'Angelique Kidjo'], correctAnswer: 1 },
    { id: '40', question: 'What is the name of the world’s second-longest river, located in Africa?', options: ['Nile', 'Niger River', 'Zambezi', 'Congo River'], correctAnswer: 3 },
    { id: '41', question: 'What country is home to Table Mountain?', options: ['South Africa', 'Namibia', 'Zimbabwe', 'Botswana'], correctAnswer: 0 },
    { id: '42', question: 'What African tech hub is nicknamed the “Silicon Savannah”?', options: ['Accra, Ghana', 'Nairobi, Kenya', 'Kigali, Rwanda', 'Lagos, Nigeria'], correctAnswer: 1 },
    { id: '43', question: 'Who was Nelson Mandela?', options: ['Ethiopian emperor', 'Anti-apartheid leader and South Africa’s first black president', 'Ghanaian musician', 'Kenyan activist'], correctAnswer: 1 },
    { id: '44', question: 'What is the main export product of Nigeria?', options: ['Cocoa', 'Crude oil', 'Gold', 'Cotton'], correctAnswer: 1 },
    { id: '45', question: 'What is Africa’s largest lake?', options: ['Lake Malawi', 'Lake Victoria', 'Lake Tanganyika', 'Lake Chad'], correctAnswer: 1 },
    { id: '46', question: 'Which African woman became WTO Director-General?', options: ['Ellen Sirleaf', 'Joyce Banda', 'Amina Mohammed', 'Ngozi Okonjo-Iweala'], correctAnswer: 3 },
    { id: '47', question: 'What country is home to the pyramids of Giza?', options: ['Sudan', 'Egypt', 'Ethiopia', 'Morocco'], correctAnswer: 1 },
    { id: '48', question: 'What African city hosted the 2010 FIFA World Cup?', options: ['Lagos', 'Johannesburg', 'Nairobi', 'Cairo'], correctAnswer: 1 },
    { id: '49', question: 'What African scientist is known as the father of modern Internet technology?', options: ['Salif Keita', 'Philip Emeagwali', 'John Magufuli', 'Wole Soyinka'], correctAnswer: 1 },
    { id: '50', question: 'What African innovation allows people to send money via phone without internet?', options: ['Paystack', 'Paga', 'Flutterwave', 'M-Pesa'], correctAnswer: 3 },
  ];
