import React, { useEffect, useState } from 'react';
import { Trophy, Star, Gem, Leaf, Award, Medal } from 'lucide-react';

const BADGE_CONFIGS = {
  starter: { icon: Star, color: 'text-slate-400', bg: 'bg-slate-50', label: 'Impact Starter' },
  hero: { icon: Trophy, color: 'text-orange-600', bg: 'bg-orange-50', label: 'Karma Hero' },
  champion: { icon: Gem, color: 'text-purple-600', bg: 'bg-purple-50', label: 'Community Champion' },
  ratna: { icon: Award, color: 'text-emerald-700', bg: 'bg-emerald-100', label: 'Bharat Ratna Hero' },
};

function getBadge(score) {
  if (score >= 1000) return BADGE_CONFIGS.ratna;
  if (score >= 500) return BADGE_CONFIGS.champion;
  if (score >= 100) return BADGE_CONFIGS.hero;
  return BADGE_CONFIGS.starter;
}

export default function Leaderboard() {
  const [heroes, setHeroes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/users/leaderboard')
      .then(res => res.json())
      .then(data => {
        setHeroes(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="p-8 text-center animate-pulse">
      <div className="w-10 h-10 bg-slate-100 rounded-full mx-auto mb-3" />
      <div className="h-3 w-24 bg-slate-100 rounded mx-auto" />
    </div>
  );

  return (
    <div className="p-2 space-y-4">
      <div className="flex items-center justify-between px-3">
        <div className="flex items-center gap-2">
          <Trophy size={16} className="text-yellow-500" />
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">Karma Heroes</h3>
        </div>
        <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full">
          <Leaf size={10} /> Live Impact
        </span>
      </div>

      <div className="space-y-2.5">
        {heroes.map((h, idx) => {
          const badge = getBadge(h.karmaScore);
          const Icon = badge.icon;
          
          return (
            <div key={h._id} 
              className="group relative flex items-center gap-4 p-4 rounded-3xl bg-white border border-slate-100 hover:border-orange-200 hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300">
              {/* Rank Badge */}
              <div className="flex flex-col items-center">
                <span className={`text-lg font-black ${idx === 0 ? 'text-yellow-500' : idx === 1 ? 'text-slate-400' : 'text-slate-300'}`}>
                  #{idx + 1}
                </span>
              </div>

              {/* Avatar/Badge Icon */}
              <div className={`w-12 h-12 rounded-2xl ${badge.bg} flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform relative`}>
                <Icon size={20} className={badge.color} />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-white flex items-center justify-center text-[8px] font-black border border-slate-100 shadow-sm">
                  {h.streakDays || 1}
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-black text-slate-900 truncate tracking-tight flex items-center gap-1.5">
                  {h.name}
                  <span className={`text-[8px] px-1.5 py-0.5 rounded-full ${badge.bg} ${badge.color} border border-current opacity-70`}>{badge.label}</span>
                </p>
                <div className="flex items-center gap-3 mt-0.5">
                  <p className="text-[10px] font-bold text-orange-600 uppercase tracking-tighter flex items-center gap-1">
                    ✨ {h.karmaScore} Karma
                  </p>
                  <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-tighter flex items-center gap-1">
                    🌱 {h.carbonSaved}kg CO₂
                  </p>
                </div>
              </div>

              {/* Status Indicator */}
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
          );
        })}

        {heroes.length === 0 && (
          <div className="py-10 text-center">
            <p className="text-xs text-slate-400 font-bold italic">No heroes on the map yet...</p>
          </div>
        )}
      </div>

      <button className="w-full mt-2 py-3 rounded-2xl bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest hover:bg-orange-50 hover:text-orange-600 transition-colors border border-dashed border-slate-200">
        View Impact Universe →
      </button>
    </div>
  );
}
