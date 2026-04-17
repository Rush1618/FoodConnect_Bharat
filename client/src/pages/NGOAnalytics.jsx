import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, Users, Utensils, Zap, 
  BarChart3, PieChart, Map as MapIcon, 
  ArrowUpRight, ArrowDownRight, Activity
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function NGOAnalytics() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    activeDonations: 42,
    totalRequests: 156,
    volunteersOnline: 18,
    mealsSaved: 2840,
    hungerSpikes: [
      { area: 'Borivali East', score: 85 },
      { area: 'Kandivali West', score: 62 },
      { area: 'Malad North', score: 45 }
    ]
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-8 bg-slate-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight" style={{ fontFamily: 'Plus Jakarta Sans' }}>
            NGO situational Awareness
          </h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-1 italic flex items-center gap-2">
            <Activity size={14} className="text-emerald-500 animate-pulse" /> Live Regional Intelligence Dashboard
          </p>
        </div>
        <div className="flex items-center gap-3">
           <button className="px-5 py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-600 font-bold text-sm shadow-sm hover:bg-slate-50 transition-all">
             Export ESG Report
           </button>
           <button className="px-5 py-2.5 rounded-2xl bg-orange-600 text-white font-bold text-sm shadow-lg shadow-orange-500/20 hover:bg-orange-500 transition-all flex items-center gap-2">
             <Zap size={16} /> Broadcast SOS
           </button>
        </div>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <StatsCard 
           title="Active Donations" 
           value={stats.activeDonations} 
           trend="+12%" 
           up={true} 
           icon={<Utensils className="text-orange-500" />} 
           color="bg-orange-50"
         />
         <StatsCard 
           title="Pending Requests" 
           value={stats.totalRequests} 
           trend="+8%" 
           up={true} 
           icon={<Users className="text-blue-500" />} 
           color="bg-blue-50"
         />
         <StatsCard 
           title="On-Ground Volts" 
           value={stats.volunteersOnline} 
           trend="Live" 
           up={true} 
           icon={<Zap className="text-emerald-500" />} 
           color="bg-emerald-50"
         />
         <StatsCard 
           title="Meals Diversion" 
           value={stats.mealsSaved} 
           trend="+2.1k" 
           up={true} 
           icon={<TrendingUp className="text-purple-500" />} 
           color="bg-purple-50"
         />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Hunger Heatmap Intensity */}
        <div className="lg:col-span-2 glass-card p-8 border border-white/40 shadow-xl rounded-[32px] bg-white">
           <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                  <PieChart size={20} className="text-orange-500" /> Donation Velocity vs Hunger Spikes
                </h3>
                <p className="text-sm font-medium text-slate-500">Regional supply gap analysis (Last 24h)</p>
              </div>
              <BarChart3 size={24} className="text-slate-300" />
           </div>
           
           <div className="space-y-6">
              {stats.hungerSpikes.map(spike => (
                <div key={spike.area} className="space-y-2">
                   <div className="flex justify-between items-end">
                      <span className="text-sm font-bold text-slate-700">{spike.area}</span>
                      <span className="text-xs font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-100">{spike.score}% Intensity</span>
                   </div>
                   <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${spike.score}%` }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className={`h-full rounded-full bg-gradient-to-r ${spike.score > 70 ? 'from-orange-500 to-rose-600' : 'from-blue-500 to-indigo-600'}`} 
                      />
                   </div>
                </div>
              ))}
           </div>

           <div className="mt-10 p-5 rounded-3xl bg-slate-900 text-white flex items-center justify-between group cursor-pointer overflow-hidden relative">
              <div className="relative z-10">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Strategic Move</p>
                <h4 className="text-lg font-black mt-1">Deploy Mobile Kitchen to Borivali?</h4>
                <p className="text-xs text-slate-300 mt-0.5 opacity-80 font-medium">Predicted meal gap of 450+ servings by 8:00 PM</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform relative z-10">
                 <ArrowUpRight size={20} />
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 blur-3xl -mr-10 -mt-10" />
           </div>
        </div>

        {/* Live Logs / Recent Verifications */}
        <div className="glass-card p-8 border border-white/40 shadow-xl rounded-[32px] bg-white">
           <h3 className="text-xl font-extrabold text-slate-900 mb-6 flex items-center gap-2">
             <Activity size={20} className="text-emerald-500" /> Ground Feeds
           </h3>
           <div className="space-y-5">
              {[
                { time: '2m ago', user: 'Volunteer Amit', action: 'Verified 40kg Rice', loc: 'Dharavi' },
                { time: '12m ago', user: 'Donor Taj Hotel', action: 'Listed 200 Meals', loc: 'Colaba' },
                { time: '45m ago', user: 'NGO Pratham', action: 'Picked up SOS #452', loc: 'Sion' },
                { time: '1h ago', user: 'Volunteer Sneha', action: 'Marked Hunger Spot', loc: 'Malad' },
              ].map((log, i) => (
                <div key={i} className="flex gap-4 group">
                   <div className="flex flex-col items-center gap-1">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                      {i !== 3 && <div className="w-0.5 h-10 bg-slate-100" />}
                   </div>
                   <div className="flex-1">
                      <div className="flex justify-between items-start mb-0.5">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{log.time}</p>
                        <p className="text-[9px] font-bold text-slate-300 italic">{log.loc}</p>
                      </div>
                      <p className="text-xs font-black text-slate-800">{log.user}</p>
                      <p className="text-[11px] font-medium text-slate-500 mt-0.5">{log.action}</p>
                   </div>
                </div>
              ))}
           </div>
           
           <button className="w-full mt-8 py-3.5 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-slate-400 text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 hover:text-slate-600 transition-all">
             View Full Audit Logs →
           </button>
        </div>
      </div>
    </div>
  );
}

function StatsCard({ title, value, trend, up, icon, color }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className={`p-6 rounded-[28px] border border-white/60 shadow-lg bg-white relative overflow-hidden group`}
    >
      <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform`}>
         {icon}
      </div>
      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{title}</p>
      <div className="flex items-end justify-between mt-1">
         <h4 className="text-3xl font-black text-slate-900 tracking-tight">{value}</h4>
         <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg flex items-center gap-0.5 ${up ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
           {up ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />} {trend}
         </span>
      </div>
      <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-full -mr-8 -mt-8 opacity-40" />
    </motion.div>
  );
}
