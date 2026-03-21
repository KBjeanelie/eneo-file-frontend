import React from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, ArrowLeft, Upload, Share2, Clock, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const HowItWorks = () => {
  const steps = [
    {
      icon: <Upload className="w-8 h-8 text-eneo-violet" />,
      title: "1. Upload Sécurisé",
      description: "Glissez vos fichiers jusqu'à 250 Mo dans l'interface. Ils sont instantanément chiffrés et stockés sur nos serveurs haute disponibilité."
    },
    {
      icon: <Share2 className="w-8 h-8 text-eneo-violet" />,
      title: "2. Partage Instantané",
      description: "Générez un lien de partage unique avec un jeton d'accès sécurisé. Vous pouvez définir une limite de téléchargement ou une date d'expiration."
    },
    {
      icon: <Clock className="w-8 h-8 text-eneo-violet" />,
      title: "3. Contrôle Total",
      description: "Suivez en temps réel le nombre de téléchargements et l'utilisation de votre quota de 1 Go depuis votre tableau de bord."
    },
    {
      icon: <Trash2 className="w-8 h-8 text-eneo-violet" />,
      title: "4. Nettoyage Automatique",
      description: "Pour votre confidentialité, les fichiers sont automatiquement supprimés après expiration (3 à 5 jours) ou après avoir atteint leur limite de téléchargement."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-12">
      <Link to="/help" className="inline-flex items-center space-x-2 text-slate-400 hover:text-eneo-violet transition-colors font-bold text-sm group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>Retour au Centre d'aide</span>
      </Link>

      <div className="space-y-4">
        <h1 className="text-4xl font-black text-slate-800 tracking-tight">Comment ça marche ?</h1>
        <p className="text-xl text-slate-500 font-medium">Découvrez comment Eneo File facilite le partage de vos fichiers en toute sécurité.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {steps.map((step, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 space-y-6"
          >
            <div className="w-16 h-16 bg-violet-50 rounded-2xl flex items-center justify-center">
              {step.icon}
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-slate-800">{step.title}</h3>
              <p className="text-slate-500 leading-relaxed">{step.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default HowItWorks;
