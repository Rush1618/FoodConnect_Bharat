import React from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, Globe, TrendingUp, Heart, 
  ShieldCheck, Zap, Handshake, Leaf,
  Users, Award, BarChart3, ArrowRight
} from 'lucide-react';

export default function CSR() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB]">
      {/* Hero Section */}
      <div className="relative h-[600px] flex items-center justify-center overflow-hidden bg-slate-900">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop" 
            alt="Business Center" 
            className="w-full h-full object-cover opacity-40 grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-slate-900/80 to-[#FDFCFB]"></div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-6 max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 border border-blue-500/40 text-blue-400 text-xs font-black uppercase tracking-widest mb-8">
            <Building2 size={14} /> Corporate Social Responsibility
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight tracking-tighter">
            Transforming Waste into <br />
            <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent italic">Societal Wealth</span>
          </h1>
          <p className="text-slate-300 text-lg md:text-xl font-medium mb-10 max-w-2xl mx-auto leading-relaxed">
            Empowering organizations to fulfill their ESG mandates through real-time, transparent food redistribution and waste reduction.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-8 py-4 rounded-2xl bg-blue-600 text-white font-black text-sm uppercase tracking-widest shadow-2xl shadow-blue-500/20 hover:bg-blue-500 transition-all flex items-center gap-2 group">
              Partner with Us <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 rounded-2xl bg-white/10 text-white border border-white/20 font-black text-sm uppercase tracking-widest backdrop-blur-md hover:bg-white/20 transition-all">
              Download ESG Whitepaper
            </button>
          </div>
        </motion.div>
      </div>

      {/* Core ESG Pillars */}
      <div className="max-w-7xl mx-auto px-6 -mt-24 relative z-20 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <PillarCard 
            icon={<Leaf />} 
            title="Environmental" 
            desc="Reduce methane emissions by diverting organic waste from landfills to redistribution hubs."
            score="42% Less CO2"
            color="bg-emerald-500"
          />
          <PillarCard 
            icon={<Users />} 
            title="Social" 
            desc="Bridge the nutrition gap in urban slum clusters with high-quality surplus from corporate kitchens."
            score="12k+ Meals Daily"
            color="bg-blue-500"
          />
          <PillarCard 
            icon={<ShieldCheck />} 
            title="Governance" 
            desc="Blockchain-backed tracking ensures 100% auditability for every kilogram of food donated."
            score="ISO Certified"
            color="bg-purple-500"
          />
        </div>
      </div>

      {/* Corporate Dashboard Showcase */}
      <div className="bg-white py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-20">
          <div className="lg:w-1/2 space-y-8">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
              Real-time Analytics <br />
              <span className="text-blue-600 italic">For Real Impact</span>
            </h2>
            <p className="text-slate-500 text-lg leading-relaxed font-medium">
              We provide corporations with a specialized **Impact Console**. Track your contributions, generate automated CSR reports, and visualize your footprint on the hunger heatmap.
            </p>
            
            <div className="space-y-6">
              <FeatureItem icon={<TrendingUp />} text="Monthly ESG Compliance Reports" />
              <FeatureItem icon={<Globe />} text="Regional Impact Heatmaps" />
              <FeatureItem icon={<Award />} text="Tax Exemption (80G) Certificate Automation" />
            </div>
          </div>
          
          <div className="lg:w-1/2 relative">
             <div className="absolute inset-0 bg-blue-500/10 blur-[120px] rounded-full"></div>
             <img 
               src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop" 
               className="rounded-[40px] shadow-3xl border border-white relative z-10 w-full"
               alt="Analytics Dashboard"
             />
          </div>
        </div>
      </div>

      {/* Partners Section */}
      <div className="bg-slate-50 py-32">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em] mb-12">Trusted by Industry Leaders</h3>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-40 grayscale group hover:grayscale-0 transition-all duration-700">
             <LogoPlaceholder name="Tata" />
             <LogoPlaceholder name="Reliance" />
             <LogoPlaceholder name="ITC" />
             <LogoPlaceholder name="Zomato" />
             <LogoPlaceholder name="HDFC" />
          </div>
        </div>
      </div>

      {/* CTA Footer */}
      <div className="bg-blue-600 py-24 text-center">
        <div className="max-w-3xl mx-auto px-6">
           <h2 className="text-4xl font-black text-white mb-8">Ready to define your corporate legacy?</h2>
           <p className="text-blue-100 text-lg font-medium mb-12">
             Join 200+ companies that have redefined their CSR strategy with FoodConnect Bharat.
           </p>
           <button className="px-10 py-5 rounded-3xl bg-white text-blue-600 font-extrabold text-lg shadow-2xl hover:scale-105 active:scale-95 transition-all">
             Contact Enterprise Relations
           </button>
        </div>
      </div>
    </div>
  );
}

function PillarCard({ icon, title, desc, score, color }) {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="bg-white p-10 rounded-[40px] shadow-2xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden group"
    >
       <div className={`w-16 h-16 ${color} rounded-2xl flex items-center justify-center text-white mb-8 shadow-xl group-hover:scale-110 transition-transform`}>
         {React.cloneElement(icon, { size: 32 })}
       </div>
       <h4 className="text-2xl font-black text-slate-900 mb-4">{title}</h4>
       <p className="text-slate-500 font-medium mb-8 leading-relaxed">{desc}</p>
       <div className={`inline-block px-4 py-2 rounded-full ${color} text-white font-black text-xs uppercase tracking-widest`}>
         {score}
       </div>
    </motion.div>
  );
}

function FeatureItem({ icon, text }) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
        {React.cloneElement(icon, { size: 20 })}
      </div>
      <span className="text-slate-800 font-black text-sm uppercase tracking-wide">{text}</span>
    </div>
  );
}

function LogoPlaceholder({ name }) {
  return (
    <div className="text-3xl font-black text-slate-900 tracking-tighter hover:text-blue-600 cursor-default transition-colors">
      {name}
    </div>
  );
}
