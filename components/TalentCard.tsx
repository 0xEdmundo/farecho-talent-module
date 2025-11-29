import React from 'react';
import { getTalentReputation } from '../lib/talent-service';

interface TalentCardProps {
  walletAddress: string;
  username: string;
}

export default async function TalentCard({ walletAddress, username }: TalentCardProps) {
  const reputation = await getTalentReputation(walletAddress);

  if (!reputation) {
    return <div className="p-2 text-xs text-gray-400">@{username} (No Score)</div>;
  }

  const themeStyles = {
    gold: 'border-yellow-500 bg-yellow-900/20 text-yellow-500',
    silver: 'border-gray-400 bg-gray-800/50 text-gray-300',
    bronze: 'border-orange-700 bg-orange-900/20 text-orange-700',
  };

  return (
    <div className={`border p-3 rounded-lg ${themeStyles[reputation.theme]} min-w-[200px]`}>
      <div className="flex justify-between items-center mb-1">
        <span className="font-bold text-sm">@{username}</span>
        <span className="font-black text-lg">{reputation.score}</span>
      </div>
      <div className="text-[10px] uppercase tracking-wider mb-2">{reputation.tier} Builder</div>
      <div className="flex flex-wrap gap-1">
        {reputation.badges.map((b, i) => (
          <span key={i} className="px-1.5 py-0.5 bg-white/10 rounded text-[10px] border border-white/5">{b}</span>
        ))}
      </div>
    </div>
  );
}
