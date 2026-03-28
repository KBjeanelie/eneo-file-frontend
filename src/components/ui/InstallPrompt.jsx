import React, { useState, useEffect } from 'react';
import { Download, X, Share, PlusSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const InstallPrompt = () => {
  const [show, setShow] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [platform, setPlatform] = useState('other');

  useEffect(() => {
    // Detect platform
    const ua = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;

    if (isStandalone) return;

    if (isIOS) {
      setPlatform('ios');
      // Show prompt after 3 seconds on mobile
      const timer = setTimeout(() => setShow(true), 3000);
      return () => clearTimeout(timer);
    }

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setPlatform('android'); // Also used for desktop chrome
      // Show after 3 seconds
      setTimeout(() => setShow(true), 3000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShow(false);
    }
    setDeferredPrompt(null);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-6 right-6 z-[100] md:left-auto md:w-96"
        >
          <div className="bg-slate-900 text-white p-5 rounded-3xl shadow-2xl border border-white/10 backdrop-blur-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-eneo-violet/20 rounded-full blur-3xl -mr-16 -mt-16" />
            
            <button 
              onClick={() => setShow(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>

            <div className="flex items-start space-x-4 relative z-10">
              <div className="p-3 bg-eneo-violet rounded-2xl shadow-lg shadow-eneo-violet/30">
                <Download size={24} className="text-white" />
              </div>
              <div className="flex-1 space-y-1">
                <h3 className="font-bold text-base">Installer Eneo File</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Ajoutez l'application à votre écran d'accueil pour un accès rapide et une expérience fluide.
                </p>
              </div>
            </div>

            <div className="mt-5 relative z-10">
              {platform === 'ios' ? (
                <div className="bg-white/5 rounded-2xl p-4 space-y-3 border border-white/5">
                  <p className="text-[10px] text-slate-300 flex items-center gap-2">
                    1. Appuyez sur le bouton <Share size={14} className="text-blue-400" /> dans la barre de navigation.
                  </p>
                  <p className="text-[10px] text-slate-300 flex items-center gap-2">
                    2. Faites défiler et appuyez sur <PlusSquare size={14} /> "Sur l'écran d'accueil".
                  </p>
                </div>
              ) : (
                <button
                  onClick={handleInstallClick}
                  className="w-full py-3 bg-white text-slate-900 font-bold rounded-2xl text-sm shadow-lg hover:bg-slate-100 transition-all flex items-center justify-center space-x-2"
                >
                  <span>Installer maintenant</span>
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InstallPrompt;
