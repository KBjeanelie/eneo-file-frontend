import React from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Zap, 
  Cloud, 
  Users, 
  Briefcase, 
  Globe, 
  CheckCircle2, 
  ArrowRight,
  Upload,
  Clock,
  Lock,
  Smartphone
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import keycloak, { login } from '../auth/keycloak';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    if (keycloak.authenticated) {
      navigate('/dashboard');
    } else {
      login();
    }
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-outfit overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-eneo-gradient p-2 rounded-xl shadow-lg">
              <Cloud className="text-eneo-violet w-10 h-10" />
            </div>
            <span className="text-xl font-black text-slate-800 tracking-tight">Eneo <span className="text-eneo-violet">File</span></span>
          </div>
          <button 
            onClick={handleStart}
            className="px-6 py-2.5 bg-eneo-violet text-white rounded-full font-bold text-sm shadow-lg shadow-eneo-violet/30 hover:shadow-eneo-violet/50 hover:-translate-y-0.5 transition-all"
          >
            Se Connecter
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial="initial"
            animate="animate"
            variants={stagger}
            className="space-y-8"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center space-x-2 px-4 py-2 bg-violet-50 text-eneo-violet rounded-full text-xs font-black uppercase tracking-widest">
              <Zap size={14} className="fill-current" />
              <span>Nouveau : Uploads jusqu'à 250 Mo</span>
            </motion.div>
            
            <motion.h1 variants={fadeInUp} className="text-5xl lg:text-7xl font-black text-slate-900 leading-[1.1] tracking-tight">
              Partagez vos fichiers avec une <span className="text-eneo-violet">simplicité</span> absolue.
            </motion.h1>
            
            <motion.p variants={fadeInUp} className="text-lg text-slate-500 font-medium leading-relaxed max-w-lg">
              Eneo File est la solution de stockage cloud ultra-rapide et sécurisée conçue pour l'efficacité. Stockez, partagez et gérez vos ressources en toute confiance.
            </motion.p>
            
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center gap-4">
              <button 
                onClick={handleStart}
                className="w-full sm:w-auto px-8 py-4 bg-eneo-violet text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-eneo-violet/30 hover:shadow-eneo-violet/50 hover:-translate-y-1 transition-all flex items-center justify-center space-x-3"
              >
                <span>Commencer gratuitement</span>
                <ArrowRight size={18} />
              </button>
              <div className="flex -space-x-2 italic text-[11px] text-slate-400 font-bold ml-2">
                 <span>Utilisé par +500 professionnels</span>
              </div>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-eneo-gradient blur-[80px] opacity-20 rounded-full" />
            <div className="relative bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden p-2">
               <img 
                 src="/assets/showcase-storage.png" 
                 alt="Interface Eneo File" 
                 className="rounded-[2rem] shadow-sm w-full h-auto"
               />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust & Segments */}
      <section className="py-20 bg-slate-50/50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">Une plateforme pour tous vos besoins</h2>
            <p className="text-slate-500 font-medium italic text-sm">Conçue pour s'adapter à votre flux de travail quotidien.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <Briefcase size={28} />, title: "Entreprises", desc: " Centralisez vos ressources et collaborez sans friction avec vos équipes." },
              { icon: <Users size={28} />, title: "Freelances", desc: "Envoyez vos livrables proprement à vos clients avec des liens sécurisés." },
              { icon: <Globe size={28} />, title: "Grand Public", desc: "Le moyen le plus simple de sauvegarder et partager vos moments importants." }
            ].map((segment, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all space-y-4"
              >
                <div className="bg-violet-50 w-16 h-16 rounded-2xl flex items-center justify-center text-eneo-violet">
                   {segment.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-800">{segment.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">{segment.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto space-y-32">
          {/* Feature 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
             <div className="order-2 lg:order-1 relative">
                <div className="absolute -inset-4 bg-slate-100 rounded-[3rem] -z-10 rotate-2" />
                <img 
                  src="/assets/showcase-files.png" 
                  alt="Gestion des fichiers" 
                  className="rounded-[2.5rem] shadow-2xl w-full border border-slate-100"
                />
             </div>
             <div className="order-1 lg:order-2 space-y-6">
                <div className="bg-eneo-gold/20 w-12 h-12 rounded-xl flex items-center justify-center text-eneo-gold">
                   <Smartphone size={24} />
                </div>
                <h3 className="text-4xl font-black text-slate-800 tracking-tight leading-tight">Accédez à vos fichiers, <br/> n'importe où.</h3>
                <p className="text-slate-500 font-medium leading-relaxed">Une interface web responsive et moderne. Ne perdez plus jamais une seconde à chercher vos documents importants.</p>
                <ul className="space-y-4 pt-4">
                   {[
                     "Interface simplifiée par glisser-déposer",
                     "Prévisualisation instantanée",
                     "Gestion intelligente des dossiers"
                   ].map((item, i) => (
                     <li key={i} className="flex items-center space-x-3 text-sm font-bold text-slate-600">
                        <CheckCircle2 size={18} className="text-emerald-500" />
                        <span>{item}</span>
                     </li>
                   ))}
                </ul>
             </div>
          </div>

          {/* Feature 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
             <div className="space-y-6">
                <div className="bg-rose-50 w-12 h-12 rounded-xl flex items-center justify-center text-rose-500">
                   <Lock size={24} />
                </div>
                <h3 className="text-4xl font-black text-slate-800 tracking-tight leading-tight">Sécurité sans <br/> compromis.</h3>
                <p className="text-slate-500 font-medium leading-relaxed">Vos liens sont uniques et protégés. Définissez des dates d'expiration automatiques (3 à 5 jours) pour garantir la confidentialité de vos données.</p>
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 mt-8">
                   <img 
                      src="/assets/showcase-detail.png" 
                      alt="Partage sécurisé" 
                      className="rounded-2xl shadow-sm border border-slate-100"
                   />
                </div>
             </div>
             <div className="mt-8 lg:mt-0">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
                       <Clock className="text-eneo-violet" />
                       <h4 className="font-black text-sm uppercase tracking-wider">Auto-suppression</h4>
                       <p className="text-xs text-slate-400 font-medium">Les fichiers expirent automatiquement pour votre sécurité.</p>
                    </div>
                    <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white space-y-4">
                       <Shield className="text-eneo-gold" />
                       <h4 className="font-black text-sm uppercase tracking-wider">Isolé</h4>
                       <p className="text-xs text-slate-400 font-medium">Authentification robuste gérée par Keycloak.</p>
                    </div>
                 </div>
                 <div className="mt-4">
                    <img 
                      src="/assets/showcase-dark.png" 
                      alt="Mode sombre" 
                      className="rounded-[2.5rem] shadow-2xl border border-white/10"
                    />
                 </div>
             </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6">
         <div className="max-w-4xl mx-auto bg-eneo-gradient rounded-[3rem] p-12 lg:p-20 text-center text-white relative overflow-hidden drive-shadow">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
            <div className="relative z-10 space-y-8">
               <h2 className="text-4xl lg:text-5xl font-black text-eneo-violet">Prêt à transformer votre gestion de fichiers ?</h2>
               <p className="text-slate-500 font-medium leading-relaxed">Rejoignez des centaines de professionnels qui font confiance à Eneo File pour leur quotidien.</p>
               <button 
                 onClick={handleStart}
                 className="px-12 py-5 bg-white text-eneo-violet rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl hover:bg-violet-50 hover:-translate-y-1 transition-all"
               >
                 Ouvrir mon compte gratuit
               </button>
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-100">
         <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-2 grayscale opacity-50">
              <Cloud className="text-slate-900 w-5 h-5" />
              <span className="text-sm font-black text-slate-800 tracking-tight italic">Eneo File</span>
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">© 2026 Eneo Group • All rights reserved</p>
         </div>
      </footer>
    </div>
  );
};

export default LandingPage;
