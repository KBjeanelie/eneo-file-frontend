import React from 'react';
import { FileText, FileVideo, FileAudio, FileImage as FileImageIcon, ExternalLink } from 'lucide-react';

const FilePreview = ({ fileUrl, mimeType, fileName }) => {
  if (!fileUrl) return null;

  // Image Preview
  if (mimeType?.startsWith('image/')) {
    return (
      <div className="relative group rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
        <img 
          src={fileUrl} 
          alt={fileName} 
          className="w-full h-auto max-h-[500px] object-contain mx-auto transition-transform duration-500 group-hover:scale-[1.02]"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
      </div>
    );
  }

  // Video Preview
  if (mimeType?.startsWith('video/')) {
    return (
      <div className="rounded-2xl overflow-hidden bg-black aspect-video shadow-2xl border border-white/10">
        <video 
          controls 
          className="w-full h-full"
          poster="" // Could be a cloudinary thumbnail in the future
        >
          <source src={fileUrl} type={mimeType} />
          Votre navigateur ne supporte pas la lecture de vidéos.
        </video>
      </div>
    );
  }

  // Audio Preview
  if (mimeType?.startsWith('audio/')) {
    return (
      <div className="p-8 rounded-2xl bg-white border border-slate-100 shadow-sm flex flex-col items-center space-y-6">
        <div className="p-6 bg-eneo-light text-eneo-violet rounded-full">
           <FileAudio className="w-12 h-12" />
        </div>
        <audio controls className="w-full max-w-md h-12">
          <source src={fileUrl} type={mimeType} />
          Votre navigateur ne supporte pas la lecture audio.
        </audio>
      </div>
    );
  }

  // PDF Preview
  if (mimeType === 'application/pdf') {
    return (
      <div className="rounded-2xl overflow-hidden bg-slate-200 border border-slate-300 h-[600px] shadow-inner relative flex flex-col">
          <div className="flex-1">
            <embed 
              src={`${fileUrl}#toolbar=0`} 
              type="application/pdf" 
              width="100%" 
              height="100%" 
              className="border-none"
            />
          </div>
          <a 
            href={fileUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur text-eneo-violet rounded-xl shadow-lg hover:bg-eneo-violet hover:text-white transition-all flex items-center space-x-2 text-xs font-bold"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Ouvrir en plein écran</span>
          </a>
      </div>
    );
  }

  // Fallback for other files
  return (
    <div className="p-12 rounded-3xl bg-white border border-dashed border-slate-200 flex flex-col items-center text-center space-y-4">
      <div className="p-4 bg-slate-50 text-slate-400 rounded-2xl">
        <FileText className="w-16 h-16" />
      </div>
      <div>
        <p className="font-bold text-slate-800">Aperçu non disponible</p>
        <p className="text-sm text-slate-400">Ce type de fichier ne peut pas être visualisé directement.</p>
      </div>
    </div>
  );
};

export default FilePreview;
