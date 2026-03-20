import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import LoginCallback from './pages/Callback';
import DownloadPage from './pages/Download';
import FileDetailPage from './pages/FileDetail';
import keycloak from './auth/keycloak';

const ProtectedRoute = ({ children }) => {
  if (!keycloak.authenticated) {
    return <div className="flex h-screen items-center justify-center">Authentification requise...</div>;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/d/:access_token" element={<DownloadPage />} />
        <Route path="/callback" element={<LoginCallback />} />
        
        {/* Private Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/files/:id" element={
          <ProtectedRoute>
            <FileDetailPage />
          </ProtectedRoute>
        } />

        {/* Redirects */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
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
  );
}

export default App;
