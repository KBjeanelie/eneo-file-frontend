import React from 'react';
import { LogOut, FileText, Search, Settings, HelpCircle, Menu, User } from 'lucide-react';
import { logout } from '../../auth/keycloak';
import { Link } from 'react-router-dom';
import AppGrid from './AppGrid';

const Header = ({ user, onMenuClick }) => {
  const userAvatar = user?.picture || user?.avatar;

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
          
          {user && (
            <div className="flex items-center ml-1 md:ml-2 pl-2 md:pl-4 border-l border-slate-200">
              <div className="mr-3 hidden lg:block text-right">
                <p className="text-xs font-bold text-slate-700 leading-none">{user.given_name || user.firstName} {user.family_name || user.lastName}</p>
                <p className="text-[10px] text-slate-400 mt-1 uppercase font-black tracking-tighter">{user.preferred_username || user.email?.split('@')[0]}</p>
              </div>
              <div className="group relative">
                <button className="w-9 h-9 bg-eneo-violet rounded-full flex items-center justify-center text-white font-bold text-sm drive-shadow-sm hover:ring-4 hover:ring-violet-50 transition-all overflow-hidden border border-slate-100">
                  {userAvatar ? (
                    <img src={userAvatar} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span>{(user.given_name || user.firstName)?.[0]}{(user.family_name || user.lastName)?.[0]}</span>
                  )}
                </button>
                <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-100 rounded-3xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[60] py-3 px-2 overflow-hidden">
                   <div className="px-4 py-3 border-b border-slate-50 mb-2">
                      <p className="text-xs font-bold text-slate-800 truncate">{user.name}</p>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">{user.email}</p>
                   </div>
                   <Link to="/settings" className="w-full flex items-center space-x-3 px-4 py-2.5 hover:bg-slate-50 text-slate-600 rounded-xl transition-colors mb-1">
                     <User className="w-4 h-4" />
                     <span className="text-sm font-bold">Mon Profil</span>
                   </Link>
                   <button 
                    onClick={logout}
                    className="w-full flex items-center space-x-3 px-4 py-2.5 text-rose-600 hover:bg-rose-50 text-sm font-bold transition-colors rounded-xl"
                   >
                     <LogOut className="w-4 h-4" />
                     <span>Déconnexion</span>
                   </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
