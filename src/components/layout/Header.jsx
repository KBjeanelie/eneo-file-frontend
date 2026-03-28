import React, { useState, useEffect } from 'react';
import { LogOut, FileText, Search, Settings, HelpCircle, Menu, User } from 'lucide-react';
import { logout } from '../../auth/keycloak';
import { Link } from 'react-router-dom';
import AppGrid from './AppGrid';
import api from '../../api/client';

const Header = ({ onMenuClick }) => {
  const [profile, setProfile] = useState(null);
  const [avatarError, setAvatarError] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('https://myaccount.auth.eneogroup.site/api/v1/me/');
        setProfile(response.data);
      } catch (err) {
        console.error("Could not fetch user profile from Eneo Account", err);
      }
    };
    
    fetchProfile();
    // Poll every 30 seconds for automatic sync
    const interval = setInterval(fetchProfile, 30000);
    return () => clearInterval(interval);
  }, []);

  const userAvatar = profile?.avatar_url || profile?.picture || profile?.avatar;
  const initials = profile ? (profile.first_name?.[0] || profile.given_name?.[0] || '') + (profile.last_name?.[0] || profile.family_name?.[0] || '') : '?';

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="px-4 h-16 flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center space-x-2 min-w-0 md:min-w-[240px]">
          <button 
            onClick={onMenuClick}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors lg:hidden"
          >
            <Menu className="w-5 h-5 text-slate-600" />
          </button>
          <Link to="/dashboard" className="flex items-center space-x-2.5 px-2">
            <div className="bg-eneo-violet p-1.5 rounded-lg drive-shadow-sm">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-700 hidden xs:block">
              Eneo <span className="text-eneo-violet">File</span>
            </span>
          </Link>
        </div>

        {/* Middle: Search Bar (Hidden on mobile) */}
        <div className="flex-1 max-w-2xl px-4 hidden md:block">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400 group-focus-within:text-eneo-violet transition-colors" />
            </div>
            <input
              type="text"
              className="block w-full bg-slate-100 border-transparent focus:bg-white focus:ring-2 focus:ring-eneo-violet/10 focus:border-eneo-violet/20 rounded-xl py-2.5 pl-11 pr-4 text-sm transition-all duration-200"
              placeholder="Rechercher dans vos fichiers..."
            />
          </div>
        </div>

        {/* Right: Actions & Profile */}
        <div className="flex items-center space-x-1 min-w-0 md:min-w-[240px] justify-end">
          <Link 
            to="/help"
            className="p-2.5 hover:bg-slate-100 rounded-full text-slate-500 transition-colors hidden sm:block"
          >
            <HelpCircle className="w-5 h-5" />
          </Link>
          
          <Link to="/settings" className="p-2 hover:bg-slate-100 rounded-full text-slate-600 transition group relative">
            <Settings size={20} className="group-hover:rotate-45 transition-transform duration-300" />
          </Link>

          <AppGrid />
          
          <div className="flex items-center ml-1 md:ml-2 pl-2 md:pl-4 border-l border-slate-200">
            <div className="group relative">
              <button className="w-9 h-9 bg-eneo-violet rounded-full flex items-center justify-center text-white font-bold text-sm drive-shadow-sm hover:ring-4 hover:ring-violet-50 transition-all overflow-hidden border border-slate-100">
                {userAvatar && !avatarError ? (
                  <img 
                    src={userAvatar} 
                    alt="Profile" 
                    className="w-full h-full object-cover" 
                    onError={() => setAvatarError(true)}
                  />
                ) : (
                  <span className="uppercase">{initials}</span>
                )}
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-3xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[60] py-2 px-2 overflow-hidden">
                 <button 
                  onClick={logout}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-rose-600 hover:bg-rose-50 text-sm font-bold transition-colors rounded-2xl"
                 >
                   <LogOut className="w-4 h-4" />
                   <span>Déconnexion</span>
                 </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
