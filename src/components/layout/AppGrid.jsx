import React, { useState, useEffect } from 'react';
import { Grid3X3, ExternalLink } from 'lucide-react';
import api from '../../api/client';

const AppGrid = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [apps, setApps] = useState([
    { name: 'Zury', url: 'https://zury.eneo.cm', description: 'Social & Fun' },
    { name: 'Mosala', url: 'https://mosala.eneo.cm', description: 'Emplois & Services' },
    { name: 'Eneo File', url: '#', description: 'Cloud Storage', active: true },
    { name: 'Eneo Account', url: 'https://account.eneo.cm', description: 'Mon profil' }
  ]);

  // Try to fetch real apps if possible
  useEffect(() => {
    const fetchApps = async () => {
      try {
        const response = await api.get('/me/apps/'); // This might need a different client or the base Eneo Account URL
        if (response.data && Array.isArray(response.data)) {
          setApps(response.data);
        }
      } catch (err) {
        console.error("Could not fetch apps from Eneo Account", err);
      }
    };
    // fetchApps(); // Disable for now as we don't have the full URL configuration for Eneo Account yet
  }, []);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-slate-100 rounded-full text-slate-600 transition group"
      >
        <Grid3X3 size={20} className="group-hover:text-eneo-violet transition-colors" />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-100 rounded-3xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in duration-200">
            <div className="grid grid-cols-3 gap-3">
              {apps.map((app, index) => (
                <a 
                  key={index}
                  href={app.url}
                  target={app.active ? "_self" : "_blank"}
                  rel="noopener noreferrer"
                  className="flex flex-col items-center p-3 rounded-2xl hover:bg-slate-50 transition-colors group text-center"
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-2 shadow-sm ${app.active ? 'bg-eneo-violet text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-white group-hover:shadow-md transition-all'}`}>
                    <span className="font-bold text-sm uppercase">{app.name[0]}</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-700 truncate w-full">{app.name}</span>
                </a>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-slate-50 flex justify-center">
               <button className="text-xs font-bold text-eneo-violet hover:underline flex items-center space-x-1">
                 <span>Plus d'applications</span>
                 <ExternalLink size={10} />
               </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AppGrid;
