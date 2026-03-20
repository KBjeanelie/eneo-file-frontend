import React from 'react';
import { FileUp, X } from 'lucide-react';
import { formatBytes } from '../../utils/format';

const UploadProgress = ({ file, progress, onCancel }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-eneo-light p-4 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-eneo-light text-eneo-violet rounded-lg">
            <FileUp className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800 truncate max-w-[200px]">{file.name}</p>
            <p className="text-[10px] text-slate-500">{formatBytes(file.size)}</p>
          </div>
        </div>
        <button 
          onClick={onCancel}
          className="p-1 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="relative h-2 w-full bg-slate-100 rounded-full overflow-hidden">
        <div 
          className="absolute inset-y-0 left-0 bg-eneo-violet transition-all duration-300 ease-out flex items-center justify-end"
          style={{ width: `${progress}%` }}
        >
          <div className="w-2 h-full bg-white/20 animate-shimmer" />
        </div>
      </div>
      
      <div className="flex justify-between items-center mt-2">
        <span className="text-[10px] font-bold text-eneo-violet uppercase tracking-wider italic">
          Upload en cours...
        </span>
        <span className="text-[10px] font-medium text-slate-500">
          {progress}%
        </span>
      </div>
    </div>
  );
};

export default UploadProgress;
