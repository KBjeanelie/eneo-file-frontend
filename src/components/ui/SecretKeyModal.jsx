import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Key, ArrowRight, X } from 'lucide-react';

const SecretKeyModal = ({ isOpen, onClose, onSubmit, title = "Fichier Protégé" }) => {
  const [key, setKey] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (key.length < 1) {
      setError('Veuillez entrer la clé secrète.');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      await onSubmit(key);
      setKey('');
    } catch (err) {
      setError(err.message || 'Clé secrète invalide.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
        />
        
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden relative z-10 border border-white/20"
        >
          <div className="p-8 space-y-8">
            <div className="flex justify-between items-start">
              <div className="bg-eneo-violet/10 p-4 rounded-3xl">
                <Shield className="w-8 h-8 text-eneo-violet" />
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-slate-50 rounded-full text-slate-400 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-slate-800">{title}</h2>
              <p className="text-slate-500 text-sm leading-relaxed">
                Ce fichier est protégé. Veuillez entrer la clé secrète à 6 caractères pour déverrouiller l'accès.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    <Key className={`w-5 h-5 transition-colors ${error ? 'text-rose-400' : 'text-slate-400 group-focus-within:text-eneo-violet'}`} />
                  </div>
                  <input
                    type="text"
                    value={key}
                    onChange={(e) => {
                      setKey(e.target.value.toUpperCase().slice(0, 6));
                      setError('');
                    }}
                    placeholder="ENTREZ LA CLÉ..."
                    autoFocus
                    className={`block w-full bg-slate-50 border-2 ${error ? 'border-rose-100 focus:border-rose-400 focus:ring-rose-50' : 'border-slate-50 focus:border-eneo-violet/20 focus:ring-eneo-violet/10'} rounded-2xl py-5 pl-14 pr-5 text-lg font-black tracking-[0.3em] uppercase transition-all duration-300 placeholder:text-slate-300 placeholder:tracking-normal`}
                  />
                </div>
                {error && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-rose-500 text-xs font-bold px-2"
                  >
                    {error}
                  </motion.p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading || key.length === 0}
                className="w-full bg-eneo-violet hover:bg-violet-800 disabled:bg-slate-100 disabled:text-slate-400 text-white font-black py-5 rounded-2xl shadow-xl shadow-violet-100 transition-all active:scale-[0.98] flex items-center justify-center space-x-3 group uppercase tracking-widest text-sm"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Déverrouiller</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>
          
          <div className="bg-slate-50 px-8 py-4 text-center border-t border-slate-100">
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
               Communication Chiffrée & Sécurisée
             </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SecretKeyModal;
