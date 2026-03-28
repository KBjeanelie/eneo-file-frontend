import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/client';
import { Download as DownloadIcon, FileText, AlertTriangle, ShieldCheck, Lock, Key } from 'lucide-react';
import { formatBytes, formatDate } from '../utils/format';
import FileTypeIcon from '../components/ui/FileTypeIcon';
import FilePreview from '../components/ui/FilePreview';
import SecretKeyModal from '../components/ui/SecretKeyModal';

const DownloadPage = () => {
  const { access_token } = useParams();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [unlockedData, setUnlockedData] = useState(null);

  useEffect(() => {
    const fetchFileData = async () => {
      try {
        const response = await api.get(`/d/${access_token}/`);
        setFile(response.data);
        // If file_url is missing, it's protected
        if (!response.data.file_url) {
          setShowKeyModal(true);
        }
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

  const handleKeySubmit = async (secretKey) => {
    try {
      const response = await api.post(`/d/${access_token}/download/`, { secret_key: secretKey });
      setUnlockedData(response.data);
      setShowKeyModal(false);
    } catch (err) {
      const msg = err.response?.data?.error || "Clé secrète incorrecte.";
      throw new Error(msg);
    }
  };

  const handleDownload = () => {
    if (unlockedData?.download_url) {
      window.open(unlockedData.download_url, '_blank');
    } else {
      setShowKeyModal(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 font-outfit">
        <div className="w-12 h-12 border-4 border-eneo-violet border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const isProtected = file && !file.file_url && !unlockedData;
  const currentFileUrl = unlockedData?.download_url || file?.file_url;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-start p-4 py-8 md:py-16 font-outfit">
      <div className="max-w-4xl w-full space-y-10">
        
        {/* Logo Header */}
        <div className="flex items-center justify-center space-x-3 mb-2">
          <div className="bg-eneo-violet p-2.5 rounded-2xl shadow-xl shadow-violet-100">
            <FileText className="w-7 h-7 text-white" />
          </div>
          <span className="text-3xl font-black text-slate-800 tracking-tight">Eneo <span className="text-eneo-violet">File</span></span>
        </div>

        {error ? (
          <div className="max-w-md mx-auto bg-white p-10 rounded-[2.5rem] shadow-2xl border border-slate-100 text-center space-y-6 animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-black text-slate-800">Lien inaccessible</h1>
              <p className="text-slate-500 text-sm leading-relaxed">{error}</p>
            </div>
            <button 
              onClick={() => window.location.href = '/'}
              className="w-full py-4 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold rounded-2xl transition-colors"
            >
              Retour à l'accueil
            </button>
          </div>
        ) : !file ? (
          <div className="max-w-md mx-auto bg-white p-10 rounded-[2.5rem] shadow-2xl border border-slate-100 text-center space-y-4">
            <h1 className="text-xl font-bold text-slate-800">Aucune donnée</h1>
            <p className="text-slate-500 text-sm">Les informations du fichier n'ont pas pu être chargées.</p>
          </div>
        ) : (
          <div className="space-y-10 animate-in slide-in-from-bottom-10 duration-700">
            
            {/* Preview Section */}
            <div className="relative group">
              <FilePreview 
                  fileUrl={currentFileUrl} 
                  mimeType={file.mime_type} 
                  fileName={file.original_name} 
                  isBlurred={isProtected}
              />
              {isProtected && (
                <button 
                  onClick={() => setShowKeyModal(true)}
                  className="absolute inset-0 z-20 w-full h-full flex items-center justify-center bg-transparent group-hover:bg-slate-900/5 transition-colors rounded-[2.5rem]"
                />
              )}
            </div>

            {/* File Info Card */}
            <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden group">
                <div className="p-8 md:p-12 flex flex-col md:flex-row md:items-center justify-between gap-10">
                    <div className="flex items-start space-x-6">
                        <div className="p-5 bg-eneo-light text-eneo-violet rounded-[1.5rem] hidden sm:block shadow-inner">
                            <FileTypeIcon mimeType={file.mime_type} className="w-12 h-12" />
                        </div>
                        <div className="space-y-2 min-w-0">
                            <h1 className="text-2xl md:text-3xl font-black text-slate-800 truncate" title={file.original_name}>
                              {file.original_name}
                            </h1>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-400 font-bold uppercase tracking-wider">
                                <span className="bg-slate-100 px-3 py-1 rounded-lg text-slate-500">{formatBytes(file.file_size)}</span>
                                <span className="flex items-center space-x-2">
                                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                  <span>Expire {formatDate(file.expires_at)}</span>
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex-shrink-0">
                        <button 
                            onClick={handleDownload}
                            className={`w-full md:w-auto ${isProtected ? 'bg-slate-800' : 'bg-eneo-violet hover:bg-violet-800'} text-white font-black px-10 py-5 rounded-2xl shadow-2xl shadow-violet-100 transition-all active:scale-95 flex items-center justify-center space-x-4 group`}
                        >
                            {isProtected ? (
                              <>
                                <Lock className="w-6 h-6" />
                                <span className="uppercase tracking-[0.2em] text-sm">Déverrouiller</span>
                              </>
                            ) : (
                              <>
                                <DownloadIcon className="w-6 h-6 group-hover:animate-bounce" />
                                <span className="uppercase tracking-[0.2em] text-sm">Téléchargement</span>
                              </>
                            )}
                        </button>
                    </div>
                </div>

                <div className="bg-slate-50 py-5 px-10 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      </div>
                      <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">Sécurisé par Eneo Guard System</span>
                    </div>
                    <div className="flex items-center space-x-4">
                       <div className="h-1.5 w-24 bg-slate-200 rounded-full overflow-hidden hidden md:block">
                         <div className="h-full w-full bg-eneo-violet opacity-30 animate-pulse" />
                       </div>
                       <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Version 2.0 Mob-First</span>
                    </div>
                </div>
            </div>
          </div>
        )}
        
        <div className="text-center space-y-4 mt-8">
            <p className="text-[11px] font-black text-slate-300 uppercase tracking-[0.3em]">
                Eneo Ecosystem — Cloud Secure Solutions
            </p>
        </div>
      </div>

      <SecretKeyModal 
        isOpen={showKeyModal} 
        onClose={() => !isProtected && setShowKeyModal(false)}
        onSubmit={handleKeySubmit}
      />
    </div>
  );
};

export default DownloadPage;
