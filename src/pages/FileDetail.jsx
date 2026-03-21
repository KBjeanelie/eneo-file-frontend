import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFiles } from '../hooks/useFiles';
import Header from '../components/layout/Header';
import { ArrowLeft, Trash2, ShieldOff, Save, Clock, Download, HardDrive, BarChart3, MapPin, Globe, Layout, User } from 'lucide-react';
import api from '../api/client';
import { formatBytes, formatDate } from '../utils/format';
import keycloak from '../auth/keycloak';
import FileTypeIcon from '../components/ui/FileTypeIcon';

import FilePreview from '../components/ui/FilePreview';

const FileDetailPage = () => {
// ... existing imports ...

  const { id } = useParams();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ title: '', max_downloads: 3 });
  
  const fetchFileDetail = async () => {
    try {
      const resp = await api.get(`/files/${id}/`);
      setFile(resp.data);
      setFormData({ title: resp.data.title, max_downloads: resp.data.max_downloads });
      
      const statsResp = await api.get(`/files/${id}/stats/`);
      setStats(statsResp.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFileDetail();
  }, [id]);

  const handleUpdate = async () => {
    try {
      const resp = await api.patch(`/files/${id}/`, formData);
      setFile(resp.data);
      setEditing(false);
    } catch (err) {
      alert("Erreur lors de la mise à jour.");
    }
  };

  const handleDeactivate = async () => {
    if (!window.confirm("Voulez-vous vraiment désactiver ce lien ?")) return;
    try {
      await api.post(`/files/${id}/deactivate/`);
      fetchFileDetail();
    } catch (err) {
      alert("Erreur.");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Supprimer définitivement ce fichier ?")) return;
    try {
      await api.delete(`/files/${id}/`);
      navigate('/dashboard');
    } catch (err) {
      alert("Erreur.");
    }
  };

  if (loading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Chargement...</div>;
  if (!file) return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Fichier non trouvé.</div>;

  return (
    <div className="min-h-screen bg-slate-50">
      <Header user={keycloak.tokenParsed} />
      
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-slate-500 hover:text-eneo-violet mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-bold text-sm uppercase tracking-wider">Retour</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Management */}
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              <div className="flex items-start space-x-6">
                <div className="p-4 bg-eneo-light text-eneo-violet rounded-2xl">
                    <FileTypeIcon mimeType={file.mime_type} className="w-12 h-12" />
                </div>
                <div className="flex-1 space-y-1">
                    <div className="flex justify-between">
                        <h1 className="text-2xl font-bold text-slate-800">{file.title}</h1>
                        <div className="flex space-x-2">
                           {!editing ? (
                             <button onClick={() => setEditing(true)} className="p-2 text-slate-400 hover:text-eneo-violet hover:bg-slate-50 rounded-xl transition-all">
                               <BarChart3 className="w-5 h-5" />
                             </button>
                           ) : (
                             <button onClick={handleUpdate} className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-xl transition-all">
                               <Save className="w-5 h-5" />
                             </button>
                           )}
                        </div>
                    </div>
                  <p className="text-sm text-slate-400 font-medium truncate">{file.original_name}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6 mt-10">
                <div className="space-y-1">
                  <div className="flex items-center space-x-1.5 text-slate-400">
                    <HardDrive className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Taille</span>
                  </div>
                  <p className="text-sm font-bold text-slate-700">{formatBytes(file.file_size)}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-1.5 text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Expire le</span>
                  </div>
                  <p className="text-sm font-bold text-slate-700">{formatDate(file.expires_at)}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-1.5 text-slate-400">
                    <Download className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Clis</span>
                  </div>
                  <p className="text-sm font-bold text-slate-700">{file.download_count} / {file.max_downloads}</p>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 overflow-hidden">
              <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Aperçu du fichier</h2>
              <FilePreview 
                fileUrl={file.file_url} 
                mimeType={file.mime_type} 
                fileName={file.original_name} 
              />
            </section>

            <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center space-x-3">
                <BarChart3 className="w-5 h-5 text-eneo-gold" />
                <span>Historique des Téléchargements</span>
              </h2>
              
              {stats.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                                <th className="pb-4 pt-0">IP ADDRESS</th>
                                <th className="pb-4 pt-0">DATE & HEURE</th>
                                <th className="pb-4 pt-0">DEVICE / UA</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {stats.map((stat, idx) => (
                                <tr key={idx} className="group">
                                    <td className="py-4 text-xs font-bold text-slate-700 flex items-center space-x-2">
                                        <Globe className="w-3 h-3 text-slate-300" />
                                        <span>{stat.ip_address}</span>
                                    </td>
                                    <td className="py-4 text-xs text-slate-500">{formatDate(stat.downloaded_at)}</td>
                                    <td className="py-4 text-[10px] text-slate-400 truncate max-w-[200px]" title={stat.user_agent}>
                                        {stat.user_agent}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
              ) : (
                <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <p className="text-slate-400 text-sm italic">Aucun téléchargement enregistré pour le moment.</p>
                </div>
              )}
            </section>
          </div>

          {/* Right Column: Sidebar */}
          <div className="space-y-8">
            <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 space-y-6">
                <h3 className="font-bold text-slate-800 text-sm uppercase tracking-widest border-b border-slate-50 pb-4">Actions de Sécurité</h3>
                
                <div className="space-y-4">
                    <button 
                        onClick={handleDeactivate}
                        disabled={!file.is_active}
                        className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-rose-50 hover:text-rose-600 transition-all group disabled:opacity-50 disabled:pointer-events-none"
                    >
                        <div className="flex items-center space-x-3">
                            <ShieldOff className="w-5 h-5 text-slate-400 group-hover:text-rose-500" />
                            <span className="text-sm font-bold">Désactiver le lien</span>
                        </div>
                    </button>

                    <button 
                        onClick={handleDelete}
                        className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-rose-600 hover:text-white transition-all group"
                    >
                        <div className="flex items-center space-x-3">
                            <Trash2 className="w-5 h-5 text-slate-400 group-hover:text-white" />
                            <span className="text-sm font-bold">Supprimer définitivement</span>
                        </div>
                    </button>
                </div>
            </section>

            <section className="eneo-gradient rounded-3xl p-8 text-white shadow-xl shadow-violet-200">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-black text-[10px] uppercase tracking-[0.2em] opacity-70">Lien Public</h3>
                    <Layout className="w-4 h-4 opacity-50" />
                </div>
                <div className="bg-white/10 p-4 rounded-2xl border border-white/20 break-all text-xs font-mono mb-4 text-violet-100">
                    {file.download_url}
                </div>
                <button 
                    onClick={() => navigator.clipboard.writeText(file.download_url)}
                    className="w-full bg-eneo-gold text-eneo-violet font-black py-3 rounded-xl shadow-lg hover:scale-[1.02] active:scale-95 transition-all text-xs uppercase tracking-widest"
                >
                    Copier le lien
                </button>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FileDetailPage;
