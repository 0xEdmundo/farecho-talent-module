import { FarechoUserReputation, TalentPassportResponse } from '../types/talent';

// NOT: Ohara, API Key'i .env dosyasından alacak
const API_URL = process.env.NEXT_PUBLIC_TALENT_API_URL || 'https://api.talentprotocol.com/api/v2';
const API_KEY = process.env.TALENT_API_KEY;

export async function getTalentReputation(walletAddress: string): Promise<FarechoUserReputation | null> {
  if (!walletAddress) return null;

  try {
    const response = await fetch(`${API_URL}/passports/${walletAddress}`, {
      headers: {
        'X-API-KEY': API_KEY || '',
        'Content-Type': 'application/json',
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) return null;

    const data: TalentPassportResponse = await response.json();
    const { passport, credentials } = data;

    let tier: FarechoUserReputation['tier'] = 'Rookie';
    let theme: FarechoUserReputation['theme'] = 'bronze';

    if (passport.score >= 80) {
      tier = 'Elite';
      theme = 'gold';
    } else if (passport.score >= 50) {
      tier = 'Rising';
      theme = 'silver';
    }

    const badges: string[] = [];
    if (credentials.some((c) => c.source === 'github')) badges.push('Code Architect 🛠️');
    if (credentials.some((c) => c.source === 'coinbase' || c.id.includes('base'))) badges.push('Based Native 🔵');
    if (passport.verified || passport.human_check) badges.push('Verified Human ✅');

    return {
      score: passport.score,
      tier,
      theme,
      isHuman: passport.verified || passport.human_check,
      badges,
    };
  } catch (error) {
    console.error('Talent API Error:', error);
    return null;
  }
}
