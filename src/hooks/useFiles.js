import { useState, useCallback } from 'react';
import api from '../api/client';

export const useFiles = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/files/');
      // Handle potential pagination
      const data = response.data.results !== undefined ? response.data.results : response.data;
      setFiles(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError("Impossible de charger les fichiers.");
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadFile = async (fileObj, title) => {
    setError(null);
    setUploadProgress(0);
    
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
    } catch (err) {
      setError("Erreur lors de la suppression.");
    }
  };

  return {
    files,
    loading,
    error,
    uploadProgress,
    fetchFiles,
    uploadFile,
    deleteFile,
    setError
  };
};
