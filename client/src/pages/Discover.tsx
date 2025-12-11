import { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Sparkles, RefreshCw } from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { TrackGrid } from '../components/TrackGrid';

const API_URL = 'http://127.0.0.1:8501';

interface Track {
    id: string;
    name: string;
    artists: string[];
    image_url: string;
    external_url: string;
}

export function Discover() {
    const [tracks, setTracks] = useState<Track[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasGenerated, setHasGenerated] = useState(false);

    const generateRecommendations = async () => {
        setLoading(true);
        const token = localStorage.getItem('spotify_token');

        try {
            const res = await axios.get(`${API_URL}/features/discover`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTracks(res.data);
            setHasGenerated(true);
        } catch (err) {
            console.error('Failed to get recommendations:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex">
            <Sidebar />

            <main className="flex-1 ml-64 p-8">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative mb-12 p-8 rounded-3xl bg-gradient-to-br from-spotify/20 via-spotify/5 to-transparent border border-spotify/10 overflow-hidden"
                >
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-spotify/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <Sparkles className="text-spotify" size={32} />
                            <h1 className="text-4xl font-bold">Discover</h1>
                        </div>
                        <p className="text-gray-400 text-lg max-w-xl mb-6">
                            Get personalized music recommendations based on your listening history.
                            Our AI analyzes your taste to find hidden gems you'll love.
                        </p>

                        <motion.button
                            onClick={generateRecommendations}
                            disabled={loading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center gap-3 bg-spotify hover:bg-spotify-light text-black font-bold py-4 px-8 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-spotify/25"
                        >
                            {loading ? (
                                <RefreshCw className="animate-spin" size={20} />
                            ) : (
                                <Sparkles size={20} />
                            )}
                            {loading ? 'Analyzing your taste...' : hasGenerated ? 'Regenerate' : 'Generate Recommendations'}
                        </motion.button>
                    </div>
                </motion.div>

                {/* Results */}
                {hasGenerated && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h2 className="text-2xl font-bold mb-6">Your Personalized Picks</h2>
                        <TrackGrid tracks={tracks} loading={loading} emptyMessage="No recommendations found. Try again!" />
                    </motion.div>
                )}

                {!hasGenerated && !loading && (
                    <div className="text-center py-20 text-gray-500">
                        <Sparkles size={48} className="mx-auto mb-4 opacity-30" />
                        <p className="text-lg">Click generate to discover new music tailored for you</p>
                    </div>
                )}
            </main>
        </div>
    );
}
