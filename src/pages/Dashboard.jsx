import React, { useEffect, useState } from 'react';
import { useFiles } from '../hooks/useFiles';
import { 
  AlertCircle, CheckCircle2, Copy, Info, List, 
  Grid3X3, MoreVertical, Files, Key, Plus 
} from 'lucide-react';
import DropZone from '../components/ui/DropZone';
import FileCard from '../components/ui/FileCard';
import UploadProgress from '../components/ui/UploadProgress';
import keycloak from '../auth/keycloak';
import { motion, AnimatePresence } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';

const Dashboard = () => {
  const { onNewFile } = useOutletContext();
  const { 
    files, loading, error, uploadProgress, 
    fetchFiles, uploadFile, deleteFile, regenerateSecretKey, 
    setError 
  } = useFiles();
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500 pb-10">
      {/* Context Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div className="flex items-center space-x-4">
             <div className="flex items-center space-x-2">
                <div className="bg-eneo-violet/10 p-2 rounded-xl">
                  <Files size={20} className="text-eneo-violet" />
                </div>
                <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">Mes Fichiers</h1>
             </div>
             {/* <button 
               onClick={onNewFile}
               className="hidden sm:flex items-center space-x-2 bg-eneo-violet text-white px-4 py-2 rounded-xl shadow-lg shadow-eneo-violet/20 hover:bg-violet-800 transition-all font-bold text-xs uppercase tracking-widest"
             >
               <Plus size={14} />
               <span>Nouveau</span>
             </button> */}
          </div>
         
         <div className="flex items-center justify-between sm:justify-end space-x-3">
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mr-2 hidden xs:block">Affichage</span>
            <div className="flex items-center space-x-1 border border-slate-100 rounded-2xl p-1 bg-slate-50 shadow-inner">
               <button 
                 onClick={() => setViewMode('list')}
                 className={`p-2 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white shadow-md text-eneo-violet' : 'text-slate-400 hover:text-slate-600'}`}
               >
                 <List size={18} />
               </button>
               <button 
                 onClick={() => setViewMode('grid')}
                 className={`p-2 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white shadow-md text-eneo-violet' : 'text-slate-400 hover:text-slate-600'}`}
               >
                 <Grid3X3 size={18} />
               </button>
            </div>
         </div>
      </div>

      {/* Error handling */}
      <AnimatePresence>
         {error && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-rose-50 border-2 border-rose-100 text-rose-700 p-5 rounded-[1.5rem] shadow-xl shadow-rose-100/50 flex items-center justify-between text-sm"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-rose-200/50 p-2 rounded-xl">
                <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600" />
              </div>
              <p className="font-bold">{error}</p>
            </div>
            <button onClick={() => setError(null)} className="bg-white/50 hover:bg-white p-2 rounded-xl transition-colors">×</button>
          </motion.div>
         )}
      </AnimatePresence>

      {/* Main Content Area */}
      <section className="space-y-6">
        {loading && files.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="h-48 bg-slate-50/50 border border-slate-100 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : files.length > 0 ? (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8" 
            : "space-y-3"
          }>
            {files.map(file => (
              <FileCard 
                key={file.id} 
                file={file} 
                viewMode={viewMode} 
                onDelete={deleteFile}
                onRegenerateKey={regenerateSecretKey}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 md:py-32 bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-200 mx-2">
            <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 mb-6 group hover:scale-110 transition-transform duration-500">
               <Files size={48} className="text-slate-200 group-hover:text-eneo-violet transition-colors duration-500" />
            </div>
            <div className="text-center space-y-4">
              <div className="space-y-1">
                <p className="text-slate-500 font-black uppercase tracking-widest">Espace de Stockage Vide</p>
                <p className="text-slate-400 text-xs font-bold px-8">Commencez par uploader votre premier fichier sécurisé</p>
              </div>
              <button 
                onClick={onNewFile}
                className="bg-eneo-violet text-white px-8 py-4 rounded-2xl shadow-xl shadow-eneo-violet/30 hover:bg-violet-800 transition-all font-black uppercase tracking-[0.2em] text-[10px]"
              >
                Uploader maintenant
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Mobile FAB */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onNewFile}
        className="fixed bottom-24 right-6 z-40 lg:hidden p-4 bg-eneo-violet text-white rounded-2xl shadow-2xl shadow-eneo-violet/40 border border-white/20"
      >
        <Plus size={22} />
      </motion.button>
    </div>
  );
};

export default Dashboard;
