import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8501';

export function Callback() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const called = useRef(false);

    useEffect(() => {
        const code = searchParams.get('code');
        if (code && !called.current) {
            called.current = true;
            axios.get(`${API_URL}/callback?code=${code}`, { withCredentials: true })
                .then(() => {
                    navigate('/dashboard');
                })
                .catch(err => {
                    console.error(err);
                    navigate('/');
                });
        }
    }, [searchParams, navigate]);

    return (
        <div className="h-screen bg-black flex items-center justify-center text-green-500 font-bold text-2xl animate-pulse">
            Authenticating with Spotify...
        </div>
    );
}
