import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import keycloak from '../auth/keycloak';

const LoginCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (keycloak.authenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-50 space-y-4">
      <div className="w-12 h-12 border-4 border-eneo-violet border-t-transparent rounded-full animate-spin"></div>
      <p className="text-eneo-violet font-bold animate-pulse uppercase tracking-wider">Redirection...</p>
    </div>
  );
};

export default LoginCallback;
