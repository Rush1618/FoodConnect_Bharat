import React from 'react';
import { motion } from 'framer-motion';
import { 
  Leaf, Globe, Heart, Shield, 
  BarChart3, Zap, Recycle, Droplets 
} from 'lucide-react';

const METRICS = [
  { icon: <Leaf className="text-emerald-600" />, label: "Carbon Avoided", value: "6.2 Tons", desc: "Every meal saved prevents 0.5kg of methane-equivalent CO2 emissions from landfills." },
  { icon: <Droplets className="text-blue-600" />, label: "Water Preserved", value: "1.2M Liters", desc: "Conserving the virtual water used in food production by ensuring consumption." },
  { icon: <Globe className="text-purple-600" />, label: "Communities", value: "112 Cities", desc: "A growing network of cities committed to zero-hunger and zero-waste goals." },
  { icon: <BarChart3 className="text-orange-600" />, label: "Efficiency", value: "94%", desc: "Match success rate driven by our real-time AI logistics and proximity engine." }
];

export default function Sustainability() {
  return (
    <div className="min-h-screen bg-white pt-24 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-12 items-center mb-24">
          <div className="flex-1 text-left">
            <motion.div 
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest mb-6 border border-emerald-100"
            >
              Our Impact Vision
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter mb-6 leading-none">
              Feeding People, <br/>
              <span className="text-emerald-500 italic">Healing Earth.</span>
            </h1>
            <p className="text-slate-500 font-medium text-lg max-w-xl leading-relaxed">
              Food waste is one of the leading contributors to climate change. FoodConnect Bharat turns a logistics problem into a community solution.
            </p>
          </div>
          <div className="flex-1 w-full max-w-md">
             <div className="aspect-square rounded-[60px] bg-emerald-50 relative flex items-center justify-center p-8 overflow-hidden shadow-inner">
               <motion.div 
                 animate={{ rotate: 360 }}
                 transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
                 className="absolute inset-0 opacity-10"
               >
                 <Recycle size={400} />
               </motion.div>
               <Leaf size={120} className="text-emerald-500 drop-shadow-2xl animate-bounce" />
             </div>
          </div>
        </div>

        {/* Impact Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {METRICS.map((m, i) => (
            <motion.div 
              key={m.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-[40px] bg-slate-50 hover:bg-white border border-transparent hover:border-slate-100 hover:shadow-xl transition-all group"
            >
              <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 text-2xl group-hover:scale-110 transition-transform">
                {m.icon}
              </div>
              <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">{m.label}</h4>
              <div className="text-3xl font-black text-slate-900 mb-3">{m.value}</div>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">{m.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Detailed Explanation */}
        <div className="bg-emerald-900 rounded-[60px] p-12 md:p-20 text-white relative overflow-hidden shadow-3xl shadow-emerald-900/40">
           <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-emerald-400 opacity-20 blur-[120px] rounded-full pointer-events-none" />
           <div className="max-w-3xl">
              <h2 className="text-4xl font-black mb-8 italic tracking-tight">The Karma Score System</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                 <div>
                    <h4 className="text-xl font-black mb-3 flex items-center gap-2 text-emerald-300">
                      <Zap size={20} /> Proof of Impact
                    </h4>
                    <p className="text-emerald-100/70 text-sm font-medium leading-relaxed">
                      Every verified donation and successful delivery earns you <strong>Karma points</strong>. These aren't just badges—they represent real-world CO2 reduction and lives nourished. 
                    </p>
                 </div>
                 <div>
                    <h4 className="text-xl font-black mb-3 flex items-center gap-2 text-emerald-300">
                      <Shield size={20} /> Verified Trust
                    </h4>
                    <p className="text-emerald-100/70 text-sm font-medium leading-relaxed">
                      Our platform ensures transparency by letting NGOs and donors track exactly where their contributions went, fostering a circular economy of kindness.
                    </p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
