import React from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, Zap, Globe, ShieldCheck, 
  MapPin, Utensils, HandHeart, Users,
  CheckCircle2, Flame, Brain, ArrowRight
} from 'lucide-react';

export default function WhyUs() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB]">
      {/* Hero Section */}
      <div className="relative h-screen flex flex-col items-center justify-center overflow-hidden bg-slate-900 px-6 text-center">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop" 
            alt="Community" 
            className="w-full h-full object-cover grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/80 to-[#FDFCFB]"></div>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="relative z-10 max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-orange-500/20 border border-orange-500/40 text-orange-400 text-xs font-black uppercase tracking-widest mb-10">
            <Heart size={14} className="animate-pulse" /> Our Mission
          </div>
          <h1 className="text-5xl md:text-[5.5rem] font-black text-white leading-[0.9] tracking-tighter mb-10">
            Because a <br />
            <span className="italic bg-gradient-to-r from-orange-400 to-rose-400 bg-clip-text text-transparent">Full Belly</span> <br />
            Changes Everything.
          </h1>
          <p className="text-slate-400 text-xl md:text-2xl font-medium mb-12 max-w-2xl mx-auto leading-relaxed">
            In a country that wastes ₹92,000 crores of food annually while 190 million sleep hungry, we decided to build a bridge.
          </p>
          <button className="px-10 py-5 rounded-3xl bg-orange-600 text-white font-black text-sm uppercase tracking-widest shadow-2xl shadow-orange-500/20 hover:bg-orange-500 transition-all flex items-center justify-center gap-3 mx-auto group">
            See the Platform in Action <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce opacity-40">
           <div className="w-1 h-12 bg-white rounded-full"></div>
        </div>
      </div>

      {/* Solving the Irony Header */}
      <div className="py-40 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-10 order-2 lg:order-1">
             <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
               Fixing the <br />
               <span className="text-orange-600 italic">Distribution Irony</span>
             </h2>
             <p className="text-slate-500 text-lg md:text-xl font-medium leading-relaxed">
               The world doesn't have a food production problem; it has a **distribution** and **time** problem. Surplus exists blocks away from hunger, but stays invisible until it's too late.
             </p>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <IconBullet 
                  icon={<Zap />} 
                  title="Real-time Synchronization" 
                  desc="Food hits the map within seconds of being reported."
                />
                <IconBullet 
                  icon={<ShieldCheck />} 
                  title="Verified Safety" 
                  desc="Multi-layer verification ensures quality and shelf-life."
                />
             </div>
          </div>
          
          <div className="relative order-1 lg:order-2">
             <div className="absolute inset-0 bg-orange-500/5 blur-[100px] rounded-full"></div>
             <div className="bg-white rounded-[50px] p-10 shadow-3xl border border-slate-100 relative z-10">
                <div className="flex items-center gap-4 mb-10">
                   <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600">
                      <Flame size={32} />
                   </div>
                   <h4 className="text-2xl font-black text-slate-900 tracking-tight">Rapid Redistribution</h4>
                </div>
                <div className="space-y-6">
                   <ProgressItem label="Identification" value="95%" />
                   <ProgressItem label="Verification" value="88%" />
                   <ProgressItem label="Logistics Sync" value="92%" />
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Intelligence Showcase */}
      <div className="bg-slate-900 py-40 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center">
           <motion.div 
             initial={{ opacity: 0, scale: 0.9 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-blue-500/20 border border-blue-500/40 text-blue-400 text-xs font-black uppercase tracking-widest mb-10"
           >
             <Brain size={16} /> Advanced Mapping
           </motion.div>
           <h2 className="text-4xl md:text-6xl font-black text-white mb-20 leading-tight tracking-tighter">
             Intelligence Driven by <br />
             <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent italic">Community Heart</span>
           </h2>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
              <WhyCard 
                num="01"
                title="Role-Based Intelligence"
                desc="Specialized maps for Donors, NGOs, and Volunteers ensure the right data reaches the right hands."
              />
              <WhyCard 
                num="02"
                title="Hunger Heatmaps"
                desc="Crowdsourced reports highlight high-density hunger zones for targeted corporate interventions."
              />
              <WhyCard 
                num="03"
                title="Blockchain Audit"
                desc="Every meal is tracked from the restaurant ledger to the final verified delivery point."
              />
           </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="bg-white py-40 text-center">
        <div className="max-w-4xl mx-auto px-6">
           <div className="w-24 h-24 rounded-[32px] bg-orange-500 mx-auto flex items-center justify-center text-white mb-10 shadow-2xl">
              <HandHeart size={48} />
           </div>
           <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-8 tracking-tighter">Join the Movement.</h2>
           <p className="text-slate-500 text-lg font-medium leading-relaxed mb-12">
             Whether you're a restaurant with leftover meal packages or a citizen who wants to mark a hungry cluster, you belong here.
           </p>
           <div className="flex flex-wrap justify-center gap-6">
              <button className="px-10 py-5 rounded-3xl bg-slate-900 text-white font-black text-sm uppercase tracking-widest shadow-2xl hover:bg-slate-800 transition-all">
                 Join as Partner
              </button>
              <button className="px-10 py-5 rounded-3xl bg-orange-600 text-white font-black text-sm uppercase tracking-widest shadow-2xl hover:bg-orange-500 transition-all">
                 Join as Volunteer
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}

function IconBullet({ icon, title, desc }) {
  return (
    <div className="space-y-3">
       <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600">
         {React.cloneElement(icon, { size: 20 })}
       </div>
       <h4 className="font-black text-slate-900 uppercase tracking-wide text-sm">{title}</h4>
       <p className="text-slate-500 text-xs font-medium leading-relaxed">{desc}</p>
    </div>
  );
}

function ProgressItem({ label, value }) {
  return (
    <div className="space-y-2">
       <div className="flex justify-between text-xs font-black uppercase text-slate-400 tracking-widest">
          <span>{label}</span>
          <span>{value}</span>
       </div>
       <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-50">
          <div className="h-full bg-orange-500 rounded-full" style={{ width: value }}></div>
       </div>
    </div>
  );
}

function WhyCard({ num, title, desc }) {
  return (
    <div className="p-10 rounded-[40px] bg-white/5 border border-white/10 text-left hover:bg-white/10 transition-all group">
       <div className="text-5xl font-black text-white/10 mb-8 group-hover:text-blue-500/20 transition-colors">{num}</div>
       <h4 className="text-2xl font-black text-white mb-4 leading-tight">{title}</h4>
       <p className="text-slate-400 font-medium leading-relaxed">{desc}</p>
    </div>
  );
}
