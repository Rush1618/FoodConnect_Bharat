import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AllergenPicker from './AllergenPicker';
import { User, Phone, Lock, ChevronRight, ChevronLeft, CheckCircle, Zap } from 'lucide-react';

// ── Demo shortcuts ─────────────────────────────────────
const DEMO_ACCOUNTS = [
  { label: '🍲 Donor',  phone: '9000000001', password: 'demo123', color: 'border-orange-200 bg-orange-50 text-orange-600 hover:bg-orange-100' },
  { label: '🍽️ Receiver', phone: '9000000002', password: 'demo123', color: 'border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100' },
  { label: '🏢 NGO',    phone: '9000000003', password: 'demo123', color: 'border-purple-200 bg-purple-50 text-purple-600 hover:bg-purple-100' },
  { label: '🛵 Volunteer', phone: '9000000004', password: 'demo123', color: 'border-green-200 bg-green-50 text-green-600 hover:bg-green-100' },
];

const ROLES = [
  { id: 'donor',     emoji: '🍲', title: 'Donor (Host/Restaurant)',  desc: 'Share your surplus food' },
  { id: 'needer',    emoji: '🍽️', title: 'Receive Food',   desc: 'Find food near you' },
  { id: 'volunteer', emoji: '🚴', title: 'Volunteer',    desc: 'Help deliver food' },
  { id: 'ngo',       emoji: '🏢', title: 'NGO / Org',   desc: 'Represent an organisation' },
];

export default function AuthPage({ defaultTab = 'login' }) {
  const [tab, setTab]   = useState(defaultTab);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [loginData, setLoginData] = useState({ phone: '', password: '' });
  const [regData, setRegData]     = useState({
    name: '', phone: '', password: '', role: 'donor',
    dietaryPref: 'any', allergyProfile: [], allergyNotes: ''
  });

  const { login } = useAuth();
  const navigate  = useNavigate();

  // ── helper: call API then store session ──────────────
  const callAuth = async (url, body) => {
    const res  = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');
    login(data.user, data.token);
    navigate('/');
  };

  // ── demo one-click ────────────────────────────────────
  const demoLogin = async (phone, password) => {
    setLoading(true);
    try { await callAuth('http://localhost:5000/api/auth/login', { phone, password }); }
    catch (err) { alert(`Demo login failed: ${err.message}`); }
    setLoading(false);
  };

  // ── real login ────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try { await callAuth('http://localhost:5000/api/auth/login', loginData); }
    catch (err) { alert(err.message); }
    setLoading(false);
  };

  // ── real register ─────────────────────────────────────
  const handleRegister = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try { await callAuth('http://localhost:5000/api/auth/register', regData); }
    catch (err) { alert(err.message); }
    setLoading(false);
  };

  const Field = ({ icon: Icon, ...props }) => (
    <div className="relative">
      <Icon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
      <input {...props} className="form-input pl-10" />
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md space-y-4">

        {/* ── Demo shortcuts (always visible, separate from real forms) ── */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
            <Zap size={12} className="text-orange-500" /> Quick demo — one click
          </div>
          <div className="grid grid-cols-2 gap-2">
            {DEMO_ACCOUNTS.map(acc => (
              <button key={acc.phone} type="button" disabled={loading}
                onClick={() => demoLogin(acc.phone, acc.password)}
                className={`py-2.5 px-2 rounded-xl border text-xs font-bold transition-all text-center disabled:opacity-50 ${acc.color} bg-white shadow-sm`}>
                {acc.label}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-slate-400 text-center">
            Demo accounts auto-seeded · password: <code className="text-slate-500 font-mono bg-slate-100 px-1 rounded">demo123</code>
          </p>
        </motion.div>

        {/* ── Tab switcher ── */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-1 flex gap-1">
          {['login','register'].map(t => (
            <button key={t} type="button"
              onClick={() => { setTab(t); setStep(1); }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                tab === t ? 'bg-orange-500 text-white shadow-lg' : 'text-slate-500 hover:text-slate-900 hover:bg-white'
              }`}>
              {t === 'login' ? '🔑 Login' : '✨ Register'}
            </button>
          ))}
        </motion.div>

        {/* ── Login form ── */}
        {tab === 'login' && (
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-8 shadow-sm">
            <h2 className="text-2xl font-extrabold text-slate-900 mb-1" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Welcome back
            </h2>
            <p className="text-slate-500 text-sm mb-7">Sign in with your phone number.</p>

            <form onSubmit={handleLogin} className="space-y-4">
              <Field icon={Phone} required type="tel" placeholder="Phone Number"
                value={loginData.phone} onChange={e => setLoginData({ ...loginData, phone: e.target.value })} />
              <Field icon={Lock} required type="password" placeholder="Password"
                value={loginData.password} onChange={e => setLoginData({ ...loginData, password: e.target.value })} />

              <button type="submit" disabled={loading}
                className="btn-primary w-full py-3 rounded-xl text-white font-bold disabled:opacity-50 mt-2">
                {loading ? 'Signing in…' : 'Sign In →'}
              </button>
            </form>

            <p className="text-center text-slate-500 text-xs mt-5">
              New here?{' '}
              <button type="button" onClick={() => setTab('register')} className="text-orange-600 hover:text-orange-500 font-semibold transition">
                Create account →
              </button>
            </p>
          </motion.div>
        )}

        {/* ── Register form (2-step) ── */}
        {tab === 'register' && (
          <>
            {/* Step dots */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center gap-2">
              {[1,2].map(s => (
                <div key={s} className={`h-1.5 rounded-full transition-all ${
                  s === step ? 'w-8 bg-orange-500 shadow-sm' : s < step ? 'w-4 bg-green-500' : 'w-4 bg-slate-200'
                }`} />
              ))}
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-8 shadow-sm">
              <h2 className="text-2xl font-extrabold text-slate-900 mb-1" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                {step === 1 ? 'Create account' : 'Dietary profile'}
              </h2>
              <p className="text-slate-500 text-sm mb-7">
                {step === 1 ? 'Takes 60 seconds. No email needed.' : 'Help us match you with safe food.'}
              </p>

              <form onSubmit={step === 1 ? (e) => { e.preventDefault(); setStep(2); } : handleRegister} className="space-y-4">
                {step === 1 && (
                  <>
                    <Field icon={User} required type="text" placeholder="Full Name"
                      value={regData.name} onChange={e => setRegData({ ...regData, name: e.target.value })} />
                    <Field icon={Phone} required type="tel" placeholder="Phone Number"
                      value={regData.phone} onChange={e => setRegData({ ...regData, phone: e.target.value })} />
                    <Field icon={Lock} required type="password" placeholder="Password (min 6 chars)"
                      minLength={6}
                      value={regData.password} onChange={e => setRegData({ ...regData, password: e.target.value })} />

                    <div className="pt-1">
                      <p className="text-xs text-slate-500 uppercase tracking-widest mb-3 font-semibold">I am a…</p>
                      <div className="grid grid-cols-2 gap-2">
                        {ROLES.map(r => (
                          <button type="button" key={r.id}
                            onClick={() => setRegData({ ...regData, role: r.id })}
                            className={`p-3 rounded-xl border text-left transition-all ${
                              regData.role === r.id
                                ? 'border-orange-500 bg-orange-50 shadow-sm text-orange-900'
                                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                            }`}>
                            <span className="text-2xl">{r.emoji}</span>
                            <p className="text-sm font-bold mt-1 text-slate-800">{r.title}</p>
                            <p className="text-xs opacity-80">{r.desc}</p>
                            {regData.role === r.id && <CheckCircle size={14} className="text-orange-500 mt-1" />}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button type="submit"
                      className="btn-primary w-full py-3 rounded-xl text-white font-bold flex items-center justify-center gap-2">
                      Continue <ChevronRight size={16} />
                    </button>
                  </>
                )}

                {step === 2 && (
                  <>
                    <div>
                      <label className="text-sm font-semibold text-slate-700 mb-2 block">Dietary Preference</label>
                      <div className="grid grid-cols-3 gap-2">
                        {['veg','jain','any'].map(p => (
                          <button type="button" key={p}
                            onClick={() => setRegData({ ...regData, dietaryPref: p })}
                            className={`py-2 rounded-xl border text-sm font-bold capitalize transition-all ${
                              regData.dietaryPref === p
                                ? 'border-green-300 bg-green-50 text-green-700'
                                : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                            }`}>
                            {p === 'any' ? 'Non-veg' : p}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-slate-700 mb-2 block">
                        {regData.role === 'donor' ? 'Ingredients in your food' : 'Allergens to avoid'}
                      </label>
                      <AllergenPicker
                        mode={regData.role === 'donor' ? 'donor' : 'needer'}
                        selected={regData.allergyProfile}
                        onChange={ap => setRegData({ ...regData, allergyProfile: ap })}
                      />
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button type="button" onClick={() => setStep(1)}
                        className="flex items-center gap-1.5 px-4 py-3 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 text-sm font-bold transition">
                        <ChevronLeft size={15} /> Back
                      </button>
                      <button type="submit" disabled={loading}
                        className="btn-primary flex-1 py-3 rounded-xl text-white font-bold disabled:opacity-50">
                        {loading ? 'Creating…' : '🎉 Join Now'}
                      </button>
                    </div>

                    <button type="button" onClick={handleRegister}
                      className="w-full text-gray-500 text-sm py-1 hover:text-gray-300 transition">
                      Skip dietary setup →
                    </button>
                  </>
                )}
              </form>

              <p className="text-center text-slate-500 text-xs mt-5">
                Already have an account?{' '}
                <button type="button" onClick={() => setTab('login')} className="text-orange-600 hover:text-orange-500 font-semibold transition">
                  Sign in →
                </button>
              </p>
            </motion.div>
          </>
        )}

        <p className="text-center text-slate-400 text-xs pb-2 mt-4 font-medium">
          Community guidelines apply. No food waste, only love. 🧡
        </p>
      </div>
    </div>
  );
}
