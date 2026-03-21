import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon, 
  Moon, 
  Sun, 
  Globe, 
  Shield, 
  Bell, 
  Download, 
  Trash2, 
  Save,
  CheckCircle,
  AlertCircle,
  FileText,
  Clock,
  User
} from 'lucide-react';
import { useSettings } from '../hooks/useSettings';
import api from '../api/client';

const Settings = () => {
    const { settings, loading, updateSettings } = useSettings();
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);
    const [localSettings, setLocalSettings] = useState(null);

    // Sync local state when settings are loaded
    React.useEffect(() => {
        if (!loading && settings) {
            setLocalSettings(settings);
        }
    }, [loading, settings]);

    const handleSave = async () => {
        setSaving(true);
        setMessage(null);
        try {
            await updateSettings(localSettings);
            setMessage({ type: 'success', text: 'Paramètres enregistrés avec succès !' });
            setTimeout(() => setMessage(null), 3000);
        } catch (err) {
            setMessage({ type: 'error', text: 'Erreur lors de l\'enregistrement.' });
        } finally {
            setSaving(false);
        }
    };

    const handleExport = async () => {
        try {
            const response = await api.get('/files/export_csv/', { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'eneo_files_export.csv');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error("Export failed", err);
        }
    };

    const handleCleanup = async () => {
        if (window.confirm("Voulez-vous vraiment supprimer tous vos fichiers expirés ?")) {
            try {
                const resp = await api.post('/files/cleanup_expired/');
                alert(resp.data.message);
            } catch (err) {
                console.error("Cleanup failed", err);
            }
        }
    };

    if (loading || !localSettings) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-eneo-violet border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                    <SettingsIcon className="text-eneo-violet" />
                    Paramètres
                </h1>
                <p className="text-slate-500 mt-2">Gérez vos préférences et votre compte Eneo File.</p>
            </header>

            {message && (
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-xl mb-6 flex items-center gap-3 ${
                        message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                    }`}
                >
                    {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                    {message.text}
                </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Sidebar Navigation */}
                <div className="md:col-span-1 space-y-1">
                    <button className="w-full flex items-center gap-3 px-4 py-3 bg-eneo-violet text-white rounded-xl shadow-md font-medium">
                        <User size={18} /> Général
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-100 rounded-xl transition">
                        <Shield size={18} /> Confidentialité
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-100 rounded-xl transition">
                        <Bell size={18} /> Notifications
                    </button>
                </div>

                {/* Main Content */}
                <div className="md:col-span-2 space-y-8">
                    {/* Appearance */}
                    <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <Moon size={18} className="text-eneo-violet" />
                            Apparence
                        </h2>
                        
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-semibold text-slate-700">Mode sombre</p>
                                <p className="text-sm text-slate-500">Activer le thème sombre pour l'application</p>
                            </div>
                            <button 
                                onClick={() => setLocalSettings({...localSettings, dark_mode: !localSettings.dark_mode})}
                                className={`relative w-14 h-8 rounded-full transition-colors duration-200 ${localSettings.dark_mode ? 'bg-eneo-violet' : 'bg-slate-200'}`}
                            >
                                <span className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow transition-transform duration-200 ${localSettings.dark_mode ? 'translate-x-6' : ''}`} />
                            </button>
                        </div>
                        
                        <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
                            <div>
                                <p className="font-semibold text-slate-700">Langue</p>
                                <p className="text-sm text-slate-500">Choisir la langue de l'interface</p>
                            </div>
                            <select 
                                value={localSettings.language}
                                onChange={(e) => setLocalSettings({...localSettings, language: e.target.value})}
                                className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-eneo-violet/20"
                            >
                                <option value="fr">Français</option>
                                <option value="en">English</option>
                            </select>
                        </div>
                    </section>

                    {/* Default Sharing Options */}
                    <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <Shield size={18} className="text-eneo-violet" />
                            Partage par défaut
                        </h2>
                        
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-semibold text-slate-700">Expire après (jours)</p>
                                    <p className="text-sm text-slate-500">Délai d'expiration automatique des nouveaux liens</p>
                                </div>
                                <input 
                                    type="number"
                                    min="1"
                                    max="30"
                                    value={localSettings.default_expiration_days}
                                    onChange={(e) => setLocalSettings({...localSettings, default_expiration_days: parseInt(e.target.value)})}
                                    className="w-20 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-right"
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-semibold text-slate-700">Téléchargements max.</p>
                                    <p className="text-sm text-slate-500">Nombre de téléchargements autorisés par défaut</p>
                                </div>
                                <input 
                                    type="number"
                                    min="1"
                                    max="100"
                                    value={localSettings.default_max_downloads}
                                    onChange={(e) => setLocalSettings({...localSettings, default_max_downloads: parseInt(e.target.value)})}
                                    className="w-20 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-right"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Data Management */}
                    <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 border-dashed">
                        <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <Save size={18} className="text-eneo-violet" />
                            Données & Stockage
                        </h2>
                        
                        <div className="space-y-4">
                            <button 
                                onClick={handleExport}
                                className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition">
                                        <FileText size={18} />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-semibold text-slate-700">Exporter mes données (CSV)</p>
                                        <p className="text-xs text-slate-500">Liste complète de vos fichiers et liens</p>
                                    </div>
                                </div>
                                <Download size={18} className="text-slate-400" />
                            </button>

                            <button 
                                onClick={handleCleanup}
                                className="w-full flex items-center justify-between p-4 bg-red-50 hover:bg-red-100 rounded-xl transition group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-red-100 text-red-600 rounded-lg group-hover:bg-red-600 group-hover:text-white transition">
                                        <Trash2 size={18} />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-semibold text-red-700">Nettoyer les fichiers expirés</p>
                                        <p className="text-xs text-red-500">Supprimer définitivement tous les liens inactifs</p>
                                    </div>
                                </div>
                                <AlertCircle size={18} className="text-red-300" />
                            </button>
                        </div>
                    </section>

                    {/* Action Bar */}
                    <div className="flex justify-end gap-3 pt-4">
                        <button className="px-6 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-xl transition">
                            Annuler
                        </button>
                        <button 
                            onClick={handleSave}
                            disabled={saving}
                            className="px-8 py-2 bg-eneo-violet text-white font-bold rounded-xl shadow-lg hover:shadow-violet-200 transition flex items-center gap-2 disabled:opacity-50"
                        >
                            {saving ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div> : <Save size={18} />}
                            {saving ? 'Enregistrement...' : 'Enregistrer'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
