import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { initKeycloak } from './auth/keycloak';

const root = ReactDOM.createRoot(document.getElementById('root'));

// Render initial loading state
root.render(
  <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-50 space-y-4">
    <div className="w-12 h-12 border-4 border-eneo-violet border-t-transparent rounded-full animate-spin"></div>
    <p className="text-eneo-violet font-bold animate-pulse uppercase tracking-[0.2em] text-xs">Authentification...</p>
  </div>
);

// Initialize Keycloak before starting the app
initKeycloak().then((authenticated) => {
  if (!authenticated) {
    window.location.href = '#'; // Let keycloak.init handle redirect based on check-sso
    // If not authenticated, we could trigger login, but init check-sso + ProtectedRoute is better
    if (!window.location.pathname.startsWith('/d/') && window.location.pathname !== '/') {
        import('./auth/keycloak').then(m => m.login());
    } else {
        root.render(<App />);
    }
  } else {
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  }
}).catch((err) => {
  console.error("Keycloak Init Error", err);
  // Fallback for public pages even if init fails (but usually it shouldn't)
  if (window.location.pathname.startsWith('/d/')) {
      root.render(<App />);
  } else {
      root.render(<div className="p-10 text-red-600">Erreur de connexion SSO. Veuillez contacter l'admin.</div>);
  }
});

// Register Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('SW registered'))
      .catch(err => console.log('SW error', err));
  });
}
