import { useState, useEffect } from 'react';
import axios from 'axios';

// Inline User type to avoid import issues
interface User {
    display_name: string;
    images: { url: string }[];
    id: string;
}

const API_URL = 'https://sonicdiscoveryupdate.onrender.com';

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            // Check for token in URL (from callback redirect)
            const params = new URLSearchParams(window.location.search);
            const urlToken = params.get('token');

            let token = urlToken || localStorage.getItem('spotify_token');

            if (urlToken) {
                console.log('useAuth: Token found in URL, saving to localStorage');
                localStorage.setItem('spotify_token', urlToken);
                // Clear URL
                window.history.replaceState({}, document.title, window.location.pathname);
            }

            if (!token) {
                console.log('useAuth: No token found');
                setLoading(false);
                return;
            }

            try {
                // Set Header for all requests
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                console.log('useAuth: Fetching user profile...');
                const res = await axios.get(`${API_URL}/me`);
                console.log('useAuth: User found', res.data);
                setUser(res.data);
            } catch (error: any) {
                console.error("useAuth: Error validating token", error);
                localStorage.removeItem('spotify_token'); // Clear invalid token
                setUser(null);

                // If 401 (token expired), redirect to login
                if (error.response?.status === 401) {
                    console.log('useAuth: Token expired, redirecting to login...');
                    window.location.href = `${API_URL}/login`;
                }
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    const login = () => {
        window.location.href = `${API_URL}/login`;
    };

    const logout = async () => {
        try {
            await axios.post(`${API_URL}/logout`);
            setUser(null);
            window.location.href = '/';
        } catch (e) {
            console.error("Logout failed", e);
        }
    };

    return { user, loading, login, logout };
}
