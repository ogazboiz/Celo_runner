/**
 * Badge NFT Metadata for Celo Runner
 * 
 * This metadata matches GameD's badge structure and uses the same IPFS images
 */

export interface BadgeMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string;
  }>;
}

export const BADGE_METADATA: Record<string, BadgeMetadata> = {
  "Explorer Badge": {
    name: "Explorer Badge",
    description: "Awarded to brave explorers who completed Stage 1 of Celo Runner",
    image: "https://orange-geographical-marsupial-110.mypinata.cloud/ipfs/bafkreia7hw6k7blhn7stmrm46arjyxktcqwkoexyaydzdib3dghy6zqyu4",
    attributes: [
      {
        trait_type: "Stage",
        value: "1"
      },
      {
        trait_type: "Difficulty",
        value: "Beginner"
      },
      {
        trait_type: "Reward",
        value: "20 QuestCoins"
      }
    ]
  },
  "Adventurer Badge": {
    name: "Adventurer Badge",
    description: "Awarded to skilled adventurers who conquered Stage 2 of Celo Runner",
    image: "https://orange-geographical-marsupial-110.mypinata.cloud/ipfs/bafkreihqx2cuolkk6wkzjsn632734ajlqt7vgsiy2nxzb2ugq76f3bwrh4",
    attributes: [
      {
        trait_type: "Stage",
        value: "2"
      },
      {
        trait_type: "Difficulty",
        value: "Intermediate"
      },
      {
        trait_type: "Reward",
        value: "50 QuestCoins"
      }
    ]
  },
  "Master Badge": {
    name: "Master Badge",
    description: "Awarded to elite masters who triumphed over Stage 3 of Celo Runner",
    image: "https://orange-geographical-marsupial-110.mypinata.cloud/ipfs/bafybeibntv4534v2mis4cyyj6owmcnjzjpfswohvtlmta6rzzfjvprekja",
    attributes: [
      {
        trait_type: "Stage",
        value: "3"
      },
      {
        trait_type: "Difficulty",
        value: "Expert"
      },
      {
        trait_type: "Reward",
        value: "100 QuestCoins"
      }
    ]
  }
};

/**
 * Get badge metadata by stage number
 */
export const getBadgeMetadataByStage = (stage: number): BadgeMetadata | null => {
  if (stage === 1) return BADGE_METADATA["Explorer Badge"];
  if (stage === 2) return BADGE_METADATA["Adventurer Badge"];
  if (stage === 3) return BADGE_METADATA["Master Badge"];
  return null;
};

/**
 * Get badge image URL by badge name
 */
export const getBadgeImage = (badgeName: string): string => {
  return BADGE_METADATA[badgeName]?.image || '';
};

/**
 * Get badge name by stage number
 */
export const getBadgeNameByStage = (stage: number): string => {
  if (stage === 1) return "Explorer Badge";
  if (stage === 2) return "Adventurer Badge";
  if (stage === 3) return "Master Badge";
  return "Unknown Badge";
};

