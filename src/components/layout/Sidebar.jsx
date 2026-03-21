import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Plus, 
  Files, 
  Clock, 
  Cloud, 
  HardDrive 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useFiles } from '../../hooks/useFiles';
import { formatBytes } from '../../utils/format';

const Sidebar = ({ onNewFile }) => {
  const { quota, fetchQuota } = useFiles();

  useEffect(() => {
    fetchQuota();
  }, [fetchQuota]);

  const menuItems = [
    { icon: <Files size={20} />, label: 'Mes Fichiers', path: '/dashboard' },
    { icon: <Clock size={20} />, label: 'Récents', path: '/recent' },
    { icon: <HardDrive size={20} />, label: 'Espace de Stockage', path: '/storage' },
  ];

  const storageUsed = quota?.used_bytes || 0;
  const storageLimit = quota?.total_limit_bytes || (1 * 1024 * 1024 * 1024);
  const storagePercent = quota?.percentage || 0;

  return (
    <aside className="w-64 flex-shrink-0 bg-white border-r border-slate-100 flex flex-col pt-4 overflow-y-auto">
      <div className="px-4 mb-6">
        <motion.button 
          whileHover={{ scale: 1.02, boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
          whileTap={{ scale: 0.98 }}
          onClick={onNewFile}
          className="flex items-center space-x-3 bg-white px-5 py-3.5 rounded-2xl drive-btn-shadow border border-slate-100 text-slate-700 hover:text-eneo-violet transition-colors group"
        >
          <Plus className="w-6 h-6 text-eneo-violet group-hover:rotate-90 transition-transform duration-300" />
          <span className="font-bold text-sm">Nouveau</span>
        </motion.button>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {menuItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            className={({ isActive }) => `
              flex items-center space-x-4 px-4 py-2.5 rounded-full transition-all duration-200
              ${isActive 
                ? 'bg-violet-50 text-eneo-violet font-bold' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
            `}
          >
            {item.icon}
            <span className="text-sm">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-6 border-t border-slate-50 space-y-4">
        <div className="space-y-1.5 cursor-pointer group" onClick={() => window.location.href = '/storage'}>
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">
            <div className="flex items-center space-x-2 group-hover:text-eneo-violet transition-colors">
              <Cloud className="w-3 h-3" />
              <span>Stockage</span>
            </div>
            <span>{storagePercent}%</span>
          </div>
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <motion.div 
               initial={{ width: 0 }}
               animate={{ width: `${storagePercent}%` }}
               transition={{ duration: 1, ease: "easeOut" }}
               className={`h-full rounded-full ${storagePercent > 90 ? 'bg-rose-500' : 'bg-eneo-violet'}`}
            />
          </div>
          <p className="text-[10px] text-slate-400 px-1 font-medium italic">
            {formatBytes(storageUsed)} sur 1 Go utilisés
          </p>
        </div>
        
        <NavLink to="/storage" className="w-full py-2 block text-center border border-eneo-violet/20 rounded-lg text-[10px] font-black uppercase tracking-widest text-eneo-violet hover:bg-violet-50 transition-colors">
          Gérer le stockage
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
