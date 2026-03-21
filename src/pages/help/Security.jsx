import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowLeft, Lock, EyeOff, Server, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

const Security = () => {
  const features = [
    {
      icon: <Lock className="w-6 h-6" />,
      title: "Chiffrement de bout en bout",
      description: "Vos fichiers sont chiffrés dès qu'ils quittent votre navigateur et restent protégés jusqu'au téléchargement final."
    },
    {
      icon: <EyeOff className="w-6 h-6" />,
      title: "Jetons d'accès éphémères",
      description: "Chaque lien de partage utilise un jeton cryptographique à usage limité pour empêcher les accès non autorisés."
    },
    {
      icon: <Server className="w-6 h-6" />,
      title: "Stockage Isolé",
      description: "Vos données sont stockées dans des compartiments isolés (buckets) avec des politiques d'accès strictes."
    },
    {
      icon: <ShieldAlert className="w-6 h-6" />,
      title: "Eneo Guard",
      description: "Notre système scanne les liens pour détecter toute activité suspecte et garantit l'intégrité de vos ressources."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-12">
      <Link to="/help" className="inline-flex items-center space-x-2 text-slate-400 hover:text-eneo-violet transition-colors font-bold text-sm group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>Retour au Centre d'aide</span>
      </Link>

      <div className="space-y-4">
        <h1 className="text-4xl font-black text-slate-800 tracking-tight">Sécurité & Confidentialité</h1>
        <p className="text-xl text-slate-500 font-medium">Votre sécurité est notre priorité absolue. Voici comment nous protégeons vos fichiers.</p>
      </div>

      <div className="bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-eneo-violet/30 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="relative z-10 space-y-8">
            <div className="flex items-center space-x-4">
                <div className="p-3 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-xl">
                    <ShieldCheck className="w-8 h-8 text-eneo-gold" />
                </div>
                <h2 className="text-2xl font-bold">Standard de Sécurité Eneo</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {features.map((f, i) => (
                    <div key={i} className="space-y-3">
                        <div className="text-eneo-gold">{f.icon}</div>
                        <h4 className="font-bold text-lg">{f.title}</h4>
                        <p className="text-slate-400 text-sm leading-relaxed">{f.description}</p>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Security;
 bitumen
