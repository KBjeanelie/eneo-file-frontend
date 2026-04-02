import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useFiles } from '../hooks/useFiles';
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
  Settings,
  Copy,
  Key,
  RefreshCw,
  Check
} from 'lucide-react';
import api from '../api/client';
import { formatBytes, formatDate } from '../utils/format';
import keycloak from '../auth/keycloak';
import { getSecureDownloadUrl } from '../utils/url';
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
  const [copiedKey, setCopiedKey] = useState(false);
  const { regenerateSecretKey } = useFiles();
  
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
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 animate-in fade-in duration-700"
    >
      {/* File Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-8">
        <div className="flex items-center space-x-4">
          <Link to="/dashboard" className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div className="p-3 bg-slate-50 rounded-2xl text-eneo-violet">
            <FileTypeIcon mimeType={file.mime_type} className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">{file.title || file.original_name}</h1>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
              Partagé le {formatDate(file.created_at)}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setEditing(true)}
            className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all drive-shadow-sm flex items-center space-x-2"
          >
            <Edit3 size={14} />
            <span>Modifier</span>
          </button>
          <button 
            onClick={() => window.location.assign(file.direct_download_url)}
            className="px-5 py-2.5 bg-eneo-violet text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-violet-800 transition-all shadow-lg shadow-eneo-violet/20 flex items-center space-x-2"
          >
            <Download size={14} />
            <span>Télécharger</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Preview & History */}
        <div className="lg:col-span-2 space-y-8">
          {/* Main Preview Card */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 drive-shadow-sm p-2 overflow-hidden">
             <div className="bg-slate-50 rounded-[2rem] overflow-hidden min-h-[400px] flex items-center justify-center">
                <FilePreview fileUrl={file.file_url} mimeType={file.mime_type} fileName={file.original_name} />
             </div>
          </div>

          {/* History Section */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 drive-shadow-sm overflow-hidden">
             <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-800">Historique des accès</h2>
                <div className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500">
                   {stats.length} téléchargements
                </div>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                   <thead>
                      <tr className="bg-slate-50/50">
                         <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Date et Heure</th>
                         <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Adresse IP</th>
                         <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Navigateur</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50">
                      {stats.map((stat, i) => (
                         <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-8 py-4 text-xs font-medium text-slate-600">{formatDate(stat.downloaded_at)}</td>
                            <td className="px-8 py-4 text-xs font-bold text-slate-800 font-mono">{stat.ip_address}</td>
                            <td className="px-8 py-4 text-[10px] text-slate-400 truncate max-w-[200px]">{stat.user_agent}</td>
                         </tr>
                      ))}
                      {stats.length === 0 && (
                        <tr>
                           <td colSpan="3" className="px-8 py-12 text-center text-slate-400 text-sm italic">Aucun téléchargement enregistré pour le moment.</td>
                        </tr>
                      )}
                   </tbody>
                </table>
             </div>
          </div>
        </div>

        {/* Right Column: Properties & Link Sharing */}
        <div className="space-y-8">
          {/* Status Card */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 drive-shadow-sm p-8 space-y-6">
             <div className="flex items-center justify-between">
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">Statut du lien</h3>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${file.is_active ? 'bg-emerald-50 text-emerald-500 border-emerald-100' : 'bg-rose-50 text-rose-500 border-rose-100'}`}>
                   {file.is_active ? 'Actif' : 'Inactif'}
                </span>
             </div>

             <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between group">
                <div className="flex items-center space-x-4">
                   <div className={`p-3 rounded-xl transition-colors ${file.is_active ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'}`}>
                      {file.is_active ? <Shield size={20} /> : <ShieldOff size={20} />}
                   </div>
                   <div>
                      <p className="text-xs font-bold text-slate-700">Sécurité du lien</p>
                      <p className="text-[10px] text-slate-400">{file.is_active ? 'Visible par tous' : 'Accès bloqué'}</p>
                   </div>
                </div>
                <button 
                  onClick={handleToggleActive}
                  className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${file.is_active ? 'bg-emerald-500' : 'bg-slate-300'}`}
                >
                  <motion.div 
                    animate={{ x: file.is_active ? 26 : 2 }}
                    className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-sm"
                  />
                </button>
             </div>

             <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between text-xs px-1">
                   <span className="text-slate-400 font-bold uppercase tracking-widest">Lien de partage</span>
                   <button onClick={() => {
                      navigator.clipboard.writeText(file.download_url);
                      alert("Lien copié !");
                   }} className="text-eneo-violet font-black uppercase tracking-widest hover:text-violet-800 flex items-center space-x-1">
                      <Copy size={12} />
                      <span>Copier</span>
                   </button>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 break-all font-mono text-[10px] text-slate-500 leading-relaxed shadow-inner">
                   {file.download_url}
                </div>
             </div>
          </div>

          {/* Details Card */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 drive-shadow-sm p-8 space-y-6">
             <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">Détails techniques</h3>
             <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl">
                   <div className="flex items-center space-x-3 text-slate-500">
                      <HardDrive size={16} />
                      <span className="text-xs font-bold">Taille</span>
                   </div>
                   <span className="text-xs font-black text-slate-700">{formatBytes(file.file_size)}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-eneo-violet/10">
                   <div className="flex items-center space-x-3 text-slate-500">
                      <Key size={16} className="text-eneo-violet" />
                      <span className="text-xs font-bold">Clé Secrète</span>
                   </div>
                   <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono font-black tracking-widest text-slate-800">{file.secret_key}</span>
                      <button 
                         onClick={() => {
                            navigator.clipboard.writeText(file.secret_key);
                            setCopiedKey(true);
                            setTimeout(() => setCopiedKey(false), 2000);
                         }}
                         className={`p-1.5 rounded-lg transition-all ${copiedKey ? 'text-emerald-500' : 'text-slate-300 hover:text-eneo-violet'}`}
                      >
                         {copiedKey ? <Check size={14} /> : <Copy size={14} />}
                      </button>
                      <button 
                         onClick={async () => {
                            const newKey = await regenerateSecretKey(file.id);
                            setFile({...file, secret_key: newKey});
                         }}
                         className="p-1.5 text-slate-300 hover:text-eneo-violet rounded-lg transition-all"
                         title="Régénérer"
                      >
                         <RefreshCw size={14} />
                      </button>
                   </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl">
                   <div className="flex items-center space-x-3 text-slate-500">
                      <Download size={16} />
                      <span className="text-xs font-bold">Téléchargements</span>
                   </div>
                   <span className="text-xs font-black text-slate-700">{file.download_count} / {file.max_downloads || '∞'}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl">
                   <div className="flex items-center space-x-3 text-slate-500">
                      <Clock size={16} />
                      <span className="text-xs font-bold">Expire le</span>
                   </div>
                   <span className="text-xs font-black text-slate-700">{formatDate(file.expires_at)}</span>
                </div>
             </div>
          </div>

          <button 
             onClick={handleDelete}
             className="w-full py-4 bg-rose-50 text-rose-500 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-rose-500 hover:text-white transition-all border border-rose-100 flex items-center justify-center space-x-3"
          >
             <Trash2 size={16} />
             <span>Supprimer définitivement</span>
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-[3rem] p-10 max-w-lg w-full shadow-2xl space-y-8"
            >
              <div className="flex items-center justify-between">
                 <h2 className="text-2xl font-black text-slate-800 tracking-tight">Modifier le fichier</h2>
                 <button onClick={() => setEditing(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">×</button>
              </div>

              <div className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Titre du fichier</label>
                    <input 
                      type="text" 
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full bg-slate-100 border-transparent rounded-2xl py-4 px-6 focus:bg-white focus:ring-4 focus:ring-eneo-violet/10 focus:border-eneo-violet/20 transition-all font-bold text-slate-700"
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Téléchargements Max</label>
                       <input 
                         type="number" 
                         value={formData.max_downloads}
                         onChange={(e) => setFormData({...formData, max_downloads: parseInt(e.target.value) || 0})}
                         className="w-full bg-slate-100 border-transparent rounded-2xl py-4 px-6 focus:bg-white focus:ring-4 focus:ring-eneo-violet/10 focus:border-eneo-violet/20 transition-all font-bold text-slate-700"
                       />
                    </div>
                    {/* Add expiration update if needed, but for now just title and max_downloads as in previous logic */}
                 </div>
              </div>

              <div className="flex space-x-4 pt-4">
                 <button onClick={() => setEditing(false)} className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all">
                    Annuler
                 </button>
                 <button onClick={handleUpdate} className="flex-1 py-4 bg-eneo-violet text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-violet-800 transition-all shadow-xl shadow-eneo-violet/20">
                    Sauvegarder
                 </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default FileDetailPage;
