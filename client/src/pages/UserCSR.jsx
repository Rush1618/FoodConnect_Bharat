import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Download, ShieldCheck, Award, 
  TrendingUp, Globe, Building2, Zap,
  CheckCircle2, Clock, Upload, Search,
  ChevronRight, Calendar, Filter
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import clsx from 'clsx';

export default function UserCSR() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('certificates');

  const [certificates, setCertificates] = useState([
    { id: 'CERT-001', title: '80G Tax Exemption (Q1 2026)', date: 'Mar 15, 2026', type: 'Tax', status: 'verified', size: '2.4 MB' },
    { id: 'CERT-002', title: 'Impact Statement - Mumbai Hub', date: 'Feb 28, 2026', type: 'Impact', status: 'verified', size: '1.8 MB' },
    { id: 'CERT-003', title: 'Zero Waste Compliance Audit', date: 'Jan 10, 2026', type: 'Audit', status: 'pending', size: '4.2 MB' },
    { id: 'CERT-004', title: 'Community Hero - CSR Award', date: 'Dec 15, 2025', type: 'Award', status: 'verified', size: '1.2 MB' },
  ]);

  const handleUpload = () => {
    const newCert = {
      id: `CERT-${Math.floor(Math.random()*900)+100}`,
      title: 'New Uploaded Document',
      date: new Date().toLocaleDateString(),
      type: 'Compliance',
      status: 'pending',
      size: '1.5 MB'
    };
    setCertificates([newCert, ...certificates]);
    alert('Document uploaded successfully to your CSR Vault. Awaiting verification.');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 pt-32 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-widest mb-2">
                <Building2 size={14} /> Corporate Dashboard
              </div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">CSR & Compliance Hub</h1>
              <p className="text-slate-500 font-medium mt-1">Manage your enterprise impact, tax documents, and certificates.</p>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
               <button 
                 onClick={handleUpload}
                 className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-slate-900 text-white font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10">
                 <Upload size={16} /> Upload Docs
               </button>
               <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 text-white font-black text-xs uppercase tracking-widest hover:bg-blue-500 transition-all shadow-xl shadow-blue-500/10 active:scale-95">
                 <Zap size={16} /> Request Audit
               </button>
            </div>
          </div>
          
          {/* Internal Navbar */}
          <div className="flex bg-slate-100 p-1.5 rounded-2xl mt-12 w-fit">
            <TabBtn active={activeTab === 'certificates'} onClick={() => setActiveTab('certificates')} label="Certificates" icon={<FileText size={16}/>} />
            <TabBtn active={activeTab === 'ledger'} onClick={() => setActiveTab('ledger')} label="Impact Ledger" icon={<TrendingUp size={16}/>} />
            <TabBtn active={activeTab === 'compliance'} onClick={() => setActiveTab('compliance')} label="Compliance" icon={<ShieldCheck size={16}/>} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {activeTab === 'certificates' && (
            <motion.div 
              key="certs"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard label="Total Saved Tax" value="₹ 4.2 Lakhs" color="text-emerald-600" bg="bg-emerald-50" />
                <StatCard label="Impact Score" value="94 / 100" color="text-blue-600" bg="bg-blue-50" />
                <StatCard label="Compliance Status" value="A+ Certified" color="text-purple-600" bg="bg-purple-50" />
              </div>

              {/* Certificate Table */}
              <div className="bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm">
                <div className="px-8 py-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                   <h3 className="text-lg font-black text-slate-800">Your Documents</h3>
                   <div className="relative w-full sm:w-72">
                      <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input type="text" placeholder="Search certificates..." className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 pl-12 pr-4 text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500/20 transition-all" />
                   </div>
                </div>
                
                <div className="overflow-x-auto">
                   <table className="w-full text-left">
                      <thead>
                         <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest px-8">
                            <th className="px-8 py-4">Document Title</th>
                            <th className="px-8 py-4">Type</th>
                            <th className="px-8 py-4">Status</th>
                            <th className="px-8 py-4">Date Added</th>
                            <th className="px-8 py-4 text-right">Actions</th>
                         </tr>
                      </thead>
                      <tbody>
                         {/* Approved Donation Certificates Section */}
                         <tr className="bg-blue-50/20 border-b border-blue-100">
                            <td colSpan="5" className="px-8 py-2 text-[9px] font-black text-blue-500 uppercase tracking-widest">
                               Available to Generate (Approved Donations)
                            </td>
                         </tr>
                         <tr className="border-t border-slate-50 hover:bg-slate-50/50 transition-colors group">
                              <td className="px-8 py-6">
                                 <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                                       <Award size={18} />
                                    </div>
                                    <div>
                                       <h4 className="text-sm font-black text-slate-900">Donation #9381 - "Green Veggies"</h4>
                                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Verified by NGO Hub A • 40 Meals</p>
                                    </div>
                                 </div>
                              </td>
                              <td className="px-8 py-6">
                                 <span className="text-xs font-black text-slate-700 uppercase tracking-widest">Food Impact</span>
                              </td>
                              <td className="px-8 py-6">
                                 <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-black uppercase tracking-widest font-sans">
                                    <CheckCircle2 size={12} /> Approved
                                 </div>
                              </td>
                              <td className="px-8 py-6">
                                 <span className="text-xs font-bold text-slate-500">Just Now</span>
                              </td>
                              <td className="px-8 py-6 text-right">
                                 <button 
                                   onClick={() => alert('🏆 Certificate Generated: [FCB-9381]. You can now download your tax compliance receipt.')}
                                   className="px-4 py-2 rounded-xl bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-500/10 hover:bg-blue-500 transition-all flex items-center gap-2 ml-auto">
                                    <Zap size={12} /> Get Certificate
                                 </button>
                              </td>
                         </tr>

                         {certificates.map((cert) => (
                           <tr key={cert.id} className="border-t border-slate-50 hover:bg-slate-50/50 transition-colors group">
                              <td className="px-8 py-6">
                                 <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                       <FileText size={18} />
                                    </div>
                                    <div>
                                       <h4 className="text-sm font-black text-slate-900">{cert.title}</h4>
                                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{cert.id} • {cert.size}</p>
                                    </div>
                                 </div>
                              </td>
                              <td className="px-8 py-6">
                                 <span className="text-xs font-black text-slate-700 uppercase tracking-widest">{cert.type}</span>
                              </td>
                              <td className="px-8 py-6">
                                 {cert.status === 'verified' ? (
                                   <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-black uppercase tracking-widest font-sans">
                                      <CheckCircle2 size={12} /> Verified
                                   </div>
                                 ) : (
                                   <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-100 text-[10px] font-black uppercase tracking-widest font-sans">
                                      <Clock size={12} /> Syncing
                                   </div>
                                 )}
                              </td>
                              <td className="px-8 py-6">
                                 <span className="text-xs font-bold text-slate-500">{cert.date}</span>
                              </td>
                              <td className="px-8 py-6 text-right">
                                 <button className="p-2.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                                    <Download size={16} />
                                 </button>
                              </td>
                           </tr>
                         ))}
                      </tbody>
                   </table>
                </div>

                <div className="bg-slate-50 px-8 py-4 text-center">
                   <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors">
                      View full document archive
                   </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'ledger' && (
            <motion.div 
               key="ledger"
               initial={{ opacity: 0, scale: 0.98 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.98 }}
               className="bg-white rounded-[40px] border border-slate-200 p-12 text-center"
            >
               <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-6">
                  <TrendingUp size={32} className="text-blue-600" />
               </div>
               <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tighter">Real-time Impact Ledger</h3>
               <p className="text-slate-500 max-w-lg mx-auto leading-relaxed mb-10 font-medium">
                  Trace every kilogram of food from your facility to the beneficiary. Our ledger provides 100% transparency for your annual ESG reporting.
               </p>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                  <LedgerAction title="Download Q1 Report (PDF)" desc="Full audit trail of all donations." />
                  <LedgerAction title="Export for ESG Data Hub" desc="CSV/Excel format for compliance." />
               </div>
            </motion.div>
          )}

          {activeTab === 'compliance' && (
            <motion.div 
               key="comp"
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               className="bg-slate-900 rounded-[40px] p-12 text-white overflow-hidden relative"
            >
               <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px]"></div>
               <div className="max-w-2xl relative z-10">
                  <h3 className="text-3xl font-black mb-6 tracking-tight italic bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">Compliance Certification</h3>
                  <p className="text-slate-400 font-medium mb-10 leading-relaxed">
                     Your organization has met the **Tier-1 Safety & Hygeine Standards** for the current cycle. Continue maintaining these levels to keep your 'Zero Waste Platinum' status.
                  </p>
                  
                  <div className="space-y-4 mb-10">
                     <ComplianceItem text="FSSAI Hygiene Verification Passed" />
                     <ComplianceItem text="Real-time Thermal Tracking Logic" />
                     <ComplianceItem text="Allergen Labeling Compliance" />
                  </div>

                  <button className="px-8 py-4 rounded-2xl bg-white text-slate-900 font-black text-xs uppercase tracking-widest shadow-2xl hover:bg-slate-100 transition-all flex items-center gap-2">
                     Generate Compliance Badge <ShieldCheck size={18} className="text-blue-600" />
                  </button>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function TabBtn({ active, onClick, label, icon }) {
  return (
    <button 
      onClick={onClick}
      className={clsx(
        "flex items-center gap-2 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all",
        active ? "bg-white text-blue-600 shadow-xl shadow-blue-500/10" : "text-slate-500 hover:text-slate-900"
      )}
    >
      {React.cloneElement(icon, { size: 14 })}
      {label}
    </button>
  );
}

function StatCard({ label, value, color, bg }) {
  return (
    <div className={`p-8 rounded-[32px] border border-slate-200 bg-white shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all group`}>
       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{label}</p>
       <h4 className={`text-4xl font-black ${color} tracking-tighter`}>{value}</h4>
       <div className="h-1 bg-slate-50 rounded-full mt-6 overflow-hidden">
          <div className={`h-full ${bg.replace('bg-', 'bg-').replace('-50', '-500')} w-2/3 group-hover:w-full transition-all duration-1000`} />
       </div>
    </div>
  );
}

function LedgerAction({ title, desc }) {
  return (
    <button className="text-left p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:bg-slate-100/50 transition-all group">
       <div className="flex justify-between items-center mb-1">
          <h4 className="font-black text-slate-800 text-sm group-hover:text-blue-600 transition-colors uppercase tracking-tight">{title}</h4>
          <ChevronRight size={16} className="text-slate-400" />
       </div>
       <p className="text-xs text-slate-500 font-medium">{desc}</p>
    </button>
  );
}

function ComplianceItem({ text }) {
  return (
    <div className="flex items-center gap-3">
       <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
          <CheckCircle2 size={14} />
       </div>
       <span className="text-sm font-bold text-slate-300">{text}</span>
    </div>
  );
}
