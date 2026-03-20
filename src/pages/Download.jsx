import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/client';
import { Download as DownloadIcon, FileText, AlertTriangle, ShieldCheck, Clock, User } from 'lucide-react';
import { formatBytes, formatDate } from '../utils/format';
import FileTypeIcon from '../components/ui/FileTypeIcon';
import FilePreview from '../components/ui/FilePreview';
import { isAuthenticated, login } from '../auth/keycloak';

const DownloadPage = () => {
  const { access_token } = useParams();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFileData = async () => {
      try {
        const response = await api.get(`/d/${access_token}/`);
        setFile(response.data);
      } catch (err) {
        if (err.response?.status === 410) {
            setError("Ce lien a expiré ou a atteint sa limite de téléchargement.");
        } else {
            setError("Fichier introuvable ou lien invalide.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFileData();
  }, [access_token]);

  const handleDownload = () => {
    if (!isAuthenticated()) {
        login();
        return;
    }
    window.location.href = `${api.defaults.baseURL}/d/${access_token}/download/`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-eneo-violet border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-start p-4 py-12">
      <div className="max-w-4xl w-full space-y-8">
        
        {/* Logo Header */}
        <div className="flex items-center justify-center space-x-2 mb-4">
          <div className="bg-eneo-violet p-2 rounded-xl shadow-lg">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-black text-eneo-violet tracking-tight">Eneo <span className="text-eneo-gold">File</span></span>
        </div>

        {error ? (
          <div className="max-w-md mx-auto bg-white p-8 rounded-3xl shadow-xl border border-slate-100 text-center space-y-4 animate-in zoom-in duration-300">
            <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h1 className="text-xl font-bold text-slate-800">Lien inaccessible</h1>
            <p className="text-slate-500 text-sm leading-relaxed">{error}</p>
          </div>
        ) : (
          <div className="space-y-8 animate-in slide-in-from-bottom-5 duration-500">
            
            {/* Preview Section */}
            <FilePreview 
                fileUrl={file.file_url} 
                mimeType={file.mime_type} 
                fileName={file.original_name} 
            />

            {/* File Info Card */}
            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
                <div className="p-8 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="flex items-start space-x-6">
                        <div className="p-4 bg-eneo-light text-eneo-violet rounded-2xl hidden sm:block">
                            <FileTypeIcon mimeType={file.mime_type} className="w-10 h-10" />
                        </div>
                        <div className="space-y-1">
                            <h1 className="text-2xl font-bold text-slate-800 break-all">{file.original_name}</h1>
                            <div className="flex items-center space-x-4 text-sm text-slate-400 font-medium">
                                <span>{formatBytes(file.file_size)}</span>
                                <span>•</span>
                                <span>Expire {formatDate(file.expires_at)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex-shrink-0">
                        <button 
                            onClick={handleDownload}
                            className="w-full md:w-auto bg-eneo-violet hover:bg-violet-800 text-white font-black px-8 py-4 rounded-2xl shadow-xl shadow-violet-100 transition-all active:scale-95 flex items-center justify-center space-x-3 group"
                        >
                            <DownloadIcon className="w-6 h-6 group-hover:animate-bounce" />
                            <span className="uppercase tracking-widest text-sm">Télécharger</span>
                        </button>
                    </div>
                </div>

                <div className="bg-emerald-50 py-4 px-8 flex items-center justify-center space-x-2 border-t border-emerald-100">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-[0.2em]">Lien vérifié par Eneo Guard</span>
                </div>
            </div>
          </div>
        )}
        
        <p className="text-center text-[10px] font-bold text-slate-300 uppercase tracking-widest">
            © 2026 Eneo Group — Solutions de Partage Sécurisé
        </p>
      </div>
    </div>
  );
};

export default DownloadPage;
