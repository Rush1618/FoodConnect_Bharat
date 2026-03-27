import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import clsx from 'clsx';
import { AlertCircle, Clock, MapPin } from 'lucide-react';

// Fix Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom pin with warning overlay if needed
const createCustomIcon = (color, hasWarning) => {
  return L.divIcon({
    className: 'custom-icon',
    html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3); position: relative;">
      ${hasWarning ? `<div style="position:absolute; top:-6px; right:-6px; background:red; border-radius:50%; width:14px; height:14px; color:white; font-size:10px; font-weight:bold; display:flex; align-items:center; justify-content:center;">!</div>` : ''}
    </div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

export default function Map({ donations, center = [18.5204, 73.8567] }) {
  const getPinColor = (foodType, urgencyScore) => {
    if (urgencyScore === 'expired') return '#6b7280'; // gray
    return foodType === 'veg' ? '#22c55e' : foodType === 'jain' ? '#eab308' : '#ef4444';
  };

  const getUrgencyBadge = (score, timeStr) => {
    const styles = {
      critical: 'bg-red-100 text-red-800 border-red-200',
      moderate: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      stable: 'bg-green-100 text-green-800 border-green-200',
      expired: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return (
      <span className={clsx("px-2 py-0.5 rounded-full text-xs font-bold border flex items-center gap-1", styles[score] || styles.stable)}>
        <Clock size={12} /> {timeStr || score}
      </span>
    );
  };

  return (
    <div className="h-[500px] w-full rounded-2xl overflow-hidden shadow-lg border border-gray-200 relative z-0">
      <MapContainer center={center} zoom={13} className="h-full w-full">
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
        />
        
        {donations.map((donation) => {
          const hasWarning = donation.allergenWarnings && donation.allergenWarnings.length > 0;
          return (
            <Marker 
              key={donation._id} 
              position={[donation.location.lat, donation.location.lng]}
              icon={createCustomIcon(getPinColor(donation.foodType, donation.urgencyScore), hasWarning)}
            >
              <Popup className="donation-popup">
                <div className="p-1 space-y-3 min-w-[200px]">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-lg uppercase flex items-center gap-1 text-gray-800">
                      {donation.foodType}
                      {donation.isBhandara && <span className="bg-purple-100 text-purple-800 text-[10px] px-1.5 py-0.5 rounded ml-2">Bhandara</span>}
                    </span>
                    {getUrgencyBadge(donation.urgencyScore, donation.timeLeftString)}
                  </div>

                  <p className="text-sm font-medium">{donation.quantity}</p>
                  
                  {hasWarning && (
                    <div className="bg-red-50 text-red-700 p-2 rounded text-xs border border-red-100 flex items-start gap-1">
                      <AlertCircle size={14} className="shrink-0 mt-0.5" />
                      <div>
                        <strong>Allergy Warning:</strong> Contains {donation.allergenWarnings.join(', ')}
                      </div>
                    </div>
                  )}

                  <p className="text-gray-600 text-sm flex items-start gap-1">
                    <MapPin size={14} className="shrink-0 mt-0.5 text-gray-400" />
                    {donation.location.address}
                  </p>

                  <div className="pt-2 border-t mt-2">
                    <div className="text-xs text-gray-500 mb-1">Donor Description</div>
                    <p className="text-sm text-gray-800 italic">"{donation.description}"</p>
                  </div>

                  <button 
                    disabled={hasWarning || donation.urgencyScore === 'expired'} 
                    className={clsx(
                      "w-full py-2 rounded-lg text-sm font-bold transition-colors mt-2",
                      (hasWarning || donation.urgencyScore === 'expired')
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed" 
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    )}
                  >
                    {hasWarning ? 'Conflict strictly matched' : donation.urgencyScore === 'expired' ? 'Expired' : 'Claim Food'}
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
