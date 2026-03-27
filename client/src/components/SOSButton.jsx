import React, { useState } from 'react';
import NeedForm from './NeedForm';
import { ShieldAlert } from 'lucide-react';

export default function SOSButton() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button 
        onClick={() => setShowModal(true)}
        className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 shadow-xl border-4 border-white flex flex-col items-center justify-center text-white font-black hover:scale-105 transition-transform animate-pulse"
      >
        <ShieldAlert size={20} className="mb-0.5" />
        <span className="text-[10px] uppercase tracking-widest leading-none">SOS</span>
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-[99999] flex items-center justify-center p-4">
           <div className="w-full max-w-lg relative bg-gray-50 rounded-3xl overflow-hidden">
             <button title="Close" onClick={() => setShowModal(false)} className="absolute top-4 right-4 bg-gray-200 w-8 h-8 rounded-full font-bold flex items-center justify-center hover:bg-gray-300">×</button>
             <div className="p-6">
                <NeedForm isSOS={true} onClose={() => setShowModal(false)} />
             </div>
           </div>
        </div>
      )}
    </>
  );
}
