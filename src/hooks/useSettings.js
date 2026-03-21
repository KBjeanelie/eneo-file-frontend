import { useState, useEffect } from 'react';
import api from '../api/client';

export const useSettings = () => {
    const [settings, setSettings] = useState({
        default_max_downloads: 3,
        default_expiration_days: 7,
        dark_mode: false,
        email_notifications: true,
        language: 'fr'
    });
    const [loading, setLoading] = useState(true);

    const fetchSettings = async () => {
        try {
            const resp = await api.get('/preferences/current/');
            setSettings(resp.data);
            applyTheme(resp.data.dark_mode);
        } catch (err) {
            console.error("Error fetching settings:", err);
        } finally {
            setLoading(false);
        }
    };

    const updateSettings = async (newSettings) => {
        try {
            const resp = await api.patch('/preferences/current/', newSettings);
            setSettings(resp.data);
            if (newSettings.dark_mode !== undefined) {
                applyTheme(resp.data.dark_mode);
            }
            return resp.data;
        } catch (err) {
            console.error("Error updating settings:", err);
            throw err;
        }
    };

    const applyTheme = (isDark) => {
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    return { settings, loading, updateSettings, fetchSettings };
};
