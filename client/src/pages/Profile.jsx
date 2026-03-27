import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import AllergenPicker from '../components/AllergenPicker';
import { User, Phone, Shield, LogOut, Save, Award, Activity, MapPin } from 'lucide-react';

export default function Profile() {
  const { user, token, updateUser, logout } = useAuth();
  const [profile, setProfile] = useState(user?.allergyProfile || []);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [userRequests, setUserRequests] = useState([]);
  const [loadingActivity, setLoadingActivity] = useState(true);

  React.useEffect(() => {
    const fetchMyActivity = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/requests', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (Array.isArray(data)) setUserRequests(data);
      } catch (e) {
        console.error('Failed to fetch activity', e);
      } finally {
        setLoadingActivity(false);
      }
    };
    if (token) fetchMyActivity();
  }, [token]);

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center text-gray-500">
      Please login first
    </div>
  );

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('http://localhost:5000/api/users/allergy-profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ allergyProfile: profile }),
      });
      if (!res.ok) throw new Error('Failed to update');
      const data = await res.json();
      updateUser({ allergyProfile: data.allergyProfile });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) { alert(err.message); }
    setSaving(false);
  };

  const ROLE_COLORS = {
    donor: 'from-orange-500 to-rose-500',
    needer: 'from-blue-500 to-cyan-500',
    volunteer: 'from-yellow-500 to-amber-500',
    ngo: 'from-purple-500 to-violet-500',
  };

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-xl mx-auto space-y-6">
        {/* Profile Card */}
        <div className="glass-card p-8">
          <div className="flex items-center gap-5">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${ROLE_COLORS[user.role] || 'from-gray-600 to-gray-700'} flex items-center justify-center text-2xl font-extrabold text-white shadow-xl`}>
              {user.name?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-extrabold text-white" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                {user.name}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full bg-gradient-to-r ${ROLE_COLORS[user.role] || 'from-gray-600 to-gray-700'} text-white uppercase tracking-wider`}>
                  {user.role}
                </span>
              </div>
            </div>
            <button onClick={logout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-red-400 border border-red-500/20 hover:bg-red-500/10 transition text-sm font-semibold">
              <LogOut size={14} /> Logout
            </button>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="bg-white/5 rounded-xl p-3 flex items-center gap-3">
              <Phone size={16} className="text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Phone</p>
                <p className="text-sm font-semibold text-gray-200">{user.phone || '—'}</p>
              </div>
            </div>
            <div className="bg-white/5 rounded-xl p-3 flex items-center gap-3">
              <Award size={16} className="text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">Allergens saved</p>
                <p className="text-sm font-semibold text-gray-200">{profile.length} items</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dietary Profile */}
        <div className="glass-card p-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield size={18} className="text-orange-400" />
            <h3 className="text-lg font-extrabold text-white" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              Dietary Profile
            </h3>
          </div>
          <p className="text-sm text-gray-500 mb-6">
            Set this once — we'll auto-filter all donations to match your diet safely.
          </p>

          <AllergenPicker
            mode={user.role === 'donor' ? 'donor' : 'needer'}
            selected={profile}
            onChange={setProfile}
          />

          <button
            onClick={handleSave}
            disabled={saving}
            className={`mt-6 w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 ${saved ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'btn-primary text-white'}`}
          >
            {saving ? 'Saving…' : saved ? '✓ Saved Successfully!' : <><Save size={15} /> Save Profile</>}
          </button>
        </div>

        {/* My Activity & Tracking */}
        <div className="glass-card p-8">
          <div className="flex items-center gap-3 mb-6">
            <Activity size={18} className="text-blue-400" />
            <h3 className="text-lg font-extrabold text-white" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              My Food Activity
            </h3>
          </div>
          
          <div className="space-y-4">
            {loadingActivity ? (
              <p className="text-gray-500 text-sm animate-pulse">Loading tracking data...</p>
            ) : userRequests.length === 0 ? (
              <p className="text-gray-500 text-sm italic">No active food requests or fulfillments found.</p>
            ) : (
              userRequests.map(req => (
                <div key={req._id} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-white font-bold capitalize leading-tight">
                        {req.neederId?._id === user.id ? 'My Food Request' : `Fulfilling ${req.neederId?.name}'s Request`}
                      </p>
                      <p className="text-[10px] text-gray-500 mt-1">{new Date(req.createdAt).toLocaleDateString()} • {req.numberOfPeople} people</p>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border whitespace-nowrap ${
                      req.status === 'pending' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                      req.status.includes('approved') ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                      'bg-blue-500/10 text-blue-400 border-blue-500/20'
                    }`}>
                      {req.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  {req.linkedDonation && (
                    <div className="bg-white/5 rounded-xl p-3 border border-white/10 mt-1">
                      <p className="text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-wider">Pickup Location</p>
                      <div className="flex items-start gap-2">
                        <MapPin size={14} className="text-orange-400 shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm text-gray-200 font-medium">{req.linkedDonation.location?.address}</p>
                          <a 
                            href={`https://www.google.com/maps/search/?api=1&query=${req.linkedDonation.location?.lat},${req.linkedDonation.location?.lng}`}
                            target="_blank" rel="noreferrer"
                            className="text-[10px] text-blue-400 font-bold hover:underline mt-2 inline-block bg-blue-500/10 px-2 py-1 rounded-md"
                          >
                            Open in Google Maps →
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
