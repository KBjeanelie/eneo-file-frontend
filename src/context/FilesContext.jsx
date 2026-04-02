import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import api from '../api/client';

const FilesContext = createContext();

export const FilesProvider = ({ children }) => {
  const [files, setFiles] = useState([]);
  const [recentFiles, setRecentFiles] = useState([]);
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
      // Add timestamp to bypass any browser/proxy cache for real-time sync
      const response = await api.get(`/files/?_t=${Date.now()}`);
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

  const fetchRecentFiles = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/files/recent/');
      setRecentFiles(response.data);
    } catch (err) {
      console.error("Recent files fetch error", err);
    } finally {
      setLoading(false);
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
          if (progressEvent.total) { 
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
          } else {
            // Fallback progress simulation if total is unknown
            setUploadProgress(prev => Math.min(prev + 5, 95));
          }
        }
      });
      fetchFiles();
      fetchRecentFiles();
      fetchQuota();
      return response.data;
    } catch (err) {
      setUploadProgress(0);
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
      const msg = "Erreur de régénération de la clé.";
      setError(msg);
      throw new Error(msg);
    }
  };

  // Single polling interval
  useEffect(() => {
    let interval;
    if (polling) {
      // Initial fetch when polling starts
      fetchFiles(true);
      fetchQuota();

      interval = setInterval(() => {
        if (!loading && !isRefreshing) {
          fetchFiles(true);
          fetchRecentFiles();
          fetchQuota();
        }
      }, 5000); // 5s is safer for server load while maintaining sync feel
    }
    return () => clearInterval(interval);
  }, [polling, fetchFiles, fetchQuota]);

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
    files, recentFiles, loading, isRefreshing, error, uploadProgress, quota,
    fetchFiles, fetchRecentFiles, fetchQuota, uploadFile, deleteFile,
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
