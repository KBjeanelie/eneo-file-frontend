import React from 'react';
import { ArrowLeft, Book } from 'lucide-react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-12">
      <Link to="/help" className="inline-flex items-center space-x-2 text-slate-400 hover:text-eneo-violet transition-colors font-bold text-sm group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>Retour au Centre d'aide</span>
      </Link>

      <div className="space-y-10">
        <div className="space-y-4">
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">Politique de Confidentialité</h1>
          <p className="text-xl text-slate-500 font-medium italic">Dernière mise à jour : 21 Mars 2026</p>
        </div>

        <div className="prose prose-slate max-w-none space-y-8">
          <section className="space-y-4 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center space-x-3">
                <div className="w-8 h-8 bg-violet-50 rounded-lg flex items-center justify-center text-eneo-violet">1</div>
                <span>Données Collectées</span>
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Nous collectons uniquement les données nécessaires au fonctionnement du service : votre identifiant utilisateur (Keycloak), les métadonnées des fichiers uploadés (nom, taille, type) et les statistiques de téléchargement. Nous ne lisons jamais le contenu de vos fichiers.
            </p>
          </section>

          <section className="space-y-4 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center space-x-3">
                <div className="w-8 h-8 bg-violet-50 rounded-lg flex items-center justify-center text-eneo-violet">2</div>
                <span>Conservation des Fichiers</span>
            </h2>
            <p className="text-slate-600 leading-relaxed">
               Les fichiers sont conservés temporairement pour une durée maximale de 5 jours. Après expiration ou suppression manuelle, ils sont définitivement effacés de nos serveurs et de nos infrastructures de stockage Cloudinary.
            </p>
          </section>

          <section className="space-y-4 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center space-x-3">
                <div className="w-8 h-8 bg-violet-50 rounded-lg flex items-center justify-center text-eneo-violet">3</div>
                <span>Partage et Tiers</span>
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Vos liens de partage ne sont accessibles que par les personnes possédant le jeton d'accès unique. Nous ne vendons ni ne partageons vos données personnelles avec des tiers à des fins commerciales.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
