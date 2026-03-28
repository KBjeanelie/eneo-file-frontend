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

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const response = await api.get('https://myaccount.auth.eneogroup.site/api/v1/me/apps/');
        if (response.data && response.data.apps) {
          // Add current app to the list if not present, and mark it as active
          const fetchedApps = response.data.apps.map(app => ({
            ...app,
            active: app.name === 'Eneo File'
          }));
          setApps(fetchedApps);
        }
      } catch (err) {
        console.error("Could not fetch apps from Eneo Account", err);
      }
    };
    
    if (isOpen) {
      fetchApps();
    }
  }, [isOpen]);

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
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-2 shadow-sm ${app.active ? 'bg-eneo-violet text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-white group-hover:shadow-md transition-all'}`}>
                    {app.logo_url ? (
                      <img src={app.logo_url} alt={app.name} className="w-10 h-10 object-contain" />
                    ) : (
                      <span className="font-bold text-base uppercase">{app.name ? app.name[0] : '?'}</span>
                    )}
                  </div>
                  <span className="text-sm font-bold text-slate-700 w-full">{app.name}</span>
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
