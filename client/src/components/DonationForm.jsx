import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import AllergenPicker from './AllergenPicker';
import { useAuth } from '../context/AuthContext';
import { MapPin, Clock, Utensils, CheckCircle, Share2, Plus, Navigation } from 'lucide-react';

const FOOD_TYPES = [
  { value: 'veg', label: '🌿 Vegetarian', color: 'border-green-500/40 bg-green-500/10 text-green-400' },
  { value: 'jain', label: '🟡 Jain', color: 'border-yellow-500/40 bg-yellow-500/10 text-yellow-400' },
  { value: 'nonveg', label: '🍗 Non-Veg', color: 'border-red-500/40 bg-red-500/10 text-red-400' },
  { value: 'bhandara', label: '✨ Bhandara', color: 'border-purple-500/40 bg-purple-500/10 text-purple-400' },
];

const FOOD_CATEGORIES = [
  { value: 'baked', label: '🥐 Baked' },
  { value: 'ready-to-eat', label: '🍛 Ready to Eat' },
  { value: 'packed', label: '📦 Packed' },
];

export default function DonationForm({ setDonations }) {
  const { user } = useAuth();
  const locationState = useLocation();
  const targetRequest = locationState.state?.targetRequest;
  const [method, setMethod] = useState('map'); // 'map' or 'ngo'
  const [ngos, setNgos] = useState([]);
  const [selectedNgo, setSelectedNgo] = useState('');
  const [foodType, setFoodType] = useState('veg');
  const [foodCategory, setFoodCategory] = useState('ready-to-eat');
  const [quantity, setQuantity] = useState('');
  const [description, setDescription] = useState('');
  const [preparedAt, setPreparedAt] = useState(() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  });
  const [estimatedFreshFor, setEstimatedFreshFor] = useState(4);
  
  const [packedExpiryDate, setPackedExpiryDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  });

  const [ingredientsUsed, setIngredientsUsed] = useState([]);
  const [address, setAddress] = useState('');
  const [jainWarning, setJainWarning] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    fetch('http://localhost:5000/api/auth/ngos')
      .then(res => res.json())
      .then(data => {
        setNgos(data);
        if (data.length > 0) setSelectedNgo(data[0]._id);
      })
      .catch(err => console.error(err));

    // Cleanup interval on unmount
    const syncInterval = setInterval(syncOfflineDonations, 30000); // Try every 30s
    return () => clearInterval(syncInterval);
  }, []);

  const syncOfflineDonations = async () => {
    const pending = JSON.parse(localStorage.getItem('pending_donations') || '[]');
    if (pending.length === 0) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    console.log(`Attempting to sync ${pending.length} offline donations...`);
    const remaining = [];

    for (const donation of pending) {
      try {
        const res = await fetch('http://localhost:5000/api/donations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(donation),
        });
        if (res.ok) {
          const synced = await res.json();
          if (setDonations) setDonations(prev => [synced, ...prev]);
        } else {
          remaining.push(donation);
        }
      } catch (err) {
        remaining.push(donation);
      }
    }

    localStorage.setItem('pending_donations', JSON.stringify(remaining));
  };

  React.useEffect(() => {
    if (targetRequest) {
      if (['veg', 'jain', 'nonveg'].includes(targetRequest.dietaryPref)) {
        setFoodType(targetRequest.dietaryPref);
      }
      setQuantity(`${targetRequest.numberOfPeople} plates (est)`);
    }
  }, [targetRequest]);

  const handleAllergenChange = (sel) => {
    setIngredientsUsed(sel);
    setJainWarning(foodType === 'jain' && (sel.includes('onion') || sel.includes('garlic')));
  };

  const handleFoodTypeChange = (v) => {
    setFoodType(v);
    setJainWarning(v === 'jain' && (ingredientsUsed.includes('onion') || ingredientsUsed.includes('garlic')));
  };

  const handleAutoLocate = () => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          setAddress(data.display_name || `Near ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        } catch {
          setAddress(`Location: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        }
        setLoading(false);
      },
      () => {
        alert('Location access denied');
        setLoading(false);
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (jainWarning) return;
    setLoading(true);

    const donationData = {
      foodType: foodType === 'bhandara' ? 'veg' : foodType,
      isBhandara: foodType === 'bhandara',
      foodCategory,
      quantity,
      description,
      ingredientsUsed,
      location: {
        lat: user?.location?.lat || 19.213768 + (Math.random() - 0.5) * 0.02,
        lng: user?.location?.lng || 72.865273 + (Math.random() - 0.5) * 0.02,
        address
      },
      assignedToNgo: method === 'ngo' ? selectedNgo : null,
      preparedAt: foodCategory !== 'packed' ? preparedAt : null,
      estimatedFreshFor: foodCategory !== 'packed' ? Number(estimatedFreshFor) : null,
      expiryTime: foodCategory === 'packed' ? packedExpiryDate : null
    };

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(donationData),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Server Error: ${res.status}`);
      }

      const data = await res.json();
      setSuccessMsg(data);
      if (setDonations) setDonations(prev => [data, ...prev]);
    } catch (err) {
      console.warn('Silent fallback to offline storage:', err.message);
      
      // Save offline silently
      const pending = JSON.parse(localStorage.getItem('pending_donations') || '[]');
      pending.push({ ...donationData, offlineId: Date.now() });
      localStorage.setItem('pending_donations', JSON.stringify(pending));

      // Show success anyway (User Request: shouldn't show it is stored offline)
      setSuccessMsg({ ...donationData, urgencyScore: 'pending (syncing)', ingredientsUsed });
      if (setDonations) setDonations(prev => [{ ...donationData, urgencyScore: 'pending (syncing)', _id: 'temp-' + Date.now() }, ...prev]);
    }
    setLoading(false);
  };

  if (successMsg) {
    return (
      <div className="glass-card p-8 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
          <CheckCircle size={32} className="text-green-400" />
        </div>
        <h3 className="text-2xl font-extrabold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans' }}>Donation Created! 🎉</h3>
        <p className="text-slate-500 text-sm">You're a hero. Thank you for reducing food waste.</p>
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-left space-y-2 text-sm shadow-sm">
          <p className="text-slate-700"><span className="text-slate-500">Urgency:</span> <span className="font-bold text-orange-600 uppercase">{successMsg.urgencyScore}</span></p>
          <p className="text-slate-700"><span className="text-slate-500">Contains:</span> {successMsg.ingredientsUsed?.length ? successMsg.ingredientsUsed.join(', ') : 'None marked'}</p>
        </div>
        <div className="flex gap-3">
          {successMsg.whatsappShareText && (
            <a href={`https://wa.me/?text=${encodeURIComponent(successMsg.whatsappShareText)}`}
              target="_blank" rel="noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm font-bold hover:bg-green-100 transition shadow-sm">
              <Share2 size={14} /> Share on WhatsApp
            </a>
          )}
          <button onClick={() => setSuccessMsg('')}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-sm font-bold hover:bg-slate-50 transition shadow-sm">
            <Plus size={14} /> Add Another
          </button>
        </div>
      </div>
    );
  }

  const previewTime = new Date(new Date(preparedAt).getTime() + Number(estimatedFreshFor) * 3600000);
  const formatPreviewTime = (dt) => {
    const now = new Date();
    const tomorrow = new Date(now); tomorrow.setDate(now.getDate() + 1);
    const isToday    = dt.toDateString() === now.toDateString();
    const isTomorrow = dt.toDateString() === tomorrow.toDateString();
    const timeStr = dt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
    if (isToday)    return `Today by ${timeStr}`;
    if (isTomorrow) return `Tomorrow by ${timeStr}`;
    return `${dt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} by ${timeStr}`;
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card p-8 space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900" style={{ fontFamily: 'Plus Jakarta Sans' }}>Donate Food</h2>
        <p className="text-slate-500 text-sm mt-1">Your surplus helps someone in need today.</p>
      </div>

      {targetRequest && (
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 flex items-start gap-4 shadow-sm animate-in fade-in slide-in-from-top-4">
          <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white shrink-0 shadow-sm">
            🤝
          </div>
          <div>
            <h4 className="text-sm font-bold text-orange-900">Fulfilling a Request</h4>
            <p className="text-xs text-orange-700 mt-1">
              You're donating for a seeker who needs food for <strong>{targetRequest.numberOfPeople} people</strong>. 
              {targetRequest.dietaryPref !== 'any' && ` Preference: ${targetRequest.dietaryPref}.`}
            </p>
          </div>
        </div>
      )}

      {/* Method: Map vs NGO */}
      <div>
        <label className="text-sm font-semibold text-slate-700 mb-3 block">Where to list?</label>
        <div className="grid grid-cols-2 gap-2">
          <button type="button" onClick={() => setMethod('map')}
            className={`py-2.5 px-3 rounded-xl border text-sm font-bold text-center transition-all ${method === 'map' ? 'bg-orange-50 border-orange-200 text-orange-600 shadow-sm' : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'}`}>
            List on Map
          </button>
          <button type="button" onClick={() => setMethod('ngo')}
            className={`py-2.5 px-3 rounded-xl border text-sm font-bold text-center transition-all ${method === 'ngo' ? 'bg-orange-50 border-orange-200 text-orange-600 shadow-sm' : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'}`}>
            Donate to NGO
          </button>
        </div>
      </div>

      {method === 'ngo' && (
        <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
          <label className="text-sm font-semibold text-purple-900 mb-2 block">Select NGO</label>
          <select 
            value={selectedNgo} 
            onChange={e => setSelectedNgo(e.target.value)}
            className="form-input bg-white border-purple-200 text-purple-900"
          >
            {ngos.map(n => <option key={n._id} value={n._id}>{n.name} ({n.phone})</option>)}
            {ngos.length === 0 && <option value="">No NGOs found...</option>}
          </select>
        </div>
      )}

      {/* Food Type */}
      <div>
        <label className="text-sm font-semibold text-slate-700 mb-3 block">Dietary Type</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {FOOD_TYPES.map(ft => (
            <button type="button" key={ft.value} onClick={() => handleFoodTypeChange(ft.value)}
              className={`py-2.5 px-3 rounded-xl border text-xs font-bold text-center transition-all ${foodType === ft.value ? 'bg-orange-50 border-orange-200 text-orange-600 shadow-sm' : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'}`}>
              {ft.label}
            </button>
          ))}
        </div>
      </div>

      {/* Food Category */}
      <div>
        <label className="text-sm font-semibold text-slate-700 mb-3 block">Food Category</label>
        <div className="grid grid-cols-3 gap-2">
          {FOOD_CATEGORIES.map(cat => (
            <button type="button" key={cat.value} onClick={() => setFoodCategory(cat.value)}
              className={`py-2.5 px-3 rounded-xl border text-sm font-bold text-center transition-all ${foodCategory === cat.value ? 'bg-orange-50 border-orange-200 text-orange-600 shadow-sm' : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'}`}>
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Quantity */}
      <div>
        <label className="text-sm font-semibold text-slate-700 mb-2 block flex items-center gap-1.5">
          <Utensils size={13} /> Quantity
        </label>
        <input required type="text" placeholder="e.g. 50 plates, 5 kgs, 10 boxes"
          value={quantity} onChange={e => setQuantity(e.target.value)} className="form-input" />
      </div>

      {/* Address */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
            <MapPin size={13} /> Pickup Address
          </label>
          <button type="button" onClick={handleAutoLocate}
            className="text-[10px] font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 px-2 py-1 rounded-lg bg-orange-50 hover:bg-orange-100 transition shadow-sm border border-orange-200/50">
            <Navigation size={10} /> Auto-Locate
          </button>
        </div>
        <input required type="text" placeholder="e.g. 12 MG Road, Pune"
          value={address} onChange={e => setAddress(e.target.value)} className="form-input" />
      </div>

      {/* Time */}
      <div className="space-y-4 border-t border-slate-200 pt-5">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5"><Clock size={13} /> Freshness Info</h3>

        {foodCategory === 'packed' ? (
          <div>
            <label className="text-xs text-slate-500 mb-2 block">Expiry Date & Time</label>
            <input required type="datetime-local" value={packedExpiryDate}
              onChange={e => setPackedExpiryDate(e.target.value)}
              className="form-input" />
            <div className="mt-2 px-3 py-2 rounded-xl bg-orange-50 border border-orange-100 text-orange-700 text-xs shadow-sm">
              Valid until <strong>{new Date(packedExpiryDate).toLocaleString()}</strong>
            </div>
          </div>
        ) : (
          <>
            <div>
              <label className="text-xs text-slate-500 mb-2 block">Prepared at</label>
              <input required type="datetime-local" value={preparedAt}
                onChange={e => setPreparedAt(e.target.value)} min={new Date().toISOString().slice(0, 16)}
                className="form-input" />
            </div>

            <div>
              <label className="text-xs text-slate-500 mb-2 block">Stays fresh for — <span className="text-orange-600 font-bold">{estimatedFreshFor} hours</span></label>
              <input type="range" min="1" max="72" value={estimatedFreshFor}
                onChange={e => setEstimatedFreshFor(e.target.value)} className="w-full accent-orange-500" />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>Cooked rice = 3–4 hrs</span>
                <span>Baked = 24–72 hrs</span>
              </div>
              <div className="mt-2 px-3 py-2 rounded-xl bg-orange-50 border border-orange-100 text-orange-700 text-xs shadow-sm flex items-center gap-2">
                <span>🕐</span>
                <span>Good <strong>{formatPreviewTime(previewTime)}</strong></span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="text-sm font-semibold text-slate-700 mb-2 block">Describe the food</label>
        <textarea required minLength={10} rows={3}
          placeholder="e.g. Dal makhani, jeera rice… cooked fresh this morning."
          value={description} onChange={e => setDescription(e.target.value)}
          className="form-input resize-none" />
        <div className="text-xs text-slate-400 mt-1">{description.length}/10 chars min</div>
      </div>

      {/* Allergens */}
      <div>
        <label className="text-sm font-semibold text-slate-700 mb-1 block">Ingredients used (tick all that apply)</label>
        <p className="text-xs text-slate-500 mb-3">Helps people with allergies find safe food</p>
        <AllergenPicker mode="donor" selected={ingredientsUsed} onChange={handleAllergenChange} />
      </div>

      {jainWarning && (
        <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-sm">
          ⚠️ You marked this as Jain but ticked Onion/Garlic. Jain food must exclude these.
        </div>
      )}

      <button disabled={jainWarning || loading} type="submit"
        className="btn-primary w-full py-3.5 rounded-xl text-white font-bold text-sm disabled:opacity-50 transition-all">
        {loading ? 'Submitting…' : '🍲 Submit Donation'}
      </button>
    </form>
  );
}
