import { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Users, Shuffle, Sparkles } from 'lucide-react';
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

export function AlternateYou() {
    const [tracks, setTracks] = useState<Track[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasSimulated, setHasSimulated] = useState(false);

    const simulate = async () => {
        setLoading(true);
        const token = localStorage.getItem('spotify_token');

        try {
            const res = await axios.get(`${API_URL}/features/alternate`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTracks(res.data);
            setHasSimulated(true);
        } catch (err) {
            console.error('Failed to simulate alternate you:', err);
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
                    className="relative mb-12 p-8 rounded-3xl bg-gradient-to-br from-violet-900/30 via-fuchsia-900/20 to-rose-900/30 border border-white/10 overflow-hidden"
                >
                    {/* Animated background elements */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 animate-pulse" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-fuchsia-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 animate-pulse" style={{ animationDelay: '1s' }} />

                    {/* Mirror effect decoration */}
                    <div className="absolute top-10 right-10 opacity-20">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="w-40 h-40 border border-white/30 rounded-full"
                        />
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-4xl">🪞</span>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-400 via-fuchsia-400 to-rose-400 bg-clip-text text-transparent">
                                Alternate You
                            </h1>
                        </div>
                        <p className="text-gray-400 text-lg max-w-xl mb-8">
                            What if you grew up listening to completely different music?
                            Meet the version of yourself from a parallel universe.
                        </p>

                        {/* Concept Illustration */}
                        <div className="flex items-center gap-8 mb-10">
                            {/* Current You */}
                            <motion.div
                                className="text-center"
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-spotify to-green-600 flex items-center justify-center mb-3 shadow-lg shadow-spotify/30">
                                    <Users size={40} className="text-black" />
                                </div>
                                <span className="text-sm font-medium text-gray-300">Current You</span>
                                <p className="text-xs text-gray-500">Your usual taste</p>
                            </motion.div>

                            {/* Arrow */}
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.4 }}
                                className="flex flex-col items-center"
                            >
                                <Shuffle className="text-fuchsia-400 mb-2" size={32} />
                                <span className="text-xs text-gray-500">Parallel Universe</span>
                            </motion.div>

                            {/* Alternate You */}
                            <motion.div
                                className="text-center"
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.6 }}
                            >
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-500 via-fuchsia-500 to-rose-500 flex items-center justify-center mb-3 shadow-lg shadow-fuchsia-500/30 relative">
                                    <Users size={40} className="text-white" />
                                    <Sparkles className="absolute -top-1 -right-1 text-yellow-400" size={20} />
                                </div>
                                <span className="text-sm font-medium text-gray-300">Alternate You</span>
                                <p className="text-xs text-gray-500">Unexplored genres</p>
                            </motion.div>
                        </div>

                        {/* Features */}
                        <div className="grid grid-cols-3 gap-4 mb-10">
                            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                                <span className="text-2xl mb-2 block">🎲</span>
                                <h4 className="font-semibold text-sm">Opposite Genres</h4>
                                <p className="text-xs text-gray-400">Genres you never explore</p>
                            </div>
                            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                                <span className="text-2xl mb-2 block">💎</span>
                                <h4 className="font-semibold text-sm">Hidden Gems</h4>
                                <p className="text-xs text-gray-400">Low popularity treasures</p>
                            </div>
                            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                                <span className="text-2xl mb-2 block">🌌</span>
                                <h4 className="font-semibold text-sm">New Horizons</h4>
                                <p className="text-xs text-gray-400">Expand your taste</p>
                            </div>
                        </div>

                        <motion.button
                            onClick={simulate}
                            disabled={loading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center gap-3 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-rose-500 text-white font-bold py-4 px-8 rounded-full transition-all disabled:opacity-50 shadow-lg shadow-fuchsia-500/25"
                        >
                            {loading ? (
                                <Shuffle className="animate-spin" size={20} />
                            ) : (
                                <Sparkles size={20} />
                            )}
                            {loading ? 'Simulating Parallel Universe...' : 'Simulate Alternate Self'}
                        </motion.button>
                    </div>
                </motion.div>

                {/* Results */}
                {hasSimulated && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h2 className="text-2xl font-bold mb-2">🪞 Your Alternate Self's Playlist</h2>
                        <p className="text-gray-400 mb-6">Music from genres you don't usually explore</p>
                        <TrackGrid tracks={tracks} loading={loading} />
                    </motion.div>
                )}
            </main>
        </div>
    );
}
