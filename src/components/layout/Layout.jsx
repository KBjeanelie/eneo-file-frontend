import React, { useState, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import keycloak from '../../auth/keycloak';
import { useFiles } from '../../hooks/useFiles';
import { AnimatePresence, motion } from 'framer-motion';
import { Outlet } from 'react-router-dom';
import { CheckCircle2, Copy, Key, Info, Download } from 'lucide-react';
import InstallPrompt from '../ui/InstallPrompt';
import DropZone from '../ui/DropZone';
import UploadProgress from '../ui/UploadProgress';

const Layout = () => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { uploadFile, uploadProgress, fetchFiles, fetchRecentFiles, fetchQuota, error, setError, startPolling, stopPolling } = useFiles();
  const [currentUpload, setCurrentUpload] = useState(null);
  const [lastUploadResult, setLastUploadResult] = useState(null);

  // Start real-time sync when layout is mounted
  useEffect(() => {
    startPolling();
    return () => stopPolling();
  }, [startPolling, stopPolling]);

  const handleFileSelect = async (file) => {
    setCurrentUpload(file);
    try {
      const result = await uploadFile(file);
      setLastUploadResult(result);
      setCurrentUpload(null);
      setShowUploadModal(false);
      fetchFiles();
      fetchRecentFiles();
      fetchQuota();
    } catch (err) {
      setCurrentUpload(null);
      setError(err.message);
    }
  };

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden text-slate-700 font-outfit">
      <Header 
        user={keycloak.tokenParsed} 
        onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} 
      />
      
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar 
          onNewFile={() => setShowUploadModal(true)} 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)}
        />

        <main className="flex-1 overflow-y-auto bg-white p-4 md:p-6 relative">
          <div className="max-w-6xl mx-auto h-full pb-20">
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center justify-between group"
                >
                  <div className="flex items-center space-x-3 text-rose-600">
                    <span className="font-bold text-sm">{error}</span>
                  </div>
                  <button onClick={() => setError(null)} className="text-rose-300 hover:text-rose-500 font-bold transition-colors">×</button>
                </motion.div>
              )}
            </AnimatePresence>
            <Outlet context={{ onNewFile: () => setShowUploadModal(true) }} />
          </div>
        </main>
      </div>

      <InstallPrompt />

      {/* Shared Upload Modal */}
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
                           {["JPG", "PNG", "GIF", "WEBP", "PDF", "DOCX", "XLSX", "PPTX", "ZIP", "RAR", "7Z", "SQL", "PSD", "AI", "SVG", "MP4", "MKV", "MOV", "AVI", "ISO", "APK"].map((ext) => (
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
              </motion.div>
           </motion.div>
         )}
      </AnimatePresence>

      {/* Global Success Upload Toast */}
      <AnimatePresence>
         {lastUploadResult && (
          <motion.div 
             initial={{ opacity: 0, y: 50, scale: 0.9 }}
             animate={{ opacity: 1, y: 0, scale: 1 }}
             exit={{ opacity: 0, y: 50, scale: 0.9 }}
             className="fixed bottom-6 right-6 left-6 md:left-auto md:w-[400px] z-[200] bg-slate-900 text-white p-6 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/10"
          >
            <div className="flex justify-between items-start mb-6">
               <div className="flex items-center space-x-3">
                  <div className="bg-emerald-500 p-2 rounded-full shadow-lg shadow-emerald-500/20">
                     <CheckCircle2 size={18} />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-black text-sm uppercase tracking-wider">Fichier Ajouté</span>
                    <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-0.5">{lastUploadResult.original_name}</span>
                  </div>
               </div>
               <button onClick={() => setLastUploadResult(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors opacity-50 hover:opacity-100">×</button>
            </div>
            
            <div className="space-y-3">
              <div className="flex flex-col space-y-2">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Lien de partage</span>
                <div className="flex items-center space-x-2 bg-white/5 p-3 rounded-2xl border border-white/10 group hover:border-white/20 transition-all font-outfit">
                  <code className="text-[10px] flex-1 truncate font-mono text-emerald-300">{lastUploadResult.download_url}</code>
                  <div className="flex items-center space-x-1">
                    <button 
                      onClick={() => window.location.assign(lastUploadResult.direct_download_url)}
                      title="Télécharger"
                      className="p-2 hover:bg-emerald-500/10 text-emerald-400 rounded-xl transition-colors"
                    >
                      <Download size={14} />
                    </button>
                    <button 
                      onClick={() => navigator.clipboard.writeText(lastUploadResult.download_url)}
                      title="Copier le lien"
                      className="p-2 hover:bg-emerald-500/10 text-emerald-400 rounded-xl transition-colors"
                    >
                      <Copy size={14} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col space-y-2">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Clé Secrète</span>
                <div className="flex items-center space-x-2 bg-white/5 p-3 rounded-2xl border border-white/10 font-outfit">
                  <Key size={14} className="text-eneo-violet" />
                  <code className="text-[12px] flex-1 font-mono font-black tracking-[0.3em] text-white">{lastUploadResult.secret_key}</code>
                  <button 
                    onClick={() => navigator.clipboard.writeText(lastUploadResult.secret_key)}
                    className="p-2 hover:bg-white/10 text-white/60 rounded-xl transition-colors"
                  >
                    <Copy size={14} />
                  </button>
                </div>
              </div>
            </div>

            <p className="text-[9px] text-white/30 mt-6 flex items-center space-x-2 px-1 font-outfit">
              <Info size={10} className="text-white/20" />
              <span className="font-bold italic uppercase tracking-tighter">Communication Chiffrée & Protection Active</span>
            </p>
          </motion.div>
         )}
      </AnimatePresence>
    </div>
  );
};

export default Layout;
