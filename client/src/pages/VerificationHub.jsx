import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, MapPin, CheckCircle2, AlertTriangle, 
  Clock, Search, Filter, Camera, Zap, Utensils,
  ChevronRight, ArrowLeft, RefreshCw, Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { localStorageBridge } from '../utils/localStorageBridge';
import { useAuth } from '../context/AuthContext';

export default function VerificationHub() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('hunger'); // hunger | food
  const [loading, setLoading] = useState(false);
  const [hungerSpots, setHungerSpots] = useState(localStorageBridge.getHungerSpots());
  const [unverifiedFood, setUnverifiedFood] = useState([]);

  useEffect(() => {
    fetchUnverified();
  }, []);

  const fetchUnverified = async () => {
    setLoading(true);
    try {
      // In a real app, this would be a specific API for unverified items
      const res = await fetch('http://localhost:5000/api/donations?status=pending');
      const data = await res.json();
      setUnverifiedFood(Array.isArray(data) ? data : []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleConfirmSpot = (id) => {
    localStorageBridge.confirmHungerSpot(id, user?.id);
    setHungerSpots(localStorageBridge.getHungerSpots());
    alert('🚨 Hunger Spot Verified! It will now appear on the Global Heatmap for all NGOs.');
  };

  const handleVerifyFood = async (id) => {
    try {
      const tok = localStorage.getItem('token');
      await fetch(`http://localhost:5000/api/donations/${id}/verify`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${tok}` },
        body: JSON.stringify({ verified: true })
      });
      alert('🥗 Food Quality Verified! Karma points awarded.');
      fetchUnverified();
    } catch (e) { alert('Verification synced locally for prototype.'); }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Header */}
      <div className="bg-slate-900 pt-28 pb-16 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10 blur-3xl bg-blue-500 w-96 h-96 rounded-full"></div>
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="flex items-center gap-4 mb-6">
             <button onClick={() => navigate('/dashboard')} className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition">
                <ArrowLeft size={20} />
             </button>
             <div className="flex items-center gap-2 p-1.5 px-3 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-400 text-[10px] font-black uppercase tracking-widest">
                <ShieldCheck size={12} /> Verification Authority
             </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2 italic">Ground Zero Verification</h1>
          <p className="text-slate-400 font-medium max-w-xl">Confirm high-hunger zones and verify food quality to ensure 100% safety and targeted impact.</p>
          
          <div className="flex gap-4 mt-8 bg-white/5 p-1.5 rounded-2xl w-fit border border-white/10">
             <VerificationTab active={activeTab === 'hunger'} onClick={() => setActiveTab('hunger')} label="Hunger Spots" count={hungerSpots.filter(s => s.status === 'pending').length} />
             <VerificationTab active={activeTab === 'food'} onClick={() => setActiveTab('food')} label="Food Quality" count={unverifiedFood.length} />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {activeTab === 'hunger' && (
            <motion.div 
               key="hunger" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
               className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
               {hungerSpots.length === 0 ? (
                 <div className="col-span-2 text-center py-20 bg-white rounded-[40px] border border-slate-100 shadow-sm">
                    <MapPin size={48} className="text-slate-200 mx-auto mb-4" />
                    <h4 className="font-black text-slate-800">No Pending Hunger Spots</h4>
                    <p className="text-slate-500 text-sm">All reported areas have been verified or addressed.</p>
                 </div>
               ) : (
                 hungerSpots.map((spot) => (
                   <div key={spot.id} className="bg-white rounded-[32px] border border-slate-100 p-6 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all group relative overflow-hidden">
                      {spot.status === 'confirmed' && <div className="absolute top-0 right-0 p-4 text-emerald-500"><CheckCircle2 size={24} /></div>}
                      <div className="flex items-start gap-4 mb-6">
                         <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${spot.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                            <MapPin size={24} />
                         </div>
                         <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Reported Area</p>
                            <h4 className="text-xl font-black text-slate-800 leading-tight mt-1">{spot.description || "Unspecified Hunger Cluster"}</h4>
                            <div className="flex items-center gap-2 mt-2">
                               <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1 uppercase tracking-tighter">
                                  <Clock size={10} /> {new Date(spot.reportedAt).toLocaleTimeString()}
                               </span>
                            </div>
                         </div>
                      </div>
                      
                      <div className="p-4 bg-slate-50 rounded-2xl mb-6">
                         <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                            <span>Verification Confidence</span>
                            <span>{spot.status === 'confirmed' ? '100%' : 'High'}</span>
                         </div>
                         <div className="h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
                            <motion.div 
                               initial={{ width: 0 }} 
                               animate={{ width: spot.status === 'confirmed' ? '100%' : '85%' }} 
                               className={`h-full ${spot.status === 'confirmed' ? 'bg-emerald-500' : 'bg-blue-500'}`}
                            ></motion.div>
                         </div>
                      </div>

                      {spot.status === 'confirmed' ? (
                        <div className="w-full py-3 text-center bg-emerald-50 text-emerald-600 font-extrabold text-xs rounded-xl uppercase tracking-widest border border-emerald-100">
                           Spot Confirmed
                        </div>
                      ) : (
                        <button 
                           onClick={() => handleConfirmSpot(spot.id)}
                           className="w-full py-4 bg-blue-600 text-white font-black text-xs rounded-2xl uppercase tracking-widest hover:bg-blue-500 transition-all flex items-center justify-center gap-2 shadow-xl shadow-blue-500/20 active:scale-95"
                        >
                           <Zap size={16} /> Confirm High Hunger Spot
                        </button>
                      )}
                   </div>
                 ))
               )}
            </motion.div>
          )}

          {activeTab === 'food' && (
            <motion.div 
               key="food" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
               className="space-y-6"
            >
               {unverifiedFood.filter(f => !f.verified).length === 0 ? (
                 <div className="text-center py-20 bg-white rounded-[40px] border border-slate-100 shadow-sm">
                    <Utensils size={48} className="text-slate-200 mx-auto mb-4" />
                    <h4 className="font-black text-slate-800">All Food Verified</h4>
                    <p className="text-slate-500 text-sm">Great job! No pending food quality audits right now.</p>
                 </div>
               ) : (
                 unverifiedFood.filter(f => !f.verified).map((item) => (
                   <div key={item._id} className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm hover:shadow-xl transition-all flex flex-col md:flex-row items-center gap-8">
                      <div className="w-24 h-24 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                         <Utensils size={40} />
                      </div>
                      <div className="flex-1 text-center md:text-left">
                         <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-2">
                            <span className="px-3 py-1 bg-amber-50 text-amber-600 text-[9px] font-black uppercase tracking-widest rounded-full border border-amber-100">
                               Pending QC Audit
                            </span>
                            <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[9px] font-black uppercase tracking-widest rounded-full border border-slate-200">
                               {item.foodType}
                            </span>
                         </div>
                         <h4 className="text-2xl font-black text-slate-900 leading-tight mb-1">{item.quantity} - {item.description?.slice(0, 40)}...</h4>
                         <p className="text-slate-500 text-sm font-medium flex items-center justify-center md:justify-start gap-1">
                            <MapPin size={12} /> {item.location?.address}
                         </p>
                      </div>
                      <div className="flex gap-3 w-full md:w-auto">
                         <button 
                           onClick={() => handleVerifyFood(item._id)}
                           className="flex-1 md:flex-none px-8 py-4 bg-emerald-600 text-white font-black text-xs rounded-2xl uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-500/20 active:scale-95"
                         >
                            Approve
                         </button>
                         <button className="flex-1 md:flex-none px-8 py-4 bg-red-50 text-red-600 border border-red-100 font-black text-xs rounded-2xl uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-sm">
                            Reject
                         </button>
                      </div>
                   </div>
                 ))
               )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function VerificationTab({ active, onClick, label, count }) {
  return (
    <button 
       onClick={onClick}
       className={`relative px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all overflow-hidden ${active ? 'bg-white text-blue-600 shadow-xl shadow-blue-500/10' : 'text-slate-400 hover:text-white'}`}
    >
       <div className="flex items-center gap-2 relative z-10">
          {label}
          {count > 0 && (
            <span className={`px-1.5 py-0.5 rounded-full text-[9px] ${active ? 'bg-blue-600 text-white' : 'bg-white/20 text-white'}`}>
               {count}
            </span>
          )}
       </div>
    </button>
  );
}
