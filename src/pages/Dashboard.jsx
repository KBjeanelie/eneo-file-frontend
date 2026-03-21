import React, { useEffect, useState } from 'react';
import { useFiles } from '../hooks/useFiles';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import DropZone from '../components/ui/DropZone';
import FileCard from '../components/ui/FileCard';
import UploadProgress from '../components/ui/UploadProgress';
import { AlertCircle, CheckCircle2, Copy, Info, List, Grid3X3, MoreVertical, Files } from 'lucide-react';
import keycloak from '../auth/keycloak';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
  const { files, loading, error, uploadProgress, fetchFiles, uploadFile, setError } = useFiles();
  const [currentUpload, setCurrentUpload] = useState(null);
  const [lastUploadResult, setLastUploadResult] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const handleFileSelect = async (file) => {
    setCurrentUpload(file);
    try {
      const result = await uploadFile(file);
      setLastUploadResult(result);
      setCurrentUpload(null);
      setShowUploadModal(false);
      // Actualiser la liste
      fetchFiles();
    } catch (err) {
      setCurrentUpload(null);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Context Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
         <div className="flex items-center space-x-1 text-lg font-medium text-slate-800">
            <span className="hover:bg-slate-100 px-3 py-1.5 rounded-lg cursor-pointer transition-colors">Mes Fichiers</span>
         </div>
         
         <div className="flex items-center space-x-2 border border-slate-200 rounded-full p-1 bg-slate-50">
            <button 
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-full transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-eneo-violet' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <List size={18} />
            </button>
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-full transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-eneo-violet' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <Grid3X3 size={18} />
            </button>
         </div>
      </div>

      {/* Error handling */}
      <AnimatePresence>
         {error && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl flex items-center justify-between text-sm"
          >
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="font-medium">{error}</p>
            </div>
            <button onClick={() => setError(null)} className="text-rose-400 hover:text-rose-600 p-1">×</button>
          </motion.div>
         )}
      </AnimatePresence>

      {/* Success Upload Toast-style message */}
      <AnimatePresence>
         {lastUploadResult && (
          <motion.div 
             initial={{ opacity: 0, transform: 'translateY(100%)' }}
             animate={{ opacity: 1, transform: 'translateY(0)' }}
             className="fixed bottom-8 right-8 z-[100] bg-slate-900 text-white p-5 rounded-2xl shadow-2xl min-w-[320px] max-w-md border border-white/10"
          >
            <div className="flex justify-between items-start mb-4">
               <div className="flex items-center space-x-3">
                  <div className="bg-emerald-500 p-1 rounded-full">
                     <CheckCircle2 size={16} />
                  </div>
                  <span className="font-bold text-sm">Upload Terminé</span>
               </div>
               <button onClick={() => setLastUploadResult(null)} className="text-white/40 hover:text-white">×</button>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 p-2.5 rounded-xl border border-white/10">
              <code className="text-[10px] flex-1 truncate opacity-80">{lastUploadResult.download_url}</code>
              <button 
                onClick={() => copyToClipboard(lastUploadResult.download_url)}
                className="p-1.5 hover:bg-white/10 text-emerald-400 rounded-lg transition-colors"
              >
                <Copy size={14} />
              </button>
            </div>
            <p className="text-[9px] text-white/50 mt-3 italic flex items-center space-x-1">
              <Info size={10} />
              <span>Lien prêt à être partagé. Le fichier expirera bientôt.</span>
            </p>
          </motion.div>
         )}
      </AnimatePresence>

      {/* Main Content Area */}
      <section className="space-y-4">
        {loading && files.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="h-44 bg-slate-50 border border-slate-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : files.length > 0 ? (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" 
            : "space-y-2"
          }>
            {files.map(file => (
              <FileCard key={file.id} file={file} viewMode={viewMode} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
            <div className="bg-white p-4 rounded-full drive-shadow-sm mb-4">
               <Files size={32} className="text-slate-300" />
            </div>
            <p className="text-slate-400 font-bold">Aucun fichier ici</p>
            <p className="text-slate-300 text-xs mt-1">Cliquez sur "Nouveau" pour commencer</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
