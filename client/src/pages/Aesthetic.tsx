import { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Palette } from 'lucide-react';
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

const aesthetics = [
    {
        name: "Vaporwave",
        emoji: "🌴",
        gradient: "from-pink-500 via-purple-500 to-cyan-500",
        bgClass: "bg-gradient-to-br from-pink-900/30 via-purple-900/20 to-cyan-900/30",
        description: "80s nostalgia, neon grids, Japanese city pop",
        keywords: ["synthwave", "retro", "aesthetic"]
    },
    {
        name: "Dark Academia",
        emoji: "📚",
        gradient: "from-amber-700 via-stone-600 to-neutral-800",
        bgClass: "bg-gradient-to-br from-amber-900/30 via-stone-800/20 to-neutral-900/30",
        description: "Classical music, poetry reading vibes, Oxford libraries",
        keywords: ["classical", "piano", "study"]
    },
    {
        name: "Cyberpunk",
        emoji: "🤖",
        gradient: "from-yellow-500 via-red-500 to-pink-600",
        bgClass: "bg-gradient-to-br from-yellow-900/30 via-red-900/20 to-pink-900/30",
        description: "Industrial beats, dystopian soundscapes, high-energy",
        keywords: ["industrial", "techno", "electronic"]
    },
    {
        name: "Cottagecore",
        emoji: "🌻",
        gradient: "from-green-400 via-yellow-300 to-amber-400",
        bgClass: "bg-gradient-to-br from-green-900/30 via-yellow-900/20 to-amber-900/30",
        description: "Folk music, acoustic guitars, pastoral tranquility",
        keywords: ["folk", "acoustic", "indie"]
    },
    {
        name: "Neo-Noir",
        emoji: "🎷",
        gradient: "from-gray-500 via-slate-600 to-neutral-800",
        bgClass: "bg-gradient-to-br from-gray-900/40 via-slate-900/30 to-neutral-900/40",
        description: "Jazz clubs, smoky bars, detective stories",
        keywords: ["jazz", "noir", "ambient"]
    },
];

export function Aesthetic() {
    const [selectedAesthetic, setSelectedAesthetic] = useState(aesthetics[0]);
    const [tracks, setTracks] = useState<Track[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasGenerated, setHasGenerated] = useState(false);

    const generate = async () => {
        setLoading(true);
        const token = localStorage.getItem('spotify_token');

        try {
            const res = await axios.get(`${API_URL}/features/aesthetic`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { style: selectedAesthetic.name }
            });
            setTracks(res.data);
            setHasGenerated(true);
        } catch (err) {
            console.error('Failed to generate aesthetic:', err);
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
                    className={`relative mb-12 p-8 rounded-3xl ${selectedAesthetic.bgClass} border border-white/10 overflow-hidden transition-all duration-500`}
                >
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-4xl">🎨</span>
                            <h1 className={`text-4xl font-bold bg-gradient-to-r ${selectedAesthetic.gradient} bg-clip-text text-transparent`}>
                                Aesthetic Generator
                            </h1>
                        </div>
                        <p className="text-gray-400 text-lg max-w-xl mb-8">
                            Curate your music based on internet aesthetics. Choose your vibe and let us create the perfect soundtrack.
                        </p>

                        {/* Aesthetic Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                            {aesthetics.map(aes => (
                                <motion.button
                                    key={aes.name}
                                    onClick={() => setSelectedAesthetic(aes)}
                                    whileHover={{ scale: 1.05, y: -5 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`
                                        relative p-5 rounded-2xl text-left transition-all overflow-hidden
                                        ${selectedAesthetic.name === aes.name
                                            ? `bg-gradient-to-br ${aes.gradient} shadow-xl ring-2 ring-white/30`
                                            : 'bg-white/5 hover:bg-white/10 border border-white/10'}
                                    `}
                                >
                                    <span className="text-3xl block mb-2">{aes.emoji}</span>
                                    <span className={`font-bold block text-sm ${selectedAesthetic.name === aes.name ? 'text-white' : 'text-gray-300'
                                        }`}>
                                        {aes.name}
                                    </span>
                                </motion.button>
                            ))}
                        </div>

                        {/* Selected Aesthetic Details */}
                        <motion.div
                            key={selectedAesthetic.name}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-8 p-6 bg-white/5 rounded-2xl border border-white/10"
                        >
                            <div className="flex items-center gap-4 mb-3">
                                <span className="text-5xl">{selectedAesthetic.emoji}</span>
                                <div>
                                    <h3 className={`text-2xl font-bold bg-gradient-to-r ${selectedAesthetic.gradient} bg-clip-text text-transparent`}>
                                        {selectedAesthetic.name}
                                    </h3>
                                    <p className="text-gray-400">{selectedAesthetic.description}</p>
                                </div>
                            </div>
                            <div className="flex gap-2 mt-4">
                                {selectedAesthetic.keywords.map(kw => (
                                    <span key={kw} className="px-3 py-1 bg-white/10 rounded-full text-xs text-gray-300 uppercase tracking-wider">
                                        {kw}
                                    </span>
                                ))}
                            </div>
                        </motion.div>

                        <motion.button
                            onClick={generate}
                            disabled={loading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`flex items-center gap-3 bg-gradient-to-r ${selectedAesthetic.gradient} text-white font-bold py-4 px-8 rounded-full transition-all disabled:opacity-50 shadow-lg`}
                        >
                            <Palette size={20} className={loading ? 'animate-spin' : ''} />
                            {loading ? 'Generating...' : 'Generate Playlist'}
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
                        <h2 className="text-2xl font-bold mb-6">
                            {selectedAesthetic.emoji} {selectedAesthetic.name} Playlist
                        </h2>
                        <TrackGrid tracks={tracks} loading={loading} />
                    </motion.div>
                )}
            </main>
        </div>
    );
}
