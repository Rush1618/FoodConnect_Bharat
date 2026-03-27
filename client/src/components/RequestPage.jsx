import React, { useState } from 'react';
import NeedForm from './NeedForm';
import { Heart, ShieldAlert, ArrowLeft, Info, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function RequestPage() {
  const [showSOS, setShowSOS] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#fafbff] pb-20">
      {/* Dynamic Header */}
      <div className={`relative pt-12 pb-24 px-6 transition-all duration-500 ${showSOS ? 'bg-red-600' : 'bg-blue-600'}`}>
        <div className="max-w-2xl mx-auto flex justify-between items-center mb-8 relative z-10">
          <button 
            onClick={() => navigate('/dashboard')}
            className="p-2.5 rounded-2xl bg-white/10 text-white backdrop-blur-md hover:bg-white/20 transition-all border border-white/10"
          >
            <ArrowLeft size={20} />
          </button>
          
          <div className="flex bg-black/10 backdrop-blur-xl p-1 rounded-2xl border border-white/5">
            <button 
              onClick={() => setShowSOS(false)}
              className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                !showSOS ? 'bg-white text-blue-600 shadow-xl' : 'text-white/60 hover:text-white'
              }`}
            >
              Standard
            </button>
            <button 
              onClick={() => setShowSOS(true)}
              className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                showSOS ? 'bg-red-500 text-white shadow-xl shadow-red-900/20' : 'text-white/60 hover:text-white'
              }`}
            >
              SOS Help
            </button>
          </div>
        </div>

        <div className="max-w-2xl mx-auto text-center relative z-10">
          <div className={`inline-flex p-4 rounded-3xl mb-6 shadow-2xl transition-all duration-700 ${
            showSOS ? 'bg-white text-red-600 scale-110' : 'bg-white text-blue-600'
          }`}>
            {showSOS ? <ShieldAlert size={40} className="animate-pulse" /> : <Heart size={40} />}
          </div>
          <h1 className="text-4xl font-black text-white mb-4 tracking-tight leading-tight" style={{ fontFamily: 'Plus Jakarta Sans' }}>
            {showSOS ? 'Emergency Food Help' : 'Request Food Assistance'}
          </h1>
          <p className="text-white/80 text-lg font-medium max-w-lg mx-auto">
            {showSOS 
              ? 'Urgent broadcast to all nearby volunteers and NGOs. Help is on the way.' 
              : 'Tell us what you need, and we will match you with available donations nearby.'}
          </p>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#fafbff] to-transparent"></div>
      </div>

      {/* Form Container */}
      <div className="max-w-xl mx-auto px-6 -mt-12 relative z-20">
        <div className="bg-white rounded-[40px] shadow-2xl shadow-blue-900/10 p-8 border border-slate-100">
          <NeedForm isSOS={showSOS} />
        </div>

        {/* Educational/Helpful Card */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-[32px] border border-slate-100 shadow-sm flex gap-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
              <Info size={24} />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm mb-1">How it works?</h4>
              <p className="text-xs text-slate-500 leading-relaxed">Your request is matched with Donors & NGO drivers nearby.</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-[32px] border border-slate-100 shadow-sm flex gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
              <MapPin size={24} />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm mb-1">Nearby Support</h4>
              <p className="text-xs text-slate-500 leading-relaxed">Over 50+ active Food Points in your current radius.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
