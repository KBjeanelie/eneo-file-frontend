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

const Sidebar = ({ onNewFile, isOpen, onClose }) => {
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
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-100 flex flex-col pt-4 overflow-y-auto transition-transform duration-300 ease-in-out lg:static lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="px-6 mb-8 lg:hidden flex justify-between items-center">
          <span className="font-bold text-slate-800">Menu</span>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">×</button>
        </div>

        <div className="px-6 mb-8">
          <motion.button 
            whileHover={{ scale: 1.02, boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              onNewFile();
              if (window.innerWidth < 1024) onClose();
            }}
            className="flex items-center space-x-3 bg-white w-full px-5 py-4 rounded-2xl shadow-sm border border-slate-100 text-slate-700 hover:text-eneo-violet transition-all group"
          >
            <Plus className="w-6 h-6 text-eneo-violet group-hover:rotate-90 transition-transform duration-300" />
            <span className="font-bold text-sm">Nouveau</span>
          </motion.button>
        </div>

        <nav className="flex-1 space-y-1 px-4">
          {menuItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              onClick={() => { if (window.innerWidth < 1024) onClose(); }}
              className={({ isActive }) => `
                flex items-center space-x-4 px-5 py-3 rounded-2xl transition-all duration-200
                ${isActive 
                  ? 'bg-violet-50 text-eneo-violet font-bold shadow-sm ring-1 ring-eneo-violet/10' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
              `}
            >
              {item.icon}
              <span className="text-sm">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-8 border-t border-slate-50 space-y-5">
          <div className="space-y-2.5 cursor-pointer group" onClick={() => { window.location.href = '/storage'; if (window.innerWidth < 1024) onClose(); }}>
            <div className="flex items-center justify-between text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] px-1">
              <div className="flex items-center space-x-2 group-hover:text-eneo-violet transition-colors">
                <Cloud className="w-3.5 h-3.5" />
                <span>Stockage</span>
              </div>
              <span className={storagePercent > 90 ? 'text-rose-500' : ''}>{storagePercent}%</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: `${storagePercent}%` }}
                 transition={{ duration: 1, ease: "easeOut" }}
                 className={`h-full rounded-full ${storagePercent > 90 ? 'bg-rose-500' : 'bg-eneo-violet'}`}
              />
            </div>
            <p className="text-[10px] text-slate-400 px-1 font-bold italic tracking-tight">
              {formatBytes(storageUsed)} sur 1 Go utilisés
            </p>
          </div>
          
          <NavLink 
            to="/storage" 
            onClick={() => { if (window.innerWidth < 1024) onClose(); }}
            className="w-full py-3 block text-center border-2 border-eneo-violet/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-eneo-violet hover:bg-eneo-violet hover:text-white hover:border-eneo-violet transition-all duration-300"
          >
            Gérer le stockage
          </NavLink>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
