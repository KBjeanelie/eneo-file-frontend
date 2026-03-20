import React from 'react';
import { LogOut, FileText, User } from 'lucide-react';
import { logout } from '../../auth/keycloak';

const Header = ({ user }) => {
  return (
    <header className="bg-eneo-violet text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="bg-eneo-gold p-1.5 rounded-lg">
            <FileText className="w-6 h-6 text-eneo-violet" />
          </div>
          <span className="text-xl font-bold tracking-tight">Eneo <span className="text-eneo-gold">File</span></span>
        </div>

        <div className="flex items-center space-x-4">
          {user && (
            <div className="flex items-center space-x-3 border-l border-violet-400 pl-4 ml-4">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium leading-none">{user.firstName} {user.lastName}</p>
                <p className="text-xs text-violet-200">{user.email}</p>
              </div>
              <button 
                onClick={logout}
                className="p-2 hover:bg-violet-500 rounded-full transition-colors group relative"
                title="Déconnexion"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
