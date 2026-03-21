import React, { useEffect } from 'react';
import { useFiles } from '../hooks/useFiles';
import { HardDrive, AlertTriangle, RefreshCw, Info, CheckCircle2 } from 'lucide-react';
import { formatBytes } from '../utils/format';
import { motion } from 'framer-motion';

const StorageSpace = () => {
  const { quota, fetchQuota, loading } = useFiles();

  useEffect(() => {
    fetchQuota();
  }, [fetchQuota]);

  const storageUsed = quota?.total_uploaded_size || 0;
  const storageLimit = 1 * 1024 * 1024 * 1024; // 1 GB
  const storagePercent = Math.min(Math.round((storageUsed / storageLimit) * 100), 100);
  const isFull = storagePercent >= 100;

  return (
    <div className="space-y-10 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div className="flex items-center space-x-4 border-b border-slate-100 pb-6">
        <div className="p-3 bg-eneo-violet text-white rounded-2xl shadow-lg shadow-eneo-violet/20">
          <HardDrive size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Espace de Stockage</h1>
          <p className="text-sm text-slate-400 font-medium">Gérez votre quota et suivez l'utilisation de vos ressources</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Usage Card */}
        <div className="md:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 drive-shadow-sm p-10 space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-eneo-violet/5 rounded-bl-[100%] transition-transform group-hover:scale-110" />
          
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-slate-700">Utilisation actuelle</h2>
            <div className="flex items-baseline space-x-2">
              <span className="text-5xl font-black text-eneo-violet">{storagePercent}%</span>
              <span className="text-slate-400 font-medium lowercase">utilisés sur 1 Go</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="h-4 bg-slate-100 rounded-full overflow-hidden shadow-inner p-0.5">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${storagePercent}%` }}
                transition={{ duration: 1.5, ease: "circOut" }}
                className={`h-full rounded-full shadow-lg ${isFull ? 'bg-rose-500' : 'bg-eneo-gradient'}`}
              />
            </div>
            <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-400 px-1">
              <span>0 B</span>
              <span>{formatBytes(storageUsed)}</span>
              <span>1 GB</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Espace utilisé</p>
                <p className="text-xl font-bold text-slate-700">{formatBytes(storageUsed)}</p>
             </div>
             <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Espace libre</p>
                <p className="text-xl font-bold text-slate-700">{formatBytes(Math.max(0, storageLimit - storageUsed))}</p>
             </div>
          </div>
        </div>

        {/* Status & Reset Card */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 drive-shadow-sm p-8 space-y-6 flex flex-col justify-between">
           <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">Statut</h2>
                {isFull ? (
                  <span className="bg-rose-50 text-rose-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-rose-100 animate-pulse">
                    Plein
                  </span>
                ) : (
                  <span className="bg-emerald-50 text-emerald-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                    Sain
                  </span>
                )}
              </div>

              {isFull ? (
                <div className="space-y-4">
                  <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100 flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-rose-500 mt-1 shrink-0" />
                    <p className="text-xs text-rose-800 leading-relaxed font-medium">
                      Votre quota est épuisé. Les nouveaux uploads sont temporairement bloqués.
                    </p>
                  </div>
                  
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                    <div className="flex items-center space-x-3 text-slate-600">
                       <RefreshCw className="w-4 h-4 animate-spin-slow" />
                       <span className="text-xs font-bold">Réinitialisation automatique</span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-relaxed">
                       Vos fichiers seront automatiquement supprimés et votre quota remis à zéro dans <span className="text-slate-700 font-black">5 jours</span> suivant le blocage.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-start space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" />
                    <p className="text-xs text-emerald-800 leading-relaxed font-medium">
                      Tout est en ordre ! Vous pouvez continuer à uploader vos fichiers.
                    </p>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed px-1">
                    Vos fichiers sont conservés pendant 3 jours par défaut, ou selon vos réglages de sécurité.
                  </p>
                </div>
              )}
           </div>

           <button 
             disabled={!isFull}
             className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg transition-all ${isFull ? 'bg-eneo-violet text-white hover:bg-violet-800' : 'bg-slate-100 text-slate-300 cursor-not-allowed'}`}
           >
             Demander une extension
           </button>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-slate-900 text-white rounded-[2.5rem] p-10 flex items-center justify-between relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32" />
         <div className="space-y-3 relative z-10 max-w-xl">
            <h3 className="text-xl font-bold flex items-center space-x-3 text-yellow-500">
               <Info className="w-6 h-6" />
               <span>Comment fonctionne le quota ?</span>
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
               L'application Eneo File limite chaque utilisateur à <span className="text-white font-bold">1 Go de données cumulées</span>. Une fois cette limite atteinte, un cycle de refroidissement de 5 jours commence. À l'issue de cette période, tous vos fichiers sont purgés pour libérer de l'espace.
            </p>
         </div>
         <div className="hidden lg:block relative z-10 p-6 bg-white/10 rounded-3xl border border-white/10 backdrop-blur-xl">
            <RefreshCw className="w-12 h-12 text-slate-400 opacity-50" />
         </div>
      </div>
    </div>
  );
};

export default StorageSpace;
