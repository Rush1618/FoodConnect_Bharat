import React from 'react';

const DUMMY_LEADERBOARD = [
  { rank: 1, name: "Suresh P.", meals: 450, badge: "🏆" },
  { rank: 2, name: "Khalsa NGO", meals: 320, badge: "⭐" },
  { rank: 3, name: "Anita D.", meals: 215, badge: "💎" },
];

export default function Leaderboard() {
  return (
    <div className="bg-white/95 p-4 flex flex-col h-full border">
      <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4 pb-2 border-b">Top Karma Heroes</h3>
      <div className="space-y-4">
        {DUMMY_LEADERBOARD.map((hero, i) => (
          <div key={i} className="flex items-center justify-between">
             <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${i === 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}>
                  #{hero.rank}
                </div>
                <div>
                  <p className="font-bold text-sm text-gray-800">{hero.name} {hero.badge}</p>
                </div>
             </div>
             <div className="text-right">
                <span className="block font-black text-blue-600">{hero.meals}</span>
                <span className="block text-[10px] text-gray-400 uppercase tracking-wide">Meals Saved</span>
             </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-3 border-t text-center">
         <span className="text-xs text-blue-500 font-semibold cursor-pointer hover:underline">View full ranking</span>
      </div>
    </div>
  );
}
