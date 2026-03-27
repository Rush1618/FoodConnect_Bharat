import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AllergenPicker from './AllergenPicker';

export default function Register() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: '',
    role: 'donor',
    dietaryPref: 'any',
    allergyProfile: [],
    allergyNotes: ''
  });
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleNext = (e) => {
    e.preventDefault();
    if (step === 1 && formData.role !== 'needer') {
      handleSubmit(); // Skip allergies if not needer, though donor might want it too. Let's do it for all.
    }
    setStep(step + 1);
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      
      login(data.user, data.token);
      navigate('/');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow border">
      <h2 className="text-2xl font-bold mb-6">Join FoodConnect Bharat</h2>
      
      <form onSubmit={step === 1 ? handleNext : handleSubmit} className="space-y-4">
        {step === 1 && (
          <>
            <input required type="text" placeholder="Full Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border p-2 rounded" />
            <input required type="tel" placeholder="Phone Number" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full border p-2 rounded" />
            <input required type="password" placeholder="Password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full border p-2 rounded" />
            
            <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full border p-2 rounded">
              <option value="donor">I am a Donor</option>
              <option value="needer">I am looking for food</option>
              <option value="volunteer">I am a Volunteer</option>
              <option value="ngo">I represent an NGO</option>
            </select>
            
            <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded font-bold">Next</button>
          </>
        )}

        {step === 2 && (
          <>
            <p className="font-semibold text-gray-700">Set up your Dietary Profile</p>
            <p className="text-sm text-gray-500 mb-4">This helps us match you with safe food automatically.</p>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Any allergies or ingredients to avoid?</label>
              <AllergenPicker 
                mode={formData.role === 'donor' ? 'donor' : 'needer'} 
                selected={formData.allergyProfile} 
                onChange={(profile) => setFormData({...formData, allergyProfile: profile})} 
              />
            </div>

            <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded font-bold mt-4">Complete Registration</button>
            <button type="button" onClick={handleSubmit} className="w-full text-blue-600 p-2 text-sm mt-2">Skip for now</button>
          </>
        )}
      </form>
    </div>
  );
}
