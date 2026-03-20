import React from 'react';
import { 
  FileText, 
  FileImage, 
  FileVideo, 
  FileArchive, 
  FileCode, 
  File
} from 'lucide-react';

const FileTypeIcon = ({ mimeType, className = "w-6 h-6" }) => {
  if (mimeType?.includes('image/')) return <FileImage className={className} />;
  if (mimeType?.includes('video/')) return <FileVideo className={className} />;
  if (mimeType?.includes('pdf')) return <FileText className={className} />;
  if (mimeType?.includes('zip') || mimeType?.includes('rar')) return <FileArchive className={className} />;
  if (mimeType?.includes('javascript') || mimeType?.includes('html')) return <FileCode className={className} />;
  
  return <File className={className} />;
};

export default FileTypeIcon;
