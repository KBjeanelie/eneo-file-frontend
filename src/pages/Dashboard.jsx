import React, { useEffect, useState } from 'react';
import { useFiles } from '../hooks/useFiles';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import DropZone from '../components/ui/DropZone';
import FileCard from '../components/ui/FileCard';
import UploadProgress from '../components/ui/UploadProgress';
import { AlertCircle, CheckCircle2, Copy, Info, List, Grid3X3, MoreVertical } from 'lucide-react';
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
    <div className="h-screen bg-white flex flex-col overflow-hidden text-slate-700">
      <Header user={keycloak.tokenParsed} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar onNewFile={() => setShowUploadModal(true)} />

        <main className="flex-1 overflow-y-auto bg-white p-6">
          <div className="max-w-6xl mx-auto space-y-8">
            
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
        </main>
      </div>

      {/* Upload Modal (Google Drive Style) */}
      <AnimatePresence>
         {showUploadModal && (
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="fixed inset-0 z-[110] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4"
           >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden overflow-y-auto max-h-[90vh]"
              >
                 <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-800">Uploader un fichier</h2>
                    <button onClick={() => setShowUploadModal(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">×</button>
                 </div>
                 
                 <div className="p-8 space-y-6">
                    {!currentUpload ? (
                      <div className="space-y-4">
                        <DropZone onFileSelect={handleFileSelect} isUploading={!!currentUpload} />
                        
                         <div className="flex flex-wrap justify-center gap-1.5 mt-6 max-w-lg mx-auto">
                           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 w-full text-center mb-2">Extensions Supportées</span>
                           {["JPG", "PNG", "GIF", "PDF", "DOC", "DOCX", "XLS", "XLSX", "PPTX", "ZIP", "RAR", "MP3", "WAV", "MP4", "MKV", "MOV", "AVI", "WMV", "FLV", "WEBM"].map((ext) => (
                             <span key={ext} className="px-2 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[9px] font-bold text-slate-400 hover:text-eneo-violet hover:border-eneo-violet/30 transition-colors">
                               .{ext}
                             </span>
                           ))}
                         </div>
                      </div>
                    ) : (
                      <UploadProgress 
                        file={currentUpload} 
                        progress={uploadProgress} 
                        onCancel={() => setCurrentUpload(null)} 
                      />
                    )}
                 </div>
                 
                 <div className="p-6 bg-slate-50/50 border-t border-slate-50 text-center">
                    <p className="text-[11px] text-slate-400 font-medium italic italic">Vos fichiers sont stockés en toute sécurité et seront supprimés après expiration.</p>
                 </div>
              </motion.div>
           </motion.div>
         )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
