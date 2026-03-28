import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import LoginCallback from './pages/Callback';
import DownloadPage from './pages/Download';
import FileDetailPage from './pages/FileDetail';
import RecentFiles from './pages/RecentFiles';
import StorageSpace from './pages/StorageSpace';
import HelpCenter from './pages/HelpCenter';
import HowItWorks from './pages/help/HowItWorks';
import Security from './pages/help/Security';
import PrivacyPolicy from './pages/help/PrivacyPolicy';
import Settings from './pages/Settings';
import LandingPage from './pages/LandingPage';
import Layout from './components/layout/Layout';
import keycloak from './auth/keycloak';
import { useSettings } from './hooks/useSettings';

import { FilesProvider } from './context/FilesContext';

const ProtectedRoute = ({ children }) => {
  if (!keycloak.authenticated) {
    return <div className="flex h-screen items-center justify-center">Authentification requise...</div>;
  }
  return children;
};

function App() {
  const { settings, loading } = useSettings();

  if (!loading && settings.dark_mode) {
    document.documentElement.classList.add('dark');
  }

  return (
    <FilesProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/d/:access_token" element={<DownloadPage />} />
          <Route path="/callback" element={<LoginCallback />} />
          
          {/* Private Routes with Shared Layout */}
          <Route element={<ProtectedRoute children={<Layout />} />}>
             <Route path="/dashboard" element={<Dashboard />} />
             <Route path="/files/:id" element={<FileDetailPage />} />
             <Route path="/recent" element={<RecentFiles />} />
             <Route path="/storage" element={<StorageSpace />} />
             <Route path="/help" element={<HelpCenter />} />
             <Route path="/help/how-it-works" element={<HowItWorks />} />
             <Route path="/help/security" element={<Security />} />
             <Route path="/help/privacy" element={<PrivacyPolicy />} />
             <Route path="/settings" element={<Settings />} />
          </Route>

          {/* Redirects */}
          <Route path="*" element={
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
              <h1 className="text-6xl font-black text-eneo-violet mb-4">404</h1>
              <p className="text-xl text-slate-600 mb-8">Page introuvable</p>
              <a href="/" className="px-6 py-3 bg-eneo-violet text-white font-bold rounded-xl shadow-lg hover:bg-violet-800 transition">
                Retour à l'accueil
              </a>
            </div>
          } />
        </Routes>
      </Router>
    </FilesProvider>
  );
}

export default App;
