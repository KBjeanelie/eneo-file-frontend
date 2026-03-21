import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Plus, 
  Files, 
  Trash2, 
  Clock, 
  Star, 
  Cloud, 
  HardDrive 
} from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = ({ onNewFile }) => {
  const menuItems = [
    { icon: <Files size={20} />, label: 'Mes Fichiers', path: '/dashboard' },
    { icon: <Clock size={20} />, label: 'Récents', path: '#', disabled: true },
    { icon: <Star size={20} />, label: 'Favoris', path: '#', disabled: true },
    { icon: <Trash2 size={20} />, label: 'Corbeille', path: '#', disabled: true },
  ];

  return (
    <aside className="w-64 flex-shrink-0 bg-white border-r border-slate-100 flex flex-col pt-4 overflow-y-auto">
      {/* Search Bar Placeholder for Mobile / Small desktops if needed */}
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
          item.disabled ? (
            <div 
              key={item.label}
              className="flex items-center space-x-4 px-4 py-2.5 rounded-full text-slate-400 cursor-not-allowed opacity-50"
            >
              {item.icon}
              <span className="text-sm font-medium">{item.label}</span>
            </div>
          ) : (
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
          )
        ))}
      </nav>

      <div className="p-6 border-t border-slate-50 space-y-4">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">
            <div className="flex items-center space-x-2">
              <Cloud className="w-3 h-3" />
              <span>Stockage</span>
            </div>
            <span>65%</span>
          </div>
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <motion.div 
               initial={{ width: 0 }}
               animate={{ width: '65%' }}
               transition={{ duration: 1, ease: "easeOut" }}
               className="h-full bg-eneo-violet rounded-full"
            />
          </div>
          <p className="text-[10px] text-slate-400 px-1 font-medium italic">
            650 Mo sur 1 Go utilisés
          </p>
        </div>
        
        <button className="w-full py-2 border border-eneo-violet/20 rounded-lg text-[10px] font-black uppercase tracking-widest text-eneo-violet hover:bg-violet-50 transition-colors">
          Acheter plus
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
