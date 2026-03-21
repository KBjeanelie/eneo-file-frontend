import React, { useEffect, useState } from 'react';
import { useFiles } from '../hooks/useFiles';
import Header from '../components/layout/Header';
import DropZone from '../components/ui/DropZone';
import FileCard from '../components/ui/FileCard';
import UploadProgress from '../components/ui/UploadProgress';
import { AlertCircle, CheckCircle2, Copy, ExternalLink, RefreshCw } from 'lucide-react';
import keycloak from '../auth/keycloak';

const Dashboard = () => {
  const { files, loading, error, uploadProgress, fetchFiles, uploadFile, setError } = useFiles();
  const [currentUpload, setCurrentUpload] = useState(null);
  const [lastUploadResult, setLastUploadResult] = useState(null);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const handleFileSelect = async (file) => {
    setCurrentUpload(file);
    try {
      const result = await uploadFile(file);
      setLastUploadResult(result);
      setCurrentUpload(null);
    } catch (err) {
      setCurrentUpload(null);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // Simple feedback logic could go here
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header user={keycloak.tokenParsed} />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Hero / Upload Section */}
          <section className="text-center space-y-4">
            <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
              Partagez vos fichiers <span className="text-eneo-violet italic">instantanément</span>
            </h1>
            <p className="text-slate-500 max-w-lg mx-auto">
              Glissez et déposez n'importe quel fichier pour générer un lien de téléchargement sécurisé et éphémère.
            </p>
            
            <div className="flex flex-wrap justify-center gap-2 mt-4 max-w-2xl mx-auto px-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 w-full mb-1">Formats supportés</span>
              {["PDF", "JPG/PNG/GIF/WEBP", "DOCX/XLSX/PPTX", "MP4/MKV/MOV/AVI", "MP3", "ZIP"].map((ext) => (
                <span key={ext} className="px-2 py-1 bg-white border border-slate-100 rounded-lg text-[9px] font-bold text-slate-500 shadow-sm">
                  {ext}
                </span>
              ))}
              <span className="text-[10px] text-slate-400 mt-1 w-full italic">Et bien d'autres (TXT, CSV, WMV, FLV, WEBM...)</span>
            </div>
          </section>

          {/* Upload Area */}
          <section className="space-y-4">
            {!currentUpload ? (
              <DropZone onFileSelect={handleFileSelect} isUploading={!!currentUpload} />
            ) : (
              <UploadProgress 
                file={currentUpload} 
                progress={uploadProgress} 
                onCancel={() => setCurrentUpload(null)} 
              />
            )}

            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl flex items-center space-x-3 text-sm animate-in fade-in zoom-in duration-300">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="font-medium">{error}</p>
              </div>
            )}

            {lastUploadResult && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-5 rounded-2xl space-y-3 animate-in fade-in slide-in-from-top-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span className="font-bold">Fichier uploadé avec succès !</span>
                </div>
                <div className="flex items-center space-x-2 bg-white p-3 rounded-xl border border-emerald-100 shadow-sm">
                  <code className="text-xs flex-1 truncate">{lastUploadResult.download_url || 'Génération du lien...'}</code>
                  <button 
                    onClick={() => copyToClipboard(lastUploadResult.download_url)}
                    className="p-2 hover:bg-emerald-50 text-emerald-600 rounded-lg transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                {lastUploadResult.expires_at && (
                  <p className="text-xs text-emerald-600 font-medium">
                    Expire le : {new Date(lastUploadResult.expires_at).toLocaleString()}
                  </p>
                )}
              </div>
            )}
          </section>

          {/* List Section */}
          <section className="space-y-6 pt-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800 flex items-center space-x-2">
                <span>Mes Fichiers</span>
                <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full text-xs">{files.length}</span>
              </h2>
              <button 
                onClick={fetchFiles}
                className="p-2 text-slate-400 hover:text-eneo-violet transition-colors"
                title="Actualiser"
              >
                <RefreshCw className={loading ? "w-5 h-5 animate-spin" : "w-5 h-5"} />
              </button>
            </div>

            {loading && files.length === 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-48 bg-slate-200 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : files.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {files.map(file => (
                  <FileCard key={file.id} file={file} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
                <p className="text-slate-400 font-medium">Vous n'avez pas encore partagé de fichiers.</p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
