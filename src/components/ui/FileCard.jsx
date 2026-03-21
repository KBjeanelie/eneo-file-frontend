import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Calendar, Download, Shield, ShieldOff, MoreVertical, FileText } from 'lucide-react';
import FileTypeIcon from './FileTypeIcon';
import { formatBytes, formatDate } from '../../utils/format';
import { motion } from 'framer-motion';

const FileCard = ({ file, viewMode = 'grid' }) => {
  if (viewMode === 'list') {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="group flex items-center justify-between p-3 border-b border-slate-50 hover:bg-slate-50 transition-all rounded-lg"
      >
        <Link to={`/files/${file.id}`} className="flex items-center space-x-4 flex-1 min-w-0">
          <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-eneo-violet/10 group-hover:text-eneo-violet transition-colors">
            <FileTypeIcon mimeType={file.mime_type} className="w-5 h-5" />
          </div>
          <div className="truncate flex-1">
             <h3 className="text-sm font-medium text-slate-800 truncate">{file.title || file.original_name}</h3>
             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter mt-0.5">{file.original_name.split('.').pop()}</p>
          </div>
        </Link>
        
        <div className="flex items-center space-x-8 text-xs text-slate-500 min-w-[300px] justify-end">
           <span className="w-20 text-right font-medium">{formatBytes(file.file_size)}</span>
           <span className="w-32 text-slate-400">{formatDate(file.expires_at)}</span>
           <div className="flex items-center space-x-2">
              {file.is_active ? <Shield className="w-3 h-3 text-emerald-500" /> : <ShieldOff className="w-3 h-3 text-rose-400" />}
              <button className="p-1.5 hover:bg-slate-200 rounded-full text-slate-400 transition-colors">
                <MoreVertical size={14} />
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
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="bg-white rounded-2xl border border-slate-100 drive-shadow-sm hover:drive-btn-shadow transition-all duration-300 overflow-hidden group flex flex-col h-48"
    >
      <Link to={`/files/${file.id}`} className="flex-1 p-4 flex flex-col items-center justify-center space-y-3 relative overflow-hidden">
        {/* Abstract Preview Placeholder */}
        <div className="absolute inset-0 bg-slate-50 opacity-0 group-hover:opacity-40 transition-opacity" />
        
        <div className="p-4 bg-slate-50 rounded-2xl text-slate-400 group-hover:bg-eneo-violet group-hover:text-white transition-all duration-500 shadow-inner">
          <FileTypeIcon mimeType={file.mime_type} className="w-10 h-10" />
        </div>
        
        <div className="text-center w-full px-2">
           <h3 className="font-bold text-slate-800 text-sm truncate w-full" title={file.title}>
             {file.title || file.original_name}
           </h3>
           <p className="text-[10px] text-slate-400 mt-1 font-black uppercase tracking-widest">{file.original_name.split('.').pop()}</p>
        </div>
      </Link>

      <div className="px-4 py-3 bg-white border-t border-slate-50 flex items-center justify-between">
         <div className="flex items-center space-x-3">
             <div className="flex -space-x-1">
                {file.is_active ? (
                  <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 border border-white">
                    <Shield className="w-3 h-3" />
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full bg-rose-100 flex items-center justify-center text-rose-500 border border-white">
                    <ShieldOff className="w-3 h-3" />
                  </div>
                )}
             </div>
             <span className="text-[10px] font-bold text-slate-400">{formatBytes(file.file_size)}</span>
         </div>
         
         <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-300 hover:text-slate-600 transition-colors">
            <MoreVertical size={16} />
         </button>
      </div>
    </motion.div>
  );
};

export default FileCard;
