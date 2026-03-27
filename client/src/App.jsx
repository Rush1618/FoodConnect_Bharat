import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Dashboard from './components/Dashboard';
import Register from './components/Register';
import Profile from './pages/Profile';
import { MapPin, UserIcon, Utensils } from 'lucide-react';

function Navbar() {
  const { user } = useAuth();

  return (
    <nav className="bg-white border-b sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-xl font-black tracking-tighter text-gray-900 group">
          <div className="bg-amber-500 text-white p-1.5 rounded-lg group-hover:bg-amber-600 transition">
            <Utensils size={20} />
          </div>
          FoodConnect <span className="text-amber-500 font-bold">Bharat</span>
        </Link>
        <div className="flex items-center gap-4 text-sm font-semibold">
          <Link to="/" className="hover:text-amber-600 transition">Home</Link>
          {user ? (
            <Link to="/profile" className="flex items-center gap-1 hover:text-amber-600 bg-gray-50 px-3 py-1.5 rounded-full border">
               <UserIcon size={14}/> {user.name}
            </Link>
          ) : (
            <Link to="/register" className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition">Join Now</Link>
          )}
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-amber-200">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
