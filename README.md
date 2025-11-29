# Farecho x Talent Protocol Integration Module

This repository serves as a modular, plug-and-play integration package for adding **Talent Protocol API v2** reputation features to the **Farecho** Farcaster mini-app.

It fetches on-chain user data, calculates a "Builder Score," and renders a "Gamer-Style" profile card with verified credentials (badges).

---

## 📂 Repository Structure

This module is designed to be dropped directly into a Next.js (App Router) project.

```text
/
├── types/
│   └── talent.ts           # Type definitions for API response & internal models
├── lib/
│   └── talent-service.ts   # Core logic: fetching, caching, tier calculation
├── components/
│   └── TalentCard.tsx      # UI Component (Server Side) with Tailwind CSS
├── .env.example            # Environment variables template
└── README.md               # Documentation
```

---

## ⚙️ Configuration

### 1. Environment Variables
Rename `.env.example` to `.env.local` in your main project and add your API credentials.

```bash
# Get your API Key from [https://passport.talentprotocol.com/](https://passport.talentprotocol.com/)
TALENT_API_KEY=your_actual_api_key_here
NEXT_PUBLIC_TALENT_API_URL=[https://api.talentprotocol.com/api/v2](https://api.talentprotocol.com/api/v2)
```

---

## 📜 Source Code Reference

For AI assistants (like Ohara) or manual integration, here are the core file contents:

### 1. Type Definitions (`types/talent.ts`)

```typescript
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
```

### 2. Logic Service (`lib/talent-service.ts`)

```typescript
import { FarechoUserReputation, TalentPassportResponse } from '../types/talent';

const API_KEY = process.env.TALENT_API_KEY;
const API_URL = process.env.NEXT_PUBLIC_TALENT_API_URL || '[https://api.talentprotocol.com/api/v2](https://api.talentprotocol.com/api/v2)';

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

    // Scoring Logic
    let tier: FarechoUserReputation['tier'] = 'Rookie';
    let theme: FarechoUserReputation['theme'] = 'bronze';

    if (passport.score >= 80) { tier = 'Elite'; theme = 'gold'; }
    else if (passport.score >= 50) { tier = 'Rising'; theme = 'silver'; }

    // Badge Logic
    const badges: string[] = [];
    if (credentials.some(c => c.source === 'github')) badges.push('Code Architect 🛠️');
    if (credentials.some(c => c.source === 'coinbase' || c.id.includes('base'))) badges.push('Based Native 🔵');
    if (passport.verified || passport.human_check) badges.push('Verified Human ✅');

    return { score: passport.score, tier, theme, isHuman: passport.verified || passport.human_check, badges };
  } catch (error) {
    console.error('Talent API Error:', error);
    return null;
  }
}
```

### 3. UI Component (`components/TalentCard.tsx`)

```tsx
import React from 'react';
import { getTalentReputation } from '../lib/talent-service';

interface TalentCardProps {
  walletAddress: string;
  username: string;
}

export default async function TalentCard({ walletAddress, username }: TalentCardProps) {
  const reputation = await getTalentReputation(walletAddress);

  if (!reputation) return <div className="text-xs text-gray-400">@{username} (No Data)</div>;

  const themeStyles = {
    gold: 'border-yellow-500 bg-yellow-900/10 text-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.2)]',
    silver: 'border-gray-400 bg-gray-800/50 text-gray-300 shadow-[0_0_10px_rgba(156,163,175,0.1)]',
    bronze: 'border-orange-800 bg-orange-900/10 text-orange-700',
  };

  return (
    <div className={`flex flex-col gap-2 p-4 rounded-xl border backdrop-blur-md ${themeStyles[reputation.theme]}`}>
      <div className="flex justify-between items-center">
        <span className="font-bold text-lg">@{username} {reputation.isHuman && '✅'}</span>
        <span className="text-2xl font-black">{reputation.score}</span>
      </div>
      <div className="text-xs font-bold uppercase">{reputation.tier} Builder</div>
      <div className="flex flex-wrap gap-1">
        {reputation.badges.map((b, i) => (
          <span key={i} className="px-2 py-0.5 text-[10px] bg-white/5 border border-white/10 rounded-full">{b}</span>
        ))}
      </div>
    </div>
  );
}
```

---

## 🚀 How to Use

Import the component into any **Server Component** (e.g., inside your Map Popup or User Profile page).

```tsx
import TalentCard from '@/components/TalentCard';

// Inside your JSX
<TalentCard 
  walletAddress="0x123...abc" 
  username="dwr.eth" 
/>
```

---

## 🧠 Logic & Scoring Tiers

The system automatically assigns tiers based on the `passport.score` returned by the API:

| Tier | Score Range | UI Theme | Description |
|:---|:---|:---|:---|
| **Elite** 🛡️ | 80 - 100 | Gold | Top-tier builders with high reputation. |
| **Rising** 🚀 | 50 - 79 | Silver | Active contributors growing their impact. |
| **Rookie** 🌱 | 0 - 49 | Bronze | Newcomers or low-activity wallets. |

### Badges Logic
* **Code Architect 🛠️:** Assigned if credentials contain `github`.
* **Based Native 🔵:** Assigned if credentials contain `base` or `coinbase`.
* **Verified Human ✅:** Assigned if `verified` or `human_check` is true.

---

### Tech Stack
* **Next.js** (App Router)
* **TypeScript**
* **Tailwind CSS**
