import React, { useCallback, useState } from 'react';
import { Upload, FileUp } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const DropZone = ({ onFileSelect, isUploading }) => {
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else {
      setIsDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  }, [onFileSelect]);

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div 
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      className={twMerge(
        "relative rounded-2xl border-2 border-dashed transition-all duration-300 group overflow-hidden",
        isDragActive ? "border-eneo-gold bg-eneo-gold/5 scale-[1.01]" : "border-slate-300 hover:border-eneo-violet bg-white",
        isUploading && "opacity-50 pointer-events-none"
      )}
    >
      <input 
        type="file" 
        onChange={handleChange}
        className="absolute inset-0 opacity-0 cursor-pointer z-10"
        disabled={isUploading}
      />
      
      <div className="p-10 flex flex-col items-center justify-center text-center space-y-4">
        <div className={twMerge(
          "w-16 h-16 rounded-full flex items-center justify-center transition-colors duration-300",
          isDragActive ? "bg-eneo-gold text-white" : "bg-eneo-light text-eneo-violet"
        )}>
          {isDragActive ? <FileUp className="w-8 h-8 animate-bounce" /> : <Upload className="w-8 h-8" />}
        </div>
        
        <div>
          <p className="text-xl font-semibold text-slate-800">
            {isDragActive ? "Lâchez pour uploader" : "Glissez-déposez votre fichier ici"}
          </p>
          <p className="text-slate-500 mt-1">Ou cliquez pour parcourir vos dossiers</p>
        </div>
        
        <div className="flex items-center space-x-2 text-xs font-medium text-slate-400">
          <span className="bg-slate-100 px-2 py-1 rounded">Max 250 Mo</span>
          <span className="bg-slate-100 px-2 py-1 rounded">Exp. 3 jours</span>
          <span className="bg-slate-100 px-2 py-1 rounded">Lien sécurisé</span>
        </div>
      </div>
    </div>
  );
};

export default DropZone;
