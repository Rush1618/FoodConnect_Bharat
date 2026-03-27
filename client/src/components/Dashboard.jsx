import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import RoleSelect from './RoleSelect';
import Map from './Map';
import DonationForm from './DonationForm';
import NeedForm from './NeedForm';
import SOSButton from './SOSButton';
import Leaderboard from './Leaderboard';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();
  const [role, setRole] = useState(user?.role || null);
  const [activeTab, setActiveTab] = useState('map');
  const [donations, setDonations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Re-fetch when role or user changes
    fetchDonations();
  }, [user]);

  const fetchDonations = async () => {
    let url = 'http://localhost:5000/api/donations';
    
    // Add strict filtering if it's the needer view using their saved profile
    if (user?.role === 'needer') {
      const params = new URLSearchParams();
      if (user.dietaryPref) params.append('dietPref', user.dietaryPref);
      if (user.allergyProfile?.length) params.append('avoidAllergens', user.allergyProfile.join(','));
      url += `?${params.toString()}`;
    }

    try {
      const response = await fetch(url);
      const data = await response.json();
      setDonations(data);
    } catch (err) {
      console.error('Error fetching donations', err);
    }
  };

  if (!user && !role) return <RoleSelect onSelect={(id) => {
    if (id === 'needer') setRole('needer'); // Needs can proceed anonymously
    else navigate('/register'); // Donors must register
  }} />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold font-sans tracking-tight text-gray-900">
            Welcome, {user ? user.name : 'Guest'}
          </h1>
          <p className="text-gray-600 mt-1 flex items-center gap-2">
            You are currently in <span className="px-2 py-0.5 bg-blue-100 text-blue-800 font-bold rounded text-xs uppercase tracking-widest">{role || user?.role}</span> mode
          </p>
        </div>
        
        <div className="flex gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <button 
            onClick={() => setActiveTab('map')} 
            className={`px-4 py-2 rounded-lg font-bold transition-all whitespace-nowrap ${activeTab === 'map' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            Live Map
          </button>
          
          {(role === 'donor' || user?.role === 'donor') && (
            <button 
              onClick={() => setActiveTab('donate')} 
              className={`px-4 py-2 rounded-lg font-bold transition-all whitespace-nowrap ${activeTab === 'donate' ? 'bg-amber-600 text-white' : 'bg-amber-100 text-amber-800 hover:bg-amber-200'}`}
            >
              + Add Food
            </button>
          )}

          {(role === 'needer' || user?.role === 'needer') && (
            <button 
              onClick={() => setActiveTab('need')} 
              className={`px-4 py-2 rounded-lg font-bold transition-all whitespace-nowrap ${activeTab === 'need' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-800 hover:bg-blue-200'}`}
            >
              Request Food
            </button>
          )}
        </div>
      </div>

      <div className="mt-8 relative">
        {activeTab === 'map' && (
          <div className="relative z-0">
             <Map donations={donations} />
             {/* Absolutely positioned widgets over map */}
             <div className="absolute top-4 right-4 z-10 hidden md:block w-80 shadow-2xl rounded-2xl overflow-hidden backdrop-blur bg-white/95">
               <Leaderboard />
             </div>
             <div className="absolute bottom-4 right-4 z-[9999]">
                <SOSButton />
             </div>
          </div>
        )}
        
        {activeTab === 'donate' && <DonationForm setDonations={setDonations} />}
        {activeTab === 'need' && <NeedForm />}
      </div>
      
      {activeTab === 'map' && (
        <div className="mt-8 md:hidden shadow-lg rounded-2xl overflow-hidden border">
           <Leaderboard />
        </div>
      )}
    </div>
  );
}
