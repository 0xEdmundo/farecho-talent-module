export interface TalentPassportResponse {
  passport: {
    id: number;
    score: number;
    verified: boolean;
    human_check: boolean;
  };
  credentials: Array<{
    id: string;
    source: string;
    type: string;
    name: string;
  }>;
}

export interface FarechoUserReputation {
  score: number;
  tier: 'Elite' | 'Rising' | 'Rookie';
  theme: 'gold' | 'silver' | 'bronze';
  isHuman: boolean;
  badges: string[];
}
