import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap, useMapEvents } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import clsx from 'clsx';
import { io } from 'socket.io-client';
import { 
  AlertCircle, Clock, MapPin, Navigation, RefreshCw, 
  Bike, Utensils, Heart, Activity, Flame, ShieldCheck, 
  PlusCircle, XCircle 
} from 'lucide-react';
import { localStorageBridge } from '../utils/localStorageBridge';

// Fix Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom coloured donation pin (Teardrop)
const createDonationIcon = (color, hasWarning, isBhandara) => L.divIcon({
  className: 'custom-icon',
  html: `
    <div style="position:relative; width:40px; height:48px; display:flex; justify-content:center;">
      <svg viewBox="0 0 32 40" style="width:32px;height:40px;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.4))">
        <path d="M16 0C7.163 0 0 7.163 0 16c0 10 16 24 16 24S32 26 32 16C32 7.163 24.837 0 16 0z" fill="${color}" stroke="${isBhandara ? '#facc15' : 'white'}" stroke-width="${isBhandara ? '2' : '1'}"/>
        <circle cx="16" cy="16" r="7" fill="rgba(255,255,255,0.3)"/>
        <circle cx="16" cy="16" r="4" fill="white"/>
      </svg>
      ${isBhandara ? '<div style="position:absolute;top:6px;left:50%;transform:translateX(-50%);color:#facc15;font-size:12px;text-shadow:0 0 4px rgba(0,0,0,0.5);">★</div>' : ''}
      ${hasWarning ? '<div style="position:absolute;top:-4px;right:0px;background:#ef4444;border-radius:50%;width:16px;height:16px;color:white;font-size:10px;font-weight:900;display:flex;align-items:center;justify-content:center;border:2px solid white;box-shadow:0 2px 4px rgba(239,68,68,0.3); animation: bounce 1s infinite;">!</div>' : ''}
    </div>
  `,
  iconSize: [40, 48],
  iconAnchor: [20, 48],
  popupAnchor: [0, -48],
});

// Custom coloured request pin (SQUARE)
const createRequestIcon = (isSOS) => L.divIcon({
  className: 'custom-icon',
  html: `
    <div style="position:relative; width:36px; height:36px; display:flex; align-items:center; justify-content:center;">
      ${isSOS ? '<div style="position:absolute; width:100%; height:100%; background:rgba(239,68,68,0.2); border-radius:10px; animation: pulse 2s infinite;"></div>' : ''}
      <svg viewBox="0 0 32 32" style="width:32px;height:32px;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.4))">
        <rect x="2" y="2" width="28" height="28" rx="8" fill="${isSOS ? '#ef4444' : '#0ea5e9'}" stroke="white" stroke-width="2"/>
        <path d="M16 8v10M16 22h.01" stroke="white" stroke-width="3" stroke-linecap="round" />
      </svg>
      ${isSOS ? '<div style="position:absolute;top:-6px;background:#ef4444;color:white;font-size:8px;font-weight:900;padding:2px 4px;border-radius:4px;border:1px solid white;letter-spacing:1px;box-shadow:0 2px 4px rgba(0,0,0,0.2);">SOS</div>' : ''}
    </div>
  `,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
  popupAnchor: [0, -18],
});

// Hunger Spot Pin (FOR DEMO MARKING)
const createHungerIcon = (status) => L.divIcon({
  className: 'custom-icon',
  html: `
    <div style="position:relative; width:32px; height:32px; display:flex; align-items:center; justify-content:center;">
      ${status === 'pending' ? '<div style="position:absolute; width:100%; height:100%; border:3px solid #f97316; border-radius:50%; border-style:dashed; animation: rotate 3s linear infinite;"></div>' : ''}
      <div style="width:24px; height:24px; background:${status === 'confirmed' ? '#ef4444' : '#f97316'}; border-radius:50%; border:2.5px solid white; box-shadow:0 2px 8px rgba(0,0,0,0.3); display:flex; align-items:center; justify-content:center; color:white;">
        ${status === 'confirmed' ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>' : '!'}
      </div>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
});

// Component to handle map clicks for marking areas
function MapClickHandler({ active, onMark }) {
  useMapEvents({
    click(e) {
      if (active) onMark([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

// Component to fly map to a position
function FlyTo({ pos }) {
  const map = useMap();
  useEffect(() => {
    if (pos) map.flyTo(pos, 15, { duration: 1.4 });
  }, [pos]);
  return null;
}

const FOOD_COLORS = {
  veg: '#22c55e',
  jain: '#eab308',
  nonveg: '#ef4444',
  any: '#8b5cf6',
};

const URGENCY_STYLES = {
  critical: 'bg-red-500 text-white shadow-lg shadow-red-500/20 border-red-600',
  moderate: 'bg-amber-500 text-white shadow-lg shadow-amber-500/20 border-amber-600',
  stable: 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 border-emerald-600',
  expired: 'bg-slate-400 text-white border-slate-500 opacity-50',
};

export default function Map({ donations = [], requests = [], center = [19.213768, 72.865273], mode = 'all' }) {
  const { user } = useAuth();
  const userRole = user?.role || 'needer';
  const navigate = useNavigate();
  const [livePos, setLivePos] = useState(null);
  const [showBulkOnly, setShowBulkOnly] = useState(false);
  const [showUnverifiedOnly, setShowUnverifiedOnly] = useState(false);
  const [flyTarget, setFlyTarget] = useState(null);
  const [locating, setLocating] = useState(false);
  const [locError, setLocError] = useState('');
  const [claiming, setClaiming] = useState(null);
  const [showHeatmap, setShowHeatmap] = useState(userRole === 'ngo' || userRole === 'donor');
  const [deliveryBikes, setDeliveryBikes] = useState({});
  
  // Custom Hunger Spots State
  const [hungerSpots, setHungerSpots] = useState([]);
  const [isMarking, setIsMarking] = useState(false);

  // Sync with LocalStorage Bridge
  useEffect(() => {
    setHungerSpots(localStorageBridge.getHungerSpots());
  }, []);

  // Webhook Session for Tracking
  useEffect(() => {
    const socket = io('http://localhost:5000');
    socket.on('location_update', (data) => {
      setDeliveryBikes(prev => ({
        ...prev,
        [data.id]: { pos: [data.lat, data.lng], name: data.userName || 'Biker Hero', lastSeen: new Date() }
      }));
    });
    return () => socket.disconnect();
  }, []);

  const handleMarkHungerArea = (coords) => {
    const spot = localStorageBridge.addHungerSpot({
      lat: coords[0],
      lng: coords[1],
      reportedBy: user?.name || 'Local Donor'
    });
    setHungerSpots(prev => [...prev, spot]);
    setIsMarking(false);
    alert('Hunger area marked for verification. Our volunteers are on the way!');
  };

  const handleConfirmSpot = (id) => {
    localStorageBridge.confirmHungerSpot(id, user?.id);
    setHungerSpots(localStorageBridge.getHungerSpots());
    alert('Hunger area verified and confirmed. It is now part of the global hunger heatmap.');
  };

  const locateMe = () => {
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = [pos.coords.latitude, pos.coords.longitude];
        setLivePos(coords);
        setFlyTarget(coords);
        setLocating(false);
      },
      () => { setLocError('Location access denied'); setLocating(false); },
      { enableHighAccuracy: true }
    );
  };

  useEffect(() => { locateMe(); }, []);

  const getPinColor = (d) => d.isBhandara ? '#a855f7' : (FOOD_COLORS[d.foodType] || FOOD_COLORS.any);

  return (
    <div className="relative h-[480px] w-full rounded-[32px] overflow-hidden border border-white/10 shadow-3xl bg-slate-100">
      <MapContainer
        center={livePos || center}
        zoom={14}
        className="h-full w-full"
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; CARTO'
        />

        {flyTarget && <FlyTo pos={flyTarget} />}
        <MapClickHandler active={isMarking} onMark={handleMarkHungerArea} />

        {/* Live location marker */}
        {livePos && (
          <Marker position={livePos} icon={L.divIcon({
            className:'',
            html: '<div class="w-4 h-4 rounded-full bg-blue-600 border-2 border-white shadow-lg animate-pulse"></div>',
            iconSize:[16,16]
          })} />
        )}

        {/* Layer 1: CONFIRMED HEATMAP (Visible to Donor & NGO) */}
        {showHeatmap && (userRole === 'ngo' || userRole === 'donor') && hungerSpots
          .filter(s => s.status === 'confirmed')
          .map(s => (
            <Circle 
              key={`heat-${s.id}`}
              center={[s.lat, s.lng]} 
              radius={350} 
              pathOptions={{ 
                color: '#ef4444', 
                fillColor: '#ef4444', 
                fillOpacity: 0.22, 
                weight: 0,
                className: 'animate-pulse' 
              }} 
            />
          ))}

        {/* Layer 2: PENDING MARKERS (Visible to All or restricted as needed) */}
        {hungerSpots.filter(s => s.status === 'pending').map(s => (
          <Marker key={s.id} position={[s.lat, s.lng]} icon={createHungerIcon('pending')}>
            <Popup className="donation-popup">
              <div className="text-center p-2">
                <div className="flex items-center justify-center gap-1.5 text-orange-600 font-black text-xs uppercase mb-2">
                  <Activity size={14} className="animate-spin" /> Pending Verification
                </div>
                <p className="text-[11px] font-medium text-slate-500 mb-3 leading-relaxed">
                  High-hunger area reported by {s.reportedBy}. Awaiting volunteer check.
                </p>
                {userRole === 'volunteer' && (
                  <button 
                    onClick={() => handleConfirmSpot(s.id)}
                    className="w-full py-2 rounded-lg bg-emerald-600 text-white font-bold text-[10px] uppercase flex items-center justify-center gap-1.5 hover:bg-emerald-700 transition-colors"
                  >
                    <ShieldCheck size={12} /> Confirm Hunger Spot
                  </button>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Layer 3: DONATIONS (Food) - Hidden for Donor */}
        {userRole !== 'donor' && donations
          .filter(d => {
            if (userRole === 'needer') return d.status === 'available';
            if (userRole === 'volunteer' && showUnverifiedOnly) return !d.verifiedByVolunteer;
            if (userRole === 'ngo' && showBulkOnly && parseInt(d.quantity) < 20) return false;
            return true;
          })
          .map((d) => (
             <Marker
              key={d._id}
              position={[d.location.lat, d.location.lng]}
              icon={createDonationIcon(getPinColor(d), d.allergenWarnings?.length > 0, d.isBhandara)}
            >
              <Popup className="donation-popup" minWidth={260}>
                 <div className="space-y-3.5 max-h-[360px] overflow-y-auto pr-1">
                   <div className="flex items-start justify-between gap-3">
                     <div>
                       <h4 className="text-lg font-black text-slate-900 leading-tight capitalize">{d.foodType}</h4>
                       <p className="text-sm font-bold text-slate-500 mt-1 flex items-center gap-1"><Utensils size={12} /> {d.quantity}</p>
                     </div>
                     <div className={clsx('px-2 py-1 rounded-xl text-[10px] font-black border flex items-center gap-1.5', URGENCY_STYLES[d.urgencyScore] || URGENCY_STYLES.stable)}>
                       <Clock size={12} /> {d.timeLeftString || d.urgencyScore}
                     </div>
                   </div>
                   <p className="text-xs text-slate-500 font-semibold bg-slate-50 p-2.5 rounded-xl border border-slate-100">{d.location.address}</p>
                   {userRole === 'needer' && (
                     <button onClick={() => alert('Request sent!')} className="w-full py-3.5 rounded-2xl bg-orange-500 text-white text-xs font-black uppercase hover:bg-orange-600 transition-all shadow-lg active:scale-95">
                       Claim Food Now
                     </button>
                   )}
                 </div>
              </Popup>
            </Marker>
          ))}

        {/* Layer 4: REQUESTS (Hunger) - Visible to Donor, Volunteer, NGO */}
        {(userRole === 'donor' || userRole === 'volunteer' || userRole === 'ngo') && requests
          .map((r) => (
            <Marker key={r._id} position={[r.location.lat, r.location.lng]} icon={createRequestIcon(r.isSOS)}>
              <Popup className="donation-popup">
                  <div className="p-2 space-y-2">
                    <h4 className="text-sm font-black text-blue-800">{r.isSOS ? '🚨 SOS Emergency' : '🤝 Hunger Need'}</h4>
                    <p className="text-[11px] font-medium text-slate-500">Feeding {r.numberOfPeople} people</p>
                    <button onClick={() => navigate('/donate')} className="w-full py-2 rounded-lg bg-orange-500 text-white font-bold text-[10px] uppercase shadow-sm">
                      Donate Now
                    </button>
                  </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>

      {/* Floating Controls */}
      <div className="absolute top-4 right-4 z-[999] flex flex-col gap-2">
         {['donor', 'ngo', 'volunteer'].includes(userRole) && (
           <button 
             onClick={() => setIsMarking(!isMarking)}
             className={clsx(
               "flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-[11px] uppercase tracking-wider shadow-2xl transition-all border-2",
               isMarking ? "bg-red-600 text-white border-white animate-pulse" : "bg-white text-orange-600 border-orange-500 hover:scale-105"
             )}
           >
             {isMarking ? <><XCircle size={16} /> Cancel Marking</> : <><PlusCircle size={16} /> Mark Hunger Spot</>}
           </button>
         )}
      </div>

      <div className="absolute bottom-6 left-4 z-[999] flex flex-col gap-2">
        {(userRole === 'ngo' || userRole === 'donor') && (
           <button
             onClick={() => setShowHeatmap(!showHeatmap)}
             className={clsx(
               "flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs shadow-2xl transition-all border",
               showHeatmap ? "bg-red-600 text-white border-red-400" : "bg-white text-red-600 border-red-200"
             )}
           >
             <Flame size={15} /> {showHeatmap ? 'Heatmap Active' : 'Show Hunger Heatmap'}
           </button>
        )}
        <button onClick={locateMe} className="bg-blue-600 text-white p-3 rounded-2xl shadow-xl hover:bg-blue-700 transition-all">
          <Navigation size={20} />
        </button>
      </div>

      {/* Role-Specific Legend (HIDDEN FOR DONOR) */}
      {userRole !== 'donor' && (
        <div className="absolute top-4 left-4 z-[999] glass-card p-3 flex flex-col gap-1.5 text-xs font-black shadow-lg bg-white/80 backdrop-blur rounded-2xl border border-white/40">
           <LegendItem color="#ef4444" label="🚨 SOS / Emergency" shape="square" />
           <LegendItem color="#0ea5e9" label="🤝 Request" shape="square" />
           <LegendItem color="#22c55e" label="🍲 Available Food" />
           <LegendItem color="#f97316" label="! Hunger Area" />
        </div>
      )}

      {isMarking && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1000] pointer-events-none flex flex-col items-center gap-4">
           <div className="w-12 h-12 border-4 border-orange-500 border-dashed rounded-full animate-spin"></div>
           <div className="bg-slate-900 text-white px-4 py-2 rounded-full font-black text-xs uppercase tracking-widest shadow-2xl">
             Click on map to drop pin
           </div>
        </div>
      )}
    </div>
  );
}

function LegendItem({ color, label, shape }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={clsx("w-2.5 h-2.5 shrink-0 border border-white/20", shape === 'square' ? 'rounded-sm' : 'rounded-full')}
        style={{ background: color }}
      />
      <span className="text-slate-700 font-black text-[10px] uppercase tracking-tighter">{label}</span>
    </div>
  );
}
