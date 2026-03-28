import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import api from '../api/client';

const FilesContext = createContext();

export const FilesProvider = ({ children }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [quota, setQuota] = useState({ used_bytes: 0, total_bytes: 0 });
  const [polling, setPolling] = useState(false);

  const fetchFiles = useCallback(async (isBackground = false) => {
    if (isBackground) {
      setIsRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const response = await api.get('/files/');
      const data = response.data.results !== undefined ? response.data.results : response.data;
      setFiles(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      if (!isBackground) setError("Impossible de charger les fichiers.");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  const fetchQuota = useCallback(async () => {
    try {
      const response = await api.get('/files/quota/');
      setQuota(response.data);
    } catch (err) {
      console.error("Quota fetch error", err);
    }
  }, []);

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    setUploadProgress(0);
    
    try {
      const response = await api.post('/files/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });
      fetchFiles();
      fetchQuota();
      return response.data;
    } catch (err) {
      const msg = err.response?.data?.error || "Échec de l'upload.";
      throw new Error(msg);
    }
  };

  const deleteFile = async (id) => {
    try {
      await api.delete(`/files/${id}/`);
      setFiles(prev => prev.filter(f => f.id !== id));
      fetchQuota();
    } catch (err) {
      setError("Erreur lors de la suppression.");
    }
  };

  const regenerateSecretKey = async (id) => {
    try {
      const response = await api.post(`/files/${id}/regenerate_secret_key/`);
      fetchFiles();
      return response.data.secret_key;
    } catch (err) {
      setError("Erreur de régénération de la clé.");
    }
  };

  // Single polling interval
  useEffect(() => {
    let interval;
    if (polling) {
      interval = setInterval(() => {
        if (!loading && !isRefreshing) {
          fetchFiles(true);
        }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [polling, fetchFiles]);

  const validateSecretKey = async (accessToken, secretKey) => {
    try {
      const response = await api.post(`/d/${accessToken}/download/`, { secret_key: secretKey });
      return response.data.download_url;
    } catch (err) {
      const msg = err.response?.data?.error || "Clé invalide.";
      throw new Error(msg);
    }
  };

  const value = {
    files, loading, isRefreshing, error, uploadProgress, quota,
    fetchFiles, fetchQuota, uploadFile, deleteFile,
    regenerateSecretKey, validateSecretKey, setError,
    startPolling: () => setPolling(true),
    stopPolling: () => setPolling(false)
  };

  return <FilesContext.Provider value={value}>{children}</FilesContext.Provider>;
};

export const useFiles = () => {
  const context = useContext(FilesContext);
  if (!context) {
    throw new Error('useFiles must be used within a FilesProvider');
  }
  return context;
};
