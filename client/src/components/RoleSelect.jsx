import React from 'react';

const ROLES = [
  { id: 'donor', emoji: '🍲', title: 'I Have Food (Family/Restaurant)', desc: 'Donate surplus food to those around you', gradient: 'from-orange-500/20 to-rose-500/10', border: 'border-orange-500/30', hover: 'hover:border-orange-500/60' },
  { id: 'needer', emoji: '🍽️', title: 'I Need Food (Receiver)', desc: 'Find free food available near you right now', gradient: 'from-blue-500/20 to-cyan-500/10', border: 'border-blue-500/30', hover: 'hover:border-blue-500/60' },
  { id: 'volunteer', emoji: '🚴', title: 'I Can Deliver', desc: 'Volunteer to pick up and deliver food', gradient: 'from-yellow-500/20 to-amber-500/10', border: 'border-yellow-500/30', hover: 'hover:border-yellow-500/60' },
  { id: 'ngo', emoji: '🏢', title: 'I Run an NGO', desc: 'Manage bulk distribution for your organisation', gradient: 'from-purple-500/20 to-violet-500/10', border: 'border-purple-500/30', hover: 'hover:border-purple-500/60' },
];

export default function RoleSelect({ onSelect }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl w-full">
      {ROLES.map(r => (
        <button key={r.id} onClick={() => onSelect(r.id)}
          className={`glass-card bg-gradient-to-br ${r.gradient} border ${r.border} ${r.hover} p-6 flex flex-col items-center text-center gap-3 transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl active:scale-95`}
        >
          <span className="text-4xl">{r.emoji}</span>
          <div>
            <p className="text-base font-extrabold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans' }}>{r.title}</p>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">{r.desc}</p>
          </div>
        </button>
      ))}
    </div>
  );
}
