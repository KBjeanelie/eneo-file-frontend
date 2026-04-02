import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, ShieldOff, MoreVertical, 
  Copy, Check, RefreshCw, Share2, Trash2, Key 
} from 'lucide-react';
import FileTypeIcon from './FileTypeIcon';
import { formatBytes, formatDate } from '../../utils/format';
import { getSecureDownloadUrl } from '../../utils/url';
import { motion, AnimatePresence } from 'framer-motion';

const FileCard = ({ file, viewMode = 'grid', onDelete, onRegenerateKey }) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const shareUrl = `${window.location.origin}/d/${file.access_token}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyKey = () => {
    if (file.secret_key) {
      navigator.clipboard.writeText(file.secret_key);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    }
  };

  if (viewMode === 'list') {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="group flex items-center justify-between p-3 border-b border-slate-100 hover:bg-slate-50 transition-all rounded-xl"
      >
        <Link to={`/files/${file.id}`} className="flex items-center space-x-4 flex-1 min-w-0">
          <div className="p-2.5 bg-slate-100 rounded-xl group-hover:bg-eneo-violet group-hover:text-white transition-all duration-300">
            <FileTypeIcon mimeType={file.mime_type} className="w-5 h-5" />
          </div>
          <div className="truncate flex-1">
             <h3 className="text-sm font-bold text-slate-800 truncate leading-tight">{file.title || file.original_name}</h3>
             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{file.original_name?.split('.').pop() || 'file'}</p>
          </div>
        </Link>
        
        <div className="flex items-center space-x-6 text-xs text-slate-500 min-w-[40%] justify-end sm:min-w-[400px]">
           <div className="hidden sm:flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
             <Key size={12} className="text-eneo-violet" />
             <span className="font-mono font-bold tracking-widest text-slate-700">{file.secret_key || 'PAS DE CLÉ'}</span>
           </div>
           <span className="w-20 text-right font-bold text-slate-400">{formatBytes(file.file_size)}</span>
           <span className="hidden md:block w-32 text-slate-300 font-medium">{formatDate(file.expires_at)}</span>
           <div className="flex items-center space-x-1.5">
              <button 
                onClick={handleCopyLink}
                className={`p-2 rounded-xl transition-all ${copiedLink ? 'bg-emerald-50 text-emerald-500' : 'hover:bg-slate-100 text-slate-400'}`}
                title="Copier le lien"
              >
                {copiedLink ? <Check size={16} /> : <Share2 size={16} />}
              </button>
              <button className="p-2 hover:bg-rose-50 rounded-xl text-slate-300 hover:text-rose-500 transition-all">
                <Trash2 size={16} onClick={() => onDelete?.(file.id)} />
              </button>
           </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-3xl border border-slate-100 drive-shadow-sm hover:shadow-2xl hover:shadow-violet-100/50 transition-all duration-500 overflow-hidden group flex flex-col h-[280px]"
    >
      {/* Top section: Preview/Icon */}
      <div className="relative flex-1 bg-slate-50/50 flex flex-col items-center justify-center p-6 transition-colors group-hover:bg-white">
        <div className="absolute top-4 right-4 z-10">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 bg-white/80 backdrop-blur-md hover:bg-white rounded-2xl shadow-sm text-slate-400 hover:text-slate-800 transition-all"
          >
            <MoreVertical size={18} />
          </button>
          
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-2xl shadow-2xl z-20 py-2 overflow-hidden"
              >
                 <button 
                  onClick={() => { onRegenerateKey?.(file.id); setIsMenuOpen(false); }}
                  className="w-full flex items-center space-x-3 px-4 py-2.5 hover:bg-slate-50 text-slate-600 text-xs font-bold transition-colors"
                 >
                   <RefreshCw size={14} />
                   <span>Régénérer la clé</span>
                 </button>
                 <button 
                  onClick={() => { onDelete?.(file.id); setIsMenuOpen(false); }}
                  className="w-full flex items-center space-x-3 px-4 py-2.5 hover:bg-rose-50 text-rose-500 text-xs font-bold transition-colors"
                 >
                   <Trash2 size={14} />
                   <span>Supprimer</span>
                 </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Link to={`/files/${file.id}`} className="flex flex-col items-center space-y-4">
          <div className="p-6 bg-white rounded-[2rem] shadow-sm text-slate-400 group-hover:bg-eneo-violet group-hover:text-white group-hover:rotate-6 transition-all duration-500">
            <FileTypeIcon mimeType={file.mime_type} className="w-12 h-12" />
          </div>
          <div className="text-center space-y-1">
             <h3 className="font-black text-slate-800 text-sm max-w-[160px] truncate" title={file.title || file.original_name}>
               {file.title || file.original_name}
             </h3>
             <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">{file.original_name?.split('.').pop() || 'file'}</p>
          </div>
        </Link>
      </div>

      {/* Bottom section: Info & Actions */}
      <div className="p-4 bg-white border-t border-slate-50 space-y-3">
         {/* Secret Key Section */}
         <div className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-2xl border border-slate-100/50">
            <div className="flex items-center space-x-2">
               <Shield className="w-3 h-3 text-eneo-violet" />
               <span className="text-[10px] font-mono font-black tracking-widest text-slate-600">{file.secret_key || 'NONE'}</span>
            </div>
            <button 
              onClick={handleCopyKey}
              className={`p-1.5 rounded-lg transition-all ${copiedKey ? 'text-emerald-500' : 'text-slate-300 hover:text-eneo-violet'}`}
            >
              {copiedKey ? <Check size={14} /> : <Copy size={14} />}
            </button>
         </div>

         <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 pl-1">
               <div className={`w-2 h-2 rounded-full ${file.is_active ? 'bg-emerald-400' : 'bg-rose-400'}`} />
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{formatBytes(file.file_size)}</span>
            </div>
            
            <button 
              onClick={() => window.location.assign(file.direct_download_url)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${copiedLink ? 'bg-emerald-50 text-emerald-600' : 'bg-eneo-violet/5 text-eneo-violet hover:bg-eneo-violet hover:text-white shadow-sm hover:shadow-lg hover:shadow-violet-100'}`}
            >
              {copiedLink ? (
                <>
                  <Check size={12} />
                  <span>Copié !</span>
                </>
              ) : (
                <>
                  <Share2 size={12} />
                  <span>Télécharger</span>
                </>
              )}
            </button>
         </div>
      </div>
    </motion.div>
  );
};

export default FileCard;
