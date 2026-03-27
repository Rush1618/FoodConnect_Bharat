import React, { useState } from 'react';
import AllergenPicker from './AllergenPicker';
import { useAuth } from '../context/AuthContext';

export default function DonationForm({ setDonations }) {
  const { user } = useAuth();
  
  const [foodType, setFoodType] = useState('veg');
  const [quantity, setQuantity] = useState('');
  const [description, setDescription] = useState('');
  
  // New time fields
  const [preparedAt, setPreparedAt] = useState(() => {
    const now = new Date();
    // HTML datetime-local works best without the timezone suffix, format like "YYYY-MM-DDTHH:mm"
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  });
  const [estimatedFreshFor, setEstimatedFreshFor] = useState(4);
  
  // Allergen Picker logic
  const [ingredientsUsed, setIngredientsUsed] = useState([]);
  
  const [address, setAddress] = useState('');
  const [jainWarning, setJainWarning] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleAllergenChange = (newSelected) => {
    setIngredientsUsed(newSelected);
    if (foodType === 'jain' && (newSelected.includes('onion') || newSelected.includes('garlic'))) {
      setJainWarning(true);
    } else {
      setJainWarning(false);
    }
  };

  const handleFoodTypeChange = (e) => {
    const newType = e.target.value;
    setFoodType(newType);
    if (newType === 'jain' && (ingredientsUsed.includes('onion') || ingredientsUsed.includes('garlic'))) {
      setJainWarning(true);
    } else {
      setJainWarning(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (jainWarning) return;
    
    // Using a fake location for the sake of presentation
    const location = { lat: 18.5204 + Math.random()*0.1, lng: 73.8567 + Math.random()*0.1, address };
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/donations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          foodType,
          quantity,
          description,
          ingredientsUsed,
          location,
          preparedAt,
          estimatedFreshFor
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create donation');
      }

      const data = await response.json();
      setSuccessMsg(data); // Pass full data to show success card
      
      // Update parent list
      setDonations(prev => [data, ...prev]);

    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  if (successMsg) {
    return (
      <div className="bg-green-50 border border-green-200 text-green-800 p-6 rounded-xl shadow-sm space-y-4">
        <h3 className="text-xl font-bold flex items-center gap-2">✅ Donation Created!</h3>
        <ul className="space-y-2 text-sm bg-white p-4 rounded-lg">
          <li><strong>Urgency:</strong> {successMsg.urgencyScore.toUpperCase()}</li>
          <li><strong>Contains:</strong> {successMsg.ingredientsUsed.length ? successMsg.ingredientsUsed.join(', ') : 'None marked'}</li>
        </ul>
        <a 
          href={`https://wa.me/?text=${encodeURIComponent(successMsg.whatsappShareText)}`}
          target="_blank" rel="noreferrer"
          className="inline-block bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700"
        >
          Share on WhatsApp
        </a>
        <br/>
        <button onClick={() => setSuccessMsg('')} className="text-sm underline text-gray-500">Add another donation</button>
      </div>
    );
  }

  // Calculate live preview
  const previewTime = new Date(new Date(preparedAt).getTime() + estimatedFreshFor * 3600000);

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-lg border space-y-6 text-gray-800 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold">Donate Food</h2>

      <div className="space-y-2">
        <label className="font-semibold block">Food Type</label>
        <select value={foodType} onChange={handleFoodTypeChange} className="w-full border p-2 rounded-lg">
          <option value="veg">Vegetarian</option>
          <option value="jain">Jain (No onion/garlic)</option>
          <option value="nonveg">Non-Vegetarian</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="font-semibold block">Quantity (e.g. 50 plates, 5 kgs)</label>
        <input required type="text" value={quantity} onChange={e => setQuantity(e.target.value)} className="w-full border p-2 rounded-lg" />
      </div>

      <div className="space-y-2">
        <label className="font-semibold block">Address</label>
        <input required type="text" value={address} onChange={e => setAddress(e.target.value)} className="w-full border p-2 rounded-lg" />
      </div>

      <div className="col-span-1 border-t pt-4 space-y-4">
        <h3 className="text-lg font-bold">Food Details & Ingredients</h3>

        <div className="space-y-2">
          <label className="font-semibold block">Prepared at</label>
          <input required type="datetime-local" value={preparedAt} onChange={e => setPreparedAt(e.target.value)} max={new Date().toISOString().slice(0, 16)} className="w-full border p-2 rounded-lg bg-gray-50" />
        </div>

        <div className="space-y-2">
          <label className="font-semibold block">Estimated fresh for (your guess) <span className="font-normal text-gray-500">— {estimatedFreshFor} hours</span></label>
          <input type="range" min="1" max="72" value={estimatedFreshFor} onChange={e => setEstimatedFreshFor(e.target.value)} className="w-full accent-amber-500" />
          <div className="text-xs text-gray-500 flex justify-between">
             <span>Cooked rice = 3–4 hrs</span>
             <span>Packaged = 24–72 hrs</span>
          </div>
          <div className="bg-blue-50 text-blue-800 text-sm px-3 py-2 rounded-lg border border-blue-100">
            Preview: You think this is good until <strong>{previewTime.toLocaleString()}</strong>
          </div>
        </div>

        <div className="space-y-2">
          <label className="font-semibold block">Describe the food</label>
          <textarea required minLength="10" placeholder="e.g. Dal makhani, jeera rice... Cooked fresh this morning." value={description} onChange={e => setDescription(e.target.value)} rows="3" className="w-full border p-2 rounded-lg"></textarea>
          <div className="text-xs text-gray-500">{description.length}/10 chars minimum</div>
        </div>

        <div className="space-y-2">
          <label className="font-semibold block">Which of these did you use? (tick all that apply)</label>
          <p className="text-xs text-gray-500 mb-2">Helps people with allergies find safe food</p>
          <AllergenPicker mode="donor" selected={ingredientsUsed} onChange={handleAllergenChange} />
        </div>

        {jainWarning && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm font-semibold shadow-sm">
            ⚠️ You marked this as Jain but ticked Onion/Garlic. Please check — Jain food must exclude these.
          </div>
        )}
      </div>

      <button disabled={jainWarning} type="submit" className="w-full bg-amber-600 text-white font-bold py-3 rounded-lg hover:bg-amber-700 transition disabled:opacity-50">
        Submit Donation
      </button>
    </form>
  );
}
