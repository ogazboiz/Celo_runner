// Celo-themed quiz questions for each stage
export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export const STAGE_QUIZZES: Record<number, QuizQuestion[]> = {
  1: [
    {
      question: "What is Celo's mission?",
      options: [
        "To create the fastest blockchain",
        "To build a financial system that creates conditions of prosperity for everyone",
        "To replace all traditional banks",
        "To mine Bitcoin faster"
      ],
      correctAnswer: 1,
      explanation: "Celo's mission is to build a financial system that creates the conditions of prosperity for everyone."
    },
    {
      question: "What makes Celo unique for mobile users?",
      options: [
        "It only works on iPhones",
        "Mobile-first design with phone number mapping to wallet addresses",
        "It's faster than other blockchains",
        "It has the best mobile games"
      ],
      correctAnswer: 1,
      explanation: "Celo is designed mobile-first and allows users to send crypto using phone numbers instead of complex addresses."
    },
    {
      question: "What is Celo's native token?",
      options: [
        "CUSD",
        "CEUR",
        "CELO",
        "GOLD"
      ],
      correctAnswer: 2,
      explanation: "CELO is the native asset of the Celo platform, used for transaction fees, governance, and staking."
    },
    {
      question: "What type of stablecoins does Celo support?",
      options: [
        "Only USD stablecoins",
        "Multiple fiat-pegged stablecoins like cUSD, cEUR, cREAL",
        "Only cryptocurrency-backed stablecoins",
        "No stablecoins"
      ],
      correctAnswer: 1,
      explanation: "Celo supports multiple fiat-pegged stablecoins including cUSD (US Dollar), cEUR (Euro), and cREAL (Brazilian Real)."
    },
    {
      question: "What consensus mechanism does Celo use?",
      options: [
        "Proof of Work",
        "Proof of Stake",
        "Delegated Proof of Stake",
        "Proof of Authority"
      ],
      correctAnswer: 1,
      explanation: "Celo uses a Proof of Stake (PoS) consensus mechanism, making it energy-efficient and environmentally friendly."
    }
  ],
  2: [
    {
      question: "What is Celo's approach to carbon neutrality?",
      options: [
        "It ignores environmental concerns",
        "Carbon-negative through offsetting and natural capital backing",
        "Only uses renewable energy for mining",
        "Plants one tree per transaction"
      ],
      correctAnswer: 1,
      explanation: "Celo is carbon-negative, offsetting more carbon than it produces and backing its reserve with natural capital assets."
    },
    {
      question: "What is the Celo Reserve?",
      options: [
        "A backup of all blockchain data",
        "A pool of assets backing Celo stablecoins",
        "A savings account for users",
        "A mining pool"
      ],
      correctAnswer: 1,
      explanation: "The Celo Reserve is a diversified portfolio of crypto assets that backs and stabilizes the value of Celo stablecoins."
    },
    {
      question: "What is Valora?",
      options: [
        "A Celo validator",
        "A mobile wallet for Celo",
        "A stablecoin",
        "A smart contract language"
      ],
      correctAnswer: 1,
      explanation: "Valora is a mobile-first wallet designed for the Celo ecosystem, making crypto accessible to everyone."
    },
    {
      question: "What programming language is used for Celo smart contracts?",
      options: [
        "Python",
        "JavaScript",
        "Solidity",
        "Rust"
      ],
      correctAnswer: 2,
      explanation: "Celo smart contracts are written in Solidity, the same language used for Ethereum, making it easy for developers to build on Celo."
    },
    {
      question: "What is Celo's block time?",
      options: [
        "10 minutes",
        "1 minute",
        "5 seconds",
        "15 seconds"
      ],
      correctAnswer: 2,
      explanation: "Celo has a fast block time of approximately 5 seconds, enabling quick transaction confirmations."
    }
  ],
  3: [
    {
      question: "What is the Celo Alliance for Prosperity?",
      options: [
        "A mining pool",
        "A coalition of organizations building financial inclusion",
        "A trading platform",
        "A validator group"
      ],
      correctAnswer: 1,
      explanation: "The Alliance for Prosperity is a coalition of over 150 organizations working to build financial inclusion using Celo."
    },
    {
      question: "What is unique about Celo's identity protocol?",
      options: [
        "It requires government ID",
        "It maps phone numbers to wallet addresses",
        "It uses facial recognition",
        "It doesn't have identity features"
      ],
      correctAnswer: 1,
      explanation: "Celo's identity protocol allows users to map their phone numbers to wallet addresses, making it easy to send money to contacts."
    },
    {
      question: "What is Celo's approach to governance?",
      options: [
        "Centralized control by founders",
        "On-chain governance where CELO holders can vote on proposals",
        "No governance system",
        "Governance by miners only"
      ],
      correctAnswer: 1,
      explanation: "Celo uses on-chain governance where CELO token holders can propose and vote on protocol changes."
    },
    {
      question: "What is the Celo Community Fund?",
      options: [
        "A charity organization",
        "On-chain fund for ecosystem development and public goods",
        "A venture capital fund",
        "A user rewards program"
      ],
      correctAnswer: 1,
      explanation: "The Community Fund is an on-chain fund that supports projects building on Celo and contributing to financial inclusion."
    },
    {
      question: "What makes Celo EVM-compatible?",
      options: [
        "It's a fork of Ethereum",
        "It can run Ethereum smart contracts and tools work seamlessly",
        "It uses the same consensus as Ethereum",
        "It's not EVM-compatible"
      ],
      correctAnswer: 1,
      explanation: "Celo is fully EVM-compatible, meaning Ethereum smart contracts and development tools work on Celo with minimal changes."
    }
  ]
};

// Helper function to get random questions for a stage
export function getStageQuestions(stage: number, count: number = 5): QuizQuestion[] {
  const questions = STAGE_QUIZZES[stage] || [];
  if (questions.length <= count) return questions;
  
  // Shuffle and return requested count
  const shuffled = [...questions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
