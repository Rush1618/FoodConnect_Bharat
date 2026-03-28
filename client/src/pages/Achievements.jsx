import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Award, Medal, Trophy, Star, 
  TrendingUp, Users, Heart, Zap,
  Globe, Clock, Sparkles, ChevronRight,
  ShieldCheck, MapPin
} from 'lucide-react';
import clsx from 'clsx';

export default function Achievements() {
  const [activeTab, setActiveTab] = useState('leaderboard');

  const leaderData = [
    { rank: 1, name: 'Seva NGO', points: 12400, meals: 8200, level: 42, color: 'bg-yellow-400' },
    { rank: 2, name: 'Reliance CSR', points: 10850, meals: 7100, level: 38, color: 'bg-slate-300' },
    { rank: 3, name: 'Zomato Feeding', points: 9200, meals: 6400, level: 35, color: 'bg-orange-400' },
    { rank: 4, name: 'Robin Hood Army', points: 8100, meals: 5200, level: 31, color: 'bg-blue-100' },
    { rank: 5, name: 'Anikta Sharma', points: 7400, meals: 480, level: 28, color: 'bg-blue-100' },
  ];

  const badges = [
    { id: 1, name: 'Zero Waste Hero', desc: 'Saved 100kg+ of edible surplus.', icon: <Zap />, earned: true },
    { id: 2, name: 'Community Pillar', desc: 'Verified 50+ local hunger spots.', icon: <MapPin />, earned: true },
    { id: 3, name: 'Life Saver', desc: 'Responded to 5+ SOS emergencies.', icon: <Award />, earned: true },
    { id: 4, name: 'Top Recruiter', desc: 'Invited 10+ merchant donors.', icon: <Users />, earned: false },
    { id: 5, name: 'ESG Champion', desc: 'Achieved 95% sustainability score.', icon: <Globe />, earned: false },
    { id: 6, name: 'Bhandara Master', desc: 'Hosted 5+ community mega-meals.', icon: <Sparkles />, earned: true },
  ];

  return (
    <div className="min-h-screen bg-[#FDFCFB]">
      {/* Header */}
      <div className="relative h-96 bg-slate-900 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="h-full w-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500 via-transparent to-transparent"></div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 text-center px-6"
        >
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-yellow-500/20 border border-yellow-500/40 text-yellow-400 text-xs font-black uppercase tracking-widest mb-8">
            <Trophy size={14} /> Impact Leaderboard 2026
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter">
            Where Heroes <br />
            <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent italic">Define Tomorrow</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
            Every gram of food saved contributes to your standing. Rank up, earn badges, and leave your mark on the global hunger heatmap.
          </p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-16 relative z-20 pb-20">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main Content Area */}
          <div className="flex-grow space-y-8">
             <div className="bg-white rounded-[40px] p-2 shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                <div className="flex bg-slate-100 p-2 rounded-[32px] mb-2">
                   <button 
                     onClick={() => setActiveTab('leaderboard')}
                     className={clsx("flex-1 px-8 py-4 rounded-3xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2", activeTab === 'leaderboard' ? "bg-white text-orange-600 shadow-xl" : "text-slate-500")}
                   >
                     <Trophy size={18} /> Global Rankings
                   </button>
                   <button 
                     onClick={() => setActiveTab('badges')}
                     className={clsx("flex-1 px-8 py-4 rounded-3xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2", activeTab === 'badges' ? "bg-white text-orange-600 shadow-xl" : "text-slate-500")}
                   >
                     <Award size={18} /> Impact Badges
                   </button>
                </div>

                <div className="p-8">
                   <AnimatePresence mode="wait">
                      {activeTab === 'leaderboard' ? (
                        <motion.div 
                          key="leader" 
                          initial={{ opacity: 0, x: -20 }} 
                          animate={{ opacity: 1, x: 0 }} 
                          exit={{ opacity: 0, x: 20 }}
                          className="space-y-4"
                        >
                           <div className="grid grid-cols-12 px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                              <div className="col-span-1">Rank</div>
                              <div className="col-span-5">Champion</div>
                              <div className="col-span-2 text-center">Impact Score</div>
                              <div className="col-span-2 text-center">Meals Fed</div>
                              <div className="col-span-2 text-right">Progress</div>
                           </div>
                           {leaderData.map((item, i) => (
                             <motion.div 
                               initial={{ opacity: 0, y: 10 }}
                               animate={{ opacity: 1, y: 0 }}
                               transition={{ delay: i * 0.1 }}
                               key={item.name} 
                               className="grid grid-cols-12 items-center px-6 py-6 rounded-3xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 group"
                             >
                                <div className="col-span-1">
                                   <div className={clsx("w-8 h-8 rounded-full flex items-center justify-center font-black text-sm shadow-sm border border-black/5", item.color, item.rank <= 3 ? "text-slate-900" : "bg-white text-slate-400")}>
                                      {item.rank}
                                   </div>
                                </div>
                                <div className="col-span-5 flex items-center gap-4">
                                   <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                                      <Users size={20} />
                                   </div>
                                   <div>
                                      <h4 className="text-lg font-black text-slate-900 group-hover:text-orange-600 transition-colors">{item.name}</h4>
                                      <p className="text-xs font-bold text-slate-500 uppercase tracking-tighter flex items-center gap-1">
                                        <ShieldCheck size={12} className="text-emerald-500" /> Platinum Tier Hub
                                      </p>
                                   </div>
                                </div>
                                <div className="col-span-2 text-center text-xl font-black text-slate-900">{item.points.toLocaleString()}</div>
                                <div className="col-span-2 text-center text-xl font-black text-orange-600">{item.meals.toLocaleString()}</div>
                                <div className="col-span-2 text-right">
                                   <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-100 p-0.5">
                                      <div className="h-full bg-gradient-to-r from-orange-400 to-amber-500 rounded-full" style={{ width: `${(item.meals/10000)*100}%` }}></div>
                                   </div>
                                   <p className="text-[10px] font-black text-slate-400 mt-2 uppercase tracking-widest">Level {item.level}</p>
                                </div>
                             </motion.div>
                           ))}
                        </motion.div>
                      ) : (
                        <motion.div 
                          key="badges" 
                          initial={{ opacity: 0, x: -20 }} 
                          animate={{ opacity: 1, x: 0 }} 
                          exit={{ opacity: 0, x: 20 }}
                          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                           {badges.map((badge, i) => (
                             <motion.div 
                               initial={{ opacity: 0, scale: 0.9 }}
                               animate={{ opacity: 1, scale: 1 }}
                               transition={{ delay: i * 0.1 }}
                               key={badge.id} 
                               className={clsx("p-8 rounded-[32px] border transition-all text-center relative overflow-hidden group", badge.earned ? "bg-white border-slate-100 shadow-xl shadow-slate-200/50" : "bg-slate-50 border-slate-100 opacity-60 grayscale")}
                             >
                                <div className={clsx("w-20 h-20 rounded-[28px] mx-auto flex items-center justify-center text-white mb-6 shadow-2xl transition-transform group-hover:scale-110", badge.earned ? "bg-orange-500" : "bg-slate-300")}>
                                   {React.cloneElement(badge.icon, { size: 36 })}
                                </div>
                                <h4 className="text-xl font-black text-slate-900 mb-2">{badge.name}</h4>
                                <p className="text-sm font-medium text-slate-500 leading-relaxed mb-6">{badge.desc}</p>
                                
                                {badge.earned ? (
                                  <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-50 text-orange-600 font-black text-[10px] uppercase tracking-widest">
                                    <ShieldCheck size={14} /> Unlocked
                                  </div>
                                ) : (
                                  <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-200 text-slate-500 font-black text-[10px] uppercase tracking-widest">
                                    <Clock size={14} /> Locked
                                  </div>
                                )}
                             </motion.div>
                           ))}
                        </motion.div>
                      )}
                   </AnimatePresence>
                </div>
             </div>
          </div>

          {/* Sidebar Modules */}
          <div className="lg:w-96 space-y-8">
             <div className="bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden group shadow-2xl shadow-slate-900/40">
                <div className="relative z-10">
                   <div className="flex items-center gap-2 text-yellow-400 font-black text-xs uppercase tracking-widest mb-6">
                     <TrendingUp size={16} /> Global Momentum
                   </div>
                   <h3 className="text-3xl font-black mb-8 leading-tight">Total Carbon Footprint Saved</h3>
                   
                   <div className="space-y-8 mb-10">
                      <ImpactStat label="Waste Diverted" value="442,000 kg" color="text-emerald-400" />
                      <ImpactStat label="Families Fed" value="1.2 Million" color="text-blue-400" />
                      <ImpactStat label="Community Reach" value="24 Cities" color="text-purple-400" />
                   </div>

                   <button className="w-full py-5 rounded-3xl bg-blue-600 text-white font-black text-xs uppercase tracking-widest hover:bg-blue-500 transition-all flex items-center justify-center gap-2 group">
                      View Global Data <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                   </button>
                </div>
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] group-hover:bg-blue-500/20 transition-all duration-700"></div>
             </div>

             <div className="bg-orange-500 rounded-[40px] p-8 text-white shadow-xl shadow-orange-500/20">
                <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mb-6">
                   <Medal size={32} />
                </div>
                <h4 className="text-2xl font-black mb-4 leading-tight">Your Rank: #1,240</h4>
                <p className="text-orange-100 font-medium text-sm leading-relaxed mb-8">
                  You are in the top 15% of donors this month. Verified 4 more spots to reach **Gold Tier**.
                </p>
                <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden border border-white/20 p-0.5">
                   <div className="h-full bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.6)]" style={{ width: '72%' }}></div>
                </div>
                <div className="flex justify-between mt-3 text-[10px] font-black uppercase tracking-widest opacity-80">
                   <span>Silver II</span>
                   <span>Gold I</span>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function ImpactStat({ label, value, color }) {
  return (
    <div className="flex items-center justify-between border-b border-white/10 pb-4">
       <span className="text-white/60 text-sm font-bold">{label}</span>
       <span className={clsx("text-2xl font-black", color)}>{value}</span>
    </div>
  );
}
