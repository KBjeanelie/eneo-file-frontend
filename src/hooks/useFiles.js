import { useState, useCallback, useEffect } from 'react';
import api from '../api/client';

export const useFiles = () => {
  const [files, setFiles] = useState([]);
  const [recentFiles, setRecentFiles] = useState([]);
  const [quota, setQuota] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [polling, setPolling] = useState(false);

  const startPolling = useCallback(() => setPolling(true), []);
  const stopPolling = useCallback(() => setPolling(false), []);

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/files/');
      const data = response.data.results !== undefined ? response.data.results : response.data;
      setFiles(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError("Impossible de charger les fichiers.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Real-time synchronization: Poll every 3 seconds if not already loading
  useEffect(() => {
    let interval;
    if (polling) {
      interval = setInterval(() => {
        if (!loading) {
          fetchFiles();
        }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [polling, fetchFiles, loading]);

  const fetchRecentFiles = useCallback(async () => {
    try {
      const response = await api.get('/files/recent/');
      setRecentFiles(response.data);
    } catch (err) {
      console.error("Erreur lors de la récupération des fichiers récents", err);
    }
  }, []);

  const fetchQuota = useCallback(async () => {
    try {
      const response = await api.get('/files/quota/');
      setQuota(response.data);
    } catch (err) {
      console.error("Erreur lors de la récupération du quota", err);
    }
  }, []);

  const uploadFile = async (fileObj, title) => {
    setError(null);
    setUploadProgress(0);
    
    const maxSize = 250 * 1024 * 1024;
    if (fileObj.size > maxSize) {
      setError(`Le fichier est trop volumineux (${(fileObj.size / (1024 * 1024)).toFixed(2)} Mo). La limite est de 250 Mo.`);
      return;
    }

    const formData = new FormData();
    formData.append('file', fileObj);
    if (title) formData.append('title', title);

    try {
      const response = await api.post('/files/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });
      setFiles(prev => [response.data, ...prev]);
      // Update quota after upload
      fetchQuota();
      return response.data;
    } catch (err) {
      const msg = err.response?.data?.error || "Erreur lors de l'upload.";
      setError(msg);
      throw err;
    } finally {
      setUploadProgress(0);
    }
  };

  const deleteFile = async (id) => {
    try {
      await api.delete(`/files/${id}/`);
      setFiles(prev => prev.filter(f => f.id !== id));
      // Update quota after delete
      fetchQuota();
    } catch (err) {
      setError("Erreur lors de la suppression.");
    }
  };

  const regenerateSecretKey = async (id) => {
    try {
      const response = await api.post(`/files/${id}/regenerate_secret_key/`);
      setFiles(prev => prev.map(f => f.id === id ? { ...f, secret_key: response.data.secret_key } : f));
      return response.data.secret_key;
    } catch (err) {
      setError("Erreur lors de la régénération de la clé.");
      throw err;
    }
  };

  const validateSecretKey = async (accessToken, secretKey) => {
    try {
      const response = await api.post(`/d/${accessToken}/download/`, { secret_key: secretKey });
      return response.data.download_url;
    } catch (err) {
      const msg = err.response?.data?.error || "Clé invalide.";
      throw new Error(msg);
    }
  };

  return {
    files,
    recentFiles,
    quota,
    loading,
    error,
    uploadProgress,
    polling,
    fetchFiles,
    fetchRecentFiles,
    fetchQuota,
    uploadFile,
    deleteFile,
    regenerateSecretKey,
    validateSecretKey,
    startPolling,
    stopPolling,
    setError
  };
};
