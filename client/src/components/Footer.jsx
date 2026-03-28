import React from 'react';
import { Link } from 'react-router-dom';
import { Utensils, Heart, Globe, Mail, Phone, Instagram, Twitter, Linkedin, Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-20 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Info */}
          <div className="col-span-1 md:col-span-1 space-y-6">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-orange-600 flex items-center justify-center text-white shadow-lg">
                <Utensils size={18} />
              </div>
              <span className="text-xl font-black text-white tracking-tight">Food<span className="text-orange-500">Connect</span></span>
            </Link>
            <p className="text-sm font-medium leading-relaxed max-w-xs opacity-70">
              India's premier high-velocity food rescue platform. Bridging the gap between surplus and survival with AI-driven logistics.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 rounded-lg bg-slate-800 hover:bg-orange-600 transition-colors text-white"><Twitter size={18} /></a>
              <a href="#" className="p-2 rounded-lg bg-slate-800 hover:bg-orange-600 transition-colors text-white"><Instagram size={18} /></a>
              <a href="#" className="p-2 rounded-lg bg-slate-800 hover:bg-orange-600 transition-colors text-white"><Linkedin size={18} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-sm font-black text-white uppercase tracking-widest">Platform</h4>
            <ul className="space-y-3 font-medium text-sm">
              <li><Link to="/how-it-works" className="hover:text-orange-500 transition-colors">How it Works</Link></li>
              <li><Link to="/sustainability" className="hover:text-orange-500 transition-colors">Our Impact</Link></li>
              <li><Link to="/dashboard" className="hover:text-orange-500 transition-colors">Live Map</Link></li>
              <li><Link to="/leaderboard" className="hover:text-orange-500 transition-colors">Top Rescuers</Link></li>
            </ul>
          </div>

          {/* Vision */}
          <div className="space-y-6">
            <h4 className="text-sm font-black text-white uppercase tracking-widest">Vision</h4>
            <ul className="space-y-3 font-medium text-sm">
              <li><span className="opacity-70 flex items-center gap-2"><Globe size={14} /> Zero Waste Bharat</span></li>
              <li><span className="opacity-70 flex items-center gap-2"><Heart size={14} /> Community First</span></li>
              <li><span className="opacity-70 flex items-center gap-2"><Shield size={14} /> Safe & Verified</span></li>
            </ul>
          </div>

          {/* Help & Support */}
          <div className="space-y-6">
            <h4 className="text-sm font-black text-white uppercase tracking-widest">Support</h4>
             <ul className="space-y-3 font-medium text-sm">
              <li><a href="mailto:support@foodconnect.in" className="flex items-center gap-2 hover:text-orange-500"><Mail size={14} /> Contact Us</a></li>
              <li><span className="flex items-center gap-2"><Phone size={14} /> +91-000-000-0000</span></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold uppercase tracking-widest opacity-40">
           <span>© 2026 FoodConnect Bharat. Developed for BitBusters DevSprint.</span>
           <div className="flex gap-6">
             <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
             <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
           </div>
        </div>
      </div>
    </footer>
  );
}
