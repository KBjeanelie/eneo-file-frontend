import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFiles } from '../hooks/useFiles';
import Header from '../components/layout/Header';
import Sidebar from '../components/layout/Sidebar';
import { 
  ArrowLeft, 
  Trash2, 
  Shield, 
  ShieldOff, 
  Save, 
  Clock, 
  Download, 
  HardDrive, 
  BarChart3, 
  Globe, 
  Layout, 
  Edit3,
  X,
  ExternalLink,
  ChevronRight,
  Settings
} from 'lucide-react';
import api from '../api/client';
import { formatBytes, formatDate } from '../utils/format';
import keycloak from '../auth/keycloak';
import FileTypeIcon from '../components/ui/FileTypeIcon';
import FilePreview from '../components/ui/FilePreview';
import { motion, AnimatePresence } from 'framer-motion';

const FileDetailPage = () => {
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

  const handleToggleActive = async () => {
    const action = file.is_active ? 'deactivate' : 'activate';
    try {
      await api.post(`/files/${id}/${action}/`);
      fetchFileDetail();
    } catch (err) {
      alert("Erreur lors de la modification du statut.");
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

  if (loading) {
    return (
      <div className="h-screen bg-white flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-10 h-10 border-4 border-eneo-violet border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!file) {
    return (
      <div className="h-screen bg-white flex flex-col items-center justify-center space-y-4">
        <p className="text-slate-500 font-bold">Fichier non trouvé.</p>
        <button onClick={() => navigate('/dashboard')} className="text-eneo-violet font-bold hover:underline">Retour au tableau de bord</button>
      </div>
    );
  }

  return (
    <div className="h-screen bg-white flex flex-col overflow-hidden text-slate-700">
      <Header user={keycloak.tokenParsed} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar onNewFile={() => navigate('/dashboard')} />

        <main className="flex-1 overflow-y-auto bg-slate-50/50 p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            {/* Breadcrumbs */}
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-400 mb-6 uppercase tracking-widest">
               <button onClick={() => navigate('/dashboard')} className="hover:text-eneo-violet transition-colors">Mes Fichiers</button>
               <ChevronRight size={12} />
               <span className="text-slate-600 truncate max-w-[200px]">{file.title || file.original_name}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Preview & Stats */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Main Info Card */}
                <motion.section 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-3xl p-6 md:p-8 drive-shadow-sm border border-slate-100"
                >
                  <div className="flex flex-col md:flex-row md:items-start space-y-4 md:space-y-0 md:space-x-8">
                    <div className="p-6 bg-slate-50 text-slate-400 rounded-3xl drive-shadow-sm self-start">
                        <FileTypeIcon mimeType={file.mime_type} className="w-14 h-14" />
                    </div>
                    
                    <div className="flex-1 space-y-4">
                        <div className="flex justify-between items-start">
                            <div className="flex-1 min-w-0">
                                {editing ? (
                                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                                    <input 
                                      type="text" 
                                      value={formData.title} 
                                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                                      className="w-full text-2xl font-bold text-slate-800 border-b-2 border-eneo-violet focus:outline-none bg-slate-50 px-3 py-2 rounded-t-xl"
                                      autoFocus
                                    />
                                    <div className="flex items-center space-x-3">
                                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Limite téléchargements :</span>
                                      <input 
                                        type="number" 
                                        value={formData.max_downloads} 
                                        onChange={(e) => setFormData({...formData, max_downloads: parseInt(e.target.value)})}
                                        className="w-20 text-sm font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:border-eneo-violet outline-none"
                                      />
                                    </div>
                                  </motion.div>
                                ) : (
                                  <h1 className="text-3xl font-bold text-slate-900 truncate" title={file.title}>{file.title}</h1>
                                )}
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1 opacity-60 italic">{file.original_name}</p>
                            </div>
                            
                            <div className="flex items-center space-x-2 ml-4">
                               <AnimatePresence mode="wait">
                                  {!editing ? (
                                    <motion.button 
                                      key="edit"
                                      initial={{ opacity: 0, scale: 0.8 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      exit={{ opacity: 0, scale: 0.8 }}
                                      onClick={() => setEditing(true)} 
                                      className="p-3 text-slate-400 hover:text-eneo-violet hover:bg-violet-50 rounded-2xl transition-all drive-shadow-sm border border-slate-100 bg-white"
                                    >
                                       <Edit3 size={20} />
                                    </motion.button>
                                  ) : (
                                    <motion.div 
                                      key="actions"
                                      initial={{ opacity: 0, x: 20 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      exit={{ opacity: 0, x: 20 }}
                                      className="flex space-x-2"
                                    >
                                      <button 
                                        onClick={() => setEditing(false)} 
                                        className="p-2.5 text-slate-400 hover:bg-slate-100 rounded-xl transition-all text-[10px] font-black uppercase tracking-widest px-4 border border-slate-100"
                                      >
                                        Annuler
                                      </button>
                                      <button 
                                        onClick={handleUpdate} 
                                        className="p-2.5 bg-eneo-violet text-white hover:shadow-lg hover:shadow-violet-200 rounded-xl transition-all flex items-center space-x-2 px-5"
                                      >
                                        <Save size={16} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Sauver</span>
                                      </button>
                                    </motion.div>
                                  )}
                               </AnimatePresence>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-4">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-1.5 text-slate-400">
                              <HardDrive size={14} />
                              <span className="text-[10px] font-black uppercase tracking-widest">Taille</span>
                            </div>
                            <p className="text-sm font-bold text-slate-700">{formatBytes(file.file_size)}</p>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center space-x-1.5 text-slate-400">
                              <Clock size={14} />
                              <span className="text-[10px] font-black uppercase tracking-widest">Expiration</span>
                            </div>
                            <p className="text-sm font-bold text-slate-700">{formatDate(file.expires_at)}</p>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center space-x-1.5 text-slate-400">
                              <Download size={14} />
                              <span className="text-[10px] font-black uppercase tracking-widest">Succès</span>
                            </div>
                            <p className="text-sm font-bold text-slate-700">{file.download_count} / {file.max_downloads}</p>
                          </div>
                        </div>
                    </div>
                  </div>
                </motion.section>

                {/* Preview Section */}
                <motion.section 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-3xl p-6 md:p-8 drive-shadow-sm border border-slate-100"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Aperçu de Sécurité</h2>
                    <div className="px-3 py-1 bg-slate-50 rounded-full text-[10px] font-bold text-slate-400 border border-slate-100 italic">Pre-visualisation</div>
                  </div>
                  <div className="rounded-2xl overflow-hidden border border-slate-50 bg-slate-50/30">
                    <FilePreview 
                      fileUrl={file.file_url} 
                      mimeType={file.mime_type} 
                      fileName={file.original_name} 
                    />
                  </div>
                </motion.section>

                {/* History Section */}
                <motion.section 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-3xl p-6 md:p-8 drive-shadow-sm border border-slate-100"
                >
                  <div className="flex items-center justify-between mb-8">
                     <h2 className="text-xl font-bold text-slate-800">Historique d'accès</h2>
                     <div className="flex items-center space-x-2 text-eneo-gold">
                        <BarChart3 size={18} />
                        <span className="text-xs font-bold uppercase tracking-widest">{stats.length} clics</span>
                     </div>
                  </div>
                  
                  {stats.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-[10px] font-black text-slate-300 uppercase tracking-widest border-b border-slate-50">
                                    <th className="pb-4 pt-0">Adresse IP</th>
                                    <th className="pb-4 pt-0">Date & Heure</th>
                                    <th className="pb-4 pt-0 text-right">Appareil / Navigateur</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {stats.map((stat, idx) => (
                                    <tr key={idx} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="py-4 text-xs font-bold text-slate-600 flex items-center space-x-2">
                                            <Globe size={14} className="text-slate-300 group-hover:text-eneo-violet transition-colors" />
                                            <span>{stat.ip_address}</span>
                                        </td>
                                        <td className="py-4 text-[11px] text-slate-400">{formatDate(stat.downloaded_at)}</td>
                                        <td className="py-4 text-[10px] text-slate-400 text-right max-w-[150px] truncate italic" title={stat.user_agent}>
                                            {stat.user_agent}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                  ) : (
                    <div className="text-center py-16 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                        <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center drive-shadow-sm mx-auto mb-4">
                           <Globe size={20} className="text-slate-300" />
                        </div>
                        <p className="text-slate-400 text-sm font-bold">Aucune activité pour le moment</p>
                    </div>
                  )}
                </motion.section>
              </div>

              {/* Right Column: Actions & Link */}
              <div className="space-y-6">
                
                {/* Link Sharing Card */}
                <motion.section 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`rounded-[2rem] p-8 text-white shadow-2xl transition-all duration-700 relative overflow-hidden ${
                    file.is_active ? 'eneo-gradient' : 'bg-slate-400'
                  }`}
                >
                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                    <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-24 h-24 bg-black/10 rounded-full blur-xl" />

                    <div className="relative z-10 space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="font-black text-[10px] uppercase tracking-[0.3em] opacity-60">
                              {file.is_active ? 'Lien de partage' : 'Accès Suspendu'}
                            </h3>
                            <div className={`p-2 rounded-xl bg-white/20 backdrop-blur-md border border-white/20`}>
                               {file.is_active ? <Layout size={18} /> : <X size={18} />}
                            </div>
                        </div>
                        
                        {file.is_active ? (
                          <>
                            <div className="bg-white/10 backdrop-blur-md p-5 rounded-[1.5rem] border border-white/10 break-all text-[11px] font-mono shadow-inner text-violet-100 flex items-center justify-between group">
                                <span className="truncate flex-1 pr-2">{file.download_url}</span>
                                <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                            </div>
                            <motion.button 
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => {
                                   navigator.clipboard.writeText(file.download_url);
                                   // Simple internal feedback toast can be added
                                }}
                                className="w-full bg-eneo-gold text-eneo-violet font-black py-4 rounded-2xl shadow-xl hover:shadow-eneo-gold/20 transition-all text-xs uppercase tracking-[0.2em]"
                            >
                                Copier le lien
                            </motion.button>
                          </>
                        ) : (
                          <div className="bg-black/10 p-6 rounded-[1.5rem] border border-white/5 text-center space-y-3">
                            <ShieldOff size={32} className="mx-auto opacity-40" />
                            <p className="text-xs font-bold leading-relaxed px-2 opacity-80">
                              Ce lien est temporairement inactif. Personne ne peut télécharger le fichier actuellement.
                            </p>
                          </div>
                        )}
                    </div>
                </motion.section>

                {/* Actions Sidebar Card */}
                <motion.section 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-3xl p-6 md:p-8 drive-shadow-sm border border-slate-100 space-y-6"
                >
                    <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-widest border-b border-slate-50 pb-4 flex items-center space-x-2">
                       <Settings size={12} />
                       <span>Contrôle d'accès</span>
                    </h3>
                    
                    <div className="space-y-3">
                        <button 
                            onClick={handleToggleActive}
                            className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all group ${
                              file.is_active 
                                ? 'bg-slate-50 hover:bg-rose-50 hover:text-rose-600' 
                                : 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                            }`}
                        >
                            <div className="flex items-center space-x-3">
                                {file.is_active ? (
                                  <>
                                    <ShieldOff className="w-5 h-5 text-slate-400 group-hover:text-rose-500 transition-colors" />
                                    <span className="text-sm font-bold">Désactiver le lien</span>
                                  </>
                                ) : (
                                  <>
                                    <Shield className="w-5 h-5 text-emerald-600" />
                                    <span className="text-sm font-black uppercase tracking-tighter">Réactiver</span>
                                  </>
                                )}
                            </div>
                        </button>

                        <button 
                            onClick={handleDelete}
                            className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-rose-600 hover:text-white transition-all group"
                        >
                            <div className="flex items-center space-x-3">
                                <Trash2 className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                                <span className="text-sm font-bold">Supprimer</span>
                            </div>
                        </button>
                    </div>
                </motion.section>

              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default FileDetailPage;
