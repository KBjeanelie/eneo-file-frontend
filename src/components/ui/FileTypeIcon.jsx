import React from 'react';
import { 
  FileText, 
  FileImage, 
  FileVideo, 
  FileArchive, 
  FileCode, 
  File,
  Music,
  FileSpreadsheet
} from 'lucide-react';

const FileTypeIcon = ({ mimeType, className = "w-6 h-6" }) => {
  if (mimeType?.includes('image/')) return <FileImage className={`${className} text-emerald-500`} />;
  if (mimeType?.includes('video/')) return <FileVideo className={`${className} text-rose-500`} />;
  if (mimeType?.includes('audio/')) return <Music className={`${className} text-amber-500`} />;
  if (mimeType?.includes('pdf')) return <FileText className={`${className} text-red-500`} />;
  if (mimeType?.includes('zip') || mimeType?.includes('rar')) return <FileArchive className={`${className} text-amber-600`} />;
  if (mimeType?.includes('javascript') || mimeType?.includes('html') || mimeType?.includes('json')) return <FileCode className={`${className} text-blue-500`} />;
  if (mimeType?.includes('spreadsheet') || mimeType?.includes('excel') || mimeType?.includes('csv')) return <FileSpreadsheet className={`${className} text-emerald-600`} />;
  
  return <File className={`${className} text-slate-400`} />;
};

export default FileTypeIcon;
