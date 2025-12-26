import { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Radio, Smile, Frown, Zap, Moon } from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { TrackGrid } from '../components/TrackGrid';

const API_URL = 'https://sonicdiscoveryupdate.onrender.com';

interface Track {
    id: string;
    name: string;
    artists: string[];
    image_url: string;
    external_url: string;
}

export function MoodTuner() {
    const [valence, setValence] = useState(0.5);
    const [energy, setEnergy] = useState(0.5);
    const [tracks, setTracks] = useState<Track[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasTuned, setHasTuned] = useState(false);

    const tuneIn = async () => {
        setLoading(true);
        const token = localStorage.getItem('spotify_token');

        try {
            const res = await axios.get(`${API_URL}/features/mood`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { valence, energy }
            });
            setTracks(res.data);
            setHasTuned(true);
        } catch (err) {
            console.error('Failed to tune mood:', err);
        } finally {
            setLoading(false);
        }
    };

    const getMoodEmoji = () => {
        if (valence > 0.7 && energy > 0.7) return '🔥';
        if (valence > 0.7 && energy < 0.3) return '😌';
        if (valence < 0.3 && energy > 0.7) return '😤';
        if (valence < 0.3 && energy < 0.3) return '😢';
        return '🎵';
    };

    const getMoodLabel = () => {
        if (valence > 0.7 && energy > 0.7) return 'Euphoric';
        if (valence > 0.7 && energy < 0.3) return 'Peaceful';
        if (valence < 0.3 && energy > 0.7) return 'Intense';
        if (valence < 0.3 && energy < 0.3) return 'Melancholic';
        return 'Balanced';
    };

    return (
        <div className="min-h-screen bg-black text-white flex">
            <Sidebar />

            <main className="flex-1 ml-64 p-8">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative mb-12 p-8 rounded-3xl bg-gradient-to-br from-purple-500/20 via-pink-500/10 to-transparent border border-purple-500/10 overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <Radio className="text-purple-400" size={32} />
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                Mood Tuner
                            </h1>
                        </div>
                        <p className="text-gray-400 text-lg max-w-xl mb-8">
                            Fine-tune your music to match exactly how you're feeling.
                            Adjust the sliders to find your perfect vibe.
                        </p>

                        {/* Mood Indicator */}
                        <div className="flex items-center gap-4 mb-8">
                            <span className="text-6xl">{getMoodEmoji()}</span>
                            <div>
                                <span className="text-2xl font-bold text-white">{getMoodLabel()}</span>
                                <p className="text-gray-400 text-sm">Current Mood Setting</p>
                            </div>
                        </div>

                        {/* Sliders */}
                        <div className="grid md:grid-cols-2 gap-8 mb-8">
                            {/* Valence Slider */}
                            <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                                <div className="flex justify-between items-center mb-4">
                                    <div className="flex items-center gap-2">
                                        <Frown className="text-blue-400" size={20} />
                                        <span className="text-gray-400">Sad</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-400">Happy</span>
                                        <Smile className="text-yellow-400" size={20} />
                                    </div>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.01"
                                    value={valence}
                                    onChange={(e) => setValence(parseFloat(e.target.value))}
                                    className="w-full h-3 bg-gradient-to-r from-blue-500 to-yellow-500 rounded-full appearance-none cursor-pointer slider-thumb"
                                />
                                <div className="text-center mt-2 text-sm text-gray-500">
                                    {Math.round(valence * 100)}%
                                </div>
                            </div>

                            {/* Energy Slider */}
                            <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                                <div className="flex justify-between items-center mb-4">
                                    <div className="flex items-center gap-2">
                                        <Moon className="text-indigo-400" size={20} />
                                        <span className="text-gray-400">Chill</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-400">Hype</span>
                                        <Zap className="text-orange-400" size={20} />
                                    </div>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.01"
                                    value={energy}
                                    onChange={(e) => setEnergy(parseFloat(e.target.value))}
                                    className="w-full h-3 bg-gradient-to-r from-indigo-500 to-orange-500 rounded-full appearance-none cursor-pointer slider-thumb"
                                />
                                <div className="text-center mt-2 text-sm text-gray-500">
                                    {Math.round(energy * 100)}%
                                </div>
                            </div>
                        </div>

                        <motion.button
                            onClick={tuneIn}
                            disabled={loading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center gap-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-bold py-4 px-8 rounded-full transition-all disabled:opacity-50 shadow-lg"
                        >
                            <Radio size={20} />
                            {loading ? 'Tuning...' : 'Tune In'}
                        </motion.button>
                    </div>
                </motion.div>

                {/* Results */}
                {hasTuned && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h2 className="text-2xl font-bold mb-6">Your {getMoodLabel()} Mix</h2>
                        <TrackGrid tracks={tracks} loading={loading} />
                    </motion.div>
                )}
            </main>
        </div>
    );
}
