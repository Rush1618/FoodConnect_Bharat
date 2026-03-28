import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, Utensils, Heart, ShieldCheck, MapPin, 
  ChevronRight, BrainCircuit, Zap, Clock, TrendingUp 
} from 'lucide-react';

const STEPS = [
  {
    icon: <Plus className="text-orange-600" />,
    title: "1. List Surplus Food",
    desc: "Restaurants or households list fresh surplus food with AI-calculated urgency scores and transparent allergen profiles."
  },
  {
    icon: <BrainCircuit className="text-purple-600" />,
    title: "2. Intelligent Match",
    desc: "Our AI engine pairs food with nearby hunger requests based on dietary needs, proximity, and real-time community density."
  },
  {
    icon: <ShieldCheck className="text-emerald-600" />,
    title: "3. Volunteer Verify",
    desc: "Local volunteers verify the quality and safety of the food, ensuring only high-standard meals reach the beneficiaries."
  },
  {
    icon: <Bike className="text-blue-600" />,
    title: "4. Real-time Delivery",
    desc: "Track delivery partners live as they bridge the gap between waste and nutrition. Full visibility for all stakeholders."
  }
];

const ROLES = [
  { role: "Donor", desc: "Donate leftovers, surplus snacks, or banquet food from your home or restaurant.", color: "bg-orange-50 border-orange-100 text-orange-700" },
  { role: "Seeker", desc: "Request food for yourself or your community. Privacy and SOS features integrated.", color: "bg-blue-50 border-blue-100 text-blue-700" },
  { role: "Volunteer", desc: "The platform's heartbeat. Verify food quality and deliver meals to those in need.", color: "bg-emerald-50 border-emerald-100 text-emerald-700" },
  { role: "NGO", desc: "Manage bulk distributions, monitor local hunger heatmaps, and handle large-scale rescues.", color: "bg-purple-50 border-purple-100 text-purple-700" }
];

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-[10px] font-black uppercase tracking-widest mb-4"
          >
            The Ecosystem
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter mb-4">
            How FoodConnect <span className="text-orange-500">Bharat</span> Works
          </h1>
          <p className="text-slate-500 max-w-2xl mx-auto font-medium">
            We've built an intelligent, high-velocity logistics engine to ensure no food goes to waste and no belly goes empty.
          </p>
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-20">
          {ROLES.map((r, i) => (
            <motion.div 
              key={r.role}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`p-6 rounded-3xl border shadow-sm ${r.color}`}
            >
              <h3 className="text-lg font-black mb-2">{r.role}</h3>
              <p className="text-sm font-medium leading-relaxed opacity-80">{r.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Workflow Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          <div className="space-y-8">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">The Journey of a Meal</h2>
            <div className="space-y-4">
              {STEPS.map((s, i) => (
                <div key={i} className="flex gap-4 group">
                  <div className="shrink-0 w-10 min-h-full flex flex-col items-center">
                    <div className="w-10 h-10 rounded-2xl bg-white shadow-md flex items-center justify-center text-xl z-10 group-hover:scale-110 transition-transform">
                      {s.icon}
                    </div>
                    {i < STEPS.length - 1 && <div className="w-0.5 h-full bg-slate-200 mt-2" />}
                  </div>
                  <div className="pb-8">
                    <h4 className="text-lg font-black text-slate-800 mb-1">{s.title}</h4>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
             <div className="aspect-square rounded-3xl bg-gradient-to-br from-orange-400/20 to-purple-600/20 blur-3xl absolute inset-0 -z-10 animate-pulse" />
             <div className="bg-white p-4 rounded-[40px] shadow-2xl border border-white/50 relative overflow-hidden">
                <div className="aspect-video bg-slate-100 rounded-3xl flex items-center justify-center text-slate-400 font-bold italic text-sm border-2 border-dashed border-slate-200">
                  Interactive Logic Flow Visualization
                </div>
                <div className="mt-6 space-y-4 p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600">
                      <Zap size={24} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black">Urgency Score AI</h4>
                      <p className="text-[10px] font-bold text-slate-400">Dynamic prioritizing based on freshness & need.</p>
                    </div>
                  </div>
                </div>
             </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-slate-900 rounded-[40px] p-12 text-center text-white relative overflow-hidden shadow-2xl shadow-slate-900/40">
           <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
           <h2 className="text-3xl font-black mb-4 relative z-10 tracking-tight italic">Ready to make an impact?</h2>
           <p className="text-slate-400 mb-8 max-w-lg mx-auto font-medium">Join 340+ members in FoodConnect Bharat and start bridging the gap between surplus and survival.</p>
           <button className="px-10 py-4 rounded-2xl bg-orange-600 text-white font-black uppercase tracking-widest text-sm shadow-xl shadow-orange-600/20 hover:bg-orange-500 transition-all active:scale-95">
             Start Donating Now
           </button>
        </div>
      </div>
    </div>
  );
}

// Sub-components used in icon props
function Plus({ className, size=18 }) { return <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>; }
function Bike({ className, size=18 }) { return <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="18.5" cy="17.5" r="3.5"/><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="15" cy="5" r="1"/><path d="M12 17.5V14l-3-3 4-3 2 3h2"/></svg>; }
