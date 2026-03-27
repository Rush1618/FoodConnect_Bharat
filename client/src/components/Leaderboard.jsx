import React from 'react';
import { Trophy, Star, Gem } from 'lucide-react';

const HEROES = [
  { rank: 1, name: 'Suresh P.', meals: 450, icon: Trophy, color: 'text-yellow-600', bg: 'bg-yellow-50' },
  { rank: 2, name: 'Khalsa NGO', meals: 320, icon: Star, color: 'text-slate-500', bg: 'bg-slate-100' },
  { rank: 3, name: 'Anita D.', meals: 215, icon: Gem, color: 'text-cyan-600', bg: 'bg-cyan-50' },
];

export default function Leaderboard() {
  return (
    <div className="p-5">
      <div className="flex items-center gap-2 mb-4">
        <Trophy size={16} className="text-yellow-400" />
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Karma Heroes</h3>
      </div>
      <div className="space-y-3">
        {HEROES.map(({ rank, name, meals, icon: Icon, color, bg }) => (
          <div key={rank} className={`flex items-center gap-3 p-3 rounded-xl ${bg}`}>
            <div className={`w-8 h-8 rounded-xl ${bg} flex items-center justify-center`}>
              <Icon size={16} className={color} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-800 truncate">{name}</p>
              <p className="text-xs text-slate-500">{meals} meals saved</p>
            </div>
            <span className={`text-lg font-black ${color}`}>#{rank}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-3 border-t border-slate-200 text-center">
        <span className="text-xs text-orange-600 font-semibold cursor-pointer hover:text-orange-500 transition">
          See full ranking →
        </span>
      </div>
    </div>
  );
}
