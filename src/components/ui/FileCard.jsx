import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Calendar, Download, Shield, ShieldOff, MoreVertical } from 'lucide-react';
import FileTypeIcon from './FileTypeIcon';
import { formatBytes, formatDate } from '../../utils/format';

const FileCard = ({ file }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 hover:border-eneo-violet hover:shadow-md transition-all duration-300 overflow-hidden group">
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div className="p-3 bg-eneo-light rounded-lg text-eneo-violet group-hover:bg-eneo-violet group-hover:text-white transition-colors">
            <FileTypeIcon mimeType={file.mime_type} className="w-8 h-8" />
          </div>
          <div className="px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500">
            {file.original_name.split('.').pop()}
          </div>
        </div>

        <div className="mt-4">
          <h3 className="font-bold text-slate-800 truncate" title={file.title}>
            {file.title || file.original_name}
          </h3>
          <p className="text-xs text-slate-500 mt-1">{formatBytes(file.file_size)}</p>
        </div>

        <div className="mt-6 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-50 pt-4">
          <div className="flex items-center space-x-1" title="Date d'expiration">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formatDate(file.expires_at)}</span>
          </div>
          <div className="flex items-center space-x-1" title="Téléchargements">
            <Download className="w-3.5 h-3.5" />
            <span>{file.download_count} / {file.max_downloads}</span>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 px-5 py-3 flex justify-between items-center bg-opacity-50">
        <div className="flex items-center space-x-1.5">
          {file.is_active ? (
            <span className="flex items-center space-x-1 text-emerald-600 text-[10px] font-bold uppercase">
              <Shield className="w-3 h-3" />
              <span>Actif</span>
            </span>
          ) : (
            <span className="flex items-center space-x-1 text-rose-500 text-[10px] font-bold uppercase">
              <ShieldOff className="w-3 h-3" />
              <span>Inactif</span>
            </span>
          )}
        </div>
        
        <Link 
          to={`/files/${file.id}`}
          className="text-eneo-violet hover:text-violet-800 font-bold text-xs flex items-center space-x-1 transition-colors"
        >
          <span>Gérer</span>
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
};

export default FileCard;
