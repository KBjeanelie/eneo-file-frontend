import React, { useEffect } from 'react';
import { useFiles } from '../hooks/useFiles';
import { Clock, Info } from 'lucide-react';
import FileCard from '../components/ui/FileCard';
import { motion } from 'framer-motion';

const RecentFiles = () => {
  const { recentFiles, loading, fetchRecentFiles } = useFiles();

  useEffect(() => {
    fetchRecentFiles();
  }, [fetchRecentFiles]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-amber-50 text-amber-500 rounded-xl">
            <Clock size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Fichiers Récents</h1>
            <p className="text-sm text-slate-400">Historique de vos 10 derniers uploads</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-44 bg-slate-50 border border-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : recentFiles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recentFiles.map(file => (
            <FileCard key={file.id} file={file} viewMode="grid" />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
          <Clock size={48} className="text-slate-200 mb-4" />
          <p className="text-slate-400 font-bold">Aucune activité récente</p>
          <p className="text-slate-300 text-xs mt-1">Vos nouveaux fichiers apparaîtront ici</p>
        </div>
      )}

      <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6 flex items-start space-x-4">
        <Info className="w-6 h-6 text-blue-500 mt-0.5" />
        <div className="space-y-1">
          <p className="text-sm font-bold text-blue-900">À propos de l'historique</p>
          <p className="text-xs text-blue-700 leading-relaxed">
            Cette page affiche vos téléchargements les plus récents. Pour voir l'intégralité de vos fichiers, rendez-vous dans la section "Mes Fichiers". Les fichiers supprimés ou expirés ne sont plus visibles ici.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RecentFiles;
