import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HelpCircle, 
  ChevronDown, 
  Search, 
  Upload, 
  Share2, 
  ShieldCheck, 
  HardDrive,
  MessageCircle,
  Mail,
  ExternalLink,
  BookOpen,
  LifeBuoy
} from 'lucide-react';
import { Link } from 'react-router-dom';

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-slate-100 last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between text-left group"
      >
        <span className={`font-bold transition-colors ${isOpen ? 'text-eneo-violet' : 'text-slate-700 group-hover:text-eneo-violet'}`}>
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          className="text-slate-400 group-hover:text-eneo-violet transition-colors"
        >
          <ChevronDown size={20} />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pb-6 text-sm text-slate-500 leading-relaxed">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const faqs = [
    {
      category: "Débuter",
      icon: <BookOpen className="w-5 h-5" />,
      items: [
        {
          q: "Comment uploader un fichier ?",
          a: "Cliquez sur le bouton 'Nouveau' dans le sidebar à gauche. Sélectionnez votre fichier, et il sera automatiquement envoyé vers nos serveurs sécurisés. Une fois terminé, vous obtiendrez un lien de partage unique."
        },
        {
          q: "Quelles sont les limites de taille de fichier ?",
          a: "Chaque fichier peut peser jusqu'à 250 Mo. C'est idéal pour partager des documents compressés, des photos haute définition ou de courtes vidéos."
        }
      ]
    },
    {
      category: "Partage & Liens",
      icon: <Share2 className="w-5 h-5" />,
      items: [
        {
          q: "Combien de fois un fichier peut-il être téléchargé ?",
          a: "Par défaut, un fichier peut être téléchargé 3 fois. Vous pouvez modifier cette limite dans les détails du fichier avant ou après l'activation du lien."
        },
        {
          q: "Comment désactiver un lien de partage ?",
          a: "Rendez-vous dans les détails de votre fichier, et utilisez l'interrupteur 'Sécurité du lien' pour le suspendre instantanément. Personne ne pourra y accéder tant que vous ne le réactivez pas."
        }
      ]
    },
    {
        category: "Stockage",
        icon: <HardDrive className="w-5 h-5" />,
        items: [
          {
            q: "Combien d'espace ai-je ?",
            a: "Chaque utilisateur bénéficie d'un quota de 1 Go d'espace de stockage gratuit. Vous pouvez suivre votre consommation en temps réel dans le sidebar ou sur la page dédiée 'Espace de Stockage'."
          },
          {
            q: "Quand mon espace se réinitialise-t-il ?",
            a: "Si votre espace est plein, les fichiers expirent automatiquement après 30 jours (ou selon la date d'expiration définie). Vous pouvez aussi supprimer des fichiers manuellement pour libérer de l'espace immédiatement."
          }
        ]
      },
    {
      category: "Sécurité",
      icon: <ShieldCheck className="w-5 h-5" />,
      items: [
        {
          q: "Mes fichiers sont-ils sécurisés ?",
          a: "Oui, tous vos fichiers sont isolés par utilisateur et accessibles uniquement via des liens cryptés générés par notre plateforme. Nous utilisons Keycloak pour une authentification de niveau industriel."
        }
      ]
    }
  ];

  const filteredFaqs = faqs.map(cat => ({
    ...cat,
    items: cat.items.filter(item => 
      item.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(cat => cat.items.length > 0);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto space-y-12"
    >
      {/* Hero Section */}
      <div className="text-center space-y-6 py-12">
        <div className="inline-flex p-4 bg-violet-50 text-eneo-violet rounded-3xl drive-shadow-sm mb-4">
          <LifeBuoy className="w-10 h-10" />
        </div>
        <h1 className="text-4xl font-black text-slate-800 tracking-tight">Comment pouvons-nous vous aider ?</h1>
        <p className="text-slate-500 max-w-xl mx-auto font-medium">Trouvez des réponses rapides à vos questions ou contactez notre équipe de support.</p>
        
        {/* Search Bar */}
        <div className="max-w-xl mx-auto relative group pt-4">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-eneo-violet transition-colors">
            <Search size={20} />
          </div>
          <input 
            type="text"
            placeholder="Rechercher une aide..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-6 focus:border-eneo-violet/30 focus:ring-4 focus:ring-eneo-violet/5 outline-none transition-all drive-shadow-sm font-bold text-slate-700"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* FAQ Section */}
        <div className="lg:col-span-2 space-y-8">
           {filteredFaqs.length > 0 ? (
             filteredFaqs.map((category, idx) => (
                <div key={idx} className="bg-white rounded-[2.5rem] border border-slate-100 drive-shadow-sm overflow-hidden">
                   <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex items-center space-x-3">
                      <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 text-eneo-violet">
                        {category.icon}
                      </div>
                      <h2 className="text-lg font-black text-slate-800 tracking-tight">{category.category}</h2>
                   </div>
                   <div className="px-8">
                      {category.items.map((item, i) => (
                        <FAQItem key={i} question={item.q} answer={item.a} />
                      ))}
                   </div>
                </div>
             ))
           ) : (
             <div className="bg-white rounded-[2.5rem] border border-slate-100 p-12 text-center text-slate-400">
                Aucun résultat pour "{searchQuery}"
             </div>
           )}
        </div>

        {/* Contact Sidebar */}
        <div className="space-y-6">
           <div className="bg-eneo-gradient rounded-[2.5rem] p-8 text-white relative overflow-hidden drive-shadow">
              <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
              <div className="relative z-10 space-y-6 text-center">
                 <h3 className="text-xl font-black">Besoin d'un humain ?</h3>
                 <p className="text-xs font-bold text-violet-100 leading-relaxed">Si vous ne trouvez pas de réponse, n'hésitez pas à nous contacter directement.</p>
                 <div className="space-y-3">
                    <button className="w-full bg-white text-eneo-violet py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-violet-50 transition-colors flex items-center justify-center space-x-2">
                       <Mail size={16} />
                       <span>Envoyer un email</span>
                    </button>
                    <button className="w-full bg-eneo-gold text-eneo-violet py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-opacity-90 transition-colors flex items-center justify-center space-x-2">
                       <MessageCircle size={16} />
                       <span>Chat Direct</span>
                    </button>
                 </div>
              </div>
           </div>

           <div className="bg-white rounded-[2.5rem] border border-slate-100 drive-shadow-sm p-8 space-y-6">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 border-b border-slate-50 pb-4">Liens Rapides</h3>
               <div className="space-y-4">
                  {[
                    { label: "Comment ça marche ?", path: "/help/how-it-works" },
                    { label: "Sécurité & Protection", path: "/help/security" },
                    { label: "Politique de confidentialité", path: "/help/privacy" }
                  ].map((link, i) => (
                     <Link key={i} to={link.path} className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors group text-left">
                        <span className="text-xs font-bold text-slate-600 group-hover:text-eneo-violet">{link.label}</span>
                        <ExternalLink size={14} className="text-slate-300 group-hover:text-eneo-violet" />
                     </Link>
                  ))}
               </div>
           </div>
        </div>
      </div>

      {/* Footer Support Info */}
      <div className="text-center py-12">
        <p className="text-xs font-black uppercase tracking-widest text-slate-300">
           © 2026 Eneo Group • Centre d'Aide v1.0
        </p>
      </div>
    </motion.div>
  );
};

export default HelpCenter;
