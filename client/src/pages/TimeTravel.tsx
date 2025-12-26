import { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Clock, ChevronLeft, ChevronRight } from 'lucide-react';
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

const decades = [
    { year: 1960, label: "60s", color: "from-amber-500 to-orange-600", description: "Rock & Roll, Beatles, Soul" },
    { year: 1970, label: "70s", color: "from-orange-500 to-red-600", description: "Disco, Funk, Punk Rock" },
    { year: 1980, label: "80s", color: "from-pink-500 to-purple-600", description: "Synth Pop, New Wave, MTV Era" },
    { year: 1990, label: "90s", color: "from-purple-500 to-blue-600", description: "Grunge, Hip Hop, Britpop" },
    { year: 2000, label: "00s", color: "from-blue-500 to-cyan-600", description: "Pop Punk, R&B, Early EDM" },
    { year: 2010, label: "10s", color: "from-cyan-500 to-teal-600", description: "EDM, Streaming Era, Trap" },
];

export function TimeTravel() {
    const [selectedDecade, setSelectedDecade] = useState(3); // Start at 90s
    const [tracks, setTracks] = useState<Track[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasWarped, setHasWarped] = useState(false);

    const warp = async () => {
        setLoading(true);
        const token = localStorage.getItem('spotify_token');
        const decade = decades[selectedDecade];

        try {
            const res = await axios.get(`${API_URL}/features/time-travel`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { year: decade.year }
            });
            setTracks(res.data);
            setHasWarped(true);
        } catch (err) {
            console.error('Failed to time travel:', err);
        } finally {
            setLoading(false);
        }
    };

    const navigateDecade = (direction: 'left' | 'right') => {
        if (direction === 'left' && selectedDecade > 0) {
            setSelectedDecade(selectedDecade - 1);
        } else if (direction === 'right' && selectedDecade < decades.length - 1) {
            setSelectedDecade(selectedDecade + 1);
        }
    };

    const currentDecade = decades[selectedDecade];

    return (
        <div className="min-h-screen bg-black text-white flex">
            <Sidebar />

            <main className="flex-1 ml-64 p-8">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`relative mb-12 p-8 rounded-3xl bg-gradient-to-br ${currentDecade.color.replace('from-', 'from-').replace('to-', 'to-')}/20 border border-white/10 overflow-hidden`}
                    style={{
                        background: `linear-gradient(135deg, rgba(${selectedDecade * 30}, ${100 - selectedDecade * 10}, ${200 - selectedDecade * 20}, 0.2), transparent)`
                    }}
                >
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <Clock className="text-cyan-400" size={32} />
                            <h1 className="text-4xl font-bold">Time Travel</h1>
                        </div>
                        <p className="text-gray-400 text-lg max-w-xl mb-8">
                            Journey through the decades and rediscover the iconic sounds that defined each era.
                        </p>

                        {/* Decade Selector */}
                        <div className="flex items-center justify-center gap-4 mb-8">
                            <button
                                onClick={() => navigateDecade('left')}
                                disabled={selectedDecade === 0}
                                className="p-3 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronLeft size={24} />
                            </button>

                            <div className="flex gap-2">
                                {decades.map((decade, index) => (
                                    <motion.button
                                        key={decade.year}
                                        onClick={() => setSelectedDecade(index)}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        className={`
                                            px-6 py-4 rounded-2xl font-bold text-xl transition-all
                                            ${index === selectedDecade
                                                ? `bg-gradient-to-r ${decade.color} text-white shadow-xl scale-110`
                                                : 'bg-white/5 text-gray-400 hover:bg-white/10'}
                                        `}
                                    >
                                        {decade.label}
                                    </motion.button>
                                ))}
                            </div>

                            <button
                                onClick={() => navigateDecade('right')}
                                disabled={selectedDecade === decades.length - 1}
                                className="p-3 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronRight size={24} />
                            </button>
                        </div>

                        {/* Decade Description */}
                        <motion.div
                            key={selectedDecade}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center mb-8"
                        >
                            <h2 className={`text-6xl font-black bg-gradient-to-r ${currentDecade.color} bg-clip-text text-transparent mb-2`}>
                                {currentDecade.year}s
                            </h2>
                            <p className="text-gray-400">{currentDecade.description}</p>
                        </motion.div>

                        <div className="flex justify-center">
                            <motion.button
                                onClick={warp}
                                disabled={loading}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`flex items-center gap-3 bg-gradient-to-r ${currentDecade.color} text-white font-bold py-4 px-8 rounded-full transition-all disabled:opacity-50 shadow-lg`}
                            >
                                <Clock size={20} className={loading ? 'animate-spin' : ''} />
                                {loading ? 'Warping...' : `Warp to ${currentDecade.label}`}
                            </motion.button>
                        </div>
                    </div>
                </motion.div>

                {/* Results */}
                {hasWarped && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h2 className="text-2xl font-bold mb-6">Hits from the {currentDecade.label}</h2>
                        <TrackGrid tracks={tracks} loading={loading} />
                    </motion.div>
                )}
            </main>
        </div>
    );
}
