import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import AllergenPicker from '../components/AllergenPicker';

export default function Profile() {
  const { user, token, updateUser, logout } = useAuth();
  const [profile, setProfile] = useState(user?.allergyProfile || []);
  const [saving, setSaving] = useState(false);

  if (!user) return <div className="p-8 text-center">Please login first</div>;

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('http://localhost:5000/api/users/allergy-profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ allergyProfile: profile })
      });
      if (!response.ok) throw new Error('Failed to update');
      
      const data = await response.json();
      updateUser({ allergyProfile: data.allergyProfile });
      alert('Profile updated successfully!');
    } catch (err) {
      alert(err.message);
    }
    setSaving(false);
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow border space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-2xl font-bold">My Profile</h2>
        <button onClick={logout} className="text-red-500 font-medium hover:underline">Log Out</button>
      </div>

      <div>
        <h3 className="text-lg font-bold mb-2">Personal Details</h3>
        <p className="text-gray-700"><strong>Name:</strong> {user.name}</p>
        <p className="text-gray-700"><strong>Role:</strong> <span className="capitalize">{user.role}</span></p>
      </div>

      <div className="border-t pt-4 space-y-4">
        <h3 className="text-lg font-bold">Dietary Profile</h3>
        <p className="text-sm text-gray-500 mb-2">Configure this once, and we'll apply it to all your requests.</p>
        
        <AllergenPicker 
          mode={user.role === 'donor' ? 'donor' : 'needer'} 
          selected={profile} 
          onChange={setProfile} 
        />
        
        <button 
          onClick={handleSave} 
          disabled={saving}
          className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </div>
    </div>
  );
}
