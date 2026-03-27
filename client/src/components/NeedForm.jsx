import React, { useState, useEffect } from 'react';
import AllergenPicker from './AllergenPicker';
import { useAuth } from '../context/AuthContext';

export default function NeedForm({ onClose }) {
  const { user, token } = useAuth();
  
  const [dietaryPref, setDietaryPref] = useState('any');
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSOS, setIsSOS] = useState(false);
  
  // Allergen system
  const [allergiesToAvoid, setAllergiesToAvoid] = useState([]);
  const [allergyNotes, setAllergyNotes] = useState('');
  const [saveProfile, setSaveProfile] = useState(true);
  const [profileLoaded, setProfileLoaded] = useState(false);

  useEffect(() => {
    if (user && user.allergyProfile && user.allergyProfile.length > 0) {
      setAllergiesToAvoid(user.allergyProfile);
      setProfileLoaded(true);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const location = { lat: 18.5204 + Math.random()*0.1, lng: 73.8567 + Math.random()*0.1 };
    
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      // 1. Submit the request
      const response = await fetch('http://localhost:5000/api/requests', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          dietaryPref,
          numberOfPeople,
          isAnonymous,
          isSOS,
          allergiesToAvoid,
          allergyNotes,
          location
        })
      });

      if (!response.ok) throw new Error('Failed to create request');

      // 2. Update user profile if checked
      if (user && saveProfile) {
        await fetch('http://localhost:5000/api/users/allergy-profile', {
          method: 'PATCH',
          headers,
          body: JSON.stringify({ allergyProfile: allergiesToAvoid, allergyNotes })
        });
      }

      alert('Request sent to volunteers in area!');
      if (onClose) onClose();

    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow border space-y-6 text-gray-800">
      <h2 className="text-2xl font-bold">{isSOS ? '🚨 SOS Emergency Request' : 'Find Food'}</h2>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="font-semibold block">Dietary Preference</label>
          <select value={dietaryPref} onChange={e => setDietaryPref(e.target.value)} className="w-full border p-2 rounded-lg">
            <option value="any">Any (Don't mind)</option>
            <option value="veg">Vegetarian</option>
            <option value="jain">Jain</option>
            <option value="nonveg">Non-Vegetarian</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="font-semibold block">For how many people?</label>
          <input required type="number" min="1" value={numberOfPeople} onChange={e => setNumberOfPeople(e.target.value)} className="w-full border p-2 rounded-lg" />
        </div>
      </div>

      <div className="space-y-4 border-t pt-4">
        <h3 className="text-lg font-bold">Your Dietary Restrictions</h3>
        
        {profileLoaded && (
          <div className="bg-blue-50 text-blue-800 border-l-4 border-blue-500 p-3 rounded-r-lg text-sm mt-2">
            💡 We loaded your saved allergy profile. You can change it for this request below.
          </div>
        )}

        <div className="space-y-2">
          <label className="font-semibold block">Any allergies or things you want to avoid?</label>
          <p className="text-xs text-gray-500">We will only show you food that does not contain these.</p>
          <AllergenPicker mode="needer" selected={allergiesToAvoid} onChange={setAllergiesToAvoid} />
        </div>
        
        <div className="space-y-2">
          <label className="font-semibold block text-sm">Anything else? (optional)</label>
          <input type="text" placeholder="e.g. I can't eat very spicy food" value={allergyNotes} onChange={e => setAllergyNotes(e.target.value)} className="w-full border p-2 rounded-lg text-sm" />
        </div>

        {user && (
          <label className="flex items-center gap-2 text-sm mt-2 cursor-pointer font-medium text-gray-700">
            <input type="checkbox" checked={saveProfile} onChange={e => setSaveProfile(e.target.checked)} className="w-4 h-4 text-blue-600 rounded" />
            Remember my allergy profile for next time
          </label>
        )}
      </div>

      <div className="space-y-4 border-t pt-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={isAnonymous} onChange={e => setIsAnonymous(e.target.checked)} className="w-5 h-5" />
          Keep my request anonymous
        </label>
      </div>

      <button type="submit" className={`w-full text-white font-bold py-3 rounded-lg transition ${isSOS ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
        {isSOS ? 'Broadcast SOS' : 'Find Matching Food'}
      </button>
    </form>
  );
}
