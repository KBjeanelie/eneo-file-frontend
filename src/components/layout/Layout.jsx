import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import keycloak from '../../auth/keycloak';
import { useFiles } from '../../hooks/useFiles';
import { AnimatePresence, motion } from 'framer-motion';
import DropZone from '../ui/DropZone';
import UploadProgress from '../ui/UploadProgress';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const { uploadFile, uploadProgress, fetchFiles, fetchQuota } = useFiles();
  const [currentUpload, setCurrentUpload] = useState(null);

  const handleFileSelect = async (file) => {
    setCurrentUpload(file);
    try {
      await uploadFile(file);
      setCurrentUpload(null);
      setShowUploadModal(false);
      fetchFiles();
      fetchQuota();
    } catch (err) {
      setCurrentUpload(null);
      setError(err.message);
    }
  };

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden text-slate-700 font-outfit">
      <Header user={keycloak.tokenParsed} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar onNewFile={() => setShowUploadModal(true)} />

        <main className="flex-1 overflow-y-auto bg-white p-6 relative">
          <div className="max-w-6xl mx-auto h-full">
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
            <Outlet />
          </div>
        </main>
      </div>

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
    </div>
  );
};

export default Layout;
