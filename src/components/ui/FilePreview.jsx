import React from 'react';
import { FileText, FileVideo, FileAudio, FileImage as FileImageIcon, ExternalLink, Music, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const FilePreview = ({ fileUrl, mimeType, fileName, isBlurred = false }) => {
  if (!fileUrl && !isBlurred) return null;

  const containerVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.4, ease: "easeOut" }
  };

  const blurClasses = isBlurred ? "blur-2xl pointer-events-none scale-110" : "transition-transform duration-700 group-hover:scale-[1.03]";

  const LockOverlay = () => (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center space-y-4 bg-slate-900/10 backdrop-blur-sm">
      <div className="bg-white/90 p-6 rounded-[2rem] shadow-2xl border border-white/50 text-eneo-violet animate-pulse">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
      </div>
      <p className="text-white font-black uppercase tracking-[0.2em] text-xs drop-shadow-lg">Contenu Protégé</p>
    </div>
  );

  // Image Preview
  if (mimeType?.startsWith('image/')) {
    return (
      <motion.div 
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="relative group rounded-[2.5rem] overflow-hidden bg-slate-100 border border-slate-200 drive-shadow-sm min-h-[300px] flex items-center justify-center"
      >
        <img 
          src={fileUrl || 'https://via.placeholder.com/800x600?text=Protected+Image'} 
          alt={fileName} 
          className={`w-full h-auto max-h-[600px] object-contain mx-auto ${blurClasses}`}
        />
        {isBlurred && <LockOverlay />}
        {!isBlurred && <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />}
      </motion.div>
    );
  }

  // Video Preview
  if (mimeType?.startsWith('video/')) {
    return (
      <motion.div 
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="rounded-[2.5rem] overflow-hidden bg-black aspect-video shadow-2xl border border-white/5 relative group"
      >
        <div className={`w-full h-full ${isBlurred ? 'blur-3xl' : ''}`}>
          <video 
            controls={!isBlurred} 
            className="w-full h-full object-contain"
            poster="" 
          >
            {fileUrl && <source src={fileUrl} type={mimeType} />}
            Votre navigateur ne supporte pas la lecture de vidéos.
          </video>
        </div>
        {isBlurred && <LockOverlay />}
      </motion.div>
    );
  }

  // Audio Preview
  if (mimeType?.startsWith('audio/')) {
    return (
      <motion.div 
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="p-10 rounded-[3rem] bg-white border border-slate-100 drive-shadow-sm flex flex-col items-center space-y-8 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-eneo-gradient opacity-20" />
        <div className={`p-8 bg-amber-50 text-amber-500 rounded-full shadow-inner ${isBlurred ? 'blur-xl' : ''}`}>
           <Music className="w-14 h-14" />
        </div>
        <div className={`w-full max-w-md ${isBlurred ? 'blur-md pointer-events-none' : ''}`}>
           <audio controls className="w-full h-12">
             {fileUrl && <source src={fileUrl} type={mimeType} />}
             Votre navigateur ne supporte pas la lecture audio.
           </audio>
        </div>
        {isBlurred && <LockOverlay />}
      </motion.div>
    );
  }

  // PDF Preview
  if (mimeType === 'application/pdf') {
    return (
      <motion.div 
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="rounded-[2.5rem] overflow-hidden bg-slate-200 border border-slate-300 h-[650px] shadow-2xl relative flex flex-col group"
      >
          <div className={`flex-1 bg-slate-800 ${isBlurred ? 'blur-3xl' : ''}`}>
            {fileUrl && !isBlurred ? (
              <embed 
                src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`} 
                type="application/pdf" 
                width="100%" 
                height="100%" 
                className="border-none opacity-90"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-600">
                 <FileText size={80} className="opacity-20" />
              </div>
            )}
          </div>
          {isBlurred && <LockOverlay />}
          {!isBlurred && (
            <a 
              href={fileUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="absolute top-6 right-6 px-5 py-3 bg-white/95 backdrop-blur-xl text-eneo-violet rounded-2xl shadow-2xl hover:bg-eneo-violet hover:text-white transition-all flex items-center space-x-3 text-xs font-black uppercase tracking-widest border border-white/20"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Plein écran</span>
            </a>
          )}
      </motion.div>
    );
  }

  // Fallback
  return (
    <motion.div 
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className="p-16 rounded-[3.5rem] bg-white border-2 border-dashed border-slate-100 flex flex-col items-center text-center space-y-6 relative overflow-hidden"
    >
      <div className={`p-6 bg-slate-50 text-slate-300 rounded-[2rem] shadow-inner ${isBlurred ? 'blur-xl' : ''}`}>
        <HelpCircle className="w-20 h-20" />
      </div>
      <div className={`space-y-2 ${isBlurred ? 'blur-sm' : ''}`}>
        <p className="font-black text-slate-800 text-lg uppercase tracking-tight">Aperçu indisponible</p>
        <p className="text-sm text-slate-400 max-w-xs mx-auto leading-relaxed">Ce format de fichier n'est pas supporté pour la prévisualisation instantanée, mais vous pouvez toujours le télécharger en toute sécurité.</p>
      </div>
      {isBlurred && <LockOverlay />}
    </motion.div>
  );
};

export default FilePreview;
